import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, saveUser } from "../services/db";
import SwipeWrapper from "../components/SwipeWrapper";
import Loader from "../components/Loader";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const uid = sessionStorage.getItem("uid");

  const [user, setUser] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSitesModal, setShowSitesModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [edit, setEdit] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const load = async () => {
      const firebaseUser = await getUser(uid);

      if (!firebaseUser) {
        navigate("/onboarding");
        return;
      }

      setUser(firebaseUser);
      setEdit({
        name: firebaseUser.name || "",
        email: firebaseUser.email || "",
        phone: firebaseUser.phone || "",
      });

      setLoading(false);
    };

    load();
  }, [uid, navigate]);

  if (loading) {
    return (
      <SwipeWrapper>
        <div className="min-vh-100 dashboard-bg d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      </SwipeWrapper>
    );
  }

 
  /* Save profile */
  const saveProfile = async () => {
    await saveUser(uid, edit);
    setUser({ ...user, ...edit });
    setShowEditProfile(false);
  };

  /* Logout */
  const logout = () => {
    sessionStorage.removeItem("uid");
    navigate("/onboarding");
  };

  /* Sites list */
  const sites = [
    {
      name: "Ecommerce Site",
      url: "https://siddreactapp1.netlify.app/",
      description: "Ecommerce Site showcase",
    },
   
    {
      name: "Movie App",
      url: "https://moviereactapp04.netlify.app/",
      description: "Movie database and search",
    },
  ];

  const openSite = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /* Share functionality */
  const appLink = window.location.origin; // Gets current website URL
  const shareMessage = `Check out this awesome Expense Tracker app! Track your expenses, set budgets, and manage your finances easily. Try it now: ${appLink}`;

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const shareViaTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(appLink)}&text=${encodeURIComponent("Check out this Expense Tracker app!")}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(appLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = appLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Link copied to clipboard!");
      });
  };

  const shareViaEmail = () => {
    const subject = "Check out this Expense Tracker App";
    const body = shareMessage;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const shareViaSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(shareMessage)}`;
    window.location.href = smsUrl;
  };

  return (
    <>
      <SwipeWrapper>
        <div className="min-vh-100 dashboard-bg">
          <div
            className="container py-4"
            style={{ maxWidth: "720px", paddingBottom: "90px" }}
          >
            {/* Header */}
            <div className="card p-3 mb-4 d-flex align-items-center flex-row">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "72px",
                  height: "72px",
                  border: "3px solid var(--primary)",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <span style={{ fontSize: "32px" }}>👤</span>
              </div>

              <div className="ms-3">
                <h5 className="mb-0">{user.name}</h5>
                <small className="text-muted">{user.email}</small>
              </div>
            </div>

           

            {/* PROFILE MENU */}
            {!showSettingsMenu && !showEditProfile ? (
              <div className="card p-2">
                <div
                  className="p-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowShareModal(true)}
                >
                  👍 Recommend to friends
                </div>

                <div
                  className="p-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowSettingsMenu(true)}
                >
                  ⚙️ Settings
                </div>

                <div
                  className="p-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowSitesModal(true)}
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
            ) : showSettingsMenu ? (
              /* SETTINGS MENU */
              <div className="card p-2">
                <div
                  className="p-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowSettingsMenu(false);
                    setShowEditProfile(true);
                  }}
                >
                  👤 Edit Profile
                </div>

                <div
                  className="p-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/currency")}
                >
                  💱 Currency
                </div>

                <div
                  className="p-3 border-bottom"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/category-budgets")}
                >
                  📊 Category Budgets
                </div>

                <div
                  className="p-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowSettingsMenu(false)}
                >
                  ↩️ Back
                </div>
              </div>
            ) : (
              /* EDIT PROFILE FORM */
              <div className="card p-3">
                <div
                  className="d-flex align-items-center mb-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowEditProfile(false);
                    setShowSettingsMenu(true);
                  }}
                >
                  <span style={{ marginRight: "8px" }}>←</span>
                  <h6 className="mb-0">Edit Profile</h6>
                </div>

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

                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={saveProfile}
                >
                  Save
                </button>

                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setShowEditProfile(false);
                    setShowSettingsMenu(true);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </SwipeWrapper>

      {/* Sites Modal */}
      {showSitesModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "20px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Our Other Sites</h5>
              <button
                className="btn-close"
                onClick={() => setShowSitesModal(false)}
                aria-label="Close"
              ></button>
            </div>

            <p className="text-muted mb-4">
              Check out our other applications. Click any site to open in a new
              tab.
            </p>

            <div className="sites-list">
              {sites.map((site, index) => (
                <div
                  key={index}
                  className="card mb-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => openSite(site.url)}
                >
                  <div className="card-body">
                    <h6 className="card-title mb-1">{site.name}</h6>
                    <p className="card-text text-muted small mb-2">
                      {site.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-primary">{site.url}</small>
                      <span className="text-muted">↗</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowSitesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "20px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Share with Friends</h5>
              <button
                className="btn-close"
                onClick={() => setShowShareModal(false)}
                aria-label="Close"
              ></button>
            </div>

            <p className="text-muted mb-4">
              Help spread the word! Share this amazing Expense Tracker app with
              your friends.
            </p>

            <div className="mb-4">
              <label className="form-label mb-2">App Link:</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={appLink}
                  readOnly
                  style={{ fontFamily: "monospace", fontSize: "14px" }}
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={copyToClipboard}
                  type="button"
                >
                  📋 Copy
                </button>
              </div>
              <small className="text-muted mt-2 d-block">
                Copy this link and share it anywhere
              </small>
            </div>

            <h6 className="mb-3">Share via:</h6>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <button
                  className="btn btn-outline-success w-100 d-flex flex-column align-items-center py-3"
                  onClick={shareViaWhatsApp}
                  style={{ height: "100%" }}
                >
                  <span style={{ fontSize: "24px", marginBottom: "8px" }}>
                    📱
                  </span>
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className="col-6">
                <button
                  className="btn btn-outline-primary w-100 d-flex flex-column align-items-center py-3"
                  onClick={shareViaTelegram}
                  style={{ height: "100%" }}
                >
                  <span style={{ fontSize: "24px", marginBottom: "8px" }}>
                    📨
                  </span>
                  <span>Telegram</span>
                </button>
              </div>

              <div className="col-6">
                <button
                  className="btn btn-outline-secondary w-100 d-flex flex-column align-items-center py-3"
                  onClick={shareViaEmail}
                  style={{ height: "100%" }}
                >
                  <span style={{ fontSize: "24px", marginBottom: "8px" }}>
                    ✉️
                  </span>
                  <span>Email</span>
                </button>
              </div>

              <div className="col-6">
                <button
                  className="btn btn-outline-info w-100 d-flex flex-column align-items-center py-3"
                  onClick={shareViaSMS}
                  style={{ height: "100%" }}
                >
                  <span style={{ fontSize: "24px", marginBottom: "8px" }}>
                    💬
                  </span>
                  <span>SMS</span>
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowShareModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
