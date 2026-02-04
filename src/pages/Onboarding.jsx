
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

import { auth } from "../firebase";
import { saveUser } from "../services/db";

const Onboarding = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------- Google Login ---------- */

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    await saveUser(res.user.uid, {
      name: res.user.displayName,
      email: res.user.email,
      phone: "",
      incomeType: "monthly",
      incomeAmount: 0
    });

    sessionStorage.setItem("uid", res.user.uid);
    navigate("/dashboard");
  };

  /* ---------- Signup ---------- */

  const signup = async () => {
    const { name, email, phone, password } = form;
    if (!name || !email || !password) return alert("Fill required fields");

    const res = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(res.user, { displayName: name });

    await saveUser(res.user.uid, {
      name,
      email,
      phone,
      incomeType: "monthly",
      incomeAmount: 0
    });

    alert("Account created. Please login.");
    setMode("login");
  };

  /* ---------- Login ---------- */

  const login = async () => {
    const { email, password } = form;
    if (!email || !password) return alert("Enter credentials");

    const res = await signInWithEmailAndPassword(auth, email, password);

    sessionStorage.setItem("uid", res.user.uid);
    navigate("/dashboard");
  };

  return (
    <div className="min-vh-100 d-flex flex-column">

      {/* Header */}
      <div
        style={{
          height: "35vh",
          background: "linear-gradient(135deg,var(--brand-start),var(--brand-end))",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h2>Expense Tracker</h2>
        <small>Track smarter. Spend better.</small>
      </div>

      {/* Card */}
      <div style={{ marginTop: "-80px", flex: 1 }}>
        <div className="container" style={{ maxWidth: "420px" }}>
          <div className="card p-4">

            <h4 className="text-center mb-3">
              {mode === "login" ? "Login" : "Sign Up"}
            </h4>

            <button className="btn btn-primary w-100 mb-3" onClick={loginGoogle}>
              Continue with Google
            </button>

            <div className="text-center text-muted mb-3">or</div>

            {mode === "signup" && (
              <>
                <input className="form-control mb-2" placeholder="Full Name" name="name" onChange={handleChange} />
                <input className="form-control mb-2" placeholder="Phone" name="phone" onChange={handleChange} />
              </>
            )}

            <input className="form-control mb-2" placeholder="Email" name="email" onChange={handleChange} />
            <input type="password" className="form-control mb-3" placeholder="Password" name="password" onChange={handleChange} />

            {mode === "login" ? (
              <button className="btn btn-primary w-100" onClick={login}>Login</button>
            ) : (
              <button className="btn btn-primary w-100" onClick={signup}>Create Account</button>
            )}

            <div className="text-center mt-3">
              {mode === "login" ? (
                <small>
                  No account?{" "}
                  <span style={{ color: "var(--primary)", cursor: "pointer" }} onClick={() => setMode("signup")}>
                    Sign up
                  </span>
                </small>
              ) : (
                <small>
                  Already registered?{" "}
                  <span style={{ color: "var(--primary)", cursor: "pointer" }} onClick={() => setMode("login")}>
                    Login
                  </span>
                </small>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="text-center text-muted py-2">Secure cloud login</div>
    </div>
  );
};

export default Onboarding;
