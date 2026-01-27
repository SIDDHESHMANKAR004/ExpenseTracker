import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("expense");

  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const [income, setIncome] = useState({
    incomeType: "monthly",
    incomeAmount: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/onboarding");
      return;
    }

    const user = JSON.parse(storedUser);
    setIncome({
      incomeType: user.incomeType,
      incomeAmount: user.incomeAmount,
    });
  }, [navigate]);

  const handleExpenseChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const saveExpense = () => {
    const { amount, category, date } = expense;

    if (!amount || !category || !date) return;

    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      category,
      date,
      note: expense.note,
    };

    localStorage.setItem(
      "expenses",
      JSON.stringify([...storedExpenses, newExpense])
    );

    navigate("/reports");
  };

  const handleIncomeChange = (e) => {
    setIncome({ ...income, [e.target.name]: e.target.value });
  };

  const saveIncome = () => {
    if (!income.incomeAmount) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const updatedUser = {
      ...storedUser,
      incomeType: income.incomeType,
      incomeAmount: Number(income.incomeAmount),
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
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
            className={`flex-fill btn ${
              activeTab === "expense" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setActiveTab("expense")}
          >
            Expense
          </button>

          <button
            className={`flex-fill btn ${
              activeTab === "income" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setActiveTab("income")}
          >
            Income
          </button>
        </div>

        {/* EXPENSE */}
        {activeTab === "expense" && (
          <div className="card p-4">
            <h5 className="mb-3" style={{ color: "var(--primary)" }}>
              Add Expense
            </h5>

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Amount"
              name="amount"
              onChange={handleExpenseChange}
            />

            <select
              className="form-select mb-2"
              name="category"
              onChange={handleExpenseChange}
            >
              <option value="">Select Category</option>
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>

            <input
              type="date"
              className="form-control mb-2"
              name="date"
              onChange={handleExpenseChange}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Note (optional)"
              name="note"
              onChange={handleExpenseChange}
            />

            <button className="btn btn-primary w-100" onClick={saveExpense}>
              Save Expense
            </button>
          </div>
        )}

        {/* INCOME */}
        {activeTab === "income" && (
          <div className="card p-4">
            <h5 className="mb-3" style={{ color: "var(--primary)" }}>
              Update Income
            </h5>

            <select
              className="form-select mb-2"
              name="incomeType"
              value={income.incomeType}
              onChange={handleIncomeChange}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Income Amount"
              name="incomeAmount"
              value={income.incomeAmount}
              onChange={handleIncomeChange}
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
