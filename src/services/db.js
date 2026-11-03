import { query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { isDemoMode } from "../utils/demoMode";

const assertWritesAllowed = () => {
  if (isDemoMode()) {
    throw new Error("Writes are disabled while exploring demo mode.");
  }
};

/* ================= USERS ================= */

export const saveUser = (uid, data) => {
  assertWritesAllowed();
  return setDoc(doc(db, "users", uid), data, { merge: true });
};

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

/* ================= EXPENSES ================= */

export const addExpense = (uid, expense) => {
  assertWritesAllowed();
  return addDoc(collection(db, "users", uid, "expenses"), expense);
};


export const getExpenses = async (uid) => {
  const q = query(
    collection(db, "users", uid, "expenses"),
    orderBy("createdAt", "desc"),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const deleteExpense = (uid, id) => {
  assertWritesAllowed();
  return deleteDoc(doc(db, "users", uid, "expenses", id));
};

/* ================= CATEGORIES ================= */

export const getCategories = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid, "meta", "categories"));
  return snap.exists() ? snap.data().list : null;
};

export const saveCategories = (uid, list) => {
  assertWritesAllowed();
  return setDoc(doc(db, "users", uid, "meta", "categories"), { list });
};

export const deleteCategory = async (uid, name) => {
  assertWritesAllowed();
  const cats = await getCategories(uid);
  if (!cats) return;

  const filtered = cats.filter((c) => c.name !== name);
  await saveCategories(uid, filtered);
};

/* ================= BUDGETS ================= */

export const getBudgets = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid, "meta", "budgets"));
  return snap.exists() ? snap.data() : {};
};

export const saveBudgets = (uid, budgets) => {
  assertWritesAllowed();
  return setDoc(doc(db, "users", uid, "meta", "budgets"), budgets);
};

/* ================= CURRENCY ================= */

export const getCurrency = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid, "meta", "currency"));
  return snap.exists() ? snap.data().currency : "INR";
};

export const saveCurrency = (uid, currency) => {
  assertWritesAllowed();
  return setDoc(
    doc(db, "users", uid, "meta", "currency"),
    { currency },
    { merge: true },
  );
};

/* ================= COMPLETE USER META DATA ================= */

export const getUserMeta = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid, "meta", "settings"));
  if (snap.exists()) {
    return snap.data();
  }
  // Return default settings if none exist
  return {
    currency: "INR",
    categories: [],
    budgets: {},
  };
};

export const saveUserMeta = (uid, data) => {
  assertWritesAllowed();
  const safe = { ...data };
  delete safe.incomeAmount;
  delete safe.incomeType;

  return setDoc(doc(db, "users", uid, "meta", "settings"), safe, {
    merge: true,
  });
};
