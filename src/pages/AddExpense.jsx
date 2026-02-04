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
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });

  const [expense, setExpense] = useState({ amount: "", date: "", note: "" });
  const [income, setIncome] = useState(null);

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

        const cats = await getCategories(uid);
        if (cats) setCategories(cats);
        else {
          await saveCategories(uid, DEFAULT_CATEGORIES);
          setCategories(DEFAULT_CATEGORIES);
        }

        // Load budgets and expenses for budget calculation
        const budgetData = await getBudgets(uid);
        if (budgetData) {
          setBudgets(budgetData);
        }

        const expenseData = await getExpenses(uid);
        if (expenseData) {
          setExpenses(expenseData);
        }
      } catch (error) {
        console.error("Error loading:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid, navigate]);

  // Helper function to calculate spent amount for a category
  const spent = (catName) => {
    return expenses
      .filter((e) => e.category === catName)
      .reduce((s, e) => s + e.amount, 0);
  };

  /* -------- Add Category -------- */

  // const addCategory = async () => {
  //   const name = prompt("Category name");
  //   if (!name) return;

  //   const icon = prompt("Enter emoji (example: 🍕 🚗 🎮)");
  //   if (!icon) return;

  //   const updated = [...categories, { name, icon, locked: false }];
  //   setCategories(updated);

  //   // Save to Firebase only
  //   await saveCategories(uid, updated);
  // };
  const addCategory = () => {
    setShowAddCategoryModal(true);
    setNewCategory({ name: "", icon: "" });
  };
  const saveNewCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.icon.trim()) {
      alert("Please enter both category name and emoji");
      return;
    }

    const updated = [
      ...categories,
      {
        name: newCategory.name.trim(),
        icon: newCategory.icon.trim(),
        locked: false,
      },
    ];

    setCategories(updated);
    await saveCategories(uid, updated);
    setShowAddCategoryModal(false);
    setNewCategory({ name: "", icon: "" });
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
      createdAt: serverTimestamp(),
    });

    navigate("/dashboard");
  };

  /* -------- Save Income -------- */

  const saveIncome = async () => {
    if (!income.incomeAmount || Number(income.incomeAmount) <= 0) {
      alert("Enter valid income");
      return;
    }

    await saveUser(uid, {
      incomeType: income.incomeType,
      incomeAmount: Number(income.incomeAmount),
    });

    navigate("/dashboard");
  };

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

  return (
    <div className="min-vh-100 dashboard-bg">
      <SwipeWrapper>
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
                onChange={(e) =>
                  setExpense({ ...expense, date: e.target.value })
                }
              />
              <textarea
                className="form-control mb-3"
                placeholder="Note"
                onChange={(e) =>
                  setExpense({ ...expense, note: e.target.value })
                }
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

          {/* Add Category Modal */}
          {showAddCategoryModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  width: "90%",
                  maxWidth: "400px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >
                <h5 className="mb-3" style={{ color: "var(--primary)" }}>
                  Add New Category
                </h5>

                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Coffee, Gym, etc."
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Icon (Emoji)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., ☕ 🏋️ 🎬"
                    value={newCategory.icon}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, icon: e.target.value })
                    }
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary flex-fill"
                    onClick={saveNewCategory}
                  >
                    Save Category
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      setNewCategory({ name: "", icon: "" });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SwipeWrapper>
    </div>
  );
};

export default AddExpense;
