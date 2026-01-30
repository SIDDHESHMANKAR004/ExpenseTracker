// import { useEffect, useState } from "react";
// import { getSymbol } from "../utils/currency";
// import { shouldWarnIncome, getHighestCategory } from "../utils/budget";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [showWarning, setShowWarning] = useState(true);

//   const symbol = getSymbol();

//   useEffect(() => {
//     setUser(JSON.parse(localStorage.getItem("user")));
//     setExpenses(JSON.parse(localStorage.getItem("expenses")) || []);

//     const hide = localStorage.getItem("hideBudgetWarning");
//     if (hide === "true") setShowWarning(false);
//   }, []);

//   const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
//   const income = user ? Number(user.incomeAmount) : 0;
//   const balance = income - totalExpense;

//   const spentPercent = income ? (totalExpense / income) * 100 : 0;

//   const timeReached = user
//     ? shouldWarnIncome(user.incomeType, totalExpense)
//     : false;

//   const highest = getHighestCategory(expenses);

//   const today = new Date();
//   const month = today.toLocaleString("default", { month: "short" });
//   const year = today.getFullYear();

//   useEffect(() => {
//     if (!user || expenses.length === 0) return;

//     if (spentPercent >= 90 && timeReached) {
//       const hide = localStorage.getItem("hideBudgetWarning");
//       if (hide !== "true") setShowWarning(true);
//     }
//   }, [spentPercent, timeReached, user, expenses]);

//   if (!user) return null;

//   return (
//     <div className="min-vh-100 dashboard-bg">
//       <div className="container py-3" style={{ maxWidth: "720px", paddingBottom: "90px" }}  >
//         {/* Summary Card */}
//         <div
//           className="card p-3 mb-3"
//           style={{
//             background: "linear-gradient(135deg,#2563EB,#1E40AF)",
//             color: "white",
//           }}
//         >
//           <div className="d-flex justify-content-between opacity-75">
//             <span>{year}</span>
//             <span>Expenses</span>
//             <span>Income</span>
//             <span>Balance</span>
//           </div>

//           <div className="d-flex justify-content-between fw-semibold mt-1">
//             <span>{month}</span>

//             <span>
//               {symbol}
//               {totalExpense}
//             </span>

//             <span>
//               {symbol}
//               {income}
//             </span>

//             <span>
//               {symbol}
//               {balance}
//             </span>
//           </div>
//         </div>

//         {/* Records */}
//         {expenses.length === 0 ? (
//           <div className="text-center text-muted mt-5">No records</div>
//         ) : (
//           expenses.map((e) => (
//             <div
//   key={e.id}
//   className="card p-3 mb-2 d-flex justify-content-between flex-row align-items-center"
// >

//               <div>
//                 <div>{e.category}</div>
//                 <small className="text-muted">{e.date}</small>
//               </div>

//               <div style={{ color: "var(--expense)" }}>
//                 -{symbol}
//                 {e.amount}
//               </div>
//             </div>
//           ))
//         )}
//         {/* Warning Card */}
//         {showWarning && spentPercent >= 90 && (
//           <div
//             className="card p-3 mb-3"
//             style={{
//               borderLeft: "6px solid var(--expense)",
//               background: "var(--surface)",
//             }}
//           >
//             <strong style={{ color: "var(--expense)" }}>⚠ Budget Alert</strong>

//             <div className="mt-2">
//               You've used {spentPercent.toFixed(1)}% of your income.
//             </div>

//             <div className="text-muted">Most spent on: {highest.category}</div>

//             <div className="d-flex gap-2 mt-3">
//               <button
//                 className="btn btn-sm btn-outline-secondary"
//                 onClick={() => setShowWarning(false)}
//               >
//                 Cancel
//               </button>

//               <button
//                 className="btn btn-sm btn-primary"
//                 onClick={() => {
//                   localStorage.setItem("hideBudgetWarning", "true");
//                   setShowWarning(false);
//                 }}
//               >
//                 Don’t show again
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSymbol } from "../utils/currency";
import { shouldWarnIncome, getHighestCategory } from "../utils/budget";
import { getUser, getExpenses } from "../services/db";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showWarning, setShowWarning] = useState(true);
  const navigate = useNavigate();

  const symbol = getSymbol();
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const loadData = async () => {
      // Try to get data from Firebase first
      const firebaseUser = await getUser(uid);
      const firebaseExpenses = await getExpenses(uid);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem("user", JSON.stringify(firebaseUser));
      } else {
        // Fallback to localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
      
      if (firebaseExpenses && firebaseExpenses.length > 0) {
        setExpenses(firebaseExpenses);
        localStorage.setItem("expenses", JSON.stringify(firebaseExpenses));
      } else {
        // Fallback to localStorage
        const storedExpenses = localStorage.getItem("expenses");
        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses) || []);
        }
      }

      // Check for warning hide preference
      const hide = localStorage.getItem("hideBudgetWarning");
      if (hide === "true") setShowWarning(false);
    };

    loadData();
  }, [uid, navigate]);

  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const income = user ? Number(user.incomeAmount) : 0;
  const balance = income - totalExpense;

  const spentPercent = income ? (totalExpense / income) * 100 : 0;

  const timeReached = user
    ? shouldWarnIncome(user.incomeType, totalExpense)
    : false;

  const highest = getHighestCategory(expenses);

  const today = new Date();
  const month = today.toLocaleString("default", { month: "short" });
  const year = today.getFullYear();

  useEffect(() => {
    if (!user || expenses.length === 0) return;

    if (spentPercent >= 90 && timeReached) {
      const hide = localStorage.getItem("hideBudgetWarning");
      if (hide !== "true") setShowWarning(true);
    }
  }, [spentPercent, timeReached, user, expenses]);

  if (!user) return null;

  return (
    <div className="min-vh-100 dashboard-bg">
      <div className="container py-3" style={{ maxWidth: "720px", paddingBottom: "90px" }}  >
        {/* Summary Card */}
        <div
          className="card p-3 mb-3"
          style={{
            background: "linear-gradient(135deg,#2563EB,#1E40AF)",
            color: "white",
          }}
        >
          <div className="d-flex justify-content-between opacity-75">
            <span>{year}</span>
            <span>Expenses</span>
            <span>Income</span>
            <span>Balance</span>
          </div>

          <div className="d-flex justify-content-between fw-semibold mt-1">
            <span>{month}</span>

            <span>
              {symbol}
              {totalExpense}
            </span>

            <span>
              {symbol}
              {income}
            </span>

            <span>
              {symbol}
              {balance}
            </span>
          </div>
        </div>

        {/* Records */}
        {expenses.length === 0 ? (
          <div className="text-center text-muted mt-5">No records</div>
        ) : (
          expenses.map((e) => (
            <div
              key={e.id}
              className="card p-3 mb-2 d-flex justify-content-between flex-row align-items-center"
            >
              <div>
                <div>{e.category}</div>
                <small className="text-muted">{e.date}</small>
              </div>

              <div style={{ color: "var(--expense)" }}>
                -{symbol}
                {e.amount}
              </div>
            </div>
          ))
        )}
        
        {/* Warning Card */}
        {showWarning && spentPercent >= 90 && (
          <div
            className="card p-3 mb-3"
            style={{
              borderLeft: "6px solid var(--expense)",
              background: "var(--surface)",
            }}
          >
            <strong style={{ color: "var(--expense)" }}>⚠ Budget Alert</strong>

            <div className="mt-2">
              You've used {spentPercent.toFixed(1)}% of your income.
            </div>

            <div className="text-muted">Most spent on: {highest.category}</div>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowWarning(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  localStorage.setItem("hideBudgetWarning", "true");
                  setShowWarning(false);
                }}
              >
                Don't show again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;