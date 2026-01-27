import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getSymbol } from "../utils/currency";

ChartJS.register(ArcElement, Tooltip, Legend);

const Charts = () => {
  const navigate = useNavigate();
  const symbol = getSymbol();
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const css = getComputedStyle(document.documentElement);

  const PRIMARY = css.getPropertyValue("--primary").trim();
  const EXPENSE = css.getPropertyValue("--expense").trim();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedExpenses = localStorage.getItem("expenses");

    if (!storedUser) {
      navigate("/onboarding");
      return;
    }

    if (!storedExpenses) {
      navigate("/add-expense");
      return;
    }

    setUser(JSON.parse(storedUser));
    setExpenses(JSON.parse(storedExpenses));
  }, [navigate]);

  if (!user || expenses.length === 0) return null;

  const income = Number(user.incomeAmount);

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const remainingIncome = Math.max(income - totalSpent, 0);

  const labels = ["Spent", "Remaining"];

  const dataValues = [totalSpent, remainingIncome];

  /* Modern palette for chart */
const backgroundColors = [
  EXPENSE,
  PRIMARY
];


  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
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
            const percentage = ((value / income) * 100).toFixed(1);
            return `${context.label}: ${symbol}${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="min-vh-100 dashboard-bg">
      <div
        className="container py-4"
        style={{ maxWidth: "720px", paddingBottom: "90px" }}
      >
        <div className="card p-4">
          {/* Header */}
          <div className="text-center mb-3">
            <h4 style={{ color: "var(--primary)" }}>Expense Distribution</h4>
            <small className="text-muted">Track your budget health</small>
          </div>

          {/* Stats */}
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

          {/* Doughnut */}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "min(320px, 70vw)" }}
          >
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
