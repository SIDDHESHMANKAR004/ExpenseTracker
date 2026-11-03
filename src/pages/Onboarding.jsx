import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  HiArrowRight,
  HiOutlineChartBar,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineLockClosed,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineUser,
  HiShieldCheck,
} from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";

import { auth } from "../firebase";
import { saveUser } from "../services/db";
import "./Onboarding.css";

const Onboarding = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(
    new URLSearchParams(window.location.search).get("mode") === "signup"
      ? "signup"
      : "login",
  );
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------- Google Login ---------- */

  const loginGoogle = async () => {
    sessionStorage.removeItem("uid");
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    await saveUser(res.user.uid, {
      name: res.user.displayName,
      email: res.user.email,
      phone: "",
      incomeType: "monthly",
    });

    sessionStorage.removeItem("appMode");
    sessionStorage.setItem("uid", res.user.uid);
    navigate("/dashboard");
  };

  /* ---------- Signup ---------- */

  const signup = async () => {
    sessionStorage.removeItem("uid");
    const { name, email, phone, password } = form;
    if (!name || !email || !password) return alert("Fill required fields");

    const res = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(res.user, { displayName: name });

    await saveUser(res.user.uid, {
      name,
      email,
      phone,
      incomeType: "monthly",
    });

    alert("Account created. Please login.");
    setMode("login");
  };

  /* ---------- Login ---------- */

  const login = async () => {
    sessionStorage.removeItem("uid");
    const { email, password } = form;
    if (!email || !password) return alert("Enter credentials");

    const res = await signInWithEmailAndPassword(auth, email, password);

    sessionStorage.setItem("uid", res.user.uid);
    sessionStorage.setItem("uid", res.user.uid);
    navigate("/dashboard");
  };

  return (
    <main className="auth-page">
      <section className="auth-brand" aria-label="Expense Tracker introduction">
        <Link to="/" className="auth-brand__logo">
          <span className="auth-brand__mark" aria-hidden="true">
            <HiOutlineChartBar />
          </span>
          <span>Expense Tracker</span>
        </Link>

        <div className="auth-brand__content">
          <span className="auth-brand__eyebrow">
            A clearer view of your money
          </span>
          <h1>
            Track smarter.
            <br />
            <span>Spend better.</span>
          </h1>
          <p>
            Make everyday money decisions with more confidence. Your expenses,
            budgets, and insights — together in one calm space.
          </p>

          <div className="auth-illustration" aria-hidden="true">
            <div className="auth-illustration__orb auth-illustration__orb--one" />
            <div className="auth-illustration__orb auth-illustration__orb--two" />
            <div className="auth-illustration__window">
              <div className="auth-illustration__window-top">
                <span />
                <span />
                <span />
                <i />
              </div>
              <div className="auth-illustration__window-body">
                <div className="auth-illustration__mini-card">
                  <span />
                  <b />
                  <i />
                </div>
                <div className="auth-illustration__mini-card auth-illustration__mini-card--accent">
                  <span />
                  <b />
                  <i />
                </div>
              </div>
              <div className="auth-illustration__chart">
                <div className="auth-illustration__chart-label">
                  <span />
                  <i />
                </div>
                <div className="auth-illustration__bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="auth-illustration__transaction">
                <span />
                <i />
                <b />
              </div>
            </div>
            <div className="auth-illustration__floating auth-illustration__floating--check">
              <HiShieldCheck />
              <span>Money, in focus</span>
            </div>
            <div className="auth-illustration__floating auth-illustration__floating--spark">
              <span>✦</span>
            </div>
          </div>
        </div>

        <ul className="auth-benefits">
          <li>
            <span><HiShieldCheck /></span>
            Track expenses effortlessly
          </li>
          <li>
            <span><HiOutlineChartBar /></span>
            Understand your spending
          </li>
          <li>
            <span>✓</span>
            Keep your budgets in view
          </li>
        </ul>

        <p className="auth-brand__footer">A simpler way to stay on top of it.</p>
      </section>

      <section className="auth-panel" aria-label="Account access">
        <div className="auth-panel__top">
          <span className="auth-panel__secure">
            <HiShieldCheck />
            Secure sign in
          </span>
          <Link to="/" className="auth-home-link">
            Back to home <HiArrowRight />
          </Link>
        </div>

        <div className="auth-card">
          <div className="auth-card__heading">
            <span className="auth-card__eyebrow">
              {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
            </span>
            <h2>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p>
              {mode === "login"
                ? "Sign in to pick up where you left off."
                : "A few details and you're ready to go."}
            </p>
          </div>

          <button
            className="auth-google-button"
            onClick={loginGoogle}
            type="button"
          >
            <FcGoogle aria-hidden="true" />
            Continue with Google
          </button>

          <div className="auth-divider" aria-hidden="true">
            <span />
            <small>OR CONTINUE WITH EMAIL</small>
            <span />
          </div>

          <div className="auth-form">
            {mode === "signup" && (
              <>
                <label className="auth-field">
                  <span>Full name</span>
                  <span className="auth-field__control">
                    <HiOutlineUser aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Your name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </span>
                </label>
                <label className="auth-field">
                  <span>Phone number <small>Optional</small></span>
                  <span className="auth-field__control">
                    <HiOutlinePhone aria-hidden="true" />
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </span>
                </label>
              </>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <span className="auth-field__control">
                <HiOutlineEnvelope aria-hidden="true" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </span>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <span className="auth-field__control">
                <HiOutlineLockClosed aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                <button
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  type="button"
                >
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </span>
            </label>

            <button
              className="auth-submit"
              onClick={mode === "login" ? login : signup}
              type="button"
            >
              {mode === "login" ? "Sign in" : "Create account"}
              <HiArrowRight aria-hidden="true" />
            </button>
          </div>

          <div className="auth-mode-switch">
            {mode === "login" ? (
              <>
                <span>New to Expense Tracker?</span>
                <button onClick={() => setMode("signup")} type="button">
                  Create an account
                </button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <button onClick={() => setMode("login")} type="button">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <footer className="auth-panel__footer">
          <span><HiShieldCheck /> Your information is securely protected</span>
          <Link to="/">Back to home</Link>
        </footer>
      </section>
    </main>
  );
};

export default Onboarding;
