import type { GlobePin } from './FanGlobe';

const RANCHI = { lat: 23.34, lon: 85.31 };
const W = 360;
const H = 180;
const xy = (lat: number, lon: number) => [lon + 180, 90 - lat] as const;

/** Lightweight 2D stand-in for the WebGL globe, shown when 3D is turned off. */
export default function FlatPinMap({ pins, focus, className }: { pins: GlobePin[]; focus: GlobePin | null; className?: string }) {
  const [rx, ry] = xy(RANCHI.lat, RANCHI.lon);

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-x-4 top-1/2 w-[calc(100%-2rem)] -translate-y-1/2" role="img" aria-label={`Flat map with ${pins.length} fan pins`}>
        <rect width={W} height={H} rx="6" fill="#0c0e13" stroke="rgba(244,239,227,0.08)" />
        {[30, 60, 90, 120, 150].map((y) => (
          <line key={`h${y}`} x1="0" x2={W} y1={y} y2={y} stroke="rgba(244,239,227,0.06)" strokeWidth="0.4" />
        ))}
        {[60, 120, 180, 240, 300].map((x) => (
          <line key={`v${x}`} y1="0" y2={H} x1={x} x2={x} stroke="rgba(244,239,227,0.06)" strokeWidth="0.4" />
        ))}
        {pins.map((p) => {
          const [x, y] = xy(p.lat, p.lon);
          return (
            <g key={p.id}>
              <path d={`M${rx},${ry} Q${(rx + x) / 2},${Math.min(ry, y) - 18} ${x},${y}`} fill="none" stroke="rgba(253,185,19,0.18)" strokeWidth="0.4" />
              <circle cx={x} cy={y} r={focus?.id === p.id ? 2.6 : 1.5} fill="#fdb913">
                <title>{p.label}</title>
              </circle>
            </g>
          );
        })}
        <circle cx={rx} cy={ry} r="2.4" fill="#3aa0ee" />
      </svg>
      <p className="absolute inset-x-0 top-5 text-center text-xs uppercase tracking-[0.14em] text-dust">3D is off · switch it on in the footer to spin the globe</p>
    </div>
  );
}
