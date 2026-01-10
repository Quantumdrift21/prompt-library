import { useRef, useState, useEffect } from 'react';
import type { MonthlyUsage } from '../../services/dashboardService';
import './UsageChart.css';

interface UsageChartProps {
    data: MonthlyUsage[];
}

export const UsageChart = ({ data }: UsageChartProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const maxCount = Math.max(...data.map(d => d.count), 1);
    const { width, height } = dimensions;
    const padding = 10;
    const verticalPadding = 20; // More space at top/bottom

    // Only render if we have dimensions
    if (width === 0 || height === 0) {
        return (
            <div className="usage-chart">
                <div className="usage-chart__header">
                    <h3 className="usage-chart__title">Prompt Usage Over Time</h3>
                </div>
                <div className="usage-chart__graph" ref={containerRef} />
            </div>
        );
    }

    // Generate SVG path for area chart
    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
        // Invert Y axis, leave space at top/bottom
        const y = height - verticalPadding - (d.count / maxCount) * (height - 2 * verticalPadding);
        return { x, y };
    });

    // Line path
    const linePath = points.map((p, i) =>
        (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`
    ).join(' ');

    // Area path (closed)
    const areaPath = linePath +
        ` L${points[points.length - 1].x} ${height}` +
        ` L${points[0].x} ${height} Z`;

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

            <div className="usage-chart__graph" ref={containerRef}>
                <svg width={width} height={height} style={{ overflow: 'visible' }}>
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                        </linearGradient>
                        {/* Glass glow filter */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
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
                        filter="url(#glow)"
                        style={{ opacity: 0.8 }}
                    />

                    {/* Data points */}
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="3"
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
