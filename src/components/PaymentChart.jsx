import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * PaymentChart component displays the payment mode distribution.
 * @param {Object} props
 * @param {Array} props.bookings - Raw booking data array
 */
const PaymentChart = ({ bookings }) => {
  const chartData = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    // Group by payment_mode and count
    const counts = {};
    bookings.forEach((b) => {
      const mode = b.payment_mode || 'Unknown';
      counts[mode] = (counts[mode] || 0) + 1;
    });

    // Convert to array and sort descending
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [bookings]);

  // Color palette for the slices
  const COLORS = {
    UPI: '#8b5cf6',      // Violet-500
    Cash: '#06b6d4',     // Cyan-500
    Card: '#3b82f6',     // Blue-500
    Unknown: '#94a3b8'  // Slate-400
  };

  const getSliceColor = (name) => {
    return COLORS[name] || '#a78bfa'; // default brand-400
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = bookings.length;
      const val = payload[0].value;
      const pct = ((val / total) * 100).toFixed(1);
      return (
        <div className="rounded-xl border border-slate-200/50 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/90">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Payment Mode</p>
          <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{payload[0].name}</p>
          <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Bookings: <span className="font-bold">{val.toLocaleString('en-IN')}</span> ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
      <ul className="flex flex-col gap-2 justify-center h-full text-xs text-slate-600 dark:text-slate-400 pl-4">
        {payload.map((entry, index) => {
          const item = chartData[index];
          if (!item) return null;
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <li key={`item-${index}`} className="flex items-center gap-2">
              <span 
                className="h-3 w-3 rounded-full shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-slate-800 dark:text-slate-300 w-16">{entry.value}:</span>
              <span>
                {item.value.toLocaleString('en-IN')} ({percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Payment Mode Distribution</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Share of total booking methods</p>
      </div>

      <div className="h-[300px] w-full flex items-center justify-between">
        {chartData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-slate-400">No data available</div>
        ) : (
          <>
            <div className="w-[55%] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getSliceColor(entry.name)} 
                        stroke="transparent"
                        className="hover:opacity-90 transition-opacity outline-none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[45%] h-full flex items-center">
              <ResponsiveContainer width="100%" height="90%">
                <Legend 
                  content={renderLegend} 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                />
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentChart;
