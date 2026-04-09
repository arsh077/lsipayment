import React from 'react';
import { Card } from '../ui/Card';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Papa from 'papaparse';

export function MobileReports() {
  const { mainSales, employeeSales } = useStore();

  const handleExport = (type: 'main' | 'employee', format: 'csv') => {
    let data;
    let filename;

    if (type === 'main') {
      data = mainSales.map(s => ({
        Date: new Date(s.date).toLocaleDateString(),
        'Customer Name': s.customerName,
        Number: s.number,
        Amount: s.amount,
        Feedback: s.feedback
      }));
      filename = `main_sales_${new Date().toISOString().split('T')[0]}.${format}`;
    } else {
      data = employeeSales.map(s => ({
        Date: new Date(s.date).toLocaleDateString(),
        Employee: s.employeeName,
        Lead: s.leadName,
        Number: s.number,
        Amount: s.amount,
        'Feedback Duration': s.feedbackDuration,
        'Payment Status': s.paymentStatus,
        'Due Amount': s.dueAmount
      }));
      filename = `employee_sales_${new Date().toISOString().split('T')[0]}.${format}`;
    }

    const csvContent = Papa.unparse(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20">
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Export Main Sales
        </h2>
        <p className="text-sm text-gray-500 mb-6">Download all company sales records for this month.</p>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => handleExport('main', 'csv')}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-3 border border-gray-200 shadow-sm"
          >
            <FileText className="w-5 h-5 text-primary" />
            Download CSV Format
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-accent rounded-full"></div>
          Export Employee Sales
        </h2>
        <p className="text-sm text-gray-500 mb-6">Download all employee performance records for this month.</p>
        
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => handleExport('employee', 'csv')}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-3 border border-gray-200 shadow-sm"
          >
            <FileText className="w-5 h-5 text-accent" />
            Download CSV Format
          </button>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-white to-gray-50 border-success/20">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-success rounded-full"></div>
          End of Month Full Export
        </h2>
        <p className="text-sm text-gray-500 mb-6">Download both reports at once for your monthly backup.</p>
        
        <button 
          onClick={() => {
            handleExport('main', 'csv');
            setTimeout(() => handleExport('employee', 'csv'), 500);
          }}
          className="w-full bg-success hover:bg-success/90 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <Download className="w-5 h-5" />
          Download Complete Backup
        </button>
      </Card>
    </div>
  );
}

