// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Onboarding = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     incomeType: "monthly",
//     incomeAmount: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     const { name, phone, email, incomeAmount } = form;

//     if (!name || !phone || !email || !incomeAmount) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     localStorage.setItem("user", JSON.stringify(form));
//     localStorage.setItem("expenses", JSON.stringify([]));

//     navigate("/profile");
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center min-vh-100">
//       <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: "520px" }}>
//         <h3 className="text-center mb-3" style={{ color: "#4c7c59" }}>
//           Welcome 👋
//         </h3>

//         <p className="text-center mb-4">
//           Let’s set up your expense tracker in one step.
//         </p>

//         <div className="mb-3">
//           <label className="form-label">Full Name</label>
//           <input
//             className="form-control"
//             name="name"
//             placeholder="Enter your name"
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Mobile Number</label>
//           <input
//             className="form-control"
//             name="phone"
//             placeholder="Enter your phone number"
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Email Address</label>
//           <input
//             type="email"
//             className="form-control"
//             name="email"
//             placeholder="Enter your email"
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Income Type</label>
//           <select
//             className="form-select"
//             name="incomeType"
//             onChange={handleChange}
//           >
//             <option value="monthly">Monthly Income</option>
//             <option value="yearly">Yearly Income</option>
//             <option value="yearly">weekly Income</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="form-label">Income Amount</label>
//           <input
//             type="number"
//             className="form-control"
//             name="incomeAmount"
//             placeholder="Enter amount"
//             onChange={handleChange}
//           />
//         </div>

//         <button className="btn btn-primary w-100" onClick={handleSubmit}>
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Onboarding;
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

const Onboarding = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* -------- Google Login -------- */

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: res.user.displayName,
        email: res.user.email,
        uid: res.user.uid,
        incomeType: "monthly",
        incomeAmount: 0
      })
    );

    navigate("/dashboard");
  };

  /* -------- Signup -------- */

  const signup = async () => {
    const { name, email, phone, password } = form;
    if (!name || !email || !password) return alert("Fill all required fields");

    const res = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(res.user, { displayName: name });

    localStorage.setItem(
      "user",
      JSON.stringify({
        name,
        email,
        phone,
        uid: res.user.uid,
        incomeType: "monthly",
        incomeAmount: 0
      })
    );

    setMode("login");
    alert("Signup successful. Please login.");
  };

  /* -------- Login -------- */

  const login = async () => {
    const { email, password } = form;
    if (!email || !password) return alert("Enter email and password");

    const res = await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: res.user.displayName || "User",
        email: res.user.email,
        uid: res.user.uid,
        incomeType: "monthly",
        incomeAmount: 0
      })
    );

    navigate("/dashboard");
  };

  return (
  <div className="min-vh-100 d-flex flex-column">

    {/* ===== TOP BRAND HEADER ===== */}
    <div
      style={{
        height: "35vh",
        background: "linear-gradient(135deg,var(--brand-start),var(--brand-end))",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <h2 className="fw-bold mb-1">Expense Tracker</h2>
      <p className="opacity-75 mb-0">
        Track smarter. Spend better.
      </p>
    </div>

    {/* ===== CENTER CARD ===== */}
    <div
      style={{
        marginTop: "-80px",
        flex: 1,
        display: "flex",
        justifyContent: "center",
        padding: "0 12px"
      }}
    >
      <div className="container" style={{ maxWidth: "420px" }}>
        <div className="card p-4">

          <h4 className="text-center mb-3" style={{ color: "var(--primary)" }}>
            {mode === "login" ? "Login" : "Sign Up"}
          </h4>

          {/* Google */}
          <button className="btn btn-primary w-100 mb-3" onClick={loginGoogle}>
            Continue with Google
          </button>

          <div className="text-center text-muted mb-3">or</div>

          {/* Signup Fields */}
          {mode === "signup" && (
            <>
              <input
                className="form-control mb-2"
                placeholder="John Wick"
                name="name"
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                placeholder="89********"
                name="phone"
                onChange={handleChange}
              />
            </>
          )}

          {/* Shared Fields */}
          <input
            className="form-control mb-2"
            placeholder="Example@gmail.com"
            name="email"
            onChange={handleChange}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />

          {mode === "login" ? (
            <button className="btn btn-primary w-100" onClick={login}>
              Login
            </button>
          ) : (
            <button className="btn btn-primary w-100" onClick={signup}>
              Create Account
            </button>
          )}

          {/* Toggle */}
          <div className="text-center mt-3">
            {mode === "login" ? (
              <small>
                Don’t have an account?{" "}
                <span
                  style={{ color: "var(--primary)", cursor: "pointer" }}
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </span>
              </small>
            ) : (
              <small>
                Already have an account?{" "}
                <span
                  style={{ color: "var(--primary)", cursor: "pointer" }}
                  onClick={() => setMode("login")}
                >
                  Login
                </span>
              </small>
            )}
          </div>

        </div>
      </div>
    </div>

    {/* ===== BOTTOM FOOTER ===== */}
    <div
      style={{
        textAlign: "center",
        padding: "14px",
        fontSize: "12px",
        color: "var(--muted)"
      }}
    >
      Secure login • Your data stays on your device
    </div>

  </div>
);

};

export default Onboarding;

