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
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth } from "../firebase";

const Onboarding = () => {
  const navigate = useNavigate();

  const [phone,setPhone] = useState("");
  const [otp,setOtp] = useState("");
  const [step,setStep] = useState("login"); // login | otp

  /* -------- Google Login -------- */

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    localStorage.setItem("user", JSON.stringify({
      name: res.user.displayName,
      email: res.user.email,
      uid: res.user.uid,
      incomeType: "monthly",
      incomeAmount: 0
    }));

    navigate("/dashboard");
  };

  /* -------- Phone Login -------- */

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha",
      { size: "invisible" },
      auth
    );
  };

  const sendOTP = async () => {
    if(!phone) return;

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    const result = await signInWithPhoneNumber(auth, phone, appVerifier);
    window.confirmationResult = result;
    setStep("otp");
  };

  const verifyOTP = async () => {
    const res = await window.confirmationResult.confirm(otp);

    localStorage.setItem("user", JSON.stringify({
      name: "User",
      phone: res.user.phoneNumber,
      uid: res.user.uid,
      incomeType: "monthly",
      incomeAmount: 0
    }));

    navigate("/dashboard");
  };

  return (
    <div className="min-vh-100 dashboard-bg d-flex align-items-center">
      <div className="container" style={{maxWidth:"420px"}}>

        <div className="card p-4">

          <h4 className="text-center mb-4" style={{color:"var(--primary)"}}>
            Welcome
          </h4>

          {/* GOOGLE */}
          <button className="btn btn-primary w-100 mb-3" onClick={loginGoogle}>
            Continue with Google
          </button>

          <div className="text-center text-muted mb-3">or</div>

          {/* PHONE */}
          {step==="login" && (
            <>
              <input
                className="form-control mb-2"
                placeholder="+91XXXXXXXXXX"
                value={phone}
                onChange={e=>setPhone(e.target.value)}
              />

              <button className="btn btn-outline-secondary w-100" onClick={sendOTP}>
                Send OTP
              </button>
            </>
          )}

          {step==="otp" && (
            <>
              <input
                className="form-control mb-2"
                placeholder="Enter OTP"
                value={otp}
                onChange={e=>setOtp(e.target.value)}
              />

              <button className="btn btn-primary w-100" onClick={verifyOTP}>
                Verify OTP
              </button>
            </>
          )}

          <div id="recaptcha"></div>

        </div>
      </div>
    </div>
  );
};

export default Onboarding;

