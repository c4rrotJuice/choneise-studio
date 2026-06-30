import { createAdminClient } from "../_lib/admin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectRow {
  slug: string;
  title: string;
  description: string | null;
  summary: string | null;
  body: string | null;
  status: string;
  kind: string | null;
  version: string | null;
  hosting_stack: Record<string, unknown> | null;
  tech_stack: unknown[] | null;
  updates_future_plans: string | null;
}

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

// ---------------------------------------------------------------------------
// Exact studio CSS — values from styles/tokens.css,
// components/site/chrome.module.css, app/content-pages.module.css
// ---------------------------------------------------------------------------

const STUDIO_CSS = `
:root {
  color-scheme:dark;
  --studio-color-charcoal-950:#0d0f12;
  --studio-color-stone-300:#aaa69a;
  --studio-color-off-white:#f5f5f3;
  --studio-color-amber-300:#e4c88d;
  --studio-color-bg:var(--studio-color-charcoal-950);
  --studio-color-text:var(--studio-color-off-white);
  --studio-color-text-muted:var(--studio-color-stone-300);
  --studio-color-focus:var(--studio-color-amber-300);
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
  --studio-leading-tight:0.96;
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
  --studio-container-page:min(100% - 3rem,90rem);
  --studio-duration-fast:160ms;
  --studio-ease-standard:cubic-bezier(0.2,0,0,1);
  --studio-ease-enter:cubic-bezier(0.16,1,0.3,1);
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

/* ── Nav (exact match: components/site/chrome.module.css) ── */
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

/* ── Shell + Hero (exact match: app/content-pages.module.css) ── */
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

/* ── Section (exact match: app/content-pages.module.css) ── */
.pageSection{
  animation:page-rise 680ms var(--studio-ease-enter) both;
  border-top:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
  content-visibility:auto;contain-intrinsic-size:auto 36rem;
  padding-block:clamp(var(--studio-space-12),8vw,var(--studio-space-24))
}
.pageSection:first-child{border-top:0}
.pageSectionTitle{
  color:rgba(245,245,243,0.88);
  font-size:clamp(var(--studio-text-2xl),4vw,var(--studio-text-4xl));
  font-weight:var(--studio-font-weight-regular);
  letter-spacing:0;line-height:1.04
}

/* ── Split layout (exact match: app/content-pages.module.css) ── */
.pageSplit{
  display:grid;
  gap:clamp(var(--studio-space-8),7vw,var(--studio-space-16));
  grid-template-columns:minmax(0,0.8fr) minmax(18rem,1fr)
}

/* ── Meta label (exact match: app/content-pages.module.css .meta) ── */
.pageMetaLabel{
  color:var(--studio-color-amber-300);
  font-size:var(--studio-text-xs);
  font-weight:var(--studio-font-weight-semibold);
  letter-spacing:var(--studio-tracking-label);
  line-height:var(--studio-leading-heading);
  text-transform:uppercase;
  margin-bottom:var(--studio-space-3)
}
.pageMetaValue{
  color:rgba(245,245,243,0.88);
  font-size:var(--studio-text-xl);
  font-weight:var(--studio-font-weight-regular);
  line-height:var(--studio-leading-heading)
}

/* ── List (exact match: app/content-pages.module.css .list) ── */
.pageList{
  color:rgba(170,166,154,0.8);
  font-size:var(--studio-text-sm);
  line-height:1.68;
  display:grid;gap:var(--studio-space-3);
  padding-left:var(--studio-space-5)
}
.pageList a{color:rgba(245,245,243,0.72)}
.pageList a:hover{text-decoration:underline}

/* Helpers */
.pageAsideBlock{margin-bottom:var(--studio-space-6)}
.pageSpacer{margin-top:var(--studio-space-4)}
.pageSpacerLg{margin-top:var(--studio-space-8)}
.pagePreWrap{white-space:pre-wrap}
.pageBack{color:rgba(245,245,243,0.72);font-size:var(--studio-text-sm)}
.pageBack:hover{text-decoration:underline}

/* ── Footer (exact match: components/site/chrome.module.css) ── */
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

/* Animations + Responsive */
@keyframes page-rise{from{opacity:0;transform:translate3d(0,0.75rem,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@media(max-width:58rem){
  .siteNav{align-items:start;grid-template-columns:1fr;min-height:auto;padding-block:var(--studio-space-5)}
  .navCta{display:none}
  .navLinks{gap:var(--studio-space-5);justify-content:start;overflow-x:auto;padding-block:var(--studio-space-2);scrollbar-width:none}
  .navLinks::-webkit-scrollbar{display:none}
  .pageSplit{grid-template-columns:1fr}
  .pageHero{padding-block:var(--studio-space-12) var(--studio-space-16)}
  .footerGrid{grid-template-columns:1fr}
  .footerColumns{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(max-width:34rem){
  .siteNav{padding-block:var(--studio-space-4)}
  .navLinks{gap:var(--studio-space-4)}
  .pageTitle{font-size:clamp(2.55rem,13vw,3.2rem)}
  .pageSection{contain-intrinsic-size:auto 44rem;padding-block:var(--studio-space-12)}
  .footerColumns{grid-template-columns:repeat(2,minmax(0,1fr))}
  .footerBottom{align-items:start;display:grid}
}
@media(prefers-reduced-motion:reduce){
  .pageHero,.pageSection{animation:none}
}
`;

// ---------------------------------------------------------------------------
// Shared components
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
        <ul class="footerLinks"><li><a href="/">Home</a></li><li><a href="/about">About</a></li></ul>
      </div>
      <div class="footerColumn">
        <h2 class="footerHeading">Projects</h2>
        <ul class="footerLinks"><li><a href="/projects">Featured Work</a></li><li><a href="/#current-builds">Current Builds</a></li></ul>
      </div>
      <div class="footerColumn">
        <h2 class="footerHeading">Tools</h2>
        <ul class="footerLinks"><li><a href="/projects/grade-converter">Grade Converter</a></li><li><a href="/projects/fee-calculator">Fee Calculator</a></li></ul>
      </div>
      <div class="footerColumn">
        <h2 class="footerHeading">Experiments</h2>
        <ul class="footerLinks"><li><a href="/experiments#multilingual-explorer">Explorer</a></li><li><a href="/experiments#quiet-journal">Journal</a></li></ul>
      </div>
      <div class="footerColumn">
        <h2 class="footerHeading">Notes</h2>
        <ul class="footerLinks"><li><a href="/about#philosophy">Philosophy</a></li><li><a href="/#current-builds">Updates</a></li></ul>
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
// Detail page
// ---------------------------------------------------------------------------

function detailHtml(project: ProjectRow): string {
  const statusLabel: Record<string, string> = {
    published: "Published",
    Live: "Live",
    Building: "Building",
    Experiment: "Experiment",
    Dormant: "Dormant",
    draft: "Draft",
    archived: "Archived",
  };

  const kindLabel = project.kind ? ` \u00b7 ${project.kind}` : "";

  const hostingEntries: Array<[string, string]> =
    project.hosting_stack &&
    typeof project.hosting_stack === "object" &&
    !Array.isArray(project.hosting_stack)
      ? Object.entries(project.hosting_stack)
          .filter(([, v]) => typeof v === "string" || typeof v === "number")
          .map(([k, v]) => [k, String(v)])
      : [];

  const techItems: string[] = Array.isArray(project.tech_stack)
    ? project.tech_stack
        .map((item) => (typeof item === "string" ? item : String(item)))
        .filter((v, i, a) => a.indexOf(v) === i)
    : [];

  const asideHtml = [
    project.version
      ? `<div class="pageAsideBlock"><p class="pageMetaLabel">Version</p><p class="pageMetaValue">${project.version}</p></div>`
      : "",
    hostingEntries.length > 0
      ? `<div class="pageAsideBlock"><p class="pageMetaLabel">Hosting</p><ul class="pageList">${hostingEntries
          .map(
            ([key, value]) =>
              `<li><span style="color:rgba(170,166,154,0.6)">${key}: </span>${
                value.startsWith("http")
                  ? `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`
                  : `<span style="color:rgba(245,245,243,0.72)">${value}</span>`
              }</li>`,
          )
          .join("")}</ul></div>`
      : "",
    techItems.length > 0
      ? `<div class="pageAsideBlock"><p class="pageMetaLabel">Tech Stack</p><ul class="pageList">${techItems
          .map((item) => `<li>${item}</li>`)
          .join("")}</ul></div>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const description = project.description ?? project.summary ?? "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${project.title} | Choneise Studio</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${project.title} | Choneise Studio">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://choneise.com/projects/${project.slug}">
<meta property="og:image" content="https://choneise.com/og.png">
<link rel="canonical" href="https://choneise.com/projects/${project.slug}">
<style>${STUDIO_CSS}</style>
</head>
<body>
${SITE_NAV("/projects")}
<main>
  <div class="pageShell">
    <div class="pageContainer">
      <header class="pageHero">
        <p class="pageKicker">${statusLabel[project.status] ?? project.status}${kindLabel}</p>
        <h1 class="pageTitle">${project.title}</h1>
        ${project.description ? `<p class="pageCopy">${project.description}</p>` : ""}
      </header>
    </div>
  </div>
  <div class="pageContainer">
    <section class="pageSection">
      <div class="pageSplit">
        <div>
          ${project.summary ? `<h2 class="pageSectionTitle">Summary</h2><p class="pageCopy pageSpacer">${project.summary}</p>` : ""}
          ${project.body ? `<h2 class="pageSectionTitle pageSpacerLg">Details</h2><p class="pageCopy pageSpacer pagePreWrap">${project.body}</p>` : ""}
          ${project.updates_future_plans ? `<h2 class="pageSectionTitle pageSpacerLg">Updates &amp; Future Plans</h2><p class="pageCopy pageSpacer pagePreWrap">${project.updates_future_plans}</p>` : ""}
        </div>
        <aside>${asideHtml}</aside>
      </div>
    </section>
  </div>
</main>
${SITE_FOOTER}
</body>
</html>`;
}

function notFoundHtml(slug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Project Not Found | Choneise Studio</title>
<style>${STUDIO_CSS}</style>
</head>
<body>
${SITE_NAV("/projects")}
<main>
  <div class="pageShell">
    <div class="pageContainer">
      <header class="pageHero">
        <p class="pageKicker">Project</p>
        <h1 class="pageTitle">Not Found</h1>
        <p class="pageCopy">The project you're looking for doesn't exist or hasn't been published yet.</p>
        <p class="pageCopy pageSpacer"><a href="/projects" class="pageBack">← Back to projects</a></p>
      </header>
    </div>
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
  params: { slug: string };
  env: Env;
}): Promise<Response> {
  const { params, env } = context;
  const slug = params.slug;

  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.NEXT_PUBLIC_SUPABASE_URL) {
    return new Response(notFoundHtml(slug), {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const admin = createAdminClient(env);
    const { data, error } = await admin
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("public", true)
      .single();

    if (error || !data) {
      return new Response(notFoundHtml(slug), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response(detailHtml(data as ProjectRow), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return new Response(notFoundHtml(slug), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
