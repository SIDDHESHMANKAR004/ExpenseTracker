import { useContext } from "react";
import { DemoModeContext } from "../contexts/DemoContext";

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error("useDemoMode must be used within DemoModeProvider");
  }
  return context;
}
