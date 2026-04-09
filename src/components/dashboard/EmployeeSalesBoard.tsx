import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Search, Plus, Trash2 } from 'lucide-react';

export function EmployeeSalesBoard() {
  const { employeeSales, setFormOpen, deleteEmployeeSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = employeeSales.filter(sale => 
    sale.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.leadName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="flex flex-col h-full md:h-[600px] relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-2 h-6 bg-accent rounded-full"></div>
          Employee Sales
        </h2>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search employee or lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 md:py-2 text-sm text-gray-900 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button 
            onClick={() => setFormOpen(true)}
            className="p-3 md:p-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center"
            title="Add New Entry"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto -mx-2 px-2 scrollbar-hide">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lead</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Due</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{formatDate(sale.date).split(',')[0]}</span>
                      <span className="text-[10px] text-gray-400">{formatDate(sale.date).split(',')[1]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{sale.employeeName}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-700">{sale.leadName}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-accent bg-accent/5 px-2 py-1 rounded-lg">
                      {formatCurrency(sale.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      sale.paymentStatus === 'Full' ? 'bg-success/10 text-success border border-success/20' :
                      sale.paymentStatus === 'Half' ? 'bg-warning/10 text-warning border border-warning/20' :
                      'bg-danger/10 text-danger border border-danger/20'
                    }`}>
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {sale.dueAmount > 0 ? (
                      <span className="text-sm font-bold text-danger">{formatCurrency(sale.dueAmount)}</span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteEmployeeSale(sale.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500 italic">
                    No employee sales found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
