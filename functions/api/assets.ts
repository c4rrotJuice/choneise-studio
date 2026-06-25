We need to output the complete modified file, with the only change being the meta schema as suggested: `meta: z.record(z.string(), z.unknown()).optional()` instead of `meta: z.record(z.unknown()).optional()`. So I'll take the original code and change that line.

The original line is:

