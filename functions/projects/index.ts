import { createAdminClient } from "../_lib/admin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectRow {
  slug: string;
  title: string;
  description: string | null;
  status: string;
  kind: string | null;
  version: string | null;
  summary: string | null;
  hosting_stack: Record<string, unknown> | null;
  tech_stack: unknown[] | null;
}

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

// ---------------------------------------------------------------------------
// Exact studio CSS — values extracted from styles/tokens.css,
// components/site/chrome.module.css, app/content-pages.module.css,
// and components/project/project-card.module.css.
// ---------------------------------------------------------------------------

const STUDIO_CSS = `
:root {
  color-scheme:dark;
  --studio-color-charcoal-950:#0d0f12;
  --studio-color-charcoal-900:#111417;
  --studio-color-stone-300:#aaa69a;
  --studio-color-off-white:#f5f5f3;
  --studio-color-sage-300:#a9b8aa;
  --studio-color-amber-300:#e4c88d;
  --studio-color-bg:var(--studio-color-charcoal-950);
  --studio-color-text:var(--studio-color-off-white);
  --studio-color-text-muted:var(--studio-color-stone-300);
  --studio-color-focus:var(--studio-color-amber-300);
  --studio-space-0:0;
  --studio-space-1:0.25rem;
  --studio-space-2:0.5rem;
  --studio-space-3:0.75rem;
  --studio-space-4:1rem;
  --studio-space-5:1.25rem;
  --studio-space-6:1.5rem;
  --studio-space-8:2rem;
  --studio-space-10:2.5rem;
  --studio-space-12:3rem;
  --studio-space-16:4rem;
  --studio-space-24:6rem;
  --studio-radius-4:0.5rem;
  --studio-radius-pill:999rem;
  --studio-border-width-hairline:1px;
  --studio-border-width-regular:1px;
  --studio-outline-width:1px;
  --studio-outline-offset:0.1875rem;
  --studio-font-sans:"Space Grotesk","Inter","Avenir Next",system-ui,sans-serif;
  --studio-font-weight-regular:400;
  --studio-font-weight-medium:500;
  --studio-font-weight-semibold:600;
  --studio-leading-heading:1.08;
  --studio-tracking-tight:0;
  --studio-tracking-label:0.16em;
  --studio-text-xs:0.75rem;
  --studio-text-sm:0.875rem;
  --studio-text-md:1rem;
  --studio-text-lg:1.125rem;
  --studio-text-xl:1.375rem;
  --studio-text-2xl:1.75rem;
  --studio-text-3xl:2.5rem;
  --studio-text-4xl:3.75rem;
  --studio-text-display:5.5rem;
  --studio-layer-nav:20;
  --studio-container-md:64rem;
  --studio-container-readable:42rem;
  --studio-duration-fast:160ms;
  --studio-ease-standard:cubic-bezier(0.2,0,0,1);
  --studio-ease-enter:cubic-bezier(0.16,1,0.3,1);
  --studio-container-page:min(100% - 3rem,90rem);
  --studio-leading-tight:0.96;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{
  background:var(--studio-color-bg);
  color:var(--studio-color-text);
  font-family:var(--studio-font-sans);
  font-size:var(--studio-text-md);
  line-height:1.55;
  min-height:100vh
}
a{color:inherit;text-decoration:none}

/* ═══════════════════════════════════════════════════════════════════════════
   NAV (exact match: components/site/chrome.module.css + tokens.css)
   ═══════════════════════════════════════════════════════════════════════════ */
.siteNav{
  align-items:center;
  display:grid;
  gap:var(--studio-space-4);
  grid-template-columns:auto 1fr auto;
  min-height:5.5rem;
  position:relative;
  z-index:var(--studio-layer-nav);
  max-width:var(--studio-container-page);
  margin:0 auto;
  padding-inline:var(--studio-space-6)
}
.siteLogo{
  color:var(--studio-color-text-muted);
  display:inline-flex;
  font-family:var(--studio-font-sans);
  font-size:var(--studio-text-xl);
  font-weight:var(--studio-font-weight-regular);
  letter-spacing:var(--studio-tracking-tight);
  line-height:var(--studio-leading-heading);
  text-decoration:none
}
.siteLogo:focus-visible{
  outline:var(--studio-outline-width) solid var(--studio-color-focus);
  outline-offset:var(--studio-outline-offset)
}
.navLinks{
  align-items:center;
  display:flex;
  gap:clamp(var(--studio-space-5),3vw,var(--studio-space-10));
  justify-content:center
}
.navLink{
  color:rgba(170,166,154,0.86);
  font-size:var(--studio-text-sm);
  line-height:var(--studio-leading-heading);
  position:relative;
  text-decoration:none;
  transition:color var(--studio-duration-fast) var(--studio-ease-standard)
}
.navLink:hover,.navLink:focus-visible,.navLinkActive{color:var(--studio-color-text)}
.navLink:focus-visible{
  outline:var(--studio-outline-width) solid var(--studio-color-focus);
  outline-offset:var(--studio-outline-offset)
}
.navLinkActive::after{
  background:var(--studio-color-stone-300);
  border-radius:var(--studio-radius-pill);
  height:0.25rem;width:0.25rem;
  content:"";
  position:absolute;
  top:calc(100% + var(--studio-space-2));
  left:50%;
  transform:translateX(-50%)
}
.navCta{
  background:rgba(245,245,243,0.14);
  border:var(--studio-border-width-regular) solid rgba(245,245,243,0.13);
  border-radius:var(--studio-radius-pill);
  color:var(--studio-color-text);
  display:inline-flex;
  align-items:center;
  font-size:var(--studio-text-sm);
  font-weight:var(--studio-font-weight-medium);
  line-height:var(--studio-leading-heading);
  padding:var(--studio-space-2) var(--studio-space-5);
  text-decoration:none;
  transition:background var(--studio-duration-fast) var(--studio-ease-standard)
}
.navCta:hover{background:rgba(245,245,243,0.22)}
.navCta::after{content:"↗";font-size:1.05em;line-height:1;margin-left:var(--studio-space-3)}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL + HERO (exact match: app/content-pages.module.css)
   ═══════════════════════════════════════════════════════════════════════════ */
.pageShell{
  background:
    linear-gradient(115deg,rgba(13,15,18,0.98) 0%,rgba(13,15,18,0.86) 52%,rgba(13,15,18,0.94) 100%),
    radial-gradient(circle at 78% 20%,rgba(125,139,124,0.12),transparent 24rem),
    radial-gradient(circle at 48% 40%,rgba(34,48,64,0.2),transparent 30rem);
  border-bottom:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
  position:relative
}
.pageContainer{margin:0 auto;max-width:var(--studio-container-md);padding-inline:var(--studio-space-6)}
.pageHero{
  animation:page-rise 680ms var(--studio-ease-enter) both;
  display:grid;gap:var(--studio-space-8);
  max-width:var(--studio-container-md);
  padding-block:clamp(var(--studio-space-16),9vw,var(--studio-space-24))
}
.pageKicker{
  align-items:center;
  border:var(--studio-border-width-regular) solid rgba(245,245,243,0.14);
  border-radius:var(--studio-radius-pill);
  color:rgba(170,166,154,0.84);
  display:inline-flex;
  font-size:var(--studio-text-xs);
  font-weight:var(--studio-font-weight-semibold);
  gap:var(--studio-space-3);
  letter-spacing:var(--studio-tracking-label);
  line-height:var(--studio-leading-heading);
  padding:var(--studio-space-2) var(--studio-space-4);
  text-transform:uppercase;
  width:fit-content
}
.pageKicker::before{
  background:radial-gradient(circle,var(--studio-color-amber-300) 0 30%,rgba(228,200,141,0.12) 34% 100%);
  border-radius:var(--studio-radius-pill);
  content:"";display:block;
  height:0.45rem;width:0.45rem
}
.pageTitle{
  color:rgba(245,245,243,0.9);
  font-size:clamp(var(--studio-text-3xl),6vw,var(--studio-text-display));
  font-weight:var(--studio-font-weight-regular);
  letter-spacing:0;line-height:var(--studio-leading-tight);
  max-width:13ch
}
.pageCopy{
  color:rgba(170,166,154,0.82);
  font-size:clamp(var(--studio-text-md),1.4vw,var(--studio-text-lg));
  line-height:1.7;
  max-width:var(--studio-container-readable)
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION (exact match: app/content-pages.module.css)
   ═══════════════════════════════════════════════════════════════════════════ */
.pageSection{
  animation:page-rise 680ms var(--studio-ease-enter) both;
  border-top:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
  content-visibility:auto;contain-intrinsic-size:auto 36rem;
  padding-block:clamp(var(--studio-space-12),8vw,var(--studio-space-24))
}
.pageSection:first-child{border-top:0}
.pageSectionHeader{
  display:grid;gap:var(--studio-space-4);
  margin-bottom:var(--studio-space-8);
  max-width:var(--studio-container-readable)
}
.pageSectionTitle{
  color:rgba(245,245,243,0.88);
  font-size:clamp(var(--studio-text-2xl),4vw,var(--studio-text-4xl));
  font-weight:var(--studio-font-weight-regular);
  letter-spacing:0;line-height:1.04
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT GRID (exact match: app/content-pages.module.css)
   ═══════════════════════════════════════════════════════════════════════════ */
.pageProjectGrid{
  display:grid;gap:var(--studio-space-6);
  grid-template-columns:repeat(2,minmax(0,1fr))
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECT CARD (exact match: components/project/project-card.module.css)
   ═══════════════════════════════════════════════════════════════════════════ */
.projectCard{
  background:
    linear-gradient(145deg,rgba(245,245,243,0.07),rgba(245,245,243,0.025)),
    rgba(20,23,27,0.58);
  border:var(--studio-border-width-regular) solid rgba(245,245,243,0.11);
  border-radius:var(--studio-radius-4);
  box-shadow:0 1.5rem 4rem rgba(0,0,0,0);
  color:var(--studio-color-text);
  display:grid;gap:var(--studio-space-6);
  min-height:13rem;
  padding:var(--studio-space-6);
  text-decoration:none;
  transition:
    background-color var(--studio-duration-fast) var(--studio-ease-standard),
    border-color var(--studio-duration-fast) var(--studio-ease-standard),
    box-shadow var(--studio-duration-fast) var(--studio-ease-standard),
    transform var(--studio-duration-fast) var(--studio-ease-standard)
}
.projectCard:hover{
  border-color:rgba(245,245,243,0.2);
  box-shadow:0 1.5rem 4rem rgba(0,0,0,0.22);
  transform:translate3d(0,-0.25rem,0)
}
.projectCard:focus-visible{
  outline:var(--studio-outline-width) solid var(--studio-color-focus);
  outline-offset:var(--studio-outline-offset)
}

.cardTop,.cardMeta{align-items:center;display:flex;justify-content:space-between}
.cardStatus{
  align-items:center;color:rgba(245,245,243,0.7);
  display:inline-flex;font-size:var(--studio-text-xs);
  font-weight:var(--studio-font-weight-semibold);
  gap:var(--studio-space-3);
  letter-spacing:var(--studio-tracking-label);
  line-height:var(--studio-leading-heading);
  text-transform:uppercase
}
.cardStatusDot{
  background:rgba(170,166,154,0.78);
  border-radius:var(--studio-radius-pill);
  height:0.45rem;width:0.45rem;
  box-shadow:0 0 1rem currentColor
}
.cardStatusDot.statusLive{background:var(--studio-color-sage-300);color:var(--studio-color-sage-300)}
.cardStatusDot.statusBuilding{background:var(--studio-color-amber-300);color:var(--studio-color-amber-300)}
.cardStatusDot.statusExperiment{background:#a6c7e7;color:#a6c7e7}
.cardStatusDot.statusDormant{background:rgba(170,166,154,0.66);color:rgba(170,166,154,0.66)}

.cardArrow{
  color:rgba(170,166,154,0.68);font-size:var(--studio-text-lg);
  line-height:1;
  transition:transform var(--studio-duration-fast) var(--studio-ease-standard)
}
.projectCard:hover .cardArrow{transform:translate3d(0.125rem,-0.125rem,0)}

.cardBody{align-self:start;display:grid;gap:var(--studio-space-3)}
.cardTitle{
  color:rgba(245,245,243,0.88);
  font-size:var(--studio-text-xl);
  font-weight:var(--studio-font-weight-regular);
  line-height:var(--studio-leading-heading)
}
.cardDesc{color:rgba(170,166,154,0.78);font-size:var(--studio-text-sm);line-height:1.65}

/* Hosting stack */
.cardHosting{color:rgba(170,166,154,0.7);display:grid;font-size:var(--studio-text-xs);gap:var(--studio-space-2);line-height:1.5}
.cardHostingItem{display:grid;grid-template-columns:auto 1fr;gap:var(--studio-space-2);align-items:baseline}
.cardHostingKey{color:rgba(170,166,154,0.55);font-weight:var(--studio-font-weight-medium);white-space:nowrap}
.cardHostingKey::after{content:":"}
.cardHostingValue{color:rgba(245,245,243,0.62);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* Deployed URL */
.cardUrl{color:rgba(170,166,154,0.66);font-size:var(--studio-text-xs);line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* Tech stack */
.cardTech{display:flex;flex-wrap:wrap;gap:var(--studio-space-2)}
.cardTechBadge{
  background:rgba(245,245,243,0.06);
  border:var(--studio-border-width-hairline) solid rgba(245,245,243,0.1);
  border-radius:var(--studio-radius-pill);
  color:rgba(170,166,154,0.72);
  font-size:var(--studio-text-xs);line-height:1;
  padding:var(--studio-space-1) var(--studio-space-3);
  white-space:nowrap
}

/* Card footer meta */
.cardMeta{align-self:end;color:rgba(170,166,154,0.68);font-size:var(--studio-text-sm);line-height:var(--studio-leading-heading)}
.cardVersion{
  border:var(--studio-border-width-hairline) solid rgba(245,245,243,0.11);
  border-radius:var(--studio-radius-pill);
  color:rgba(245,245,243,0.58);
  font-size:var(--studio-text-xs);
  padding:var(--studio-space-1) var(--studio-space-3)
}

/* ═══════════════════════════════════════════════════════════════════════════
   EMPTY STATE (exact match: app/content-pages.module.css)
   ═══════════════════════════════════════════════════════════════════════════ */
.pageEmpty{
  background:
    linear-gradient(145deg,rgba(245,245,243,0.04),rgba(245,245,243,0.015)),
    rgba(20,23,27,0.4);
  border:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
  border-radius:var(--studio-radius-4);
  display:grid;gap:var(--studio-space-4);
  padding:var(--studio-space-12) var(--studio-space-8);
  place-items:center;text-align:center
}
.pageEmptyTitle{color:rgba(245,245,243,0.62);font-size:var(--studio-text-lg);font-weight:var(--studio-font-weight-regular);line-height:var(--studio-leading-heading)}
.pageEmptyCopy{color:rgba(170,166,154,0.64);font-size:var(--studio-text-sm);line-height:1.7;max-width:28rem}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER (exact match: components/site/chrome.module.css)
   ═══════════════════════════════════════════════════════════════════════════ */
.siteFooter{
  border-top:var(--studio-border-width-hairline) solid rgba(245,245,243,0.09);
  content-visibility:auto;contain-intrinsic-size:auto 20rem;
  padding-block:var(--studio-space-12) var(--studio-space-8)
}
.footerGrid{
  display:grid;
  gap:clamp(var(--studio-space-12),10vw,var(--studio-space-24));
  grid-template-columns:minmax(13rem,0.7fr) minmax(0,1fr);
  max-width:var(--studio-container-page);
  margin:0 auto;
  padding-inline:var(--studio-space-6)
}
.footerManifesto{align-content:start;display:grid;gap:var(--studio-space-6)}
.footerManifesto p{
  color:rgba(170,166,154,0.74);
  font-size:var(--studio-text-sm);line-height:1.6;margin:0
}
.footerColumns{
  display:grid;gap:var(--studio-space-8);
  grid-template-columns:repeat(5,minmax(0,1fr))
}
.footerColumn{min-width:0}
.footerHeading{
  color:rgba(245,245,243,0.82);
  font-size:var(--studio-text-xs);
  font-weight:var(--studio-font-weight-semibold);
  letter-spacing:var(--studio-tracking-label);
  line-height:var(--studio-leading-heading);
  margin:0 0 var(--studio-space-4);
  text-transform:uppercase
}
.footerLinks{display:grid;gap:var(--studio-space-3);list-style:none;margin:0;padding:0}
.footerLinks a{
  color:rgba(170,166,154,0.78);
  font-size:var(--studio-text-sm);
  line-height:var(--studio-leading-heading);
  text-decoration:none;
  transition:color var(--studio-duration-fast) var(--studio-ease-standard)
}
.footerLinks a:hover{color:var(--studio-color-text)}
.footerLinks a:focus-visible{
  outline:var(--studio-outline-width) solid var(--studio-color-focus);
  outline-offset:var(--studio-outline-offset)
}
.footerBottom{
  align-items:center;
  border-top:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
  display:flex;gap:var(--studio-space-6);
  justify-content:space-between;
  margin-top:var(--studio-space-12);
  padding-top:var(--studio-space-8);
  max-width:var(--studio-container-page);
  margin-inline:auto;
  padding-inline:var(--studio-space-6)
}
.footerBottom p{color:rgba(170,166,154,0.74);font-size:var(--studio-text-sm);line-height:1.6;margin:0}
.socialLinks{display:flex;flex-wrap:wrap;gap:var(--studio-space-8)}
.socialLinks a{
  color:rgba(170,166,154,0.78);
  font-size:var(--studio-text-sm);
  line-height:var(--studio-leading-heading);
  text-decoration:none;
  transition:color var(--studio-duration-fast) var(--studio-ease-standard)
}
.socialLinks a:hover{color:var(--studio-color-text)}
.socialLinks a:focus-visible{
  outline:var(--studio-outline-width) solid var(--studio-color-focus);
  outline-offset:var(--studio-outline-offset)
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATIONS + RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════ */
@keyframes page-rise{from{opacity:0;transform:translate3d(0,0.75rem,0)}to{opacity:1;transform:translate3d(0,0,0)}}

@media(max-width:58rem){
  .siteNav{align-items:start;grid-template-columns:1fr;min-height:auto;padding-block:var(--studio-space-5)}
  .navCta{display:none}
  .navLinks{gap:var(--studio-space-5);justify-content:start;overflow-x:auto;padding-block:var(--studio-space-2);scrollbar-width:none}
  .navLinks::-webkit-scrollbar{display:none}
  .pageProjectGrid{grid-template-columns:1fr}
  .pageHero{padding-block:var(--studio-space-12) var(--studio-space-16)}
  .footerGrid{grid-template-columns:1fr}
  .footerColumns{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(max-width:34rem){
  .siteNav{padding-block:var(--studio-space-4)}
  .navLinks{gap:var(--studio-space-4)}
  .pageTitle{font-size:clamp(2.55rem,13vw,3.2rem)}
  .pageSection{contain-intrinsic-size:auto 44rem;padding-block:var(--studio-space-12)}
  .projectCard{padding:var(--studio-space-5);min-height:12rem}
  .cardTitle{font-size:var(--studio-text-lg)}
  .footerColumns{grid-template-columns:repeat(2,minmax(0,1fr))}
  .footerBottom{align-items:start;display:grid}
}
@media(prefers-reduced-motion:reduce){
  .pageHero,.pageSection{animation:none}
}
`;

// ---------------------------------------------------------------------------
// Shared nav HTML
// ---------------------------------------------------------------------------

const SITE_NAV = (active: string) => `
<nav class="siteNav" aria-label="Primary">
  <a class="siteLogo" href="/">choneise</a>
  <div class="navLinks">
    <a class="navLink${active === "/" ? " navLinkActive" : ""}" href="/">Studio</a>
    <a class="navLink${active === "/projects" ? " navLinkActive" : ""}" href="/projects">Projects</a>
    <a class="navLink${active === "/experiments" ? " navLinkActive" : ""}" href="/experiments">Experiments</a>
    <a class="navLink${active === "/about" ? " navLinkActive" : ""}" href="/about">About</a>
  </div>
  <a class="navCta" href="/login">Enter Studio</a>
</nav>`;

// ---------------------------------------------------------------------------
// Shared footer HTML
// ---------------------------------------------------------------------------

const SITE_FOOTER = `
<footer class="siteFooter">
  <div class="footerGrid">
    <div class="footerManifesto">
      <a class="siteLogo" href="/">choneise</a>
      <p>Building useful things on the web.</p>
    </div>
    <nav class="footerColumns" aria-label="Footer">
      <div class="footerColumn">
        <h2 class="footerHeading">Studio</h2>
        <ul class="footerLinks">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </div>
      <div class="footerColumn">
        <h2 class="footerHeading">Projects</h2>
        <ul class="footerLinks">
          <li><a href="/projects">Featured Work</a></li>
          <li><a href="/#current-builds">Current Builds</a></li>
        </ul>
      </div>
      <div class="footerColumn">
        <h2 class="footerHeading">Tools</h2>
        <ul class="footerLinks">
          <li><a href="/projects/grade-converter">Grade Converter</a></li>
          <li><a href="/projects/fee-calculator">Fee Calculator</a></li>
        </ul>
      </div>
      <div class="footerColumn">
        <h2 class="footerHeading">Experiments</h2>
        <ul class="footerLinks">
          <li><a href="/experiments#multilingual-explorer">Explorer</a></li>
          <li><a href="/experiments#quiet-journal">Journal</a></li>
        </ul>
      </div>
      <div class="footerColumn">
        <h2 class="footerHeading">Notes</h2>
        <ul class="footerLinks">
          <li><a href="/about#philosophy">Philosophy</a></li>
          <li><a href="/#current-builds">Updates</a></li>
        </ul>
      </div>
    </nav>
  </div>
  <div class="footerBottom">
    <p>&copy; ${new Date().getFullYear()} Choneise Studio</p>
    <div class="socialLinks">
      <a href="/projects">Projects</a>
      <a href="/experiments">Experiments</a>
      <a href="mailto:hello@choneise.com">Email</a>
    </div>
  </div>
</footer>`;

// ---------------------------------------------------------------------------
// Page renderer
// ---------------------------------------------------------------------------

function pageHtml(projects: ProjectRow[]): string {
  const statusMap: Record<string, string> = {
    published: "Live",
    Live: "Live",
    Building: "Building",
    Experiment: "Experiment",
    Dormant: "Dormant",
  };

  const cards =
    projects.length === 0
      ? `<div class="pageEmpty">
           <p class="pageEmptyTitle">No published projects yet</p>
           <p class="pageEmptyCopy">Check back soon — the studio is currently preparing its first public releases.</p>
         </div>`
      : `<div class="pageProjectGrid">
           ${projects
             .map((p) => {
               const hostingEntries: Array<[string, string]> =
                 p.hosting_stack &&
                 typeof p.hosting_stack === "object" &&
                 !Array.isArray(p.hosting_stack)
                   ? Object.entries(p.hosting_stack)
                       .filter(
                         ([, v]) =>
                           typeof v === "string" || typeof v === "number",
                       )
                       .map(([k, v]) => [k, String(v)])
                   : [];

               const techItems: string[] = Array.isArray(p.tech_stack)
                 ? p.tech_stack
                     .map((item) =>
                       typeof item === "string" ? item : String(item),
                     )
                     .filter((v, i, a) => a.indexOf(v) === i)
                 : [];

               let deployed = "";
               if (
                 p.hosting_stack &&
                 typeof p.hosting_stack === "object" &&
                 !Array.isArray(p.hosting_stack)
               ) {
                 const urlKeys = [
                   "URL",
                   "url",
                   "Deployed URL",
                   "deployed_url",
                   "Domain",
                   "domain",
                 ];
                 for (const key of urlKeys) {
                   const val = (p.hosting_stack as Record<string, unknown>)[
                     key
                   ];
                   if (typeof val === "string" && val.startsWith("http")) {
                     deployed = val;
                     break;
                   }
                 }
               }

               const hostingHtml =
                 hostingEntries.length > 0
                   ? `<span class="cardHosting">${hostingEntries
                       .map(
                         ([key, value]) =>
                           `<span class="cardHostingItem"><span class="cardHostingKey">${key}</span><span class="cardHostingValue">${value}</span></span>`,
                       )
                       .join("")}</span>`
                   : "";

               const urlHtml = deployed
                 ? `<span class="cardUrl">${deployed}</span>`
                 : "";

               const techHtml =
                 techItems.length > 0
                   ? `<span class="cardTech">${techItems
                       .map((t) => `<span class="cardTechBadge">${t}</span>`)
                       .join("")}</span>`
                   : "";

               const displayStatus = statusMap[p.status] ?? "Live";
               const dotClass = {
                 Live: "statusLive",
                 Building: "statusBuilding",
                 Experiment: "statusExperiment",
                 Dormant: "statusDormant",
               }[displayStatus];

               return `<a class="projectCard" href="/projects/${p.slug}">
                 <span class="cardTop">
                   <span class="cardStatus">
                     <span class="cardStatusDot ${dotClass}"></span>${displayStatus}
                   </span>
                   <span class="cardArrow">↗</span>
                 </span>
                 <span class="cardBody">
                   <span class="cardTitle">${p.title}</span>
                   <span class="cardDesc">${p.description ?? ""}</span>
                   ${hostingHtml}${urlHtml}${techHtml}
                 </span>
                 <span class="cardMeta">
                   <span>${p.kind ?? "Project"}</span>
                   <span class="cardVersion">${p.version ?? ""}</span>
                 </span>
               </a>`;
             })
             .join("")}
         </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Projects | Choneise Studio</title>
<meta name="description" content="Public tools and product systems by Choneise Studio.">
<meta property="og:title" content="Projects | Choneise Studio">
<meta property="og:description" content="Public tools and product systems by Choneise Studio.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://choneise.com/projects">
<meta property="og:image" content="https://choneise.com/og.png">
<link rel="canonical" href="https://choneise.com/projects">
<style>${STUDIO_CSS}</style>
</head>
<body>
${SITE_NAV("/projects")}
<main>
  <div class="pageShell">
    <div class="pageContainer">
      <header class="pageHero">
        <p class="pageKicker">Projects</p>
        <h1 class="pageTitle">Tools that solve small, real jobs.</h1>
        <p class="pageCopy">
          Choneise builds practical web products with a bias toward clarity,
          release quality, and long-term ownership. This is the public map of
          what exists and what is underway.
        </p>
      </header>
    </div>
  </div>
  <div class="pageContainer">
    <section class="pageSection">
      <div class="pageSectionHeader">
        <p class="pageKicker">Published</p>
        <h2 class="pageSectionTitle">Public tools and product experiments</h2>
      </div>
      ${cards}
    </section>
  </div>
</main>
${SITE_FOOTER}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { env } = context;

  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.NEXT_PUBLIC_SUPABASE_URL) {
    return new Response(pageHtml([]), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const admin = createAdminClient(env);
    const { data, error } = await admin
      .from("projects")
      .select(
        "slug, title, description, status, kind, version, summary, hosting_stack, tech_stack",
      )
      .eq("public", true)
      .order("created_at", { ascending: false });

    if (error)
      return new Response(pageHtml([]), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });

    return new Response(pageHtml((data ?? []) as ProjectRow[]), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return new Response(pageHtml([]), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
