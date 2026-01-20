/**
 * LSP module for TypeScript error surfacing.
 *
 * Provides a pure Effect implementation of LSP (Language Server Protocol)
 * for getting type errors and linting diagnostics from:
 * - typescript-language-server (type checking)
 * - oxlint --lsp (fast linting)
 */

export {
  type JsonRpcConnection,
  JsonRpcParseError,
  JsonRpcProtocolError,
  make as makeJsonRpc,
} from "./jsonrpc.ts";

export {
  type Diagnostic,
  DiagnosticSeverity,
  type LSPClient,
  makeLSPClient,
  type Position,
  type Range,
} from "./client.ts";

export {
  AllServers,
  OxlintServer,
  type ServerConfig,
  TypeScriptServer,
} from "./servers.ts";

export { LSPManager, LSPManagerLive } from "./manager.ts";
