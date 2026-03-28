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
        if (file.size > 2 * 1024 * 1024) { // ✅ FIXED SIZE
          alert("Each image must be less than 2MB");
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
        gender: formData.gender,
        name: formData.name,
        rollNo: formData.rollNo,
        branch: formData.branch,
        whatsapp: formData.whatsapp,
        performance: formData.performance,
        q1: formData.q1,
        q2: formData.q2,
        q3: formData.q3,
        q4: formData.q4,
        photos: photos
      };

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby9uxvHgnF9oKgzBQU9ka9oyWqeXBxPdre7rqBTQxtVgNRcvtyReI5s8_YJ519DjPSG/exec",
        {
          method: "POST",
          body: JSON.stringify(payload), // ✅ NO HEADERS (avoids CORS)
        }
      );

      // ✅ Safe response handling
      let result;
      try {
        result = await response.json();
      } catch {
        result = { status: "success" };
      }

      if (result.status === "success") {
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
      } else {
        alert("Submission failed ❌");
      }

    } catch (err) {
      alert("Error submitting form ❌");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="main-container">

      {/* LEFT */}
      <div className="left-section">
        <h1>Miss & Mr. Earth NIET</h1>
        <h3>Mr & Miss Earth NIET 26' is a flagship pageant event under the banner of  "पृथ्वी 4.0 - The Annual Earth Day Fest" organized by Green Gold Society. The pageant gives you a chance to stand in NIETians as a title holder and make your recognition in the college.</h3>
        <ul>
          <li><span>1st Prize:</span>   Miss Earth NIET 2026    |   Mr. Earth NIET 2026</li>
          <li><span>1st Runner Ups:</span>   Miss Evergreen NIET 2026  |    Mr. Evergreen NIET 2026   </li>
          <span className="date">Date:</span>
          <li><span>Registration End:</span> 7th April 2026</li>
          <li><span>Quarter Finals:</span> 8th April 2026</li>
          <li><span>Semi Finals:</span> 18th April 2026</li>
          <li><span>Finals:</span> 22th April 2026</li>
          <li>Click here 👇to check out the contest journey :</li>
          <a href="https://www.canva.com/design/DAHFEjrx730/V-HyLmCrBx2QfN2pl94g1A/view?utm_content=DAHFEjrx730&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h72567837fd" target="_blank" rel="noopener noreferrer">
            <button>View Journey</button>
          </a>
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
            {["Dance", "Singing", "Acting", "Beat Boxing", "Instrumentals", "Other"].map(item => (
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

            <label>Upload 3 Best Photos (Size less than 2 MB each)</label>
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
            <h2>Join the Whatsapp Group for Updates</h2>
            <p>Click the button below to join our Whatsapp group for the latest updates:</p>
            <a href="https://chat.whatsapp.com/DWoZsihWpvFFe1n5fJZxev?mode=gi_t" target="_blank" rel="noopener noreferrer">
              <button>Join Whatsapp Group</button>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default Forms;