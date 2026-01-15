import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  source: {
    entry: {
      index: process.argv[4],
    },
  },
  output: {
    module: true,
    target: "node",
    externals: [
      /^@effect\/(.*)/,
      "effect",
      /^effect\/(.*)/,
      "@aws-sdk/credential-providers",
      //todo(pear): these aren't really external
      "fast-xml-parser",
      "aws4fetch",
    ],
    minify: {
      js: true,
      jsOptions: {
        minimizerOptions: {
          minify: false,
          mangle: false,
        },
      },
    },
    distPath: {
      root: "dist",
      js: ".",
    },
    filename: {
      js: "bundle.js",
    },
  },
  tools: {
    htmlPlugin: false,
  },
  performance: {
    chunkSplit: {
      strategy: "all-in-one",
    },
  },
});
