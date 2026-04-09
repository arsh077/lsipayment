import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "./firebase";
import { MainSale, EmployeeSale, Employee } from "../types";

// Collection Names
const COLLECTIONS = {
  MAIN_SALES: "mainSales",
  EMPLOYEE_SALES: "employeeSales",
  EMPLOYEES: "employees",
};

// --- Main Sales Operations ---
export const addMainSale = async (sale: Omit<MainSale, 'id'>) => {
  return await addDoc(collection(db, COLLECTIONS.MAIN_SALES), {
    ...sale,
    createdAt: new Date().toISOString()
  });
};

export const getMainSales = async () => {
  const q = query(collection(db, COLLECTIONS.MAIN_SALES), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MainSale[];
};

export const updateMainSale = async (id: string, sale: Partial<MainSale>) => {
  const saleDoc = doc(db, COLLECTIONS.MAIN_SALES, id);
  return await updateDoc(saleDoc, sale);
};

export const deleteMainSale = async (id: string) => {
  const saleDoc = doc(db, COLLECTIONS.MAIN_SALES, id);
  return await deleteDoc(saleDoc);
};

// --- Employee Sales Operations ---
export const addEmployeeSale = async (sale: Omit<EmployeeSale, 'id'>) => {
  return await addDoc(collection(db, COLLECTIONS.EMPLOYEE_SALES), {
    ...sale,
    createdAt: new Date().toISOString()
  });
};

export const getEmployeeSales = async () => {
  const q = query(collection(db, COLLECTIONS.EMPLOYEE_SALES), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EmployeeSale[];
};

export const updateEmployeeSale = async (id: string, sale: Partial<EmployeeSale>) => {
  const saleDoc = doc(db, COLLECTIONS.EMPLOYEE_SALES, id);
  return await updateDoc(saleDoc, sale);
};

export const deleteEmployeeSale = async (id: string) => {
  const saleDoc = doc(db, COLLECTIONS.EMPLOYEE_SALES, id);
  return await deleteDoc(saleDoc);
};

// --- Employees Operations ---
export const addEmployee = async (employee: Omit<Employee, 'id'>) => {
  return await addDoc(collection(db, COLLECTIONS.EMPLOYEES), employee);
};

export const getEmployees = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.EMPLOYEES));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
};

export const deleteAllData = async () => {
  const mainSnapshot = await getDocs(collection(db, COLLECTIONS.MAIN_SALES));
  for (const document of mainSnapshot.docs) {
    await deleteDoc(doc(db, COLLECTIONS.MAIN_SALES, document.id));
  }
  
  const empSnapshot = await getDocs(collection(db, COLLECTIONS.EMPLOYEE_SALES));
  for (const document of empSnapshot.docs) {
    await deleteDoc(doc(db, COLLECTIONS.EMPLOYEE_SALES, document.id));
  }
};
