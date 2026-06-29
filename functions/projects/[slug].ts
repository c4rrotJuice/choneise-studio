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

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function html(
  title: string,
  description: string,
  body: string,
  status = 200,
): Response {
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | Choneise Studio</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${title} | Choneise Studio">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://choneise.com/projects/${title.toLowerCase().replace(/\s+/g, "-")}">
<meta property="og:image" content="https://choneise.com/og.png">
<link rel="canonical" href="https://choneise.com/projects/${title.toLowerCase().replace(/\s+/g, "-")}">
<style>
  :root {
    --studio-color-bg: #0d0f12;
    --studio-color-text: rgba(245, 245, 243, 0.88);
    --studio-color-text-muted: rgba(170, 166, 154, 0.78);
    --studio-color-amber-300: #e4c88d;
    --studio-color-sage-300: #7d8b7c;
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
    --studio-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
    --studio-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body {
    background: var(--studio-color-bg);
    color: var(--studio-color-text);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    font-size: var(--studio-text-md);
    line-height: 1.65;
    min-height: 100vh;
  }
  a { color: inherit; }
  .nav {
    align-items: center;
    display: flex;
    gap: var(--studio-space-6);
    padding: var(--studio-space-5) var(--studio-space-6);
  }
  .nav a {
    color: var(--studio-color-text-muted);
    font-size: var(--studio-text-sm);
    text-decoration: none;
    transition: color var(--studio-duration-fast) var(--studio-ease-standard);
  }
  .nav a:hover, .nav a.active { color: var(--studio-color-text); }
  .nav a.active { font-weight: var(--studio-font-weight-semibold); }
  .shell {
    background: linear-gradient(115deg, rgba(13,15,18,0.98) 0%, rgba(13,15,18,0.86) 52%, rgba(13,15,18,0.94) 100%),
      radial-gradient(circle at 78% 20%, rgba(125,139,124,0.12), transparent 24rem),
      radial-gradient(circle at 48% 40%, rgba(34,48,64,0.2), transparent 30rem);
    border-bottom: var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
  }
  .container { margin: 0 auto; max-width: var(--studio-container-md); padding-inline: var(--studio-space-6); }
  .hero {
    padding-block: clamp(var(--studio-space-16), 9vw, var(--studio-space-24));
    display: grid;
    gap: var(--studio-space-8);
  }
  .kicker {
    align-items: center;
    border: var(--studio-border-width-regular) solid rgba(245,245,243,0.14);
    border-radius: var(--studio-radius-pill);
    color: rgba(170,166,154,0.84);
    display: inline-flex;
    font-size: var(--studio-text-xs);
    font-weight: var(--studio-font-weight-semibold);
    gap: var(--studio-space-3);
    letter-spacing: var(--studio-tracking-label);
    line-height: var(--studio-leading-heading);
    padding: var(--studio-space-3) var(--studio-space-4);
    text-transform: uppercase;
    width: fit-content;
  }
  .kicker::before {
    background: radial-gradient(circle, var(--studio-color-amber-300) 0 30%, rgba(228,200,141,0.12) 34% 100%);
    border-radius: var(--studio-radius-pill);
    content: "";
    display: block;
    height: 0.45rem;
    width: 0.45rem;
  }
  .title {
    color: rgba(245,245,243,0.9);
    font-size: clamp(var(--studio-text-3xl), 6vw, var(--studio-text-display));
    font-weight: var(--studio-font-weight-regular);
    letter-spacing: 0;
    line-height: 0.98;
    max-width: 13ch;
  }
  .copy {
    color: rgba(170,166,154,0.82);
    font-size: clamp(var(--studio-text-md), 1.4vw, var(--studio-text-lg));
    line-height: 1.7;
    max-width: var(--studio-container-readable);
  }
  .section {
    border-top: var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
    padding-block: clamp(var(--studio-space-12), 8vw, var(--studio-space-24));
  }
  .split {
    display: grid;
    gap: clamp(var(--studio-space-8), 7vw, var(--studio-space-16));
    grid-template-columns: minmax(0, 0.8fr) minmax(18rem, 1fr);
  }
  .sectionTitle {
    color: rgba(245,245,243,0.88);
    font-size: clamp(var(--studio-text-2xl), 4vw, var(--studio-text-4xl));
    font-weight: var(--studio-font-weight-regular);
    letter-spacing: 0;
    line-height: 1.04;
  }
  .meta {
    color: var(--studio-color-amber-300);
    font-size: var(--studio-text-xs);
    font-weight: var(--studio-font-weight-semibold);
    letter-spacing: var(--studio-tracking-label);
    line-height: var(--studio-leading-heading);
    text-transform: uppercase;
    margin-bottom: var(--studio-space-3);
  }
  .cardTitle {
    color: rgba(245,245,243,0.88);
    font-size: var(--studio-text-xl);
    font-weight: var(--studio-font-weight-regular);
    line-height: var(--studio-leading-heading);
  }
  .list {
    color: rgba(170,166,154,0.8);
    font-size: var(--studio-text-sm);
    line-height: 1.68;
    display: grid;
    gap: var(--studio-space-3);
    padding-left: var(--studio-space-5);
    list-style: disc;
  }
  .list a { color: rgba(245,245,243,0.72); text-decoration: none; }
  .list a:hover { text-decoration: underline; }
  .mb6 { margin-bottom: var(--studio-space-6); }
  .mb8 { margin-bottom: var(--studio-space-8); }
  .mt4 { margin-top: var(--studio-space-4); }
  .pre-wrap { white-space: pre-wrap; }
  .footer {
    border-top: var(--studio-border-width-hairline) solid rgba(245,245,243,0.08);
    color: var(--studio-color-text-muted);
    font-size: var(--studio-text-sm);
    padding: var(--studio-space-8) var(--studio-space-6);
    text-align: center;
  }
  @media (max-width: 58rem) {
    .split { grid-template-columns: 1fr; }
    .hero { padding-block: var(--studio-space-12) var(--studio-space-16); }
  }
  @media (max-width: 34rem) {
    .title { font-size: clamp(2.55rem, 13vw, 3.2rem); }
    .section { padding-block: var(--studio-space-12); }
  }
</style>
</head>
<body>
<nav class="nav">
  <a href="/">Studio</a>
  <a href="/projects" class="active">Projects</a>
  <a href="/experiments">Experiments</a>
  <a href="/about">About</a>
</nav>
${body}
<footer class="footer">&copy; ${new Date().getFullYear()} Choneise Studio</footer>
</body>
</html>`;

  return new Response(page, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
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
    return html(
      "Project Unavailable",
      "Project details are temporarily unavailable.",
      `<main><div class="shell"><div class="container"><header class="hero"><p class="kicker">Project</p><h1 class="title">Unavailable</h1><p class="copy">Project details are temporarily unavailable. Please check back later.</p></header></div></div></main>`,
      503,
    );
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
      return html(
        "Project Not Found",
        "The requested project could not be found.",
        `<main><div class="shell"><div class="container"><header class="hero"><p class="kicker">Project</p><h1 class="title">Not Found</h1><p class="copy">The project you're looking for doesn't exist or hasn't been published yet.</p><p class="copy mt4"><a href="/projects" style="color:rgba(245,245,243,0.72)">← Back to projects</a></p></header></div></div></main>`,
        404,
      );
    }

    const project = data as ProjectRow;

    // Tech stack
    const techItems: string[] = Array.isArray(project.tech_stack)
      ? project.tech_stack
          .map((item) => (typeof item === "string" ? item : String(item)))
          .filter((v, i, a) => a.indexOf(v) === i)
      : [];

    // Hosting entries
    const hostingEntries: Array<[string, string]> =
      project.hosting_stack &&
      typeof project.hosting_stack === "object" &&
      !Array.isArray(project.hosting_stack)
        ? Object.entries(project.hosting_stack)
            .filter(([, v]) => typeof v === "string" || typeof v === "number")
            .map(([k, v]) => [k, String(v)])
        : [];

    const statusLabel: Record<string, string> = {
      published: "Published",
      Live: "Live",
      Building: "Building",
      Experiment: "Experiment",
      Dormant: "Dormant",
    };

    const kindLabel = project.kind ? ` \u00b7 ${project.kind}` : "";

    const asideHtml = [
      project.version
        ? `<div class="mb6"><p class="meta">Version</p><p class="cardTitle">${project.version}</p></div>`
        : "",
      hostingEntries.length > 0
        ? `<div class="mb6"><p class="meta">Hosting</p><ul class="list">${hostingEntries
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
        ? `<div class="mb6"><p class="meta">Tech Stack</p><ul class="list">${techItems
            .map((item) => `<li>${item}</li>`)
            .join("")}</ul></div>`
        : "",
    ]
      .filter(Boolean)
      .join("");

    const summaryHtml = project.summary
      ? `<h2 class="sectionTitle">Summary</h2><p class="copy mt4">${project.summary}</p>`
      : "";

    const bodyHtml = project.body
      ? `<h2 class="sectionTitle mb8" style="margin-top:var(--studio-space-8)">Details</h2><p class="copy mt4 pre-wrap">${project.body}</p>`
      : "";

    const updatesHtml = project.updates_future_plans
      ? `<h2 class="sectionTitle mb8" style="margin-top:var(--studio-space-8)">Updates &amp; Future Plans</h2><p class="copy mt4 pre-wrap">${project.updates_future_plans}</p>`
      : "";

    const mainHtml = `
<main>
  <div class="shell">
    <div class="container">
      <header class="hero">
        <p class="kicker">${statusLabel[project.status] ?? project.status}${kindLabel}</p>
        <h1 class="title">${project.title}</h1>
        ${project.description ? `<p class="copy">${project.description}</p>` : ""}
      </header>
    </div>
  </div>
  <div class="container">
    <section class="section">
      <div class="split">
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
</main>`;

    const description = project.description ?? project.summary ?? "";

    return html(project.title, description, mainHtml);
  } catch {
    return html(
      "Project Unavailable",
      "An unexpected error occurred.",
      `<main><div class="shell"><div class="container"><header class="hero"><p class="kicker">Project</p><h1 class="title">Unavailable</h1><p class="copy">Something went wrong loading this project. Please try again later.</p><p class="copy mt4"><a href="/projects" style="color:rgba(245,245,243,0.72)">← Back to projects</a></p></header></div></div></main>`,
      500,
    );
  }
}
