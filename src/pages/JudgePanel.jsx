import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { motion } from "framer-motion";
import "./JudgePanel.scss";

export default function JudgePanel() {
  const [participants, setParticipants] = useState([]);
  const [scores, setScores] = useState({});
  const [saved, setSaved] = useState({});
  const [judge, setJudge] = useState(null);

  const judgeId = auth.currentUser?.uid;

  // 🔥 GET JUDGE INFO
  useEffect(() => {
    const fetchJudge = async () => {
      if (!judgeId) return;

      const snap = await getDoc(doc(db, "users", judgeId));
      if (snap.exists()) setJudge(snap.data());
    };

    fetchJudge();
  }, [judgeId]);

  // 🔥 PARTICIPANTS
  useEffect(() => {
    const q = query(collection(db, "participants"), orderBy("order"));

    const unsubscribe = onSnapshot(q, (snap) => {
      setParticipants(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, []);

  // 🔥 LOAD PREVIOUS SCORES
  useEffect(() => {
    const loadScores = async () => {
      if (!judgeId) return;

      const snap = await getDocs(collection(db, "participants"));
      let temp = {};

      for (let p of snap.docs) {
        const scoreSnap = await getDocs(
          collection(db, "scores", p.id, "judges")
        );

        scoreSnap.forEach(j => {
          if (j.id === judgeId) {
            temp[p.id] = j.data();
          }
        });
      }

      setScores(temp);
    };

    loadScores();
  }, [judgeId]);

  // 🔥 AUTO SAVE
  const handleChange = async (pid, field, value) => {
    const val = Math.max(0, Math.min(10, Number(value)));

    const updated = {
      ...scores[pid],
      [field]: val
    };

    setScores(prev => ({
      ...prev,
      [pid]: updated
    }));

    await setDoc(doc(db, "scores", pid, "judges", judgeId), {
      ...updated,
      updatedAt: new Date()
    });

    setSaved(prev => ({ ...prev, [pid]: true }));

    setTimeout(() => {
      setSaved(prev => ({ ...prev, [pid]: false }));
    }, 1000);
  };

  // 🔄 RESET SCORE
  const resetScore = async (pid) => {
    if (!window.confirm("Reset score for this participant?")) return;

    await deleteDoc(doc(db, "scores", pid, "judges", judgeId));

    setScores(prev => {
      const copy = { ...prev };
      delete copy[pid];
      return copy;
    });
  };

  // 🎯 TOTAL SCORE (OUT OF 40)
  const getTotal = (pid) => {
    const s = scores[pid] || {};
    return (
      (s.rampWalk || 0) +
      (s.introduction || 0) +
      (s.questionnaire || 0) +
      (s.talent || 0)
    );
  };

  return (
    <div className="judge-container">

      {/* HEADER */}
      {judge && (
        <div className="judge-header">
          <img src={judge.photo} alt="judge" />
          <h1>Welcome, {judge.name}</h1>
        </div>
      )}

      <div className="grid">
        {participants.map(p => (
          <motion.div
            key={p.id}
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>

            {/* 🎯 TOTAL SCORE */}
            <h4 className="total-score">
              Total: {getTotal(p.id)} / 40
            </h4>

            {["rampWalk","introduction","questionnaire","talent"].map(cat => (
              <div key={cat} className="input-group">
                <label>{cat}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={scores[p.id]?.[cat] || ""}
                  onChange={(e) =>
                    handleChange(p.id, cat, e.target.value)
                  }
                />
              </div>
            ))}

            {saved[p.id] && <p className="saved">Saved ✅</p>}

            {/* 🔄 RESET BUTTON */}
            <button className="reset-btn" onClick={() => resetScore(p.id)}>
              Reset
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
