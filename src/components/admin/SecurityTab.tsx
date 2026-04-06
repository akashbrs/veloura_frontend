import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttackLogs, fetchAttackStats } from '@/redux/slices/securitySlice';
import type { AppDispatch, RootState } from '@/redux';
import { Shield, AlertTriangle, Activity, RefreshCw, Server, Globe } from 'lucide-react';

const SecurityTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, stats, loading, error } = useSelector((state: RootState) => state.security);

  useEffect(() => {
    dispatch(fetchAttackLogs());
    dispatch(fetchAttackStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAttackLogs());
    dispatch(fetchAttackStats());
  };

  const totalAttacks = stats.reduce((acc, stat) => acc + stat.count, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Security Monitoring
          </h2>
          <p className="text-sm text-gray-500">Real-time threat detection and vulnerability logging.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">System Active</span>
          </div>
          <h3 className="text-blue-900/60 text-sm font-medium">Total Threats Blocked</h3>
          <p className="text-3xl font-bold text-blue-900 mt-1">{totalAttacks}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500 rounded-lg shadow-lg shadow-amber-200">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">High Alert</span>
          </div>
          <h3 className="text-amber-900/60 text-sm font-medium">Top Attack Vector</h3>
          <p className="text-3xl font-bold text-amber-900 mt-1 truncate">
            {stats.length > 0 ? stats.reduce((prev, current) => (prev.count > current.count) ? prev : current).attack_type : 'None'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500 rounded-lg shadow-lg shadow-purple-200">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Monitoring Live</span>
          </div>
          <h3 className="text-purple-900/60 text-sm font-medium">Unique Attacker IPs</h3>
          <p className="text-3xl font-bold text-purple-900 mt-1">{new Set(logs.map(l => l.ip)).size}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Attack Statistics Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Attack Distribution
          </h3>
          <div className="space-y-5">
            {stats.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-8">No attack data recorded yet.</p>
            ) : stats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{stat.attack_type}</span>
                  <span className="text-gray-500">{stat.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${(stat.count / totalAttacks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Logs Table */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              Recent Attack Logs
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last 100 Entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">Source IP</th>
                  <th className="px-6 py-4">Attack Type</th>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 animate-pulse">
                      Scanning logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                      No security incidents logged. System is secure.
                    </td>
                  </tr>
                ) : logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">{log.ip}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        log.type.includes('SQL') ? 'bg-orange-100 text-orange-700' : 
                        log.type.includes('XSS') ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-600 font-medium">{log.endpoint}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(log.time).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
