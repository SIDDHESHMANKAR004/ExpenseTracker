import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/onboarding");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

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

        {/* Menu */}
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
            onClick={() => navigate("/settings")}
          >
            ⚙️ Settings
          </div>

          <div className="p-3">
            📱 Our Other Apps
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
