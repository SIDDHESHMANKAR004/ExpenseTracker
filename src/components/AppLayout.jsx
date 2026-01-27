import BottomNav from "./BottomNav";

const AppLayout = ({ children }) => {
  return (
    <div style={{ paddingBottom: "80px" }}>
      {children}
      <BottomNav />
    </div>
  );
};

export default AppLayout;
