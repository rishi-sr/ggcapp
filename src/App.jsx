import React, { useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import JudgePanel from "./pages/JudgePanel";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [videoDone, setVideoDone] = useState(false);

  return (
    <>
      {/* 🎬 VIDEO PRELOADER */}
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

      {/* 🚀 MAIN APP */}
      {videoDone && (
        <Router>
          <div className="app">
            <Routes>
              {/* 🔐 LOGIN */}
              <Route path="/" element={<Login />} />

              {/* 🛠 ADMIN */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* 👨‍⚖️ JUDGE */}
              <Route
                path="/judge"
                element={
                  <ProtectedRoute role="judge">
                    <JudgePanel />
                  </ProtectedRoute>
                }
              />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
};

export default App;