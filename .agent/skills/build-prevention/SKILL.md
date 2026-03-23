# Build Prevention Skill

## Purpose

Use when build fails due to module resolution, circular dependencies, or ESM import order issues.

## Iron Law

**NO BUILD FIX WITHOUT VERIFICATION.**
All build-related changes must be verified by running `npm run build` or `npx tsc --noEmit`.

## Triggers

- `Module not found: Can't resolve ...`
- `ESM import order` eslint errors.
- `Circular dependency` warnings.
- `typescript` diagnostic errors in `.next/types`.

## Workflow

1. **Pinpoint the Path**: Calculate directory depth carefully.
   - `src/app/actions/file.ts` -> `../../lib/file.ts` is 2 levels deep to `src/`.
2. **ESM Order**: In `.tsx` files, ensure `use client` is at the top, followed by standard imports, then local imports.
3. **Locale Isolation**: If using `[lang]` routes, ensure `dictionaries` and `messages` paths are robust and types are exported.
4. **Validation**: Always run `npx tsc --noEmit > tsc_output.log 2>&1` and check `tsc_output.log` for errors using `findstr` or `grep`.
