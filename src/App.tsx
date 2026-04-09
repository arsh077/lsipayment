import React, { useState, useEffect } from 'react';
import { Header } from './components/dashboard/Header';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { MainSalesBoard } from './components/dashboard/MainSalesBoard';
import { EmployeeSalesBoard } from './components/dashboard/EmployeeSalesBoard';
import { BulkImport } from './components/dashboard/BulkImport';
import { MonthlyCharts } from './components/dashboard/MonthlyCharts';
import { BottomNav, TabType } from './components/navigation/BottomNav';
import { MobileReports } from './components/dashboard/MobileReports';
import { useStore } from './store/useStore';
import { Login } from './components/auth/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { mainSales, employeeSales, fetchInitialData, user, setUser, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user, fetchInitialData]);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-gray-600 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const totalMainSales = mainSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalEmployeeSales = employeeSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalSales = totalMainSales + totalEmployeeSales;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayIncome = 
    mainSales.filter(s => s.date.startsWith(todayStr)).reduce((sum, s) => sum + s.amount, 0) +
    employeeSales.filter(s => s.date.startsWith(todayStr)).reduce((sum, s) => sum + s.amount, 0);

  const pendingDue = employeeSales.reduce((sum, sale) => sum + sale.dueAmount, 0);

  // Calculate best performer
  const salesByEmployee = employeeSales.reduce((acc, sale) => {
    acc[sale.employeeName] = (acc[sale.employeeName] || 0) + sale.amount;
    return acc;
  }, {} as Record<string, number>);

  let bestPerformer = 'N/A';
  let maxSales = 0;
  Object.entries(salesByEmployee).forEach(([name, amount]) => {
    if (amount > maxSales) {
      maxSales = amount;
      bestPerformer = name;
    }
  });

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 md:pb-8">
      <Header />
      
      {/* Desktop Layout (Always visible on md and up) */}
      <div className="hidden md:block space-y-6">
        <SummaryCards 
          totalSales={totalSales}
          todayIncome={todayIncome}
          pendingDue={pendingDue}
          bestPerformer={bestPerformer}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MainSalesBoard />
            <EmployeeSalesBoard />
          </div>
          <div className="xl:col-span-1">
            <BulkImport />
          </div>
        </div>

        <MonthlyCharts />
      </div>

      {/* Mobile Layout (Controlled by tabs) */}
      <div className="md:hidden">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <SummaryCards 
              totalSales={totalSales}
              todayIncome={todayIncome}
              pendingDue={pendingDue}
              bestPerformer={bestPerformer}
            />
            <MonthlyCharts />
          </div>
        )}

        {activeTab === 'main-sales' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-[calc(100vh-180px)]">
            <MainSalesBoard />
          </div>
        )}

        {activeTab === 'employee-sales' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-[calc(100vh-180px)]">
            <EmployeeSalesBoard />
          </div>
        )}

        {activeTab === 'import' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-[calc(100vh-180px)]">
            <BulkImport />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <MobileReports />
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

