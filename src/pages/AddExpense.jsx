import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [tab, setTab] = useState("expense");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [expense, setExpense] = useState({ amount: "", date: "", note: "" });

  const [income, setIncome] = useState({
    incomeType: "monthly",
    incomeAmount: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) navigate("/onboarding");

    setIncome({
      incomeType: user.incomeType,
      incomeAmount: user.incomeAmount,
    });

    const stored = JSON.parse(localStorage.getItem("categories"));
    if (stored) setCategories(stored);
    else {
      localStorage.setItem("categories", JSON.stringify(DEFAULT_CATEGORIES));
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [navigate]);

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const budgets = JSON.parse(localStorage.getItem("budgets")) || {};

  const spent = (catName) =>
    expenses
      .filter((e) => e.category === cat.name)
      .reduce((s, e) => s + e.amount, 0);

  /* -------- Add Category -------- */

  const addCategory = () => {
    const name = prompt("Category name");
    if (!name) return;

    const icon = prompt("Enter emoji (example: 🍕 🚗 🎮)");
    if (!icon) return;

    const updated = [...categories, { name, icon, locked: false }];

    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));
  };

  /* -------- Long press delete -------- */

  const startPress = (cat) => {
    if (cat.locked) return;

    pressTimer.current = setTimeout(() => {
      if (!confirm(`Delete ${cat.name}? All records removed.`)) return;
      const newCats = categories.filter((c) => c.name !== cat.name);
      localStorage.setItem("categories", JSON.stringify(newCats));
      setCategories(newCats);

      localStorage.setItem(
        "expenses",
        JSON.stringify(expenses.filter((e) => e.category !== cat.name)),
      );

      const b = { ...budgets };
      delete b[cat.name];
      localStorage.setItem("budgets", JSON.stringify(b));
    }, 600);
  };

  const cancelPress = () => clearTimeout(pressTimer.current);

  /* -------- Save Expense -------- */

  const saveExpense = () => {
    if (!expense.amount || !expense.date) return;

    expenses.push({
      id: Date.now(),
      category: selectedCategory.name,
      amount: Number(expense.amount),
      date: expense.date,
      note: expense.note,
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));
    navigate("/dashboard");
  };

  /* -------- Save Income -------- */

  const saveIncome = () => {
    if (!income.incomeAmount) return;

    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        incomeType: income.incomeType,
        incomeAmount: Number(income.incomeAmount),
      }),
    );

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
