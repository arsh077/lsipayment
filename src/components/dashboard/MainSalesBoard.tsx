import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Search, Plus, Trash2, X, Edit2 } from 'lucide-react';

export function MainSalesBoard() {
  const { mainSales, setFormOpen, deleteMainSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = mainSales.filter(sale => 
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.number.includes(searchTerm)
  );

  return (
    <Card className="flex flex-col h-full md:h-[600px] relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Company Sales
        </h2>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 md:py-2 text-sm text-gray-900 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button 
            onClick={() => setFormOpen(true)}
            className="p-3 md:p-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center"
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
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Number</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Feedback</th>
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
                    <span className="text-sm font-medium text-gray-900">{sale.customerName}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.number}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-success bg-success/5 px-2 py-1 rounded-lg">
                      {formatCurrency(sale.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600 line-clamp-1 max-w-[200px]" title={sale.feedback}>
                      {sale.feedback}
                    </p>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteMainSale(sale.id)}
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
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500 italic">
                    No sales found
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


