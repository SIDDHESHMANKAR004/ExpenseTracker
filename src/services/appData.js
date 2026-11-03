import { DEMO_DATA } from "../data/demoData";
import { isDemoMode } from "../utils/demoMode";
import * as firebaseData from "./db";

const blockedWrite = () =>
  Promise.reject(new Error("Writes are disabled while exploring demo mode."));

export const getUser = (uid) =>
  isDemoMode() ? Promise.resolve({ ...DEMO_DATA.user }) : firebaseData.getUser(uid);
export const getExpenses = (uid) =>
  isDemoMode()
    ? Promise.resolve(DEMO_DATA.expenses.map((expense) => ({ ...expense })))
    : firebaseData.getExpenses(uid);
export const getCategories = (uid) =>
  isDemoMode()
    ? Promise.resolve(DEMO_DATA.categories.map((category) => ({ ...category })))
    : firebaseData.getCategories(uid);
export const getBudgets = (uid) =>
  isDemoMode() ? Promise.resolve({ ...DEMO_DATA.budgets }) : firebaseData.getBudgets(uid);
export const getCurrency = (uid) =>
  isDemoMode() ? Promise.resolve(DEMO_DATA.currency) : firebaseData.getCurrency(uid);
export const getUserMeta = (uid) =>
  isDemoMode()
    ? Promise.resolve({
        ...DEMO_DATA.user,
        currency: DEMO_DATA.currency,
        categories: DEMO_DATA.categories.map((category) => ({ ...category })),
        budgets: { ...DEMO_DATA.budgets },
      })
    : firebaseData.getUserMeta(uid);

export const saveUser = (...args) => (isDemoMode() ? blockedWrite() : firebaseData.saveUser(...args));
export const addExpense = (...args) => (isDemoMode() ? blockedWrite() : firebaseData.addExpense(...args));
export const deleteExpense = (...args) => (isDemoMode() ? blockedWrite() : firebaseData.deleteExpense(...args));
export const saveCategories = (...args) => (isDemoMode() ? blockedWrite() : firebaseData.saveCategories(...args));
export const deleteCategory = (...args) => (isDemoMode() ? blockedWrite() : firebaseData.deleteCategory(...args));
export const saveBudgets = (...args) => (isDemoMode() ? blockedWrite() : firebaseData.saveBudgets(...args));
export const saveCurrency = (...args) => (isDemoMode() ? blockedWrite() : firebaseData.saveCurrency(...args));
export const saveUserMeta = (...args) => (isDemoMode() ? blockedWrite() : firebaseData.saveUserMeta(...args));
