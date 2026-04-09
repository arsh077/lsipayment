import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Search, Plus, Trash2, X, Edit2 } from 'lucide-react';

export function MainSalesBoard() {
  const { mainSales, addMainSale, updateMainSale, deleteMainSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newSale, setNewSale] = useState({
    customerName: '',
    number: '',
    amount: '',
    feedback: '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredSales = mainSales.filter(sale => 
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.number.includes(searchTerm)
  );

  const handleEdit = (sale: any) => {
    setEditingId(sale.id);
    setNewSale({
      customerName: sale.customerName,
      number: sale.number,
      amount: sale.amount.toString(),
      feedback: sale.feedback,
      date: sale.date.split('T')[0]
    });
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSale.customerName || !newSale.amount) return;
    
    if (editingId) {
      updateMainSale(editingId, {
        customerName: newSale.customerName,
        number: newSale.number,
        amount: Number(newSale.amount),
        feedback: newSale.feedback,
        date: new Date(newSale.date).toISOString()
      });
    } else {
      addMainSale({
        customerName: newSale.customerName,
        number: newSale.number,
        amount: Number(newSale.amount),
        feedback: newSale.feedback,
        date: new Date(newSale.date).toISOString()
      });
    }
    
    setNewSale({
      customerName: '',
      number: '',
      amount: '',
      feedback: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewSale({
      customerName: '',
      number: '',
      amount: '',
      feedback: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

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
            onClick={() => setIsAdding(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-3 md:py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5 md:w-4 md:h-4" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Mobile Add Form Overlay */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col p-4 md:static md:bg-transparent md:p-0 md:block">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Sale' : 'New Sale Entry'}</h3>
            <button onClick={closeForm} className="p-2 text-gray-500 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:grid md:grid-cols-5 gap-4 md:bg-gray-50 md:p-4 rounded-xl md:border border-gray-200 flex-1 md:flex-none overflow-y-auto pb-24 md:pb-0 mb-6">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Customer Name</label>
              <input
                type="text"
                placeholder="Customer Name"
                value={newSale.customerName}
                onChange={e => setNewSale({...newSale, customerName: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                value={newSale.number}
                onChange={e => setNewSale({...newSale, number: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Amount (₹)</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Amount"
                value={newSale.amount}
                onChange={e => setNewSale({...newSale, amount: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Feedback</label>
              <input
                type="text"
                placeholder="Feedback"
                value={newSale.feedback}
                onChange={e => setNewSale({...newSale, feedback: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1 flex flex-col justify-end">
              <label className="text-xs text-gray-500 md:hidden">Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newSale.date}
                  onChange={e => setNewSale({...newSale, date: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-primary focus:outline-none"
                  required
                />
                <button type="submit" className="hidden md:block bg-success hover:bg-success/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  {editingId ? 'Update' : 'Save'}
                </button>
                {editingId && (
                  <button type="button" onClick={closeForm} className="hidden md:block bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            {/* Mobile Fixed Save Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden z-50 pb-safe">
              <button type="submit" className="w-full bg-success hover:bg-success/90 text-white py-4 rounded-xl text-lg font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/90 backdrop-blur-sm z-10">
              <tr>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Customer Name</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Number</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Amount</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Feedback</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No sales records found</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(sale.date)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{sale.customerName}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{sale.number}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-success">{formatCurrency(sale.amount)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{sale.feedback}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(sale)}
                          className="text-gray-400 hover:text-primary transition-colors p-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteMainSale(sale.id)}
                          className="text-gray-400 hover:text-danger transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredSales.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No sales records found</div>
          ) : (
            filteredSales.map((sale) => (
              <div key={sale.id} className="bg-white border border-gray-200 rounded-xl p-4 relative shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{sale.customerName}</h3>
                    <p className="text-xs text-gray-500">{formatDate(sale.date)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-success">{formatCurrency(sale.amount)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-3">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">📞</span> {sale.number || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">💬</span> {sale.feedback || 'No feedback'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(sale)}
                      className="p-2 bg-gray-50 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteMainSale(sale.id)}
                      className="p-2 bg-gray-50 rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}


