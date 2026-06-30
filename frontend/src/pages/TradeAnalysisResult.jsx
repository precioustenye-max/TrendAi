import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Clock3, RefreshCw } from "lucide-react";
import AnalysisDetail from "../components/analysis/AnalysisDetail";
import TradeOutcomeForm from "../components/analysis/TradeOutcomeForm";
import TradeAlertPanel from "../components/analysis/TradeAlertPanel";
import { getAnalysisById } from "../lib/api";

function formatDate(value) {
  if (!value) {
    return "Not detected";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function TradeAnalysisResult() {
  const location = useLocation();
  const setup = location.state || {};
  const [analysis, setAnalysis] = useState(setup.analysis || null);
  const [loading, setLoading] = useState(Boolean(setup.analysis?.id));
  const [error, setError] = useState("");

  const analyzedAt = useMemo(
    () => analysis?.createdAt || setup.analyzedAt || new Date().toISOString(),
    [analysis?.createdAt, setup.analyzedAt]
  );

  const refreshAnalysis = async () => {
    if (!analysis?.id) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      const freshAnalysis = await getAnalysisById(analysis.id);
      setAnalysis(freshAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refresh analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] pb-8">
      <section
        className="overflow-hidden rounded-[28px] border"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
      >
        <div className="border-b px-4 py-4 sm:px-6" style={{ borderColor: "var(--border)" }}>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <Link
              to="/chat-analyzer"
              className="flex h-10 w-10 items-center justify-center rounded-full transition"
              style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
              aria-label="Back to analyzer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0 text-center">
              <h1 className="truncate text-base font-bold sm:text-lg">Trade Analysis</h1>
              <p className="mt-1 inline-flex items-center justify-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <Clock3 className="h-3.5 w-3.5" />
                {formatDate(analyzedAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={refreshAnalysis}
              disabled={!analysis?.id || loading}
              className="flex h-10 w-10 items-center justify-center rounded-full transition disabled:opacity-50"
              style={{ backgroundColor: "var(--secondary)", color: "var(--foreground)" }}
              aria-label="Refresh analysis"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
          {loading && (
            <div className="rounded-2xl border p-6 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              Loading analysis...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: "rgba(239,68,68,0.45)", backgroundColor: "rgba(239,68,68,0.08)", color: "var(--chart-red)" }}>
              {error}
            </div>
          )}

          {!loading && !analysis && (
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
              <h2 className="text-xl font-bold">No analysis loaded</h2>
              <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Upload a chart screenshot to generate a trade analysis.
              </p>
              <Link
                to="/chat-analyzer"
                className="mt-5 inline-flex rounded-2xl px-4 py-3 text-sm font-bold"
                style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Upload Screenshot
              </Link>
            </div>
          )}

          {analysis && (
            <>
              <AnalysisDetail analysis={analysis} />
              <TradeAlertPanel analysis={analysis} />
              <TradeOutcomeForm
                analysisId={analysis.id}
                tradeResult={analysis.tradeResult}
                onSaved={(tradeResult) => setAnalysis((current) => ({ ...current, tradeResult }))}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
