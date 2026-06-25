import React from 'react';

/**
 * StatCard component displays a KPI metric in a card.
 * @param {Object} props
 * @param {string} props.title - The title of the metric
 * @param {string|number} props.value - The value of the metric
 * @param {React.ReactNode} props.icon - Lucide icon component
 * @param {string} props.gradient - Tailwind gradient class (e.g., 'from-blue-500 to-indigo-600')
 * @param {string} props.description - Brief text under the value
 */
const StatCard = ({ title, value, icon: Icon, gradient = 'from-brand-500 to-brand-600', description }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
      {/* Decorative background circle */}
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs text-white/70 font-light">{description}</p>
          )}
        </div>
        
        {Icon && (
          <div className="rounded-xl bg-white/15 p-3 text-white backdrop-blur-sm">
            <Icon className="h-6 w-6" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
