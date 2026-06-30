import { useEffect, useState } from 'react';
import { Bell, BellRing, Search, X } from 'lucide-react';
import {
  cancelTradeAlert,
  checkTradeAlertLivePrice,
  checkTradeAlertPrice,
  createTradeAlertFromAnalysis,
  getTradeAlerts,
} from '../../lib/api';

function notify(title, body) {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

function getTriggerLabel(trigger) {
  if (!trigger) return '';
  if (trigger.type === 'entry') return 'Entry price reached';
  if (trigger.type === 'sl') return 'Stop loss hit';
  return `Take profit hit (${trigger.target})`;
}

export default function TradeAlertPanel({ analysis }) {
  const [alert, setAlert] = useState(null);
  const [currentPrice, setCurrentPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoCheck, setAutoCheck] = useState(false);
  const [livePrice, setLivePrice] = useState(null);
  const [lastCheckedAt, setLastCheckedAt] = useState('');

  useEffect(() => {
    let ignore = false;

    if (!analysis?.id) {
      return () => {};
    }

    getTradeAlerts({ status: 'active' })
      .then((alerts) => {
        if (!ignore) {
          const existingAlert = alerts.find((item) => item.analysisId === analysis.id);
          setAlert(existingAlert || null);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [analysis?.id]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const enableAlert = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      await requestNotificationPermission();
      const createdAlert = await createTradeAlertFromAnalysis(analysis.id);
      setAlert(createdAlert);
      setMessage('Entry, SL, and TP alert enabled. Email is sent when SMTP is configured.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to enable alert');
    } finally {
      setLoading(false);
    }
  };

  const checkPrice = async () => {
    if (!alert?.id || currentPrice === '') {
      setError('Enter the current market price first.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      const result = await checkTradeAlertPrice(alert.id, currentPrice);
      setAlert(result.alert);

      if (result.triggered) {
        const label = getTriggerLabel(result.trigger);
        setMessage(label);
        notify(`TrendAi alert: ${label}`, `${analysis.asset || 'Trade'} reached ${currentPrice}`);
      } else {
        setMessage('No entry, SL, or TP trigger at this price.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to check price');
    } finally {
      setLoading(false);
    }
  };

  const handleLiveResult = (result) => {
    setAlert(result.alert);
    setLivePrice(result.currentPrice);
    setLastCheckedAt(result.fetchedAt || new Date().toISOString());

    if (result.triggered) {
      const label = getTriggerLabel(result.trigger);
      setMessage(`${label} at ${result.currentPrice}`);
      notify(`TrendAi alert: ${label}`, `${result.symbol || analysis.asset || 'Trade'} reached ${result.currentPrice}`);
      if (result.trigger.type !== 'entry') {
        setAutoCheck(false);
      }
    } else {
      setMessage(`Live price checked: ${result.currentPrice}`);
    }
  };

  const checkLivePrice = async ({ silent = false } = {}) => {
    if (!alert?.id) {
      setError('Enable an alert first.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (!silent) setMessage('');
      const result = await checkTradeAlertLivePrice(alert.id);
      handleLiveResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to check live price';
      setError(message);
      if (silent) setAutoCheck(false);
    } finally {
      setLoading(false);
    }
  };

  const cancelAlert = async () => {
    if (!alert?.id) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await cancelTradeAlert(alert.id);
      setAlert(null);
      setAutoCheck(false);
      setLivePrice(null);
      setLastCheckedAt('');
      setMessage('Alert cancelled.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to cancel alert');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoCheck || !alert?.id || alert.status !== 'active') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      checkLivePrice({ silent: true });
    }, 60000);

    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCheck, alert?.id, alert?.status]);

  if (!analysis?.id) {
    return null;
  }

  return (
    <section
      className="rounded-2xl border p-4 sm:p-5"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {alert?.status === 'triggered' ? (
              <BellRing className="h-5 w-5" style={{ color: 'var(--chart-yellow)' }} />
            ) : (
              <Bell className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            )}
            <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Entry / SL / TP Notifications</h3>
          </div>
          <p className="mt-1 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
            Enable alerts for this setup. Crypto live checks use Binance; manual price check remains available as fallback.
          </p>
        </div>

        {!alert ? (
          <button
            type="button"
            onClick={enableAlert}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold disabled:opacity-60"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Bell className="h-4 w-4" />
            Enable Alert
          </button>
        ) : (
          <button
            type="button"
            onClick={cancelAlert}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold disabled:opacity-60"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--chart-red)' }}
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>

      {alert && (
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ['Direction', alert.direction],
              ['Entry', alert.entryPrice],
              ['Stop loss', alert.stopLoss],
              ['Take profits', alert.takeProfits?.join(', ')],
              ['Status', alert.status],
              ['Live price', livePrice],
              ['Last checked', lastCheckedAt ? new Date(lastCheckedAt).toLocaleTimeString() : 'Not checked'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border p-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
                <p className="mt-2 break-words font-mono text-sm font-bold" style={{ color: 'var(--foreground)' }}>{value || 'Not detected'}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => checkLivePrice()}
                disabled={loading || alert.status !== 'active'}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold disabled:opacity-60"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                <BellRing className="h-4 w-4" />
                Check Live Price
              </button>
              <button
                type="button"
                onClick={() => setAutoCheck((current) => !current)}
                disabled={alert.status !== 'active'}
                className="inline-flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-bold disabled:opacity-60"
                style={{
                  backgroundColor: autoCheck ? 'rgba(34,197,94,0.14)' : 'var(--secondary)',
                  color: autoCheck ? 'var(--chart-green)' : 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
              >
                {autoCheck ? 'Auto On' : 'Auto'}
              </button>
            </div>
            <div className="flex gap-2">
            <input
              type="number"
              step="any"
              value={currentPrice}
              onChange={(event) => setCurrentPrice(event.target.value)}
              className="h-12 min-w-0 flex-1 rounded-2xl border px-4 text-sm font-semibold outline-none lg:w-40"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
              placeholder="Current price"
            />
            <button
              type="button"
              onClick={checkPrice}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold disabled:opacity-60"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              <Search className="h-4 w-4" />
              Manual
            </button>
            </div>
          </div>
        </div>
      )}

      {(message || error) && (
        <p className="mt-3 text-sm" style={{ color: error ? 'var(--chart-red)' : 'var(--chart-green)' }}>
          {error || message}
        </p>
      )}
    </section>
  );
}
