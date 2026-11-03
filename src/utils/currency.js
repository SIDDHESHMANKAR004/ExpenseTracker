import { isDemoMode } from "./demoMode";

export const currencyMap = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  JPY: "¥",
  CNY: "¥"
};

export const getCurrency = () => {
  if (isDemoMode()) return "INR";
  return localStorage.getItem("currency") || "INR";
};

export const getSymbol = () => {
  const code = getCurrency();
  return currencyMap[code] || "₹";
};
