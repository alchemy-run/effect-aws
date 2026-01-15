/**
 * Service-specific patches for AWS Smithy model bugs and omissions.
 *
 * This file contains manual corrections for issues found in the upstream AWS models
 * that cannot be fixed directly (since aws-models is a git submodule).
 *
 * Structure:
 * - Key: service name (e.g., "ec2", "s3")
 * - Value: object mapping operation names to patches
 *
 * Patch types:
 * - errors: Array of error shape names to add to the operation's error list
 */

export interface OperationPatch {
  /**
   * Additional error types that should be included in this operation's error union.
   * These are error shape names (not full shape IDs).
   * Example: ["InvalidVpcID.NotFound", "ResourceNotFoundException"]
   */
  errors?: string[];
}

export interface ServicePatches {
  [operationName: string]: OperationPatch;
}

export const servicePatches: Record<string, ServicePatches> = {
  ec2: {
    // ========== Address / Elastic IP Operations ==========
    AllocateAddress: {
      errors: ["AddressLimitExceeded"],
    },
    AssociateAddress: {
      errors: [
        "InvalidAddressID.NotFound",
        "InvalidAllocationID.NotFound",
        "InvalidInstanceID.NotFound",
        "InvalidNetworkInterfaceID.NotFound",
      ],
    },
    DescribeAddresses: {
      errors: [
        "InvalidAddressID.NotFound",
        "InvalidAllocationID.NotFound",
        "InvalidAddress.NotFound",
      ],
    },
    DisassociateAddress: {
      errors: ["InvalidAssociationID.NotFound"],
    },
    ReleaseAddress: {
      errors: [
        "InvalidAddressID.NotFound",
        "InvalidAllocationID.NotFound",
        "InvalidNetworkInterfaceID.NotFound",
        "InvalidIPAddress.InUse",
        "DependencyViolation",
        "AuthFailure",
      ],
    },

    // ========== AMI / Image Operations ==========
    CopyImage: {
      errors: ["InvalidAMIID.NotFound", "InvalidAMIID.Unavailable"],
    },
    CreateImage: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    DeregisterImage: {
      errors: ["InvalidAMIID.NotFound", "InvalidAMIID.Unavailable"],
    },
    DescribeImageAttribute: {
      errors: ["InvalidAMIID.NotFound", "InvalidAMIID.Unavailable"],
    },
    DescribeImages: {
      errors: ["InvalidAMIID.NotFound", "InvalidAMIID.Malformed"],
    },
    ModifyImageAttribute: {
      errors: ["InvalidAMIID.NotFound", "InvalidAMIID.Unavailable"],
    },
    ResetImageAttribute: {
      errors: ["InvalidAMIID.NotFound"],
    },

    // ========== Bundle Task Operations ==========
    CancelBundleTask: {
      errors: ["InvalidBundleID.NotFound"],
    },
    DescribeBundleTasks: {
      errors: ["InvalidBundleID.NotFound"],
    },

    // ========== Capacity Reservation Operations ==========
    CancelCapacityReservation: {
      errors: [
        "InvalidCapacityReservationId.NotFound",
        "InvalidCapacityReservationId.Malformed",
      ],
    },
    CancelCapacityReservationFleets: {
      errors: [
        "InvalidCapacityReservationFleetId.NotFound",
        "InvalidCapacityReservationFleetId.Malformed",
      ],
    },
    DescribeCapacityReservationFleets: {
      errors: [
        "InvalidCapacityReservationFleetId.NotFound",
        "InvalidCapacityReservationFleetId.Malformed",
      ],
    },
    DescribeCapacityReservations: {
      errors: [
        "InvalidCapacityReservationId.NotFound",
        "InvalidCapacityReservationId.Malformed",
      ],
    },
    GetCapacityReservationUsage: {
      errors: ["InvalidCapacityReservationId.NotFound"],
    },
    ModifyCapacityReservation: {
      errors: ["InvalidCapacityReservationId.NotFound"],
    },
    ModifyCapacityReservationFleet: {
      errors: ["InvalidCapacityReservationFleetId.NotFound"],
    },

    // ========== Carrier Gateway Operations ==========
    DeleteCarrierGateway: {
      errors: ["InvalidCarrierGatewayID.NotFound", "DependencyViolation"],
    },
    DescribeCarrierGateways: {
      errors: ["InvalidCarrierGatewayID.NotFound"],
    },

    // ========== Client VPN Operations ==========
    ApplySecurityGroupsToClientVpnTargetNetwork: {
      errors: [
        "InvalidClientVpnEndpointId.NotFound",
        "InvalidSecurityGroupId.NotFound",
      ],
    },
    AssociateClientVpnTargetNetwork: {
      errors: [
        "InvalidClientVpnEndpointId.NotFound",
        "InvalidSubnetID.NotFound",
      ],
    },
    AuthorizeClientVpnIngress: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    CreateClientVpnRoute: {
      errors: [
        "InvalidClientVpnEndpointId.NotFound",
        "InvalidClientVpnActiveAssociationNotFound",
      ],
    },
    DeleteClientVpnEndpoint: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    DeleteClientVpnRoute: {
      errors: [
        "InvalidClientVpnEndpointId.NotFound",
        "InvalidClientVpnRouteNotFound",
      ],
    },
    DescribeClientVpnAuthorizationRules: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    DescribeClientVpnConnections: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    DescribeClientVpnEndpoints: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    DescribeClientVpnRoutes: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    DescribeClientVpnTargetNetworks: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    DisassociateClientVpnTargetNetwork: {
      errors: [
        "InvalidClientVpnEndpointId.NotFound",
        "InvalidClientVpnAssociationIdNotFound",
      ],
    },
    ExportClientVpnClientCertificateRevocationList: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    ExportClientVpnClientConfiguration: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    ImportClientVpnClientCertificateRevocationList: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    ModifyClientVpnEndpoint: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },
    RevokeClientVpnIngress: {
      errors: [
        "InvalidClientVpnEndpointId.NotFound",
        "InvalidClientVpnEndpointAuthorizationRuleNotFound",
      ],
    },
    TerminateClientVpnConnections: {
      errors: ["InvalidClientVpnEndpointId.NotFound"],
    },

    // ========== Conversion Task Operations ==========
    CancelConversionTask: {
      errors: ["InvalidConversionTaskId"],
    },
    DescribeConversionTasks: {
      errors: ["InvalidConversionTaskId", "InvalidConversionTaskId.Malformed"],
    },

    // ========== Customer Gateway Operations ==========
    CreateCustomerGateway: {
      errors: [
        "InvalidCustomerGateway.DuplicateIpAddress",
        "CustomerGatewayLimitExceeded",
      ],
    },
    DeleteCustomerGateway: {
      errors: ["InvalidCustomerGatewayID.NotFound", "DependencyViolation"],
    },
    DescribeCustomerGateways: {
      errors: [
        "InvalidCustomerGatewayID.NotFound",
        "InvalidCustomerGatewayId.Malformed",
      ],
    },

    // ========== DHCP Options Operations ==========
    CreateDhcpOptions: {
      errors: ["DhcpOptionsLimitExceeded"],
    },
    AssociateDhcpOptions: {
      errors: ["InvalidDhcpOptionID.NotFound", "InvalidVpcID.NotFound"],
    },
    DeleteDhcpOptions: {
      errors: [
        "InvalidDhcpOptionID.NotFound",
        "InvalidDhcpOptionsId.Malformed",
      ],
    },
    DescribeDhcpOptions: {
      errors: [
        "InvalidDhcpOptionID.NotFound",
        "InvalidDhcpOptionsId.Malformed",
      ],
    },

    // ========== Export Task Operations ==========
    CancelExportTask: {
      errors: ["InvalidExportTaskID.NotFound"],
    },
    DescribeExportTasks: {
      errors: ["InvalidExportTaskID.NotFound"],
    },

    // ========== Flow Log Operations ==========
    CreateFlowLogs: {
      errors: [
        "InvalidVpcID.NotFound",
        "InvalidSubnetID.NotFound",
        "InvalidNetworkInterfaceID.NotFound",
      ],
    },
    DeleteFlowLogs: {
      errors: ["InvalidFlowLogId.NotFound"],
    },
    DescribeFlowLogs: {
      errors: ["InvalidFlowLogId.NotFound"],
    },

    // ========== FPGA Image Operations ==========
    CopyFpgaImage: {
      errors: ["InvalidFpgaImageID.NotFound", "InvalidFpgaImageID.Malformed"],
    },
    DeleteFpgaImage: {
      errors: ["InvalidFpgaImageID.NotFound", "InvalidFpgaImageID.Malformed"],
    },
    DescribeFpgaImageAttribute: {
      errors: ["InvalidFpgaImageID.NotFound", "InvalidFpgaImageID.Malformed"],
    },
    DescribeFpgaImages: {
      errors: ["InvalidFpgaImageID.NotFound", "InvalidFpgaImageID.Malformed"],
    },
    ModifyFpgaImageAttribute: {
      errors: ["InvalidFpgaImageID.NotFound"],
    },
    ResetFpgaImageAttribute: {
      errors: ["InvalidFpgaImageID.NotFound"],
    },

    // ========== Host Operations ==========
    AllocateHosts: {
      errors: ["InvalidHostConfiguration"],
    },
    DescribeHostReservationOfferings: {
      errors: ["InvalidHostReservationOfferingId.Malformed"],
    },
    DescribeHostReservations: {
      errors: ["InvalidHostReservationId.Malformed"],
    },
    DescribeHosts: {
      errors: ["InvalidHostID.NotFound", "InvalidHostID.Malformed"],
    },
    GetHostReservationPurchasePreview: {
      errors: ["InvalidHostID.NotFound"],
    },
    ModifyHosts: {
      errors: ["InvalidHostID.NotFound"],
    },
    PurchaseHostReservation: {
      errors: ["InvalidHostID.NotFound"],
    },
    ReleaseHosts: {
      errors: ["InvalidHostID.NotFound"],
    },

    // ========== Instance Operations ==========
    ConfirmProductInstance: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    CreateInstanceExportTask: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    DescribeInstanceAttribute: {
      errors: ["InvalidInstanceID.NotFound", "InvalidInstanceID.Malformed"],
    },
    DescribeInstances: {
      errors: ["InvalidInstanceID.NotFound", "InvalidInstanceID.Malformed"],
    },
    DescribeInstanceStatus: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    GetConsoleOutput: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    GetConsoleScreenshot: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    GetInstanceTypesFromInstanceRequirements: {
      errors: ["InvalidInstanceType"],
    },
    GetInstanceUefiData: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    GetPasswordData: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ModifyInstanceAttribute: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ModifyInstanceCapacityReservationAttributes: {
      errors: [
        "InvalidInstanceID.NotFound",
        "InvalidCapacityReservationId.NotFound",
      ],
    },
    ModifyInstanceCreditSpecification: {
      errors: ["InstanceCreditSpecification.NotSupported"],
    },
    ModifyInstanceEventStartTime: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ModifyInstanceMaintenanceOptions: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ModifyInstanceMetadataDefaults: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ModifyInstanceMetadataOptions: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ModifyInstancePlacement: {
      errors: ["InvalidInstanceID.NotFound", "InvalidHostID.NotFound"],
    },
    MonitorInstances: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    RebootInstances: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ReportInstanceStatus: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ResetInstanceAttribute: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    SendDiagnosticInterrupt: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    StartInstances: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    StopInstances: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    TerminateInstances: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    UnmonitorInstances: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    RunInstances: {
      errors: [
        "InvalidAMIID.NotFound",
        "InvalidAMIID.Malformed",
        "InvalidAMIID.Unavailable",
        "InvalidSubnetID.NotFound",
        "InvalidSecurityGroupId.NotFound",
        "InvalidKeyPair.NotFound",
        "InvalidBlockDeviceMapping",
        "InvalidInstanceType",
        "InvalidParameterValue",
        "InsufficientInstanceCapacity",
      ],
    },

    // ========== Instance Event Window Operations ==========
    AssociateInstanceEventWindow: {
      errors: ["InvalidInstanceEventWindowId.NotFound"],
    },
    DeleteInstanceEventWindow: {
      errors: ["InvalidInstanceEventWindowId.NotFound"],
    },
    DisassociateInstanceEventWindow: {
      errors: ["InvalidInstanceEventWindowId.NotFound"],
    },
    ModifyInstanceEventWindow: {
      errors: ["InvalidInstanceEventWindowId.NotFound"],
    },

    // ========== Internet Gateway Operations ==========
    AttachInternetGateway: {
      errors: [
        "InvalidInternetGatewayID.NotFound",
        "InvalidInternetGatewayId.Malformed",
        "InvalidVpcID.NotFound",
        "Resource.AlreadyAssociated",
      ],
    },
    DeleteInternetGateway: {
      errors: [
        "InvalidInternetGatewayID.NotFound",
        "InvalidInternetGatewayId.Malformed",
        "DependencyViolation",
      ],
    },
    DescribeInternetGateways: {
      errors: [
        "InvalidInternetGatewayID.NotFound",
        "InvalidInternetGatewayId.Malformed",
      ],
    },
    DetachInternetGateway: {
      errors: [
        "InvalidInternetGatewayID.NotFound",
        "InvalidInternetGatewayId.Malformed",
        "InvalidVpcID.NotFound",
        "Gateway.NotAttached",
        "DependencyViolation",
      ],
    },

    // ========== Key Pair Operations ==========
    CreateKeyPair: {
      errors: ["InvalidKeyPair.Duplicate"],
    },
    DeleteKeyPair: {
      errors: ["InvalidKeyPair.NotFound"],
    },
    DescribeKeyPairs: {
      errors: ["InvalidKeyPair.NotFound"],
    },
    ImportKeyPair: {
      errors: ["InvalidKeyPair.Duplicate", "InvalidKeyPair.Format"],
    },

    // ========== Launch Template Operations ==========
    CreateLaunchTemplate: {
      errors: [
        "InvalidLaunchTemplateId.AlreadyExists",
        "InvalidLaunchTemplateName.AlreadyExistsException",
      ],
    },
    CreateLaunchTemplateVersion: {
      errors: [
        "InvalidLaunchTemplateId.NotFound",
        "InvalidLaunchTemplateName.NotFoundException",
        "InvalidLaunchTemplateId.Malformed",
      ],
    },
    DeleteLaunchTemplate: {
      errors: [
        "InvalidLaunchTemplateId.NotFound",
        "InvalidLaunchTemplateName.NotFoundException",
        "InvalidLaunchTemplateId.Malformed",
      ],
    },
    DeleteLaunchTemplateVersions: {
      errors: [
        "InvalidLaunchTemplateId.NotFound",
        "InvalidLaunchTemplateId.VersionNotFound",
        "InvalidLaunchTemplateId.Malformed",
      ],
    },
    DescribeLaunchTemplates: {
      errors: [
        "InvalidLaunchTemplateId.NotFound",
        "InvalidLaunchTemplateName.NotFoundException",
        "InvalidLaunchTemplateId.Malformed",
      ],
    },
    DescribeLaunchTemplateVersions: {
      errors: [
        "InvalidLaunchTemplateId.NotFound",
        "InvalidLaunchTemplateId.VersionNotFound",
        "InvalidLaunchTemplateId.Malformed",
      ],
    },
    GetLaunchTemplateData: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    ModifyLaunchTemplate: {
      errors: [
        "InvalidLaunchTemplateId.NotFound",
        "InvalidLaunchTemplateName.NotFoundException",
      ],
    },

    // ========== Local Gateway Operations ==========
    CreateLocalGatewayRoute: {
      errors: [
        "InvalidLocalGatewayID.NotFound",
        "InvalidLocalGatewayRouteTableVpcAssociationId.NotFound",
      ],
    },
    CreateLocalGatewayRouteTableVpcAssociation: {
      errors: ["InvalidLocalGatewayID.NotFound", "InvalidVpcID.NotFound"],
    },
    DeleteLocalGatewayRoute: {
      errors: [
        "InvalidLocalGatewayRouteTableVpcAssociationId.NotFound",
        "InvalidLocalGatewayRouteTableID.NotFound",
        "InvalidRoute.NotFound",
      ],
    },
    DeleteLocalGatewayRouteTableVpcAssociation: {
      errors: [
        "InvalidLocalGatewayRouteTableVpcAssociationId.NotFound",
        "DependencyViolation",
      ],
    },
    DescribeLocalGatewayRouteTables: {
      errors: ["InvalidLocalGatewayID.NotFound"],
    },
    DescribeLocalGatewayRouteTableVirtualInterfaceGroupAssociations: {
      errors: [
        "InvalidLocalGatewayRouteTableVirtualInterfaceGroupAssociationId.NotFound",
      ],
    },
    DescribeLocalGatewayRouteTableVpcAssociations: {
      errors: ["InvalidLocalGatewayRouteTableVpcAssociationId.NotFound"],
    },
    DescribeLocalGateways: {
      errors: ["InvalidLocalGatewayID.NotFound"],
    },
    DescribeLocalGatewayVirtualInterfaceGroups: {
      errors: ["InvalidLocalGatewayVirtualInterfaceGroupId.NotFound"],
    },
    SearchLocalGatewayRoutes: {
      errors: ["InvalidLocalGatewayRouteTableID.NotFound"],
    },

    // ========== NAT Gateway Operations ==========
    CreateNatGateway: {
      errors: [
        "InvalidSubnetID.NotFound",
        "InvalidAllocationID.NotFound",
        "InvalidElasticIpID.NotFound",
      ],
    },
    DeleteNatGateway: {
      errors: [
        "NatGatewayNotFound",
        "NatGatewayMalformed",
        "DependencyViolation",
      ],
    },
    DescribeNatGateways: {
      errors: ["NatGatewayNotFound", "NatGatewayMalformed"],
    },

    // ========== Network ACL Operations ==========
    CreateNetworkAclEntry: {
      errors: ["InvalidNetworkAclID.NotFound"],
    },
    DeleteNetworkAcl: {
      errors: [
        "InvalidNetworkAclID.NotFound",
        "InvalidNetworkAclId.Malformed",
        "InvalidNetworkAcl.InUse",
        "DependencyViolation",
      ],
    },
    DeleteNetworkAclEntry: {
      errors: [
        "InvalidNetworkAclID.NotFound",
        "InvalidNetworkAclEntry.NotFound",
      ],
    },
    DescribeNetworkAcls: {
      errors: ["InvalidNetworkAclID.NotFound"],
    },
    ReplaceNetworkAclAssociation: {
      errors: ["InvalidNetworkAclID.NotFound", "InvalidAssociationID.NotFound"],
    },
    ReplaceNetworkAclEntry: {
      errors: [
        "InvalidNetworkAclID.NotFound",
        "InvalidNetworkAclEntry.NotFound",
      ],
    },

    // ========== Network Insights Operations ==========
    DeleteNetworkInsightsAccessScope: {
      errors: ["InvalidNetworkInsightsAccessScopeId.NotFound"],
    },
    DeleteNetworkInsightsAccessScopeAnalysis: {
      errors: ["InvalidNetworkInsightsAccessScopeAnalysisId.NotFound"],
    },
    DeleteNetworkInsightsAnalysis: {
      errors: ["InvalidNetworkInsightsAnalysisId.NotFound"],
    },
    DeleteNetworkInsightsPath: {
      errors: [
        "InvalidNetworkInsightsPathId.NotFound",
        "AnalysisExistsForNetworkInsightsPath",
      ],
    },
    DescribeNetworkInsightsAccessScopeAnalyses: {
      errors: ["InvalidNetworkInsightsAccessScopeAnalysisId.NotFound"],
    },
    DescribeNetworkInsightsAccessScopes: {
      errors: ["InvalidNetworkInsightsAccessScopeId.NotFound"],
    },
    DescribeNetworkInsightsAnalyses: {
      errors: ["InvalidNetworkInsightsAnalysisId.NotFound"],
    },
    DescribeNetworkInsightsPaths: {
      errors: ["InvalidNetworkInsightsPathId.NotFound"],
    },
    GetNetworkInsightsAccessScopeAnalysisFindings: {
      errors: ["InvalidNetworkInsightsAccessScopeAnalysisId.NotFound"],
    },
    GetNetworkInsightsAccessScopeContent: {
      errors: ["InvalidNetworkInsightsAccessScopeId.NotFound"],
    },
    StartNetworkInsightsAccessScopeAnalysis: {
      errors: ["InvalidNetworkInsightsAccessScopeId.NotFound"],
    },
    StartNetworkInsightsAnalysis: {
      errors: ["InvalidNetworkInsightsPathId.NotFound"],
    },

    // ========== Network Interface Operations ==========
    AssignPrivateIpAddresses: {
      errors: ["InvalidNetworkInterfaceID.NotFound"],
    },
    AttachNetworkInterface: {
      errors: [
        "InvalidNetworkInterfaceID.NotFound",
        "InvalidInstanceID.NotFound",
      ],
    },
    CreateNetworkInterface: {
      errors: ["InvalidSubnetID.NotFound", "InvalidSecurityGroupId.NotFound"],
    },
    DeleteNetworkInterface: {
      errors: ["InvalidNetworkInterfaceID.NotFound", "DependencyViolation"],
    },
    DescribeNetworkInterfaceAttribute: {
      errors: ["InvalidNetworkInterfaceID.NotFound"],
    },
    DescribeNetworkInterfaces: {
      errors: ["InvalidNetworkInterfaceID.NotFound"],
    },
    DetachNetworkInterface: {
      errors: [
        "InvalidAttachmentID.NotFound",
        "InvalidNetworkInterfaceAttachmentId.Malformed",
        "DependencyViolation",
      ],
    },
    ModifyNetworkInterfaceAttribute: {
      errors: [
        "InvalidNetworkInterfaceID.NotFound",
        "InvalidSecurityGroupId.NotFound",
      ],
    },
    ResetNetworkInterfaceAttribute: {
      errors: ["InvalidNetworkInterfaceID.NotFound"],
    },
    UnassignPrivateIpAddresses: {
      errors: ["InvalidNetworkInterfaceID.NotFound"],
    },

    // ========== Placement Group Operations ==========
    CreatePlacementGroup: {
      errors: ["InvalidPlacementGroup.Duplicate"],
    },
    DeletePlacementGroup: {
      errors: ["InvalidPlacementGroup.Unknown", "InvalidPlacementGroup.InUse"],
    },
    DescribePlacementGroups: {
      errors: ["InvalidPlacementGroup.Unknown"],
    },

    // ========== Prefix List Operations ==========
    DeleteManagedPrefixList: {
      errors: ["InvalidPrefixListId.NotFound"],
    },
    DescribeManagedPrefixLists: {
      errors: ["InvalidPrefixListId.NotFound", "InvalidPrefixListId.Malformed"],
    },
    DescribePrefixLists: {
      errors: ["InvalidPrefixListId.NotFound"],
    },
    GetManagedPrefixListAssociations: {
      errors: ["InvalidPrefixListId.NotFound"],
    },
    GetManagedPrefixListEntries: {
      errors: ["InvalidPrefixListId.NotFound"],
    },
    ModifyManagedPrefixList: {
      errors: ["InvalidPrefixListId.NotFound"],
    },
    RestoreManagedPrefixListVersion: {
      errors: ["InvalidPrefixListId.NotFound"],
    },

    // ========== Replace Root Volume Task Operations ==========
    CreateReplaceRootVolumeTask: {
      errors: ["InvalidInstanceID.NotFound", "InvalidSnapshotId.Malformed"],
    },
    DescribeReplaceRootVolumeTasks: {
      errors: [
        "InvalidReplaceRootVolumeTaskId.NotFound",
        "InvalidReplaceRootVolumeTaskId.Malformed",
      ],
    },

    // ========== Reserved Instance Operations ==========
    DescribeReservedInstances: {
      errors: [
        "InvalidReservationID.NotFound",
        "InvalidReservationID.Malformed",
      ],
    },
    ModifyReservedInstances: {
      errors: ["InvalidReservationID.NotFound"],
    },

    // ========== Route Operations ==========
    CreateRoute: {
      errors: [
        "InvalidRouteTableID.NotFound",
        "InvalidGatewayID.NotFound",
        "InvalidInstanceID.NotFound",
        "InvalidNetworkInterfaceID.NotFound",
        "InvalidNatGatewayID.NotFound",
        "InvalidTransitGatewayId.NotFound",
        "InvalidVpcPeeringConnectionID.NotFound",
      ],
    },
    DeleteRoute: {
      errors: ["InvalidRouteTableID.NotFound", "InvalidRoute.NotFound"],
    },
    ReplaceRoute: {
      errors: ["InvalidRouteTableID.NotFound", "InvalidRoute.NotFound"],
    },

    // ========== Route Table Operations ==========
    AssociateRouteTable: {
      errors: [
        "InvalidRouteTableID.NotFound",
        "InvalidSubnetID.NotFound",
        "InvalidGatewayID.NotFound",
      ],
    },
    CreateRouteTable: {
      errors: ["InvalidVpcID.NotFound"],
    },
    DeleteRouteTable: {
      errors: ["InvalidRouteTableID.NotFound", "DependencyViolation"],
    },
    DescribeRouteTables: {
      errors: ["InvalidRouteTableID.NotFound", "InvalidRouteTableId.Malformed"],
    },
    DisassociateRouteTable: {
      errors: ["InvalidAssociationID.NotFound"],
    },
    ReplaceRouteTableAssociation: {
      errors: ["InvalidRouteTableID.NotFound", "InvalidAssociationID.NotFound"],
    },

    // ========== Security Group Operations ==========
    AuthorizeSecurityGroupEgress: {
      errors: [
        "InvalidGroup.NotFound",
        "InvalidSecurityGroupId.NotFound",
        "InvalidPermission.Duplicate",
      ],
    },
    AuthorizeSecurityGroupIngress: {
      errors: [
        "InvalidGroup.NotFound",
        "InvalidSecurityGroupId.NotFound",
        "InvalidPermission.Duplicate",
      ],
    },
    CreateSecurityGroup: {
      errors: ["InvalidVpcID.NotFound", "InvalidGroup.Duplicate"],
    },
    DeleteSecurityGroup: {
      errors: [
        "InvalidGroup.NotFound",
        "InvalidSecurityGroupId.NotFound",
        "InvalidGroupId.Malformed",
        "InvalidGroup.InUse",
        "DependencyViolation",
      ],
    },
    DescribeSecurityGroupReferences: {
      errors: ["InvalidSecurityGroupId.NotFound"],
    },
    DescribeSecurityGroupRules: {
      errors: [
        "InvalidSecurityGroupId.NotFound",
        "InvalidSecurityGroupRuleId.NotFound",
      ],
    },
    DescribeSecurityGroups: {
      errors: [
        "InvalidGroup.NotFound",
        "InvalidSecurityGroupId.NotFound",
        "InvalidGroupId.Malformed",
      ],
    },
    DescribeStaleSecurityGroups: {
      errors: ["InvalidVpcID.NotFound"],
    },
    ModifySecurityGroupRules: {
      errors: [
        "InvalidSecurityGroupId.NotFound",
        "InvalidSecurityGroupRuleId.NotFound",
      ],
    },
    RevokeSecurityGroupEgress: {
      errors: [
        "InvalidGroup.NotFound",
        "InvalidSecurityGroupId.NotFound",
        "InvalidPermission.NotFound",
      ],
    },
    RevokeSecurityGroupIngress: {
      errors: [
        "InvalidGroup.NotFound",
        "InvalidSecurityGroupId.NotFound",
        "InvalidPermission.NotFound",
      ],
    },
    UpdateSecurityGroupRuleDescriptionsEgress: {
      errors: ["InvalidSecurityGroupId.NotFound"],
    },
    UpdateSecurityGroupRuleDescriptionsIngress: {
      errors: ["InvalidSecurityGroupId.NotFound"],
    },

    // ========== Snapshot Operations ==========
    CopySnapshot: {
      errors: ["InvalidSnapshot.NotFound", "InvalidSnapshotID.Malformed"],
    },
    CreateSnapshot: {
      errors: ["InvalidVolume.NotFound"],
    },
    CreateSnapshots: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    DeleteSnapshot: {
      errors: [
        "InvalidSnapshot.NotFound",
        "InvalidSnapshot.InUse",
        "InvalidSnapshotID.Malformed",
      ],
    },
    DescribeSnapshotAttribute: {
      errors: ["InvalidSnapshot.NotFound", "InvalidSnapshotID.Malformed"],
    },
    DescribeSnapshots: {
      errors: ["InvalidSnapshot.NotFound", "InvalidSnapshotID.Malformed"],
    },
    ModifySnapshotAttribute: {
      errors: ["InvalidSnapshot.NotFound"],
    },
    ResetSnapshotAttribute: {
      errors: ["InvalidSnapshot.NotFound"],
    },

    // ========== Spot Operations ==========
    CancelSpotFleetRequests: {
      errors: [
        "InvalidSpotFleetRequestId.NotFound",
        "InvalidSpotFleetRequestId.Malformed",
      ],
    },
    CancelSpotInstanceRequests: {
      errors: [
        "InvalidSpotInstanceRequestID.NotFound",
        "InvalidSpotInstanceRequestID.Malformed",
      ],
    },
    CreateSpotDatafeedSubscription: {
      errors: ["InvalidSpotDatafeed.NotFound"],
    },
    DeleteSpotDatafeedSubscription: {
      errors: ["InvalidSpotDatafeed.NotFound"],
    },
    DescribeSpotDatafeedSubscription: {
      errors: ["InvalidSpotDatafeed.NotFound"],
    },
    DescribeSpotFleetInstances: {
      errors: ["InvalidSpotFleetRequestId.NotFound"],
    },
    DescribeSpotFleetRequestHistory: {
      errors: ["InvalidSpotFleetRequestId.NotFound"],
    },
    DescribeSpotFleetRequests: {
      errors: [
        "InvalidSpotFleetRequestId.NotFound",
        "InvalidSpotFleetRequestId.Malformed",
      ],
    },
    DescribeSpotInstanceRequests: {
      errors: [
        "InvalidSpotInstanceRequestID.NotFound",
        "InvalidSpotInstanceRequestID.Malformed",
      ],
    },
    ModifySpotFleetRequest: {
      errors: ["InvalidSpotFleetRequestId.NotFound"],
    },

    // ========== Subnet Operations ==========
    CreateSubnet: {
      errors: ["InvalidVpcID.NotFound"],
    },
    CreateSubnetCidrReservation: {
      errors: ["InvalidSubnetID.NotFound"],
    },
    DeleteSubnet: {
      errors: [
        "InvalidSubnetID.NotFound",
        "InvalidSubnetId.Malformed",
        "DependencyViolation",
      ],
    },
    DeleteSubnetCidrReservation: {
      errors: ["InvalidSubnetCidrReservationId.NotFound"],
    },
    DescribeSubnets: {
      errors: ["InvalidSubnetID.NotFound", "InvalidSubnetId.Malformed"],
    },
    GetSubnetCidrReservations: {
      errors: ["InvalidSubnetID.NotFound"],
    },
    ModifySubnetAttribute: {
      errors: ["InvalidSubnetID.NotFound"],
    },

    // ========== Traffic Mirror Operations ==========
    CreateTrafficMirrorFilterRule: {
      errors: ["InvalidTrafficMirrorFilterId.NotFound"],
    },
    CreateTrafficMirrorSession: {
      errors: [
        "InvalidTrafficMirrorFilterId.NotFound",
        "InvalidTrafficMirrorTargetId.NotFound",
        "InvalidNetworkInterfaceID.NotFound",
      ],
    },
    CreateTrafficMirrorTarget: {
      errors: ["InvalidNetworkInterfaceID.NotFound"],
    },
    DeleteTrafficMirrorFilter: {
      errors: [
        "InvalidTrafficMirrorFilterId.NotFound",
        "InvalidTrafficMirrorFilter.InUse",
      ],
    },
    DeleteTrafficMirrorFilterRule: {
      errors: ["InvalidTrafficMirrorFilterRuleId.NotFound"],
    },
    DeleteTrafficMirrorSession: {
      errors: ["InvalidTrafficMirrorSessionId.NotFound"],
    },
    DeleteTrafficMirrorTarget: {
      errors: ["InvalidTrafficMirrorTargetId.NotFound"],
    },
    DescribeTrafficMirrorFilters: {
      errors: ["InvalidTrafficMirrorFilterId.NotFound"],
    },
    DescribeTrafficMirrorSessions: {
      errors: ["InvalidTrafficMirrorSessionId.NotFound"],
    },
    DescribeTrafficMirrorTargets: {
      errors: ["InvalidTrafficMirrorTargetId.NotFound"],
    },
    ModifyTrafficMirrorFilterNetworkServices: {
      errors: ["InvalidTrafficMirrorFilterId.NotFound"],
    },
    ModifyTrafficMirrorFilterRule: {
      errors: ["InvalidTrafficMirrorFilterRuleId.NotFound"],
    },
    ModifyTrafficMirrorSession: {
      errors: ["InvalidTrafficMirrorSessionId.NotFound"],
    },

    // ========== Transit Gateway Operations ==========
    AcceptTransitGatewayPeeringAttachment: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    AcceptTransitGatewayVpcAttachment: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    AssociateTransitGatewayMulticastDomain: {
      errors: [
        "InvalidTransitGatewayMulticastDomainId.NotFound",
        "InvalidTransitGatewayAttachmentId.NotFound",
        "InvalidSubnetID.NotFound",
      ],
    },
    AssociateTransitGatewayPolicyTable: {
      errors: [
        "InvalidTransitGatewayPolicyTableId.NotFound",
        "InvalidTransitGatewayAttachmentId.NotFound",
      ],
    },
    AssociateTransitGatewayRouteTable: {
      errors: [
        "InvalidTransitGatewayRouteTableId.NotFound",
        "InvalidTransitGatewayAttachmentId.NotFound",
      ],
    },
    CreateTransitGateway: {
      errors: ["InvalidTransitGatewayId.NotFound"],
    },
    CreateTransitGatewayConnect: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    CreateTransitGatewayConnectPeer: {
      errors: [
        "InvalidTransitGatewayAttachmentId.NotFound",
        "InvalidTransitGatewayConnectPeerId.Malformed",
      ],
    },
    CreateTransitGatewayMulticastDomain: {
      errors: ["InvalidTransitGatewayId.NotFound"],
    },
    CreateTransitGatewayPeeringAttachment: {
      errors: ["InvalidTransitGatewayId.NotFound"],
    },
    CreateTransitGatewayPolicyTable: {
      errors: ["InvalidTransitGatewayId.NotFound"],
    },
    CreateTransitGatewayPrefixListReference: {
      errors: [
        "InvalidTransitGatewayRouteTableId.NotFound",
        "InvalidPrefixListId.NotFound",
      ],
    },
    CreateTransitGatewayRoute: {
      errors: [
        "InvalidTransitGatewayRouteTableId.NotFound",
        "InvalidTransitGatewayAttachmentId.NotFound",
      ],
    },
    CreateTransitGatewayRouteTable: {
      errors: ["InvalidTransitGatewayId.NotFound"],
    },
    CreateTransitGatewayRouteTableAnnouncement: {
      errors: [
        "InvalidTransitGatewayRouteTableId.NotFound",
        "InvalidTransitGatewayAttachmentId.NotFound",
      ],
    },
    CreateTransitGatewayVpcAttachment: {
      errors: [
        "InvalidTransitGatewayId.NotFound",
        "InvalidVpcID.NotFound",
        "InvalidSubnetID.NotFound",
      ],
    },
    DeleteTransitGateway: {
      errors: [
        "InvalidTransitGatewayId.NotFound",
        "InvalidTransitGateway.NotFound",
        "DependencyViolation",
      ],
    },
    DeleteTransitGatewayConnect: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    DeleteTransitGatewayConnectPeer: {
      errors: ["InvalidTransitGatewayConnectPeerId.NotFound"],
    },
    DeleteTransitGatewayMulticastDomain: {
      errors: [
        "InvalidTransitGatewayMulticastDomainId.NotFound",
        "DependencyViolation",
      ],
    },
    DeleteTransitGatewayPeeringAttachment: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    DeleteTransitGatewayPolicyTable: {
      errors: [
        "InvalidTransitGatewayPolicyTableId.NotFound",
        "DependencyViolation",
      ],
    },
    DeleteTransitGatewayPrefixListReference: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    DeleteTransitGatewayRoute: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    DeleteTransitGatewayRouteTable: {
      errors: [
        "InvalidTransitGatewayRouteTableId.NotFound",
        "DependencyViolation",
      ],
    },
    DeleteTransitGatewayRouteTableAnnouncement: {
      errors: ["InvalidTransitGatewayRouteTableAnnouncementId.NotFound"],
    },
    DeleteTransitGatewayVpcAttachment: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    DeregisterTransitGatewayMulticastGroupMembers: {
      errors: ["InvalidTransitGatewayMulticastDomainId.NotFound"],
    },
    DeregisterTransitGatewayMulticastGroupSources: {
      errors: ["InvalidTransitGatewayMulticastDomainId.NotFound"],
    },
    DescribeTransitGatewayAttachments: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    DescribeTransitGatewayConnectPeers: {
      errors: ["InvalidTransitGatewayConnectPeerId.NotFound"],
    },
    DescribeTransitGatewayConnects: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    DescribeTransitGatewayMulticastDomains: {
      errors: ["InvalidTransitGatewayMulticastDomainId.NotFound"],
    },
    DescribeTransitGatewayPeeringAttachments: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    DescribeTransitGatewayPolicyTables: {
      errors: ["InvalidTransitGatewayPolicyTableId.NotFound"],
    },
    DescribeTransitGatewayRouteTableAnnouncements: {
      errors: ["InvalidTransitGatewayRouteTableAnnouncementId.NotFound"],
    },
    DescribeTransitGatewayRouteTables: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    DescribeTransitGateways: {
      errors: [
        "InvalidTransitGatewayId.NotFound",
        "InvalidTransitGateway.NotFound",
        "InvalidTransitGatewayId.Malformed",
      ],
    },
    DescribeTransitGatewayVpcAttachments: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    DisassociateTransitGatewayMulticastDomain: {
      errors: [
        "InvalidTransitGatewayMulticastDomainId.NotFound",
        "InvalidTransitGatewayMulticastDomainAssociation.NotFound",
      ],
    },
    DisassociateTransitGatewayPolicyTable: {
      errors: [
        "InvalidTransitGatewayPolicyTableId.NotFound",
        "InvalidTransitGatewayPolicyTableAssociation.NotFound",
      ],
    },
    DisassociateTransitGatewayRouteTable: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    EnableTransitGatewayRouteTablePropagation: {
      errors: [
        "InvalidTransitGatewayRouteTableId.NotFound",
        "InvalidTransitGatewayAttachmentId.NotFound",
        "TransitGatewayRouteTablePropagation.NotFound",
      ],
    },
    DisableTransitGatewayRouteTablePropagation: {
      errors: [
        "InvalidTransitGatewayRouteTableId.NotFound",
        "InvalidTransitGatewayAttachmentId.NotFound",
        "TransitGatewayRouteTablePropagation.NotFound",
      ],
    },
    ExportTransitGatewayRoutes: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    GetTransitGatewayAttachmentPropagations: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    GetTransitGatewayMulticastDomainAssociations: {
      errors: ["InvalidTransitGatewayMulticastDomainId.NotFound"],
    },
    GetTransitGatewayPolicyTableAssociations: {
      errors: ["InvalidTransitGatewayPolicyTableId.NotFound"],
    },
    GetTransitGatewayPolicyTableEntries: {
      errors: ["InvalidTransitGatewayPolicyTableId.NotFound"],
    },
    GetTransitGatewayPrefixListReferences: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    GetTransitGatewayRouteTableAssociations: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    GetTransitGatewayRouteTablePropagations: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    ModifyTransitGateway: {
      errors: ["InvalidTransitGatewayId.NotFound"],
    },
    ModifyTransitGatewayPrefixListReference: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    ModifyTransitGatewayVpcAttachment: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    RegisterTransitGatewayMulticastGroupMembers: {
      errors: ["InvalidTransitGatewayMulticastDomainId.NotFound"],
    },
    RegisterTransitGatewayMulticastGroupSources: {
      errors: ["InvalidTransitGatewayMulticastDomainId.NotFound"],
    },
    SearchTransitGatewayMulticastGroups: {
      errors: [
        "InvalidTransitGatewayMulticastDomainId.NotFound",
        "TransitGatewayMulticastGroupMember.NotFound",
        "TransitGatewayMulticastGroupSource.NotFound",
      ],
    },
    RejectTransitGatewayPeeringAttachment: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    RejectTransitGatewayVpcAttachment: {
      errors: ["InvalidTransitGatewayAttachmentId.NotFound"],
    },
    ReplaceTransitGatewayRoute: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },
    SearchTransitGatewayRoutes: {
      errors: ["InvalidTransitGatewayRouteTableId.NotFound"],
    },

    // ========== Verified Access Operations ==========
    AttachVerifiedAccessTrustProvider: {
      errors: [
        "InvalidVerifiedAccessInstanceId.NotFound",
        "InvalidVerifiedAccessTrustProviderId.NotFound",
      ],
    },
    CreateVerifiedAccessEndpoint: {
      errors: ["InvalidVerifiedAccessGroupId.NotFound"],
    },
    CreateVerifiedAccessGroup: {
      errors: ["InvalidVerifiedAccessInstanceId.NotFound"],
    },
    DeleteVerifiedAccessEndpoint: {
      errors: ["InvalidVerifiedAccessEndpointId.NotFound"],
    },
    DeleteVerifiedAccessGroup: {
      errors: ["InvalidVerifiedAccessGroupId.NotFound", "DependencyViolation"],
    },
    DeleteVerifiedAccessInstance: {
      errors: [
        "InvalidVerifiedAccessInstanceId.NotFound",
        "DependencyViolation",
      ],
    },
    DeleteVerifiedAccessTrustProvider: {
      errors: ["InvalidVerifiedAccessTrustProviderId.NotFound"],
    },
    DescribeVerifiedAccessEndpoints: {
      errors: ["InvalidVerifiedAccessEndpointId.NotFound"],
    },
    DescribeVerifiedAccessGroups: {
      errors: ["InvalidVerifiedAccessGroupId.NotFound"],
    },
    DescribeVerifiedAccessInstanceLoggingConfigurations: {
      errors: ["InvalidVerifiedAccessInstanceId.NotFound"],
    },
    DescribeVerifiedAccessInstances: {
      errors: ["InvalidVerifiedAccessInstanceId.NotFound"],
    },
    DescribeVerifiedAccessTrustProviders: {
      errors: ["InvalidVerifiedAccessTrustProviderId.NotFound"],
    },
    DetachVerifiedAccessTrustProvider: {
      errors: [
        "InvalidVerifiedAccessInstanceId.NotFound",
        "InvalidVerifiedAccessTrustProviderId.NotFound",
        "DependencyViolation",
      ],
    },
    GetVerifiedAccessEndpointPolicy: {
      errors: ["InvalidVerifiedAccessEndpointId.NotFound"],
    },
    GetVerifiedAccessGroupPolicy: {
      errors: ["InvalidVerifiedAccessGroupId.NotFound"],
    },
    ModifyVerifiedAccessEndpoint: {
      errors: ["InvalidVerifiedAccessEndpointId.NotFound"],
    },
    ModifyVerifiedAccessEndpointPolicy: {
      errors: ["InvalidVerifiedAccessEndpointId.NotFound"],
    },
    ModifyVerifiedAccessGroup: {
      errors: ["InvalidVerifiedAccessGroupId.NotFound"],
    },
    ModifyVerifiedAccessGroupPolicy: {
      errors: ["InvalidVerifiedAccessGroupId.NotFound"],
    },
    ModifyVerifiedAccessInstance: {
      errors: ["InvalidVerifiedAccessInstanceId.NotFound"],
    },
    ModifyVerifiedAccessInstanceLoggingConfiguration: {
      errors: ["InvalidVerifiedAccessInstanceId.NotFound"],
    },
    ModifyVerifiedAccessTrustProvider: {
      errors: ["InvalidVerifiedAccessTrustProviderId.NotFound"],
    },

    // ========== Volume Operations ==========
    AttachVolume: {
      errors: [
        "InvalidVolume.NotFound",
        "InvalidInstanceID.NotFound",
        "InvalidVolumeID.Malformed",
      ],
    },
    CreateVolume: {
      errors: [
        "InvalidSnapshot.NotFound",
        "InvalidVolumeID.Duplicate",
        "InvalidAvailabilityZone",
      ],
    },
    DeleteVolume: {
      errors: [
        "InvalidVolume.NotFound",
        "InvalidVolumeID.Malformed",
        "InvalidParameterValue",
        "VolumeInUse",
      ],
    },
    DescribeVolumeAttribute: {
      errors: ["InvalidVolume.NotFound", "InvalidVolumeID.Malformed"],
    },
    DescribeVolumes: {
      errors: [
        "InvalidVolume.NotFound",
        "InvalidVolumeID.Malformed",
        "InvalidParameterValue",
      ],
    },
    DescribeVolumesModifications: {
      errors: ["InvalidVolume.NotFound"],
    },
    DescribeVolumeStatus: {
      errors: ["InvalidVolume.NotFound"],
    },
    DetachVolume: {
      errors: [
        "InvalidVolume.NotFound",
        "InvalidInstanceID.NotFound",
        "InvalidAttachment.NotFound",
        "DependencyViolation",
      ],
    },
    EnableVolumeIO: {
      errors: ["InvalidVolume.NotFound"],
    },
    ModifyVolume: {
      errors: ["InvalidVolume.NotFound"],
    },
    ModifyVolumeAttribute: {
      errors: ["InvalidVolume.NotFound"],
    },

    // ========== VPC Operations ==========
    CreateVpc: {
      errors: ["VpcLimitExceeded"],
    },
    DeleteVpc: {
      errors: ["InvalidVpcID.NotFound", "DependencyViolation"],
    },
    DescribeVpcAttribute: {
      errors: ["InvalidVpcID.NotFound"],
    },
    DescribeVpcClassicLink: {
      errors: ["InvalidVpcID.NotFound"],
    },
    DescribeVpcClassicLinkDnsSupport: {
      errors: ["InvalidVpcID.NotFound"],
    },
    DescribeVpcs: {
      errors: ["InvalidVpcID.NotFound", "InvalidVpcID.Malformed"],
    },
    DisableVpcClassicLink: {
      errors: ["InvalidVpcID.NotFound"],
    },
    DisableVpcClassicLinkDnsSupport: {
      errors: ["InvalidVpcID.NotFound"],
    },
    EnableVpcClassicLink: {
      errors: ["InvalidVpcID.NotFound"],
    },
    EnableVpcClassicLinkDnsSupport: {
      errors: ["InvalidVpcID.NotFound"],
    },
    ModifyVpcAttribute: {
      errors: ["InvalidVpcID.NotFound"],
    },
    ModifyVpcTenancy: {
      errors: ["InvalidVpcID.NotFound"],
    },

    // ========== VPC Endpoint Operations ==========
    AcceptVpcEndpointConnections: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },
    CreateVpcEndpoint: {
      errors: [
        "InvalidVpcID.NotFound",
        "InvalidSubnetID.NotFound",
        "InvalidSecurityGroupId.NotFound",
        "InvalidRouteTableID.NotFound",
      ],
    },
    CreateVpcEndpointConnectionNotification: {
      errors: [
        "InvalidVpcEndpointId.NotFound",
        "InvalidVpcEndpointServiceId.NotFound",
      ],
    },
    CreateVpcEndpointServiceConfiguration: {
      errors: ["InvalidNetworkLoadBalancerArn.NotFound"],
    },
    DeleteVpcEndpointConnectionNotifications: {
      errors: [
        "InvalidVpcEndpointId.NotFound",
        "InvalidConnectionNotification",
      ],
    },
    DeleteVpcEndpoints: {
      errors: ["InvalidVpcEndpointId.NotFound"],
    },
    DeleteVpcEndpointServiceConfigurations: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },
    DescribeVpcEndpointConnectionNotifications: {
      errors: [
        "InvalidVpcEndpointId.NotFound",
        "InvalidConnectionNotification",
      ],
    },
    DescribeVpcEndpointConnections: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },
    DescribeVpcEndpoints: {
      errors: [
        "InvalidVpcEndpoint.NotFound",
        "InvalidVpcEndpointId.NotFound",
        "InvalidVpcEndpointId.Malformed",
      ],
    },
    DescribeVpcEndpointServiceConfigurations: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },
    DescribeVpcEndpointServicePermissions: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },
    DescribeVpcEndpointServices: {
      errors: ["InvalidServiceName"],
    },
    ModifyVpcEndpoint: {
      errors: ["InvalidVpcEndpointId.NotFound"],
    },
    ModifyVpcEndpointConnectionNotification: {
      errors: ["InvalidVpcEndpointId.NotFound"],
    },
    ModifyVpcEndpointServiceConfiguration: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },
    ModifyVpcEndpointServicePayerResponsibility: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },
    ModifyVpcEndpointServicePermissions: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },
    RejectVpcEndpointConnections: {
      errors: ["InvalidVpcEndpointServiceId.NotFound"],
    },

    // ========== VPC Peering Operations ==========
    AcceptVpcPeeringConnection: {
      errors: ["InvalidVpcPeeringConnectionID.NotFound"],
    },
    CreateVpcPeeringConnection: {
      errors: [
        "InvalidVpcID.NotFound",
        "VpcPeeringConnectionAlreadyExists",
        "VpcPeeringConnectionsPerVpcLimitExceeded",
      ],
    },
    DeleteVpcPeeringConnection: {
      errors: [
        "InvalidVpcPeeringConnectionID.NotFound",
        "InvalidVpcPeeringConnection.NotFound",
      ],
    },
    DescribeVpcPeeringConnections: {
      errors: [
        "InvalidVpcPeeringConnectionID.NotFound",
        "InvalidVpcPeeringConnection.NotFound",
        "InvalidVpcPeeringConnectionId.Malformed",
      ],
    },
    ModifyVpcPeeringConnectionOptions: {
      errors: ["InvalidVpcPeeringConnectionID.NotFound"],
    },
    RejectVpcPeeringConnection: {
      errors: ["InvalidVpcPeeringConnectionID.NotFound"],
    },

    // ========== VPN Connection Operations ==========
    CreateVpnConnection: {
      errors: [
        "InvalidCustomerGatewayID.NotFound",
        "InvalidVpnGatewayID.NotFound",
        "InvalidTransitGatewayId.NotFound",
        "VpnConnectionLimitExceeded",
      ],
    },
    CreateVpnConnectionRoute: {
      errors: ["InvalidVpnConnectionID.NotFound"],
    },
    DeleteVpnConnection: {
      errors: ["InvalidVpnConnectionID.NotFound"],
    },
    DeleteVpnConnectionRoute: {
      errors: ["InvalidVpnConnectionID.NotFound"],
    },
    DescribeVpnConnections: {
      errors: ["InvalidVpnConnectionID.NotFound", "InvalidVpnConnectionID"],
    },
    ModifyVpnConnection: {
      errors: ["InvalidVpnConnectionID.NotFound"],
    },
    ModifyVpnConnectionOptions: {
      errors: ["InvalidVpnConnectionID.NotFound"],
    },
    ModifyVpnTunnelCertificate: {
      errors: ["InvalidVpnConnectionID.NotFound"],
    },
    ModifyVpnTunnelOptions: {
      errors: ["InvalidVpnConnectionID.NotFound"],
    },

    // ========== VPN Gateway Operations ==========
    AttachVpnGateway: {
      errors: ["InvalidVpnGatewayID.NotFound", "InvalidVpcID.NotFound"],
    },
    CreateVpnGateway: {
      errors: ["VpnGatewayLimitExceeded"],
    },
    DeleteVpnGateway: {
      errors: [
        "InvalidVpnGatewayID.NotFound",
        "DependencyViolation",
        "IncorrectState",
      ],
    },
    DescribeVpnGateways: {
      errors: ["InvalidVpnGatewayID.NotFound"],
    },
    DetachVpnGateway: {
      errors: [
        "InvalidVpnGatewayID.NotFound",
        "InvalidVpcID.NotFound",
        "InvalidVpnGatewayAttachment.NotFound",
        "DependencyViolation",
      ],
    },
    DisableVgwRoutePropagation: {
      errors: [
        "InvalidRouteTableID.NotFound",
        "InvalidVpnGatewayID.NotFound",
        "Gateway.NotAttached",
      ],
    },
    EnableVgwRoutePropagation: {
      errors: [
        "InvalidRouteTableID.NotFound",
        "InvalidVpnGatewayID.NotFound",
        "Gateway.NotAttached",
      ],
    },

    // ========== VPN Concentrator Operations ==========
    CreateVpnConcentrator: {
      errors: ["InvalidSubnetID.NotFound"],
    },
    DeleteVpnConcentrator: {
      errors: ["InvalidVpnConcentratorID.NotFound"],
    },
    DescribeVpnConcentrators: {
      errors: ["InvalidVpnConcentratorID.NotFound"],
    },

    // ========== Egress-Only Internet Gateway Operations ==========
    CreateEgressOnlyInternetGateway: {
      errors: ["InvalidVpcID.NotFound"],
    },
    DeleteEgressOnlyInternetGateway: {
      errors: [
        "InvalidGatewayID.NotFound",
        "DependencyViolation",
        "InvalidEgressOnlyInternetGatewayId.NotFound",
      ],
    },
    DescribeEgressOnlyInternetGateways: {
      errors: ["InvalidGatewayID.NotFound"],
    },

    // ========== IPAM Operations ==========
    AllocateIpamPoolCidr: {
      errors: ["InvalidIpamPoolId.NotFound"],
    },
    CreateIpamPool: {
      errors: ["InvalidIpamScopeId.NotFound"],
    },
    CreateIpamScope: {
      errors: ["InvalidIpamId.NotFound"],
    },
    DeleteIpam: {
      errors: ["InvalidIpamId.NotFound", "DependencyViolation"],
    },
    DeleteIpamPool: {
      errors: ["InvalidIpamPoolId.NotFound", "DependencyViolation"],
    },
    DeleteIpamResourceDiscovery: {
      errors: [
        "InvalidIpamResourceDiscoveryId.NotFound",
        "DependencyViolation",
      ],
    },
    DeleteIpamScope: {
      errors: ["InvalidIpamScopeId.NotFound", "DependencyViolation"],
    },
    DeprovisionIpamByoasn: {
      errors: ["InvalidIpamId.NotFound"],
    },
    DeprovisionIpamPoolCidr: {
      errors: ["InvalidIpamPoolId.NotFound"],
    },
    DeprovisionPublicIpv4PoolCidr: {
      errors: ["InvalidPoolID.NotFound"],
    },
    DescribeIpamPools: {
      errors: ["InvalidIpamPoolId.NotFound"],
    },
    DescribeIpamResourceDiscoveries: {
      errors: ["InvalidIpamResourceDiscoveryId.NotFound"],
    },
    DescribeIpamResourceDiscoveryAssociations: {
      errors: ["InvalidIpamResourceDiscoveryAssociationId.NotFound"],
    },
    DescribeIpamScopes: {
      errors: ["InvalidIpamScopeId.NotFound"],
    },
    DescribeIpams: {
      errors: ["InvalidIpamId.NotFound"],
    },
    DisassociateIpamByoasn: {
      errors: ["InvalidIpamId.NotFound"],
    },
    DisassociateIpamResourceDiscovery: {
      errors: ["InvalidIpamResourceDiscoveryAssociationId.NotFound"],
    },
    GetIpamAddressHistory: {
      errors: ["InvalidIpamScopeId.NotFound"],
    },
    GetIpamDiscoveredAccounts: {
      errors: ["InvalidIpamResourceDiscoveryId.NotFound"],
    },
    GetIpamDiscoveredPublicAddresses: {
      errors: ["InvalidIpamResourceDiscoveryId.NotFound"],
    },
    GetIpamDiscoveredResourceCidrs: {
      errors: ["InvalidIpamResourceDiscoveryId.NotFound"],
    },

    GetIpamPoolAllocations: {
      errors: [
        "InvalidIpamPoolId.NotFound",
        "InvalidIpamPoolAllocationId.NotFound",
      ],
    },
    GetIpamPoolCidrs: {
      errors: ["InvalidIpamPoolId.NotFound"],
    },
    GetIpamResourceCidrs: {
      errors: ["InvalidIpamScopeId.NotFound"],
    },
    ModifyIpam: {
      errors: ["InvalidIpamId.NotFound"],
    },
    ModifyIpamPool: {
      errors: ["InvalidIpamPoolId.NotFound"],
    },
    ModifyIpamResourceCidr: {
      errors: ["InvalidIpamPoolId.NotFound"],
    },
    ModifyIpamResourceDiscovery: {
      errors: ["InvalidIpamResourceDiscoveryId.NotFound"],
    },
    ModifyIpamScope: {
      errors: ["InvalidIpamScopeId.NotFound"],
    },
    MoveByoipCidrToIpam: {
      errors: ["InvalidIpamPoolId.NotFound"],
    },
    ProvisionIpamByoasn: {
      errors: ["InvalidIpamId.NotFound"],
    },
    ProvisionIpamPoolCidr: {
      errors: ["InvalidIpamPoolId.NotFound"],
    },
    ProvisionPublicIpv4PoolCidr: {
      errors: ["InvalidPoolID.NotFound", "InvalidIpamPoolId.NotFound"],
    },
    ReleaseIpamPoolAllocation: {
      errors: [
        "InvalidIpamPoolId.NotFound",
        "InvalidIpamPoolAllocationId.NotFound",
      ],
    },

    // ========== Public IPv4 Pool Operations ==========
    DescribePublicIpv4Pools: {
      errors: [
        "InvalidPoolID.NotFound",
        "InvalidPoolID.Malformed",
        "InvalidPublicIpv4PoolID.NotFound",
      ],
    },

    // ========== Coip Pool Operations ==========
    DescribeCoipPools: {
      errors: ["InvalidCoipPoolId.NotFound", "InvalidCoipPoolId.Malformed"],
    },

    // ========== IAM Instance Profile Operations ==========
    AssociateIamInstanceProfile: {
      errors: ["InvalidInstanceID.NotFound"],
    },
    DescribeIamInstanceProfileAssociations: {
      errors: ["InvalidAssociationID.NotFound"],
    },
    DisassociateIamInstanceProfile: {
      errors: ["InvalidAssociationID.NotFound"],
    },
    ReplaceIamInstanceProfileAssociation: {
      errors: ["InvalidAssociationID.NotFound"],
    },

    // ========== Fleet Operations ==========
    DeleteFleets: {
      errors: ["InvalidFleetId.NotFound"],
    },
    DescribeFleets: {
      errors: ["InvalidFleetId.NotFound"],
    },
    ModifyFleet: {
      errors: ["InvalidFleetId.NotFound"],
    },

    // ========== Instance Connect Endpoint Operations ==========
    CreateInstanceConnectEndpoint: {
      errors: ["InvalidSubnetID.NotFound"],
    },
    DeleteInstanceConnectEndpoint: {
      errors: ["InvalidInstanceConnectEndpointId.NotFound"],
    },
    DescribeInstanceConnectEndpoints: {
      errors: ["InvalidInstanceConnectEndpointId.NotFound"],
    },

    // ========== Route Server Operations ==========
    CreateRouteServer: {
      errors: ["InvalidSubnetID.NotFound"],
    },
    DeleteRouteServer: {
      errors: ["InvalidRouteServerId.NotFound", "IncorrectState"],
    },
    DescribeRouteServers: {
      errors: ["InvalidRouteServerId.NotFound"],
    },
    ModifyRouteServer: {
      errors: ["InvalidRouteServerId.NotFound"],
    },
    AssociateRouteServer: {
      errors: ["InvalidRouteServerId.NotFound", "InvalidVpcID.NotFound"],
    },
    DisassociateRouteServer: {
      errors: [
        "InvalidRouteServerId.NotAssociated",
        "InvalidRouteServerId.NotFound",
        "InvalidVpcID.NotFound",
      ],
    },
    GetRouteServerAssociations: {
      errors: [
        "InvalidRouteServerId.NotAssociated",
        "InvalidRouteServerId.NotFound",
      ],
    },
    EnableRouteServerPropagation: {
      errors: ["InvalidRouteServerId.NotFound", "InvalidRouteTableID.NotFound"],
    },
    DisableRouteServerPropagation: {
      errors: [
        "InvalidRouteServerId.NotPropagated",
        "InvalidRouteServerId.NotFound",
      ],
    },
    GetRouteServerPropagations: {
      errors: [
        "InvalidRouteServerId.NotPropagated",
        "InvalidRouteServerId.NotFound",
      ],
    },
    CreateRouteServerEndpoint: {
      errors: ["InvalidRouteServerId.NotFound", "InvalidSubnetID.NotFound"],
    },
    DeleteRouteServerEndpoint: {
      errors: ["InvalidRouteServerEndpointId.NotFound", "IncorrectState"],
    },
    DescribeRouteServerEndpoints: {
      errors: ["InvalidRouteServerEndpointId.NotFound"],
    },
    CreateRouteServerPeer: {
      errors: ["InvalidRouteServerEndpointId.NotFound"],
    },
    DeleteRouteServerPeer: {
      errors: ["InvalidRouteServerPeerId.NotFound", "IncorrectState"],
    },
    DescribeRouteServerPeers: {
      errors: ["InvalidRouteServerPeerId.NotFound"],
    },

    // ========== VPC Block Public Access Operations ==========
    CreateVpcBlockPublicAccessExclusion: {
      errors: ["InvalidVpcID.NotFound", "InvalidSubnetID.NotFound"],
    },
    DeleteVpcBlockPublicAccessExclusion: {
      errors: ["InvalidVpcBlockPublicAccessExclusionId.NotFound"],
    },
    DescribeVpcBlockPublicAccessExclusions: {
      errors: ["InvalidVpcBlockPublicAccessExclusionId.NotFound"],
    },
    ModifyVpcBlockPublicAccessExclusion: {
      errors: ["InvalidVpcBlockPublicAccessExclusionId.NotFound"],
    },

    // ========== VPC CIDR Block Association Operations ==========
    AssociateVpcCidrBlock: {
      errors: ["InvalidVpcID.NotFound"],
    },
    DisassociateVpcCidrBlock: {
      errors: [
        "InvalidVpcCidrBlockAssociationID.NotFound",
        "InvalidVpcID.NotFound",
      ],
    },

    // ========== VPC Encryption Control Operations ==========
    CreateVpcEncryptionControl: {
      errors: ["InvalidVpcID.NotFound"],
    },
    DeleteVpcEncryptionControl: {
      errors: ["InvalidVpcEncryptionControlId.NotFound"],
    },
    DescribeVpcEncryptionControls: {
      errors: ["InvalidVpcEncryptionControlId.NotFound"],
    },
    ModifyVpcEncryptionControl: {
      errors: ["InvalidVpcEncryptionControlId.NotFound"],
    },

    // ========== Security Group VPC Association Operations ==========
    AssociateSecurityGroupVpc: {
      errors: ["InvalidGroup.NotFound", "InvalidVpcID.NotFound"],
    },
    DisassociateSecurityGroupVpc: {
      errors: ["InvalidGroup.NotFound", "InvalidVpcID.NotFound"],
    },
  },
  s3: {
    // ========== Bucket Operations ==========
    CreateBucket: {
      errors: [
        "BucketAlreadyExists",
        "BucketAlreadyOwnedByYou",
        "IllegalLocationConstraintException",
        "InvalidBucketName",
        "TooManyBuckets",
        "OperationAborted",
      ],
    },
    DeleteBucket: {
      errors: ["NoSuchBucket", "BucketNotEmpty", "AccessDenied"],
    },
    HeadBucket: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    ListBuckets: {
      errors: ["AccessDenied"],
    },

    // ========== Object Operations ==========
    GetObject: {
      errors: [
        "NoSuchKey",
        "NoSuchBucket",
        "InvalidObjectState",
        "AccessDenied",
      ],
    },
    HeadObject: {
      errors: ["NotFound", "AccessDenied"],
    },
    PutObject: {
      errors: [
        "NoSuchBucket",
        "InvalidArgument",
        "InvalidRequest",
        "AccessDenied",
        "EntityTooLarge",
      ],
    },
    DeleteObject: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    DeleteObjects: {
      errors: ["NoSuchBucket", "MalformedXML", "AccessDenied"],
    },
    CopyObject: {
      errors: [
        "NoSuchKey",
        "NoSuchBucket",
        "InvalidArgument",
        "InvalidRequest",
        "AccessDenied",
      ],
    },
    GetObjectAttributes: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },
    ListObjects: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    ListObjectsV2: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    ListObjectVersions: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },

    // ========== Multipart Upload Operations ==========
    CreateMultipartUpload: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    UploadPart: {
      errors: [
        "NoSuchUpload",
        "NoSuchBucket",
        "InvalidArgument",
        "AccessDenied",
      ],
    },
    UploadPartCopy: {
      errors: [
        "NoSuchUpload",
        "NoSuchKey",
        "NoSuchBucket",
        "InvalidArgument",
        "AccessDenied",
      ],
    },
    CompleteMultipartUpload: {
      errors: [
        "NoSuchUpload",
        "NoSuchBucket",
        "InvalidPart",
        "InvalidPartOrder",
        "AccessDenied",
      ],
    },
    AbortMultipartUpload: {
      errors: ["NoSuchUpload", "NoSuchBucket", "AccessDenied"],
    },
    ListMultipartUploads: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    ListParts: {
      errors: ["NoSuchUpload", "NoSuchBucket", "AccessDenied"],
    },

    // ========== Bucket Policy Operations ==========
    GetBucketPolicy: {
      errors: [
        "NoSuchBucket",
        "NoSuchBucketPolicy",
        "AccessDenied",
        "InvalidBucketState",
      ],
    },
    PutBucketPolicy: {
      errors: ["NoSuchBucket", "MalformedPolicy", "AccessDenied"],
    },
    DeleteBucketPolicy: {
      errors: ["NoSuchBucket", "NoSuchBucketPolicy", "AccessDenied"],
    },
    GetBucketPolicyStatus: {
      errors: ["NoSuchBucket", "NoSuchBucketPolicy", "AccessDenied"],
    },

    // ========== CORS Operations ==========
    GetBucketCors: {
      errors: ["NoSuchBucket", "NoSuchCORSConfiguration", "AccessDenied"],
    },
    PutBucketCors: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeleteBucketCors: {
      errors: ["NoSuchBucket", "NoSuchCORSConfiguration", "AccessDenied"],
    },

    // ========== Lifecycle Operations ==========
    GetBucketLifecycleConfiguration: {
      errors: ["NoSuchBucket", "NoSuchLifecycleConfiguration", "AccessDenied"],
    },
    PutBucketLifecycleConfiguration: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeleteBucketLifecycle: {
      errors: [
        "NoSuchBucket",
        "NoSuchLifecycleConfiguration",
        "MethodNotAllowed",
        "AccessDenied",
      ],
    },

    // ========== Tagging Operations ==========
    GetBucketTagging: {
      errors: [
        "NoSuchBucket",
        "NoSuchTagSet",
        "NoSuchTagSetError",
        "MethodNotAllowed",
        "NotImplemented",
        "AccessDenied",
      ],
    },
    PutBucketTagging: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    DeleteBucketTagging: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    GetObjectTagging: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },
    PutObjectTagging: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },
    DeleteObjectTagging: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },

    // ========== Website Operations ==========
    GetBucketWebsite: {
      errors: ["NoSuchBucket", "NoSuchWebsiteConfiguration", "AccessDenied"],
    },
    PutBucketWebsite: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeleteBucketWebsite: {
      errors: ["NoSuchBucket", "NoSuchWebsiteConfiguration", "AccessDenied"],
    },

    // ========== Public Access Block Operations ==========
    GetPublicAccessBlock: {
      errors: [
        "NoSuchBucket",
        "NoSuchPublicAccessBlockConfiguration",
        "AccessDenied",
      ],
    },
    PutPublicAccessBlock: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeletePublicAccessBlock: {
      errors: [
        "NoSuchBucket",
        "NoSuchPublicAccessBlockConfiguration",
        "AccessDenied",
      ],
    },

    // ========== Object Lock Operations ==========
    GetObjectLockConfiguration: {
      errors: [
        "NoSuchBucket",
        "ObjectLockConfigurationNotFound",
        "ObjectLockConfigurationNotFoundError",
        "MethodNotAllowed",
        "NotImplemented",
        "AccessDenied",
      ],
    },
    PutObjectLockConfiguration: {
      errors: ["NoSuchBucket", "InvalidBucketState", "AccessDenied"],
    },
    GetObjectLegalHold: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },
    PutObjectLegalHold: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },
    GetObjectRetention: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },
    PutObjectRetention: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },

    // ========== Replication Operations ==========
    GetBucketReplication: {
      errors: [
        "NoSuchBucket",
        "ReplicationConfigurationNotFoundError",
        "AccessDenied",
      ],
    },
    PutBucketReplication: {
      errors: [
        "NoSuchBucket",
        "InvalidRequest",
        "InvalidArgument",
        "AccessDenied",
      ],
    },
    DeleteBucketReplication: {
      errors: [
        "NoSuchBucket",
        "ReplicationConfigurationNotFoundError",
        "AccessDenied",
      ],
    },

    // ========== Encryption Operations ==========
    GetBucketEncryption: {
      errors: [
        "NoSuchBucket",
        "ServerSideEncryptionConfigurationNotFoundError",
        "AccessDenied",
      ],
    },
    PutBucketEncryption: {
      errors: ["NoSuchBucket", "OperationAborted", "AccessDenied"],
    },
    DeleteBucketEncryption: {
      errors: [
        "NoSuchBucket",
        "ServerSideEncryptionConfigurationNotFoundError",
        "AccessDenied",
      ],
    },

    // ========== Ownership Controls Operations ==========
    GetBucketOwnershipControls: {
      errors: [
        "NoSuchBucket",
        "OwnershipControlsNotFoundError",
        "AccessDenied",
      ],
    },
    PutBucketOwnershipControls: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeleteBucketOwnershipControls: {
      errors: [
        "NoSuchBucket",
        "OwnershipControlsNotFoundError",
        "AccessDenied",
      ],
    },

    // ========== ACL Operations ==========
    GetBucketAcl: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    PutBucketAcl: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    GetObjectAcl: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },
    PutObjectAcl: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },

    // ========== Versioning Operations ==========
    GetBucketVersioning: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    PutBucketVersioning: {
      errors: [
        "NoSuchBucket",
        "InvalidArgument",
        "InvalidBucketState",
        "AccessDenied",
      ],
    },

    // ========== Logging Operations ==========
    GetBucketLogging: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    PutBucketLogging: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },

    // ========== Notification Operations ==========
    GetBucketNotificationConfiguration: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    PutBucketNotificationConfiguration: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },

    // ========== Analytics Configuration Operations ==========
    GetBucketAnalyticsConfiguration: {
      errors: ["NoSuchBucket", "NoSuchConfiguration", "AccessDenied"],
    },
    PutBucketAnalyticsConfiguration: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeleteBucketAnalyticsConfiguration: {
      errors: ["NoSuchBucket", "NoSuchConfiguration", "AccessDenied"],
    },
    ListBucketAnalyticsConfigurations: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },

    // ========== Inventory Configuration Operations ==========
    GetBucketInventoryConfiguration: {
      errors: ["NoSuchBucket", "NoSuchConfiguration", "AccessDenied"],
    },
    PutBucketInventoryConfiguration: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeleteBucketInventoryConfiguration: {
      errors: ["NoSuchBucket", "NoSuchConfiguration", "AccessDenied"],
    },
    ListBucketInventoryConfigurations: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },

    // ========== Metrics Configuration Operations ==========
    GetBucketMetricsConfiguration: {
      errors: ["NoSuchBucket", "NoSuchConfiguration", "AccessDenied"],
    },
    PutBucketMetricsConfiguration: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeleteBucketMetricsConfiguration: {
      errors: ["NoSuchBucket", "NoSuchConfiguration", "AccessDenied"],
    },
    ListBucketMetricsConfigurations: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },

    // ========== Intelligent-Tiering Configuration Operations ==========
    GetBucketIntelligentTieringConfiguration: {
      errors: ["NoSuchBucket", "NoSuchConfiguration", "AccessDenied"],
    },
    PutBucketIntelligentTieringConfiguration: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },
    DeleteBucketIntelligentTieringConfiguration: {
      errors: ["NoSuchBucket", "NoSuchConfiguration", "AccessDenied"],
    },
    ListBucketIntelligentTieringConfigurations: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },

    // ========== Accelerate Configuration Operations ==========
    GetBucketAccelerateConfiguration: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    PutBucketAccelerateConfiguration: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },

    // ========== Request Payment Operations ==========
    GetBucketRequestPayment: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    PutBucketRequestPayment: {
      errors: ["NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },

    // ========== Location Operations ==========
    GetBucketLocation: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },

    // ========== Metadata Configuration Operations ==========
    GetBucketMetadataConfiguration: {
      errors: ["NoSuchBucket", "MetadataConfigurationNotFound", "AccessDenied"],
    },
    CreateBucketMetadataConfiguration: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    DeleteBucketMetadataConfiguration: {
      errors: ["NoSuchBucket", "MetadataConfigurationNotFound", "AccessDenied"],
    },
    GetBucketMetadataTableConfiguration: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    CreateBucketMetadataTableConfiguration: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },
    DeleteBucketMetadataTableConfiguration: {
      errors: ["NoSuchBucket", "AccessDenied"],
    },

    // ========== Restore Operations ==========
    RestoreObject: {
      errors: [
        "NoSuchKey",
        "NoSuchBucket",
        "ObjectAlreadyInActiveTierError",
        "InvalidObjectState",
        "AccessDenied",
      ],
    },

    // ========== Select Operations ==========
    SelectObjectContent: {
      errors: ["NoSuchKey", "NoSuchBucket", "InvalidArgument", "AccessDenied"],
    },

    // ========== Torrent Operations ==========
    GetObjectTorrent: {
      errors: ["NoSuchKey", "NoSuchBucket", "AccessDenied"],
    },
  },
};
