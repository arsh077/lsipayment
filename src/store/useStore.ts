import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MainSale, EmployeeSale, Employee } from '../types';
import * as firestore from '../lib/firestore';
import { User } from 'firebase/auth';

interface AppState {
  user: User | null;
  mainSales: MainSale[];
  employeeSales: EmployeeSale[];
  employees: Employee[];
  isLoading: boolean;
  isFormOpen: boolean;
  
  setUser: (user: User | null) => void;
  fetchInitialData: () => Promise<void>;
  setFormOpen: (open: boolean) => void;
  
  addUnifiedSale: (data: any) => Promise<void>;
  
  addMainSale: (sale: Omit<MainSale, 'id'>) => Promise<void>;
  updateMainSale: (id: string, sale: Partial<MainSale>) => Promise<void>;
  deleteMainSale: (id: string) => Promise<void>;

  addEmployeeSale: (sale: Omit<EmployeeSale, 'id'>) => Promise<void>;
  updateEmployeeSale: (id: string, sale: Partial<EmployeeSale>) => Promise<void>;
  deleteEmployeeSale: (id: string) => Promise<void>;

  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  
  importMainSales: (sales: Omit<MainSale, 'id'>[]) => Promise<void>;
  importEmployeeSales: (sales: Omit<EmployeeSale, 'id'>[]) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      mainSales: [],
      employeeSales: [],
      employees: [
        { id: '1', name: 'Shahida', role: 'Sales Executive' },
        { id: '2', name: 'Deepali Kulshrestha', role: 'Sales Manager' },
      ],
      isLoading: false,
      isFormOpen: false,

      setUser: (user) => set({ user }),
      setFormOpen: (open) => set({ isFormOpen: open }),

      fetchInitialData: async () => {
        if (!get().user) return; // Only fetch if user is logged in
        
        set({ isLoading: true });
        try {
          const [mainSales, employeeSales, employees] = await Promise.all([
            firestore.getMainSales(),
            firestore.getEmployeeSales(),
            firestore.getEmployees()
          ]);
          
          set({ 
            mainSales, 
            employeeSales, 
            employees: employees.length > 0 ? employees : get().employees,
            isLoading: false 
          });
        } catch (error) {
          console.error("Error fetching initial data:", error);
          set({ isLoading: false });
        }
      },

      addUnifiedSale: async (data: any) => {
        set({ isLoading: true });
        try {
          // 1. Add to Main Sales (Master Log)
          await firestore.addMainSale({
            customerName: data.customerName,
            number: data.number,
            amount: Number(data.amount),
            feedback: data.feedback || '',
            date: new Date(data.date).toISOString()
          });

          // 2. If Employee Name is provided, ALSO add to Employee Sales
          if (data.employeeName && data.employeeName !== '') {
            await firestore.addEmployeeSale({
              employeeName: data.employeeName,
              leadName: data.customerName,
              number: data.number,
              amount: Number(data.amount),
              feedbackDuration: data.feedback || '',
              paymentStatus: data.paymentStatus || 'Full',
              dueAmount: Number(data.dueAmount) || 0,
              date: new Date(data.date).toISOString()
            });
          }

          // Refresh everything
          await get().fetchInitialData();
          set({ isFormOpen: false, isLoading: false });
        } catch (error) {
          console.error("Error adding unified sale:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      addMainSale: async (sale) => {
        const docRef = await firestore.addMainSale(sale);
        const newSale = { ...sale, id: docRef.id };
        set((state) => ({
          mainSales: [newSale, ...state.mainSales]
        }));
      },
      
      updateMainSale: async (id, updatedSale) => {
        await firestore.updateMainSale(id, updatedSale);
        set((state) => ({
          mainSales: state.mainSales.map(s => s.id === id ? { ...s, ...updatedSale } : s)
        }));
      },

      deleteMainSale: async (id) => {
        await firestore.deleteMainSale(id);
        set((state) => ({
          mainSales: state.mainSales.filter(s => s.id !== id)
        }));
      },
      
      addEmployeeSale: async (sale) => {
        const docRef = await firestore.addEmployeeSale(sale);
        const newSale = { ...sale, id: docRef.id };
        set((state) => ({
          employeeSales: [newSale, ...state.employeeSales]
        }));
      },
      
      updateEmployeeSale: async (id, updatedSale) => {
        await firestore.updateEmployeeSale(id, updatedSale);
        set((state) => ({
          employeeSales: state.employeeSales.map(s => s.id === id ? { ...s, ...updatedSale } : s)
        }));
      },

      deleteEmployeeSale: async (id) => {
        await firestore.deleteEmployeeSale(id);
        set((state) => ({
          employeeSales: state.employeeSales.filter(s => s.id !== id)
        }));
      },
      
      addEmployee: async (employee) => {
        const docRef = await firestore.addEmployee(employee);
        const newEmployee = { ...employee, id: docRef.id };
        set((state) => ({
          employees: [...state.employees, newEmployee]
        }));
      },
      
      importMainSales: async (sales) => {
        // Simple sequential import for now
        for (const sale of sales) {
          await firestore.addMainSale(sale);
        }
        await get().fetchInitialData();
      },
      
      importEmployeeSales: async (sales) => {
        // Simple sequential import for now
        for (const sale of sales) {
          await firestore.addEmployeeSale(sale);
        }
        await get().fetchInitialData();
      },
    }),
    {
      name: 'legal-success-storage',
      partialize: (state) => ({ 
        mainSales: state.mainSales, 
        employeeSales: state.employeeSales, 
        employees: state.employees 
      }),
    }
  )
);

