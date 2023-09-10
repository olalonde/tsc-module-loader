// TODO: use already installed typescript
import { tsResolve } from "./tsc.js";
import { isBuiltin } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Context, NextFn } from "./types.js";

export async function resolve(
  specifier: string,
  context: Context,
  next: NextFn,
) {
  if (isBuiltin(specifier)) {
    return next(specifier, context);
  }
  const origSpecifier = specifier;

  if (specifier.startsWith("file://")) {
    specifier = fileURLToPath(specifier);
  }
  let parentPath = context.parentURL;
  if (parentPath && parentPath.startsWith("file://")) {
    parentPath = fileURLToPath(parentPath);
  }
  const newSpecifier = tsResolve(specifier, parentPath);
  if (newSpecifier) {
    specifier = newSpecifier;
    specifier = pathToFileURL(specifier).href;
    return next(specifier, context);
  } else {
    return next(origSpecifier, context);
  }
}
