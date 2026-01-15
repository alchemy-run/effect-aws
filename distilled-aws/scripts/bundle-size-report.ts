import { createRsbuild, defineConfig } from "@rsbuild/core";
import { readdir } from "fs/promises";
import { join } from "path";

interface ServiceSize {
  name: string;
  bytes: number;
  formatted: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const servicesDir = join(import.meta.dir, "../src/services");

const buildService = async (servicePath: string): Promise<number> => {
  const config = defineConfig({
    source: {
      entry: {
        index: servicePath,
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
        "fast-xml-parser",
        "aws4fetch",
        "@aws-crypto/crc32",
        "@smithy/util-base64",
      ],
      minify: {
        js: true,
        jsOptions: {
          minimizerOptions: {
            minify: true,
            mangle: true,
            compress: true,
          },
        },
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
    dev: {
      progressBar: false,
      writeToDisk: false,
    },
    mode: "production",
  });

  const rsbuild = await createRsbuild({
    rsbuildConfig: config,
  });

  // Suppress rsbuild's console output
  const originalLog = console.log;
  const originalInfo = console.info;
  console.log = () => {};
  console.info = () => {};

  let totalSize = 0;
  try {
    const { stats } = await rsbuild.build();
    if (stats) {
      const statsJson = stats.toJson({ assets: true });
      totalSize =
        statsJson.assets?.reduce((sum, asset) => sum + (asset.size || 0), 0) ??
        0;
    }
  } finally {
    console.log = originalLog;
    console.info = originalInfo;
  }

  return totalSize;
};

const main = async () => {
  console.log("🔍 Scanning services directory...\n");

  const files = await readdir(servicesDir);
  const serviceFiles = files
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .sort();

  // Filter to specific services if args provided
  const filterServices = process.argv.slice(2);
  const targetServices =
    filterServices.length > 0
      ? serviceFiles.filter((f) =>
          filterServices.some((filter) => f.includes(filter)),
        )
      : serviceFiles;

  console.log(
    `📦 Building ${targetServices.length} services with optimal minification...\n`,
  );

  const results: ServiceSize[] = [];
  let processed = 0;

  for (const file of targetServices) {
    const serviceName = file.replace(".ts", "");
    const servicePath = join(servicesDir, file);

    processed++;
    process.stdout.write(
      `\r[${processed}/${targetServices.length}] Building ${serviceName}...`.padEnd(
        80,
      ),
    );

    try {
      const bytes = await buildService(servicePath);
      results.push({
        name: serviceName,
        bytes,
        formatted: formatBytes(bytes),
      });
    } catch (error) {
      console.error(`\n❌ Failed to build ${serviceName}:`, error);
    }
  }

  console.log("\n\n");

  // Sort by size descending
  results.sort((a, b) => b.bytes - a.bytes);

  // Calculate totals and stats
  const totalBytes = results.reduce((sum, r) => sum + r.bytes, 0);
  const avgBytes = totalBytes / results.length;
  const medianBytes = results[Math.floor(results.length / 2)]?.bytes ?? 0;

  // Print report
  console.log("=".repeat(60));
  console.log("📊 BUNDLE SIZE REPORT (Tree-shaken, Minified, Mangled)");
  console.log("=".repeat(60));
  console.log("");

  // Top 20 largest
  console.log("🔝 TOP 20 LARGEST SERVICES:");
  console.log("-".repeat(50));
  results.slice(0, 20).forEach((r, i) => {
    const rank = String(i + 1).padStart(2);
    console.log(`${rank}. ${r.name.padEnd(35)} ${r.formatted.padStart(10)}`);
  });

  console.log("");

  // Bottom 10 smallest
  console.log("🔻 10 SMALLEST SERVICES:");
  console.log("-".repeat(50));
  const smallestCount = Math.min(10, results.length);
  const smallest = results.slice(-smallestCount);
  smallest.forEach((r, i) => {
    const rank = String(results.length - smallestCount + i + 1).padStart(3);
    console.log(`${rank}. ${r.name.padEnd(35)} ${r.formatted.padStart(10)}`);
  });

  console.log("");

  // Summary stats
  console.log("📈 SUMMARY:");
  console.log("-".repeat(50));
  console.log(`Total services:     ${results.length}`);
  console.log(`Total size:         ${formatBytes(totalBytes)}`);
  console.log(`Average size:       ${formatBytes(avgBytes)}`);
  console.log(`Median size:        ${formatBytes(medianBytes)}`);
  console.log(
    `Largest:            ${results[0]?.name} (${results[0]?.formatted})`,
  );
  console.log(
    `Smallest:           ${results[results.length - 1]?.name} (${results[results.length - 1]?.formatted})`,
  );

  console.log("");

  // Size distribution
  console.log("📊 SIZE DISTRIBUTION:");
  console.log("-".repeat(50));
  const buckets = [
    { label: "< 50 KB", max: 50 * 1024 },
    { label: "50-100 KB", max: 100 * 1024 },
    { label: "100-250 KB", max: 250 * 1024 },
    { label: "250-500 KB", max: 500 * 1024 },
    { label: "500 KB - 1 MB", max: 1024 * 1024 },
    { label: "> 1 MB", max: Infinity },
  ];

  let prevMax = 0;
  for (const bucket of buckets) {
    const count = results.filter(
      (r) => r.bytes >= prevMax && r.bytes < bucket.max,
    ).length;
    const bar = "█".repeat(Math.ceil(count / 2));
    console.log(
      `${bucket.label.padEnd(15)} ${String(count).padStart(4)} ${bar}`,
    );
    prevMax = bucket.max;
  }

  // Write Markdown report
  const mdReportPath = join(import.meta.dir, "../bundle.md");
  const md = `# Bundle Size Report

> Generated: ${new Date().toISOString()}
> 
> Tree-shaken, minified, and mangled bundle sizes for each service module.

## Summary

| Metric | Value |
|--------|-------|
| Total Services | ${results.length} |
| Total Size | ${formatBytes(totalBytes)} |
| Average Size | ${formatBytes(avgBytes)} |
| Median Size | ${formatBytes(medianBytes)} |
| Largest | ${results[0]?.name} (${results[0]?.formatted}) |
| Smallest | ${results[results.length - 1]?.name} (${results[results.length - 1]?.formatted}) |

## Size Distribution

| Range | Count |
|-------|-------|
${buckets
  .map((bucket, i) => {
    const prevMax = i === 0 ? 0 : buckets[i - 1].max;
    const count = results.filter(
      (r) => r.bytes >= prevMax && r.bytes < bucket.max,
    ).length;
    return `| ${bucket.label} | ${count} |`;
  })
  .join("\n")}

## All Services

| Service | Size |
|---------|------|
${[...results]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((r) => `| ${r.name} | ${r.formatted} |`)
  .join("\n")}
`;

  await Bun.write(mdReportPath, md);

  console.log("");
  console.log(`📄 Markdown report: ${mdReportPath}`);
};

main().catch(console.error);
