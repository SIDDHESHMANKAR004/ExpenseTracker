// import { useNavigate, useLocation } from "react-router-dom";

// const BottomNav = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isActive = (path) =>
//     location.pathname === path ? "var(--primary)" : "#94A3B8";

//   const commonItemStyle = {
//     cursor: "pointer",
//     userSelect: "none",
//     WebkitUserSelect: "none",
//     textAlign: "center",
//     fontSize: "12px",
//   };

//   const handleNavClick = (e, path) => {
//     e.preventDefault();
//     navigate(path);
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: "64px",
//         backgroundColor: "#0F172A",
//         display: "flex",
//         justifyContent: "space-around",
//         alignItems: "center",
//         zIndex: 1000,
//       }}
//     >
//       {/* Dashboard */}
//       <div
//         onClick={(e) => handleNavClick(e, "/dashboard")}
//         style={{ ...commonItemStyle, color: isActive("/dashboard") }}
//       >
//         <div style={{ fontSize: "18px" }}>🏠</div>
//         <div>Home</div>
//       </div>

//       {/* Charts */}
//       <div
//         onClick={(e) => handleNavClick(e, "/charts")}
//         style={{ ...commonItemStyle, color: isActive("/charts") }}
//       >
//         <div style={{ fontSize: "18px" }}>📊</div>
//         <div>Charts</div>
//       </div>

//       {/* Center Add */}
//       <div
//         onClick={(e) => handleNavClick(e, "/add-expense")}
//         style={{
//           width: "56px",
//           height: "56px",
//           background:
//             "linear-gradient(135deg,var(--brand-start),var(--brand-end))",
//           borderRadius: "50%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           marginTop: "-32px",
//           cursor: "pointer",
//           boxShadow: "0 8px 20px rgba(37,99,235,.45)",
//           fontSize: "26px",
//           color: "white",
//         }}
//       >
//         +
//       </div>

//       {/* Reports */}
//       <div
//         onClick={(e) => handleNavClick(e, "/reports")}
//         style={{ ...commonItemStyle, color: isActive("/reports") }}
//       >
//         <div style={{ fontSize: "18px" }}>📄</div>
//         <div>Reports</div>
//       </div>

//       {/* Profile */}
//       <div
//         onClick={(e) => handleNavClick(e, "/profile")}
//         style={{ ...commonItemStyle, color: isActive("/profile") }}
//       >
//         <div style={{ fontSize: "18px" }}>👤</div>
//         <div>Me</div>
//       </div>
//     </div>
//   );
// };

// export default BottomNav;


import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/charts", icon: "📊", label: "Charts" },
    { path: "/add-expense", icon: "+", label: "Add", isCenter: true },
    { path: "/reports", icon: "📄", label: "Reports" },
    { path: "/profile", icon: "👤", label: "Me" },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "80px",
        backgroundColor: "#0F172A",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "0 10px",
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        
        if (item.isCenter) {
          return (
            <motion.div
              key={item.path}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(item.path)}
              style={{
                width: "56px",
                height: "56px",
                background: active
                  ? "var(--primary)"
                  : "linear-gradient(135deg, var(--brand-start), var(--brand-end))",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-32px",
                cursor: "pointer",
                boxShadow: active
                  ? "0 8px 32px rgba(37, 99, 235, 0.6)"
                  : "0 8px 20px rgba(37, 99, 235, 0.45)",
                fontSize: "28px",
                color: "white",
                position: "relative",
              }}
            >
              {item.icon}
              {active && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "50%",
                    border: "2px solid var(--primary)",
                  }}
                />
              )}
            </motion.div>
          );
        }

        return (
          <motion.div
            key={item.path}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "12px",
              background: active ? "rgba(37, 99, 235, 0.1)" : "transparent",
            }}
          >
            <motion.div
              animate={{
                color: active ? "var(--primary)" : "#94A3B8",
                fontSize: active ? "20px" : "18px",
                y: active ? -2 : 0,
              }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: "4px" }}
            >
              {item.icon}
            </motion.div>
            
            <motion.div
              animate={{
                color: active ? "var(--primary)" : "#94A3B8",
                fontSize: active ? "12px" : "11px",
                fontWeight: active ? "600" : "400",
              }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.div>
            
            {active && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  position: "absolute",
                  bottom: "8px",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  boxShadow: "0 0 6px var(--primary)",
                }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default BottomNav;
