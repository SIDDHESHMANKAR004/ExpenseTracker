import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addExpense,
  saveUser,
  getUser,
  getCategories,
  saveCategories,
  getBudgets,
  deleteCategory,
  getExpenses,
} from "../services/db";
import Loader from "../components/Loader";
import SwipeWrapper from "../components/SwipeWrapper";
import { serverTimestamp } from "firebase/firestore";
import { getSymbol } from "../utils/currency";
import "./AddExpense.css";

const DEFAULT_CATEGORIES = [
  { name: "Food", icon: "🍔", locked: true },
  { name: "Transport", icon: "🚕", locked: true },
  { name: "Shopping", icon: "🛍️", locked: true },
  { name: "Bills", icon: "📄", locked: true },
  { name: "Entertainment", icon: "🎮", locked: true },
  { name: "Health", icon: "💊", locked: true },
  { name: "Travel", icon: "✈️", locked: true },
  { name: "Other", icon: "📦", locked: true },
  { name: "Groceries", icon: "🛒", locked: true },
  { name: "Housing", icon: "🏠", locked: true },
  { name: "Utilities", icon: "💡", locked: true },
  { name: "Insurance", icon: "🛡️", locked: true },
  { name: "Education", icon: "📚", locked: true },
  { name: "Personal Care", icon: "💇", locked: true },
  { name: "Subscriptions", icon: "📱", locked: true },
  { name: "Gifts & Donations", icon: "🎁", locked: true },
  { name: "Savings", icon: "💰", locked: true },
  { name: "Investment", icon: "📈", locked: true },
];

const AddExpense = () => {
  const navigate = useNavigate();
  const pressTimer = useRef(null);
  const longPressTriggered = useRef(false);
  const successTimer = useRef(null);
  const modalNameRef = useRef(null);
  const uid = sessionStorage.getItem("uid");
  const currencySymbol = getSymbol();

  const [tab, setTab] = useState("expense");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
  const [expense, setExpense] = useState({ amount: "", date: "", note: "" });
  const [income, setIncome] = useState(null);
  const [savingExpense, setSavingExpense] = useState(false);
  const [savingIncome, setSavingIncome] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [formError, setFormError] = useState("");
  const [modalError, setModalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const load = async () => {
      try {
        const user = await getUser(uid);
        if (!user) {
          navigate("/onboarding");
          return;
        }

        setIncome({
          incomeType: user.incomeType || "monthly",
          incomeAmount: user.incomeAmount || "",
        });

        const savedCategories = await getCategories(uid);
        if (savedCategories) {
          setCategories(savedCategories);
        } else {
          await saveCategories(uid, DEFAULT_CATEGORIES);
          setCategories(DEFAULT_CATEGORIES);
        }

        const budgetData = await getBudgets(uid);
        if (budgetData) setBudgets(budgetData);

        const expenseData = await getExpenses(uid);
        if (expenseData) setExpenses(expenseData);
      } catch (error) {
        console.error("Error loading:", error);
        setFormError("We couldn't load your finance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid, navigate]);

  useEffect(() => {
    if (!showAddCategoryModal) return undefined;

    modalNameRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !savingCategory) {
        setShowAddCategoryModal(false);
        setModalError("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAddCategoryModal, savingCategory]);

  useEffect(
    () => () => {
      clearTimeout(pressTimer.current);
      clearTimeout(successTimer.current);
    },
    [],
  );

  const spent = (categoryName) =>
    expenses
      .filter((entry) => entry.category === categoryName)
      .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

  const switchTab = (nextTab) => {
    setTab(nextTab);
    setFormError("");
    setSuccessMessage("");
    if (nextTab === "expense") setSelectedCategory(null);
  };

  const addCategory = () => {
    setModalError("");
    setNewCategory({ name: "", icon: "" });
    setShowAddCategoryModal(true);
  };

  const saveNewCategory = async (event) => {
    event.preventDefault();
    const name = newCategory.name.trim();
    const icon = newCategory.icon.trim();

    if (!name || !icon) {
      setModalError("Enter both a category name and an emoji.");
      return;
    }
    if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      setModalError("A category with this name already exists.");
      return;
    }

    setSavingCategory(true);
    setModalError("");
    const updated = [...categories, { name, icon, locked: false }];

    try {
      await saveCategories(uid, updated);
      setCategories(updated);
      setShowAddCategoryModal(false);
      setNewCategory({ name: "", icon: "" });
    } catch (error) {
      console.error("Error saving category:", error);
      setModalError("We couldn't save this category. Please try again.");
    } finally {
      setSavingCategory(false);
    }
  };

  const startPress = (category) => {
    if (category.locked) return;
    clearTimeout(pressTimer.current);
    longPressTriggered.current = false;

    pressTimer.current = setTimeout(async () => {
      longPressTriggered.current = true;
      const confirmed = window.confirm(
        `Delete ${category.name}? All records removed.`,
      );
      if (!confirmed) return;

      try {
        await deleteCategory(uid, category.name);
        setCategories((current) =>
          current.filter((entry) => entry.name !== category.name),
        );
        setExpenses((current) =>
          current.filter((entry) => entry.category !== category.name),
        );
        setBudgets((current) => {
          const updated = { ...current };
          delete updated[category.name];
          return updated;
        });
        setSelectedCategory((current) =>
          current?.name === category.name ? null : current,
        );
      } catch (error) {
        console.error("Error deleting category:", error);
        setFormError("We couldn't delete this category. Please try again.");
      }
    }, 600);
  };

  const cancelPress = () => clearTimeout(pressTimer.current);

  const saveExpense = async (event) => {
    event.preventDefault();
    const amount = Number(expense.amount);
    if (!selectedCategory) {
      setFormError("Select a category before saving.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0 || !expense.date) {
      setFormError("Enter a valid amount and choose a date.");
      return;
    }

    setSavingExpense(true);
    setFormError("");
    setSuccessMessage("");

    try {
      await addExpense(uid, {
        category: selectedCategory.name,
        amount,
        date: expense.date,
        note: expense.note,
        createdAt: serverTimestamp(),
      });
      setSuccessMessage("Expense saved. Taking you to your dashboard…");
      successTimer.current = setTimeout(() => navigate("/dashboard"), 650);
    } catch (error) {
      console.error("Error saving expense:", error);
      setFormError("We couldn't save this expense. Please try again.");
      setSavingExpense(false);
    }
  };

  const saveIncome = async (event) => {
    event.preventDefault();
    const amount = Number(income?.incomeAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter an income amount greater than zero.");
      return;
    }

    setSavingIncome(true);
    setFormError("");
    setSuccessMessage("");
    try {
      await saveUser(uid, {
        incomeType: income.incomeType,
        incomeAmount: amount,
      });
      setSuccessMessage("Income updated. Taking you to your dashboard…");
      successTimer.current = setTimeout(() => navigate("/dashboard"), 650);
    } catch (error) {
      console.error("Error saving income:", error);
      setFormError("We couldn't update your income. Please try again.");
      setSavingIncome(false);
    }
  };

  const closeCategoryModal = () => {
    if (savingCategory) return;
    setShowAddCategoryModal(false);
    setNewCategory({ name: "", icon: "" });
    setModalError("");
  };

  if (loading || !income) {
    return (
      <SwipeWrapper>
        <div className="money-page money-page--loading">
          <div className="money-loading" aria-busy="true">
            <div className="money-loading__title" />
            <div className="money-loading__grid">
              <span />
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

  const categoryCards = categories.map((category) => {
    const spentAmount = spent(category.name);
    const limit = Number(budgets[category.name]);
    const hasLimit = Number.isFinite(limit) && limit > 0;
    const exceeded = hasLimit && spentAmount >= limit;
    const remaining = hasLimit ? Math.max(limit - spentAmount, 0) : null;

    return (
      <button
        key={category.name}
        className={`money-category${selectedCategory?.name === category.name ? " is-selected" : ""}${exceeded ? " is-limited" : ""}`}
        type="button"
        aria-disabled={exceeded}
        aria-pressed={selectedCategory?.name === category.name}
        onClick={() => {
          if (longPressTriggered.current) {
            longPressTriggered.current = false;
            return;
          }
          if (exceeded) return;
          setSelectedCategory(category);
          setExpense({ amount: "", date: "", note: "" });
          setFormError("");
          setSuccessMessage("");
        }}
        onPointerDown={() => startPress(category)}
        onPointerUp={cancelPress}
        onPointerCancel={cancelPress}
        onPointerLeave={cancelPress}
        onContextMenu={(event) => event.preventDefault()}
        title={
          category.locked
            ? category.name
            : `${category.name} · hold to delete`
        }
      >
        <span className="money-category__icon" aria-hidden="true">
          {category.icon}
        </span>
        <span className="money-category__name">{category.name}</span>
        {hasLimit ? (
          <span className="money-category__meta">
            {exceeded
              ? "Limit reached"
              : `${currencySymbol}${remaining.toLocaleString("en-IN")} left`}
          </span>
        ) : (
          <span className="money-category__meta">
            {spentAmount > 0
              ? `${currencySymbol}${spentAmount.toLocaleString("en-IN")} spent`
              : "Select category"}
          </span>
        )}
        {!category.locked && (
          <span className="money-category__custom">Custom</span>
        )}
      </button>
    );
  });

  return (
    <SwipeWrapper>
      <div className="money-page">
        <main className="money-page__container">
          <header className="money-header">
            <button
              className="money-back"
              onClick={() => navigate("/dashboard")}
              type="button"
            >
              <span aria-hidden="true">←</span>
              Dashboard
            </button>
            <div className="money-header__row">
              <div>
                <span className="money-eyebrow">YOUR FINANCES</span>
                <h1>Manage Your Money</h1>
                <p>Track your income and expenses effortlessly.</p>
              </div>
              <div className="money-header__mark" aria-hidden="true">
                ↗
              </div>
            </div>
          </header>

          <div
            className="money-switcher"
            role="tablist"
            aria-label="Choose a money action"
          >
            <span
              className={`money-switcher__active${tab === "income" ? " is-income" : ""}`}
              aria-hidden="true"
            />
            <button
              className={tab === "expense" ? "is-active" : ""}
              onClick={() => switchTab("expense")}
              role="tab"
              aria-selected={tab === "expense"}
              type="button"
            >
              <span aria-hidden="true">↘</span>
              Add Expense
            </button>
            <button
              className={tab === "income" ? "is-active" : ""}
              onClick={() => switchTab("income")}
              role="tab"
              aria-selected={tab === "income"}
              type="button"
            >
              <span aria-hidden="true">↗</span>
              Update Income
            </button>
          </div>

          {formError && (
            <div className="money-feedback money-feedback--error" role="alert">
              <span aria-hidden="true">!</span>
              {formError}
            </div>
          )}
          {successMessage && (
            <div className="money-feedback money-feedback--success" role="status">
              <span aria-hidden="true">✓</span>
              {successMessage}
            </div>
          )}

          {tab === "expense" && !selectedCategory && (
            <section className="money-section" aria-labelledby="category-title">
              <div className="money-section__heading">
                <div>
                  <span className="money-step">STEP 1 OF 2</span>
                  <h2 id="category-title">Choose a category</h2>
                  <p>Select where this expense belongs.</p>
                </div>
                <span className="money-section__count">
                  {categories.length} categories
                </span>
              </div>
              <div className="money-category-grid">
                {categoryCards}
                <button
                  className="money-category money-category--add"
                  onClick={addCategory}
                  type="button"
                >
                  <span className="money-category__add-icon" aria-hidden="true">
                    +
                  </span>
                  <span className="money-category__name">Add category</span>
                  <span className="money-category__meta">Create your own</span>
                </button>
              </div>
              {categories.some((category) => !category.locked) && (
                <p className="money-longpress-hint">
                  Tip: press and hold a custom category to remove it.
                </p>
              )}
            </section>
          )}

          {tab === "expense" && selectedCategory && (
            <section className="money-entry" aria-labelledby="expense-form-title">
              <button
                className="money-back money-entry__back"
                onClick={() => {
                  setSelectedCategory(null);
                  setFormError("");
                }}
                type="button"
              >
                <span aria-hidden="true">←</span>
                Back to categories
              </button>
              <form className="money-entry__card" onSubmit={saveExpense}>
                <div className="money-entry__heading">
                  <span className="money-entry__category-icon" aria-hidden="true">
                    {selectedCategory.icon}
                  </span>
                  <div>
                    <span className="money-step">STEP 2 OF 2</span>
                    <h2 id="expense-form-title">{selectedCategory.name}</h2>
                    <p>Add the amount and details for this expense.</p>
                  </div>
                </div>

                <label className="money-field-label" htmlFor="expense-amount">
                  Amount
                </label>
                <div className="money-amount-field">
                  <span aria-hidden="true">{currencySymbol}</span>
                  <input
                    id="expense-amount"
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={expense.amount}
                    onChange={(event) =>
                      setExpense({ ...expense, amount: event.target.value })
                    }
                    aria-describedby="expense-amount-hint"
                    required
                  />
                </div>
                <small className="money-field-hint" id="expense-amount-hint">
                  Enter the amount you spent.
                </small>

                <div className="money-entry__fields">
                  <div className="money-field">
                    <label className="money-field-label" htmlFor="expense-date">
                      Date
                    </label>
                    <input
                      id="expense-date"
                      className="money-input"
                      type="date"
                      value={expense.date}
                      onChange={(event) =>
                        setExpense({ ...expense, date: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="money-field">
                    <label className="money-field-label" htmlFor="expense-note">
                      Note <span>Optional</span>
                    </label>
                    <input
                      id="expense-note"
                      className="money-input"
                      type="text"
                      placeholder="What was it for?"
                      value={expense.note}
                      onChange={(event) =>
                        setExpense({ ...expense, note: event.target.value })
                      }
                      maxLength={160}
                    />
                  </div>
                </div>

                <div className="money-entry__actions">
                  <button
                    className="money-button money-button--secondary"
                    onClick={() => {
                      setSelectedCategory(null);
                      setFormError("");
                    }}
                    type="button"
                  >
                    Back
                  </button>
                  <button
                    className="money-button money-button--primary"
                    disabled={
                      savingExpense ||
                      !expense.amount ||
                      Number(expense.amount) <= 0 ||
                      !expense.date
                    }
                    type="submit"
                  >
                    {savingExpense ? (
                      <>
                        <span className="money-button__spinner" />
                        Saving…
                      </>
                    ) : (
                      <>
                        Save Expense <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}

          {tab === "income" && (
            <section className="money-income" aria-labelledby="income-title">
              <div className="money-income__intro">
                <span className="money-income__icon" aria-hidden="true">
                  ↗
                </span>
                <span className="money-step">YOUR EARNINGS</span>
                <h2 id="income-title">Set your income</h2>
                <p>
                  Keep your income up to date to make your spending overview
                  more useful.
                </p>
                {Number(income.incomeAmount) > 0 && (
                  <div className="money-income__current">
                    <span>Current income</span>
                    <strong>
                      {Number(income.incomeAmount).toLocaleString("en-IN")}
                    </strong>
                    <small>
                      {income.incomeType.charAt(0).toUpperCase() +
                        income.incomeType.slice(1)}
                    </small>
                  </div>
                )}
              </div>
              <form className="money-income__form" onSubmit={saveIncome}>
                <div className="money-section__heading">
                  <div>
                    <h3>Income details</h3>
                    <p>Choose how often you receive this income.</p>
                  </div>
                </div>
                <label className="money-field-label">Frequency</label>
                <div
                  className="money-frequency"
                  role="group"
                  aria-label="Income frequency"
                >
                  {["weekly", "monthly", "yearly"].map((frequency) => (
                    <button
                      key={frequency}
                      className={
                        income.incomeType === frequency ? "is-active" : ""
                      }
                      onClick={() =>
                        setIncome({ ...income, incomeType: frequency })
                      }
                      type="button"
                    >
                      {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                    </button>
                  ))}
                </div>
                <label className="money-field-label" htmlFor="income-amount">
                  Income amount
                </label>
                <div className="money-amount-field money-amount-field--income">
                  <span aria-hidden="true">{currencySymbol}</span>
                  <input
                    id="income-amount"
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={income.incomeAmount}
                    onChange={(event) =>
                      setIncome({ ...income, incomeAmount: event.target.value })
                    }
                    required
                  />
                </div>
                <button
                  className="money-button money-button--primary money-income__save"
                  disabled={
                    savingIncome ||
                    !income.incomeAmount ||
                    Number(income.incomeAmount) <= 0
                  }
                  type="submit"
                >
                  {savingIncome ? (
                    <>
                      <span className="money-button__spinner" />
                      Updating…
                    </>
                  ) : (
                    <>
                      Save Income <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </form>
            </section>
          )}
        </main>

        {showAddCategoryModal && (
          <div
            className="money-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeCategoryModal();
            }}
          >
            <section
              className="money-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="category-modal-title"
            >
              <div className="money-modal__header">
                <div>
                  <span className="money-step">MAKE IT YOURS</span>
                  <h2 id="category-modal-title">Add a category</h2>
                  <p>Create a category that fits your life.</p>
                </div>
                <button
                  className="money-modal__close"
                  onClick={closeCategoryModal}
                  aria-label="Close dialog"
                  disabled={savingCategory}
                  type="button"
                >
                  ×
                </button>
              </div>

              <div className="money-modal__preview">
                <span aria-hidden="true">{newCategory.icon.trim() || "✨"}</span>
                <div>
                  <strong>{newCategory.name.trim() || "Category name"}</strong>
                  <small>Preview</small>
                </div>
              </div>

              <form onSubmit={saveNewCategory}>
                <div className="money-field">
                  <label className="money-field-label" htmlFor="category-name">
                    Category name
                  </label>
                  <input
                    ref={modalNameRef}
                    id="category-name"
                    className="money-input"
                    type="text"
                    placeholder="e.g. Coffee"
                    maxLength={32}
                    value={newCategory.name}
                    onChange={(event) =>
                      setNewCategory({
                        ...newCategory,
                        name: event.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="money-field">
                  <label className="money-field-label" htmlFor="category-icon">
                    Emoji or icon
                  </label>
                  <input
                    id="category-icon"
                    className="money-input money-input--emoji"
                    type="text"
                    placeholder="e.g. ☕"
                    maxLength={8}
                    value={newCategory.icon}
                    onChange={(event) =>
                      setNewCategory({
                        ...newCategory,
                        icon: event.target.value,
                      })
                    }
                    required
                  />
                </div>
                {modalError && (
                  <p className="money-modal__error" role="alert">
                    {modalError}
                  </p>
                )}
                <div className="money-modal__actions">
                  <button
                    className="money-button money-button--secondary"
                    onClick={closeCategoryModal}
                    disabled={savingCategory}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="money-button money-button--primary"
                    disabled={
                      savingCategory ||
                      !newCategory.name.trim() ||
                      !newCategory.icon.trim()
                    }
                    type="submit"
                  >
                    {savingCategory ? (
                      <>
                        <span className="money-button__spinner" />
                        Saving…
                      </>
                    ) : (
                      "Save Category"
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </SwipeWrapper>
  );
};

export default AddExpense;
