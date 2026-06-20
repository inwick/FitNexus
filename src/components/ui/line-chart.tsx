import { EmptyState } from "@/components/ui/card";

export type ChartPoint = { label: string; value: number };

export function LineChart({
  data,
  unit = "",
  height = 180,
}: {
  data: ChartPoint[];
  unit?: string;
  height?: number;
}) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No data yet"
        description="Once entries are logged, your trend will appear here."
      />
    );
  }

  const width = 560;
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const x = (i: number) =>
    data.length === 1
      ? padding.left + innerW / 2
      : padding.left + (i / (data.length - 1)) * innerW;
  const y = (v: number) =>
    padding.top + innerH - ((v - min) / range) * innerH;

  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Trend chart"
    >
      <line
        x1={padding.left}
        y1={padding.top + innerH}
        x2={width - padding.right}
        y2={padding.top + innerH}
        stroke="#e2e8f0"
      />
      <text x={padding.left - 6} y={y(max)} textAnchor="end" fontSize="10" fill="#64748b">
        {max}
        {unit}
      </text>
      <text
        x={padding.left - 6}
        y={y(min) + 3}
        textAnchor="end"
        fontSize="10"
        fill="#64748b"
      >
        {min}
        {unit}
      </text>

      {data.length > 1 && (
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      )}

      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r="3.5" fill="#10b981" />
          <text
            x={x(i)}
            y={height - 8}
            textAnchor="middle"
            fontSize="9"
            fill="#64748b"
          >
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
