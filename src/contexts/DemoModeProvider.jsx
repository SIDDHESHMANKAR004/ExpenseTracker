import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DemoModeContext } from "./DemoContext";
import { isDemoMode } from "../utils/demoMode";
import "./DemoMode.css";

export function DemoModeProvider({ children }) {
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(isDemoMode);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  const value = useMemo(
    () => ({
      isDemo,
      enterDemo: () => {
        sessionStorage.setItem("appMode", "demo");
        setIsDemo(true);
        navigate("/dashboard");
      },
      exitDemo: () => {
        sessionStorage.removeItem("appMode");
        setIsDemo(false);
        setShowUnlockDialog(false);
        navigate("/", { state: { fromDemo: true } });
      },
      requireSignIn: () => setShowUnlockDialog(true),
    }),
    [isDemo, navigate],
  );

  const startAuthentication = (mode) => {
    sessionStorage.removeItem("appMode");
    sessionStorage.removeItem("uid");
    setIsDemo(false);
    setShowUnlockDialog(false);
    navigate(`/onboarding?mode=${mode}`);
  };

  return (
    <DemoModeContext.Provider value={value}>
      {children}
      {showUnlockDialog && (
        <div
          className="demo-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowUnlockDialog(false);
            }
          }}
        >
          <section
            className="demo-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-dialog-title"
          >
            <span className="demo-dialog__icon" aria-hidden="true">🔒</span>
            <p className="demo-dialog__eyebrow">MONEYVERGE DEMO</p>
            <h2 id="demo-dialog-title">Unlock your money dashboard</h2>
            <p>
              You&apos;re exploring sample information. Create an account or log
              in to save and manage your own finances.
            </p>
            <ul>
              <li>Add and manage transactions</li>
              <li>Create custom budgets and manage income</li>
              <li>Save your personal financial information</li>
            </ul>
            <div className="demo-dialog__actions">
              <button type="button" onClick={() => startAuthentication("signup")}>
                Create account
              </button>
              <button
                type="button"
                className="demo-dialog__login"
                onClick={() => startAuthentication("login")}
              >
                Log in
              </button>
              <button
                type="button"
                className="demo-dialog__continue"
                onClick={() => setShowUnlockDialog(false)}
              >
                Continue exploring
              </button>
            </div>
          </section>
        </div>
      )}
    </DemoModeContext.Provider>
  );
}
