import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getBudgets,
  getExpenses,
  saveBudgets,
} from "../services/db";
import { getSymbol } from "../utils/currency";
import Loader from "../components/Loader";
import "./CategoryBudgets.css";

const CategoryBudgets = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [drafts, setDrafts] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const uid = sessionStorage.getItem("uid");
  const symbol = getSymbol();

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const loadData = async () => {
      try {
        const [categoryData, budgetData, expenseData] = await Promise.all([
          getCategories(uid),
          getBudgets(uid),
          getExpenses(uid),
        ]);
        const savedBudgets = budgetData || {};

        setCategories(categoryData || []);
        setBudgets(savedBudgets);
        setDrafts(
          Object.fromEntries(
            (categoryData || []).map((category) => [
              category.name,
              savedBudgets[category.name] ?? "",
            ]),
          ),
        );
        setExpenses(expenseData || []);
      } catch (loadError) {
        console.error("Error loading category budgets:", loadError);
        setError("We couldn't load your budgets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [uid, navigate]);

  const spendingByCategory = useMemo(
    () =>
      expenses.reduce((totals, expense) => {
        const category = expense.category || "Other";
        const amount = Number(expense.amount);
        totals[category] =
          (totals[category] || 0) +
          (Number.isFinite(amount) && amount > 0 ? amount : 0);
        return totals;
      }, {}),
    [expenses],
  );

  const totalBudgeted = categories.reduce((total, category) => {
    const amount = Number(budgets[category.name]);
    return total + (Number.isFinite(amount) && amount > 0 ? amount : 0);
  }, 0);
  const totalTrackedSpending = categories.reduce(
    (total, category) => total + (spendingByCategory[category.name] || 0),
    0,
  );
  const budgetedCount = categories.filter((category) => {
    const amount = Number(budgets[category.name]);
    return Number.isFinite(amount) && amount > 0;
  }).length;

  const formatMoney = (value) =>
    `${symbol}${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(Number(value) || 0)}`;

  const save = async (categoryName) => {
    if (!uid || savingCategory) return;

    const rawValue = drafts[categoryName];
    const value = rawValue === "" ? 0 : Number(rawValue);
    if (!Number.isFinite(value) || value < 0) {
      setError("Enter a valid budget amount or leave the field empty.");
      setNotice("");
      return;
    }

    const updatedBudgets = { ...budgets };
    if (value === 0) {
      delete updatedBudgets[categoryName];
    } else {
      updatedBudgets[categoryName] = value;
    }

    setSavingCategory(categoryName);
    setError("");
    setNotice("");
    try {
      await saveBudgets(uid, updatedBudgets);
      setBudgets(updatedBudgets);
      setDrafts((current) => ({ ...current, [categoryName]: value || "" }));
      setNotice(`${categoryName} budget saved.`);
    } catch (saveError) {
      console.error("Error saving category budget:", saveError);
      setError(`Couldn't save the ${categoryName} budget. Please try again.`);
    } finally {
      setSavingCategory("");
    }
  };

  if (loading) {
    return (
      <div className="category-budgets category-budgets--loading">
        <div className="category-budgets__loading-content" aria-busy="true">
          <div className="category-budgets__skeleton-title" />
          <div className="category-budgets__skeleton-grid">
            <span />
            <span />
            <span />
            <span />
          </div>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <main className="category-budgets">
      <div className="category-budgets__container">
        <header className="category-budgets__header">
          <button
            className="category-budgets__back"
            onClick={() => navigate("/profile")}
            type="button"
          >
            <span aria-hidden="true">←</span>
            Back to profile
          </button>

          <div className="category-budgets__heading-row">
            <div>
              <span className="category-budgets__eyebrow">YOUR SPENDING PLAN</span>
              <h1>Category budgets</h1>
              <p>Set thoughtful limits and see how your spending is tracking.</p>
            </div>
            <button
              className="category-budgets__dashboard-link"
              onClick={() => navigate("/dashboard")}
              type="button"
            >
              Go to dashboard <span aria-hidden="true">↗</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="category-budgets__message is-error" role="alert">
            <span aria-hidden="true">!</span>
            {error}
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}
        {notice && (
          <div className="category-budgets__message is-success" role="status">
            <span aria-hidden="true">✓</span>
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss confirmation"
            >
              ×
            </button>
          </div>
        )}

        <section
          className="category-budgets__summary"
          aria-label="Budget summary"
        >
          <article className="category-budgets__summary-card category-budgets__summary-card--primary">
            <span className="category-budgets__summary-label">
              Total budgeted
            </span>
            <strong>{formatMoney(totalBudgeted)}</strong>
            <span className="category-budgets__summary-icon" aria-hidden="true">
              ◫
            </span>
            <small>
              Across {budgetedCount} {budgetedCount === 1 ? "category" : "categories"}
            </small>
          </article>
          <article className="category-budgets__summary-card">
            <span className="category-budgets__summary-label">
              Tracked spending
            </span>
            <strong>{formatMoney(totalTrackedSpending)}</strong>
            <span className="category-budgets__summary-icon is-spent" aria-hidden="true">
              ↘
            </span>
            <small>Within categories shown below</small>
          </article>
          <article className="category-budgets__summary-card">
            <span className="category-budgets__summary-label">
              Categories
            </span>
            <strong>{categories.length}</strong>
            <span className="category-budgets__summary-icon is-category" aria-hidden="true">
              ◈
            </span>
            <small>Ready for a spending limit</small>
          </article>
        </section>

        <section className="category-budgets__section">
          <div className="category-budgets__section-heading">
            <div>
              <span className="category-budgets__eyebrow">LIMITS & PROGRESS</span>
              <h2>Your categories</h2>
            </div>
            <p>Changes are saved per category.</p>
          </div>

          {categories.length === 0 ? (
            <div className="category-budgets__empty">
              <span aria-hidden="true">◎</span>
              <h3>No categories to budget yet</h3>
              <p>
                Add your first expense to set up categories and create budget
                limits for them.
              </p>
              <button
                className="category-budgets__save"
                onClick={() => navigate("/add-expense")}
                type="button"
              >
                Add an expense <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <div className="category-budgets__grid">
              {categories.map((category) => {
                const spent = spendingByCategory[category.name] || 0;
                const limit = Number(budgets[category.name]) || 0;
                const hasLimit = limit > 0;
                const progress = hasLimit
                  ? Math.min((spent / limit) * 100, 100)
                  : 0;
                const exceeded = hasLimit && spent >= limit;
                const nearLimit = hasLimit && progress >= 75 && !exceeded;
                const state = exceeded
                  ? "over"
                  : nearLimit
                    ? "near"
                    : "normal";

                return (
                  <article
                    className={`category-budget-card category-budget-card--${state}`}
                    key={category.name}
                  >
                    <div className="category-budget-card__top">
                      <span className="category-budget-card__icon" aria-hidden="true">
                        {category.icon || "📦"}
                      </span>
                      <span
                        className={`category-budget-card__status category-budget-card__status--${state}`}
                      >
                        {exceeded
                          ? "Limit reached"
                          : nearLimit
                            ? "Nearly there"
                            : hasLimit
                              ? "On track"
                              : "No limit"}
                      </span>
                    </div>

                    <div className="category-budget-card__title-row">
                      <h3>{category.name}</h3>
                      <span>
                        {hasLimit ? `${Math.round(progress)}%` : "—"}
                      </span>
                    </div>

                    <div
                      className="category-budget-card__progress"
                      role="progressbar"
                      aria-label={`${category.name} budget used`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress)}
                    >
                      <span style={{ width: `${progress}%` }} />
                    </div>

                    <div className="category-budget-card__totals">
                      <span>Spent <strong>{formatMoney(spent)}</strong></span>
                      <span>
                        {hasLimit ? "Limit" : "Budget"}
                        <strong>{hasLimit ? formatMoney(limit) : "Not set"}</strong>
                      </span>
                    </div>

                    <div className="category-budget-card__editor">
                      <label htmlFor={`budget-${category.name}`}>
                        Monthly limit
                      </label>
                      <div className="category-budget-card__input-row">
                        <div className="category-budget-card__input-wrap">
                          <span aria-hidden="true">{symbol}</span>
                          <input
                            id={`budget-${category.name}`}
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            placeholder="Set limit"
                            value={drafts[category.name] ?? ""}
                            onChange={(event) => {
                              setDrafts((current) => ({
                                ...current,
                                [category.name]: event.target.value,
                              }));
                              setNotice("");
                            }}
                            disabled={Boolean(savingCategory)}
                          />
                        </div>
                        <button
                          className="category-budgets__save"
                          onClick={() => save(category.name)}
                          disabled={Boolean(savingCategory)}
                          type="button"
                        >
                          {savingCategory === category.name
                            ? "Saving…"
                            : "Save"}
                        </button>
                      </div>
                      <small>Leave empty or enter 0 to remove the limit.</small>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CategoryBudgets;
