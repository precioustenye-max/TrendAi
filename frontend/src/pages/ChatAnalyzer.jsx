import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { uploadChart as uploadChartToBackend } from "../lib/api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DAILY_ANALYSIS_LIMIT = 4;

const instruments = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "NAS100", "US30", "BTCUSD"];

const chartSlots = [
  {
    id: "fourHour",
    timeframe: "4H",
    title: "Upload 4H Chart",
    description: "Higher timeframe direction",
  },
  {
    id: "fifteenMinute",
    timeframe: "15M",
    title: "Upload 15M Chart",
    description: "Entry timeframe setup",
  },
];

const emptyCharts = {
  fourHour: null,
  fifteenMinute: null,
};

const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "Image must be less than 5MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type),
    "Only JPG, PNG, and WEBP images are allowed"
  );

function formatFileSize(file) {
  return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
}

export default function ChatAnalyzer() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const chartsRef = useRef(emptyCharts);
  const instrumentMenuRef = useRef(null);

  const [charts, setCharts] = useState(emptyCharts);
  const [activeSlot, setActiveSlot] = useState("fourHour");
  const [instrument, setInstrument] = useState("XAUUSD");
  const [instrumentMenuOpen, setInstrumentMenuOpen] = useState(false);
  const [tradeFocus, setTradeFocus] = useState("scalping");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const selectedCharts = Object.values(charts).filter(Boolean);
  const uploadedCharts = selectedCharts.filter((chart) => chart.status === "success");
  const hasBothCharts = chartSlots.every((slot) => Boolean(charts[slot.id]));
  const canAnalyze = hasBothCharts && !uploading;

  useEffect(() => {
    chartsRef.current = charts;
  }, [charts]);

  useEffect(() => {
    return () => {
      Object.values(chartsRef.current).forEach((chart) => {
        if (chart?.preview) {
          URL.revokeObjectURL(chart.preview);
        }
      });
    };
  }, []);

  useEffect(() => {
    const closeInstrumentMenu = (event) => {
      if (!instrumentMenuRef.current?.contains(event.target)) {
        setInstrumentMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeInstrumentMenu);

    return () => {
      document.removeEventListener("pointerdown", closeInstrumentMenu);
    };
  }, []);

  const openPicker = (slotId) => {
    setActiveSlot(slotId);
    fileInputRef.current?.click();
  };

  const addChart = (slotId, file) => {
    setError("");

    const result = imageSchema.safeParse(file);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setCharts((prev) => {
      if (prev[slotId]?.preview) {
        URL.revokeObjectURL(prev[slotId].preview);
      }

      return {
        ...prev,
        [slotId]: {
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "ready",
          uploadedUrl: null,
        },
      };
    });
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      addChart(activeSlot, file);
    }

    event.target.value = "";
  };

  const handleDrop = (event, slotId) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];

    if (file) {
      addChart(slotId, file);
    }
  };

  const removeChart = (slotId) => {
    setCharts((prev) => {
      if (prev[slotId]?.preview) {
        URL.revokeObjectURL(prev[slotId].preview);
      }

      return {
        ...prev,
        [slotId]: null,
      };
    });
  };

  const uploadChart = async (slot, chart) => {
    setCharts((prev) => ({
      ...prev,
      [slot.id]: prev[slot.id]
        ? { ...prev[slot.id], progress: 35, status: "uploading" }
        : prev[slot.id],
    }));

    const formData = new FormData();
    formData.append("timeframeHint", slot.timeframe);
    formData.append("assetHint", instrument);
    formData.append("tradeFocus", tradeFocus);
    formData.append("chart", chart.file);

    setCharts((prev) => ({
      ...prev,
      [slot.id]: prev[slot.id]
        ? { ...prev[slot.id], progress: 75, status: "uploading" }
        : prev[slot.id],
    }));

    const result = await uploadChartToBackend(formData);
    const upload = result.upload;

    setCharts((prev) => ({
      ...prev,
      [slot.id]: prev[slot.id]
        ? {
            ...prev[slot.id],
            progress: 100,
            status: "success",
            uploadedUrl: upload.publicUrl,
            uploadId: upload.id,
            analysis: result.analysis,
          }
        : prev[slot.id],
    }));

    return {
      timeframe: slot.timeframe,
      url: upload.publicUrl,
      uploadId: upload.id,
      fileName: upload.originalName || upload.filename,
      analysis: result.analysis,
    };
  };

  const analyzeCharts = async () => {
    if (!hasBothCharts) {
      setError("Please upload both the 4H and 15M chart screenshots.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const uploadedUrls = await Promise.all(
        chartSlots.map((slot) => {
          const chart = charts[slot.id];

          if (chart?.status === "success") {
            return {
              timeframe: slot.timeframe,
              url: chart.uploadedUrl,
              uploadId: chart.uploadId,
              fileName: chart.file.name,
              analysis: chart.analysis,
            };
          }

          return uploadChart(slot, chart);
        })
      );

      const preferredChart = uploadedUrls.find((chart) => chart.timeframe === "15M") || uploadedUrls[0];
      const analysis = preferredChart.analysis;

      navigate("/trade-analysis", {
        state: {
          instrument,
          tradeFocus,
          charts: uploadedUrls,
          analysis,
          analyzedAt: analysis.analyzedAt,
        },
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");

      setCharts((prev) => ({
        fourHour:
          prev.fourHour?.status === "uploading"
            ? { ...prev.fourHour, status: "error" }
            : prev.fourHour,
        fifteenMinute:
          prev.fifteenMinute?.status === "uploading"
            ? { ...prev.fifteenMinute, status: "error" }
            : prev.fifteenMinute,
      }));
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="mx-auto max-w-[1040px] pb-8">
        <section
          className="flex min-h-[620px] flex-col items-center justify-center overflow-hidden rounded-[28px] border px-6 py-12 text-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
          }}
        >
          <div className="relative flex h-28 w-28 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-4 border-dashed animate-spin"
              style={{ borderColor: "var(--primary)" }}
            />
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl"
              style={{
                backgroundColor: "color-mix(in srgb, var(--primary) 14%, transparent)",
                color: "var(--primary)",
              }}
            >
              <Loader2 className="h-9 w-9 animate-spin" />
            </div>
          </div>

          <p
            className="mt-8 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            Analyzing Trade Setup
          </p>
          <h1 className="mt-3 max-w-[420px] text-3xl font-bold tracking-[-0.04em]">
            Reading your 4H and 15M charts
          </h1>
          <p
            className="mt-4 max-w-[440px] text-sm leading-6"
            style={{ color: "var(--muted-foreground)" }}
          >
            TrendAI is checking structure, direction, entry, stop loss, target, risk ratio,
            strength, and expected duration.
          </p>

          <div className="mt-8 grid w-full max-w-[420px] grid-cols-3 gap-3">
            {["Structure", "Entry", "Risk"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border px-3 py-4 text-sm font-bold"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--secondary)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1040px] pb-8">
      <section
        className="overflow-hidden rounded-[28px] border"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
          color: "var(--foreground)",
        }}
      >
        <div
          className="border-b px-5 py-5 sm:px-6"
          style={{
            borderColor: "var(--border)",
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), color-mix(in srgb, var(--accent) 12%, transparent))",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            Trade Setup
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            Select instrument and upload your 4H and 15M timeframes
          </h1>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <div>
              <p className="text-sm font-semibold" id="instrument-label">
                Select Instrument
              </p>
              <div className="relative mt-2" ref={instrumentMenuRef}>
                <button
                  type="button"
                  aria-labelledby="instrument-label"
                  aria-expanded={instrumentMenuOpen}
                  onClick={() => setInstrumentMenuOpen((open) => !open)}
                  className="flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-left text-sm font-semibold outline-none transition"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--secondary)",
                    color: "var(--foreground)",
                  }}
                >
                  <span>{instrument}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition ${instrumentMenuOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--muted-foreground)" }}
                  />
                </button>

                {instrumentMenuOpen && (
                  <div
                    className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border p-1 shadow-2xl"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                    }}
                  >
                    {instruments.map((item) => {
                      const isSelected = item === instrument;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setInstrument(item);
                            setInstrumentMenuOpen(false);
                          }}
                          className="flex h-10 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-semibold transition hover:opacity-85"
                          style={{
                            backgroundColor: isSelected ? "var(--primary)" : "transparent",
                            color: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
                          }}
                        >
                          {item}
                          {isSelected && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div
              className="hidden h-px w-16 md:block"
              style={{ backgroundColor: "var(--border)" }}
            />

            <div>
              <p className="text-sm font-semibold">Today's analyses</p>
              <div className="mt-2 flex items-center gap-3">
                <div
                  className="h-2 flex-1 overflow-hidden rounded-full"
                  style={{ backgroundColor: "var(--secondary)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((uploadedCharts.length / DAILY_ANALYSIS_LIMIT) * 100, 100)}%`,
                      backgroundColor: "var(--primary)",
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {uploadedCharts.length}/{DAILY_ANALYSIS_LIMIT}
                </span>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            {chartSlots.map((slot) => {
              const chart = charts[slot.id];

              return (
                <div
                  key={slot.id}
                  onDrop={(event) => handleDrop(event, slot.id)}
                  onDragOver={(event) => event.preventDefault()}
                  className="min-h-[210px] overflow-hidden rounded-[18px] border border-dashed sm:min-h-[250px] sm:rounded-[22px]"
                  style={{
                    borderColor: chart ? "var(--hover-border)" : "var(--border)",
                    backgroundColor: "var(--secondary)",
                  }}
                >
                  {chart ? (
                    <div className="flex h-full flex-col">
                      <div className="relative h-28 sm:h-36">
                        <img
                          src={chart.preview}
                          alt={`${slot.timeframe} chart preview`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeChart(slot.id)}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black sm:right-3 sm:top-3 sm:h-9 sm:w-9"
                          aria-label={`Remove ${slot.timeframe} chart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-1 flex-col p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold sm:text-sm">{slot.title}</p>
                            <p
                              className="mt-1 truncate text-[11px] sm:text-xs"
                              style={{ color: "var(--muted-foreground)" }}
                            >
                              {formatFileSize(chart.file)}
                            </p>
                          </div>
                          {chart.status === "success" && (
                            <CheckCircle2
                              className="h-5 w-5 shrink-0"
                              style={{ color: "var(--primary)" }}
                            />
                          )}
                        </div>

                        <div
                          className="mt-4 h-2 overflow-hidden rounded-full"
                          style={{ backgroundColor: "var(--card)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${chart.progress}%`, backgroundColor: "var(--primary)" }}
                          />
                        </div>

                        <div
                          className="mt-2 text-xs font-semibold capitalize"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {chart.status === "uploading" ? "Uploading..." : chart.status}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openPicker(slot.id)}
                    className="flex h-full min-h-[210px] w-full flex-col items-center justify-center px-3 text-center transition hover:opacity-85 sm:min-h-[250px] sm:px-4"
                    >
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--primary) 14%, transparent)",
                          color: "var(--primary)",
                        }}
                      >
                        <ImagePlus className="h-6 w-6 sm:h-7 sm:w-7" />
                      </span>
                      <span className="mt-3 text-sm font-bold sm:mt-4 sm:text-base">{slot.title}</span>
                      <span
                        className="mt-2 text-xs sm:text-sm"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {slot.description}
                      </span>
                      <span
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold sm:gap-2 sm:px-4 sm:text-xs"
                        style={{
                          backgroundColor: "var(--card)",
                          color: "var(--foreground)",
                        }}
                      >
                        <Upload className="h-4 w-4" />
                        Choose Image
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">What's Your Trade Focus?</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { id: "scalping", label: "Scalping" },
                { id: "swing", label: "Swing" },
              ].map((focus) => {
                const isActive = tradeFocus === focus.id;

                return (
                  <button
                    key={focus.id}
                    type="button"
                    onClick={() => setTradeFocus(focus.id)}
                    className="h-12 rounded-2xl text-sm font-bold transition"
                    style={{
                      backgroundColor: isActive ? "var(--primary)" : "var(--secondary)",
                      color: isActive ? "var(--primary-foreground)" : "var(--foreground)",
                    }}
                  >
                    {focus.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div
              className="mt-5 flex items-start gap-2 rounded-2xl border p-3"
              style={{
                borderColor: "color-mix(in srgb, var(--destructive) 34%, var(--border))",
                backgroundColor: "color-mix(in srgb, var(--destructive) 10%, transparent)",
                color: "var(--destructive)",
              }}
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={analyzeCharts}
            disabled={!canAnalyze}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </button>

        </div>
      </section>
    </div>
  );
}
