import SwipeWrapper from "../components/SwipeWrapper";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getSymbol } from "../utils/currency";
import { getUser, getExpenses } from "../services/db";
import Loader from "../components/Loader";
import { haptic } from "../utils/haptics";

ChartJS.register(ArcElement, Tooltip, Legend);

const Charts = () => {
  const navigate = useNavigate();
  const symbol = getSymbol();
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [zoomedIn, setZoomedIn] = useState(false);

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
              <Loader />
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
              onClick={() => {
                haptic(25);
                navigate("/add-expense");
              }}
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

  // Group expenses by category for detailed view
  const categoryTotals = {};
  expenses.forEach(exp => {
    const category = exp.category || 'Other';
    categoryTotals[category] = (categoryTotals[category] || 0) + Number(exp.amount || 0);
  });

  // Create data for zoomed view (category breakdown)
  const categoriesData = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Top 8 categories

  // Main chart data (Spent vs Remaining)
  const mainLabels = ["Spent", "Remaining"];
  const mainDataValues = [totalSpent, remainingIncome];
  const mainColors = [EXPENSE, PRIMARY];

  // Detailed chart data (Category breakdown)
  const detailLabels = categoriesData.map(([category]) => category);
  const detailDataValues = categoriesData.map(([, amount]) => amount);
  const detailColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
    "#9966FF", "#FF9F40", "#8AC926", "#1982C4"
  ];

  // Determine which data to show
  const showData = selectedSlice === null 
    ? { labels: mainLabels, data: mainDataValues, colors: mainColors }
    : selectedSlice === "Spent"
    ? { labels: detailLabels, data: detailDataValues, colors: detailColors }
    : { labels: ["Remaining"], data: [remainingIncome], colors: [PRIMARY] };

  const chartData = {
    labels: showData.labels,
    datasets: [
      {
        data: showData.data,
        backgroundColor: showData.colors,
        borderWidth: 0,
        borderRadius: 20,
        spacing: 4,
        hoverOffset: zoomedIn ? 20 : 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    cutout: zoomedIn ? "30%" : "70%", // Smaller hole when zoomed
    plugins: {
      legend: {
        position: "bottom",
        display: !zoomedIn, // Hide legend when zoomed in
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            let percentage = 0;
            
            if (selectedSlice === null) {
              percentage = income ? ((value / income) * 100).toFixed(1) : 0;
            } else if (selectedSlice === "Spent") {
              percentage = totalSpent ? ((value / totalSpent) * 100).toFixed(1) : 0;
            } else {
              percentage = remainingIncome ? ((value / remainingIncome) * 100).toFixed(1) : 0;
            }
            
            return `${context.label}: ${symbol}${value} (${percentage}%)`;
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chartData.labels[index];
        
        haptic(20);
        
        if (!zoomedIn) {
          // Zoom in
          setSelectedSlice(label);
          setZoomedIn(true);
        } else {
          // If already zoomed, click again to zoom out
          setSelectedSlice(null);
          setZoomedIn(false);
        }
      }
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        event.native.target.style.cursor = 'pointer';
      } else {
        event.native.target.style.cursor = 'default';
      }
    },
  };

  const handleResetZoom = () => {
    setSelectedSlice(null);
    setZoomedIn(false);
    haptic(15);
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
              <h4 style={{ color: "var(--primary)" }}>
                {zoomedIn ? `📊 ${selectedSlice} Details` : "Expense Distribution"}
              </h4>
            
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
                <div style={{ color: EXPENSE, fontWeight: 600 }}>
                  {symbol}
                  {totalSpent}
                </div>
              </div>

              <div className="col-4">
                <div className="text-muted">Remaining</div>
                <div style={{ color: PRIMARY, fontWeight: 600 }}>
                  {symbol}
                  {remainingIncome}
                </div>
              </div>
            </div>

            <hr />

            {/* Chart Container */}
            <div
              className="d-flex flex-column justify-content-center align-items-center"
              style={{ height: "min(400px, 70vw)" }}
            >
              {/* Zoom indicator */}
             

              {/* The Chart */}
              <Doughnut 
                ref={chartRef}
                data={chartData} 
                options={chartOptions}
                style={{ cursor: 'pointer' }}
              />

              
            </div>

            {/* Category breakdown when viewing "Spent" zoom */}
            {selectedSlice === "Spent" && zoomedIn && (
              <div className="mt-4">
                <h6 className="mb-2">Category Breakdown</h6>
                <div className="row g-2">
                  {categoriesData.map(([category, amount], index) => (
                    <div key={category} className="col-6">
                      <div className="card p-2 d-flex flex-row align-items-center">
                        <div 
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: detailColors[index % detailColors.length],
                            marginRight: "8px",
                          }}
                        />
                        <div className="flex-grow-1">
                          <small className="d-block">{category}</small>
                          <small className="text-muted">
                            {symbol}{amount} 
                            ({totalSpent ? ((amount / totalSpent) * 100).toFixed(1) : 0}%)
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SwipeWrapper>
  );
};

export default Charts;