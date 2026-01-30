// import { useLocation,useNavigate } from "react-router-dom";
// import { useState } from "react";

// const ExpenseDetails = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [form,setForm] = useState({
//     amount:"",
//     date:"",
//     note:""
//   });

//   if(!state?.category) navigate("/add-expense");

//   const save = ()=>{
//     if(!form.amount || !form.date) return;

//     const expenses = JSON.parse(localStorage.getItem("expenses"))||[];

//     expenses.push({
//       id:Date.now(),
//       category:state.category,
//       amount:Number(form.amount),
//       date:form.date,
//       note:form.note
//     });

//     localStorage.setItem("expenses",JSON.stringify(expenses));
//     navigate("/dashboard");
//   };

//   return (
//     <div className="min-vh-100 dashboard-bg">
//       <div className="container py-4" style={{maxWidth:"720px"}}>

//         <div className="card p-4">
//           <h5 style={{color:"var(--primary)"}}>
//             {state.category}
//           </h5>

//           <input className="form-control mb-2"
//             placeholder="Amount"
//             type="number"
//             onChange={e=>setForm({...form,amount:e.target.value})}
//           />

//           <input className="form-control mb-2"
//             type="date"
//             onChange={e=>setForm({...form,date:e.target.value})}
//           />

//           <textarea className="form-control mb-3"
//             placeholder="Note"
//             onChange={e=>setForm({...form,note:e.target.value})}
//           />

//           <button className="btn btn-primary w-100" onClick={save}>
//             Save
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ExpenseDetails;

