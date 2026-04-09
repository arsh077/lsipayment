import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Search, Plus, Trash2, X, Edit2 } from 'lucide-react';

export function EmployeeSalesBoard() {
  const { employeeSales, employees, addEmployeeSale, updateEmployeeSale, deleteEmployeeSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newSale, setNewSale] = useState({
    employeeName: '',
    leadName: '',
    number: '',
    amount: '',
    feedbackDuration: '',
    paymentStatus: 'Full' as 'Full' | 'Half' | 'Pending',
    dueAmount: '0',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredSales = employeeSales.filter(sale => 
    sale.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.leadName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (sale: any) => {
    setEditingId(sale.id);
    setNewSale({
      employeeName: sale.employeeName,
      leadName: sale.leadName,
      number: sale.number,
      amount: sale.amount.toString(),
      feedbackDuration: sale.feedbackDuration,
      paymentStatus: sale.paymentStatus,
      dueAmount: sale.dueAmount.toString(),
      date: sale.date.split('T')[0]
    });
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSale.employeeName || !newSale.leadName || !newSale.amount) return;
    
    if (editingId) {
      updateEmployeeSale(editingId, {
        employeeName: newSale.employeeName,
        leadName: newSale.leadName,
        number: newSale.number,
        amount: Number(newSale.amount),
        feedbackDuration: newSale.feedbackDuration,
        paymentStatus: newSale.paymentStatus,
        dueAmount: Number(newSale.dueAmount),
        date: new Date(newSale.date).toISOString()
      });
    } else {
      addEmployeeSale({
        employeeName: newSale.employeeName,
        leadName: newSale.leadName,
        number: newSale.number,
        amount: Number(newSale.amount),
        feedbackDuration: newSale.feedbackDuration,
        paymentStatus: newSale.paymentStatus,
        dueAmount: Number(newSale.dueAmount),
        date: new Date(newSale.date).toISOString()
      });
    }
    
    setNewSale({
      employeeName: '',
      leadName: '',
      number: '',
      amount: '',
      feedbackDuration: '',
      paymentStatus: 'Full',
      dueAmount: '0',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewSale({
      employeeName: '',
      leadName: '',
      number: '',
      amount: '',
      feedbackDuration: '',
      paymentStatus: 'Full',
      dueAmount: '0',
      date: new Date().toISOString().split('T')[0]
    });
  };

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
            onClick={() => setIsAdding(true)}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-3 md:py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
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
            <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Sale' : 'New Employee Sale'}</h3>
            <button onClick={closeForm} className="p-2 text-gray-500 hover:text-gray-900">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:grid md:grid-cols-4 gap-4 md:bg-gray-50 md:p-4 rounded-xl md:border border-gray-200 flex-1 md:flex-none overflow-y-auto pb-24 md:pb-0 mb-6">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Employee Name</label>
              <select
                value={newSale.employeeName}
                onChange={e => setNewSale({...newSale, employeeName: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-accent focus:outline-none"
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Lead Name</label>
              <input
                type="text"
                placeholder="Lead Name"
                value={newSale.leadName}
                onChange={e => setNewSale({...newSale, leadName: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-accent focus:outline-none"
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
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-accent focus:outline-none"
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
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-accent focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Feedback Duration</label>
              <input
                type="text"
                placeholder="Feedback Duration (e.g. 1 year)"
                value={newSale.feedbackDuration}
                onChange={e => setNewSale({...newSale, feedbackDuration: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Payment Status</label>
              <select
                value={newSale.paymentStatus}
                onChange={e => setNewSale({...newSale, paymentStatus: e.target.value as any})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-accent focus:outline-none"
              >
                <option value="Full">Full Payment</option>
                <option value="Half">Half Payment</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 md:hidden">Due Amount (₹)</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Due Amount"
                value={newSale.dueAmount}
                onChange={e => setNewSale({...newSale, dueAmount: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="space-y-1 flex flex-col justify-end">
              <label className="text-xs text-gray-500 md:hidden">Date</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newSale.date}
                  onChange={e => setNewSale({...newSale, date: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:border-accent focus:outline-none"
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
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Employee</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Lead</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Amount</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Due</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">No employee sales records found</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(sale.date)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{sale.employeeName}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{sale.leadName}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-accent">{formatCurrency(sale.amount)}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.paymentStatus === 'Full' ? 'bg-success/10 text-success border border-success/20' :
                        sale.paymentStatus === 'Half' ? 'bg-warning/10 text-warning border border-warning/20' :
                        'bg-danger/10 text-danger border border-danger/20'
                      }`}>
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-danger">{sale.dueAmount > 0 ? formatCurrency(sale.dueAmount) : '-'}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(sale)}
                          className="text-gray-400 hover:text-accent transition-colors p-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteEmployeeSale(sale.id)}
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
            <div className="py-8 text-center text-gray-500">No employee sales records found</div>
          ) : (
            filteredSales.map((sale) => (
              <div key={sale.id} className="bg-white border border-gray-200 rounded-xl p-4 relative shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{sale.leadName}</h3>
                    <p className="text-xs text-accent font-medium">{sale.employeeName}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(sale.date)}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-accent">{formatCurrency(sale.amount)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      sale.paymentStatus === 'Full' ? 'bg-success/10 text-success border border-success/20' :
                      sale.paymentStatus === 'Half' ? 'bg-warning/10 text-warning border border-warning/20' :
                      'bg-danger/10 text-danger border border-danger/20'
                    }`}>
                      {sale.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">📞</span> {sale.number || 'N/A'}
                    </p>
                    {sale.dueAmount > 0 && (
                      <p className="text-sm text-danger flex items-center gap-2 font-medium">
                        <span className="text-gray-500">Due:</span> {formatCurrency(sale.dueAmount)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(sale)}
                      className="p-2 bg-gray-50 rounded-lg text-gray-500 hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteEmployeeSale(sale.id)}
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

