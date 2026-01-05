import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "App Mesh", serviceShapeName: "AppMesh" });
const auth = T.AwsAuthSigv4({ name: "appmesh" });
const ver = T.ServiceVersion("2019-01-25");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
      rules: [
        {
          conditions: [
            {
              fn: "aws.partition",
              argv: [{ ref: "Region" }],
              assign: "PartitionResult",
            },
          ],
          rules: [
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://appmesh-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS and DualStack are enabled, but this partition does not support one or both",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://appmesh-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS is enabled but this partition does not support FIPS",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://appmesh.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "DualStack is enabled but this partition does not support DualStack",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://appmesh.{Region}.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v20190125/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeyList,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v20190125/untag" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class DescribeMeshInput extends S.Class<DescribeMeshInput>(
  "DescribeMeshInput",
)(
  {
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v20190125/meshes/{meshName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EgressFilter extends S.Class<EgressFilter>("EgressFilter")({
  type: S.String,
}) {}
export class MeshServiceDiscovery extends S.Class<MeshServiceDiscovery>(
  "MeshServiceDiscovery",
)({ ipPreference: S.optional(S.String) }) {}
export class MeshSpec extends S.Class<MeshSpec>("MeshSpec")({
  egressFilter: S.optional(EgressFilter),
  serviceDiscovery: S.optional(MeshServiceDiscovery),
}) {}
export class UpdateMeshInput extends S.Class<UpdateMeshInput>(
  "UpdateMeshInput",
)(
  {
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: S.optional(MeshSpec),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v20190125/meshes/{meshName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMeshInput extends S.Class<DeleteMeshInput>(
  "DeleteMeshInput",
)(
  { meshName: S.String.pipe(T.HttpLabel("meshName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v20190125/meshes/{meshName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMeshesInput extends S.Class<ListMeshesInput>(
  "ListMeshesInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v20190125/meshes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVirtualGatewayInput extends S.Class<DescribeVirtualGatewayInput>(
  "DescribeVirtualGatewayInput",
)(
  {
    virtualGatewayName: S.String.pipe(T.HttpLabel("virtualGatewayName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualGateways/{virtualGatewayName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PortSet = S.Array(S.Number);
export class VirtualGatewayListenerTlsFileCertificate extends S.Class<VirtualGatewayListenerTlsFileCertificate>(
  "VirtualGatewayListenerTlsFileCertificate",
)({ certificateChain: S.String, privateKey: S.String }) {}
export class VirtualGatewayListenerTlsSdsCertificate extends S.Class<VirtualGatewayListenerTlsSdsCertificate>(
  "VirtualGatewayListenerTlsSdsCertificate",
)({ secretName: S.String }) {}
export const VirtualGatewayClientTlsCertificate = S.Union(
  S.Struct({ file: VirtualGatewayListenerTlsFileCertificate }),
  S.Struct({ sds: VirtualGatewayListenerTlsSdsCertificate }),
);
export const VirtualGatewayCertificateAuthorityArns = S.Array(S.String);
export class VirtualGatewayTlsValidationContextAcmTrust extends S.Class<VirtualGatewayTlsValidationContextAcmTrust>(
  "VirtualGatewayTlsValidationContextAcmTrust",
)({ certificateAuthorityArns: VirtualGatewayCertificateAuthorityArns }) {}
export class VirtualGatewayTlsValidationContextFileTrust extends S.Class<VirtualGatewayTlsValidationContextFileTrust>(
  "VirtualGatewayTlsValidationContextFileTrust",
)({ certificateChain: S.String }) {}
export class VirtualGatewayTlsValidationContextSdsTrust extends S.Class<VirtualGatewayTlsValidationContextSdsTrust>(
  "VirtualGatewayTlsValidationContextSdsTrust",
)({ secretName: S.String }) {}
export const VirtualGatewayTlsValidationContextTrust = S.Union(
  S.Struct({ acm: VirtualGatewayTlsValidationContextAcmTrust }),
  S.Struct({ file: VirtualGatewayTlsValidationContextFileTrust }),
  S.Struct({ sds: VirtualGatewayTlsValidationContextSdsTrust }),
);
export const SubjectAlternativeNameList = S.Array(S.String);
export class SubjectAlternativeNameMatchers extends S.Class<SubjectAlternativeNameMatchers>(
  "SubjectAlternativeNameMatchers",
)({ exact: SubjectAlternativeNameList }) {}
export class SubjectAlternativeNames extends S.Class<SubjectAlternativeNames>(
  "SubjectAlternativeNames",
)({ match: SubjectAlternativeNameMatchers }) {}
export class VirtualGatewayTlsValidationContext extends S.Class<VirtualGatewayTlsValidationContext>(
  "VirtualGatewayTlsValidationContext",
)({
  trust: VirtualGatewayTlsValidationContextTrust,
  subjectAlternativeNames: S.optional(SubjectAlternativeNames),
}) {}
export class VirtualGatewayClientPolicyTls extends S.Class<VirtualGatewayClientPolicyTls>(
  "VirtualGatewayClientPolicyTls",
)({
  enforce: S.optional(S.Boolean),
  ports: S.optional(PortSet),
  certificate: S.optional(VirtualGatewayClientTlsCertificate),
  validation: VirtualGatewayTlsValidationContext,
}) {}
export class VirtualGatewayClientPolicy extends S.Class<VirtualGatewayClientPolicy>(
  "VirtualGatewayClientPolicy",
)({ tls: S.optional(VirtualGatewayClientPolicyTls) }) {}
export class VirtualGatewayBackendDefaults extends S.Class<VirtualGatewayBackendDefaults>(
  "VirtualGatewayBackendDefaults",
)({ clientPolicy: S.optional(VirtualGatewayClientPolicy) }) {}
export class VirtualGatewayHealthCheckPolicy extends S.Class<VirtualGatewayHealthCheckPolicy>(
  "VirtualGatewayHealthCheckPolicy",
)({
  timeoutMillis: S.Number,
  intervalMillis: S.Number,
  protocol: S.String,
  port: S.optional(S.Number),
  path: S.optional(S.String),
  healthyThreshold: S.Number,
  unhealthyThreshold: S.Number,
}) {}
export class VirtualGatewayPortMapping extends S.Class<VirtualGatewayPortMapping>(
  "VirtualGatewayPortMapping",
)({ port: S.Number, protocol: S.String }) {}
export const VirtualGatewayListenerTlsValidationContextTrust = S.Union(
  S.Struct({ file: VirtualGatewayTlsValidationContextFileTrust }),
  S.Struct({ sds: VirtualGatewayTlsValidationContextSdsTrust }),
);
export class VirtualGatewayListenerTlsValidationContext extends S.Class<VirtualGatewayListenerTlsValidationContext>(
  "VirtualGatewayListenerTlsValidationContext",
)({
  trust: VirtualGatewayListenerTlsValidationContextTrust,
  subjectAlternativeNames: S.optional(SubjectAlternativeNames),
}) {}
export class VirtualGatewayListenerTlsAcmCertificate extends S.Class<VirtualGatewayListenerTlsAcmCertificate>(
  "VirtualGatewayListenerTlsAcmCertificate",
)({ certificateArn: S.String }) {}
export const VirtualGatewayListenerTlsCertificate = S.Union(
  S.Struct({ acm: VirtualGatewayListenerTlsAcmCertificate }),
  S.Struct({ file: VirtualGatewayListenerTlsFileCertificate }),
  S.Struct({ sds: VirtualGatewayListenerTlsSdsCertificate }),
);
export class VirtualGatewayListenerTls extends S.Class<VirtualGatewayListenerTls>(
  "VirtualGatewayListenerTls",
)({
  mode: S.String,
  validation: S.optional(VirtualGatewayListenerTlsValidationContext),
  certificate: VirtualGatewayListenerTlsCertificate,
}) {}
export class VirtualGatewayHttpConnectionPool extends S.Class<VirtualGatewayHttpConnectionPool>(
  "VirtualGatewayHttpConnectionPool",
)({ maxConnections: S.Number, maxPendingRequests: S.optional(S.Number) }) {}
export class VirtualGatewayHttp2ConnectionPool extends S.Class<VirtualGatewayHttp2ConnectionPool>(
  "VirtualGatewayHttp2ConnectionPool",
)({ maxRequests: S.Number }) {}
export class VirtualGatewayGrpcConnectionPool extends S.Class<VirtualGatewayGrpcConnectionPool>(
  "VirtualGatewayGrpcConnectionPool",
)({ maxRequests: S.Number }) {}
export const VirtualGatewayConnectionPool = S.Union(
  S.Struct({ http: VirtualGatewayHttpConnectionPool }),
  S.Struct({ http2: VirtualGatewayHttp2ConnectionPool }),
  S.Struct({ grpc: VirtualGatewayGrpcConnectionPool }),
);
export class VirtualGatewayListener extends S.Class<VirtualGatewayListener>(
  "VirtualGatewayListener",
)({
  healthCheck: S.optional(VirtualGatewayHealthCheckPolicy),
  portMapping: VirtualGatewayPortMapping,
  tls: S.optional(VirtualGatewayListenerTls),
  connectionPool: S.optional(VirtualGatewayConnectionPool),
}) {}
export const VirtualGatewayListeners = S.Array(VirtualGatewayListener);
export class JsonFormatRef extends S.Class<JsonFormatRef>("JsonFormatRef")({
  key: S.String,
  value: S.String,
}) {}
export const JsonFormat = S.Array(JsonFormatRef);
export const LoggingFormat = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ json: JsonFormat }),
);
export class VirtualGatewayFileAccessLog extends S.Class<VirtualGatewayFileAccessLog>(
  "VirtualGatewayFileAccessLog",
)({ path: S.String, format: S.optional(LoggingFormat) }) {}
export const VirtualGatewayAccessLog = S.Union(
  S.Struct({ file: VirtualGatewayFileAccessLog }),
);
export class VirtualGatewayLogging extends S.Class<VirtualGatewayLogging>(
  "VirtualGatewayLogging",
)({ accessLog: S.optional(VirtualGatewayAccessLog) }) {}
export class VirtualGatewaySpec extends S.Class<VirtualGatewaySpec>(
  "VirtualGatewaySpec",
)({
  backendDefaults: S.optional(VirtualGatewayBackendDefaults),
  listeners: VirtualGatewayListeners,
  logging: S.optional(VirtualGatewayLogging),
}) {}
export class UpdateVirtualGatewayInput extends S.Class<UpdateVirtualGatewayInput>(
  "UpdateVirtualGatewayInput",
)(
  {
    virtualGatewayName: S.String.pipe(T.HttpLabel("virtualGatewayName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: VirtualGatewaySpec,
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualGateways/{virtualGatewayName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVirtualGatewayInput extends S.Class<DeleteVirtualGatewayInput>(
  "DeleteVirtualGatewayInput",
)(
  {
    virtualGatewayName: S.String.pipe(T.HttpLabel("virtualGatewayName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v20190125/meshes/{meshName}/virtualGateways/{virtualGatewayName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVirtualGatewaysInput extends S.Class<ListVirtualGatewaysInput>(
  "ListVirtualGatewaysInput",
)(
  {
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualGateways",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGatewayRouteInput extends S.Class<DescribeGatewayRouteInput>(
  "DescribeGatewayRouteInput",
)(
  {
    gatewayRouteName: S.String.pipe(T.HttpLabel("gatewayRouteName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualGatewayName: S.String.pipe(T.HttpLabel("virtualGatewayName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualGateway/{virtualGatewayName}/gatewayRoutes/{gatewayRouteName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class HttpPathMatch extends S.Class<HttpPathMatch>("HttpPathMatch")({
  exact: S.optional(S.String),
  regex: S.optional(S.String),
}) {}
export class QueryParameterMatch extends S.Class<QueryParameterMatch>(
  "QueryParameterMatch",
)({ exact: S.optional(S.String) }) {}
export class HttpQueryParameter extends S.Class<HttpQueryParameter>(
  "HttpQueryParameter",
)({ name: S.String, match: S.optional(QueryParameterMatch) }) {}
export const HttpQueryParameters = S.Array(HttpQueryParameter);
export class GatewayRouteHostnameMatch extends S.Class<GatewayRouteHostnameMatch>(
  "GatewayRouteHostnameMatch",
)({ exact: S.optional(S.String), suffix: S.optional(S.String) }) {}
export class MatchRange extends S.Class<MatchRange>("MatchRange")({
  start: S.Number,
  end: S.Number,
}) {}
export const HeaderMatchMethod = S.Union(
  S.Struct({ exact: S.String }),
  S.Struct({ regex: S.String }),
  S.Struct({ range: MatchRange }),
  S.Struct({ prefix: S.String }),
  S.Struct({ suffix: S.String }),
);
export class HttpGatewayRouteHeader extends S.Class<HttpGatewayRouteHeader>(
  "HttpGatewayRouteHeader",
)({
  name: S.String,
  invert: S.optional(S.Boolean),
  match: S.optional(HeaderMatchMethod),
}) {}
export const HttpGatewayRouteHeaders = S.Array(HttpGatewayRouteHeader);
export class HttpGatewayRouteMatch extends S.Class<HttpGatewayRouteMatch>(
  "HttpGatewayRouteMatch",
)({
  prefix: S.optional(S.String),
  path: S.optional(HttpPathMatch),
  queryParameters: S.optional(HttpQueryParameters),
  method: S.optional(S.String),
  hostname: S.optional(GatewayRouteHostnameMatch),
  headers: S.optional(HttpGatewayRouteHeaders),
  port: S.optional(S.Number),
}) {}
export class GatewayRouteVirtualService extends S.Class<GatewayRouteVirtualService>(
  "GatewayRouteVirtualService",
)({ virtualServiceName: S.String }) {}
export class GatewayRouteTarget extends S.Class<GatewayRouteTarget>(
  "GatewayRouteTarget",
)({ virtualService: GatewayRouteVirtualService, port: S.optional(S.Number) }) {}
export class HttpGatewayRoutePrefixRewrite extends S.Class<HttpGatewayRoutePrefixRewrite>(
  "HttpGatewayRoutePrefixRewrite",
)({ defaultPrefix: S.optional(S.String), value: S.optional(S.String) }) {}
export class HttpGatewayRoutePathRewrite extends S.Class<HttpGatewayRoutePathRewrite>(
  "HttpGatewayRoutePathRewrite",
)({ exact: S.optional(S.String) }) {}
export class GatewayRouteHostnameRewrite extends S.Class<GatewayRouteHostnameRewrite>(
  "GatewayRouteHostnameRewrite",
)({ defaultTargetHostname: S.optional(S.String) }) {}
export class HttpGatewayRouteRewrite extends S.Class<HttpGatewayRouteRewrite>(
  "HttpGatewayRouteRewrite",
)({
  prefix: S.optional(HttpGatewayRoutePrefixRewrite),
  path: S.optional(HttpGatewayRoutePathRewrite),
  hostname: S.optional(GatewayRouteHostnameRewrite),
}) {}
export class HttpGatewayRouteAction extends S.Class<HttpGatewayRouteAction>(
  "HttpGatewayRouteAction",
)({
  target: GatewayRouteTarget,
  rewrite: S.optional(HttpGatewayRouteRewrite),
}) {}
export class HttpGatewayRoute extends S.Class<HttpGatewayRoute>(
  "HttpGatewayRoute",
)({ match: HttpGatewayRouteMatch, action: HttpGatewayRouteAction }) {}
export const GrpcMetadataMatchMethod = S.Union(
  S.Struct({ exact: S.String }),
  S.Struct({ regex: S.String }),
  S.Struct({ range: MatchRange }),
  S.Struct({ prefix: S.String }),
  S.Struct({ suffix: S.String }),
);
export class GrpcGatewayRouteMetadata extends S.Class<GrpcGatewayRouteMetadata>(
  "GrpcGatewayRouteMetadata",
)({
  name: S.String,
  invert: S.optional(S.Boolean),
  match: S.optional(GrpcMetadataMatchMethod),
}) {}
export const GrpcGatewayRouteMetadataList = S.Array(GrpcGatewayRouteMetadata);
export class GrpcGatewayRouteMatch extends S.Class<GrpcGatewayRouteMatch>(
  "GrpcGatewayRouteMatch",
)({
  serviceName: S.optional(S.String),
  hostname: S.optional(GatewayRouteHostnameMatch),
  metadata: S.optional(GrpcGatewayRouteMetadataList),
  port: S.optional(S.Number),
}) {}
export class GrpcGatewayRouteRewrite extends S.Class<GrpcGatewayRouteRewrite>(
  "GrpcGatewayRouteRewrite",
)({ hostname: S.optional(GatewayRouteHostnameRewrite) }) {}
export class GrpcGatewayRouteAction extends S.Class<GrpcGatewayRouteAction>(
  "GrpcGatewayRouteAction",
)({
  target: GatewayRouteTarget,
  rewrite: S.optional(GrpcGatewayRouteRewrite),
}) {}
export class GrpcGatewayRoute extends S.Class<GrpcGatewayRoute>(
  "GrpcGatewayRoute",
)({ match: GrpcGatewayRouteMatch, action: GrpcGatewayRouteAction }) {}
export class GatewayRouteSpec extends S.Class<GatewayRouteSpec>(
  "GatewayRouteSpec",
)({
  priority: S.optional(S.Number),
  httpRoute: S.optional(HttpGatewayRoute),
  http2Route: S.optional(HttpGatewayRoute),
  grpcRoute: S.optional(GrpcGatewayRoute),
}) {}
export class UpdateGatewayRouteInput extends S.Class<UpdateGatewayRouteInput>(
  "UpdateGatewayRouteInput",
)(
  {
    gatewayRouteName: S.String.pipe(T.HttpLabel("gatewayRouteName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualGatewayName: S.String.pipe(T.HttpLabel("virtualGatewayName")),
    spec: GatewayRouteSpec,
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualGateway/{virtualGatewayName}/gatewayRoutes/{gatewayRouteName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGatewayRouteInput extends S.Class<DeleteGatewayRouteInput>(
  "DeleteGatewayRouteInput",
)(
  {
    gatewayRouteName: S.String.pipe(T.HttpLabel("gatewayRouteName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualGatewayName: S.String.pipe(T.HttpLabel("virtualGatewayName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v20190125/meshes/{meshName}/virtualGateway/{virtualGatewayName}/gatewayRoutes/{gatewayRouteName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGatewayRoutesInput extends S.Class<ListGatewayRoutesInput>(
  "ListGatewayRoutesInput",
)(
  {
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualGatewayName: S.String.pipe(T.HttpLabel("virtualGatewayName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualGateway/{virtualGatewayName}/gatewayRoutes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVirtualNodeInput extends S.Class<DescribeVirtualNodeInput>(
  "DescribeVirtualNodeInput",
)(
  {
    virtualNodeName: S.String.pipe(T.HttpLabel("virtualNodeName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualNodes/{virtualNodeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DnsServiceDiscovery extends S.Class<DnsServiceDiscovery>(
  "DnsServiceDiscovery",
)({
  hostname: S.String,
  responseType: S.optional(S.String),
  ipPreference: S.optional(S.String),
}) {}
export class AwsCloudMapInstanceAttribute extends S.Class<AwsCloudMapInstanceAttribute>(
  "AwsCloudMapInstanceAttribute",
)({ key: S.String, value: S.String }) {}
export const AwsCloudMapInstanceAttributes = S.Array(
  AwsCloudMapInstanceAttribute,
);
export class AwsCloudMapServiceDiscovery extends S.Class<AwsCloudMapServiceDiscovery>(
  "AwsCloudMapServiceDiscovery",
)({
  namespaceName: S.String,
  serviceName: S.String,
  attributes: S.optional(AwsCloudMapInstanceAttributes),
  ipPreference: S.optional(S.String),
}) {}
export const ServiceDiscovery = S.Union(
  S.Struct({ dns: DnsServiceDiscovery }),
  S.Struct({ awsCloudMap: AwsCloudMapServiceDiscovery }),
);
export class PortMapping extends S.Class<PortMapping>("PortMapping")({
  port: S.Number,
  protocol: S.String,
}) {}
export class ListenerTlsAcmCertificate extends S.Class<ListenerTlsAcmCertificate>(
  "ListenerTlsAcmCertificate",
)({ certificateArn: S.String }) {}
export class ListenerTlsFileCertificate extends S.Class<ListenerTlsFileCertificate>(
  "ListenerTlsFileCertificate",
)({ certificateChain: S.String, privateKey: S.String }) {}
export class ListenerTlsSdsCertificate extends S.Class<ListenerTlsSdsCertificate>(
  "ListenerTlsSdsCertificate",
)({ secretName: S.String }) {}
export const ListenerTlsCertificate = S.Union(
  S.Struct({ acm: ListenerTlsAcmCertificate }),
  S.Struct({ file: ListenerTlsFileCertificate }),
  S.Struct({ sds: ListenerTlsSdsCertificate }),
);
export class TlsValidationContextFileTrust extends S.Class<TlsValidationContextFileTrust>(
  "TlsValidationContextFileTrust",
)({ certificateChain: S.String }) {}
export class TlsValidationContextSdsTrust extends S.Class<TlsValidationContextSdsTrust>(
  "TlsValidationContextSdsTrust",
)({ secretName: S.String }) {}
export const ListenerTlsValidationContextTrust = S.Union(
  S.Struct({ file: TlsValidationContextFileTrust }),
  S.Struct({ sds: TlsValidationContextSdsTrust }),
);
export class ListenerTlsValidationContext extends S.Class<ListenerTlsValidationContext>(
  "ListenerTlsValidationContext",
)({
  trust: ListenerTlsValidationContextTrust,
  subjectAlternativeNames: S.optional(SubjectAlternativeNames),
}) {}
export class ListenerTls extends S.Class<ListenerTls>("ListenerTls")({
  mode: S.String,
  certificate: ListenerTlsCertificate,
  validation: S.optional(ListenerTlsValidationContext),
}) {}
export class HealthCheckPolicy extends S.Class<HealthCheckPolicy>(
  "HealthCheckPolicy",
)({
  timeoutMillis: S.Number,
  intervalMillis: S.Number,
  protocol: S.String,
  port: S.optional(S.Number),
  path: S.optional(S.String),
  healthyThreshold: S.Number,
  unhealthyThreshold: S.Number,
}) {}
export class Duration extends S.Class<Duration>("Duration")({
  value: S.optional(S.Number),
  unit: S.optional(S.String),
}) {}
export class TcpTimeout extends S.Class<TcpTimeout>("TcpTimeout")({
  idle: S.optional(Duration),
}) {}
export class HttpTimeout extends S.Class<HttpTimeout>("HttpTimeout")({
  perRequest: S.optional(Duration),
  idle: S.optional(Duration),
}) {}
export class GrpcTimeout extends S.Class<GrpcTimeout>("GrpcTimeout")({
  perRequest: S.optional(Duration),
  idle: S.optional(Duration),
}) {}
export const ListenerTimeout = S.Union(
  S.Struct({ tcp: TcpTimeout }),
  S.Struct({ http: HttpTimeout }),
  S.Struct({ http2: HttpTimeout }),
  S.Struct({ grpc: GrpcTimeout }),
);
export class OutlierDetection extends S.Class<OutlierDetection>(
  "OutlierDetection",
)({
  maxServerErrors: S.Number,
  interval: Duration,
  baseEjectionDuration: Duration,
  maxEjectionPercent: S.Number,
}) {}
export class VirtualNodeTcpConnectionPool extends S.Class<VirtualNodeTcpConnectionPool>(
  "VirtualNodeTcpConnectionPool",
)({ maxConnections: S.Number }) {}
export class VirtualNodeHttpConnectionPool extends S.Class<VirtualNodeHttpConnectionPool>(
  "VirtualNodeHttpConnectionPool",
)({ maxConnections: S.Number, maxPendingRequests: S.optional(S.Number) }) {}
export class VirtualNodeHttp2ConnectionPool extends S.Class<VirtualNodeHttp2ConnectionPool>(
  "VirtualNodeHttp2ConnectionPool",
)({ maxRequests: S.Number }) {}
export class VirtualNodeGrpcConnectionPool extends S.Class<VirtualNodeGrpcConnectionPool>(
  "VirtualNodeGrpcConnectionPool",
)({ maxRequests: S.Number }) {}
export const VirtualNodeConnectionPool = S.Union(
  S.Struct({ tcp: VirtualNodeTcpConnectionPool }),
  S.Struct({ http: VirtualNodeHttpConnectionPool }),
  S.Struct({ http2: VirtualNodeHttp2ConnectionPool }),
  S.Struct({ grpc: VirtualNodeGrpcConnectionPool }),
);
export class Listener extends S.Class<Listener>("Listener")({
  portMapping: PortMapping,
  tls: S.optional(ListenerTls),
  healthCheck: S.optional(HealthCheckPolicy),
  timeout: S.optional(ListenerTimeout),
  outlierDetection: S.optional(OutlierDetection),
  connectionPool: S.optional(VirtualNodeConnectionPool),
}) {}
export const Listeners = S.Array(Listener);
export const ClientTlsCertificate = S.Union(
  S.Struct({ file: ListenerTlsFileCertificate }),
  S.Struct({ sds: ListenerTlsSdsCertificate }),
);
export const CertificateAuthorityArns = S.Array(S.String);
export class TlsValidationContextAcmTrust extends S.Class<TlsValidationContextAcmTrust>(
  "TlsValidationContextAcmTrust",
)({ certificateAuthorityArns: CertificateAuthorityArns }) {}
export const TlsValidationContextTrust = S.Union(
  S.Struct({ acm: TlsValidationContextAcmTrust }),
  S.Struct({ file: TlsValidationContextFileTrust }),
  S.Struct({ sds: TlsValidationContextSdsTrust }),
);
export class TlsValidationContext extends S.Class<TlsValidationContext>(
  "TlsValidationContext",
)({
  trust: TlsValidationContextTrust,
  subjectAlternativeNames: S.optional(SubjectAlternativeNames),
}) {}
export class ClientPolicyTls extends S.Class<ClientPolicyTls>(
  "ClientPolicyTls",
)({
  enforce: S.optional(S.Boolean),
  ports: S.optional(PortSet),
  certificate: S.optional(ClientTlsCertificate),
  validation: TlsValidationContext,
}) {}
export class ClientPolicy extends S.Class<ClientPolicy>("ClientPolicy")({
  tls: S.optional(ClientPolicyTls),
}) {}
export class VirtualServiceBackend extends S.Class<VirtualServiceBackend>(
  "VirtualServiceBackend",
)({ virtualServiceName: S.String, clientPolicy: S.optional(ClientPolicy) }) {}
export const Backend = S.Union(
  S.Struct({ virtualService: VirtualServiceBackend }),
);
export const Backends = S.Array(Backend);
export class BackendDefaults extends S.Class<BackendDefaults>(
  "BackendDefaults",
)({ clientPolicy: S.optional(ClientPolicy) }) {}
export class FileAccessLog extends S.Class<FileAccessLog>("FileAccessLog")({
  path: S.String,
  format: S.optional(LoggingFormat),
}) {}
export const AccessLog = S.Union(S.Struct({ file: FileAccessLog }));
export class Logging extends S.Class<Logging>("Logging")({
  accessLog: S.optional(AccessLog),
}) {}
export class VirtualNodeSpec extends S.Class<VirtualNodeSpec>(
  "VirtualNodeSpec",
)({
  serviceDiscovery: S.optional(ServiceDiscovery),
  listeners: S.optional(Listeners),
  backends: S.optional(Backends),
  backendDefaults: S.optional(BackendDefaults),
  logging: S.optional(Logging),
}) {}
export class UpdateVirtualNodeInput extends S.Class<UpdateVirtualNodeInput>(
  "UpdateVirtualNodeInput",
)(
  {
    virtualNodeName: S.String.pipe(T.HttpLabel("virtualNodeName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: VirtualNodeSpec,
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualNodes/{virtualNodeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVirtualNodeInput extends S.Class<DeleteVirtualNodeInput>(
  "DeleteVirtualNodeInput",
)(
  {
    virtualNodeName: S.String.pipe(T.HttpLabel("virtualNodeName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v20190125/meshes/{meshName}/virtualNodes/{virtualNodeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVirtualNodesInput extends S.Class<ListVirtualNodesInput>(
  "ListVirtualNodesInput",
)(
  {
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v20190125/meshes/{meshName}/virtualNodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVirtualRouterInput extends S.Class<DescribeVirtualRouterInput>(
  "DescribeVirtualRouterInput",
)(
  {
    virtualRouterName: S.String.pipe(T.HttpLabel("virtualRouterName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualRouters/{virtualRouterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VirtualRouterListener extends S.Class<VirtualRouterListener>(
  "VirtualRouterListener",
)({ portMapping: PortMapping }) {}
export const VirtualRouterListeners = S.Array(VirtualRouterListener);
export class VirtualRouterSpec extends S.Class<VirtualRouterSpec>(
  "VirtualRouterSpec",
)({ listeners: S.optional(VirtualRouterListeners) }) {}
export class UpdateVirtualRouterInput extends S.Class<UpdateVirtualRouterInput>(
  "UpdateVirtualRouterInput",
)(
  {
    virtualRouterName: S.String.pipe(T.HttpLabel("virtualRouterName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: VirtualRouterSpec,
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualRouters/{virtualRouterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVirtualRouterInput extends S.Class<DeleteVirtualRouterInput>(
  "DeleteVirtualRouterInput",
)(
  {
    virtualRouterName: S.String.pipe(T.HttpLabel("virtualRouterName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v20190125/meshes/{meshName}/virtualRouters/{virtualRouterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVirtualRoutersInput extends S.Class<ListVirtualRoutersInput>(
  "ListVirtualRoutersInput",
)(
  {
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualRouters",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRouteInput extends S.Class<DescribeRouteInput>(
  "DescribeRouteInput",
)(
  {
    routeName: S.String.pipe(T.HttpLabel("routeName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
    virtualRouterName: S.String.pipe(T.HttpLabel("virtualRouterName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualRouter/{virtualRouterName}/routes/{routeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class HttpRouteHeader extends S.Class<HttpRouteHeader>(
  "HttpRouteHeader",
)({
  name: S.String,
  invert: S.optional(S.Boolean),
  match: S.optional(HeaderMatchMethod),
}) {}
export const HttpRouteHeaders = S.Array(HttpRouteHeader);
export class HttpRouteMatch extends S.Class<HttpRouteMatch>("HttpRouteMatch")({
  prefix: S.optional(S.String),
  path: S.optional(HttpPathMatch),
  queryParameters: S.optional(HttpQueryParameters),
  method: S.optional(S.String),
  scheme: S.optional(S.String),
  headers: S.optional(HttpRouteHeaders),
  port: S.optional(S.Number),
}) {}
export class WeightedTarget extends S.Class<WeightedTarget>("WeightedTarget")({
  virtualNode: S.String,
  weight: S.Number,
  port: S.optional(S.Number),
}) {}
export const WeightedTargets = S.Array(WeightedTarget);
export class HttpRouteAction extends S.Class<HttpRouteAction>(
  "HttpRouteAction",
)({ weightedTargets: WeightedTargets }) {}
export const HttpRetryPolicyEvents = S.Array(S.String);
export const TcpRetryPolicyEvents = S.Array(S.String);
export class HttpRetryPolicy extends S.Class<HttpRetryPolicy>(
  "HttpRetryPolicy",
)({
  perRetryTimeout: Duration,
  maxRetries: S.Number,
  httpRetryEvents: S.optional(HttpRetryPolicyEvents),
  tcpRetryEvents: S.optional(TcpRetryPolicyEvents),
}) {}
export class HttpRoute extends S.Class<HttpRoute>("HttpRoute")({
  match: HttpRouteMatch,
  action: HttpRouteAction,
  retryPolicy: S.optional(HttpRetryPolicy),
  timeout: S.optional(HttpTimeout),
}) {}
export class TcpRouteAction extends S.Class<TcpRouteAction>("TcpRouteAction")({
  weightedTargets: WeightedTargets,
}) {}
export class TcpRouteMatch extends S.Class<TcpRouteMatch>("TcpRouteMatch")({
  port: S.optional(S.Number),
}) {}
export class TcpRoute extends S.Class<TcpRoute>("TcpRoute")({
  action: TcpRouteAction,
  timeout: S.optional(TcpTimeout),
  match: S.optional(TcpRouteMatch),
}) {}
export class GrpcRouteAction extends S.Class<GrpcRouteAction>(
  "GrpcRouteAction",
)({ weightedTargets: WeightedTargets }) {}
export const GrpcRouteMetadataMatchMethod = S.Union(
  S.Struct({ exact: S.String }),
  S.Struct({ regex: S.String }),
  S.Struct({ range: MatchRange }),
  S.Struct({ prefix: S.String }),
  S.Struct({ suffix: S.String }),
);
export class GrpcRouteMetadata extends S.Class<GrpcRouteMetadata>(
  "GrpcRouteMetadata",
)({
  name: S.String,
  invert: S.optional(S.Boolean),
  match: S.optional(GrpcRouteMetadataMatchMethod),
}) {}
export const GrpcRouteMetadataList = S.Array(GrpcRouteMetadata);
export class GrpcRouteMatch extends S.Class<GrpcRouteMatch>("GrpcRouteMatch")({
  serviceName: S.optional(S.String),
  methodName: S.optional(S.String),
  metadata: S.optional(GrpcRouteMetadataList),
  port: S.optional(S.Number),
}) {}
export const GrpcRetryPolicyEvents = S.Array(S.String);
export class GrpcRetryPolicy extends S.Class<GrpcRetryPolicy>(
  "GrpcRetryPolicy",
)({
  perRetryTimeout: Duration,
  maxRetries: S.Number,
  httpRetryEvents: S.optional(HttpRetryPolicyEvents),
  tcpRetryEvents: S.optional(TcpRetryPolicyEvents),
  grpcRetryEvents: S.optional(GrpcRetryPolicyEvents),
}) {}
export class GrpcRoute extends S.Class<GrpcRoute>("GrpcRoute")({
  action: GrpcRouteAction,
  match: GrpcRouteMatch,
  retryPolicy: S.optional(GrpcRetryPolicy),
  timeout: S.optional(GrpcTimeout),
}) {}
export class RouteSpec extends S.Class<RouteSpec>("RouteSpec")({
  priority: S.optional(S.Number),
  httpRoute: S.optional(HttpRoute),
  tcpRoute: S.optional(TcpRoute),
  http2Route: S.optional(HttpRoute),
  grpcRoute: S.optional(GrpcRoute),
}) {}
export class UpdateRouteInput extends S.Class<UpdateRouteInput>(
  "UpdateRouteInput",
)(
  {
    routeName: S.String.pipe(T.HttpLabel("routeName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualRouterName: S.String.pipe(T.HttpLabel("virtualRouterName")),
    spec: RouteSpec,
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualRouter/{virtualRouterName}/routes/{routeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouteInput extends S.Class<DeleteRouteInput>(
  "DeleteRouteInput",
)(
  {
    routeName: S.String.pipe(T.HttpLabel("routeName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualRouterName: S.String.pipe(T.HttpLabel("virtualRouterName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v20190125/meshes/{meshName}/virtualRouter/{virtualRouterName}/routes/{routeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoutesInput extends S.Class<ListRoutesInput>(
  "ListRoutesInput",
)(
  {
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualRouterName: S.String.pipe(T.HttpLabel("virtualRouterName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualRouter/{virtualRouterName}/routes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVirtualServiceInput extends S.Class<DescribeVirtualServiceInput>(
  "DescribeVirtualServiceInput",
)(
  {
    virtualServiceName: S.String.pipe(T.HttpLabel("virtualServiceName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualServices/{virtualServiceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VirtualNodeServiceProvider extends S.Class<VirtualNodeServiceProvider>(
  "VirtualNodeServiceProvider",
)({ virtualNodeName: S.String }) {}
export class VirtualRouterServiceProvider extends S.Class<VirtualRouterServiceProvider>(
  "VirtualRouterServiceProvider",
)({ virtualRouterName: S.String }) {}
export const VirtualServiceProvider = S.Union(
  S.Struct({ virtualNode: VirtualNodeServiceProvider }),
  S.Struct({ virtualRouter: VirtualRouterServiceProvider }),
);
export class VirtualServiceSpec extends S.Class<VirtualServiceSpec>(
  "VirtualServiceSpec",
)({ provider: S.optional(VirtualServiceProvider) }) {}
export class UpdateVirtualServiceInput extends S.Class<UpdateVirtualServiceInput>(
  "UpdateVirtualServiceInput",
)(
  {
    virtualServiceName: S.String.pipe(T.HttpLabel("virtualServiceName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: VirtualServiceSpec,
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualServices/{virtualServiceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVirtualServiceInput extends S.Class<DeleteVirtualServiceInput>(
  "DeleteVirtualServiceInput",
)(
  {
    virtualServiceName: S.String.pipe(T.HttpLabel("virtualServiceName")),
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v20190125/meshes/{meshName}/virtualServices/{virtualServiceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVirtualServicesInput extends S.Class<ListVirtualServicesInput>(
  "ListVirtualServicesInput",
)(
  {
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20190125/meshes/{meshName}/virtualServices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagRef extends S.Class<TagRef>("TagRef")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(TagRef);
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: TagList, nextToken: S.optional(S.String) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")), tags: TagList },
  T.all(
    T.Http({ method: "PUT", uri: "/v20190125/tag" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class ResourceMetadata extends S.Class<ResourceMetadata>(
  "ResourceMetadata",
)({
  arn: S.String,
  version: S.Number,
  uid: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  meshOwner: S.String,
  resourceOwner: S.String,
}) {}
export class MeshStatus extends S.Class<MeshStatus>("MeshStatus")({
  status: S.optional(S.String),
}) {}
export class MeshData extends S.Class<MeshData>("MeshData")({
  meshName: S.String,
  spec: MeshSpec,
  metadata: ResourceMetadata,
  status: MeshStatus,
}) {}
export class UpdateMeshOutput extends S.Class<UpdateMeshOutput>(
  "UpdateMeshOutput",
)({ mesh: MeshData.pipe(T.HttpPayload()) }) {}
export class DeleteMeshOutput extends S.Class<DeleteMeshOutput>(
  "DeleteMeshOutput",
)({ mesh: MeshData.pipe(T.HttpPayload()) }) {}
export class VirtualGatewayStatus extends S.Class<VirtualGatewayStatus>(
  "VirtualGatewayStatus",
)({ status: S.String }) {}
export class VirtualGatewayData extends S.Class<VirtualGatewayData>(
  "VirtualGatewayData",
)({
  meshName: S.String,
  virtualGatewayName: S.String,
  spec: VirtualGatewaySpec,
  metadata: ResourceMetadata,
  status: VirtualGatewayStatus,
}) {}
export class UpdateVirtualGatewayOutput extends S.Class<UpdateVirtualGatewayOutput>(
  "UpdateVirtualGatewayOutput",
)({ virtualGateway: VirtualGatewayData.pipe(T.HttpPayload()) }) {}
export class DeleteVirtualGatewayOutput extends S.Class<DeleteVirtualGatewayOutput>(
  "DeleteVirtualGatewayOutput",
)({ virtualGateway: VirtualGatewayData.pipe(T.HttpPayload()) }) {}
export class GatewayRouteStatus extends S.Class<GatewayRouteStatus>(
  "GatewayRouteStatus",
)({ status: S.String }) {}
export class GatewayRouteData extends S.Class<GatewayRouteData>(
  "GatewayRouteData",
)({
  meshName: S.String,
  gatewayRouteName: S.String,
  virtualGatewayName: S.String,
  spec: GatewayRouteSpec,
  metadata: ResourceMetadata,
  status: GatewayRouteStatus,
}) {}
export class UpdateGatewayRouteOutput extends S.Class<UpdateGatewayRouteOutput>(
  "UpdateGatewayRouteOutput",
)({ gatewayRoute: GatewayRouteData.pipe(T.HttpPayload()) }) {}
export class DeleteGatewayRouteOutput extends S.Class<DeleteGatewayRouteOutput>(
  "DeleteGatewayRouteOutput",
)({ gatewayRoute: GatewayRouteData.pipe(T.HttpPayload()) }) {}
export class VirtualNodeStatus extends S.Class<VirtualNodeStatus>(
  "VirtualNodeStatus",
)({ status: S.String }) {}
export class VirtualNodeData extends S.Class<VirtualNodeData>(
  "VirtualNodeData",
)({
  meshName: S.String,
  virtualNodeName: S.String,
  spec: VirtualNodeSpec,
  metadata: ResourceMetadata,
  status: VirtualNodeStatus,
}) {}
export class UpdateVirtualNodeOutput extends S.Class<UpdateVirtualNodeOutput>(
  "UpdateVirtualNodeOutput",
)({ virtualNode: VirtualNodeData.pipe(T.HttpPayload()) }) {}
export class DeleteVirtualNodeOutput extends S.Class<DeleteVirtualNodeOutput>(
  "DeleteVirtualNodeOutput",
)({ virtualNode: VirtualNodeData.pipe(T.HttpPayload()) }) {}
export class VirtualRouterStatus extends S.Class<VirtualRouterStatus>(
  "VirtualRouterStatus",
)({ status: S.String }) {}
export class VirtualRouterData extends S.Class<VirtualRouterData>(
  "VirtualRouterData",
)({
  meshName: S.String,
  virtualRouterName: S.String,
  spec: VirtualRouterSpec,
  metadata: ResourceMetadata,
  status: VirtualRouterStatus,
}) {}
export class UpdateVirtualRouterOutput extends S.Class<UpdateVirtualRouterOutput>(
  "UpdateVirtualRouterOutput",
)({ virtualRouter: VirtualRouterData.pipe(T.HttpPayload()) }) {}
export class DeleteVirtualRouterOutput extends S.Class<DeleteVirtualRouterOutput>(
  "DeleteVirtualRouterOutput",
)({ virtualRouter: VirtualRouterData.pipe(T.HttpPayload()) }) {}
export class RouteStatus extends S.Class<RouteStatus>("RouteStatus")({
  status: S.String,
}) {}
export class RouteData extends S.Class<RouteData>("RouteData")({
  meshName: S.String,
  virtualRouterName: S.String,
  routeName: S.String,
  spec: RouteSpec,
  metadata: ResourceMetadata,
  status: RouteStatus,
}) {}
export class UpdateRouteOutput extends S.Class<UpdateRouteOutput>(
  "UpdateRouteOutput",
)({ route: RouteData.pipe(T.HttpPayload()) }) {}
export class DeleteRouteOutput extends S.Class<DeleteRouteOutput>(
  "DeleteRouteOutput",
)({ route: RouteData.pipe(T.HttpPayload()) }) {}
export class VirtualServiceStatus extends S.Class<VirtualServiceStatus>(
  "VirtualServiceStatus",
)({ status: S.String }) {}
export class VirtualServiceData extends S.Class<VirtualServiceData>(
  "VirtualServiceData",
)({
  meshName: S.String,
  virtualServiceName: S.String,
  spec: VirtualServiceSpec,
  metadata: ResourceMetadata,
  status: VirtualServiceStatus,
}) {}
export class UpdateVirtualServiceOutput extends S.Class<UpdateVirtualServiceOutput>(
  "UpdateVirtualServiceOutput",
)({ virtualService: VirtualServiceData.pipe(T.HttpPayload()) }) {}
export class DeleteVirtualServiceOutput extends S.Class<DeleteVirtualServiceOutput>(
  "DeleteVirtualServiceOutput",
)({ virtualService: VirtualServiceData.pipe(T.HttpPayload()) }) {}
export class MeshRef extends S.Class<MeshRef>("MeshRef")({
  meshName: S.String,
  meshOwner: S.String,
  resourceOwner: S.String,
  arn: S.String,
  version: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const MeshList = S.Array(MeshRef);
export class VirtualGatewayRef extends S.Class<VirtualGatewayRef>(
  "VirtualGatewayRef",
)({
  meshName: S.String,
  virtualGatewayName: S.String,
  meshOwner: S.String,
  resourceOwner: S.String,
  arn: S.String,
  version: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const VirtualGatewayList = S.Array(VirtualGatewayRef);
export class GatewayRouteRef extends S.Class<GatewayRouteRef>(
  "GatewayRouteRef",
)({
  meshName: S.String,
  gatewayRouteName: S.String,
  virtualGatewayName: S.String,
  meshOwner: S.String,
  resourceOwner: S.String,
  arn: S.String,
  version: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const GatewayRouteList = S.Array(GatewayRouteRef);
export class VirtualNodeRef extends S.Class<VirtualNodeRef>("VirtualNodeRef")({
  meshName: S.String,
  virtualNodeName: S.String,
  meshOwner: S.String,
  resourceOwner: S.String,
  arn: S.String,
  version: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const VirtualNodeList = S.Array(VirtualNodeRef);
export class VirtualRouterRef extends S.Class<VirtualRouterRef>(
  "VirtualRouterRef",
)({
  meshName: S.String,
  virtualRouterName: S.String,
  meshOwner: S.String,
  resourceOwner: S.String,
  arn: S.String,
  version: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const VirtualRouterList = S.Array(VirtualRouterRef);
export class RouteRef extends S.Class<RouteRef>("RouteRef")({
  meshName: S.String,
  virtualRouterName: S.String,
  routeName: S.String,
  meshOwner: S.String,
  resourceOwner: S.String,
  arn: S.String,
  version: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const RouteList = S.Array(RouteRef);
export class VirtualServiceRef extends S.Class<VirtualServiceRef>(
  "VirtualServiceRef",
)({
  meshName: S.String,
  virtualServiceName: S.String,
  meshOwner: S.String,
  resourceOwner: S.String,
  arn: S.String,
  version: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const VirtualServiceList = S.Array(VirtualServiceRef);
export class CreateMeshInput extends S.Class<CreateMeshInput>(
  "CreateMeshInput",
)(
  {
    meshName: S.String,
    spec: S.optional(MeshSpec),
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v20190125/meshes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMeshesOutput extends S.Class<ListMeshesOutput>(
  "ListMeshesOutput",
)({ meshes: MeshList, nextToken: S.optional(S.String) }) {}
export class ListVirtualGatewaysOutput extends S.Class<ListVirtualGatewaysOutput>(
  "ListVirtualGatewaysOutput",
)({ virtualGateways: VirtualGatewayList, nextToken: S.optional(S.String) }) {}
export class ListGatewayRoutesOutput extends S.Class<ListGatewayRoutesOutput>(
  "ListGatewayRoutesOutput",
)({ gatewayRoutes: GatewayRouteList, nextToken: S.optional(S.String) }) {}
export class ListVirtualNodesOutput extends S.Class<ListVirtualNodesOutput>(
  "ListVirtualNodesOutput",
)({ virtualNodes: VirtualNodeList, nextToken: S.optional(S.String) }) {}
export class CreateVirtualRouterInput extends S.Class<CreateVirtualRouterInput>(
  "CreateVirtualRouterInput",
)(
  {
    virtualRouterName: S.String,
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: VirtualRouterSpec,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualRouters",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVirtualRoutersOutput extends S.Class<ListVirtualRoutersOutput>(
  "ListVirtualRoutersOutput",
)({ virtualRouters: VirtualRouterList, nextToken: S.optional(S.String) }) {}
export class ListRoutesOutput extends S.Class<ListRoutesOutput>(
  "ListRoutesOutput",
)({ routes: RouteList, nextToken: S.optional(S.String) }) {}
export class ListVirtualServicesOutput extends S.Class<ListVirtualServicesOutput>(
  "ListVirtualServicesOutput",
)({ virtualServices: VirtualServiceList, nextToken: S.optional(S.String) }) {}
export class CreateMeshOutput extends S.Class<CreateMeshOutput>(
  "CreateMeshOutput",
)({ mesh: MeshData.pipe(T.HttpPayload()) }) {}
export class DescribeMeshOutput extends S.Class<DescribeMeshOutput>(
  "DescribeMeshOutput",
)({ mesh: MeshData.pipe(T.HttpPayload()) }) {}
export class DescribeVirtualGatewayOutput extends S.Class<DescribeVirtualGatewayOutput>(
  "DescribeVirtualGatewayOutput",
)({ virtualGateway: VirtualGatewayData.pipe(T.HttpPayload()) }) {}
export class DescribeGatewayRouteOutput extends S.Class<DescribeGatewayRouteOutput>(
  "DescribeGatewayRouteOutput",
)({ gatewayRoute: GatewayRouteData.pipe(T.HttpPayload()) }) {}
export class DescribeVirtualNodeOutput extends S.Class<DescribeVirtualNodeOutput>(
  "DescribeVirtualNodeOutput",
)({ virtualNode: VirtualNodeData.pipe(T.HttpPayload()) }) {}
export class CreateVirtualRouterOutput extends S.Class<CreateVirtualRouterOutput>(
  "CreateVirtualRouterOutput",
)({ virtualRouter: VirtualRouterData.pipe(T.HttpPayload()) }) {}
export class DescribeVirtualRouterOutput extends S.Class<DescribeVirtualRouterOutput>(
  "DescribeVirtualRouterOutput",
)({ virtualRouter: VirtualRouterData.pipe(T.HttpPayload()) }) {}
export class DescribeRouteOutput extends S.Class<DescribeRouteOutput>(
  "DescribeRouteOutput",
)({ route: RouteData.pipe(T.HttpPayload()) }) {}
export class CreateVirtualServiceInput extends S.Class<CreateVirtualServiceInput>(
  "CreateVirtualServiceInput",
)(
  {
    virtualServiceName: S.String,
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: VirtualServiceSpec,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualServices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVirtualServiceOutput extends S.Class<DescribeVirtualServiceOutput>(
  "DescribeVirtualServiceOutput",
)({ virtualService: VirtualServiceData.pipe(T.HttpPayload()) }) {}
export class CreateVirtualServiceOutput extends S.Class<CreateVirtualServiceOutput>(
  "CreateVirtualServiceOutput",
)({ virtualService: VirtualServiceData.pipe(T.HttpPayload()) }) {}
export class CreateRouteInput extends S.Class<CreateRouteInput>(
  "CreateRouteInput",
)(
  {
    routeName: S.String,
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualRouterName: S.String.pipe(T.HttpLabel("virtualRouterName")),
    spec: RouteSpec,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualRouter/{virtualRouterName}/routes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGatewayRouteInput extends S.Class<CreateGatewayRouteInput>(
  "CreateGatewayRouteInput",
)(
  {
    gatewayRouteName: S.String,
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    virtualGatewayName: S.String.pipe(T.HttpLabel("virtualGatewayName")),
    spec: GatewayRouteSpec,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualGateway/{virtualGatewayName}/gatewayRoutes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRouteOutput extends S.Class<CreateRouteOutput>(
  "CreateRouteOutput",
)({ route: RouteData.pipe(T.HttpPayload()) }) {}
export class CreateVirtualGatewayInput extends S.Class<CreateVirtualGatewayInput>(
  "CreateVirtualGatewayInput",
)(
  {
    virtualGatewayName: S.String,
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: VirtualGatewaySpec,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v20190125/meshes/{meshName}/virtualGateways",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGatewayRouteOutput extends S.Class<CreateGatewayRouteOutput>(
  "CreateGatewayRouteOutput",
)({ gatewayRoute: GatewayRouteData.pipe(T.HttpPayload()) }) {}
export class CreateVirtualNodeInput extends S.Class<CreateVirtualNodeInput>(
  "CreateVirtualNodeInput",
)(
  {
    virtualNodeName: S.String,
    meshName: S.String.pipe(T.HttpLabel("meshName")),
    spec: VirtualNodeSpec,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
    meshOwner: S.optional(S.String).pipe(T.HttpQuery("meshOwner")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v20190125/meshes/{meshName}/virtualNodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVirtualGatewayOutput extends S.Class<CreateVirtualGatewayOutput>(
  "CreateVirtualGatewayOutput",
)({ virtualGateway: VirtualGatewayData.pipe(T.HttpPayload()) }) {}
export class CreateVirtualNodeOutput extends S.Class<CreateVirtualNodeOutput>(
  "CreateVirtualNodeOutput",
)({ virtualNode: VirtualNodeData.pipe(T.HttpPayload()) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes specified tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a route that is associated with a virtual router.
 *
 * You can route several different protocols and define a retry policy for a route.
 * Traffic can be routed to one or more virtual nodes.
 *
 * For more information about routes, see Routes.
 */
export const createRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRouteInput,
  output: CreateRouteOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an existing service mesh.
 *
 * You must delete all resources (virtual services, routes, virtual routers, and virtual
 * nodes) in the service mesh before you can delete the mesh itself.
 */
export const deleteMesh = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMeshInput,
  output: DeleteMeshOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ResourceInUseException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a service mesh.
 *
 * A service mesh is a logical boundary for network traffic between services that are
 * represented by resources within the mesh. After you create your service mesh, you can
 * create virtual services, virtual nodes, virtual routers, and routes to distribute traffic
 * between the applications in your mesh.
 *
 * For more information about service meshes, see Service meshes.
 */
export const createMesh = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMeshInput,
  output: CreateMeshOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a virtual service within a service mesh.
 *
 * A virtual service is an abstraction of a real service that is provided by a virtual node
 * directly or indirectly by means of a virtual router. Dependent services call your virtual
 * service by its `virtualServiceName`, and those requests are routed to the
 * virtual node or virtual router that is specified as the provider for the virtual
 * service.
 *
 * For more information about virtual services, see Virtual services.
 */
export const createVirtualService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVirtualServiceInput,
    output: CreateVirtualServiceOutput,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      LimitExceededException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Describes an existing service mesh.
 */
export const describeMesh = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMeshInput,
  output: DescribeMeshOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Describes an existing virtual gateway.
 */
export const describeVirtualGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVirtualGatewayInput,
    output: DescribeVirtualGatewayOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Describes an existing gateway route.
 */
export const describeGatewayRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGatewayRouteInput,
    output: DescribeGatewayRouteOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Describes an existing virtual node.
 */
export const describeVirtualNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVirtualNodeInput,
  output: DescribeVirtualNodeOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Describes an existing virtual router.
 */
export const describeVirtualRouter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVirtualRouterInput,
    output: DescribeVirtualRouterOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Describes an existing route.
 */
export const describeRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRouteInput,
  output: DescribeRouteOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Describes an existing virtual service.
 */
export const describeVirtualService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVirtualServiceInput,
    output: DescribeVirtualServiceOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Updates an existing service mesh.
 */
export const updateMesh = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMeshInput,
  output: UpdateMeshOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns a list of existing service meshes.
 */
export const listMeshes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMeshesInput,
  output: ListMeshesOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "meshes",
    pageSize: "limit",
  } as const,
}));
/**
 * Returns a list of existing virtual gateways in a service mesh.
 */
export const listVirtualGateways =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListVirtualGatewaysInput,
    output: ListVirtualGatewaysOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "virtualGateways",
      pageSize: "limit",
    } as const,
  }));
/**
 * Returns a list of existing gateway routes that are associated to a virtual
 * gateway.
 */
export const listGatewayRoutes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGatewayRoutesInput,
    output: ListGatewayRoutesOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "gatewayRoutes",
      pageSize: "limit",
    } as const,
  }),
);
/**
 * Returns a list of existing virtual nodes.
 */
export const listVirtualNodes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListVirtualNodesInput,
    output: ListVirtualNodesOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "virtualNodes",
      pageSize: "limit",
    } as const,
  }),
);
/**
 * Returns a list of existing virtual routers in a service mesh.
 */
export const listVirtualRouters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListVirtualRoutersInput,
    output: ListVirtualRoutersOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "virtualRouters",
      pageSize: "limit",
    } as const,
  }),
);
/**
 * Returns a list of existing routes in a service mesh.
 */
export const listRoutes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoutesInput,
  output: ListRoutesOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "routes",
    pageSize: "limit",
  } as const,
}));
/**
 * Returns a list of existing virtual services in a service mesh.
 */
export const listVirtualServices =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListVirtualServicesInput,
    output: ListVirtualServicesOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "virtualServices",
      pageSize: "limit",
    } as const,
  }));
/**
 * List the tags for an App Mesh resource.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceInput,
    output: ListTagsForResourceOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "tags",
      pageSize: "limit",
    } as const,
  }));
/**
 * Creates a virtual router within a service mesh.
 *
 * Specify a `listener` for any inbound traffic that your virtual router
 * receives. Create a virtual router for each protocol and port that you need to route.
 * Virtual routers handle traffic for one or more virtual services within your mesh. After you
 * create your virtual router, create and associate routes for your virtual router that direct
 * incoming requests to different virtual nodes.
 *
 * For more information about virtual routers, see Virtual routers.
 */
export const createVirtualRouter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVirtualRouterInput,
  output: CreateVirtualRouterOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing virtual gateway in a specified service mesh.
 */
export const updateVirtualGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateVirtualGatewayInput,
    output: UpdateVirtualGatewayOutput,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      LimitExceededException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Updates an existing gateway route that is associated to a specified virtual gateway in a
 * service mesh.
 */
export const updateGatewayRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayRouteInput,
  output: UpdateGatewayRouteOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing virtual node in a specified service mesh.
 */
export const updateVirtualNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVirtualNodeInput,
  output: UpdateVirtualNodeOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing virtual router in a specified service mesh.
 */
export const updateVirtualRouter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVirtualRouterInput,
  output: UpdateVirtualRouterOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing route for a specified service mesh and virtual router.
 */
export const updateRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRouteInput,
  output: UpdateRouteOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing virtual service in a specified service mesh.
 */
export const updateVirtualService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateVirtualServiceInput,
    output: UpdateVirtualServiceOutput,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      LimitExceededException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes an existing virtual gateway. You cannot delete a virtual gateway if any gateway
 * routes are associated to it.
 */
export const deleteVirtualGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVirtualGatewayInput,
    output: DeleteVirtualGatewayOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ResourceInUseException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes an existing gateway route.
 */
export const deleteGatewayRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayRouteInput,
  output: DeleteGatewayRouteOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ResourceInUseException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an existing virtual node.
 *
 * You must delete any virtual services that list a virtual node as a service provider
 * before you can delete the virtual node itself.
 */
export const deleteVirtualNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVirtualNodeInput,
  output: DeleteVirtualNodeOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ResourceInUseException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an existing virtual router.
 *
 * You must delete any routes associated with the virtual router before you can delete the
 * router itself.
 */
export const deleteVirtualRouter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVirtualRouterInput,
  output: DeleteVirtualRouterOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ResourceInUseException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an existing route.
 */
export const deleteRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteInput,
  output: DeleteRouteOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ResourceInUseException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an existing virtual service.
 */
export const deleteVirtualService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVirtualServiceInput,
    output: DeleteVirtualServiceOutput,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      ResourceInUseException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a gateway route.
 *
 * A gateway route is attached to a virtual gateway and routes traffic to an existing
 * virtual service. If a route matches a request, it can distribute traffic to a target
 * virtual service.
 *
 * For more information about gateway routes, see Gateway routes.
 */
export const createGatewayRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGatewayRouteInput,
  output: CreateGatewayRouteOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Associates the specified tags to a resource with the specified `resourceArn`.
 * If existing tags on a resource aren't specified in the request parameters, they aren't
 * changed. When a resource is deleted, the tags associated with that resource are also
 * deleted.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a virtual gateway.
 *
 * A virtual gateway allows resources outside your mesh to communicate to resources that
 * are inside your mesh. The virtual gateway represents an Envoy proxy running in an Amazon ECS task, in a Kubernetes service, or on an Amazon EC2 instance. Unlike a
 * virtual node, which represents an Envoy running with an application, a virtual gateway
 * represents Envoy deployed by itself.
 *
 * For more information about virtual gateways, see Virtual gateways.
 */
export const createVirtualGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVirtualGatewayInput,
    output: CreateVirtualGatewayOutput,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      LimitExceededException,
      NotFoundException,
      ServiceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a virtual node within a service mesh.
 *
 * A virtual node acts as a logical pointer to a particular task group, such as an Amazon ECS service or a Kubernetes deployment. When you create a virtual node, you can
 * specify the service discovery information for your task group, and whether the proxy
 * running in a task group will communicate with other proxies using Transport Layer Security
 * (TLS).
 *
 * You define a `listener` for any inbound traffic that your virtual node
 * expects. Any virtual service that your virtual node expects to communicate to is specified
 * as a `backend`.
 *
 * The response metadata for your new virtual node contains the `arn` that is
 * associated with the virtual node. Set this value to the full ARN; for example,
 * `arn:aws:appmesh:us-west-2:123456789012:myMesh/default/virtualNode/myApp`)
 * as the `APPMESH_RESOURCE_ARN` environment variable for your task group's Envoy
 * proxy container in your task definition or pod spec. This is then mapped to the
 * `node.id` and `node.cluster` Envoy parameters.
 *
 * By default, App Mesh uses the name of the resource you specified in
 * `APPMESH_RESOURCE_ARN` when Envoy is referring to itself in metrics and
 * traces. You can override this behavior by setting the
 * `APPMESH_RESOURCE_CLUSTER` environment variable with your own name.
 *
 * For more information about virtual nodes, see Virtual nodes. You must be using `1.15.0` or later of the Envoy image when
 * setting these variables. For more information aboutApp Mesh Envoy variables, see
 * Envoy
 * image in the App Mesh User Guide.
 */
export const createVirtualNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVirtualNodeInput,
  output: CreateVirtualNodeOutput,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
