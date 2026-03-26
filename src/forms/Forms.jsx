import React, { useState, useEffect } from "react";
import { FaUpload, FaCheckCircle } from "react-icons/fa";
import "./form.scss";

const Forms = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    gender: "",
    name: "",
    rollNo: "",
    branch: "",
    whatsapp: "",
    performance: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    photos: []
  });

  const [preview, setPreview] = useState([]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    if (e.target.name === "photos") {
      const files = Array.from(e.target.files);

      if (files.length > 3) {
        alert("Max 3 images allowed");
        return;
      }

      for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Each image must be less than 5MB");
          return;
        }
      }

      setFormData({ ...formData, photos: files });

      const previewUrls = files.map(file => URL.createObjectURL(file));
      setPreview(previewUrls);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      preview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [preview]);

  /* ================= BASE64 ================= */
  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({
          base64: reader.result.split(",")[1],
          type: file.type,
          name: `${formData.name}-${Date.now()}-${file.name}`
        });
      };
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const photos = await Promise.all(
        formData.photos.map(file => convertToBase64(file))
      );

      const payload = {
        ...formData,
        photos
      };

      await fetch("https://script.google.com/macros/s/AKfycbxLbGeq1PkZbe9Lbh52go1k3kWL3Wf7i2VdthFVdqUWlglFbvabmLSjVbTLXkIsf4Te/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      setSubmitted(true);

      setFormData({
        gender: "",
        name: "",
        rollNo: "",
        branch: "",
        whatsapp: "",
        performance: "",
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        photos: []
      });

      setPreview([]);

    } catch (err) {
      alert("Error submitting form ❌");
    }

    setLoading(false);
  };

  return (
    <div className="main-container">

      {/* LEFT */}
      <div className="left-section">
        <h1>Miss & Mr. Earth NIET 🌍</h1>
        <h3>Rules & Regulations</h3>
        <ul>
          <li>Only NIET students allowed</li>
          <li>Respect all participants</li>
          <li>Upload clear images</li>
          <li>No fake information</li>
          <li>Judge decision final</li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="form-container">

        {!submitted ? (
          <form onSubmit={handleSubmit}>

            <label>Category</label>
            <select name="gender" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Miss">Miss</option>
              <option value="Mr">Mr</option>
            </select>

            <label>Name</label>
            <input name="name" onChange={handleChange} required />

            <label>Branch</label>
            <input name="branch" onChange={handleChange} required />

            <label>ERP</label>
            <input name="rollNo" onChange={handleChange} required />

            <label>Whatsapp No</label>
            <input name="whatsapp" onChange={handleChange} required />

            <label>Your Performance</label>
            {["Dance", "Singing", "Acting", "Beat Boxing", "Instrumentals"].map(item => (
              <label key={item}>
                <input type="radio" name="performance" value={item} onChange={handleChange} required />
                {item}
              </label>
            ))}

            <label>Why best fit?</label>
            <textarea name="q1" onChange={handleChange} required />

            <label>Views on Sustainable Fashion</label>
            <textarea name="q2" onChange={handleChange} required />

            <label>Fictional Character & Why</label>
            <textarea name="q3" onChange={handleChange} required />

            <label>Environmental Activities</label>
            <textarea name="q4" onChange={handleChange} required />

            <label>Upload Photos</label>
            <input type="file" name="photos" multiple accept="image/*" onChange={handleChange} required />

            <div className="preview">
              {preview.map((img, i) => <img key={i} src={img} alt="preview" />)}
            </div>

            <button disabled={loading}>
              {loading ? "Submitting..." : <><FaUpload /> Submit</>}
            </button>

          </form>
        ) : (
          <div className="success">
            <FaCheckCircle size={60} />
            <h2>Form Submitted Successfully!</h2>
          </div>
        )}

      </div>
    </div>
  );
};

export default Forms;