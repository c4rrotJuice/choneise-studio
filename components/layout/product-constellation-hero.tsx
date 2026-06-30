import {
  getConstellationProjects,
  getOrbitGroup,
  type ConstellationNode,
} from "@/lib/content/projects-constellation";
import styles from "./product-constellation-hero.module.css";

/* ------------------------------------------------------------------ */
/*  Orbit geometry                                                     */
/* ------------------------------------------------------------------ */

type OrbitDef = {
  rx: number;
  ry: number;
  rotate: number;
  label: string;
};

const ORBITS: OrbitDef[] = [
  { rx: 148, ry: 115, rotate: -14, label: "inner" },
  { rx: 226, ry: 172, rotate: 8, label: "middle" },
  { rx: 306, ry: 228, rotate: -7, label: "outer" },
];

const CENTER = { cx: 450, cy: 360 };

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function distributeOnRing(
  nodes: ConstellationNode[],
  orbit: OrbitDef,
  indexOffset: number,
) {
  const n = nodes.length;
  if (n === 0) return [];

  return nodes.map((node, i) => {
    // Deterministic placement: spread evenly, offset per orbit group
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
/*  Sub-components (inline SVG)                                        */
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
      {/* Subtle backdrop circle */}
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
  x,
  y,
  orbitLabel,
}: {
  x: number;
  y: number;
  orbitLabel: string;
}) {
  const opacity = orbitLabel === "inner" ? 0.18 : orbitLabel === "middle" ? 0.12 : 0.08;
  return (
    <line
      x1={CENTER.cx}
      y1={CENTER.cy}
      x2={x}
      y2={y}
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
  totalOnRing,
}: {
  node: ConstellationNode;
  x: number;
  y: number;
  index: number;
  totalOnRing: number;
}) {
  const cardW = 124;
  const cardH = 46;
  const rx = x - cardW / 2;
  const ry = y - cardH / 2;

  // Stagger animation delay
  const delay = (index / Math.max(totalOnRing, 1)) * 3;

  return (
    <g
      className={styles.projectNode}
      style={{
        animationDelay: `${delay.toFixed(2)}s`,
        animationDuration: `${(7 + (index % 5)).toFixed(0)}s`,
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
      {/* Status dot */}
      <circle
        cx={rx + 14}
        cy={ry + cardH / 2}
        r={4}
        fill={STATUS_COLORS[node.status]}
        opacity={0.9}
      />
      {/* Project name */}
      <text
        x={rx + 26}
        y={ry + 18}
        className={styles.nodeName}
      >
        {node.name.length > 17 ? node.name.slice(0, 15) + "…" : node.name}
      </text>
      {/* Status label */}
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

export async function ProductConstellationHero() {
  const projects = await getConstellationProjects();

  // Group by orbit
  const innerNodes: ConstellationNode[] = [];
  const middleNodes: ConstellationNode[] = [];
  const outerNodes: ConstellationNode[] = [];

  for (const p of projects) {
    const group = getOrbitGroup(p);
    if (group === "inner") innerNodes.push(p);
    else if (group === "middle") middleNodes.push(p);
    else outerNodes.push(p);
  }

  // Distribute on rings
  const innerPositions = distributeOnRing(innerNodes, ORBITS[0], 0);
  const middlePositions = distributeOnRing(middleNodes, ORBITS[1], 0);
  const outerPositions = distributeOnRing(outerNodes, ORBITS[2], 0);

  const allPositions = [...innerPositions, ...middlePositions, ...outerPositions];

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
          <filter id="cn-subtle-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* Background ambiance dots */}
        <g className={styles.ambiance}>
          <circle cx="164" cy="142" r="1.2" opacity="0.22" />
          <circle cx="688" cy="108" r="1" opacity="0.18" />
          <circle cx="784" cy="296" r="0.9" opacity="0.16" />
          <circle cx="128" cy="518" r="1.1" opacity="0.2" />
          <circle cx="762" cy="548" r="0.8" opacity="0.15" />
        </g>

        <OrbitRings />

        {/* Connections */}
        <g className={styles.connections}>
          {allPositions.map(({ x, y, node }, i) => (
            <ConnectionLine
              key={`conn-${node.id}-${i}`}
              x={x}
              y={y}
              orbitLabel={getOrbitGroup(node)}
            />
          ))}
        </g>

        {/* Project nodes */}
        {innerPositions.map(({ node, x, y }, i) => (
          <ProjectNode
            key={`inner-${node.id}`}
            node={node}
            x={x}
            y={y}
            index={i}
            totalOnRing={innerNodes.length}
          />
        ))}
        {middlePositions.map(({ node, x, y }, i) => (
          <ProjectNode
            key={`middle-${node.id}`}
            node={node}
            x={x}
            y={y}
            index={i}
            totalOnRing={middleNodes.length}
          />
        ))}
        {outerPositions.map(({ node, x, y }, i) => (
          <ProjectNode
            key={`outer-${node.id}`}
            node={node}
            x={x}
            y={y}
            index={i}
            totalOnRing={outerNodes.length}
          />
        ))}

        <CenterNode />
      </svg>
    </div>
  );
}
