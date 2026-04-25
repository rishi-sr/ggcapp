import React, { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import JudgePanel from "./pages/JudgePanel";
import Leaderboard from "./pages/LeaderBoard";
import ProtectedRoute from "./components/ProtectedRoute";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import ResultReveal from "./pages/RevealPage";

const App = () => {
  const [videoDone, setVideoDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);

      if (user) {
        localStorage.setItem("userEmail", user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
      {!videoDone && (
        <div className="video-preloader">
          <video
            src="/ggcpreloader.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoDone(true)}
          />
        </div>
      )}

      {videoDone && (
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />

            
            

            

            
          </Routes>
        </Router>
      )}
    </>
  );
};

export default App;