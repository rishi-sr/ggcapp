import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "./adminpanel.scss"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const AdminPanel = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [participants, setParticipants] = useState([]);

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

  // ➕ Add participant
  const handleAdd = async () => {
    if (!name || !file) {
      alert("Please enter name and select image");
      return;
    }

    try {
      // ☁️ Upload image
      const imageUrl = await uploadToCloudinary(file);

      // 📦 Save to Firebase
      await addDoc(collection(db, "participants"), {
        name: name,
        photo: imageUrl
      });

      alert("Participant added ✅");

      setName("");
      setFile(null);

      fetchParticipants();
    } catch (error) {
      console.error(error);
      alert("Error uploading ❌");
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Delete this participant?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "participants", id));
    fetchParticipants();
  } catch (error) {
    console.error(error);
    alert("Delete failed ❌");
  }
};

  return (
  <div className="admin-container">
    <h1 className="title">🌿 Admin Panel</h1>

    {/* FORM */}
    <div className="form-card">
      <input
        type="text"
        placeholder="Enter participant name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleAdd}>Add Participant</button>
    </div>

    {/* LIST */}
    <h2 className="subtitle">Participants</h2>

    <div className="grid">
      {participants.map((p) => (
        <div key={p.id} className="card">
          <img src={p.photo} alt="" />
          <h3>{p.name}</h3>

          <button
            className="delete-btn"
            onClick={() => handleDelete(p.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
  );
};

export default AdminPanel;