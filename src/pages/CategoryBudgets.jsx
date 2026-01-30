import { useEffect, useState } from "react";

const CategoryBudgets = () => {
  const [categories,setCategories]=useState([]);
  const [budgets,setBudgets]=useState({});

  useEffect(()=>{
    setCategories(JSON.parse(localStorage.getItem("categories"))||[]);
    setBudgets(JSON.parse(localStorage.getItem("budgets"))||{});
  },[]);

  const save=(name,val)=>{
    const b={...budgets,[name]:Number(val)};
    setBudgets(b);
    localStorage.setItem("budgets",JSON.stringify(b));
  };

  return (
    <div className="min-vh-100 dashboard-bg">
      <div className="container py-4" style={{maxWidth:"720px",paddingBottom:"90px"}}>

        <h5 className="text-center mb-3">Category Budgets</h5>

        {categories.map(c=>(
          <div key={c.name} className="card p-3 mb-2 d-flex justify-content-between flex-row align-items-center">
            <div>{c.icon} {c.name}</div>

            <input
              type="number"
              placeholder="Limit"
              defaultValue={budgets[c.name]||""}
              className="form-control w-50"
              onBlur={e=>save(c.name,e.target.value)}
            />
          </div>
        ))}

      </div>
    </div>
  );
};

export default CategoryBudgets;
