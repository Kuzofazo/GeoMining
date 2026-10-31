import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  MousePointer,
  RefreshCw,
  AlertCircle,
  Copy,
  CheckCircle,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import {
  getAnalytics,
  checkAnalyticsTableExists,
  AnalyticsPeriod,
  AnalyticsSummary,
} from '../lib/analyticsService';
import { ANALYTICS_TABLE_SQL } from '../lib/analyticsSQL';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
  iconBg: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  label,
  value,
  change,
  iconBg,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      {change !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${
            change >= 0
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-500'
          }`}
        >
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);

// ── Custom Tooltip ────────────────────────────────────────────────────────────

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-sm">
      <p className="font-black text-amber-400 mb-2 text-xs uppercase tracking-wider">
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block chart-dot"
            data-color={p.color}
          />
          <span className="text-slate-300 text-xs">{p.name}:</span>
          <span className="font-bold">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

// ── SQL Setup Modal ───────────────────────────────────────────────────────────

const AnalyticsSqlModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(ANALYTICS_TABLE_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Analytics Database Setup
              </h2>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Run this SQL in your <strong>Supabase SQL Editor</strong> to
                enable real visitor tracking. Until then, the dashboard shows
                demo data.
              </p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="relative">
            <pre className="bg-slate-900 text-green-400 text-xs font-mono p-6 rounded-2xl overflow-auto max-h-64 leading-relaxed">
              {ANALYTICS_TABLE_SQL}
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle size={14} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy SQL
                </>
              )}
            </button>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
            >
              Close
            </button>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2] bg-[#2d5a27] text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all text-sm uppercase tracking-widest text-center"
            >
              Open Supabase →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────

const AnalyticsDashboard: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('daily');
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbExists, setDbExists] = useState<boolean | null>(null);
  const [showSql, setShowSql] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [exists, summary] = await Promise.all([
        checkAnalyticsTableExists(),
        getAnalytics(period),
      ]);
      setDbExists(exists);
      setData(summary);
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const periodLabel = {
    daily: 'Last 30 Days',
    weekly: 'Last 90 Days',
    monthly: 'Last 12 Months',
  }[period];

  // Trim trend labels based on period for readability
  const trendData = data
    ? period === 'daily'
      ? data.trend
      : period === 'weekly'
        ? data.trend.filter((_, i) => i % 7 === 0)
        : data.trend.filter((_, i) => i % 30 === 0)
    : [];

  const DEVICE_COLORS = ['#2d5a27', '#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-6 pb-8">
      {/* Demo Banner */}
      {data?.isDemo && (
        <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-800">
                Demo Mode — Showing Simulated Data
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Set up the Supabase analytics table to see real visitor data.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSql(true)}
            className="shrink-0 bg-amber-600 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-amber-700 transition-all"
          >
            Setup DB
          </button>
        </div>
      )}

      {/* Period Selector + Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
          {(['daily', 'weekly', 'monthly'] as AnalyticsPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                period === p
                  ? 'bg-[#2d5a27] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p === 'daily' ? 'Daily' : p === 'weekly' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-400 font-medium">
            Refreshed {lastRefreshed.toLocaleTimeString()}
          </p>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6 h-32 animate-pulse"
            >
              <div className="w-11 h-11 bg-slate-100 rounded-xl mb-4" />
              <div className="h-3 bg-slate-100 rounded w-2/3 mb-2" />
              <div className="h-7 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      {!loading && data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <KpiCard
              icon={<Eye size={20} className="text-indigo-600" />}
              iconBg="bg-indigo-50"
              label="Total Page Views"
              value={formatNumber(data.totalPageViews)}
              change={data.pageViewsChange}
            />
            <KpiCard
              icon={<Users size={20} className="text-[#2d5a27]" />}
              iconBg="bg-emerald-50"
              label="Unique Visitors"
              value={formatNumber(data.uniqueVisitors)}
              change={data.uniqueVisitorsChange}
            />
            <KpiCard
              icon={<Clock size={20} className="text-amber-600" />}
              iconBg="bg-amber-50"
              label="Avg. Session"
              value={formatDuration(data.avgSessionDuration)}
            />
            <KpiCard
              icon={<MousePointer size={20} className="text-rose-500" />}
              iconBg="bg-rose-50"
              label="Bounce Rate"
              value={`${data.bounceRate}%`}
            />
          </div>

          {/* Main Trend Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-widest">
                  Traffic Trend
                </h3>
                <p className="text-xs text-slate-400 mt-1">{periodLabel}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={trendData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d5a27" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2d5a27" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: '11px',
                    fontWeight: 700,
                    paddingTop: '16px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  name="Page Views"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#gradViews)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="uniqueVisitors"
                  name="Unique Visitors"
                  stroke="#2d5a27"
                  strokeWidth={2.5}
                  fill="url(#gradUnique)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Row 2: Top Pages + Device + Traffic Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Pages */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest mb-6">
                Top Pages
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data.topPages.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="page"
                    width={110}
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="views"
                    name="Views"
                    fill="#2d5a27"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Device + Sources stacked */}
            <div className="flex flex-col gap-6">
              {/* Device Breakdown */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-1">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-widest mb-4">
                  Devices
                </h3>
                <div className="flex justify-center mb-2">
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: 'Mobile',
                            value: data.deviceBreakdown.mobile,
                          },
                          {
                            name: 'Desktop',
                            value: data.deviceBreakdown.desktop,
                          },
                          {
                            name: 'Tablet',
                            value: data.deviceBreakdown.tablet,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={58}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {DEVICE_COLORS.map((color, i) => (
                          <Cell key={i} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => [`${v}%`, '']}
                        contentStyle={{
                          background: '#1e293b',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      icon: <Smartphone size={13} />,
                      label: 'Mobile',
                      value: data.deviceBreakdown.mobile,
                      color: '#2d5a27',
                    },
                    {
                      icon: <Monitor size={13} />,
                      label: 'Desktop',
                      value: data.deviceBreakdown.desktop,
                      color: '#3b82f6',
                    },
                    {
                      icon: <Tablet size={13} />,
                      label: 'Tablet',
                      value: data.deviceBreakdown.tablet,
                      color: '#f59e0b',
                    },
                  ].map((d) => (
                    <div
                      key={d.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            d.label === 'Mobile'
                              ? 'text-[#2d5a27]'
                              : d.label === 'Desktop'
                                ? 'text-blue-500'
                                : 'text-amber-400'
                          }
                        >
                          {d.icon}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {d.label}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        {d.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-1">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-widest mb-4">
                  Traffic Sources
                </h3>
                <style>
                  {data.trafficSources
                    .map(
                      (src, i) =>
                        `.traffic-source-bar-${i} { width: ${src.value}%; }`
                    )
                    .join('\\n')}
                </style>
                <div className="flex flex-col gap-3">
                  {data.trafficSources.map((src, index) => (
                    <div key={src.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-slate-600">
                          {src.name}
                        </span>
                        <span className="font-black text-slate-900">
                          {src.value}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={[
                            'h-full rounded-full transition-all duration-700',
                            `traffic-source-bar-${index}`,
                            src.name === 'Direct' ? 'bg-[#2d5a27]' : '',
                            src.name === 'Search' ? 'bg-blue-500' : '',
                            src.name === 'Social' ? 'bg-amber-400' : '',
                            src.name === 'Other' ? 'bg-slate-400' : '',
                          ].join(' ')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest">
                Daily Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    {[
                      'Date',
                      'Page Views',
                      'Unique Visitors',
                      'Sessions',
                      'Bounce Rate',
                      'Avg. Duration',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...data.trend]
                    .reverse()
                    .slice(0, 14)
                    .map((row) => (
                      <tr
                        key={row.date}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                          {row.label}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {row.pageViews.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {row.uniqueVisitors.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {row.sessions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-full ${
                              row.bounceRate > 60
                                ? 'bg-red-50 text-red-600'
                                : row.bounceRate > 40
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {row.bounceRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">
                          {formatDuration(row.avgDuration)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showSql && <AnalyticsSqlModal onClose={() => setShowSql(false)} />}
    </div>
  );
};

export default AnalyticsDashboard;
