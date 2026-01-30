// import { useEffect, useState } from "react";
// import { getSymbol } from "../utils/currency";

// const Reports = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [user, setUser] = useState(null);
//   const symbol = getSymbol();

//   useEffect(() => {
//     setUser(JSON.parse(localStorage.getItem("user")));
//     setExpenses(JSON.parse(localStorage.getItem("expenses")) || []);
//   }, []);

//   if (!user) return null;

//   const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
//   const income = Number(user.incomeAmount);

//   return (
//     <div className="min-vh-100 dashboard-bg">
//       <div
//         className="container py-3"
//         style={{ maxWidth: "720px", paddingBottom: "90px" }}
//       >
//         <div className="card p-4">

//           {/* Header */}
//           <div className="text-center mb-3">
//             <h4 style={{ color: "var(--primary)" }}>Reports</h4>
//             <small className="text-muted">All your transactions</small>
//           </div>

//           {/* Summary */}
//           <div className="row text-center my-3">
//             <div className="col-6">
//               <div className="text-muted">Total Spent</div>
//               <div style={{ color: "var(--expense)", fontWeight: 600 }}>
//                 {symbol}{totalExpense}
//               </div>
//             </div>

//             <div className="col-6">
//               <div className="text-muted">
//                 Income ({user.incomeType})
//               </div>
//               <div style={{ color: "var(--success)", fontWeight: 600 }}>
//                 {symbol}{income}
//               </div>
//             </div>
//           </div>

//           <hr />

//           {/* Records */}
//           {expenses.length === 0 ? (
//             <div className="text-center text-muted mt-4">
//               No expenses recorded yet.
//             </div>
//           ) : (
//             expenses.map((exp) => (
//               <div
//                 key={exp.id}
//                 className="card p-3 mb-2 d-flex justify-content-between flex-row align-items-center"
//               >
//                 <div>
//                   <div>{exp.category}</div>
//                   <small className="text-muted">{exp.date}</small>
//                   {exp.note && (
//                     <div className="text-muted" style={{ fontSize: "12px" }}>
//                       {exp.note}
//                     </div>
//                   )}
//                 </div>

//                 <div style={{ color: "var(--expense)", fontWeight: 600 }}>
//                   -{symbol}{exp.amount}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reports;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSymbol } from "../utils/currency";
import { getUser, getExpenses } from "../services/db";

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const symbol = getSymbol();
  const navigate = useNavigate();

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
    };

    loadData();
  }, [uid, navigate]);

  if (!user) return null;

  const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const income = Number(user.incomeAmount);

  return (
    <div className="min-vh-100 dashboard-bg">
      <div
        className="container py-3"
        style={{ maxWidth: "720px", paddingBottom: "90px" }}
      >
        <div className="card p-4">

          {/* Header */}
          <div className="text-center mb-3">
            <h4 style={{ color: "var(--primary)" }}>Reports</h4>
            <small className="text-muted">All your transactions</small>
          </div>

          {/* Summary */}
          <div className="row text-center my-3">
            <div className="col-6">
              <div className="text-muted">Total Spent</div>
              <div style={{ color: "var(--expense)", fontWeight: 600 }}>
                {symbol}{totalExpense}
              </div>
            </div>

            <div className="col-6">
              <div className="text-muted">
                Income ({user.incomeType})
              </div>
              <div style={{ color: "var(--success)", fontWeight: 600 }}>
                {symbol}{income}
              </div>
            </div>
          </div>

          <hr />

          {/* Records */}
          {expenses.length === 0 ? (
            <div className="text-center text-muted mt-4">
              No expenses recorded yet.
            </div>
          ) : (
            expenses.map((exp) => (
              <div
                key={exp.id}
                className="card p-3 mb-2 d-flex justify-content-between flex-row align-items-center"
              >
                <div>
                  <div>{exp.category}</div>
                  <small className="text-muted">{exp.date}</small>
                  {exp.note && (
                    <div className="text-muted" style={{ fontSize: "12px" }}>
                      {exp.note}
                    </div>
                  )}
                </div>

                <div style={{ color: "var(--expense)", fontWeight: 600 }}>
                  -{symbol}{exp.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;