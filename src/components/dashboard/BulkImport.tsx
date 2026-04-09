import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

export function BulkImport() {
  const { importMainSales, importEmployeeSales } = useStore();
  const [importType, setImportType] = useState<'main' | 'employee'>('main');
  const [pasteData, setPasteData] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const handleImport = () => {
    if (!pasteData.trim()) {
      setStatus({ type: 'error', message: 'Please paste some data first.' });
      return;
    }

    try {
      const parsed = Papa.parse(pasteData, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        setStatus({ type: 'error', message: 'Error parsing data. Check format.' });
        return;
      }

      const data = parsed.data as any[];

      if (importType === 'main') {
        const mappedSales = data.map(row => ({
          customerName: row.Name || row.CustomerName || row.customerName || '',
          number: row.Number || row.Phone || row.number || '',
          amount: Number(row.Amount || row.amount || 0),
          feedback: row.Feedback || row.feedback || '',
          date: row.Date || row.date ? new Date(row.Date || row.date).toISOString() : new Date().toISOString()
        }));
        importMainSales(mappedSales);
      } else {
        const mappedSales = data.map(row => ({
          employeeName: row.Employee || row.EmployeeName || row.employeeName || '',
          leadName: row.Lead || row.LeadName || row.leadName || '',
          number: row.Number || row.Phone || row.number || '',
          amount: Number(row.Amount || row.amount || 0),
          feedbackDuration: row.Feedback || row.FeedbackDuration || row.feedbackDuration || '',
          paymentStatus: (row.Status || row.PaymentStatus || row.paymentStatus || 'Full') as 'Full' | 'Half' | 'Pending',
          dueAmount: Number(row.Due || row.DueAmount || row.dueAmount || 0),
          date: row.Date || row.date ? new Date(row.Date || row.date).toISOString() : new Date().toISOString()
        }));
        importEmployeeSales(mappedSales);
      }

      setStatus({ type: 'success', message: `Successfully imported ${data.length} records.` });
      setPasteData('');
      
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 3000);
      
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to import data.' });
    }
  };

  return (
    <Card className="flex flex-col h-full md:h-[600px]">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
        <div className="w-2 h-6 bg-success rounded-full"></div>
        Bulk Data Import
      </h2>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setImportType('main')}
          className={`flex-1 py-3 md:py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
            importType === 'main' ? 'bg-primary text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Main Sales
        </button>
        <button
          onClick={() => setImportType('employee')}
          className={`flex-1 py-3 md:py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
            importType === 'employee' ? 'bg-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          Employee Sales
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Expected Columns (Header Row Required)
        </h3>
        <p className="text-xs text-gray-500 font-mono break-words leading-relaxed">
          {importType === 'main' 
            ? 'Name, Number, Amount, Feedback, Date' 
            : 'Date, Employee, Lead, Number, Amount, Feedback, Status, Due'}
        </p>
      </div>

      <textarea
        value={pasteData}
        onChange={(e) => setPasteData(e.target.value)}
        placeholder="Paste Excel or Google Sheets data here (including headers)..."
        className="flex-1 bg-white border border-gray-200 rounded-xl p-4 text-base md:text-sm text-gray-900 focus:outline-none focus:border-success transition-colors resize-none mb-4 min-h-[200px] md:min-h-[150px]"
      />

      {status.type && (
        <div className={`p-3 rounded-xl text-sm mb-4 flex items-center gap-2 ${
          status.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {status.message}
        </div>
      )}

      <button
        onClick={handleImport}
        className="w-full bg-success hover:bg-success/90 text-white py-4 md:py-3 rounded-xl font-bold md:font-medium transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
      >
        <Upload className="w-5 h-5" />
        Import Data
      </button>
    </Card>
  );
}


