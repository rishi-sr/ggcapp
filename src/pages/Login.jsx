import React, { useState } from "react";
import "./login.scss";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Firebase Auth Login
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // 🔥 SECURE: get role using UID
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        alert("User role not found ❌");
        return;
      }

      const userData = userDoc.data();

      // 💾 Store session
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("uid", uid);

      // 🎯 Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "judge") {
        navigate("/judge");
      } else {
        alert("Invalid role ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>🌿 GGC Finale Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </motion.div>
    </div>
  );
};

export default Login;