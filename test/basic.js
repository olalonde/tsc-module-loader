import { fixPath } from "../tsc.js";

const res = fixPath("/my/project/src/some/file.d.ts", {
  rootDir: "/my/project/src",
  outDir: "/my/project/build",
});
if (res !== "/my/project/build/some/file.js") {
  process.exit(1);
}
