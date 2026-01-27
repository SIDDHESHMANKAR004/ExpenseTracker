export const shouldWarnIncome = (incomeType, spent) => {
  const today = new Date();

  if (incomeType === "weekly") {
    return today.getDay() >= 5;
  }

  if (incomeType === "monthly") {
    return today.getDate() >= 25;
  }

  if (incomeType === "yearly") {
    return today.getMonth() >= 10;
  }

  return false;
};

export const getHighestCategory = (expenses) => {
  const map = {};

  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
  });

  let max = 0;
  let cat = "";

  for (let k in map) {
    if (map[k] > max) {
      max = map[k];
      cat = k;
    }
  }

  return { category: cat, amount: max };
};
