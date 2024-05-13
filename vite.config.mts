import { defineConfig, splitVendorChunkPlugin } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import arraybuffer from "vite-plugin-arraybuffer";
import babel from "vite-plugin-babel";
import BabelPluginReact from "babel-plugin-react-forget";

export default defineConfig(({ isSsrBuild }) => {
  return {
    build: {
      sourcemap: true,
    },
    ssr: {
      noExternal: ["@docsearch/react"],
    },
    plugins: [
      tsconfigPaths(),
      splitVendorChunkPlugin(),
      arraybuffer(),
      remix({
        future: {
          unstable_singleFetch: true,
        },
      }),
      !isSsrBuild &&
        babel({
          // needed because vite-plugin-babel defaults to only handling jsx? files
          filter: /\.[jt]sx?$/,
          babelConfig: {
            // add this so it can handle TypeScript files
            presets: ["@babel/preset-typescript"],
            plugins: [
              [
                BabelPluginReact,
                {
                  compilationMode: "infer",
                  panicThreshold: "NONE",
                },
              ],
            ],
          },
        }),
    ],
  };
});
