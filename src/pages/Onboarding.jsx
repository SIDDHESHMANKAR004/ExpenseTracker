import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    incomeType: "monthly",
    incomeAmount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { name, phone, email, incomeAmount } = form;

    if (!name || !phone || !email || !incomeAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(form));
    localStorage.setItem("expenses", JSON.stringify([]));

    navigate("/profile");
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: "520px" }}>
        <h3 className="text-center mb-3" style={{ color: "#4c7c59" }}>
          Welcome 👋
        </h3>

        <p className="text-center mb-4">
          Let’s set up your expense tracker in one step.
        </p>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            className="form-control"
            name="phone"
            placeholder="Enter your phone number"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Income Type</label>
          <select
            className="form-select"
            name="incomeType"
            onChange={handleChange}
          >
            <option value="monthly">Monthly Income</option>
            <option value="yearly">Yearly Income</option>
            <option value="yearly">weekly Income</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Income Amount</label>
          <input
            type="number"
            className="form-control"
            name="incomeAmount"
            placeholder="Enter amount"
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleSubmit}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
