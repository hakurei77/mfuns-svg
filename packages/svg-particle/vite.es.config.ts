import { resolve } from "path";
import { PluginOption, defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "../../tsconfig.json",
      outDir: "dist/types",
    }) as PluginOption,
  ],
  build: {
    outDir: "dist/es",
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: resolve("./src/index.ts"),
      name: "SVGParticle",
      fileName: "index",
      formats: ["es"],
    },
  },
});
