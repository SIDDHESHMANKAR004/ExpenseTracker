import SwipeWrapper from "../components/SwipeWrapper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { getSymbol } from "../utils/currency";
import { shouldWarnIncome, getHighestCategory } from "../utils/budget";
import { getUser, getExpenses } from "../services/appData";
import { useDemoMode } from "../hooks/useDemoMode";
import { DEMO_DATA } from "../data/demoData";
import Loader from "../components/Loader";
import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
);

const categoryIcons = {
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

const formatDateLabel = (value) => {
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value || "Undated";
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showWarning, setShowWarning] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isDemo } = useDemoMode();
  const symbol = getSymbol();
  const uid = sessionStorage.getItem("uid");

  /* LOAD FIREBASE DATA */
  useEffect(() => {
    if (!uid && !isDemo) {
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
  }, [uid, navigate, isDemo]);

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
        <div className="finance-dashboard finance-dashboard--loading">
          <div className="finance-dashboard__loading-content" aria-busy="true">
            <div className="finance-dashboard__loading-heading">
              <span />
              <span />
            </div>
            <div className="finance-dashboard__loading-grid">
              <span />
              <span />
              <span />
            </div>
            <Loader />
          </div>
        </div>
      </SwipeWrapper>
    );
  }

  const balance = income - totalExpense;
  const highest = getHighestCategory(expenses);

  const dateTotals = expenses.reduce((totals, expense) => {
    const date = expense.date || "";
    totals[date] = (totals[date] || 0) + Number(expense.amount || 0);
    return totals;
  }, {});

  const trendEntries = Object.entries(dateTotals)
    .sort(([firstDate], [secondDate]) => {
      const firstTimestamp = Date.parse(firstDate);
      const secondTimestamp = Date.parse(secondDate);

      if (Number.isNaN(firstTimestamp) || Number.isNaN(secondTimestamp)) {
        return firstDate.localeCompare(secondDate);
      }

      return firstTimestamp - secondTimestamp;
    })
    .slice(-7);

  const categoryTotals = expenses.reduce((totals, expense) => {
    const category = expense.category || "Uncategorized";
    totals[category] = (totals[category] || 0) + Number(expense.amount || 0);
    return totals;
  }, {});
  const categoryEntries = Object.entries(categoryTotals).sort(
    ([, firstAmount], [, secondAmount]) => secondAmount - firstAmount,
  );
  const demoBudgetAlerts = Object.entries(DEMO_DATA.budgets).filter(
    ([category, budget]) => {
      const spent = categoryTotals[category] || 0;
      return spent / budget >= 0.75;
    },
  ).length;

  const css = getComputedStyle(document.documentElement);
  const cssColor = (name, fallback) =>
    css.getPropertyValue(name).trim() || fallback;
  const chartColors = [
    cssColor("--dashboard-chart-blue", "#2563eb"),
    cssColor("--dashboard-chart-teal", "#0f9d74"),
    cssColor("--dashboard-chart-violet", "#7c3aed"),
    cssColor("--dashboard-chart-amber", "#f59e0b"),
    cssColor("--dashboard-chart-coral", "#e8524b"),
    cssColor("--dashboard-chart-sky", "#0ea5e9"),
  ];
  const mutedColor = cssColor("--dashboard-muted", "#64748b");
  const gridColor = cssColor("--dashboard-grid", "#e8edf4");
  const formatMoney = (value) =>
    `${symbol}${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(Number(value) || 0)}`;

  const trendData = {
    labels: trendEntries.map(([date]) => formatDateLabel(date)),
    datasets: [
      {
        data: trendEntries.map(([, amount]) => amount),
        borderColor: chartColors[0],
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.38,
        pointRadius: trendEntries.length > 1 ? 3 : 5,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: chartColors[0],
        pointBorderWidth: 2,
      },
    ],
  };
  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${formatMoney(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: mutedColor, maxRotation: 0, autoSkip: true },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        border: { display: false },
        ticks: {
          color: mutedColor,
          maxTicksLimit: 5,
          callback: (value) => `${symbol}${value}`,
        },
      },
    },
  };
  const breakdownData = {
    labels: categoryEntries.map(([category]) => category),
    datasets: [
      {
        data: categoryEntries.map(([, amount]) => amount),
        backgroundColor: categoryEntries.map(
          (_, index) => chartColors[index % chartColors.length],
        ),
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 5,
      },
    ],
  };
  const breakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${context.label}: ${formatMoney(context.parsed)}`,
        },
      },
    },
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const progressWidth = Math.min(Math.max(spentPercent, 0), 100);

  return (
    <SwipeWrapper>
      <div className="finance-dashboard">
        <main className="finance-dashboard__container">
          <header className="finance-dashboard__header">
            <div>
              <p className="finance-dashboard__eyebrow">YOUR OVERVIEW</p>
              <h1>
                {greeting}, {user?.name || "there"} <span aria-hidden="true">👋</span>
              </h1>
              <p className="finance-dashboard__subtitle">
                Here's your financial overview.
                {isDemo && (
                  <span> {DEMO_DATA.categories.length} categories · {demoBudgetAlerts} budget alerts</span>
                )}
              </p>
            </div>
            <button
              className="finance-dashboard__add-button"
              onClick={() => navigate("/add-expense")}
              type="button"
            >
              <span aria-hidden="true">+</span>
              Add Expense
            </button>
          </header>

          {showWarning && spentPercent >= 90 && (
            <section className="finance-alert" role="status">
              <div className="finance-alert__icon" aria-hidden="true">
                !
              </div>
              <div className="finance-alert__content">
                <h2>Spending alert</h2>
                <p>
                  You've used {spentPercent.toFixed(1)}% of your available
                  income.
                </p>
                <p className="finance-alert__category">
                  Most spent on: <strong>{highest.category}</strong>
                </p>
              </div>
              <div className="finance-alert__actions">
                <button
                  className="finance-alert__dismiss"
                  onClick={() => setShowWarning(false)}
                  type="button"
                >
                  Dismiss
                </button>
                <button
                  className="finance-alert__remember"
                  onClick={() => {
                    localStorage.setItem("hideBudgetWarning", "true");
                    setShowWarning(false);
                  }}
                  type="button"
                >
                  Don't show again
                </button>
              </div>
            </section>
          )}

          <section className="finance-summary" aria-label="Financial summary">
            <article className="finance-card finance-card--balance">
              <div className="finance-card__balance-glow" aria-hidden="true" />
              <div className="finance-card__balance-content">
                <p className="finance-card__label">Total Balance</p>
                <p className="finance-card__balance-value">
                  {formatMoney(balance)}
                </p>
                <p className="finance-card__balance-caption">
                  Available after expenses
                </p>
              </div>
              <span className="finance-card__balance-mark" aria-hidden="true">
                ↗
              </span>
            </article>

            <article className="finance-card finance-card--metric finance-card--income">
              <div className="finance-card__metric-top">
                <span className="finance-card__metric-icon" aria-hidden="true">
                  ↗
                </span>
                <span className="finance-card__label">Income</span>
              </div>
              <p className="finance-card__metric-value">{formatMoney(income)}</p>
              <p className="finance-card__metric-caption">This month</p>
            </article>

            <article className="finance-card finance-card--metric finance-card--expense">
              <div className="finance-card__metric-top">
                <span className="finance-card__metric-icon" aria-hidden="true">
                  ↘
                </span>
                <span className="finance-card__label">Expenses</span>
              </div>
              <p className="finance-card__metric-value">
                {formatMoney(totalExpense)}
              </p>
              <p className="finance-card__metric-caption">This month</p>
            </article>
          </section>

          <section className="finance-insights" aria-label="Spending insights">
            <article className="finance-card finance-panel finance-panel--trend">
              <div className="finance-panel__heading">
                <div>
                  <h2>Spending Overview</h2>
                  <p>Expense activity by date</p>
                </div>
                <span className="finance-panel__period">This month</span>
              </div>
              {trendEntries.length > 0 ? (
                <div className="finance-chart finance-chart--line">
                  <Line data={trendData} options={trendOptions} />
                </div>
              ) : (
                <div className="finance-chart-empty">
                  Your spending activity will appear here.
                </div>
              )}
            </article>

            <article className="finance-card finance-panel finance-panel--breakdown">
              <div className="finance-panel__heading">
                <div>
                  <h2>Expense Breakdown</h2>
                  <p>By category</p>
                </div>
              </div>
              {categoryEntries.length > 0 ? (
                <>
                  <div className="finance-chart finance-chart--doughnut">
                    <Doughnut data={breakdownData} options={breakdownOptions} />
                    <div className="finance-chart__center">
                      <span>Total spent</span>
                      <strong>{formatMoney(totalExpense)}</strong>
                    </div>
                  </div>
                  <ul className="finance-category-list">
                    {categoryEntries.map(([category, amount], index) => (
                      <li key={category}>
                        <span
                          className="finance-category-list__swatch"
                          style={{
                            backgroundColor:
                              chartColors[index % chartColors.length],
                          }}
                        />
                        <span className="finance-category-list__name">
                          {category}
                        </span>
                        <strong>{formatMoney(amount)}</strong>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="finance-chart-empty">
                  Category insights will appear after your first expense.
                </div>
              )}
            </article>
          </section>

          <section className="finance-activity" aria-label="Budget and transactions">
            <article className="finance-card finance-panel finance-panel--budget">
              <div className="finance-panel__heading">
                <div>
                  <h2>Budget Status</h2>
                  <p>Spending compared with your income</p>
                </div>
                <span className="finance-budget__percent">
                  {spentPercent.toFixed(0)}% used
                </span>
              </div>
              <div
                className="finance-budget__track"
                role="progressbar"
                aria-label="Income spent"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressWidth)}
              >
                <span style={{ width: `${progressWidth}%` }} />
              </div>
              <div className="finance-budget__totals">
                <div>
                  <span>Spent</span>
                  <strong>{formatMoney(totalExpense)}</strong>
                </div>
                <div>
                  <span>Remaining</span>
                  <strong>{formatMoney(balance)}</strong>
                </div>
              </div>
              {income === 0 && (
                <p className="finance-budget__note">
                  Add your income to see your budget progress.
                </p>
              )}
            </article>

            <article className="finance-card finance-panel finance-panel--transactions">
              <div className="finance-panel__heading">
                <div>
                  <h2>Recent Transactions</h2>
                  <p>Your latest expense activity</p>
                </div>
                {expenses.length > 0 && (
                  <span className="finance-transactions__count">
                    {expenses.length} {expenses.length === 1 ? "record" : "records"}
                  </span>
                )}
              </div>

              {expenses.length === 0 ? (
                <div className="finance-empty-state">
                  <span className="finance-empty-state__icon" aria-hidden="true">
                    💳
                  </span>
                  <h3>No expenses yet</h3>
                  <p>
                    Start tracking your spending to see your financial insights
                    here.
                  </p>
                  <button
                    className="finance-dashboard__add-button finance-empty-state__button"
                    onClick={() => navigate("/add-expense")}
                    type="button"
                  >
                    <span aria-hidden="true">+</span>
                    Add your first expense
                  </button>
                </div>
              ) : (
                <ul className="finance-transactions">
                  {expenses.map((expense) => (
                    <li className="finance-transaction" key={expense.id}>
                      <span className="finance-transaction__icon" aria-hidden="true">
                        {categoryIcons[expense.category?.toLowerCase()] || "•"}
                      </span>
                      <span className="finance-transaction__details">
                        <strong>{expense.category}</strong>
                        <span>{expense.date}</span>
                      </span>
                      <strong className="finance-transaction__amount">
                        −{formatMoney(expense.amount)}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        </main>
      </div>
    </SwipeWrapper>
  );
};

export default Dashboard;
