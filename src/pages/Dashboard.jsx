import SwipeWrapper from "../components/SwipeWrapper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSymbol } from "../utils/currency";
import { shouldWarnIncome, getHighestCategory } from "../utils/budget";
import { getUser, getExpenses } from "../services/db";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showWarning, setShowWarning] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const symbol = getSymbol();
  const uid = sessionStorage.getItem("uid");

  /* LOAD FIREBASE DATA */
  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const loadData = async () => {
      const firebaseUser = await getUser(uid);
      const firebaseExpenses = await getExpenses(uid);

      setUser(firebaseUser);
      setExpenses(firebaseExpenses || []);
      setLoading(false);
    };

    loadData();
  }, [uid, navigate]);

  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const income = Number(user?.incomeAmount || 0);
  const spentPercent = income ? (totalExpense / income) * 100 : 0;
  const timeReached = user
    ? shouldWarnIncome(user.incomeType, totalExpense)
    : false;

  /* WARNING EFFECT — MUST BE HERE */
  useEffect(() => {
    if (!user || expenses.length === 0) return;

    if (spentPercent >= 90 && timeReached) {
      setShowWarning(true);
    }
  }, [spentPercent, timeReached, user, expenses]);

  /* NOW SAFE TO RETURN */

if (loading) {
    return (
      <SwipeWrapper>
        <div className="min-vh-100 dashboard-bg d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              <loader />
            </span>
          </div>
        </div>
      </SwipeWrapper>
    );
  }
  const balance = income - totalExpense;
  const highest = getHighestCategory(expenses);

  const today = new Date();
  const month = today.toLocaleString("default", { month: "short" });
  const year = today.getFullYear();

  return (
    <SwipeWrapper>
      <div className="min-vh-100  dashboard-bg" style={{ paddingTop: "72px" }}>
        <div
          className="container py-3"
          style={{ maxWidth: "720px", paddingBottom: "90px" }}
        >
          {/* Summary Card */}
          <div
            className="card p-3 mb-3  fixed-top"
            style={{
              background: "linear-gradient(135deg,#2563EB,#1E40AF)",
              color: "white",
            }}
          >
            <div className="d-flex justify-content-between opacity-75">
              <span>{year}</span>
              <span>Expenses</span>
              <span>Income</span>
              <span>Balance</span>
            </div>

            <div className="d-flex justify-content-between fw-semibold mt-1">
              <span>{month}</span>

              <span>
                {symbol}
                {totalExpense}
              </span>

              <span>
                {symbol}
                {income}
              </span>

              <span>
                {symbol}
                {balance}
              </span>
            </div>
          </div>

          {/* Records */}
          {expenses.length === 0 ? (
            <div className="text-center text-muted mt-5">No records</div>
          ) : (
            expenses.map((e) => (
              <div
                key={e.id}
                className="card p-3 mb-2 d-flex justify-content-between flex-row align-items-center"
              >
                <div>
                  <div>{e.category}</div>
                  <small className="text-muted">{e.date}</small>
                </div>

                <div style={{ color: "var(--expense)" }}>
                  -{symbol}
                  {e.amount}
                </div>
              </div>
            ))
          )}

          {/* Warning Card */}
          {showWarning && spentPercent >= 90 && (
            <div
              className="card p-3 mb-3"
              style={{
                borderLeft: "6px solid var(--expense)",
                background: "var(--surface)",
              }}
            >
              <strong style={{ color: "var(--expense)" }}>
                ⚠ Budget Alert
              </strong>

              <div className="mt-2">
                You've used {spentPercent.toFixed(1)}% of your income.
              </div>

              <div className="text-muted">
                Most spent on: {highest.category}
              </div>

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowWarning(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    localStorage.setItem("hideBudgetWarning", "true");
                    setShowWarning(false);
                  }}
                >
                  Don't show again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SwipeWrapper>
  );
};

export default Dashboard;
