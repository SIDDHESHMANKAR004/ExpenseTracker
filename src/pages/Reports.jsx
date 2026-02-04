// import SwipeWrapper from "../components/SwipeWrapper";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { getSymbol } from "../utils/currency";
// import { getUser, getExpenses } from "../services/db";
// import Loader from "../components/Loader";

// const Reports = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const symbol = getSymbol();
//   const navigate = useNavigate();

//   const uid = sessionStorage.getItem("uid");

//   useEffect(() => {
//     if (!uid) {
//       navigate("/onboarding");
//       return;
//     }

//     const loadData = async () => {
//       try {
//         const firebaseUser = await getUser(uid);
//         const firebaseExpenses = await getExpenses(uid);
        
//         setUser(firebaseUser);
//          const sorted = (firebaseExpenses || []).sort((a, b) => {
//         if (!a.createdAt || !b.createdAt) return 0;
//         return b.createdAt.seconds - a.createdAt.seconds;
//       });

//       setExpenses(sorted);
//       } catch (error) {
//         console.error("Error loading reports:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [uid, navigate]);

// if (loading) {
//     return (
//       <SwipeWrapper>
//         <div className="min-vh-100 dashboard-bg d-flex justify-content-center align-items-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">
//               <Loader />
//             </span>
//           </div>
//         </div>
//       </SwipeWrapper>
//     );
//   }

//   if (!user) return null;

//   const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
//   const income = Number(user.incomeAmount || 0);

//   return (
//     <SwipeWrapper>
//       <div className="min-vh-100 dashboard-bg">
//         <div
//           className="container py-3"
//           style={{ maxWidth: "720px", paddingBottom: "90px" }}
//         >
//           <div className="card p-4">

//             {/* Header */}
//             <div className="text-center mb-3">
//               <h4 style={{ color: "var(--primary)" }}>Reports</h4>
//               <small className="text-muted">All your transactions</small>
//             </div>

//             {/* Summary */}
//             <div className="row text-center my-3">
//               <div className="col-6">
//                 <div className="text-muted">Total Spent</div>
//                 <div style={{ color: "var(--expense)", fontWeight: 600 }}>
//                   {symbol}{totalExpense}
//                 </div>
//               </div>

//               <div className="col-6">
//                 <div className="text-muted">
//                   Income ({user.incomeType || "monthly"})
//                 </div>
//                 <div style={{ color: "var(--success)", fontWeight: 600 }}>
//                   {symbol}{income}
//                 </div>
//               </div>
//             </div>

//             <hr />

//             {/* Records */}
//             {expenses.length === 0 ? (
//               <div className="text-center text-muted mt-4">
//                 No expenses recorded yet.
//               </div>
//             ) : (
//               expenses.map((exp) => (
//                 <div
//                   key={exp.id}
//                   className="card p-3 mb-2 d-flex justify-content-between flex-row align-items-center"
//                 >
//                   <div>
//                     <div>{exp.category}</div>
//                     <small className="text-muted">{exp.date}</small>
//                     {exp.note && (
//                       <div className="text-muted" style={{ fontSize: "12px" }}>
//                         {exp.note}
//                       </div>
//                     )}
//                   </div>

//                   <div style={{ color: "var(--expense)", fontWeight: 600 }}>
//                     -{symbol}{exp.amount}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </SwipeWrapper>
//   );
// };

// export default Reports;
import SwipeWrapper from "../components/SwipeWrapper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSymbol } from "../utils/currency";
import { getUser, getExpenses } from "../services/db";
import Loader from "../components/Loader";

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const symbol = getSymbol();
  const navigate = useNavigate();

  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      navigate("/onboarding");
      return;
    }

    const loadData = async () => {
      try {
        const firebaseUser = await getUser(uid);
        const firebaseExpenses = await getExpenses(uid);
        
        setUser(firebaseUser);
        const sorted = (firebaseExpenses || []).sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.seconds - a.createdAt.seconds;
        });

        setExpenses(sorted);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [uid, navigate]);

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

  if (!user) return null;

  const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const income = Number(user.incomeAmount || 0);

  return (
    <SwipeWrapper>
      <div className="min-vh-100 dashboard-bg">
        <div
          className="container py-3"
          style={{ maxWidth: "720px", paddingBottom: "90px" }}
        >
          {/* Primary Color Section - 60% */}
          <div
            className="card p-4 mb-3"
            style={{
              background: "linear-gradient(135deg, #2563EB, #1E40AF)",
              color: "white",
              border: "none"
            }}
          >
            {/* Header */}
            <div className="text-center mb-3">
              <h4 style={{ color: "white" }}>Reports</h4>
            </div>

            {/* Summary */}
            <div className="row text-center my-3">
              <div className="col-6">
                <div style={{ opacity: 0.9 }}>Total Spent</div>
                <div style={{ color: "white", fontWeight: 600, fontSize: "1.2rem" }}>
                  {symbol}{totalExpense}
                </div>
              </div>

              <div className="col-6">
                <div style={{ opacity: 0.9 }}>
                  Income ({user.incomeType || "monthly"})
                </div>
                <div style={{ color: "white", fontWeight: 600, fontSize: "1.2rem" }}>
                  {symbol}{income}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary/Neutral Section - 30% */}
          <div className="card p-0">
            {/* Records Header */}
            <div className="p-3" style={{ 
              background: "var(--surface)", 
              borderBottom: "1px solid #e9ecef" 
            }}>
              <div className="d-flex justify-content-between text-muted">
                <span>Category</span>
                <span>Amount</span>
              </div>
            </div>

            {/* Records List */}
            {expenses.length === 0 ? (
              <div className="text-center text-muted p-4">
                No expenses recorded yet.
              </div>
            ) : (
              <div className="p-3">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="mb-2 d-flex justify-content-between flex-row align-items-center py-2"
                    style={{ borderBottom: "1px solid #f8f9fa" }}
                  >
                    <div>
                      <div style={{ color: "var(--text-primary)" }}>{exp.category}</div>
                      <small className="text-muted">{exp.date}</small>
                      {exp.note && (
                        <div className="text-muted" style={{ fontSize: "12px" }}>
                          {exp.note}
                        </div>
                      )}
                    </div>

                    {/* Accent Color - 10% */}
                    <div style={{ color: "var(--expense)", fontWeight: 600 }}>
                      -{symbol}{exp.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SwipeWrapper>
  );
};

export default Reports;