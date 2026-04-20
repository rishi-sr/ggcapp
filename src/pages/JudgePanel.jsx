import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc
} from "firebase/firestore";
import "./judgepanel.scss";

const JudgePanel = () => {
  const [participants, setParticipants] = useState([]);
  const [scores, setScores] = useState({});
  const judgeEmail = localStorage.getItem("userEmail");

  // 📥 Fetch participants
  const fetchParticipants = async () => {
    const snapshot = await getDocs(collection(db, "participants"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setParticipants(data);
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // ✏️ Handle input change
  const handleChange = (id, field, value) => {
    setScores(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: Number(value)
      }
    }));
  };

  // 💾 Submit score
  const handleSubmit = async (id) => {
    const s = scores[id];

    if (!s) {
      alert("Enter scores first ❌");
      return;
    }

    const total =
      (s.ramp || 0) +
      (s.intro || 0) +
      (s.question || 0) +
      (s.talent || 0);

    try {
      await setDoc(doc(db, "scores", `${id}_${judgeEmail}`), {
        participantId: id,
        judge: judgeEmail,
        ramp: s.ramp || 0,
        intro: s.intro || 0,
        question: s.question || 0,
        talent: s.talent || 0,
        total
      });

      alert("Score saved ✅");
    } catch (error) {
      console.error(error);
      alert("Error saving ❌");
    }
  };

  return (
    <div className="judge-container">
      <h1>👨‍⚖️ Judge Panel</h1>

      <div className="grid">
        {participants.map((p) => (
          <div className="card" key={p.id}>
            <img src={p.photo} alt="" />
            <h3>{p.name}</h3>

            <input
              type="number"
              placeholder="Ramp (10)"
              max="10"
              onChange={(e) =>
                handleChange(p.id, "ramp", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Intro (10)"
              max="10"
              onChange={(e) =>
                handleChange(p.id, "intro", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Question (10)"
              max="10"
              onChange={(e) =>
                handleChange(p.id, "question", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Talent (10)"
              max="10"
              onChange={(e) =>
                handleChange(p.id, "talent", e.target.value)
              }
            />

            <button onClick={() => handleSubmit(p.id)}>
              Submit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JudgePanel;