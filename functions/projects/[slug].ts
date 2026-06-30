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
// Shared studio CSS — exact match with content-pages.module.css
// ---------------------------------------------------------------------------

const STUDIO_CSS = `
:root {
  --studio-color-bg: #0d0f12;
  --studio-color-text: rgba(245,245,243,0.88);
  --studio-color-text-muted: rgba(170,166,154,0.78);
  --studio-color-sage-300: #7d8b7c;
  --studio-color-amber-300: #e4c88d;
  --studio-color-focus: rgba(245,245,243,0.4);
  --studio-space-1: 0.25rem;
  --studio-space-2: 0.35rem;
  --studio-space-3: 0.5rem;
  --studio-space-4: 0.75rem;
  --studio-space-5: 1rem;
  --studio-space-6: 1.25rem;
  --studio-space-8: 1.75rem;
  --studio-space-12: 2.75rem;
  --studio-space-16: 4rem;
  --studio-space-24: 6rem;
  --studio-text-xs: 0.7rem;
  --studio-text-sm: 0.82rem;
  --studio-text-md: 0.95rem;
  --studio-text-lg: 1.1rem;
  --studio-text-xl: 1.3rem;
  --studio-text-2xl: 1.65rem;
  --studio-text-3xl: 2rem;
  --studio-text-4xl: 2.65rem;
  --studio-text-display: 3.5rem;
  --studio-font-weight-regular: 400;
  --studio-font-weight-medium: 500;
  --studio-font-weight-semibold: 600;
  --studio-leading-heading: 1.15;
  --studio-tracking-label: 0.08em;
  --studio-radius-4: 0.85rem;
  --studio-radius-pill: 999px;
  --studio-border-width-hairline: 1px;
  --studio-border-width-regular: 1.5px;
  --studio-outline-width: 2px;
  --studio-container-md: 52rem;
  --studio-container-readable: 37rem;
  --studio-duration-fast: 180ms;
  --studio-ease-standard: cubic-bezier(0.4,0,0.2,1);
  --studio-ease-enter: cubic-bezier(0.16,1,0.3,1);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{
  background:var(--studio-color-bg);
  color:var(--studio-color-text);
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  font-size:var(--studio-text-md);
  line-height:1.65;
  min-height:100vh
}
a{color:inherit;text-decoration:none}

/* ── Nav ── */
.pageNav{
  align-items:center;display:flex;gap:var(--studio-space-6);
  padding:var(--studio-space-5) var(--studio-space-6)
}
.pageNav a{
  color:var(--studio-color-text-muted);font-size:var(--studio-text-sm);
  transition:color var(--studio-duration-fast) var(--studio-ease-standard)
}
.pageNav a:hover,.pageNav a.active{color:var(--studio-color-text)}
.pageNav a.active{font-weight:var(--studio-font-weight-semibold)}

/* ── Shell (content-pages.module.css) ── */
.pageShell{
  background:
    linear-gradient(115deg,rgba(13,15,18,0.98) 0%,rgba(13,15,18,0.86) 52%,rgba(13,15,18,0.94) 100%),
    radial-gradient(circle at 78% 20%,rgba(125,139,124,0.12),transparent 24rem),
    radial-gradient(circle at 48% 40%,rgba(34,48,64,0.2),transparent 30rem);
  border-bottom:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
  position:relative
}

/* ── Container ── */
.pageContainer{margin:0 auto;max-width:var(--studio-container-md);padding-inline:var(--studio-space-6)}

/* ── Hero (content-pages.module.css) ── */
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
  letter-spacing:0;line-height:0.98;
  max-width:13ch
}
.pageCopy{
  color:rgba(170,166,154,0.82);
  font-size:clamp(var(--studio-text-md),1.4vw,var(--studio-text-lg));
  line-height:1.7;
  max-width:var(--studio-container-readable)
}

/* ── Section (content-pages.module.css) ── */
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

/* ── Split layout (content-pages.module.css) ── */
.pageSplit{
  display:grid;
  gap:clamp(var(--studio-space-8),7vw,var(--studio-space-16));
  grid-template-columns:minmax(0,0.8fr) minmax(18rem,1fr)
}

/* ── Meta label (content-pages.module.css .meta) ── */
.pageMetaLabel{
  color:var(--studio-color-amber-300);
  font-size:var(--studio-text-xs);
  font-weight:var(--studio-font-weight-semibold);
  letter-spacing:var(--studio-tracking-label);
  line-height:var(--studio-leading-heading);
  text-transform:uppercase;
  margin-bottom:var(--studio-space-3)
}

/* ── Meta value (content-pages.module.css .cardTitle) ── */
.pageMetaValue{
  color:rgba(245,245,243,0.88);
  font-size:var(--studio-text-xl);
  font-weight:var(--studio-font-weight-regular);
  line-height:var(--studio-leading-heading)
}

/* ── List (content-pages.module.css .list) ── */
.pageList{
  color:rgba(170,166,154,0.8);
  font-size:var(--studio-text-sm);
  line-height:1.68;
  display:grid;gap:var(--studio-space-3);
  padding-left:var(--studio-space-5)
}
.pageList a{color:rgba(245,245,243,0.72)}
.pageList a:hover{text-decoration:underline}

/* ── Detail page helpers ── */
.pageAsideBlock{margin-bottom:var(--studio-space-6)}
.pageSpacer{margin-top:var(--studio-space-4)}
.pageSpacerLg{margin-top:var(--studio-space-8)}
.pagePreWrap{white-space:pre-wrap}

/* ── Empty state ── */
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

/* ── Back link ── */
.pageBack{color:rgba(245,245,243,0.72);font-size:var(--studio-text-sm)}
.pageBack:hover{text-decoration:underline}

/* ── Footer ── */
.pageFooter{
  border-top:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
  color:var(--studio-color-text-muted);
  font-size:var(--studio-text-sm);
  padding:var(--studio-space-8) var(--studio-space-6);
  text-align:center
}

/* ── Animations ── */
@keyframes page-rise{from{opacity:0;transform:translate3d(0,0.75rem,0)}to{opacity:1;transform:translate3d(0,0,0)}}

/* ── Responsive ── */
@media(max-width:58rem){
  .pageSplit{grid-template-columns:1fr}
  .pageHero{padding-block:var(--studio-space-12) var(--studio-space-16)}
}
@media(max-width:34rem){
  .pageTitle{font-size:clamp(2.55rem,13vw,3.2rem)}
  .pageSection{contain-intrinsic-size:auto 44rem;padding-block:var(--studio-space-12)}
}
@media(prefers-reduced-motion:reduce){
  .pageHero,.pageSection{animation:none}
}
`;

// ---------------------------------------------------------------------------
// Page renderer
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

  const summaryHtml = project.summary
    ? `<h2 class="pageSectionTitle">Summary</h2><p class="pageCopy pageSpacer">${project.summary}</p>`
    : "";

  const bodyHtml = project.body
    ? `<h2 class="pageSectionTitle pageSpacerLg">Details</h2><p class="pageCopy pageSpacer pagePreWrap">${project.body}</p>`
    : "";

  const updatesHtml = project.updates_future_plans
    ? `<h2 class="pageSectionTitle pageSpacerLg">Updates &amp; Future Plans</h2><p class="pageCopy pageSpacer pagePreWrap">${project.updates_future_plans}</p>`
    : "";

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
<nav class="pageNav">
  <a href="/">Studio</a>
  <a href="/projects" class="active">Projects</a>
  <a href="/experiments">Experiments</a>
  <a href="/about">About</a>
</nav>
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
          ${summaryHtml}
          ${bodyHtml}
          ${updatesHtml}
        </div>
        <aside>
          ${asideHtml}
        </aside>
      </div>
    </section>
  </div>
</main>
<footer class="pageFooter">&copy; ${new Date().getFullYear()} Choneise Studio</footer>
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
<nav class="pageNav">
  <a href="/">Studio</a>
  <a href="/projects" class="active">Projects</a>
  <a href="/experiments">Experiments</a>
  <a href="/about">About</a>
</nav>
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
<footer class="pageFooter">&copy; ${new Date().getFullYear()} Choneise Studio</footer>
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
