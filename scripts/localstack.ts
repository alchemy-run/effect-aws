import { $ } from "bun";
import * as crypto from "crypto";
import * as net from "net";

export interface LocalStackOptions {
  port?: number;
  containerName?: string;
}

const hashWorkspace = (path: string): string => {
  return crypto.createHash("md5").update(path).digest("hex").slice(0, 8);
};

export const withLocalStack = async <T>(
  fn: () => Promise<T>,
  options: LocalStackOptions = {},
): Promise<T> => {
  const port = options.port ?? parseInt(process.env.LOCALSTACK_PORT ?? "4566");
  const containerName =
    options.containerName ??
    `localstack-${hashWorkspace(process.cwd())}-${port}`;

  // Calculate non-overlapping external service port range based on main port
  // Each port gets a unique 50-port block offset by 100 from the previous
  // Port 4566 (offset 0) -> 4510-4559, Port 4567 (offset 1) -> 4610-4659, etc.
  const portOffset = port - 4566;
  const externalPortStart = 4510 + portOffset * 100;
  const externalPortEnd = externalPortStart + 49;

  // Stop any existing container with this name (ignore errors if not running)
  await $`docker stop ${containerName} 2>/dev/null || true`.quiet();
  await $`docker rm ${containerName} 2>/dev/null || true`.quiet();

  // Start localstack using docker run directly for proper port control
  await $`docker run -d \
    --name ${containerName} \
    -p ${port}:4566 \
    -p ${externalPortStart}-${externalPortEnd}:4510-4559 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -e GATEWAY_LISTEN=0.0.0.0:4566 \
    localstack/localstack`.quiet();

  // Wait for localstack port to be open before proceeding
  while (true) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.connect({ port, host: "127.0.0.1" }, () => {
          socket.end();
          resolve(true);
        });
        socket.on("error", () => {
          reject(new Error("Failed to connect to localstack"));
        });
      });
      break;
    } catch {}
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    return await fn();
  } finally {
    // Stop only this specific container
    await $`docker stop ${containerName}`.quiet();
    await $`docker rm ${containerName} 2>/dev/null || true`.quiet();
  }
};
