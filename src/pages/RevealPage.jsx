import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import "./result.scss";

export default function RevealPage() {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState(null);
  const [display, setDisplay] = useState({});
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA + CALCULATE WINNERS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pSnap = await getDocs(collection(db, "participants"));

        let result = [];

        for (let p of pSnap.docs) {
          let total = 0;
          let count = 0;

          const judgeSnap = await getDocs(
            collection(db, "scores", p.id, "judges")
          );

          judgeSnap.forEach(j => {
            const d = j.data();
            const sum =
              (d.rampWalk || 0) +
              (d.introduction || 0) +
              (d.questionnaire || 0) +
              (d.talent || 0);

            total += sum;
            count++;
          });

          result.push({
            id: p.id,
            name: p.data().name,
            gender: p.data().gender,
            image: p.data().image,
            score: count > 0 ? total / count : 0
          });
        }

        // 🔥 SORT
        result.sort((a, b) => b.score - a.score);

        const girls = result.filter(r => r.gender === "female");
        const boys = result.filter(r => r.gender === "male");

        // 🔥 PICK WINNERS
        const winnersData = {
          missEarth: girls[0] || null,
          mrEarth: boys[0] || null,
          missEvergreen: girls[1] || null,
          mrEvergreen: boys[1] || null
        };

        setParticipants(result);
        setWinners(winnersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <h2 style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        Loading Results...
      </h2>
    );
  }

  if (!participants.length || !winners) {
    return (
      <h2 style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        No data available
      </h2>
    );
  }

  // 🎲 CLEAN REVEAL
  const startReveal = (key) => {
    if (revealed[key]) return;

    const interval = setInterval(() => {
      const random =
        participants[Math.floor(Math.random() * participants.length)];

      setDisplay(prev => ({
        ...prev,
        [key]: random
      }));
    }, 100);

    setTimeout(() => {
      clearInterval(interval);

      setDisplay(prev => ({
        ...prev,
        [key]: winners[key]
      }));

      setRevealed(prev => ({
        ...prev,
        [key]: true
      }));
    }, 3000);
  };

  const titles = [
    { key: "missEvergreen", label: "Miss Evergreen (2nd - Girls)" },
    { key: "mrEvergreen", label: "Mr Evergreen (2nd - Boys)" },
    { key: "missEarth", label: "Miss Earth (1st - Girls)" },
    { key: "mrEarth", label: "Mr Earth (1st - Boys)" }
  ];

  return (
    <div className="reveal-container">
      <h1 className="title">🌍 Grand Finale Results</h1>

      <div className="grid">
        {titles.map(({ key, label }) => (
          <motion.div
            key={key}
            className={`card ${revealed[key] ? "glow" : ""}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>{label}</h3>

            <div className="inner-card">
              {display[key] ? (
                <>
                  <img src={display[key]?.image} alt="" />
                  <h2>{display[key]?.name}</h2>
                </>
              ) : (
                <div className="placeholder">???</div>
              )}
            </div>

            <button
              onClick={() => startReveal(key)}
              disabled={revealed[key]}
            >
              {revealed[key] ? "Revealed" : "Reveal"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}