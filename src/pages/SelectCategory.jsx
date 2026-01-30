// import { useNavigate } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";

// const DEFAULT_CATEGORIES = [
//   "Shopping",
//   "Food",
//   "Phone",
//   "Entertainment",
//   "Education",
//   "Beauty",
//   "Sports",
//   "Social",
//   "Transport",
//   "Clothing",
//   "Car",
//   "Alcohol",
//   "Cigarettes",
//   "Electronics",
//   "Travel",
//   "Health",
//   "Pets",
//   "Repairs",
//   "Housing",
//   "Home",
//   "Gifts",
//   "Donations",
//   "Lottery",
//   "Snacks",
// ];

// const TILE_STYLE = {
//   height: "90px",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const SelectCategory = () => {
//   const navigate = useNavigate();
//   const pressTimer = useRef(null);

//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("categories"));
//     if (stored && stored.length) {
//       setCategories(stored);
//     } else {
//       localStorage.setItem("categories", JSON.stringify(DEFAULT_CATEGORIES));
//       setCategories(DEFAULT_CATEGORIES);
//     }
//   }, []);

//   const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
//   const budgets = JSON.parse(localStorage.getItem("budgets")) || {};

//   const getSpent = (cat) =>
//     expenses
//       .filter((e) => e.category === cat)
//       .reduce((s, e) => s + Number(e.amount), 0);

//   /* ---------- Add Category ---------- */

//   const addCategory = () => {
//     const name = prompt("Enter new category name");
//     if (!name) return;

//     if (categories.includes(name)) return;

//     const updated = [...categories, name];
//     setCategories(updated);
//     localStorage.setItem("categories", JSON.stringify(updated));
//   };

//   /* ---------- Long Press Delete ---------- */

//   const startPress = (cat) => {
//     pressTimer.current = setTimeout(() => {
//       const ok = confirm(
//         `Delete "${cat}" category?\nAll related records will also be removed.`,
//       );
//       if (!ok) return;

//       // remove category
//       const updatedCats = categories.filter((c) => c !== cat);
//       setCategories(updatedCats);
//       localStorage.setItem("categories", JSON.stringify(updatedCats));

//       // remove related expenses
//       const filteredExpenses = expenses.filter((e) => e.category !== cat);
//       localStorage.setItem("expenses", JSON.stringify(filteredExpenses));

//       // remove budget if exists
//       const newBudgets = { ...budgets };
//       delete newBudgets[cat];
//       localStorage.setItem("budgets", JSON.stringify(newBudgets));
//     }, 600); // long press = 600ms
//   };

//   const cancelPress = () => {
//     clearTimeout(pressTimer.current);
//   };

//   return (
//     <div className="min-vh-100 dashboard-bg">
//       <div
//         className="container py-3"
//         style={{ maxWidth: "720px", paddingBottom: "90px" }}
//       >
//         <h5 className="text-center mb-3">Select Category</h5>

//         <div className="row g-3">
//           {categories.map((cat) => {
//             const spent = getSpent(cat);
//             const limit = budgets[cat];
//             const exceeded = limit && spent >= limit;

//             return (
//               <div key={cat} className="col-3">
//                 <div
//                   className="card"
//                   style={{
//                     ...TILE_STYLE,
//                     opacity: exceeded ? 0.4 : 1,
//                     pointerEvents: exceeded ? "none" : "auto",
//                     textAlign: "center",
//                     cursor: "pointer",
//                   }}
//                   onClick={() =>
//                     navigate("/expense-details", { state: { category: cat } })
//                   }
//                   onMouseDown={() => startPress(cat)}
//                   onMouseUp={cancelPress}
//                   onMouseLeave={cancelPress}
//                   onTouchStart={() => startPress(cat)}
//                   onTouchEnd={cancelPress}
//                 >
//                   <div style={{ fontSize: "20px" }}>💰</div>
//                   <small style={{ lineHeight: "1.1" }}>{cat}</small>

//                   {exceeded && (
//                     <small className="text-danger" style={{ fontSize: "10px" }}>
//                       Limit
//                     </small>
//                   )}
//                 </div>
//               </div>
//             );
//           })}

         
//           {/* Custom Category Tile */}
//           <div className="col-3">
//             <div
//               onClick={addCategory}
//               style={{
//                 height: "90px",
//                 border: "2px dashed var(--primary)",
//                 borderRadius: "14px",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 color: "var(--primary)",
//                 background: "rgba(37,99,235,0.05)",
//               }}
//             >
//               <div style={{ fontSize: "26px", lineHeight: 1 }}>＋</div>
//               <small>Add Category</small>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelectCategory;
