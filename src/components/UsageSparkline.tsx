import { useMemo } from 'react';
import './UsageSparkline.css';

interface UsageSparklineProps {
    data: { date: string; count: number }[];
    days?: number;
}

// Helper to calculate control points for smooth Bezier curves
const getControlPoint = (current: { x: number; y: number }, previous: { x: number; y: number }, next: { x: number; y: number }, reverse?: boolean) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.2;
    const opp = (n.x - p.x) * smoothing;
    const adj = (n.y - p.y) * smoothing;
    const x = current.x + (reverse ? -opp : opp);
    const y = current.y + (reverse ? -adj : adj);
    return [x, y];
};

export const UsageSparkline = ({ data }: UsageSparklineProps) => {
    const { points, height, width } = useMemo(() => {
        // Always ensure we have some data points to render a line, even if empty
        const safeData = Array.isArray(data) && data.length > 0 ? data : Array(7).fill({ count: 0 });
        const h = 50;
        const w = 150;
        const max = Math.max(...safeData.map(d => d.count), 5);

        const pts = safeData.map((d, i) => ({
            x: (i / (safeData.length - 1)) * w,
            y: h - (d.count / max) * h
        }));
        return { points: pts, height: h, width: w };
    }, [data]);

    // Generate Path
    const pathD = useMemo(() => {
        if (points.length === 0) return '';

        return points.reduce((d, point, i, a) => {
            if (i === 0) return `M ${point.x},${point.y}`;

            const [cpsX, cpsY] = getControlPoint(a[i - 1], a[i - 2], point);
            const [cpeX, cpeY] = getControlPoint(point, a[i - 1], a[i + 1], true);

            return `${d} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
        }, '');
    }, [points]);

    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
        <div className="usage-sparkline">
            <svg
                viewBox={`0 -5 ${width} ${height + 10}`}
                className="usage-sparkline__svg"
                preserveAspectRatio="none"
            >
                <defs>
                    {/* Vibrant Line Gradient */}
                    <linearGradient id="lineSafe" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
                        <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
                        <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet */}
                    </linearGradient>

                    {/* Area Fill Gradient */}
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Glow Filter */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid lines (subtle) */}
                {[0.25, 0.5, 0.75].map(ratio => {
                    const x = width * ratio;
                    return <line key={ratio} x1={x} y1="0" x2={x} y2={height} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
                })}

                {/* The Filled Area */}
                <path
                    d={areaD}
                    fill="url(#areaFill)"
                />

                {/* The Main Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="url(#lineSafe)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />

                {/* Data points (only for non-zero or specific interaction, but kept minimal for 'smooth' look) */}
                {/* Optional: Add hover dots here if interactive */}
            </svg>
        </div>
    );
};
