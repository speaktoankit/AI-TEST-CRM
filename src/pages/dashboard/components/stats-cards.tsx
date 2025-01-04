import React from 'react';
import { Users, DollarSign, CheckSquare, Calendar } from 'lucide-react';
import { StatsCard } from './stats-card';

interface StatsCardsProps {
  stats: Array<{
    name: string;
    value: number;
  }>;
  isLoading: boolean;
}

const icons = {
  'Total Contacts': Users,
  'Active Deals': DollarSign,
  'Pending Tasks': CheckSquare,
  'Upcoming Events': Calendar,
};

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.name}
          name={stat.name}
          value={stat.value}
          icon={icons[stat.name as keyof typeof icons]}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}