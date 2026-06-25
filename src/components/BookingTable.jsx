import React, { useState, useMemo } from 'react';
import { Download, Search, User, Phone, MapPin, Calendar, CreditCard, IndianRupee } from 'lucide-react';

/**
 * BookingTable component displays recent bookings and top customers in tabs.
 * @param {Object} props
 * @param {Array} props.bookings - Filtered booking data array
 * @param {Function} props.onSearchChange - Callback for search input
 * @param {string} props.searchTerm - Active search query
 */
const BookingTable = ({ bookings, searchTerm, onSearchChange }) => {
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' | 'top_customers'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val || 0);
  };

  // Safe display helper
  const displayVal = (val) => {
    return val === null || val === undefined || val === '' ? 'Unknown' : val;
  };

  // 1. Calculate Top Customers (Top 10 by booking count)
  const topCustomers = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    
    const customerMap = {};
    bookings.forEach((b) => {
      const name = b.customer_name || 'Unknown';
      const phone = b.customer_mob || 'Unknown';
      const spend = Number(b.net) || 0;
      
      const key = `${name}-${phone}`;
      if (!customerMap[key]) {
        customerMap[key] = { name, phone, count: 0, spend: 0 };
      }
      customerMap[key].count += 1;
      customerMap[key].spend += spend;
    });

    return Object.values(customerMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [bookings]);

  // 2. Paginated bookings for Recent Bookings list
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return bookings.slice(start, start + itemsPerPage);
  }, [bookings, currentPage]);

  // Reset page when bookings change (e.g. on filter change)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [bookings]);

  // 3. Export to CSV handler
  const handleExportCSV = () => {
    if (!bookings || bookings.length === 0) return;

    const headers = ['Customer Name', 'Mobile', 'Store', 'Package', 'Date', 'Time', 'Payment Mode', 'Amount', 'GST', 'Net Amount'];
    const rows = bookings.map(b => [
      `"${displayVal(b.customer_name).replace(/"/g, '""')}"`,
      `"${displayVal(b.customer_mob)}"`,
      `"${displayVal(b.store_name)}"`,
      `"${displayVal(b.activity_name).replace(/"/g, '""')}"`,
      `"${displayVal(b.date)}"`,
      `"${displayVal(b.time)}"`,
      `"${displayVal(b.payment_mode)}"`,
      b.amount || 0,
      b.gst || 0,
      b.net || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute("download", `jusjumpin_bookings_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
      
      {/* Table Headers / Tab Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800 p-6 gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'recent'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Recent Bookings ({bookings.length.toLocaleString('en-IN')})
          </button>
          <button
            onClick={() => setActiveTab('top_customers')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'top_customers'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Top 10 Customers
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Quick Search */}
          {activeTab === 'recent' && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={bookings.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 transition-all shadow-md shadow-brand-500/10 cursor-pointer w-full sm:w-auto shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="overflow-x-auto w-full">
        {activeTab === 'recent' ? (
          /* RECENT BOOKINGS TABLE */
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">Store</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-600 dark:text-slate-350">
                {paginatedBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400">
                      No bookings match the search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedBookings.map((b, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-850 dark:text-white capitalize flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold font-sans">
                          {b.customer_name ? b.customer_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span>{displayVal(b.customer_name)}</span>
                      </td>
                      <td className="px-6 py-4 font-mono">{displayVal(b.customer_mob)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-350">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {displayVal(b.store_name)}
                        </span>
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs capitalize" title={b.activity_name}>
                        {displayVal(b.activity_name)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {displayVal(b.date)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          b.payment_mode === 'UPI' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400'
                            : b.payment_mode === 'Cash'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-400'
                            : b.payment_mode === 'Card'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          <CreditCard className="h-3 w-3" />
                          {displayVal(b.payment_mode)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-850 dark:text-white whitespace-nowrap">
                        {formatCurrency(b.net)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 p-6 gap-4">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Page {currentPage} of {totalPages} — Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, bookings.length)} of {bookings.length.toLocaleString('en-IN')} bookings
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* TOP CUSTOMERS TABLE */
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Mobile No.</th>
                <th className="px-6 py-4 text-center">Total Bookings</th>
                <th className="px-6 py-4 text-right">Total Net Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-600 dark:text-slate-350">
              {topCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    No customer data available.
                  </td>
                </tr>
              ) : (
                topCustomers.map((cust, idx) => (
                  <tr 
                    key={idx} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">
                      #{idx + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-850 dark:text-white capitalize flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">
                        {cust.name ? cust.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span>{cust.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono">{cust.phone}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-white">
                      {cust.count}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                      {formatCurrency(cust.spend)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingTable;
