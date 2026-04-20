import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import "./leaderboard.scss";
import {
  collection,
  onSnapshot,
  getDocs
} from "firebase/firestore";

const Leaderboard = () => {
  const [participants, setParticipants] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // 📥 Fetch participants
  useEffect(() => {
    const fetchParticipants = async () => {
      const snapshot = await getDocs(collection(db, "participants"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setParticipants(data);
    };

    fetchParticipants();
  }, []);

  // 🔄 Listen to scores (LIVE)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "scores"),
      (snapshot) => {
        const scores = snapshot.docs.map(doc => doc.data());

        const result = {};

        // 🧮 Combine scores
        scores.forEach((s) => {
          if (!result[s.participantId]) {
            result[s.participantId] = 0;
          }
          result[s.participantId] += s.total;
        });

        // 🔗 Merge with participants
        const finalData = participants.map((p) => ({
          ...p,
          total: result[p.id] || 0
        }));

        // 🏆 Sort ranking
        finalData.sort((a, b) => b.total - a.total);

        setLeaderboard(finalData);
      }
    );

    return () => unsubscribe();
  }, [participants]);

  return (
    <div className="leaderboard-container">
      <h1>🏆 Leaderboard</h1>

      <div className="leaderboard-list">
        {leaderboard.map((p, index) => (
          <div className="leaderboard-card" key={p.id}>
            <h2>#{index + 1}</h2>
            <img src={p.photo} alt="" />
            <h3>{p.name}</h3>
            <p>Total Score: {p.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;