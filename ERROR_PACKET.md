# Error Packet - 2026-04-02T14:09:11.631Z

## Summary
The build failed. This is a system-generated report for automated or manual review.

## Error Output
```text

> texas-total-loss@0.1.1 build:raw
> next build

   ▲ Next.js 16.0.10 (Turbopack)
   - Environments: .env.local
   - Experiments (use with caution):
     · serverActions

   Creating an optimized production build ...
 ✓ Compiled successfully in 15.5s
   Running TypeScript ...

[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
Failed to compile.

.next/dev/types/validator.ts:25:44
Type error: Type 'Route' does not satisfy the constraint 'LayoutRoutes'.
  Type 'import("C:/Users/17549/.gemini/antigravity/Series_B/total-loss-intake/.next/dev/types/routes").LayoutRoutes' is not assignable to type 'import("C:/Users/17549/.gemini/antigravity/Series_B/total-loss-intake/.next/types/routes").LayoutRoutes'.
    Type '"/[lang]"' is not assignable to type 'LayoutRoutes'.

[0m [90m 23 |[39m
 [90m 24 |[39m type [33mLayoutConfig[39m[33m<[39m[33mRoute[39m [36mextends[39m [33mLayoutRoutes[39m [33m=[39m [33mLayoutRoutes[39m[33m>[39m [33m=[39m {
[31m[1m>[22m[39m[90m 25 |[39m   [36mdefault[39m[33m:[39m [33mReact[39m[33m.[39m[33mComponentType[39m[33m<[39m[33mLayoutProps[39m[33m<[39m[33mRoute[39m[33m>>[39m [33m|[39m ((props[33m:[39m [33mLayoutProps[39m[33m<[39m[33mRoute[39m[33m>[39m) [33m=>[39m [33mReact[39m[33m.[39m[33mReactNode[39m [33m|[39m [33mPromise[39m[33m<[39m[33mReact[39m[33m.[39m[33mReactNode[39m[33m>[39m [33m|[39m never [33m|[39m [36mvoid[39m [33m|[39m [33mPromise[39m[33m<[39m[36mvoid[39m[33m>[39m)
 [90m    |[39m                                            [31m[1m^[22m[39m
 [90m 26 |[39m   generateStaticParams[33m?[39m[33m:[39m (props[33m:[39m { params[33m:[39m [33mParamMap[39m[[33mRoute[39m] }) [33m=>[39m [33mPromise[39m[33m<[39m[33many[39m[][33m>[39m [33m|[39m any[]
 [90m 27 |[39m   generateMetadata[33m?[39m[33m:[39m (
 [90m 28 |[39m     props[33m:[39m { params[33m:[39m [33mPromise[39m[33m<[39m[33mParamMap[39m[[33mRoute[39m][33m>[39m } [33m&[39m any[33m,[39m[0m
Next.js build worker exited with code: 1 and signal: null

```

## Context
- **Attempts before reset**: 2
- **Cache cleared**: No

## Instructions for Reviewer
Please analyze the error output above and provide a fix. The fix can be applied using the `apply-fix.mjs` script.
