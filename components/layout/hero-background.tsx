import styles from "./hero-background.module.css"

export function HeroBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.radialGlow} />
      <svg className={styles.scene} viewBox="0 0 900 680" role="presentation" focusable="false">
        <defs>
          <radialGradient id="hero-sphere" cx="31%" cy="31%" r="73%">
            <stop offset="0%" stopColor="#aaa69a" stopOpacity="0.34" />
            <stop offset="34%" stopColor="#4c5052" stopOpacity="0.28" />
            <stop offset="66%" stopColor="#181b20" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#080a0d" stopOpacity="0.96" />
          </radialGradient>
          <radialGradient id="hero-small-sphere" cx="33%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#d8d2c3" stopOpacity="0.58" />
            <stop offset="46%" stopColor="#52575b" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#0b0d10" stopOpacity="0.94" />
          </radialGradient>
          <linearGradient id="hero-orbit" x1="90" x2="810" y1="410" y2="220">
            <stop offset="0%" stopColor="#aaa69a" stopOpacity="0" />
            <stop offset="24%" stopColor="#aaa69a" stopOpacity="0.32" />
            <stop offset="72%" stopColor="#aaa69a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#aaa69a" stopOpacity="0" />
          </linearGradient>
          <filter id="hero-soften" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.45" />
          </filter>
        </defs>

        <g className={styles.stars}>
          <circle className={styles.starOne} cx="268" cy="148" r="2.3" />
          <circle className={styles.starTwo} cx="594" cy="212" r="1.8" />
          <circle className={styles.starThree} cx="715" cy="166" r="1.4" />
          <circle className={styles.starFour} cx="824" cy="302" r="1.1" />
          <circle className={styles.starFive} cx="394" cy="486" r="1.3" />
        </g>

        <g className={styles.orbitLayer}>
          <ellipse
            className={styles.orbit}
            cx="512"
            cy="337"
            rx="360"
            ry="82"
            transform="rotate(-18 512 337)"
            fill="none"
            stroke="url(#hero-orbit)"
            strokeWidth="1.5"
          />
        </g>

        <circle className={styles.smallSphere} cx="289" cy="389" r="22" fill="url(#hero-small-sphere)" />
        <circle
          className={styles.sphereHalo}
          cx="545"
          cy="334"
          r="174"
          fill="none"
          stroke="#aaa69a"
          strokeOpacity="0.08"
          filter="url(#hero-soften)"
        />
        <circle className={styles.sphere} cx="545" cy="334" r="168" fill="url(#hero-sphere)" />
      </svg>
    </div>
  )
}
