import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const logout = () => {
    if (!window.confirm("Logout and clear all data?")) return;
    localStorage.clear();
    navigate("/onboarding");
  };

  return (
    <div className="container py-4" style={{ maxWidth: "420px" }}>
      <div className="card p-4">
        <h4 className="mb-3">Settings</h4>

        <div
          className="p-3 border-bottom"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/user-details")}
        >
          👤 User Details
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
  onClick={() => navigate("/budgets")}
>
  📊 Category Budgets
</div>


        <div
          className="p-3 text-danger"
          style={{ cursor: "pointer" }}
          onClick={logout}
        >
          🚪 Logout
        </div>
      </div>
    </div>
  );
};

export default Settings;
