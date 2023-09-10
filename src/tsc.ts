import { dirname as pathDirname } from "node:path";
import ts, { CompilerOptions } from "typescript";

function getCompilerSetup(rootDir: string) {
  const tsConfigPath = ts.findConfigFile(
    rootDir,
    ts.sys.fileExists,
    "tsconfig.json",
  );
  if (tsConfigPath === undefined) {
    console.error(
      `[tsc-loader] Cannot locate a tsconfig.json. Please create one at ${rootDir}/tsconfig.json`,
    );
    throw new Error();
  }
  const readResult = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  const config = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    pathDirname(tsConfigPath),
  );
  const compilerOptions = config.options;

  const host = ts.createCompilerHost(compilerOptions, true);
  return { compilerOptions, host };
}

function replaceExtension(filePath: string, ext: string) {
  // Check if the file ends with the provided extension
  if (filePath.endsWith(ext)) {
    // Replace the extension with .js
    const newName = filePath.slice(0, filePath.length - ext.length) + ".js";
    return newName;
  } else {
    // If the extension is not the same, return the original filePath
    return filePath;
  }
}

// if there are .d.ts files in build folder, ts will resolve those instead of the .js file
function fixExtension(filePath: string) {
  let f = filePath;
  f = replaceExtension(f, ".d.ts");
  f = replaceExtension(f, ".ts");
  return f;
}

function fixBasePath(
  filePath: string,
  oldBasePath: string,
  newBasePath: string,
) {
  if (filePath.startsWith(oldBasePath)) {
    // Replace the extension with .js
    const newName = newBasePath + filePath.slice(oldBasePath.length);
    return newName;
  } else {
    // If the extension is not the same, return the original filePath
    return filePath;
  }
}

// TODO: more robust way to do this?
export function fixPath(filePath: string, compilerOptions: CompilerOptions) {
  if (!compilerOptions.rootDir) return filePath;
  if (!compilerOptions.outDir) return filePath;
  // replace the rootDir with outDir
  filePath = fixBasePath(
    filePath,
    compilerOptions.rootDir,
    compilerOptions.outDir,
  );
  // replaces .d.ts or .ts extensions with .js
  filePath = fixExtension(filePath);
  return filePath;
}

let compilerSetup: ReturnType<typeof getCompilerSetup>;
// is this correct? should we find the first package.json we find up the path?
const cwd = process.cwd();
export function tsResolve(path: string, containingFile: string | undefined) {
  const baseDir = cwd;
  if (!compilerSetup) {
    compilerSetup = getCompilerSetup(baseDir);
  }
  const { compilerOptions, host } = compilerSetup;

  const rootContainingFile = containingFile;
  const result = ts.resolveModuleName(
    path,
    rootContainingFile ?? "",
    compilerOptions,
    host,
  );
  if (!result) return;
  if (!result.resolvedModule) return;
  const { resolvedFileName } = result.resolvedModule;
  const resolution = fixPath(resolvedFileName, compilerOptions);

  // Skip files resolved outside build directory
  if (
    compilerOptions.outDir &&
    !resolution.startsWith(compilerOptions.outDir)
  ) {
    return;
  }
  return resolution;
}
