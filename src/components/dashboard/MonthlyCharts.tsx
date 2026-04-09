import React from 'react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from '../../lib/utils';

export function MonthlyCharts() {
  const { mainSales, employeeSales } = useStore();

  // Process data for charts
  // Group main sales by date
  const salesByDate = mainSales.reduce((acc, sale) => {
    const date = new Date(sale.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + sale.amount;
    return acc;
  }, {} as Record<string, number>);

  const dailyTrendData = Object.entries(salesByDate)
    .map(([date, amount]) => ({ date, amount }))
    .slice(-7); // Last 7 days

  // Group employee sales by employee
  const salesByEmployee = employeeSales.reduce((acc, sale) => {
    acc[sale.employeeName] = (acc[sale.employeeName] || 0) + sale.amount;
    return acc;
  }, {} as Record<string, number>);

  const employeePerformanceData = Object.entries(salesByEmployee)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Daily Revenue Trend
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-accent rounded-full"></div>
          Employee Performance
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employeePerformanceData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }}
                formatter={(value: number) => [formatCurrency(value), 'Sales']}
              />
              <Bar 
                dataKey="amount" 
                fill="#8b5cf6" 
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

