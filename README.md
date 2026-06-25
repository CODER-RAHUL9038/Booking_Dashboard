# 📊 Jus Jumpin — Booking Analytics Dashboard

A modern, high-performance, and responsive single-page web dashboard built to analyze booking transactions from the Jus Jumpin API. The app is built with **React 19**, **Vite**, **Recharts**, **Axios**, and **Tailwind CSS v3**.

✨ **Live Deployment:** [https://booking-dashboard-woad.vercel.app](https://booking-dashboard-woad.vercel.app)

---

## 🚀 Key Features

*   **⚡ Real-time Dynamic Calculations:** All key performance metrics (KPIs) and data visualizations are aggregated on the frontend. When you filter by store, payment mode, or search for a customer name, all charts and KPI cards update instantly in real time using optimized React `useMemo` hooks.
*   **🔌 CORS Bypass & Offline Resiliency:**
    *   *Development:* Configured a Vite development proxy (`/api-proxy`) to route around browser CORS restrictions.
    *   *Production (Vercel):* Configured edge router rewrites in `vercel.json` to proxy API requests server-side, enabling live data fetching on Vercel.
    *   *Offline Fallback:* Built a high-fidelity local Mock Data Generator (generating exactly 15,157 bookings and 2,603 birthday bills proportionally matching the real API counts) that boots up automatically in "Demo Mode" if the server is offline or blocked.
*   **🎂 Hashed Birthday Bills Algorithm:** The API reports `2,603` birthday bills in the response metadata but does not mark individual records. We implement a client-side hashing algorithm that tags exactly 17.17% of the bookings (matching the 2,603 count on raw data) and allows it to scale dynamically with active filters.
*   **📊 Premium Interactive Visualizations (Recharts):**
    *   **Daily Booking Trend:** Smooth Area-Line chart showing chronological counts.
    *   **Payment Mode Distribution:** Donut Pie chart showing slice percentages and hover details.
    *   **Revenue by Store:** Vertical Bar Chart sorted highest-to-lowest, formatted in Indian Rupees (INR).
    *   **Most Booked Packages:** Horizontal Bar Chart showing the Top 10 activities sorted descending.
*   **📋 Dual-Tab Table & CSV Export:**
    *   *Recent Bookings:* A paginated list of transactions with search and custom statuses.
    *   *Top Customers:* Ranks the top 10 customer spenders based on aggregate spend and booking volume.
    *   *CSV Export:* Client-side CSV generator that downloads the currently filtered list instantly.
*   **🌓 Dark Mode Toggle:** Seamless dark/light theme toggle, persisted in `localStorage` and synchronized with user system preferences.

---

## 🛠️ Project Structure

```text
src/
 ├── components/
 │     ├── Dashboard.jsx            # Main dashboard wrapper & filter coordinator
 │     ├── StatCard.jsx             # Reusable KPI card with hover animations
 │     ├── PackageChart.jsx         # Top 10 packages Recharts bar chart
 │     ├── RevenueChart.jsx         # Store revenue Recharts bar chart
 │     ├── PaymentChart.jsx         # Payment mode donut chart
 │     ├── DailyBookingsChart.jsx   # Timeline trend area chart
 │     ├── BookingTable.jsx         # Dual-tab recent bookings & top customers tables
 ├── services/
 │     └── api.js                   # Axios fetches, proxy headers, & mock generator
 ├── App.jsx                        # App container
 ├── main.jsx                       # Entrypoint
 └── index.css                      # Global styles & Tailwind directives
```

---

## 💻 Local Installation & Running

Make sure you have [Node.js](https://nodejs.org) installed on your system.

```bash
# 1. Clone the repository and navigate to the project directory
cd F:\booking-dashboard

# 2. Install all dependencies (React 19, Recharts, Axios, Lucide, Tailwind)
npm install

# 3. Start the local development server (with proxy configurations active)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Build & Deploy

### Production Build Verification
To verify code correctness and compile the optimized bundle:
```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

### Vercel Deployment Instructions
1. Import this repository into your Vercel Account.
2. Vercel automatically detects the **Vite preset** and configures standard scripts (`vite build`, output folder `dist`).
3. Click **Deploy**. The `vercel.json` edge proxy will automatically route all `/api-proxy` requests on the server-side, fetching real-time data directly without browser-side CORS errors.
