import { build } from "esbuild";
import fs from "fs";

// Read package.json to get dependencies
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.devDependencies,
});

build({
  entryPoints: ["index.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  outdir: "dist",
  format: "esm",
  sourcemap: true,
  external: external,
  minify: process.env.NODE_ENV === "production",
}).catch(() => process.exit(1));
