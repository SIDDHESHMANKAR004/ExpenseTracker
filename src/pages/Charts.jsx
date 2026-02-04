import SwipeWrapper from "../components/SwipeWrapper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getSymbol } from "../utils/currency";
import { getUser, getExpenses } from "../services/db";

ChartJS.register(ArcElement, Tooltip, Legend);

const Charts = () => {
  const navigate = useNavigate();
  const symbol = getSymbol();
  const [loading, setLoading] = useState(true);

  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);

  const uid = sessionStorage.getItem("uid");

  const css = getComputedStyle(document.documentElement);
  const PRIMARY = css.getPropertyValue("--primary").trim();
  const EXPENSE = css.getPropertyValue("--expense").trim();

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const load = async () => {
      try {
        const u = await getUser(uid);
        const e = await getExpenses(uid);

        setUser(u);
        setExpenses(e || []);
      } catch (error) {
        console.error("Error loading charts data:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid, navigate]);

  // Loading state
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

  // If no user found
  if (!user) return null;

  /* EMPTY STATE */
  if (expenses.length === 0)
    return (
      <SwipeWrapper>
        <div className="min-vh-100 dashboard-bg d-flex align-items-center justify-content-center">
          <div className="text-center empty-state">
            <div style={{ fontSize: "72px" }}>📊</div>

            <h3 className="mt-3" style={{ color: "var(--primary)" }}>
              No records yet
            </h3>

            <p className="text-muted mb-4">
              Start adding expenses to see your spending insights.
            </p>

            <button
              className="btn btn-primary px-4"
              onClick={() => navigate("/add-expense")}
            >
              Add your first expense
            </button>
          </div>
        </div>
      </SwipeWrapper>
    );

  const income = Number(user.incomeAmount || 0);

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const remainingIncome = Math.max(income - totalSpent, 0);

  const labels = ["Spent", "Remaining"];
  const dataValues = [totalSpent, remainingIncome];

  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [EXPENSE, PRIMARY],
        borderWidth: 0,
        borderRadius: 20,
        spacing: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percentage = income ? ((value / income) * 100).toFixed(1) : 0;
            return `${context.label}: ${symbol}${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <SwipeWrapper>
      <div className="min-vh-100 dashboard-bg">
        <div
          className="container py-4"
          style={{ maxWidth: "720px", paddingBottom: "90px" }}
        >
          <div className="card p-4">
            <div className="text-center mb-3">
              <h4 style={{ color: "var(--primary)" }}>Expense Distribution</h4>
              <small className="text-muted">Track your budget health</small>
            </div>

            <div className="row text-center my-4">
              <div className="col-4">
                <div className="text-muted">Income</div>
                <div style={{ color: "var(--success)", fontWeight: 600 }}>
                  {symbol}
                  {income}
                </div>
              </div>

              <div className="col-4">
                <div className="text-muted">Spent</div>
                <div style={{ color: "var(--expense)", fontWeight: 600 }}>
                  {symbol}
                  {totalSpent}
                </div>
              </div>

              <div className="col-4">
                <div className="text-muted">Remaining</div>
                <div style={{ color: "var(--primary)", fontWeight: 600 }}>
                  {symbol}
                  {remainingIncome}
                </div>
              </div>
            </div>

            <hr />

            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "min(320px, 70vw)" }}
            >
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </SwipeWrapper>
  );
};

export default Charts;
