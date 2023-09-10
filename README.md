# tsc-module-loader

Node.js [custom ESM loader](https://nodejs.org/api/esm.html#loaders) that mimics the resolution algorithm of the typescript compiler. It reads your `tsconfig.json` file, so it doesn't require any custom configuration. With this loader, if your import works at compile time, it will work at runtime.

## Usage

```console
npm install --save tsc-module-loader
node --experimental-loader tsc-module-loader build/some-file.js
```

Alternatively, you can [register the loader programmatically in your code](https://nodejs.org/api/module.html#moduleregister).

## Why?

It solves a common issue and complaint among TypeScript developers. Importing a `.js` file feels weird when all your source files actually have the `.ts` extension:

```typescript
import foo from "./bar.js";
```

However, if you omit the `.js` extension, Node.js will not be able to locate the module.

```typescript
import foo from "./bar";
```

```console
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/path/to/bar'  imported from ...
Did you mean to import /path/to/bar.js?
    at new NodeError (node:internal/errors:405:5)
    at finalizeResolution (node:internal/modules/esm/resolve:226:11)
    at moduleResolve (node:internal/modules/esm/resolve:838:10)
    ...
```

A current solution is to use [tsc-alias](https://github.com/justkey007/tsc-alias) as a post-compile step but it can be buggy and requires custom configuration.

The goal of this loader is that if an import works in TypeScript during the build step, it will also work at runtime using this loader. It does this by using TypeScript library functions to read your tsconfig.json and doing the module resolution.

Warning: custom ESM loaders are currently an experimental feature.
