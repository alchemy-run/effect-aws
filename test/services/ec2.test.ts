import { expect } from "@effect/vitest";
import { Effect } from "effect";
import {
  // Account & Region
  describeAccountAttributes,
  // Elastic IPs
  describeAddresses,
  describeAddressesAttribute,
  describeAddressTransfers,
  describeAvailabilityZones,
  // Bundle Tasks
  describeBundleTasks,
  // BYOIP
  describeByoipCidrs,
  describeCapacityReservationFleets,
  // Capacity Reservations
  describeCapacityReservations,
  describeCarrierGateways,
  // Client VPN
  describeClientVpnEndpoints,
  // CoIP Pools
  describeCoipPools,
  // Conversion Tasks
  describeConversionTasks,
  describeCustomerGateways,
  describeDhcpOptions,
  describeEgressOnlyInternetGateways,
  describeExportImageTasks,
  describeExportTasks,

  // Fast Launch & Snapshots
  describeFastLaunchImages,
  describeFastSnapshotRestores,
  // Fleets
  describeFleets,

  // Flow Logs
  describeFlowLogs,
  describeHostReservationOfferings,
  describeHostReservations,
  // Hosts
  describeHosts,
  // IAM Instance Profile Associations
  describeIamInstanceProfileAssociations,
  // Images & AMIs
  describeImages,
  // Import/Export
  describeImportImageTasks,
  describeImportSnapshotTasks,
  // Instance Connect Endpoints
  describeInstanceConnectEndpoints,
  describeInstanceCreditSpecifications,
  // Instance Event Windows
  describeInstanceEventWindows,
  // Instances
  describeInstances,
  describeInstanceStatus,
  describeInstanceTypeOfferings,
  describeInstanceTypes,
  // Internet Connectivity
  describeInternetGateways,
  describeIpamPools,
  describeIpamResourceDiscoveries,
  describeIpamResourceDiscoveryAssociations,
  // IPAM
  describeIpams,
  describeIpamScopes,
  // IPv6 Pools
  describeIpv6Pools,
  // Key Pairs
  describeKeyPairs,
  // Launch Templates
  describeLaunchTemplates,
  describeLocalGatewayRouteTables,
  // Local Gateways
  describeLocalGateways,
  describeLocalGatewayVirtualInterfaceGroups,
  describeLocalGatewayVirtualInterfaces,
  describeManagedPrefixLists,
  describeMovingAddresses,
  describeNatGateways,
  describeNetworkAcls,
  describeNetworkInsightsAccessScopeAnalyses,
  describeNetworkInsightsAccessScopes,
  describeNetworkInsightsAnalyses,
  // Network Insights
  describeNetworkInsightsPaths,
  describeNetworkInterfacePermissions,
  // Network Interfaces
  describeNetworkInterfaces,
  // Placement Groups
  describePlacementGroups,
  // Prefix Lists
  describePrefixLists,
  describePublicIpv4Pools,
  describeRegions,
  // Replace Root Volume Tasks
  describeReplaceRootVolumeTasks,
  // Reserved Instances
  describeReservedInstances,
  describeReservedInstancesModifications,
  describeReservedInstancesOfferings,
  describeRouteTables,
  // Scheduled Instances
  describeScheduledInstances,
  describeSecurityGroupRules,
  // Security
  describeSecurityGroups,
  // Security Group VPC Associations
  describeSecurityGroupVpcAssociations,
  describeSnapshots,
  describeSpotDatafeedSubscription,
  describeSpotFleetRequests,
  // Spot
  describeSpotInstanceRequests,
  describeSpotPriceHistory,
  // Stale Security Groups
  describeStaleSecurityGroups,
  // Store Image Tasks
  describeStoreImageTasks,
  describeSubnets,
  // Tags
  describeTags,
  // Traffic Mirror
  describeTrafficMirrorFilters,
  describeTrafficMirrorSessions,
  describeTrafficMirrorTargets,
  describeTransitGatewayAttachments,
  describeTransitGatewayConnectPeers,
  describeTransitGatewayConnects,
  describeTransitGatewayMulticastDomains,
  describeTransitGatewayPeeringAttachments,
  describeTransitGatewayPolicyTables,
  describeTransitGatewayRouteTables,
  // Transit Gateways
  describeTransitGateways,
  describeTransitGatewayVpcAttachments,
  // Trunk Interface Associations
  describeTrunkInterfaceAssociations,
  describeVerifiedAccessEndpoints,
  describeVerifiedAccessGroups,
  // Verified Access
  describeVerifiedAccessInstances,
  describeVerifiedAccessTrustProviders,
  // Volumes & Snapshots
  describeVolumes,
  describeVolumesModifications,
  describeVolumeStatus,
  describeVpcEndpointConnectionNotifications,
  describeVpcEndpointConnections,
  // VPC Endpoints
  describeVpcEndpoints,
  describeVpcEndpointServiceConfigurations,
  describeVpcEndpointServices,
  // VPC Peering
  describeVpcPeeringConnections,
  // VPC & Core Networking
  describeVpcs,
  describeVpnConnections,
  // VPN
  describeVpnGateways,
  getAllowedImagesSettings,
  // Get operations
  getEbsDefaultKmsKeyId,
  getEbsEncryptionByDefault,
  getImageBlockPublicAccessState,
  getInstanceMetadataDefaults,
  getSerialConsoleAccessStatus,
  getSnapshotBlockPublicAccessState,
  // Images in Recycle Bin
  listImagesInRecycleBin,
  listSnapshotsInRecycleBin,
} from "../../src/services/ec2.ts";
import { test } from "../test.ts";

// ============================================================================
// EC2 API Tests
//
// These tests call read-only EC2 APIs to verify response parsing works
// correctly. They don't create any resources.
// ============================================================================

// ----------------------------------------------------------------------------
// Account & Region
// ----------------------------------------------------------------------------

test(
  "describeAccountAttributes",
  Effect.gen(function* () {
    const result = yield* describeAccountAttributes({});
    expect(result).toBeDefined();
  }),
);

test(
  "describeAvailabilityZones",
  Effect.gen(function* () {
    const result = yield* describeAvailabilityZones({});
    expect(result).toBeDefined();
    expect(result.AvailabilityZones).toBeDefined();
  }),
);

test(
  "describeRegions",
  Effect.gen(function* () {
    const result = yield* describeRegions({});
    expect(result).toBeDefined();
    expect(result.Regions).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// VPC & Core Networking
// ----------------------------------------------------------------------------

test(
  "describeVpcs",
  Effect.gen(function* () {
    const result = yield* describeVpcs({});
    expect(result).toBeDefined();
    expect(result.Vpcs).toBeDefined();
  }),
);

test(
  "describeSubnets",
  Effect.gen(function* () {
    const result = yield* describeSubnets({});
    expect(result).toBeDefined();
    expect(result.Subnets).toBeDefined();
  }),
);

test(
  "describeRouteTables",
  Effect.gen(function* () {
    const result = yield* describeRouteTables({});
    expect(result).toBeDefined();
    expect(result.RouteTables).toBeDefined();
  }),
);

test(
  "describeDhcpOptions",
  Effect.gen(function* () {
    const result = yield* describeDhcpOptions({});
    expect(result).toBeDefined();
    expect(result.DhcpOptions).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Internet Connectivity
// ----------------------------------------------------------------------------

test(
  "describeInternetGateways",
  Effect.gen(function* () {
    const result = yield* describeInternetGateways({});
    expect(result).toBeDefined();
    expect(result.InternetGateways).toBeDefined();
  }),
);

test(
  "describeNatGateways",
  Effect.gen(function* () {
    const result = yield* describeNatGateways({});
    expect(result).toBeDefined();
    expect(result.NatGateways).toBeDefined();
  }),
);

test(
  "describeNatGateways with filter",
  Effect.gen(function* () {
    const result = yield* describeNatGateways({
      Filter: [{ Name: "state", Values: ["available"] }],
    });
    expect(result).toBeDefined();
  }),
);

test(
  "describeEgressOnlyInternetGateways",
  Effect.gen(function* () {
    const result = yield* describeEgressOnlyInternetGateways({});
    expect(result).toBeDefined();
    expect(result.EgressOnlyInternetGateways).toBeDefined();
  }),
);

test(
  "describeCarrierGateways",
  Effect.gen(function* () {
    const result = yield* describeCarrierGateways({});
    expect(result).toBeDefined();
    expect(result.CarrierGateways).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Security
// ----------------------------------------------------------------------------

test(
  "describeSecurityGroups",
  Effect.gen(function* () {
    const result = yield* describeSecurityGroups({});
    expect(result).toBeDefined();
    expect(result.SecurityGroups).toBeDefined();
  }),
);

test(
  "describeSecurityGroupRules",
  Effect.gen(function* () {
    const result = yield* describeSecurityGroupRules({});
    expect(result).toBeDefined();
    expect(result.SecurityGroupRules).toBeDefined();
  }),
);

test(
  "describeNetworkAcls",
  Effect.gen(function* () {
    const result = yield* describeNetworkAcls({});
    expect(result).toBeDefined();
    expect(result.NetworkAcls).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Network Interfaces
// ----------------------------------------------------------------------------

test(
  "describeNetworkInterfaces",
  Effect.gen(function* () {
    const result = yield* describeNetworkInterfaces({});
    expect(result).toBeDefined();
    expect(result.NetworkInterfaces).toBeDefined();
  }),
);

test(
  "describeNetworkInterfacePermissions",
  Effect.gen(function* () {
    const result = yield* describeNetworkInterfacePermissions({});
    expect(result).toBeDefined();
    expect(result.NetworkInterfacePermissions).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Elastic IPs
// ----------------------------------------------------------------------------

test(
  "describeAddresses",
  Effect.gen(function* () {
    const result = yield* describeAddresses({});
    expect(result).toBeDefined();
    expect(result.Addresses).toBeDefined();
  }),
);

test(
  "describeAddressesAttribute",
  Effect.gen(function* () {
    const result = yield* describeAddressesAttribute({});
    expect(result).toBeDefined();
    expect(result.Addresses).toBeDefined();
  }),
);

test(
  "describeAddressTransfers",
  Effect.gen(function* () {
    const result = yield* describeAddressTransfers({});
    expect(result).toBeDefined();
    expect(result.AddressTransfers).toBeDefined();
  }),
);

// Skipped: EC2-Classic migration not available in this region
test.skip(
  "describeMovingAddresses",
  Effect.gen(function* () {
    const result = yield* describeMovingAddresses({});
    expect(result).toBeDefined();
    expect(result.MovingAddressStatuses).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// VPC Endpoints
// ----------------------------------------------------------------------------

test(
  "describeVpcEndpoints",
  Effect.gen(function* () {
    const result = yield* describeVpcEndpoints({});
    expect(result).toBeDefined();
    expect(result.VpcEndpoints).toBeDefined();
  }),
);

test(
  "describeVpcEndpointServices",
  Effect.gen(function* () {
    const result = yield* describeVpcEndpointServices({});
    expect(result).toBeDefined();
  }),
);

test(
  "describeVpcEndpointConnections",
  Effect.gen(function* () {
    const result = yield* describeVpcEndpointConnections({});
    expect(result).toBeDefined();
    expect(result.VpcEndpointConnections).toBeDefined();
  }),
);

test(
  "describeVpcEndpointConnectionNotifications",
  Effect.gen(function* () {
    const result = yield* describeVpcEndpointConnectionNotifications({});
    expect(result).toBeDefined();
    expect(result.ConnectionNotificationSet).toBeDefined();
  }),
);

test(
  "describeVpcEndpointServiceConfigurations",
  Effect.gen(function* () {
    const result = yield* describeVpcEndpointServiceConfigurations({});
    expect(result).toBeDefined();
    expect(result.ServiceConfigurations).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// VPC Peering
// ----------------------------------------------------------------------------

test(
  "describeVpcPeeringConnections",
  Effect.gen(function* () {
    const result = yield* describeVpcPeeringConnections({});
    expect(result).toBeDefined();
    expect(result.VpcPeeringConnections).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Transit Gateways
// ----------------------------------------------------------------------------

test(
  "describeTransitGateways",
  Effect.gen(function* () {
    const result = yield* describeTransitGateways({});
    expect(result).toBeDefined();
    expect(result.TransitGateways).toBeDefined();
  }),
);

test(
  "describeTransitGatewayAttachments",
  Effect.gen(function* () {
    const result = yield* describeTransitGatewayAttachments({});
    expect(result).toBeDefined();
    expect(result.TransitGatewayAttachments).toBeDefined();
  }),
);

test(
  "describeTransitGatewayRouteTables",
  Effect.gen(function* () {
    const result = yield* describeTransitGatewayRouteTables({});
    expect(result).toBeDefined();
    expect(result.TransitGatewayRouteTables).toBeDefined();
  }),
);

test(
  "describeTransitGatewayConnects",
  Effect.gen(function* () {
    const result = yield* describeTransitGatewayConnects({});
    expect(result).toBeDefined();
    expect(result.TransitGatewayConnects).toBeDefined();
  }),
);

test(
  "describeTransitGatewayConnectPeers",
  Effect.gen(function* () {
    const result = yield* describeTransitGatewayConnectPeers({});
    expect(result).toBeDefined();
    expect(result.TransitGatewayConnectPeers).toBeDefined();
  }),
);

test(
  "describeTransitGatewayMulticastDomains",
  Effect.gen(function* () {
    const result = yield* describeTransitGatewayMulticastDomains({});
    expect(result).toBeDefined();
    expect(result.TransitGatewayMulticastDomains).toBeDefined();
  }),
);

test(
  "describeTransitGatewayPeeringAttachments",
  Effect.gen(function* () {
    const result = yield* describeTransitGatewayPeeringAttachments({});
    expect(result).toBeDefined();
    expect(result.TransitGatewayPeeringAttachments).toBeDefined();
  }),
);

test(
  "describeTransitGatewayPolicyTables",
  Effect.gen(function* () {
    const result = yield* describeTransitGatewayPolicyTables({});
    expect(result).toBeDefined();
    expect(result.TransitGatewayPolicyTables).toBeDefined();
  }),
);

test(
  "describeTransitGatewayVpcAttachments",
  Effect.gen(function* () {
    const result = yield* describeTransitGatewayVpcAttachments({});
    expect(result).toBeDefined();
    expect(result.TransitGatewayVpcAttachments).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// VPN
// ----------------------------------------------------------------------------

test(
  "describeVpnGateways",
  Effect.gen(function* () {
    const result = yield* describeVpnGateways({});
    expect(result).toBeDefined();
    expect(result.VpnGateways).toBeDefined();
  }),
);

test(
  "describeVpnConnections",
  Effect.gen(function* () {
    const result = yield* describeVpnConnections({});
    expect(result).toBeDefined();
    expect(result.VpnConnections).toBeDefined();
  }),
);

test(
  "describeCustomerGateways",
  Effect.gen(function* () {
    const result = yield* describeCustomerGateways({});
    expect(result).toBeDefined();
    expect(result.CustomerGateways).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Local Gateways
// ----------------------------------------------------------------------------

test(
  "describeLocalGateways",
  Effect.gen(function* () {
    const result = yield* describeLocalGateways({});
    expect(result).toBeDefined();
    expect(result.LocalGateways).toBeDefined();
  }),
);

test(
  "describeLocalGatewayRouteTables",
  Effect.gen(function* () {
    const result = yield* describeLocalGatewayRouteTables({});
    expect(result).toBeDefined();
    expect(result.LocalGatewayRouteTables).toBeDefined();
  }),
);

test(
  "describeLocalGatewayVirtualInterfaces",
  Effect.gen(function* () {
    const result = yield* describeLocalGatewayVirtualInterfaces({});
    expect(result).toBeDefined();
    expect(result.LocalGatewayVirtualInterfaces).toBeDefined();
  }),
);

test(
  "describeLocalGatewayVirtualInterfaceGroups",
  Effect.gen(function* () {
    const result = yield* describeLocalGatewayVirtualInterfaceGroups({});
    expect(result).toBeDefined();
    expect(result.LocalGatewayVirtualInterfaceGroups).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Instances
// ----------------------------------------------------------------------------

test(
  "describeInstances",
  Effect.gen(function* () {
    const result = yield* describeInstances({});
    expect(result).toBeDefined();
    expect(result.Reservations).toBeDefined();
  }),
);

test(
  "describeInstanceStatus",
  Effect.gen(function* () {
    const result = yield* describeInstanceStatus({});
    expect(result).toBeDefined();
    expect(result.InstanceStatuses).toBeDefined();
  }),
);

test(
  "describeInstanceTypes",
  Effect.gen(function* () {
    const result = yield* describeInstanceTypes({});
    expect(result).toBeDefined();
    expect(result.InstanceTypes).toBeDefined();
  }),
);

test(
  "describeInstanceTypeOfferings",
  Effect.gen(function* () {
    const result = yield* describeInstanceTypeOfferings({});
    expect(result).toBeDefined();
    expect(result.InstanceTypeOfferings).toBeDefined();
  }),
);

test(
  "describeInstanceCreditSpecifications",
  Effect.gen(function* () {
    const result = yield* describeInstanceCreditSpecifications({});
    expect(result).toBeDefined();
    expect(result.InstanceCreditSpecifications).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Images & AMIs
// ----------------------------------------------------------------------------

test(
  "describeImages - owned by self",
  Effect.gen(function* () {
    const result = yield* describeImages({ Owners: ["self"] });
    expect(result).toBeDefined();
    expect(result.Images).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Volumes & Snapshots
// ----------------------------------------------------------------------------

test(
  "describeVolumes",
  Effect.gen(function* () {
    const result = yield* describeVolumes({});
    expect(result).toBeDefined();
    expect(result.Volumes).toBeDefined();
  }),
);

test(
  "describeSnapshots - owned by self",
  Effect.gen(function* () {
    const result = yield* describeSnapshots({ OwnerIds: ["self"] });
    expect(result).toBeDefined();
    expect(result.Snapshots).toBeDefined();
  }),
);

test(
  "describeVolumesModifications",
  Effect.gen(function* () {
    const result = yield* describeVolumesModifications({});
    expect(result).toBeDefined();
    expect(result.VolumesModifications).toBeDefined();
  }),
);

test(
  "describeVolumeStatus",
  Effect.gen(function* () {
    const result = yield* describeVolumeStatus({});
    expect(result).toBeDefined();
    expect(result.VolumeStatuses).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Key Pairs
// ----------------------------------------------------------------------------

test(
  "describeKeyPairs",
  Effect.gen(function* () {
    const result = yield* describeKeyPairs({});
    expect(result).toBeDefined();
    expect(result.KeyPairs).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Placement Groups
// ----------------------------------------------------------------------------

test(
  "describePlacementGroups",
  Effect.gen(function* () {
    const result = yield* describePlacementGroups({});
    expect(result).toBeDefined();
    expect(result.PlacementGroups).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Hosts
// ----------------------------------------------------------------------------

test(
  "describeHosts",
  Effect.gen(function* () {
    const result = yield* describeHosts({});
    expect(result).toBeDefined();
    expect(result.Hosts).toBeDefined();
  }),
);

test(
  "describeHostReservations",
  Effect.gen(function* () {
    const result = yield* describeHostReservations({});
    expect(result).toBeDefined();
    expect(result.HostReservationSet).toBeDefined();
  }),
);

test(
  "describeHostReservationOfferings",
  Effect.gen(function* () {
    const result = yield* describeHostReservationOfferings({});
    expect(result).toBeDefined();
    expect(result.OfferingSet).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Capacity Reservations
// ----------------------------------------------------------------------------

test(
  "describeCapacityReservations",
  Effect.gen(function* () {
    const result = yield* describeCapacityReservations({});
    expect(result).toBeDefined();
    expect(result.CapacityReservations).toBeDefined();
  }),
);

test(
  "describeCapacityReservationFleets",
  Effect.gen(function* () {
    const result = yield* describeCapacityReservationFleets({});
    expect(result).toBeDefined();
    expect(result.CapacityReservationFleets).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Launch Templates
// ----------------------------------------------------------------------------

test(
  "describeLaunchTemplates",
  Effect.gen(function* () {
    const result = yield* describeLaunchTemplates({});
    expect(result).toBeDefined();
    expect(result.LaunchTemplates).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Spot
// ----------------------------------------------------------------------------

test(
  "describeSpotInstanceRequests",
  Effect.gen(function* () {
    const result = yield* describeSpotInstanceRequests({});
    expect(result).toBeDefined();
    expect(result.SpotInstanceRequests).toBeDefined();
  }),
);

test(
  "describeSpotFleetRequests",
  Effect.gen(function* () {
    const result = yield* describeSpotFleetRequests({});
    expect(result).toBeDefined();
    expect(result.SpotFleetRequestConfigs).toBeDefined();
  }),
);

test(
  "describeSpotPriceHistory",
  Effect.gen(function* () {
    const result = yield* describeSpotPriceHistory({ MaxResults: 10 });
    expect(result).toBeDefined();
    expect(result.SpotPriceHistory).toBeDefined();
  }),
);

// Skipped: No spot datafeed subscription exists in account
test.skip(
  "describeSpotDatafeedSubscription",
  Effect.gen(function* () {
    const result = yield* describeSpotDatafeedSubscription({});
    expect(result).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Reserved Instances
// ----------------------------------------------------------------------------

test(
  "describeReservedInstances",
  Effect.gen(function* () {
    const result = yield* describeReservedInstances({});
    expect(result).toBeDefined();
    expect(result.ReservedInstances).toBeDefined();
  }),
);

test(
  "describeReservedInstancesOfferings",
  Effect.gen(function* () {
    const result = yield* describeReservedInstancesOfferings({
      MaxResults: 10,
    });
    expect(result).toBeDefined();
    expect(result.ReservedInstancesOfferings).toBeDefined();
  }),
);

test(
  "describeReservedInstancesModifications",
  Effect.gen(function* () {
    const result = yield* describeReservedInstancesModifications({});
    expect(result).toBeDefined();
    expect(result.ReservedInstancesModifications).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Scheduled Instances
// ----------------------------------------------------------------------------

test(
  "describeScheduledInstances",
  Effect.gen(function* () {
    const result = yield* describeScheduledInstances({});
    expect(result).toBeDefined();
    expect(result.ScheduledInstanceSet).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Fleets
// ----------------------------------------------------------------------------

test(
  "describeFleets",
  Effect.gen(function* () {
    const result = yield* describeFleets({});
    expect(result).toBeDefined();
    expect(result.Fleets).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Flow Logs
// ----------------------------------------------------------------------------

test(
  "describeFlowLogs",
  Effect.gen(function* () {
    const result = yield* describeFlowLogs({});
    expect(result).toBeDefined();
    expect(result.FlowLogs).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Tags
// ----------------------------------------------------------------------------

test(
  "describeTags",
  Effect.gen(function* () {
    const result = yield* describeTags({});
    expect(result).toBeDefined();
    expect(result.Tags).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// IPAM
// ----------------------------------------------------------------------------

test(
  "describeIpams",
  Effect.gen(function* () {
    const result = yield* describeIpams({});
    expect(result).toBeDefined();
    expect(result.Ipams).toBeDefined();
  }),
);

test(
  "describeIpamScopes",
  Effect.gen(function* () {
    const result = yield* describeIpamScopes({});
    expect(result).toBeDefined();
    expect(result.IpamScopes).toBeDefined();
  }),
);

test(
  "describeIpamPools",
  Effect.gen(function* () {
    const result = yield* describeIpamPools({});
    expect(result).toBeDefined();
    expect(result.IpamPools).toBeDefined();
  }),
);

test(
  "describeIpamResourceDiscoveries",
  Effect.gen(function* () {
    const result = yield* describeIpamResourceDiscoveries({});
    expect(result).toBeDefined();
    expect(result.IpamResourceDiscoveries).toBeDefined();
  }),
);

test(
  "describeIpamResourceDiscoveryAssociations",
  Effect.gen(function* () {
    const result = yield* describeIpamResourceDiscoveryAssociations({});
    expect(result).toBeDefined();
    expect(result.IpamResourceDiscoveryAssociations).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Prefix Lists
// ----------------------------------------------------------------------------

test(
  "describePrefixLists",
  Effect.gen(function* () {
    const result = yield* describePrefixLists({});
    expect(result).toBeDefined();
    expect(result.PrefixLists).toBeDefined();
  }),
);

test(
  "describeManagedPrefixLists",
  Effect.gen(function* () {
    const result = yield* describeManagedPrefixLists({});
    expect(result).toBeDefined();
    expect(result.PrefixLists).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Traffic Mirror
// ----------------------------------------------------------------------------

test(
  "describeTrafficMirrorFilters",
  Effect.gen(function* () {
    const result = yield* describeTrafficMirrorFilters({});
    expect(result).toBeDefined();
    expect(result.TrafficMirrorFilters).toBeDefined();
  }),
);

test(
  "describeTrafficMirrorSessions",
  Effect.gen(function* () {
    const result = yield* describeTrafficMirrorSessions({});
    expect(result).toBeDefined();
    expect(result.TrafficMirrorSessions).toBeDefined();
  }),
);

test(
  "describeTrafficMirrorTargets",
  Effect.gen(function* () {
    const result = yield* describeTrafficMirrorTargets({});
    expect(result).toBeDefined();
    expect(result.TrafficMirrorTargets).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Network Insights
// ----------------------------------------------------------------------------

test(
  "describeNetworkInsightsPaths",
  Effect.gen(function* () {
    const result = yield* describeNetworkInsightsPaths({});
    expect(result).toBeDefined();
    expect(result.NetworkInsightsPaths).toBeDefined();
  }),
);

test(
  "describeNetworkInsightsAnalyses",
  Effect.gen(function* () {
    const result = yield* describeNetworkInsightsAnalyses({});
    expect(result).toBeDefined();
    expect(result.NetworkInsightsAnalyses).toBeDefined();
  }),
);

test(
  "describeNetworkInsightsAccessScopes",
  Effect.gen(function* () {
    const result = yield* describeNetworkInsightsAccessScopes({});
    expect(result).toBeDefined();
    expect(result.NetworkInsightsAccessScopes).toBeDefined();
  }),
);

test(
  "describeNetworkInsightsAccessScopeAnalyses",
  Effect.gen(function* () {
    const result = yield* describeNetworkInsightsAccessScopeAnalyses({});
    expect(result).toBeDefined();
    expect(result.NetworkInsightsAccessScopeAnalyses).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Client VPN
// ----------------------------------------------------------------------------

test(
  "describeClientVpnEndpoints",
  Effect.gen(function* () {
    const result = yield* describeClientVpnEndpoints({});
    expect(result).toBeDefined();
    expect(result.ClientVpnEndpoints).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Verified Access
// ----------------------------------------------------------------------------

test(
  "describeVerifiedAccessInstances",
  Effect.gen(function* () {
    const result = yield* describeVerifiedAccessInstances({});
    expect(result).toBeDefined();
    expect(result.VerifiedAccessInstances).toBeDefined();
  }),
);

test(
  "describeVerifiedAccessGroups",
  Effect.gen(function* () {
    const result = yield* describeVerifiedAccessGroups({});
    expect(result).toBeDefined();
    expect(result.VerifiedAccessGroups).toBeDefined();
  }),
);

test(
  "describeVerifiedAccessEndpoints",
  Effect.gen(function* () {
    const result = yield* describeVerifiedAccessEndpoints({});
    expect(result).toBeDefined();
    expect(result.VerifiedAccessEndpoints).toBeDefined();
  }),
);

test(
  "describeVerifiedAccessTrustProviders",
  Effect.gen(function* () {
    const result = yield* describeVerifiedAccessTrustProviders({});
    expect(result).toBeDefined();
    expect(result.VerifiedAccessTrustProviders).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Import/Export
// ----------------------------------------------------------------------------

test(
  "describeImportImageTasks",
  Effect.gen(function* () {
    const result = yield* describeImportImageTasks({});
    expect(result).toBeDefined();
    expect(result.ImportImageTasks).toBeDefined();
  }),
);

test(
  "describeImportSnapshotTasks",
  Effect.gen(function* () {
    const result = yield* describeImportSnapshotTasks({});
    expect(result).toBeDefined();
    expect(result.ImportSnapshotTasks).toBeDefined();
  }),
);

test(
  "describeExportImageTasks",
  Effect.gen(function* () {
    const result = yield* describeExportImageTasks({});
    expect(result).toBeDefined();
    expect(result.ExportImageTasks).toBeDefined();
  }),
);

test(
  "describeExportTasks",
  Effect.gen(function* () {
    const result = yield* describeExportTasks({});
    expect(result).toBeDefined();
    expect(result.ExportTasks).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Fast Launch & Snapshots
// ----------------------------------------------------------------------------

test(
  "describeFastLaunchImages",
  Effect.gen(function* () {
    const result = yield* describeFastLaunchImages({});
    expect(result).toBeDefined();
    expect(result.FastLaunchImages).toBeDefined();
  }),
);

test(
  "describeFastSnapshotRestores",
  Effect.gen(function* () {
    const result = yield* describeFastSnapshotRestores({});
    expect(result).toBeDefined();
    expect(result.FastSnapshotRestores).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Bundle Tasks
// ----------------------------------------------------------------------------

test(
  "describeBundleTasks",
  Effect.gen(function* () {
    const result = yield* describeBundleTasks({});
    expect(result).toBeDefined();
    expect(result.BundleTasks).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Conversion Tasks
// ----------------------------------------------------------------------------

test(
  "describeConversionTasks",
  Effect.gen(function* () {
    const result = yield* describeConversionTasks({});
    expect(result).toBeDefined();
    expect(result.ConversionTasks).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// BYOIP
// ----------------------------------------------------------------------------

test(
  "describeByoipCidrs",
  Effect.gen(function* () {
    const result = yield* describeByoipCidrs({ MaxResults: 10 });
    expect(result).toBeDefined();
    expect(result.ByoipCidrs).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// IP Pools
// ----------------------------------------------------------------------------

test(
  "describeIpv6Pools",
  Effect.gen(function* () {
    const result = yield* describeIpv6Pools({});
    expect(result).toBeDefined();
    expect(result.Ipv6Pools).toBeDefined();
  }),
);

test(
  "describePublicIpv4Pools",
  Effect.gen(function* () {
    const result = yield* describePublicIpv4Pools({});
    expect(result).toBeDefined();
    expect(result.PublicIpv4Pools).toBeDefined();
  }),
);

test(
  "describeCoipPools",
  Effect.gen(function* () {
    const result = yield* describeCoipPools({});
    expect(result).toBeDefined();
    expect(result.CoipPools).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// IAM Instance Profile Associations
// ----------------------------------------------------------------------------

test(
  "describeIamInstanceProfileAssociations",
  Effect.gen(function* () {
    const result = yield* describeIamInstanceProfileAssociations({});
    expect(result).toBeDefined();
    expect(result.IamInstanceProfileAssociations).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Store Image Tasks
// ----------------------------------------------------------------------------

test(
  "describeStoreImageTasks",
  Effect.gen(function* () {
    const result = yield* describeStoreImageTasks({});
    expect(result).toBeDefined();
    expect(result.StoreImageTaskResults).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Instance Connect Endpoints
// ----------------------------------------------------------------------------

test(
  "describeInstanceConnectEndpoints",
  Effect.gen(function* () {
    const result = yield* describeInstanceConnectEndpoints({});
    expect(result).toBeDefined();
    expect(result.InstanceConnectEndpoints).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Instance Event Windows
// ----------------------------------------------------------------------------

test(
  "describeInstanceEventWindows",
  Effect.gen(function* () {
    const result = yield* describeInstanceEventWindows({});
    expect(result).toBeDefined();
    expect(result.InstanceEventWindows).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Replace Root Volume Tasks
// ----------------------------------------------------------------------------

test(
  "describeReplaceRootVolumeTasks",
  Effect.gen(function* () {
    const result = yield* describeReplaceRootVolumeTasks({});
    expect(result).toBeDefined();
    expect(result.ReplaceRootVolumeTasks).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Trunk Interface Associations
// ----------------------------------------------------------------------------

// Skipped: Requires EKS/ECS trunk ENI permissions
test.skip(
  "describeTrunkInterfaceAssociations",
  Effect.gen(function* () {
    const result = yield* describeTrunkInterfaceAssociations({});
    expect(result).toBeDefined();
    expect(result.InterfaceAssociations).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Security Group VPC Associations
// ----------------------------------------------------------------------------

test(
  "describeSecurityGroupVpcAssociations",
  Effect.gen(function* () {
    const result = yield* describeSecurityGroupVpcAssociations({});
    expect(result).toBeDefined();
    expect(result.SecurityGroupVpcAssociations).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Stale Security Groups
// ----------------------------------------------------------------------------

test(
  "describeStaleSecurityGroups",
  Effect.gen(function* () {
    // Get a VPC ID first
    const vpcs = yield* describeVpcs({});
    if (vpcs.Vpcs && vpcs.Vpcs.length > 0) {
      const result = yield* describeStaleSecurityGroups({
        VpcId: vpcs.Vpcs[0].VpcId!,
      });
      expect(result).toBeDefined();
      expect(result.StaleSecurityGroupSet).toBeDefined();
    }
  }),
);

// ----------------------------------------------------------------------------
// Recycle Bin
// ----------------------------------------------------------------------------

test(
  "listImagesInRecycleBin",
  Effect.gen(function* () {
    const result = yield* listImagesInRecycleBin({});
    expect(result).toBeDefined();
    expect(result.Images).toBeDefined();
  }),
);

test(
  "listSnapshotsInRecycleBin",
  Effect.gen(function* () {
    const result = yield* listSnapshotsInRecycleBin({});
    expect(result).toBeDefined();
    expect(result.Snapshots).toBeDefined();
  }),
);

// ----------------------------------------------------------------------------
// Get Operations
// ----------------------------------------------------------------------------

test(
  "getEbsDefaultKmsKeyId",
  Effect.gen(function* () {
    const result = yield* getEbsDefaultKmsKeyId({});
    expect(result).toBeDefined();
  }),
);

test(
  "getEbsEncryptionByDefault",
  Effect.gen(function* () {
    const result = yield* getEbsEncryptionByDefault({});
    expect(result).toBeDefined();
  }),
);

test(
  "getSerialConsoleAccessStatus",
  Effect.gen(function* () {
    const result = yield* getSerialConsoleAccessStatus({});
    expect(result).toBeDefined();
  }),
);

test(
  "getSnapshotBlockPublicAccessState",
  Effect.gen(function* () {
    const result = yield* getSnapshotBlockPublicAccessState({});
    expect(result).toBeDefined();
  }),
);

test(
  "getImageBlockPublicAccessState",
  Effect.gen(function* () {
    const result = yield* getImageBlockPublicAccessState({});
    expect(result).toBeDefined();
  }),
);

test(
  "getInstanceMetadataDefaults",
  Effect.gen(function* () {
    const result = yield* getInstanceMetadataDefaults({});
    expect(result).toBeDefined();
  }),
);

test(
  "getAllowedImagesSettings",
  Effect.gen(function* () {
    const result = yield* getAllowedImagesSettings({});
    expect(result).toBeDefined();
  }),
);
