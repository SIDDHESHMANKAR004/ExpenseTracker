import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, saveUser } from "../services/db";
import SwipeWrapper from "../components/SwipeWrapper";
import Loader from "../components/Loader";
import "./Profile.css";

const SITES = [
  {
    name: "Ecommerce Site",
    url: "https://siddreactapp1.netlify.app/",
    description: "Explore an ecommerce website showcase.",
    icon: "🛍️",
  },
  {
    name: "Movie App",
    url: "https://moviereactapp04.netlify.app/",
    description: "Browse and search a movie database.",
    icon: "🎬",
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const uid = sessionStorage.getItem("uid");
  const appLink = window.location.origin;

  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSitesModal, setShowSitesModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!uid) {
        navigate("/onboarding");
        return;
      }

      try {
        const firebaseUser = await getUser(uid);
        if (!active) return;

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
      } catch (error) {
        console.error("Unable to load profile:", error);
        if (active) setNotice("Unable to load your profile. Please refresh and try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [uid, navigate]);

  useEffect(() => {
    if (!showSitesModal && !showShareModal) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSitesModal(false);
        setShowShareModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showSitesModal, showShareModal]);

  const initials = useMemo(() => {
    const name = user?.name?.trim();
    if (!name) return "U";
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [user?.name]);

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!edit.name.trim()) {
      setNotice("Please enter your name.");
      return;
    }

    setSaving(true);
    setNotice("");
    const updatedProfile = {
      name: edit.name.trim(),
      email: edit.email.trim(),
      phone: edit.phone.trim(),
    };

    try {
      await saveUser(uid, updatedProfile);
      setUser((currentUser) => ({ ...currentUser, ...updatedProfile }));
      setEdit(updatedProfile);
      setShowEditProfile(false);
      setNotice("Your profile has been updated.");
    } catch (error) {
      console.error("Unable to save profile:", error);
      setNotice("Could not save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("uid");
    navigate("/onboarding");
  };

  const shareMessage = `Check out this Expense Tracker app! Track your expenses, set budgets, and manage your finances easily. Try it now: ${appLink}`;

  const shareViaWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareViaTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(appLink)}&text=${encodeURIComponent(
        "Check out this Expense Tracker app!"
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(appLink);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = appLink;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setNotice("App link copied to clipboard.");
    } catch (error) {
      console.error("Unable to copy link:", error);
      setNotice("Unable to copy the link. Please copy it manually.");
    }
  };

  const shareViaEmail = () => {
    const subject = "Check out this Expense Tracker App";
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      shareMessage
    )}`;
  };

  const shareViaSMS = () => {
    window.location.href = `sms:?body=${encodeURIComponent(shareMessage)}`;
  };

  if (loading) {
    return (
      <SwipeWrapper>
        <div className="profile-loading dashboard-bg">
          <Loader />
        </div>
      </SwipeWrapper>
    );
  }

  if (!user) {
    return (
      <SwipeWrapper>
        <div className="profile-page dashboard-bg">
          <div className="profile-empty-state">
            <span className="profile-empty-icon">👤</span>
            <h2>Profile unavailable</h2>
            <p>We could not find your account details.</p>
            <button className="profile-btn profile-btn-primary" onClick={() => navigate("/onboarding")}>
              Go to sign in
            </button>
          </div>
        </div>
      </SwipeWrapper>
    );
  }

  return (
    <SwipeWrapper>
      <main className="profile-page dashboard-bg">
        <div className="profile-container">
          <header className="profile-page-header">
            <div>
              <span className="profile-eyebrow">ACCOUNT</span>
              <h1>Your profile</h1>
              <p>Manage your personal details and app preferences.</p>
            </div>
            <button
              type="button"
              className="profile-btn profile-btn-light profile-dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              <span aria-hidden="true">←</span> Back to dashboard
            </button>
          </header>

          {notice && (
            <div className="profile-notice" role="status">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">
                ×
              </button>
            </div>
          )}

          <div className="profile-layout">
            <aside className="profile-sidebar">
              <section className="profile-identity-card">
                <div className="profile-identity-top">
                  <span className="profile-avatar" aria-label="Profile initials">
                    {initials}
                  </span>
                  <span className="profile-account-label">PERSONAL ACCOUNT</span>
                </div>
                <h2>{user.name || "Your account"}</h2>
                <p className="profile-user-email">{user.email || "No email added"}</p>
                <button
                  type="button"
                  className="profile-btn profile-btn-primary profile-edit-identity"
                  onClick={() => setShowEditProfile(true)}
                >
                  <span aria-hidden="true">✎</span> Edit profile
                </button>
                <div className="profile-identity-divider" />
                <div className="profile-detail-row">
                  <span className="profile-detail-icon">✉</span>
                  <div>
                    <small>Email address</small>
                    <strong>{user.email || "Not provided"}</strong>
                  </div>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-icon">☎</span>
                  <div>
                    <small>Phone number</small>
                    <strong>{user.phone || "Not provided"}</strong>
                  </div>
                </div>
              </section>

              <section className="profile-help-card">
                <span className="profile-help-icon">💡</span>
                <div>
                  <h3>Stay in control</h3>
                  <p>Keep your details up to date so your account information stays accurate.</p>
                </div>
              </section>
            </aside>

            <section className="profile-main-content">
              {showEditProfile ? (
                <section className="profile-panel profile-edit-panel">
                  <div className="profile-panel-heading">
                    <div>
                      <span className="profile-eyebrow">PERSONAL INFORMATION</span>
                      <h2>Edit your profile</h2>
                      <p>Update the details associated with your account.</p>
                    </div>
                    <button
                      type="button"
                      className="profile-icon-btn"
                      onClick={() => {
                        setEdit({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                        });
                        setShowEditProfile(false);
                      }}
                      aria-label="Close edit profile"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={saveProfile} className="profile-form">
                    <label className="profile-field">
                      <span>Full name</span>
                      <input
                        type="text"
                        value={edit.name}
                        onChange={(event) => setEdit({ ...edit, name: event.target.value })}
                        placeholder="Enter your name"
                        autoComplete="name"
                        required
                      />
                    </label>
                    <label className="profile-field">
                      <span>Email address</span>
                      <input
                        type="email"
                        value={edit.email}
                        onChange={(event) => setEdit({ ...edit, email: event.target.value })}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </label>
                    <label className="profile-field">
                      <span>Phone number</span>
                      <input
                        type="tel"
                        value={edit.phone}
                        onChange={(event) => setEdit({ ...edit, phone: event.target.value })}
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                      />
                    </label>
                    <div className="profile-form-actions">
                      <button type="button" className="profile-btn profile-btn-light" onClick={() => {
                        setEdit({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                        });
                        setShowEditProfile(false);
                      }}>
                        Cancel
                      </button>
                      <button type="submit" className="profile-btn profile-btn-primary" disabled={saving}>
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </form>
                </section>
              ) : (
                <>
                  <section className="profile-panel">
                    <div className="profile-panel-heading">
                      <div>
                        <span className="profile-eyebrow">PREFERENCES</span>
                        <h2>Account settings</h2>
                        <p>Manage how your expense tracker works for you.</p>
                      </div>
                    </div>

                    <div className="profile-action-list">
                      <button type="button" className="profile-action-row" onClick={() => setShowEditProfile(true)}>
                        <span className="profile-action-icon profile-icon-blue">👤</span>
                        <span className="profile-action-copy">
                          <strong>Personal information</strong>
                          <small>Update your name, email, and phone number</small>
                        </span>
                        <span className="profile-chevron" aria-hidden="true">›</span>
                      </button>
                      <button type="button" className="profile-action-row" onClick={() => navigate("/currency")}>
                        <span className="profile-action-icon profile-icon-green">₹</span>
                        <span className="profile-action-copy">
                          <strong>Currency</strong>
                          <small>Choose the currency used in your records</small>
                        </span>
                        <span className="profile-chevron" aria-hidden="true">›</span>
                      </button>
                      <button type="button" className="profile-action-row" onClick={() => navigate("/category-budgets")}>
                        <span className="profile-action-icon profile-icon-purple">▦</span>
                        <span className="profile-action-copy">
                          <strong>Category budgets</strong>
                          <small>Set spending limits for your categories</small>
                        </span>
                        <span className="profile-chevron" aria-hidden="true">›</span>
                      </button>
                    </div>
                  </section>

                  <section className="profile-panel profile-discover-panel">
                    <div className="profile-panel-heading">
                      <div>
                        <span className="profile-eyebrow">MORE</span>
                        <h2>Discover and share</h2>
                        <p>Share the app or explore more projects.</p>
                      </div>
                    </div>
                    <div className="profile-feature-grid">
                      <button type="button" className="profile-feature-card" onClick={() => setShowShareModal(true)}>
                        <span className="profile-feature-icon profile-icon-orange">↗</span>
                        <strong>Recommend to friends</strong>
                        <small>Share the app with people you know</small>
                        <span className="profile-feature-link">Share app <span aria-hidden="true">→</span></span>
                      </button>
                      <button type="button" className="profile-feature-card" onClick={() => setShowSitesModal(true)}>
                        <span className="profile-feature-icon profile-icon-teal">🌐</span>
                        <strong>Our other projects</strong>
                        <small>Explore more apps and websites</small>
                        <span className="profile-feature-link">Explore projects <span aria-hidden="true">→</span></span>
                      </button>
                    </div>
                  </section>

                  <section className="profile-logout-row">
                    <div>
                      <strong>Sign out</strong>
                      <small>Sign out of this account on this device.</small>
                    </div>
                    <button type="button" className="profile-btn profile-btn-danger-outline" onClick={logout}>
                      <span aria-hidden="true">↪</span> Log out
                    </button>
                  </section>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      {showSitesModal && (
        <div className="profile-modal-backdrop" onMouseDown={() => setShowSitesModal(false)}>
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-sites-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-header">
              <div>
                <span className="profile-eyebrow">MORE TO EXPLORE</span>
                <h2 id="profile-sites-title">Our other projects</h2>
              </div>
              <button type="button" className="profile-icon-btn" onClick={() => setShowSitesModal(false)} aria-label="Close projects">
                ×
              </button>
            </div>
            <p className="profile-modal-description">Take a look at these other applications and projects.</p>
            <div className="profile-sites-list">
              {SITES.map((site) => (
                <a
                  className="profile-site-link"
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={site.name}
                >
                  <span className="profile-site-icon">{site.icon}</span>
                  <span className="profile-site-copy">
                    <strong>{site.name}</strong>
                    <small>{site.description}</small>
                    <small className="profile-site-url">{site.url}</small>
                  </span>
                  <span className="profile-chevron" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <div className="profile-modal-footer">
              <button type="button" className="profile-btn profile-btn-light" onClick={() => setShowSitesModal(false)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {showShareModal && (
        <div className="profile-modal-backdrop" onMouseDown={() => setShowShareModal(false)}>
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-share-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-header">
              <div>
                <span className="profile-eyebrow">SPREAD THE WORD</span>
                <h2 id="profile-share-title">Share with friends</h2>
              </div>
              <button type="button" className="profile-icon-btn" onClick={() => setShowShareModal(false)} aria-label="Close sharing options">
                ×
              </button>
            </div>
            <p className="profile-modal-description">
              Help friends keep track of their spending and manage their money.
            </p>
            <label className="profile-field profile-share-field">
              <span>App link</span>
              <div className="profile-copy-field">
                <input type="text" value={appLink} readOnly aria-label="App link" />
                <button type="button" className="profile-btn profile-btn-primary" onClick={copyToClipboard}>
                  Copy link
                </button>
              </div>
            </label>
            <div className="profile-share-options">
              <button type="button" onClick={shareViaWhatsApp}><span>📱</span> WhatsApp</button>
              <button type="button" onClick={shareViaTelegram}><span>✈️</span> Telegram</button>
              <button type="button" onClick={shareViaEmail}><span>✉️</span> Email</button>
              <button type="button" onClick={shareViaSMS}><span>💬</span> SMS</button>
            </div>
            <div className="profile-modal-footer">
              <button type="button" className="profile-btn profile-btn-light" onClick={() => setShowShareModal(false)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </SwipeWrapper>
  );
};

export default Profile;
