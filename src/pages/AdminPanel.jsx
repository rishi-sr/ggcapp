import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { motion } from "framer-motion";
import "./AdminPanel.scss"; // make sure you created this

export default function AdminPanel() {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // file
  const [preview, setPreview] = useState("");
  const [gender, setGender] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 REAL-TIME FETCH
  useEffect(() => {
    const q = query(collection(db, "participants"), orderBy("order"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setParticipants(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, []);

  // 📸 HANDLE IMAGE SELECT
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // preview
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // ☁️ CLOUDINARY UPLOAD
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ggc_unsigned"); // 🔥 change this

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnl0zdmwt/image/upload", // 🔥 change this
      {
        method: "POST",
        body: data
      }
    );

    const result = await res.json();
    return result.secure_url;
  };

  // ➕ ADD PARTICIPANT
  const addParticipant = async () => {
    if (!name || !image || !gender || order === "") {
      return alert("All fields are required");
    }

    try {
      setLoading(true);

      // upload image first
      const imageUrl = await uploadImage(image);

      await addDoc(collection(db, "participants"), {
        name,
        image: imageUrl,
        gender,
        order: Number(order),
        createdAt: new Date()
      });

      // reset form
      setName("");
      setImage(null);
      setPreview("");
      setGender("");
      setOrder("");

    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE
  const deleteParticipant = async (id) => {
    if (!window.confirm("Delete this participant?")) return;
    await deleteDoc(doc(db, "participants", id));
  };

  return (
    <div className="admin-container">
      <h2 className="title">🌿 Admin Panel</h2>

      {/* FORM */}
      <motion.div
        className="form-card"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          placeholder="Participant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button onClick={addParticipant} disabled={loading}>
          {loading ? "Uploading..." : "Add"}
        </button>
      </motion.div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={preview}
            alt="preview"
            style={{
              width: "200px",
              borderRadius: "15px",
              boxShadow: "0 0 15px rgba(255,215,0,0.5)"
            }}
          />
        </div>
      )}

      {/* PARTICIPANTS GRID */}
      <h3 className="subtitle">Participants</h3>

      <div className="grid">
        {participants.map((p) => (
          <motion.div
            key={p.id}
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.gender.toUpperCase()}</p>
            <p>Order: {p.order}</p>

            <button
              className="delete-btn"
              onClick={() => deleteParticipant(p.id)}
            >
              Delete
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}