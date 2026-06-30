import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { saveTradeResult } from '../../lib/api';

const outcomes = [
  { value: 'win', label: 'Win', color: 'var(--chart-green)' },
  { value: 'loss', label: 'Loss', color: 'var(--chart-red)' },
  { value: 'breakeven', label: 'Breakeven', color: 'var(--chart-yellow)' },
];

export default function TradeOutcomeForm({ analysisId, tradeResult, onSaved }) {
  const [form, setForm] = useState({
    result: tradeResult?.result || 'win',
    profitLoss: tradeResult?.profitLoss ?? '',
    rrAchieved: tradeResult?.rrAchieved ?? '',
    notes: tradeResult?.notes || '',
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      result: tradeResult?.result || 'win',
      profitLoss: tradeResult?.profitLoss ?? '',
      rrAchieved: tradeResult?.rrAchieved ?? '',
      notes: tradeResult?.notes || '',
    });
  }, [tradeResult]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setStatus('');
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!analysisId) {
      setError('This analysis has not been saved yet.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setStatus('');

      const saved = await saveTradeResult(analysisId, {
        result: form.result,
        profitLoss: form.profitLoss === '' ? null : Number(form.profitLoss),
        rrAchieved: form.rrAchieved === '' ? null : Number(form.rrAchieved),
        notes: form.notes.trim() || null,
      });

      setStatus('Outcome saved. TrendAi will use this feedback to adjust future analysis.');
      onSaved?.(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save outcome');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border p-4 sm:p-5"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Trade Outcome</h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Mark the result so TrendAi can learn from your feedback.
          </p>
        </div>
        {tradeResult?.result && (
          <span className="w-fit rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
            Current: {tradeResult.result}
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {outcomes.map((outcome) => {
          const active = form.result === outcome.value;

          return (
            <button
              key={outcome.value}
              type="button"
              onClick={() => update('result', outcome.value)}
              className="rounded-2xl border px-4 py-3 text-sm font-bold transition"
              style={{
                borderColor: active ? outcome.color : 'var(--border)',
                backgroundColor: active ? 'color-mix(in srgb, var(--primary) 12%, var(--secondary))' : 'var(--secondary)',
                color: active ? outcome.color : 'var(--foreground)',
              }}
            >
              {outcome.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>Profit / Loss</span>
          <input
            type="number"
            step="any"
            value={form.profitLoss}
            onChange={(event) => update('profitLoss', event.target.value)}
            className="h-12 w-full rounded-2xl border px-4 text-sm font-semibold outline-none"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
            placeholder="Optional"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>RR Achieved</span>
          <input
            type="number"
            step="any"
            value={form.rrAchieved}
            onChange={(event) => update('rrAchieved', event.target.value)}
            className="h-12 w-full rounded-2xl border px-4 text-sm font-semibold outline-none"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
            placeholder="Optional"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>Notes</span>
        <textarea
          value={form.notes}
          onChange={(event) => update('notes', event.target.value)}
          rows={3}
          className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
          placeholder="Optional trade notes"
        />
      </label>

      {(status || error) && (
        <p className="mt-3 text-sm" style={{ color: error ? 'var(--chart-red)' : 'var(--chart-green)' }}>
          {error || status}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !analysisId}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition disabled:opacity-60 sm:w-auto"
        style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        <Save className="h-4 w-4" />
        {saving ? 'Saving...' : 'Save Outcome'}
      </button>
    </form>
  );
}
