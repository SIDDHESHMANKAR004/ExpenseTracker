import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line, PolarArea } from "react-chartjs-2";
import SwipeWrapper from "../components/SwipeWrapper";
import { getSymbol } from "../utils/currency";
import { getUser, getExpenses } from "../services/appData";
import { useDemoMode } from "../hooks/useDemoMode";
import { DEMO_DATA } from "../data/demoData";
import Loader from "../components/Loader";
import { haptic } from "../utils/haptics";
import "./Charts.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  PolarAreaController,
  RadialLinearScale,
  Tooltip,
);

const CATEGORY_COLORS = [
  "#2563eb",
  "#0f9d74",
  "#7c3aed",
  "#f59e0b",
  "#e8524b",
  "#0ea5e9",
  "#db2777",
  "#64748b",
];

const CATEGORY_ICONS = {
  bills: "📄",
  education: "📚",
  entertainment: "🎮",
  food: "🍔",
  groceries: "🛒",
  health: "💊",
  housing: "🏠",
  insurance: "🛡️",
  investment: "📈",
  other: "📦",
  "personal care": "💇",
  "gifts & donations": "🎁",
  savings: "💰",
  shopping: "🛍️",
  subscriptions: "📱",
  transport: "🚕",
  travel: "✈️",
  utilities: "💡",
};

const safeAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const formatDate = (date) => {
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00`)
    : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return {
    key: `${parsedDate.getFullYear()}-${String(
      parsedDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`,
    label: parsedDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    }),
    sortValue: parsedDate.getTime(),
  };
};

const Charts = () => {
  const navigate = useNavigate();
  const { isDemo } = useDemoMode();
  const symbol = getSymbol();
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [zoomedIn, setZoomedIn] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);

  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid && !isDemo) {
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
  }, [uid, navigate, isDemo]);

  const income = safeAmount(user?.incomeAmount);
  const totalSpent = useMemo(
    () => expenses.reduce((sum, expense) => sum + safeAmount(expense.amount), 0),
    [expenses],
  );
  const remainingIncome = Math.max(income - totalSpent, 0);
  const spentPercentage = income ? (totalSpent / income) * 100 : 0;

  const categoryTotals = useMemo(
    () =>
      expenses.reduce((totals, expense) => {
        const category = expense.category || "Other";
        totals[category] =
          (totals[category] || 0) + safeAmount(expense.amount);
        return totals;
      }, {}),
    [expenses],
  );
  const categoriesData = useMemo(
    () =>
      Object.entries(categoryTotals)
        .sort(([, firstAmount], [, secondAmount]) => secondAmount - firstAmount)
        .slice(0, 8),
    [categoryTotals],
  );
  const allCategories = useMemo(
    () =>
      Object.entries(categoryTotals).sort(
        ([, firstAmount], [, secondAmount]) => secondAmount - firstAmount,
      ),
    [categoryTotals],
  );
  const topCategory = allCategories[0] || null;
  const timeline = useMemo(() => {
    const totalsByDate = new Map();

    expenses.forEach((expense) => {
      const date = formatDate(expense.date || "");
      if (!date) return;

      const current = totalsByDate.get(date.key);
      totalsByDate.set(date.key, {
        label: date.label,
        sortValue: date.sortValue,
        amount: (current?.amount || 0) + safeAmount(expense.amount),
      });
    });

    return [...totalsByDate.values()].sort(
      (first, second) => first.sortValue - second.sortValue,
    );
  }, [expenses]);

  const formatMoney = (value) =>
    `${symbol}${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(safeAmount(value))}`;

  const chartColors = categoriesData.map(
    (_, index) => CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  );
  const currentSliceIndex = categoriesData.findIndex(
    ([category]) => category === selectedSlice,
  );
  const drilldownCategories = categoriesData.map(([category, amount]) => [
    category,
    amount,
  ]);
  const currentCategory = allCategories.find(
    ([category]) => category === selectedSlice,
  );

  let donutLabels = ["Spent", "Remaining"];
  let donutValues = [totalSpent, remainingIncome];
  let donutColors = ["#e8524b", "#2563eb"];
  let donutCenter = {
    value: income ? `${spentPercentage.toFixed(0)}%` : "—",
    label: income ? "Income used" : "No income recorded",
  };

  if (selectedSlice === "Spent" && zoomedIn) {
    donutLabels = drilldownCategories.map(([category]) => category);
    donutValues = drilldownCategories.map(([, amount]) => amount);
    donutColors = chartColors;
    donutCenter = { value: formatMoney(totalSpent), label: "By category" };
  } else if (currentCategory && zoomedIn) {
    const otherSpending = Math.max(totalSpent - currentCategory[1], 0);
    donutLabels = [currentCategory[0], "Other categories"];
    donutValues = [currentCategory[1], otherSpending];
    donutColors = [
      chartColors[currentSliceIndex] || CATEGORY_COLORS[0],
      "#e8edf4",
    ];
    donutCenter = {
      value: formatMoney(currentCategory[1]),
      label: currentCategory[0],
    };
  } else if (selectedSlice === "Remaining" && zoomedIn) {
    donutLabels = ["Remaining"];
    donutValues = [remainingIncome];
    donutColors = ["#2563eb"];
    donutCenter = { value: formatMoney(remainingIncome), label: "Remaining" };
  }

  const percentageOf = (amount, total) =>
    total > 0 ? ((amount / total) * 100).toFixed(1) : "0.0";

  const distributionData = {
    labels: donutLabels,
    datasets: [
      {
        data: donutValues,
        backgroundColor: donutColors,
        borderColor: "#ffffff",
        borderWidth: 3,
        borderRadius: 8,
        spacing: 3,
        hoverOffset: 7,
      },
    ],
  };
  const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        display: !zoomedIn,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 18,
          color: "#64748b",
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = safeAmount(context.raw);
            let detail = "";
            if (income && selectedSlice === null) {
              detail = ` (${percentageOf(value, income)}% of income)`;
            } else if (
              totalSpent &&
              (selectedSlice === "Spent" || currentCategory)
            ) {
              detail = ` (${percentageOf(value, totalSpent)}% of spending)`;
            }
            return ` ${context.label}: ${formatMoney(value)}${detail}`;
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (!elements.length) return;

      const label = donutLabels[elements[0].index];
      haptic(20);

      if (!zoomedIn) {
        setSelectedSlice(label);
        setZoomedIn(true);
      } else if (selectedSlice === "Spent") {
        setSelectedSlice(label);
      } else {
        setSelectedSlice(null);
        setZoomedIn(false);
      }
    },
    onHover: (event, elements) => {
      if (event.native?.target) {
        event.native.target.style.cursor = elements.length ? "pointer" : "default";
      }
    },
  };

  const categoryBarData = {
    labels: categoriesData.map(([category]) => category),
    datasets: [
      {
        data: categoriesData.map(([, amount]) => amount),
        backgroundColor: chartColors,
        borderRadius: 7,
        borderSkipped: false,
        barThickness: 18,
      },
    ],
  };
  const categoryBarOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (!elements.length) return;
      const category = categoriesData[elements[0].index]?.[0];
      if (!category) return;
      setSelectedSlice(category);
      setZoomedIn(true);
      haptic(15);
    },
    onHover: (event, elements) => {
      if (event.native?.target) {
        event.native.target.style.cursor = elements.length ? "pointer" : "default";
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${formatMoney(context.parsed.x)} · ${percentageOf(
              context.parsed.x,
              totalSpent,
            )}% of total spending`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "#edf1f6" },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          maxTicksLimit: 5,
          callback: (value) => `${symbol}${value}`,
        },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#475569", font: { size: 12 } },
      },
    },
  };

  const shareData = {
    labels: categoriesData.map(([category]) => category),
    datasets: [
      {
        data: categoriesData.map(([, amount]) => amount),
        backgroundColor: chartColors,
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };
  const shareOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 14,
          color: "#64748b",
          font: { size: 11 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const amount = safeAmount(context.raw);
            return ` ${context.label}: ${formatMoney(amount)} · ${percentageOf(
              amount,
              totalSpent,
            )}% of spending`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: { color: "#edf1f6" },
        angleLines: { color: "#edf1f6" },
        ticks: { display: false, backdropColor: "transparent" },
        pointLabels: {
          display: false,
          color: "#64748b",
        },
      },
    },
  };

  const timelineData = {
    labels: timeline.map(({ label }) => label),
    datasets: [
      {
        data: timeline.map(({ amount }) => amount),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#2563eb",
        pointBorderWidth: 2,
        pointRadius: timeline.length > 1 ? 3 : 5,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
      },
    ],
  };
  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => items[0]?.label || "",
          label: (context) => ` Spent: ${formatMoney(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#94a3b8", maxRotation: 0, autoSkip: true },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#edf1f6" },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          maxTicksLimit: 5,
          callback: (value) => `${symbol}${value}`,
        },
      },
    },
  };

  const monthlySummaryData = {
    labels: DEMO_DATA.monthlySummaries.map((summary) => summary.label),
    datasets: [
      {
        label: "Income",
        data: DEMO_DATA.monthlySummaries.map((summary) => summary.income),
        backgroundColor: "#0f9d74",
        borderRadius: 6,
      },
      {
        label: "Expenses",
        data: DEMO_DATA.monthlySummaries.map((summary) => summary.expenses),
        backgroundColor: "#e8524b",
        borderRadius: 6,
      },
      {
        label: "Savings",
        data: DEMO_DATA.monthlySummaries.map((summary) => summary.savings),
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
    ],
  };
  const monthlySummaryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatMoney(context.raw)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `${symbol}${value}` },
      },
    },
  };

  const handleResetZoom = () => {
    setSelectedSlice(null);
    setZoomedIn(false);
    haptic(15);
  };

  if (loading) {
    return (
      <SwipeWrapper>
        <div className="analytics-page analytics-page--loading">
          <div className="analytics-loading" aria-busy="true">
            <div className="analytics-loading__title" />
            <div className="analytics-loading__metrics">
              <span />
              <span />
              <span />
            </div>
            <div className="analytics-loading__panels">
              <span />
              <span />
            </div>
            <Loader />
          </div>
        </div>
      </SwipeWrapper>
    );
  }

  if (!user) return null;

  if (expenses.length === 0) {
    return (
      <SwipeWrapper>
        <div className="analytics-page analytics-page--empty">
          <section className="analytics-empty">
            <div className="analytics-empty__icon" aria-hidden="true">
              📊
            </div>
            <h1>No spending insights yet</h1>
            <p>Add your first expense to unlock your financial analytics.</p>
            <button
              className="analytics-button"
              onClick={() => {
                haptic(25);
                navigate("/add-expense");
              }}
              type="button"
            >
              <span aria-hidden="true">+</span>
              Add your first expense
            </button>
          </section>
        </div>
      </SwipeWrapper>
    );
  }

  const healthStatus = income
    ? spentPercentage < 50
      ? "Healthy"
      : spentPercentage < 75
        ? "Moderate"
        : spentPercentage < 90
          ? "High"
          : "Critical"
    : "No income";
  const healthStatusKey = healthStatus.toLowerCase().replaceAll(" ", "-");
  const progressWidth = Math.min(Math.max(spentPercentage, 0), 100);
  const displayedCategories = categoriesData;

  return (
    <SwipeWrapper>
      <div className="analytics-page">
        <main className="analytics-container">
          <header className="analytics-header">
            <div>
              <span className="analytics-eyebrow">YOUR MONEY, IN FOCUS</span>
              <h1>Financial Insights</h1>
              <p>Understand where your money goes.</p>
            </div>
            <span className="analytics-period">
              <span aria-hidden="true" />
              This Month
            </span>
          </header>

          <section className="analytics-metrics" aria-label="Financial summary">
            <article className="analytics-card analytics-metric analytics-metric--income">
              <span className="analytics-metric__icon" aria-hidden="true">
                ↗
              </span>
              <span className="analytics-metric__label">Income</span>
              <strong>{formatMoney(income)}</strong>
              {!income && <small>No income recorded</small>}
            </article>
            <article className="analytics-card analytics-metric analytics-metric--spent">
              <span className="analytics-metric__icon" aria-hidden="true">
                ↘
              </span>
              <span className="analytics-metric__label">Total Spent</span>
              <strong>{formatMoney(totalSpent)}</strong>
            </article>
            <article className="analytics-card analytics-metric analytics-metric--remaining">
              <span className="analytics-metric__icon" aria-hidden="true">
                ◷
              </span>
              <span className="analytics-metric__label">Remaining</span>
              <strong>{formatMoney(remainingIncome)}</strong>
            </article>
          </section>

          <section className="analytics-primary-grid">
            <article className="analytics-card analytics-panel analytics-panel--distribution">
              <div className="analytics-panel__header">
                <div>
                  <h2>
                    {zoomedIn
                      ? selectedSlice === "Spent"
                        ? "Category Breakdown"
                        : selectedSlice
                      : "Spending Distribution"}
                  </h2>
                  <p>
                    {zoomedIn
                      ? "Explore your spending details"
                      : "Income compared with your spending"}
                  </p>
                </div>
                {zoomedIn && (
                  <button
                    className="analytics-reset"
                    onClick={handleResetZoom}
                    type="button"
                  >
                    ← Overview
                  </button>
                )}
              </div>
              <div className="analytics-donut">
                <Doughnut
                  ref={chartRef}
                  data={distributionData}
                  options={distributionOptions}
                />
                <div className="analytics-donut__center">
                  <strong>{donutCenter.value}</strong>
                  <span>{donutCenter.label}</span>
                </div>
              </div>
              {!zoomedIn && (
                <p className="analytics-chart-hint">
                  Select a segment to explore the details.
                </p>
              )}
            </article>

            <article className="analytics-card analytics-panel analytics-panel--bars">
              <div className="analytics-panel__header">
                <div>
                  <h2>Category Breakdown</h2>
                  <p>Top categories by amount spent</p>
                </div>
              </div>
              <div
                className="analytics-bar-chart"
                style={{
                  height: `${Math.max(displayedCategories.length * 38, 116)}px`,
                }}
              >
                <Bar data={categoryBarData} options={categoryBarOptions} />
              </div>
            </article>
          </section>

          {isDemo && (
            <section className="analytics-card analytics-panel analytics-panel--timeline">
              <div className="analytics-panel__header">
                <div>
                  <h2>Monthly financial summary</h2>
                  <p>Income, expenses, and savings over the last six months</p>
                </div>
              </div>
              <div className="analytics-timeline">
                <Bar data={monthlySummaryData} options={monthlySummaryOptions} />
              </div>
            </section>
          )}

          {timeline.length >= 2 && (
            <section className="analytics-card analytics-panel analytics-panel--timeline">
              <div className="analytics-panel__header">
                <div>
                  <h2>Spending Timeline</h2>
                  <p>Recorded expenses by date</p>
                </div>
              </div>
              <div className="analytics-timeline">
                <Line data={timelineData} options={timelineOptions} />
              </div>
            </section>
          )}

          <section className="analytics-secondary-grid">
            <article className="analytics-card analytics-panel analytics-panel--share">
              <div className="analytics-panel__header">
                <div>
                  <h2>Spending Share</h2>
                  <p>Each category's share of total spending</p>
                </div>
              </div>
              <div className="analytics-polar">
                <PolarArea data={shareData} options={shareOptions} />
              </div>
            </article>

            <article className="analytics-card analytics-panel analytics-panel--comparison">
              <div className="analytics-panel__header">
                <div>
                  <h2>Category Comparison</h2>
                  <p>Share of all recorded spending</p>
                </div>
              </div>
              <div className="analytics-comparisons">
                {displayedCategories.map(([category, amount], index) => {
                  const percentage = Number(percentageOf(amount, totalSpent));
                  return (
                    <div className="analytics-comparison" key={category}>
                      <div className="analytics-comparison__label">
                        <span>{category}</span>
                        <strong>{percentage.toFixed(1)}%</strong>
                      </div>
                      <div className="analytics-comparison__track">
                        <span
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor:
                              CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>

          <section className="analytics-bottom-grid">
            <article className="analytics-card analytics-panel analytics-top-category">
              <div className="analytics-panel__header">
                <div>
                  <h2>Top Spending Category</h2>
                  <p>Your largest recorded expense category</p>
                </div>
                <span className="analytics-top-category__badge">TOP</span>
              </div>
              {topCategory ? (
                <div className="analytics-top-category__content">
                  <span className="analytics-top-category__icon" aria-hidden="true">
                    {CATEGORY_ICONS[topCategory[0].toLowerCase()] || "✦"}
                  </span>
                  <div>
                    <strong>{topCategory[0]}</strong>
                    <span>{formatMoney(topCategory[1])}</span>
                    <small>
                      {percentageOf(topCategory[1], totalSpent)}% of total
                      spending
                    </small>
                  </div>
                </div>
              ) : (
                <p className="analytics-muted">No categorized spending yet.</p>
              )}
            </article>

            <article className="analytics-card analytics-panel analytics-health">
              <div className="analytics-panel__header">
                <div>
                  <h2>Financial Health</h2>
                  <p>Income used by recorded expenses</p>
                </div>
                <span
                  className={`analytics-health__status analytics-health__status--${healthStatusKey}`}
                >
                  {healthStatus}
                </span>
              </div>
              <div className="analytics-health__value">
                <strong>
                  {income ? `${spentPercentage.toFixed(0)}%` : "—"}
                </strong>
                <span>Income Used</span>
              </div>
              <div
                className="analytics-health__track"
                role="progressbar"
                aria-label="Income used"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressWidth)}
              >
                <span
                  className={`analytics-health__fill analytics-health__fill--${healthStatusKey}`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <div className="analytics-health__totals">
                <span>{formatMoney(totalSpent)} spent</span>
                <span>{formatMoney(remainingIncome)} remaining</span>
              </div>
              {!income && (
                <p className="analytics-health__note">No income recorded.</p>
              )}
            </article>
          </section>

          <section className="analytics-card analytics-panel analytics-facts">
            <div className="analytics-panel__header">
              <div>
                <h2>Spending Insights</h2>
                <p>A factual snapshot of your recorded finances</p>
              </div>
            </div>
            <ul>
              {topCategory && (
                <li>
                  <span className="analytics-facts__dot analytics-facts__dot--blue" />
                  <p>
                    Your highest spending category is{" "}
                    <strong>{topCategory[0]}</strong>.
                  </p>
                </li>
              )}
              {topCategory && (
                <li>
                  <span className="analytics-facts__dot analytics-facts__dot--violet" />
                  <p>
                    {topCategory[0]} represents{" "}
                    <strong>
                      {percentageOf(topCategory[1], totalSpent)}%
                    </strong>{" "}
                    of your total spending.
                  </p>
                </li>
              )}
              <li>
                <span className="analytics-facts__dot analytics-facts__dot--coral" />
                <p>
                  You've spent <strong>{formatMoney(totalSpent)}</strong>
                  {income
                    ? ` from your ${formatMoney(income)} income.`
                    : " across your recorded expenses."}
                </p>
              </li>
              {income > 0 && (
                <li>
                  <span className="analytics-facts__dot analytics-facts__dot--green" />
                  <p>
                    <strong>{formatMoney(remainingIncome)}</strong> remains
                    after recorded expenses.
                  </p>
                </li>
              )}
            </ul>
          </section>
        </main>
      </div>
    </SwipeWrapper>
  );
};

export default Charts;
