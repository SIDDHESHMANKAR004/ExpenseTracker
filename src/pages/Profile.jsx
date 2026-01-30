import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, saveUser } from "../services/db";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const uid = sessionStorage.getItem("uid");

  const [user, setUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [edit, setEdit] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const load = async () => {
      // Try to get user from Firebase first
      const firebaseUser = await getUser(uid);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        setEdit({
          name: firebaseUser?.name || "",
          email: firebaseUser?.email || "",
          phone: firebaseUser?.phone || "",
        });
        // Also update localStorage for offline use
        localStorage.setItem("user", JSON.stringify(firebaseUser));
      } else {
        // Fallback to localStorage if Firebase fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setEdit({
            name: parsedUser?.name || "",
            email: parsedUser?.email || "",
            phone: parsedUser?.phone || "",
          });
        } else {
          navigate("/onboarding");
        }
      }
    };

    load();
  }, [uid, navigate]);

  if (!user) return null;

  /* Avatar (still local preview) */
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = {
        ...user,
        profileImage: reader.result,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  /* Save profile */
  const saveProfile = async () => {
    // Save to Firebase
    await saveUser(uid, edit);
    
    // Also update localStorage
    const updatedUser = { ...user, ...edit };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    alert("Profile updated");
    setShowSettings(false);
  };

  /* Logout */
  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/onboarding");
  };

  return (
    <div className="min-vh-100 dashboard-bg">
      <div
        className="container py-4"
        style={{ maxWidth: "720px", paddingBottom: "90px" }}
      >
        {/* Profile Header */}
        <div className="card p-3 mb-4 d-flex align-items-center flex-row">
          <div
            onClick={handleAvatarClick}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "72px",
              height: "72px",
              border: "3px solid var(--primary)",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span style={{ fontSize: "32px" }}>👤</span>
            )}
          </div>

          <div className="ms-3">
            <h5 className="mb-0">{user.name}</h5>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {!showSettings ? (
          <div className="card p-2">
            <div
              className="p-3 border-bottom"
              style={{ cursor: "pointer" }}
            >
              👍 Recommend to friends
            </div>

            <div
              className="p-3 border-bottom"
              style={{ cursor: "pointer" }}
              onClick={() => setShowSettings(true)}
            >
              ⚙️ Settings
            </div>

            <div
              className="p-3 border-bottom"
              style={{ cursor: "pointer" }}
            >
              🌐 Our Other Sites 
            </div>

            <div
              className="p-3 text-danger"
              style={{ cursor: "pointer" }}
              onClick={logout}
            >
              🚪 Logout
            </div>
          </div>
        ) : (
          <div className="card p-3">
            <h6>Edit Profile</h6>

            <input
              className="form-control mb-2"
              value={edit.name}
              onChange={(e) => setEdit({ ...edit, name: e.target.value })}
              placeholder="Name"
            />

            <input
              className="form-control mb-2"
              value={edit.email}
              onChange={(e) => setEdit({ ...edit, email: e.target.value })}
              placeholder="Email"
            />

            <input
              className="form-control mb-3"
              value={edit.phone}
              onChange={(e) => setEdit({ ...edit, phone: e.target.value })}
              placeholder="Phone"
            />

            <button className="btn btn-primary w-100 mb-2" onClick={saveProfile}>
              Save
            </button>

            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;