import React, { useContext, useState } from "react";
import { updateProfile } from "firebase/auth";
import { Context } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./ProfileUpdate.css"; // Import the CSS file

const ProfileUpdate = () => {
  const { user } = useContext(Context);
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: photoURL.trim(),
      });
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  return (
    <div className="container">
      <h2>Profile Update</h2>
      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label>Display Name:</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Photo URL:</label>
          <input
            type="text"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && (
        <p className="success-message">Profile updated successfully!</p>
      )}
      <div className="button-container">
        <button onClick={handleBackToHome}>Back to Home</button>
      </div>
    </div>
  );
};

export default ProfileUpdate;
