import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, getBudgets, saveBudgets } from "../services/db";
import Loader from "../components/Loader";

const CategoryBudgets = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const loadData = async () => {
      try {
        const cats = await getCategories(uid);
        const budgetData = await getBudgets(uid);
        
        if (cats) {
          setCategories(cats);
        }
        
        if (budgetData) {
          setBudgets(budgetData);
        }
      } catch (error) {
        console.error("Error loading category budgets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [uid, navigate]);

  const save = async (name, val) => {
    if (!uid) return;
    
    const newBudgetValue = val === "" ? null : Number(val);
    const updatedBudgets = { ...budgets };
    
    if (newBudgetValue === null || newBudgetValue === 0) {
      // Remove the budget if empty or zero
      delete updatedBudgets[name];
    } else {
      // Set the budget value
      updatedBudgets[name] = newBudgetValue;
    }
    
    // Update local state
    setBudgets(updatedBudgets);
    
    // Save to Firebase
    await saveBudgets(uid, updatedBudgets);
  };

  if (loading) return <Loader />;
  

  return (
    <div className="min-vh-100 dashboard-bg">
      <div className="container py-4" style={{ maxWidth: "720px", paddingBottom: "90px" }}>

        <h5 className="text-center mb-3">Category Budgets</h5>

        {categories.length === 0 ? (
          <div className="text-center text-muted">
            No categories found. Add expenses first to see categories.
          </div>
        ) : (
          categories.map((c) => (
            <div key={c.name} className="card p-3 mb-2 d-flex justify-content-between flex-row align-items-center">
              <div>{c.icon} {c.name}</div>

              <input
                type="number"
                placeholder="Set limit"
                value={budgets[c.name] || ""}
                className="form-control w-50"
                onChange={(e) => {
                  const updated = { ...budgets };
                  const val = e.target.value;
                  updated[c.name] = val === "" ? "" : Number(val);
                  setBudgets(updated);
                }}
                onBlur={(e) => save(c.name, e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default CategoryBudgets;