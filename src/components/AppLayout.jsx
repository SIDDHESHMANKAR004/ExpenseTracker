import BottomNav from "./BottomNav";
import { useDemoMode } from "../hooks/useDemoMode";

const AppLayout = ({ children }) => {
  const { isDemo, exitDemo } = useDemoMode();

  return (
    <div style={{ paddingBottom: "80px" }}>
      {isDemo && (
        <div className="demo-mode-bar">
          <span className="demo-mode-bar__badge">DEMO MODE</span>
          <span>Sample data · changes are disabled</span>
          <button type="button" onClick={exitDemo}>Exit demo</button>
        </div>
      )}
      {children}
      <BottomNav />
    </div>
  );
};

export default AppLayout;
