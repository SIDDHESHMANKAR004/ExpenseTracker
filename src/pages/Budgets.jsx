// import { useState, useEffect } from "react";

// const categories = ["Food", "Transport", "Bills", "Shopping", "Other"];

// const Budgets = () => {
//   const [budgets, setBudgets] = useState({});

//   useEffect(() => {
//     setBudgets(JSON.parse(localStorage.getItem("budgets")) || {});
//   }, []);

//   const save = () => {
//     localStorage.setItem("budgets", JSON.stringify(budgets));
//     alert("Budgets saved");
//   };

//   return (
//     <div className="container py-4">
//       <div className="card p-4">
//         <h4>Category Budgets</h4>

//         {categories.map((c) => (
//           <input
//             key={c}
//             className="form-control mb-2"
//             placeholder={`${c} limit`}
//             value={budgets[c] || ""}
//             onChange={(e) =>
//               setBudgets({ ...budgets, [c]: Number(e.target.value) })
//             }
//           />
//         ))}

//         <button className="btn btn-primary w-100" onClick={save}>
//           Save Limits
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Budgets;
