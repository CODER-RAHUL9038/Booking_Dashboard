import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

/**
 * DailyBookingsChart component displays the daily booking trend as an area line chart.
 * @param {Object} props
 * @param {Array} props.bookings - Raw booking data array
 */
const DailyBookingsChart = ({ bookings }) => {
  const chartData = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    // Group by date and count
    const dailyCounts = {};
    bookings.forEach((b) => {
      if (b.date) {
        dailyCounts[b.date] = (dailyCounts[b.date] || 0) + 1;
      }
    });

    // Convert to array and sort chronologically by date
    return Object.entries(dailyCounts)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [bookings]);

  // Format date display (e.g. "2026-05-15" to "15 May")
  const formatDate = (dateStr) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        return dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200/50 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/90">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Date</p>
          <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">
            {formatDate(payload[0].payload.date)}
          </p>
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
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daily Booking Trend</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Chronological booking counts per day</p>
      </div>

      <div className="h-[300px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => val.toLocaleString('en-IN')}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#trendGradient)"
                dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#8b5cf6' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DailyBookingsChart;
