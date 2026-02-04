import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { haptic } from "../utils/haptics";
import { useEffect } from "react";

const SwipeWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    "/dashboard",
    "/charts",
    "/add-expense",
    "/reports",
    "/profile",
  ];

  const currentIndex = pages.indexOf(location.pathname);

  // Original Framer Motion swipe handler
  const swipe = (_, info) => {
    if (info.velocity.x < -500 && currentIndex < pages.length - 1) {
      haptic(15);
      navigate(pages[currentIndex + 1]);
    }

    if (info.velocity.x > 500 && currentIndex > 0) {
      haptic(15);
      navigate(pages[currentIndex - 1]);
    }
  };

  // Touch/swipe gesture detection for non-Framer Motion areas
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
        if (diffX > 0 && currentIndex < pages.length - 1) {
          // Swipe left (go right)
          haptic(15);
          navigate(pages[currentIndex + 1]);
        } else if (diffX < 0 && currentIndex > 0) {
          // Swipe right (go left)
          haptic(15);
          navigate(pages[currentIndex - 1]);
        }
      }

      startX = 0;
      startY = 0;
    };

    // Add keyboard navigation (Arrow keys)
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        haptic(15);
        navigate(pages[currentIndex - 1]);
      } else if (e.key === "ArrowRight" && currentIndex < pages.length - 1) {
        haptic(15);
        navigate(pages[currentIndex + 1]);
      }
    };

    // Add event listeners for touch gestures
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, navigate]);

  return (
    <>
      {/* Original Framer Motion swipe area */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={swipe}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{ 
          minHeight: "100vh",
          position: "relative",
          touchAction: "pan-y", // Allows vertical scrolling while preserving horizontal swipe
        }}
      >
        {children}
      </motion.div>

      {/* Optional: Swipe indicators for UX */}
      {/* <div style={{
        position: "fixed",
        top: "50%",
        left: "16px",
        transform: "translateY(-50%)",
        opacity: currentIndex > 0 ? 0.5 : 0.2,
        pointerEvents: "none",
        zIndex: 999,
        transition: "opacity 0.2s",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: "var(--primary)",
        }}>
          ←
        </div>
      </div>

      <div style={{
        position: "fixed",
        top: "50%",
        right: "16px",
        transform: "translateY(-50%)",
        opacity: currentIndex < pages.length - 1 ? 0.5 : 0.2,
        pointerEvents: "none",
        zIndex: 999,
        transition: "opacity 0.2s",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: "var(--primary)",
        }}>
          →
        </div>
      </div> */}
    </>
  );
};

export default SwipeWrapper;