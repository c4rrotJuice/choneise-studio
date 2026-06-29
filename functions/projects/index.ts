import { createAdminClient } from "../_lib/admin"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectRow {
  slug: string
  title: string
  description: string | null
  status: string
  kind: string | null
  version: string | null
  summary: string | null
  hosting_stack: Record<string, unknown> | null
  tech_stack: unknown[] | null
}

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

// ---------------------------------------------------------------------------
// HTML page renderer
// ---------------------------------------------------------------------------

function pageHtml(projects: ProjectRow[]): string {
  const statusMap: Record<string, string> = {
    published: "Live",
    Live: "Live",
    Building: "Building",
    Experiment: "Experiment",
    Dormant: "Dormant",
    draft: "Draft",
    archived: "Archived",
  }

  const cards =
    projects.length === 0
      ? `<div class="emptyState">
           <p class="emptyTitle">No published projects yet</p>
           <p class="emptyCopy">Check back soon — the studio is currently preparing its first public releases.</p>
         </div>`
      : `<div class="projectGrid">
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
                   : []

               const techItems: string[] = Array.isArray(p.tech_stack)
                 ? p.tech_stack
                     .map((item) =>
                       typeof item === "string" ? item : String(item),
                     )
                     .filter((v, i, a) => a.indexOf(v) === i)
                 : []

               let deployed = ""
               if (p.hosting_stack && typeof p.hosting_stack === "object" && !Array.isArray(p.hosting_stack)) {
                 const urlKeys = ["URL", "url", "Deployed URL", "deployed_url", "Domain", "domain"]
                 for (const key of urlKeys) {
                   const val = (p.hosting_stack as Record<string, unknown>)[key]
                   if (typeof val === "string" && val.startsWith("http")) {
                     deployed = val
                     break
                   }
                 }
               }

               const hostingHtml =
                 hostingEntries.length > 0
                   ? `<span class="hostingSummary">${hostingEntries
                       .map(
                         ([key, value]) =>
                           `<span class="hostingItem"><span class="hostingKey">${key}</span><span class="hostingValue">${value}</span></span>`,
                       )
                       .join("")}</span>`
                   : ""

               const urlHtml = deployed
                 ? `<span class="deployedUrl">${deployed}</span>`
                 : ""

               const techHtml =
                 techItems.length > 0
                   ? `<span class="techStack">${techItems
                       .map((t) => `<span class="techBadge">${t}</span>`)
                       .join("")}</span>`
                   : ""

               const displayStatus = statusMap[p.status] ?? "Live"
               const dotClass = {
                 Live: "statusLive",
                 Building: "statusBuilding",
                 Experiment: "statusExperiment",
                 Dormant: "statusDormant",
               }[displayStatus]

               return `<a class="card" href="/projects/${p.slug}">
                 <span class="cardTop">
                   <span class="status">
                     <span class="statusDot ${dotClass}"></span>${displayStatus}
                   </span>
                   <span class="arrow">↗</span>
                 </span>
                 <span class="body">
                   <span class="title">${p.title}</span>
                   <span class="description">${p.description ?? ""}</span>
                   ${hostingHtml}
                   ${urlHtml}
                   ${techHtml}
                 </span>
                 <span class="meta">
                   <span>${p.kind ?? "Project"}</span>
                   <span class="version">${p.version ?? ""}</span>
                 </span>
               </a>`
             })
             .join("")}
         </div>`

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
<style>
  :root {
    --studio-color-bg: #0d0f12;
    --studio-color-text: rgba(245,245,243,0.88);
    --studio-color-text-muted: rgba(170,166,154,0.78);
    --studio-color-sage-300: #7d8b7c;
    --studio-color-amber-300: #e4c88d;
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
    --studio-container-md: 52rem;
    --studio-container-readable: 37rem;
    --studio-duration-fast: 180ms;
    --studio-ease-standard: cubic-bezier(0.4,0,0.2,1);
    --studio-ease-enter: cubic-bezier(0.16,1,0.3,1);
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{-webkit-font-smoothing:antialiased}
  body{background:var(--studio-color-bg);color:var(--studio-color-text);font-family:system-ui,-apple-system,sans-serif;font-size:var(--studio-text-md);line-height:1.65;min-height:100vh}
  a{color:inherit;text-decoration:none}
  .nav{display:flex;gap:var(--studio-space-6);padding:var(--studio-space-5) var(--studio-space-6);align-items:center}
  .nav a{color:var(--studio-color-text-muted);font-size:var(--studio-text-sm);transition:color var(--studio-duration-fast) var(--studio-ease-standard)}
  .nav a:hover,.nav a.active{color:var(--studio-color-text)}
  .nav a.active{font-weight:var(--studio-font-weight-semibold)}
  .shell{background:linear-gradient(115deg,rgba(13,15,18,0.98),rgba(13,15,18,0.86) 52%,rgba(13,15,18,0.94)),radial-gradient(circle at 78% 20%,rgba(125,139,124,0.12),transparent 24rem),radial-gradient(circle at 48% 40%,rgba(34,48,64,0.2),transparent 30rem);border-bottom:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08)}
  .container{margin:0 auto;max-width:var(--studio-container-md);padding-inline:var(--studio-space-6)}
  .hero{padding-block:clamp(var(--studio-space-16),9vw,var(--studio-space-24));display:grid;gap:var(--studio-space-8)}
  .kicker{align-items:center;border:var(--studio-border-width-regular) solid rgba(245,245,243,0.14);border-radius:var(--studio-radius-pill);color:rgba(170,166,154,0.84);display:inline-flex;font-size:var(--studio-text-xs);font-weight:var(--studio-font-weight-semibold);gap:var(--studio-space-3);letter-spacing:var(--studio-tracking-label);line-height:var(--studio-leading-heading);padding:var(--studio-space-3) var(--studio-space-4);text-transform:uppercase;width:fit-content}
  .kicker::before{background:radial-gradient(circle,var(--studio-color-amber-300) 0 30%,rgba(228,200,141,0.12) 34% 100%);border-radius:var(--studio-radius-pill);content:"";display:block;height:0.45rem;width:0.45rem}
  .title{color:rgba(245,245,243,0.9);font-size:clamp(var(--studio-text-3xl),6vw,var(--studio-text-display));font-weight:var(--studio-font-weight-regular);line-height:0.98;max-width:13ch}
  .copy{color:rgba(170,166,154,0.82);font-size:clamp(var(--studio-text-md),1.4vw,var(--studio-text-lg));line-height:1.7;max-width:var(--studio-container-readable)}
  .section{border-top:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);padding-block:clamp(var(--studio-space-12),8vw,var(--studio-space-24))}
  .sectionHeader{display:grid;gap:var(--studio-space-4);margin-bottom:var(--studio-space-8);max-width:var(--studio-container-readable)}
  .sectionTitle{color:rgba(245,245,243,0.88);font-size:clamp(var(--studio-text-2xl),4vw,var(--studio-text-4xl));font-weight:var(--studio-font-weight-regular);line-height:1.04}
  .projectGrid{display:grid;gap:var(--studio-space-6);grid-template-columns:repeat(2,minmax(0,1fr))}
  .card{background:linear-gradient(145deg,rgba(245,245,243,0.07),rgba(245,245,243,0.025)),rgba(20,23,27,0.58);border:var(--studio-border-width-regular) solid rgba(245,245,243,0.11);border-radius:var(--studio-radius-4);display:grid;gap:var(--studio-space-6);min-height:13rem;padding:var(--studio-space-6);transition:border-color var(--studio-duration-fast) var(--studio-ease-standard),box-shadow var(--studio-duration-fast) var(--studio-ease-standard),transform var(--studio-duration-fast) var(--studio-ease-standard)}
  .card:hover{border-color:rgba(245,245,243,0.2);box-shadow:0 1.5rem 4rem rgba(0,0,0,0.22);transform:translate3d(0,-0.25rem,0)}
  .cardTop,.meta{display:flex;align-items:center;justify-content:space-between}
  .status{align-items:center;color:rgba(245,245,243,0.7);display:inline-flex;font-size:var(--studio-text-xs);font-weight:var(--studio-font-weight-semibold);gap:var(--studio-space-3);letter-spacing:var(--studio-tracking-label);text-transform:uppercase}
  .statusDot{background:rgba(170,166,154,0.78);border-radius:var(--studio-radius-pill);height:0.45rem;width:0.45rem;box-shadow:0 0 1rem currentColor}
  .statusLive{background:var(--studio-color-sage-300);color:var(--studio-color-sage-300)}
  .statusBuilding{background:var(--studio-color-amber-300);color:var(--studio-color-amber-300)}
  .statusExperiment{background:#a6c7e7;color:#a6c7e7}
  .statusDormant{background:rgba(170,166,154,0.66);color:rgba(170,166,154,0.66)}
  .arrow{color:rgba(170,166,154,0.68);font-size:var(--studio-text-lg);line-height:1;transition:transform var(--studio-duration-fast) var(--studio-ease-standard)}
  .card:hover .arrow{transform:translate3d(0.125rem,-0.125rem,0)}
  .body{align-self:start;display:grid;gap:var(--studio-space-3)}
  .title{color:rgba(245,245,243,0.88);font-size:var(--studio-text-xl);font-weight:var(--studio-font-weight-regular);line-height:var(--studio-leading-heading)}
  .description{color:rgba(170,166,154,0.78);font-size:var(--studio-text-sm);line-height:1.65}
  .hostingSummary{color:rgba(170,166,154,0.7);display:grid;font-size:var(--studio-text-xs);gap:var(--studio-space-2);line-height:1.5}
  .hostingItem{display:grid;grid-template-columns:auto 1fr;gap:var(--studio-space-2);align-items:baseline}
  .hostingKey{color:rgba(170,166,154,0.55);font-weight:var(--studio-font-weight-medium);white-space:nowrap}
  .hostingKey::after{content:":"}
  .hostingValue{color:rgba(245,245,243,0.62);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .deployedUrl{color:rgba(170,166,154,0.66);font-size:var(--studio-text-xs);line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .techStack{display:flex;flex-wrap:wrap;gap:var(--studio-space-2)}
  .techBadge{background:rgba(245,245,243,0.06);border:var(--studio-border-width-hairline) solid rgba(245,245,243,0.1);border-radius:var(--studio-radius-pill);color:rgba(170,166,154,0.72);font-size:var(--studio-text-xs);line-height:1;padding:var(--studio-space-1) var(--studio-space-3);white-space:nowrap}
  .meta{align-self:end;color:rgba(170,166,154,0.68);font-size:var(--studio-text-sm)}
  .version{border:var(--studio-border-width-hairline) solid rgba(245,245,243,0.11);border-radius:var(--studio-radius-pill);color:rgba(245,245,243,0.58);font-size:var(--studio-text-xs);padding:var(--studio-space-1) var(--studio-space-3)}
  .emptyState{background:linear-gradient(145deg,rgba(245,245,243,0.04),rgba(245,245,243,0.015)),rgba(20,23,27,0.4);border:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);border-radius:var(--studio-radius-4);display:grid;gap:var(--studio-space-4);padding:var(--studio-space-12) var(--studio-space-8);place-items:center;text-align:center}
  .emptyTitle{color:rgba(245,245,243,0.62);font-size:var(--studio-text-lg);font-weight:var(--studio-font-weight-regular)}
  .emptyCopy{color:rgba(170,166,154,0.64);font-size:var(--studio-text-sm);line-height:1.7;max-width:28rem}
  .footer{border-top:var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);color:var(--studio-color-text-muted);font-size:var(--studio-text-sm);padding:var(--studio-space-8) var(--studio-space-6);text-align:center}
  @media(max-width:58rem){.projectGrid{grid-template-columns:1fr}.hero{padding-block:var(--studio-space-12) var(--studio-space-16)}}
  @media(max-width:34rem){.title{font-size:clamp(2.55rem,13vw,3.2rem)}.section{padding-block:var(--studio-space-12)}.card{padding:var(--studio-space-5);min-height:12rem}}
</style>
</head>
<body>
<nav class="nav">
  <a href="/">Studio</a>
  <a href="/projects" class="active">Projects</a>
  <a href="/experiments">Experiments</a>
  <a href="/about">About</a>
</nav>
<main>
  <div class="shell">
    <div class="container">
      <header class="hero">
        <p class="kicker">Projects</p>
        <h1 class="title">Tools that solve small, real jobs.</h1>
        <p class="copy">Choneise builds practical web products with a bias toward clarity, release quality, and long-term ownership. This is the public map of what exists and what is underway.</p>
      </header>
    </div>
  </div>
  <div class="container">
    <section class="section">
      <div class="sectionHeader">
        <p class="kicker">Published</p>
        <h2 class="sectionTitle">Public tools and product experiments</h2>
      </div>
      ${cards}
    </section>
  </div>
</main>
<footer class="footer">&copy; ${new Date().getFullYear()} Choneise Studio</footer>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function onRequestGet(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { env } = context

  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.NEXT_PUBLIC_SUPABASE_URL) {
    return new Response(pageHtml([]), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }

  try {
    const admin = createAdminClient(env)
    const { data, error } = await admin
      .from("projects")
      .select("slug, title, description, status, kind, version, summary, hosting_stack, tech_stack")
      .eq("public", true)
      .order("created_at", { ascending: false })

    if (error) {
      return new Response(pageHtml([]), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    }

    return new Response(pageHtml((data ?? []) as ProjectRow[]), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  } catch {
    return new Response(pageHtml([]), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }
}
