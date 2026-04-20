import React, { useState } from "react";
import "./Login.scss";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      // 🔐 Firebase login
      await signInWithEmailAndPassword(auth, email, password);

      // 🔍 Get role from Firestore
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map(doc => doc.data());

      const currentUser = users.find(u => u.email === email);

      if (!currentUser) {
        alert("User role not found ❌");
        return;
      }

      // 💾 Save session
      localStorage.setItem("userRole", currentUser.role);
      localStorage.setItem("userEmail", currentUser.email);

      // 🎯 Redirect
      if (currentUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/judge");
      }

    } catch (error) {
      console.error(error);
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🌿 GGC Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;