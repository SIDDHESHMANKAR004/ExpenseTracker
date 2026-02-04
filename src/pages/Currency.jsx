import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrency, saveCurrency } from "../services/db";
import Loader from "../components/Loader";

const Currency = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);

  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const loadCurrency = async () => {
      const currency = await getCurrency(uid);
      setSelectedCurrency(currency);
      setLoading(false);
    };

    loadCurrency();
  }, [uid, navigate]);

  const handleSave = async () => {
    if (!uid) return;
    
    await saveCurrency(uid, selectedCurrency);
    alert("Currency saved!");
    navigate(-1); // Go back to previous page
  };

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  ];

  if (loading) return <Loader />;

  return (
    <div className="container py-4" style={{ maxWidth: "420px" }}>
      <div className="card p-4">
        <h4 className="mb-3">Select Currency</h4>
        
        <div className="mb-3">
          <label className="form-label">Choose your preferred currency:</label>
          <select
            className="form-select"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} - {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 p-3 border rounded">
          <small className="text-muted">Preview:</small>
          <div className="mt-1">
            <strong>100 {selectedCurrency}</strong> will display as:{" "}
            <span className="text-primary">
              {currencies.find(c => c.code === selectedCurrency)?.symbol}100
            </span>
          </div>
        </div>

        <button className="btn btn-primary w-100 mb-2" onClick={handleSave}>
          Save Currency
        </button>
        
        <button className="btn btn-outline-secondary w-100" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Currency;