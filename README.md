# tsc-module-loader

Node.js [custom ESM loader](https://nodejs.org/api/esm.html#loaders) that mimics the resolution algorithm of the typescript compiler. It reads your tsconfig.json file, so it doesn't require custom configuration.

It solves a common issue and complaint among TypeScript developers.

A current solution is to use [tsc-alias](https://github.com/justkey007/tsc-alias) as a post-compile step but it can be buggy and requires custom configuration.

Warning: custom ESM loaders are currently an experimental feature.

## Usage

```console
npm install --save tsc-module-loader
node --experimental-loader tsc-module-loader build/some-file.js
```

Alternatively, you can [register the loader programmatically in your code](https://nodejs.org/api/module.html#moduleregister).
