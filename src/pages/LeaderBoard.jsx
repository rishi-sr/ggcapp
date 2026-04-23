import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query
} from "firebase/firestore";
import { motion } from "framer-motion";
import "./leaderboard.scss";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let unsubscribeList = [];

    const unsubParticipants = onSnapshot(
      collection(db, "participants"),
      (pSnap) => {
        let participants = pSnap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        // 🔥 Remove old listeners
        unsubscribeList.forEach(unsub => unsub());
        unsubscribeList = [];

        // 🔥 Attach listener for each participant's scores
        participants.forEach((p) => {
          const q = query(
            collection(db, "scores", p.id, "judges")
          );

          const unsub = onSnapshot(q, (judgeSnap) => {
            setData(prev => {
              let updated = [...prev];

              let total = 0;
              let count = 0;

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

              const score = count > 0 ? total : 0;

              // 🔥 Update or insert
              const index = updated.findIndex(x => x.id === p.id);

              const entry = {
                id: p.id,
                name: p.name,
                gender: p.gender,
                image: p.image,
                score
              };

              if (index >= 0) updated[index] = entry;
              else updated.push(entry);

              // 🔥 Sort
              updated.sort((a, b) => b.score - a.score);

              return updated;
            });
          });

          unsubscribeList.push(unsub);
        });
      }
    );

    return () => {
      unsubParticipants();
      unsubscribeList.forEach(unsub => unsub());
    };
  }, []);

  const girls = data.filter(d => d.gender === "female");
  const boys = data.filter(d => d.gender === "male");

  const renderList = (list) =>
    list.map((d, i) => (
      <motion.div
        key={d.id}
        className={`leaderboard-card rank-${i}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rank">#{i + 1}</div>
        <img src={d.image} alt={d.name} />
        <div className="info">
          <h4>{d.name}</h4>
          <p>{d.score}</p>
        </div>
      </motion.div>
    ));

  return (
    <div className="leaderboard-container">
      <h1>🏆 Grand Leaderboard</h1>

      <div className="section">
        <h2>👩 Girls Ranking</h2>
        <div className="leaderboard-list">{renderList(girls)}</div>
      </div>

      <div className="section">
        <h2>👨 Boys Ranking</h2>
        <div className="leaderboard-list">{renderList(boys)}</div>
      </div>
    </div>
  );
}