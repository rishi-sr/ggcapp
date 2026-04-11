import React, { useState } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import Forms from "./forms/Forms";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  const [videoDone, setVideoDone] = useState(false);

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
        <div className="app">
          <Router>
            <Routes>
              {/* <Route path="/" element={<Forms />} /> */}
            </Routes>
          </Router>
        </div>
      )}
    </>
  );
};

export default App;