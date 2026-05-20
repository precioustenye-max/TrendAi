import { TrendingUp, TrendingDown, Activity, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');

  const stats = [
    { label: 'TOTAL ANALYSES', value: '5', icon: BarChart3 },
    { label: 'BULLISH CALLS', value: '2', icon: TrendingUp, color: 'text-chart-green' },
    { label: 'BEARISH CALLS', value: '3', icon: TrendingDown, color: 'text-destructive' },
    { label: 'AVG CONFIDENCE', value: '80%', icon: Activity },
  ];

  const assets = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'EUR/USD', 'AAPL', 'TSLA'];

  const recentActivity = [
    { asset: 'BTC/USDT', time: '4/23/2026, 2:50:54 AM', signal: 'BEARISH', percentage: '80%', color: 'red' },
    { asset: 'EUR/USD', time: '4/22/2026, 6:15:11 PM', signal: 'BULLISH', percentage: '56%', color: 'green' },
    { asset: 'BTC/USDT', time: '4/22/2026, 6:14:20 PM', signal: 'BEARISH', percentage: '84%', color: 'red' },
    { asset: 'BTC/USDT', time: '4/22/2026, 6:14:11 PM', signal: 'BULLISH', percentage: '73%', color: 'green' },
    { asset: 'BTC/USDT', time: '4/19/2026, 4:59:02 PM', signal: 'BEARISH', percentage: '72%', color: 'red' },
  ];

  return (
    <div className="bg-background p-8 text-foreground">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Quick overview of your AI-powered trading activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-10 h-10 ${stat.color || 'text-primary'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Analyze Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Quick analyze</h2>
        <p className="text-muted-foreground text-sm mb-4">Run AI analysis on a popular asset.</p>
        <div className="flex flex-wrap gap-3">
          {assets.map((asset) => (
            <button
              key={asset}
              onClick={() => setSelectedAsset(asset)}
              className={`px-4 py-2 rounded font-semibold transition ${
                selectedAsset === asset
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary hover:bg-opacity-80'
              }`}
            >
              {asset}
            </button>
          ))}
        </div>
        <button className="mt-4 w-full bg-primary hover:bg-opacity-90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition">
          Analyze {selectedAsset}
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Recent activity</h2>
        </div>

        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-opacity-80 transition"
            >
              <div className="flex-1">
                <p className="font-semibold font-mono">{activity.asset}</p>
                <p className="text-muted-foreground text-sm">{activity.time}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-bold text-sm font-mono ${
                    activity.color === 'green'
                      ? 'text-chart-green'
                      : 'text-destructive'
                  }`}
                >
                  {activity.signal}
                </span>
                <span className="text-foreground text-sm font-semibold font-mono min-w-12 text-right">
                  {activity.percentage}
                </span>
                {activity.color === 'green' ? (
                  <ArrowUp className="w-5 h-5 text-chart-green" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-destructive" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
