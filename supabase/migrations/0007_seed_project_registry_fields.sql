-- Migration 0007: Populate new project registry fields on existing seed projects.
-- This is a data-only migration that updates existing projects with hosting_stack,
-- tech_stack, and updates_future_plans values matching the updated seed file.

UPDATE projects SET
  hosting_stack = '{"frontend": "Next.js", "backend": "Supabase", "database": "PostgreSQL", "auth": "Supabase Auth", "server": "Cloudflare Pages", "deployed_url": "https://choneise.com"}',
  tech_stack = '["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Cloudflare Pages"]',
  updates_future_plans = 'Expand the studio console with richer editing, add project-level analytics, and refine the public discovery surface.'
WHERE slug = 'choneise-studio';

UPDATE projects SET
  hosting_stack = '{"frontend": "Next.js", "backend": "Supabase", "database": "PostgreSQL", "auth": "Supabase Auth", "server": "Vercel", "deployed_url": null}',
  tech_stack = '["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "TipTap"]',
  updates_future_plans = 'Ship public beta, add markdown export, and explore collaborative editing.'
WHERE slug = 'quiet-tool';

UPDATE projects SET
  hosting_stack = '{"frontend": "Next.js", "backend": "Supabase", "database": "PostgreSQL", "auth": null, "server": "Cloudflare Pages", "deployed_url": "https://grade-converter.pages.dev"}',
  tech_stack = '["Next.js", "React", "TypeScript", "Tailwind CSS", "Cloudflare Pages"]',
  updates_future_plans = 'Add more grading systems, support GPA calculations, and improve mobile layout.'
WHERE slug = 'grade-converter';

UPDATE projects SET
  hosting_stack = '{"frontend": "Next.js", "backend": null, "database": null, "auth": null, "server": "Cloudflare Pages", "deployed_url": null}',
  tech_stack = '["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare Pages"]',
  updates_future_plans = 'Complete fee formula validation, add provider comparison, and ship v1.0.'
WHERE slug = 'fee-calculator';

UPDATE projects SET
  hosting_stack = '{"frontend": "Next.js", "backend": "Supabase", "database": "PostgreSQL", "auth": null, "server": "Cloudflare Pages", "deployed_url": "https://multilingual-explorer.pages.dev"}',
  tech_stack = '["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Cloudflare Pages"]',
  updates_future_plans = 'Add more language pairs, improve search performance, and explore adding pronunciation guides.'
WHERE slug = 'multilingual-explorer';

UPDATE projects SET
  hosting_stack = '{"frontend": "Next.js", "backend": "Supabase", "database": "PostgreSQL", "auth": "Supabase Auth", "server": "Vercel", "deployed_url": null}',
  tech_stack = '["Next.js", "TypeScript", "Tailwind CSS", "Supabase"]',
  updates_future_plans = 'Revisit after Quiet Tool stabilises. Consider merging ideas or keeping as a separate lightweight journal product.'
WHERE slug = 'quiet-journal';
