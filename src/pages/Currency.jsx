import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const currencies = [
  { code: "INR", label: "Indian Rupee ₹" },
  { code: "USD", label: "US Dollar $" },
  { code: "EUR", label: "Euro €" },
  { code: "JPY", label: "Japanese Yen ¥" },
  { code: "CNY", label: "Chinese Yuan ¥" },
];

const Currency = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("INR");

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved) setSelected(saved);
  }, []);

  const save = () => {
    localStorage.setItem("currency", selected);
    alert("Currency updated");
    navigate("/settings");
  };

  return (
    <div className="container py-4" style={{ maxWidth: "420px" }}>
      <div className="card p-4">
        <h4 className="mb-3">Select Currency</h4>

        {currencies.map((c) => (
          <div key={c.code} className="form-check mb-2">
            <input
              type="radio"
              className="form-check-input"
              checked={selected === c.code}
              onChange={() => setSelected(c.code)}
            />
            <label className="form-check-label">{c.label}</label>
          </div>
        ))}

        <button className="btn btn-primary w-100 mt-3" onClick={save}>
          Save Currency
        </button>
      </div>
    </div>
  );
};

export default Currency;
