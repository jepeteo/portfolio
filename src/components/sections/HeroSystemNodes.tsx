import React from "react"

const nodes = [
  { label: "WordPress", x: "12%", y: "18%" },
  { label: "WooCommerce", x: "78%", y: "14%" },
  { label: "React", x: "88%", y: "42%" },
  { label: "DNS", x: "6%", y: "48%" },
  { label: "Email", x: "22%", y: "72%" },
  { label: "SEO", x: "68%", y: "68%" },
  { label: "Hosting", x: "42%", y: "8%" },
  { label: "Performance", x: "52%", y: "82%" },
]

const HeroSystemNodes: React.FC = () => (
  <div
    className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
    aria-hidden="true"
  >
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.06] dark:opacity-[0.08]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="hero-grid"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.15"
            className="text-[var(--v2-text)]"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#hero-grid)" />
      {nodes.map((node) => (
        <line
          key={`line-${node.label}`}
          x1="50"
          y1="50"
          x2={node.x.replace("%", "")}
          y2={node.y.replace("%", "")}
          stroke="currentColor"
          strokeWidth="0.2"
          className="text-[var(--v2-brand)]"
          opacity={0.5}
        />
      ))}
      <circle cx="50" cy="50" r="1.2" className="fill-[var(--v2-acid)]" />
      {nodes.map((node) => (
        <circle
          key={`dot-${node.label}`}
          cx={node.x.replace("%", "")}
          cy={node.y.replace("%", "")}
          r="0.8"
          className="fill-[var(--v2-brand)]"
        />
      ))}
    </svg>

    {nodes.map((node) => (
      <span
        key={node.label}
        className="absolute font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--v2-soft)] opacity-40"
        style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
      >
        {node.label}
      </span>
    ))}
  </div>
)

export default HeroSystemNodes
