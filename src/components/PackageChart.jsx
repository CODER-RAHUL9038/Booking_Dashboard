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
 * PackageChart component displays the top 10 booked packages in a bar chart.
 * @param {Object} props
 * @param {Array} props.bookings - Raw booking data array
 */
const PackageChart = ({ bookings }) => {
  const chartData = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    // Group by activity_name and count
    const counts = {};
    bookings.forEach((b) => {
      const pkg = b.activity_name || 'Unknown';
      counts[pkg] = (counts[pkg] || 0) + 1;
    });

    // Convert to array and sort descending
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [bookings]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200/50 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/90">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Package</p>
          <p className="text-sm font-bold text-slate-800 dark:text-white mb-1 truncate max-w-xs">{payload[0].name}</p>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Bookings: <span className="font-bold">{payload[0].value.toLocaleString('en-IN')}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Top 10 Most Booked Packages</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Grouped by booking frequency</p>
      </div>

      <div className="h-[300px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="packageGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis 
                type="number" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                width={120}
                axisLine={false}
                tickLine={false}
                tickFormatter={(tick) => (tick.length > 18 ? `${tick.substring(0, 15)}...` : tick)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
              <Bar 
                dataKey="value" 
                radius={[0, 8, 8, 0]}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill="url(#packageGradient)"
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

export default PackageChart;
