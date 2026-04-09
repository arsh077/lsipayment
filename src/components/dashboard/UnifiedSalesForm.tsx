import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Save, User, Phone, IndianRupee, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';

export function UnifiedSalesForm() {
  const { isFormOpen, setFormOpen, addUnifiedSale, employees, isLoading } = useStore();
  
  const [formData, setFormData] = useState({
    customerName: '',
    number: '',
    amount: '',
    employeeName: '',
    feedback: '',
    date: new Date().toISOString().split('T')[0],
    paymentStatus: 'Full' as 'Full' | 'Half' | 'Pending',
    dueAmount: '0'
  });

  if (!isFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.amount) return;
    
    try {
      await addUnifiedSale(formData);
      // Reset form
      setFormData({
        customerName: '',
        number: '',
        amount: '',
        employeeName: '',
        feedback: '',
        date: new Date().toISOString().split('T')[0],
        paymentStatus: 'Full',
        dueAmount: '0'
      });
    } catch (error) {
      alert("Error saving data. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border-0 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Sale</h2>
            <p className="text-sm text-gray-500">Enter sale details to update both records</p>
          </div>
          <button 
            onClick={() => setFormOpen(false)}
            className="p-2 hover:bg-white rounded-full transition-colors shadow-sm border border-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Customer Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-primary" /> Amount *
                </label>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Assignment & Status */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" /> Assigned Employee
                </label>
                <select
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="">No Employee (Direct Sale)</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1 italic">
                  * If selected, this will also show in Employee Sales table
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Payment Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Full', 'Half', 'Pending'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentStatus: status as any })}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                        formData.paymentStatus === status 
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {formData.paymentStatus !== 'Full' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-sm font-semibold text-gray-700">Due Amount</label>
                  <input
                    type="number"
                    value={formData.dueAmount}
                    onChange={(e) => setFormData({ ...formData, dueAmount: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Feedback / Remarks
            </label>
            <textarea
              rows={3}
              placeholder="Enter feedback or additional notes..."
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              Save Sale Entry
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
