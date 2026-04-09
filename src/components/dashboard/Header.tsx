import React from 'react';
import { Download, ShieldAlert, LogOut, PlusCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Papa from 'papaparse';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function Header() {
  const { mainSales, employeeSales, setFormOpen } = useStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleExport = () => {
    // Export Main Sales
    const mainCsv = Papa.unparse(mainSales.map(s => ({
      Date: new Date(s.date).toLocaleDateString(),
      'Customer Name': s.customerName,
      Number: s.number,
      Amount: s.amount,
      Feedback: s.feedback
    })));

    // Export Employee Sales
    const empCsv = Papa.unparse(employeeSales.map(s => ({
      Date: new Date(s.date).toLocaleDateString(),
      Employee: s.employeeName,
      Lead: s.leadName,
      Number: s.number,
      Amount: s.amount,
      'Feedback Duration': s.feedbackDuration,
      'Payment Status': s.paymentStatus,
      'Due Amount': s.dueAmount
    })));

    const downloadFile = (content: string, filename: string) => {
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(mainCsv, `main_sales_${dateStr}.csv`);
    setTimeout(() => {
      downloadFile(empCsv, `employee_sales_${dateStr}.csv`);
    }, 500);
  };

  return (
    <header className="flex justify-between items-center mb-6 md:mb-8 bg-white/80 p-4 rounded-2xl border border-gray-200 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <ShieldAlert className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight leading-tight">Legal Success Indya</h1>
          <p className="text-xs md:text-sm text-gray-500">Sales Command Center</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setFormOpen(true)}
          className="flex bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all items-center gap-2 shadow-lg shadow-primary/25"
        >
          <PlusCircle className="w-5 h-5" />
          New Sale
        </button>

        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span className="text-sm text-gray-700 font-medium">Admin Access</span>
        </div>
        
        <button 
          onClick={handleExport}
          className="hidden md:flex bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors items-center gap-2 border border-gray-200"
        >
          <Download className="w-4 h-4" />
          Export Month
        </button>

        <button 
          onClick={handleLogout}
          className="flex bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors items-center gap-2 border border-red-100"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}


