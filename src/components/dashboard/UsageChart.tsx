import type { MonthlyUsage } from '../../services/dashboardService';
import './UsageChart.css';

interface UsageChartProps {
    data: MonthlyUsage[];
}

export const UsageChart = ({ data }: UsageChartProps) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const height = 160;
    const width = 100;
    const padding = 10;

    // Generate SVG path for area chart
    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
        const y = height - padding - (d.count / maxCount) * (height - 2 * padding);
        return { x, y };
    });

    // Line path
    const linePath = points.map((p, i) =>
        (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`
    ).join(' ');

    // Area path (closed)
    const areaPath = linePath +
        ` L${points[points.length - 1].x} ${height - padding}` +
        ` L${padding} ${height - padding} Z`;

    return (
        <div className="usage-chart">
            <div className="usage-chart__header">
                <h3 className="usage-chart__title">Prompt Usage Over Time</h3>
                <div className="usage-chart__legend">
                    <span className="usage-chart__legend-item">
                        <span className="usage-chart__legend-dot"></span>
                        Usage
                    </span>
                </div>
            </div>

            <div className="usage-chart__graph">
                <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                        d={areaPath}
                        fill="url(#chartGradient)"
                        className="usage-chart__area"
                    />

                    {/* Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="usage-chart__line"
                    />

                    {/* Data points */}
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            fill="var(--color-surface)"
                            stroke="var(--accent-primary)"
                            strokeWidth="2"
                            className="usage-chart__point"
                        />
                    ))}
                </svg>
            </div>

            <div className="usage-chart__labels">
                {data.map((d, i) => (
                    <span key={i} className="usage-chart__label">{d.month}</span>
                ))}
            </div>
        </div>
    );
};
