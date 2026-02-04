import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const order = ["/dashboard", "/charts", "/reports", "/profile"];

const SwipeWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const index = order.indexOf(location.pathname);

  const swipe = (_, info) => {
    if (info.offset.x < -120 && index < order.length - 1) {
      navigate(order[index + 1]);
    }

    if (info.offset.x > 120 && index > 0) {
      navigate(order[index - 1]);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={swipe}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
};

export default SwipeWrapper;
