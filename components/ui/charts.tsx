import { CategorySlice, TrendPoint } from "@/interfaces/expense";
import { useId } from "react";

interface AreaTrendChartProps {
  points: TrendPoint[];
  accent?: string;
  height?: number;
}

interface BarChartProps {
  points: Array<TrendPoint & { month?: string }>;
  accent?: string;
}

interface DonutChartProps {
  segments: CategorySlice[];
}

export function AreaTrendChart({
  points,
  accent = "#4dd0e1",
  height = 220,
}: AreaTrendChartProps) {
  const gradientId = useId().replaceAll(":", "");
  const width = 640;
  const padding = 24;
  const max = Math.max(...points.map((point) => point.amount), 1);
  const step =
    points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const chartHeight = height;
  const baseY = chartHeight - padding;

  const coordinates = points.map((point, index) => ({
    ...point,
    x: padding + step * index,
    y:
      chartHeight -
      padding -
      (point.amount / max) * Math.max(chartHeight - padding * 2, 1),
  }));

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${coordinates.at(-1)?.x ?? padding} ${baseY} L ${coordinates[0]?.x ?? padding} ${baseY} Z`;

  return (
    <div className="space-y-4">
      <div className="chart-grid overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/10 p-3">
        <svg
          viewBox={`0 0 ${width} ${chartHeight}`}
          className="h-full w-full"
          aria-label="Expense trend chart"
          role="img"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((stepValue) => {
            const y = padding + (chartHeight - padding * 2) * stepValue;
            return (
              <line
                key={stepValue}
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.07)"
                strokeDasharray="4 8"
              />
            );
          })}
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {coordinates.map((point) => (
            <circle
              key={`${point.label}-${point.x}`}
              cx={point.x}
              cy={point.y}
              r="5"
              fill={accent}
              stroke="#1e1e1e"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.max(points.length, 1)}, minmax(0, 1fr))`,
        }}
      >
        {points.map((point) => (
          <div key={point.label} className="text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-white/45">
              {point.label}
            </p>
            <p className="mt-1 text-sm font-medium text-white/80">
              {point.formattedAmount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChart({ points, accent = "#f4b350" }: BarChartProps) {
  const max = Math.max(...points.map((point) => point.amount), 1);

  return (
    <div className="grid h-72 grid-cols-6 gap-3">
      {points.map((point) => {
        const height = Math.max((point.amount / max) * 100, 8);

        return (
          <div
            key={`${point.month || point.label}-${point.amount}`}
            className="flex flex-col justify-end"
          >
            <span className="mb-3 text-xs text-white/45">{point.formattedAmount}</span>
            <div className="relative flex-1 rounded-[1.5rem] border border-white/8 bg-white/4 p-1">
              <div
                className="absolute inset-x-1 bottom-1 rounded-[1.1rem]"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(180deg, rgba(244,179,80,0.2) 0%, ${accent} 100%)`,
                }}
              />
            </div>
            <span className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-white/55">
              {point.month || point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({ segments }: DonutChartProps) {
  const total = Math.max(
    segments.reduce((sum, segment) => sum + segment.amount, 0),
    1,
  );
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = segments.reduce<{
    items: Array<{ segment: CategorySlice; portion: number; offset: number }>;
    offset: number;
  }>(
    (state, segment) => {
      const portion = (segment.amount / total) * circumference;

      return {
        offset: state.offset + portion,
        items: [
          ...state.items,
          {
            segment,
            portion,
            offset: state.offset,
          },
        ],
      };
    },
    {
      items: [],
      offset: 0,
    },
  ).items;

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
      <div className="relative grid place-items-center">
        <svg viewBox="0 0 220 220" className="size-56 -rotate-90">
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="24"
          />
          {chartSegments.map(({ segment, portion, offset }) => (
            <circle
              key={segment.category}
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="24"
              strokeDasharray={`${portion} ${circumference - portion}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-white/45">
            Category mix
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {segments.length}
          </p>
          <p className="text-sm text-white/55">active categories</p>
        </div>
      </div>
      <div className="w-full space-y-3">
        {segments.map((segment) => (
          <div
            key={segment.category}
            className="surface-card flex items-center justify-between rounded-[1.25rem] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <div>
                <p className="font-medium">{segment.category}</p>
                <p className="text-sm text-white/50">{segment.share}% of total</p>
              </div>
            </div>
            <p className="text-sm text-white/75">{segment.formattedAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
