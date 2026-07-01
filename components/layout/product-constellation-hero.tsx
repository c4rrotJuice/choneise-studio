import styles from "./product-constellation-hero.module.css";

/* ------------------------------------------------------------------ */
/*  Static constellation data (no DB fetch — Cloudflare static-safe)   */
/* ------------------------------------------------------------------ */

type ConstellationNode = {
  id: string;
  name: string;
  status: "Live" | "Building" | "Active" | "Archived";
  is_experiment: boolean;
};

const CONSTELLATION_NODES: ConstellationNode[] = [
  {
    id: "grade-converter",
    name: "Grade Converter",
    status: "Live",
    is_experiment: false,
  },
  {
    id: "runete-dev",
    name: "runete.dev",
    status: "Building",
    is_experiment: false,
  },
  { id: "writior", name: "Writior", status: "Building", is_experiment: true },
  {
    id: "quiet-journal",
    name: "Quiet Journal",
    status: "Archived",
    is_experiment: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Orbit assignment                                                   */
/* ------------------------------------------------------------------ */

function getOrbitGroup(node: ConstellationNode): "inner" | "middle" | "outer" {
  if (node.is_experiment) return "outer";
  if (node.status === "Live") return "inner";
  return "middle";
}

/* ------------------------------------------------------------------ */
/*  Orbit geometry                                                     */
/* ------------------------------------------------------------------ */

type OrbitDef = {
  rx: number;
  ry: number;
  rotate: number;
  label: string;
  /** CSS animation duration in seconds for the orbit spin */
  spinDuration: number;
};

const ORBITS: OrbitDef[] = [
  { rx: 148, ry: 115, rotate: -14, label: "inner", spinDuration: 24 },
  { rx: 226, ry: 172, rotate: 8, label: "middle", spinDuration: 32 },
  { rx: 306, ry: 228, rotate: -7, label: "outer", spinDuration: 40 },
];

const CENTER = { cx: 450, cy: 360 };

/* ------------------------------------------------------------------ */
/*  Position helpers                                                   */
/* ------------------------------------------------------------------ */

function distributeOnRing(
  nodes: ConstellationNode[],
  orbit: OrbitDef,
  indexOffset: number,
) {
  const n = nodes.length;
  if (n === 0) return [];

  return nodes.map((node, i) => {
    const angle =
      (2 * Math.PI * (i + indexOffset)) / n +
      (orbit.label === "inner" ? -0.4 : orbit.label === "outer" ? 0.6 : 0);
    const x = CENTER.cx + orbit.rx * Math.cos(angle);
    const y = CENTER.cy + orbit.ry * Math.sin(angle);
    return { node, x, y, angle };
  });
}

const STATUS_COLORS: Record<ConstellationNode["status"], string> = {
  Live: "#a9b8aa",
  Building: "#e4c88d",
  Active: "#a6c7e7",
  Archived: "#6f716d",
};

const STATUS_LABELS: Record<ConstellationNode["status"], string> = {
  Live: "LIVE",
  Building: "BUILDING",
  Active: "ACTIVE",
  Archived: "ARCHIVED",
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function OrbitRings() {
  return (
    <g className={styles.rings}>
      {ORBITS.map((orbit) => (
        <ellipse
          key={orbit.label}
          cx={CENTER.cx}
          cy={CENTER.cy}
          rx={orbit.rx}
          ry={orbit.ry}
          transform={`rotate(${orbit.rotate} ${CENTER.cx} ${CENTER.cy})`}
          fill="none"
          stroke="rgba(245, 245, 243, 0.06)"
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

function CenterNode() {
  return (
    <g className={styles.centerNode}>
      <circle
        cx={CENTER.cx}
        cy={CENTER.cy}
        r={42}
        fill="rgba(20, 23, 27, 0.82)"
        stroke="rgba(245, 245, 243, 0.14)"
        strokeWidth="1"
      />
      <text
        x={CENTER.cx}
        y={CENTER.cy - 5}
        textAnchor="middle"
        dominantBaseline="auto"
        className={styles.centerTextPrimary}
      >
        CHONEISE
      </text>
      <text
        x={CENTER.cx}
        y={CENTER.cy + 16}
        textAnchor="middle"
        dominantBaseline="auto"
        className={styles.centerTextSecondary}
      >
        STUDIO
      </text>
    </g>
  );
}

function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  orbitLabel,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  orbitLabel: string;
}) {
  const opacity =
    orbitLabel === "inner" ? 0.18 : orbitLabel === "middle" ? 0.12 : 0.08;
  return (
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke="rgba(245, 245, 243, 0.38)"
      strokeOpacity={opacity}
      strokeWidth="0.75"
      strokeDasharray={orbitLabel === "outer" ? "3 4" : undefined}
    />
  );
}

function ProjectNode({
  node,
  x,
  y,
  index,
  orbit,
}: {
  node: ConstellationNode;
  x: number;
  y: number;
  index: number;
  orbit: OrbitDef;
}) {
  const cardW = 124;
  const cardH = 46;
  const rx = x - cardW / 2;
  const ry = y - cardH / 2;

  return (
    <g
      className={styles.projectNode}
      style={{
        animationDuration: `${orbit.spinDuration}s`,
      }}
    >
      <rect
        x={rx}
        y={ry}
        width={cardW}
        height={cardH}
        rx={6}
        fill="rgba(20, 23, 27, 0.78)"
        stroke="rgba(245, 245, 243, 0.1)"
        strokeWidth="0.75"
      />
      <circle
        cx={rx + 14}
        cy={ry + cardH / 2}
        r={4}
        fill={STATUS_COLORS[node.status]}
        opacity={0.9}
      />
      <text x={rx + 26} y={ry + 18} className={styles.nodeName}>
        {node.name.length > 17 ? node.name.slice(0, 15) + "\u2026" : node.name}
      </text>
      <text
        x={rx + 26}
        y={ry + 34}
        className={styles.nodeStatus}
        fill={STATUS_COLORS[node.status]}
      >
        {STATUS_LABELS[node.status]}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function ProductConstellationHero() {
  // Group nodes by orbit ring
  const innerNodes = CONSTELLATION_NODES.filter(
    (p) => getOrbitGroup(p) === "inner",
  );
  const middleNodes = CONSTELLATION_NODES.filter(
    (p) => getOrbitGroup(p) === "middle",
  );
  const outerNodes = CONSTELLATION_NODES.filter(
    (p) => getOrbitGroup(p) === "outer",
  );

  const innerPositions = distributeOnRing(innerNodes, ORBITS[0], 0);
  const middlePositions = distributeOnRing(middleNodes, ORBITS[1], 0);
  const outerPositions = distributeOnRing(outerNodes, ORBITS[2], 0);

  function renderOrbitGroup(
    positions: ReturnType<typeof distributeOnRing>,
    orbit: OrbitDef,
  ) {
    if (positions.length === 0) return null;

    return (
      <g
        key={`orbit-${orbit.label}`}
        className={styles.orbitGroup}
        style={{
          animationDuration: `${orbit.spinDuration}s`,
        }}
      >
        {/* Connections from center to each node */}
        {positions.map(({ x, y, node }) => (
          <ConnectionLine
            key={`conn-${node.id}`}
            fromX={CENTER.cx}
            fromY={CENTER.cy}
            toX={x}
            toY={y}
            orbitLabel={orbit.label}
          />
        ))}
        {/* Project nodes */}
        {positions.map(({ node, x, y }, i) => (
          <ProjectNode
            key={`node-${node.id}`}
            node={node}
            x={x}
            y={y}
            index={i}
            orbit={orbit}
          />
        ))}
      </g>
    );
  }

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.radialGlow} />
      <svg
        className={styles.scene}
        viewBox="0 0 900 700"
        role="presentation"
        focusable="false"
      >
        <defs>
          <filter
            id="cn-subtle-blur"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        <g className={styles.ambiance}>
          <circle cx="164" cy="142" r="1.2" opacity="0.22" />
          <circle cx="688" cy="108" r="1" opacity="0.18" />
          <circle cx="784" cy="296" r="0.9" opacity="0.16" />
          <circle cx="128" cy="518" r="1.1" opacity="0.2" />
          <circle cx="762" cy="548" r="0.8" opacity="0.15" />
        </g>

        <OrbitRings />

        {renderOrbitGroup(innerPositions, ORBITS[0])}
        {renderOrbitGroup(middlePositions, ORBITS[1])}
        {renderOrbitGroup(outerPositions, ORBITS[2])}

        <CenterNode />
      </svg>
    </div>
  );
}
