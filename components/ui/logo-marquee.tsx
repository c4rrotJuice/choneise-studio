import styles from "./logo-marquee.module.css"

const logos = [
  "Atlas Labs",
  "Northframe",
  "Ether Studio",
  "Horizon Systems",
  "Flux Digital",
  "Quiet Works",
  "Cinder",
  "Meridian",
]

export function LogoMarquee() {
  return (
    <section className={styles.marquee} aria-label="Trusted by independent teams and studios">
      <div className={styles.track}>
        <LogoSet />
        <LogoSet ariaHidden />
      </div>
    </section>
  )
}

function LogoSet({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className={styles.logoSet} aria-hidden={ariaHidden}>
      {logos.map((logo) => (
        <span className={styles.logo} key={logo}>
          {logo}
        </span>
      ))}
    </div>
  )
}
