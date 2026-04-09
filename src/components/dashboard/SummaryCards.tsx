import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, Calendar, AlertCircle, Trophy } from 'lucide-react';

interface SummaryCardsProps {
  totalSales: number;
  todayIncome: number;
  pendingDue: number;
  bestPerformer: string;
}

export function SummaryCards({ totalSales, todayIncome, pendingDue, bestPerformer }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(totalSales),
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Today Income',
      value: formatCurrency(todayIncome),
      icon: Calendar,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Pending Due',
      value: formatCurrency(pendingDue),
      icon: AlertCircle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Best Performer',
      value: bestPerformer || 'N/A',
      icon: Trophy,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={card.title} hover delay={index * 0.1} className="flex items-center gap-4 bg-white/80">
          <div className={`p-4 rounded-lg ${card.bg}`}>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}

