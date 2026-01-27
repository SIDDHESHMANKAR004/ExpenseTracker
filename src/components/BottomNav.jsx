import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "var(--primary)" : "#94A3B8";

  const commonItemStyle = {
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    textAlign: "center",
    fontSize: "12px"
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "#0F172A",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      {/* Dashboard */}
      <div
        onClick={(e) => handleNavClick(e, "/dashboard")}
        style={{ ...commonItemStyle, color: isActive("/dashboard") }}
      >
        <div style={{ fontSize: "18px" }}>🏠</div>
        <div>Home</div>
      </div>

      {/* Charts */}
      <div
        onClick={(e) => handleNavClick(e, "/charts")}
        style={{ ...commonItemStyle, color: isActive("/charts") }}
      >
        <div style={{ fontSize: "18px" }}>📊</div>
        <div>Charts</div>
      </div>

      {/* Center Add */}
      <div
        onClick={(e) => handleNavClick(e, "/add-expense")}
        style={{
          width: "56px",
          height: "56px",
          background: "linear-gradient(135deg,var(--brand-start),var(--brand-end))",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-32px",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(37,99,235,.45)",
          fontSize: "26px",
          color: "white"
        }}
      >
        +
      </div>

      {/* Reports */}
      <div
        onClick={(e) => handleNavClick(e, "/reports")}
        style={{ ...commonItemStyle, color: isActive("/reports") }}
      >
        <div style={{ fontSize: "18px" }}>📄</div>
        <div>Reports</div>
      </div>

      {/* Profile */}
      <div
        onClick={(e) => handleNavClick(e, "/profile")}
        style={{ ...commonItemStyle, color: isActive("/profile") }}
      >
        <div style={{ fontSize: "18px" }}>👤</div>
        <div>Me</div>
      </div>
    </div>
  );
};

export default BottomNav;
