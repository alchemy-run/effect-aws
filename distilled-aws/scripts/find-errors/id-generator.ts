/**
 * Fake ID generation for AWS resources.
 *
 * Generates realistic-looking fake IDs that trigger NotFound/Malformed errors.
 * Add new prefixes here as you discover them from AWS error messages.
 */

import type { DependencyGraph } from "./topology.ts";

/**
 * AWS Resource ID prefixes for generating fake IDs.
 * EC2-style resources use prefix-hex format.
 * Reference: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/resource-ids.html
 *
 * Add new prefixes here when you encounter "Malformed" errors indicating
 * AWS expected a different format.
 */
export const AWS_ID_PREFIXES: Record<string, string> = {
  // Core networking
  Vpc: "vpc",
  Subnet: "subnet",
  SecurityGroup: "sg",
  NetworkInterface: "eni",
  NetworkAcl: "acl",
  RouteTable: "rtb",
  InternetGateway: "igw",
  NatGateway: "nat",
  EgressOnlyInternetGateway: "eigw",
  CarrierGateway: "cagw",

  // Compute
  Instance: "i",
  Image: "ami",
  Volume: "vol",
  Snapshot: "snap",
  KeyPair: "key",
  LaunchTemplate: "lt",
  PlacementGroup: "pg",
  Host: "h",
  CapacityReservation: "cr",
  CapacityReservationFleet: "crf",
  Fleet: "fleet",
  FpgaImage: "afi",
  Bundle: "bun",

  // VPN & Direct Connect
  VpnGateway: "vgw",
  CustomerGateway: "cgw",
  VpnConnection: "vpn",
  DhcpOptions: "dopt",

  // VPC Endpoints
  VpcEndpoint: "vpce",
  VpcEndpointService: "vpce-svc",
  Service: "vpce-svc", // For ServiceId fields

  // Peering
  VpcPeeringConnection: "pcx",

  // Transit Gateway
  TransitGateway: "tgw",
  TransitGatewayAttachment: "tgw-attach",
  TransitGatewayRouteTable: "tgw-rtb",
  TransitGatewayMulticastDomain: "tgw-mcast-domain",
  TransitGatewayPolicyTable: "tgw-ptb",
  TransitGatewayConnectPeer: "tgw-connect-peer",
  TransitGatewayMeteringPolicy: "tgw-mp",

  // Client VPN
  ClientVpnEndpoint: "cvpn-endpoint",
  ClientVpnRoute: "cvpn-route",

  // IPAM
  Ipam: "ipam",
  IpamPool: "ipam-pool",
  IpamScope: "ipam-scope",
  IpamResourceDiscovery: "ipam-res-disco",
  IpamResourceDiscoveryAssociation: "ipam-res-disco-assoc",
  IpamExternalResourceVerificationToken: "ipam-ext-res-ver-token",
  IpamPolicy: "ipam-policy",
  IpamPrefixListResolver: "ipam-plr",

  // Route Server
  RouteServer: "rs",
  RouteServerEndpoint: "rse",
  RouteServerPeer: "rsp",

  // Verified Access
  VerifiedAccessInstance: "vai",
  VerifiedAccessGroup: "vag",
  VerifiedAccessEndpoint: "vae",
  VerifiedAccessTrustProvider: "vatp",

  // Traffic Mirroring
  TrafficMirrorFilter: "tmf",
  TrafficMirrorSession: "tms",
  TrafficMirrorTarget: "tmt",
  TrafficMirrorFilterRule: "tmfr",

  // Network Insights
  NetworkInsightsPath: "nip",
  NetworkInsightsAnalysis: "nia",
  NetworkInsightsAccessScope: "nis",
  NetworkInsightsAccessScopeAnalysis: "nisa",

  // Flow Logs
  FlowLog: "fl",

  // Local Gateway
  LocalGateway: "lgw",
  LocalGatewayRouteTable: "lgw-rtb",
  LocalGatewayVirtualInterface: "lgw-vif",
  LocalGatewayVirtualInterfaceGroup: "lgw-vif-grp",
  LocalGatewayRouteTableVpcAssociation: "lgw-vpc-assoc",

  // Elastic IP
  Allocation: "eipalloc",
  Address: "eipalloc",
  Association: "eipassoc",

  // Prefix Lists
  PrefixList: "pl",

  // CoIP (Carrier IP)
  CoipPool: "ipv4pool-coip",

  // Public IPv4 Pools
  PublicIpv4Pool: "ipv4pool-ec2",
  Pool: "ipv4pool-ec2", // Generic Pool references
  Ipv6Pool: "ipv6pool-ec2",

  // Spot
  SpotInstanceRequest: "sir",
  SpotInstanceRequests: "sir", // Plural form

  // Reserved Instances
  ReservedInstance: "ri",
  ReservedInstancesListing: "ril",
  ReservedInstancesOffering: "rio",

  // Instance Connect
  InstanceConnectEndpoint: "eice",

  // Instance Event Window
  InstanceEventWindow: "iew",

  // VPC Block Public Access
  Exclusion: "vbpae",
  VpcBlockPublicAccessExclusion: "vbpae",

  // VPC Encryption Control
  VpcEncryptionControl: "vpc-ec",

  // Security Group Rules
  SecurityGroupRule: "sgr",

  // Network Interface Permissions
  NetworkInterfacePermission: "eni-perm",

  // Replace Root Volume
  ReplaceRootVolumeTask: "replacevol",

  // Export/Import Tasks
  ExportTask: "export",
  ExportImageTask: "export-ami",
  ImportTask: "import",
  ConversionTask: "import-i-",

  // Scheduled Instances
  ScheduledInstance: "sci",

  // Elastic GPU
  ElasticGpu: "egpu",

  // Outpost
  Outpost: "op",

  // Declarative Policies
  Report: "dp-report",

  // MAC Modification
  MacModificationTask: "mac-mod",

  // IAM Instance Profile associations
  IamInstanceProfile: "iip-assoc",

  // Subnet CIDR Reservation
  SubnetCidrReservation: "scr",

  // Gateway Load Balancer Endpoint
  GatewayLoadBalancerEndpoint: "gwlbe",

  // Connection Notification
  ConnectionNotification: "vpce-nfn",

  // Additional Transit Gateway resources
  TransitGatewayRouteTableAnnouncement: "tgw-rtb-ann",

  // Local Gateway extended
  LocalGatewayRouteTableVirtualInterfaceGroupAssociation: "lgw-vif-grp-assoc",

  // Capacity Manager
  CapacityManagerDataExport: "cmde",

  // VPN Concentrator (AWS Outposts)
  VpnConcentrator: "vpn-conc",

  // IPAM extended
  IpamPrefixListResolverTarget: "ipam-plr-target",

  // Reports
  ImageUsageReport: "img-usage-report",
  DeclarativePoliciesReport: "dp-report",

  // Source references (use same prefix as target)
  SourceCapacityReservation: "cr",
  SourceFpgaImage: "afi",
  SourceVolume: "vol",
  SourceImage: "ami",
  SourceSnapshot: "snap",

  // Group (Security Group)
  Group: "sg",

  // Additional resources from error analysis
  HostResourceGroup: "hrg",
  OutpostLag: "lag",
  PeerTransitGateway: "tgw",
  PeeringAttachment: "tgw-attach",
  ServiceLinkVirtualInterface: "slvif",
  DestinationCapacityReservation: "cr",
  DestinationIpamScope: "ipam-scope",
  CurrentIpamScope: "ipam-scope",
  CapacityBlock: "cr",
  Offering: "ri",
  AddMiddleboxAttachment: "tgw-attach",
  RemoveMiddleboxAttachment: "tgw-attach",
};

/**
 * Resources that use name-based identifiers (not AWS-generated IDs).
 * These get fake names like "distilled-fake-{resource}-notfound".
 */
export const NAME_BASED_RESOURCES = new Set([
  "Bucket", // S3 buckets use user-chosen names
  "Table", // DynamoDB tables use user-chosen names
  "Function", // Lambda functions use user-chosen names
  "Queue", // SQS queues use user-chosen names
  "Topic", // SNS topics use user-chosen names
  "Stream", // Kinesis streams use user-chosen names
  "Cluster", // ECS/EKS clusters use user-chosen names
  "Repository", // ECR repositories use user-chosen names
  "Secret", // Secrets Manager secrets use user-chosen names
  "Parameter", // SSM parameters use user-chosen names
  "Stack", // CloudFormation stacks use user-chosen names
  "Trail", // CloudTrail trails use user-chosen names
  "Alarm", // CloudWatch alarms use user-chosen names
  "Rule", // EventBridge rules use user-chosen names
  "Domain", // Various domain-based resources
]);

/**
 * Resources that expect ARNs instead of IDs.
 * We generate fake ARNs for these.
 */
export const ARN_BASED_RESOURCES = new Set([
  "Certificate", // ACM certificate ARN
  "Principal", // IAM principal ARN
  "Role", // IAM role ARN
  "ServerCertificate", // IAM server certificate ARN
  "DomainCertificate", // ACM domain certificate ARN
]);

/**
 * Resources that expect special formats (not ID or ARN).
 */
export const SPECIAL_FORMAT_RESOURCES: Record<string, string> = {
  Address: "192.0.2.1", // IP address (TEST-NET-1)
  Bundle: "bun-12345678", // Bundle task ID (8-char hex)
  ConversionTask: "import-i-12345678", // Conversion task ID
};

/**
 * Field-name-based special formats.
 * Some fields have specific formats regardless of the resource type.
 */
export const FIELD_FORMAT_OVERRIDES: Record<string, string> = {
  // SQS Queue URLs are full HTTPS URLs
  QueueUrl:
    "https://sqs.us-east-1.amazonaws.com/123456789012/distilled-fake-queue-notfound",
  // SQS Source ARN for message move tasks
  SourceArn: "arn:aws:sqs:us-east-1:123456789012:distilled-fake-queue-notfound",
  // SQS Destination ARN for message move tasks
  DestinationArn:
    "arn:aws:sqs:us-east-1:123456789012:distilled-fake-dlq-notfound",
  // SQS Task Handle for cancel operations
  TaskHandle: "distilled-fake-task-handle-notfound",
};

// 17-char hex for resources
const FAKE_HEX = "0123456789abcdef0"; // 17 chars

/**
 * Generate a fake ID for a resource type.
 */
export const generateFakeId = (resourceType: string): string => {
  // Special format resources
  if (SPECIAL_FORMAT_RESOURCES[resourceType]) {
    return SPECIAL_FORMAT_RESOURCES[resourceType];
  }

  // ARN-based resources get fake ARNs
  if (ARN_BASED_RESOURCES.has(resourceType)) {
    const type = resourceType.toLowerCase();
    return `arn:aws:acm:us-east-1:123456789012:${type}/fake-${type}-notfound`;
  }

  // Name-based resources get fake names
  if (NAME_BASED_RESOURCES.has(resourceType)) {
    return `distilled-fake-${resourceType.toLowerCase()}-notfound`;
  }

  // EC2-style resources get prefix-hex IDs
  const prefix = AWS_ID_PREFIXES[resourceType];
  if (prefix) {
    return `${prefix}-${FAKE_HEX}`;
  }

  // Infer prefix from resource type for unknown EC2-style resources
  const inferredPrefix = resourceType.toLowerCase().slice(0, 4);
  return `${inferredPrefix}-${FAKE_HEX}`;
};

/**
 * Generate fake inputs for an operation based on its inputs.
 * For read/list operations, also includes optional ID fields.
 */
export const generateFakeInputs = (
  graph: DependencyGraph,
  opName: string,
): Record<string, unknown> | null => {
  const op = graph.operations[opName];
  if (!op) return null;

  const inputs: Record<string, unknown> = {};
  const isReadOrList = op.type === "read" || op.type === "list";

  for (const [fieldName, input] of Object.entries(op.inputs)) {
    // For read/list operations, also include optional ID fields
    const shouldInclude =
      input.required ||
      (isReadOrList &&
        (fieldName.endsWith("Id") ||
          fieldName.endsWith("Ids") ||
          input.references));

    if (!shouldInclude) continue;

    // Check field-name-based overrides first (e.g., QueueUrl, SourceArn)
    if (FIELD_FORMAT_OVERRIDES[fieldName]) {
      inputs[fieldName] = FIELD_FORMAT_OVERRIDES[fieldName];
      continue;
    }

    // Generate fake value based on type/name
    if (input.references) {
      // FK reference - generate fake ID for the referenced resource
      const fakeId = generateFakeId(input.references);
      inputs[fieldName] = fieldName.endsWith("Ids") ? [fakeId] : fakeId;
    } else if (fieldName.endsWith("Id") || fieldName.endsWith("Ids")) {
      // ID field - generate fake ID based on field name
      const resourceType = fieldName.replace(/Ids?$/, "");
      inputs[fieldName] = fieldName.endsWith("Ids")
        ? [generateFakeId(resourceType)]
        : generateFakeId(resourceType);
    } else if (input.type === "String") {
      inputs[fieldName] = `fake-${fieldName.toLowerCase()}`;
    } else if (input.type === "Integer" || input.type.includes("Int")) {
      inputs[fieldName] = 1;
    } else if (input.type === "Boolean") {
      inputs[fieldName] = false;
    } else if (input.type.includes("List") || input.type.includes("Set")) {
      inputs[fieldName] = [];
    }
  }

  return Object.keys(inputs).length > 0 ? inputs : {};
};
