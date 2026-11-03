const currentMonth = new Date();
const dateInCurrentMonth = (day) => {
  const date = new Date(currentMonth);
  date.setDate(Math.max(1, currentMonth.getDate() - (day - 1)));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const DEMO_USER = {
  name: "Alex Morgan",
  email: "alex.demo@example.com",
  phone: "",
  incomeAmount: 77500,
  incomeType: "monthly",
};

export const DEMO_CATEGORIES = [
  { name: "Housing", icon: "🏠", locked: true },
  { name: "Groceries", icon: "🛒", locked: true },
  { name: "Transport", icon: "🚕", locked: true },
  { name: "Shopping", icon: "🛍️", locked: true },
  { name: "Entertainment", icon: "🎮", locked: true },
  { name: "Utilities", icon: "💡", locked: true },
  { name: "Bills", icon: "📄", locked: true },
  { name: "Health", icon: "💊", locked: true },
];

export const DEMO_EXPENSES = [
  { id: "demo-rent", category: "Housing", amount: 18000, date: dateInCurrentMonth(2), note: "House Rent" },
  { id: "demo-groceries", category: "Groceries", amount: 3240, date: dateInCurrentMonth(5), note: "Grocery Shopping" },
  { id: "demo-transport", category: "Transport", amount: 1200, date: dateInCurrentMonth(7), note: "Local travel" },
  { id: "demo-shopping", category: "Shopping", amount: 2400, date: dateInCurrentMonth(9), note: "Household essentials" },
  { id: "demo-entertainment", category: "Entertainment", amount: 800, date: dateInCurrentMonth(12), note: "Movie night" },
  { id: "demo-utilities", category: "Utilities", amount: 1800, date: dateInCurrentMonth(15), note: "Electricity Bill" },
  { id: "demo-bills", category: "Bills", amount: 999, date: dateInCurrentMonth(18), note: "Internet Bill" },
  { id: "demo-health", category: "Health", amount: 2801, date: dateInCurrentMonth(21), note: "Pharmacy and checkup" },
];

export const DEMO_INCOME_TRANSACTIONS = [
  { id: "demo-salary", category: "Salary", amount: 65000, date: dateInCurrentMonth(1), note: "Monthly Salary", type: "income" },
  { id: "demo-freelance", category: "Other", amount: 12500, date: dateInCurrentMonth(9), note: "Freelance Work", type: "income" },
];

export const DEMO_BUDGETS = {
  Housing: 26000,
  Groceries: 4000,
  Transport: 3000,
  Shopping: 5000,
  Entertainment: 2000,
  Utilities: 3000,
  Bills: 2000,
  Health: 2500,
};

export const DEMO_MONTHLY_SUMMARIES = Array.from({ length: 6 }, (_, index) => {
  const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 5 + index, 1);
  const factor = [0.92, 0.96, 0.9, 1.04, 0.97, 1][index];
  const expenses = Math.round(31240 * factor);
  const income = index === 5 ? DEMO_USER.incomeAmount : Math.round(77500 * (index < 3 ? 0.94 : 1));

  return {
    label: month.toLocaleDateString("en-IN", { month: "short" }),
    income,
    expenses,
    savings: income - expenses,
  };
});

export const DEMO_DATA = {
  user: DEMO_USER,
  expenses: DEMO_EXPENSES,
  categories: DEMO_CATEGORIES,
  budgets: DEMO_BUDGETS,
  currency: "INR",
  incomeTransactions: DEMO_INCOME_TRANSACTIONS,
  monthlySummaries: DEMO_MONTHLY_SUMMARIES,
};
