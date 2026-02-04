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

const TILE = {
  height: "90px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
};

const AddExpense = () => {
  const navigate = useNavigate();
  const pressTimer = useRef(null);

  const uid = sessionStorage.getItem("uid");

  const [tab, setTab] = useState("expense");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [expense, setExpense] = useState({ amount: "", date: "", note: "" });
  const [income, setIncome] = useState({
    incomeType: "monthly",
    incomeAmount: "",
  });

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const load = async () => {
      try {
        const user = await getUser(uid);
        if (user) {
          setIncome({
            incomeType: user.incomeType || "monthly",
            incomeAmount: user.incomeAmount || "",
          });
        }

        let cats = await getCategories(uid);
        if (!cats || cats.length === 0) {
          await saveCategories(uid, DEFAULT_CATEGORIES);
          cats = DEFAULT_CATEGORIES;
        }

        setCategories(cats);

        const budgetsData = await getBudgets(uid);
        if (budgetsData) {
          setBudgets(budgetsData);
        }

        const expensesData = await getExpenses(uid);
        if (expensesData) {
          setExpenses(expensesData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid, navigate]);

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
  // Helper function to calculate spent amount for a category
  const spent = (catName) => {
    return expenses
      .filter((e) => e.category === catName)
      .reduce((s, e) => s + e.amount, 0);
  };

  /* -------- Add Category -------- */

  const addCategory = async () => {
    const name = prompt("Category name");
    if (!name) return;

    const icon = prompt("Enter emoji (example: 🍕 🚗 🎮)");
    if (!icon) return;

    const updated = [...categories, { name, icon, locked: false }];
    setCategories(updated);

    // Save to Firebase only
    await saveCategories(uid, updated);
  };

  /* -------- Long press delete -------- */

  const startPress = (cat) => {
    if (cat.locked) return;

    pressTimer.current = setTimeout(async () => {
      if (!confirm(`Delete ${cat.name}? All records removed.`)) return;

      // Delete from Firebase
      await deleteCategory(uid, cat.name);

      // Update local state
      const newCats = categories.filter((c) => c.name !== cat.name);
      setCategories(newCats);

      // Update local expenses state
      const newExpenses = expenses.filter((e) => e.category !== cat.name);
      setExpenses(newExpenses);

      // Update local budgets state
      const newBudgets = { ...budgets };
      delete newBudgets[cat.name];
      setBudgets(newBudgets);
    }, 600);
  };

  const cancelPress = () => clearTimeout(pressTimer.current);

  /* -------- Save Expense -------- */

  const saveExpense = async () => {
    if (!expense.amount || !expense.date) return;

    // Save to Firebase only
    await addExpense(uid, {
      category: selectedCategory.name,
      amount: Number(expense.amount),
      date: expense.date,
      note: expense.note,
    });

    navigate("/dashboard");
  };

  /* -------- Save Income -------- */

  const saveIncome = async () => {
    if (!income.incomeAmount) return;

    // Save to Firebase only
    await saveUser(uid, {
      incomeType: income.incomeType,
      incomeAmount: Number(income.incomeAmount),
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-vh-100 dashboard-bg">
      <div
        className="container py-4"
        style={{ maxWidth: "720px", paddingBottom: "90px" }}
      >
        {/* Tabs */}
        <div className="card p-2 mb-3 d-flex flex-row">
          <button
            className={`flex-fill btn ${tab === "expense" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => {
              setTab("expense");
              setSelectedCategory(null);
            }}
          >
            Expense
          </button>
          <button
            className={`flex-fill btn ${tab === "income" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setTab("income")}
          >
            Income
          </button>
        </div>

        {/* EXPENSE */}
        {tab === "expense" && !selectedCategory && (
          <div className="row g-3">
            {categories.map((cat) => {
              const exceeded =
                budgets[cat.name] && spent(cat.name) >= budgets[cat.name];
              return (
                <div key={cat.name} className="col-3">
                  <div
                    className="card"
                    style={{
                      ...TILE,
                      opacity: exceeded ? 0.4 : 1,
                      pointerEvents: exceeded ? "none" : "auto",
                    }}
                    onClick={() => setSelectedCategory(cat)}
                    onMouseDown={() => startPress(cat)}
                    onMouseUp={cancelPress}
                    onTouchStart={() => startPress(cat)}
                    onTouchEnd={cancelPress}
                  >
                    <div style={{ fontSize: "22px" }}>{cat.icon}</div>
                    <small>{cat.name}</small>

                    {exceeded && <small className="text-danger">Limit</small>}
                  </div>
                </div>
              );
            })}

            {/* Add */}
            <div className="col-3">
              <div
                style={{
                  ...TILE,
                  border: "2px dashed var(--primary)",
                  borderRadius: "14px",
                  color: "var(--primary)",
                }}
                onClick={addCategory}
              >
                ＋<small>Add</small>
              </div>
            </div>
          </div>
        )}

        {/* Expense Details */}
        {tab === "expense" && selectedCategory && (
          <div className="card p-4">
            <h5 style={{ color: "var(--primary)" }}>
              {selectedCategory.icon} {selectedCategory.name}
            </h5>

            <input
              className="form-control mb-2"
              placeholder="Amount"
              onChange={(e) =>
                setExpense({ ...expense, amount: e.target.value })
              }
            />
            <input
              type="date"
              className="form-control mb-2"
              onChange={(e) => setExpense({ ...expense, date: e.target.value })}
            />
            <textarea
              className="form-control mb-3"
              placeholder="Note"
              onChange={(e) => setExpense({ ...expense, note: e.target.value })}
            />

            <button className="btn btn-primary w-100" onClick={saveExpense}>
              Save
            </button>
          </div>
        )}

        {/* INCOME */}
        {tab === "income" && (
          <div className="card p-4">
            <h5 style={{ color: "var(--primary)" }}>Update Income</h5>

            <select
              className="form-select mb-2"
              value={income.incomeType}
              onChange={(e) =>
                setIncome({ ...income, incomeType: e.target.value })
              }
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              className="form-control mb-3"
              value={income.incomeAmount}
              onChange={(e) =>
                setIncome({ ...income, incomeAmount: e.target.value })
              }
            />
            <button className="btn btn-primary w-100" onClick={saveIncome}>
              Save Income
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddExpense;
