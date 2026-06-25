import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * RevenueChart component displays the revenue by store in a sorted bar chart.
 * @param {Object} props
 * @param {Array} props.bookings - Raw booking data array
 */
const RevenueChart = ({ bookings }) => {
  const chartData = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    // Group by store_name and sum net amount
    const storeRevenue = {};
    bookings.forEach((b) => {
      const store = b.store_name || 'Unknown';
      const netAmount = Number(b.net) || 0;
      storeRevenue[store] = (storeRevenue[store] || 0) + netAmount;
    });

    // Convert to array and sort descending
    return Object.entries(storeRevenue)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [bookings]);

  // Format value as Indian Rupees
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200/50 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/90">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Store</p>
          <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{payload[0].name}</p>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Revenue: <span className="font-bold">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Revenue by Store</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Total net amount sorted descending</p>
      </div>

      <div className="h-[300px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94a3b8', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => {
                  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
                  return `₹${val}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6, 182, 212, 0.05)' }} />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill="url(#revenueGradient)"
                    className="hover:opacity-90 transition-opacity" 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
