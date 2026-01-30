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

/* USER */

export const saveUser = (uid, data) =>
  setDoc(doc(db, "users", uid), data, { merge: true });

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

/* EXPENSES */

export const addExpense = (uid, expense) =>
  addDoc(collection(db, "users", uid, "expenses"), expense);

export const getExpenses = async (uid) => {
  const snap = await getDocs(collection(db, "users", uid, "expenses"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteExpense = (uid, id) =>
  deleteDoc(doc(db, "users", uid, "expenses", id));
