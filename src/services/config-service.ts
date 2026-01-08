import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://config.amazonaws.com/doc/2014-11-12/");
const svc = T.AwsApiService({
  sdkId: "Config Service",
  serviceShapeName: "StarlingDoveService",
});
const auth = T.AwsAuthSigv4({ name: "config" });
const ver = T.ServiceVersion("2014-11-12");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://config-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://config.${Region}.amazonaws.com`);
            }
            return e(
              `https://config-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://config.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://config.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AmazonResourceName = string;
export type ConfigurationAggregatorName = string;
export type AccountId = string;
export type AwsRegion = string;
export type ConfigRuleName = string;
export type RecorderName = string;
export type ConformancePackName = string;
export type ChannelName = string;
export type StringWithCharLimit64 = string;
export type OrganizationConfigRuleName = string;
export type OrganizationConformancePackName = string;
export type ResourceTypeString = string;
export type ResourceId = string;
export type RetentionConfigurationName = string;
export type ServicePrincipal = string;
export type QueryName = string;
export type GroupByAPILimit = number;
export type NextToken = string;
export type Limit = number;
export type StringWithCharLimit256 = string;
export type BaseResourceId = string;
export type RuleLimit = number;
export type DescribeConformancePackComplianceLimit = number;
export type PageSizeLimit = number;
export type CosmosPageLimit = number;
export type DescribePendingAggregationRequestsLimit = number;
export type ResourceEvaluationId = string;
export type GetConformancePackComplianceDetailsLimit = number;
export type LaterTime = Date;
export type EarlierTime = Date;
export type MaxResults = number;
export type ResourceName = string;
export type ListResourceEvaluationsPageItemLimit = number;
export type TemplateS3Uri = string;
export type TemplateBody = string;
export type DeliveryS3Bucket = string;
export type DeliveryS3KeyPrefix = string;
export type StringWithCharLimit1024 = string;
export type SchemaVersionId = string;
export type Configuration = string;
export type RetentionPeriodInDays = number;
export type Expression = string;
export type EvaluationTimeout = number;
export type ClientToken = string;
export type TagKey = string;
export type ConfigurationRecorderFilterValue = string;
export type EvaluationContextIdentifier = string;
export type TagValue = string;
export type EmptiableStringWithCharLimit256 = string;
export type ParameterName = string;
export type ParameterValue = string;
export type SSMDocumentName = string;
export type SSMDocumentVersion = string;
export type OrderingTimestamp = Date;
export type StringWithCharLimit256Min0 = string;
export type StringWithCharLimit2048 = string;
export type StringWithCharLimit768 = string;
export type StringWithCharLimit128 = string;
export type PolicyRuntime = string;
export type PolicyText = string;
export type AutoRemediationAttempts = number;
export type AutoRemediationAttemptSeconds = number;
export type Name = string;
export type Value = string;
export type QueryId = string;
export type QueryArn = string;
export type QueryDescription = string;
export type QueryExpression = string;
export type ResourceConfiguration = string;
export type ErrorMessage = string;
export type ResourceTypeValue = string;
export type ServicePrincipalValue = string;
export type AllSupported = boolean;
export type IncludeGlobalResourceTypes = boolean;
export type ConfigurationAggregatorArn = string;
export type ConformancePackArn = string;
export type ConformancePackId = string;
export type StackArn = string;
export type ConformancePackStatusReason = string;
export type Version = string;
export type ConfigurationItemCaptureTime = Date;
export type ConfigurationStateId = string;
export type ConfigurationItemMD5Hash = string;
export type ARN = string;
export type AvailabilityZone = string;
export type ResourceCreationTime = Date;
export type RelatedEvent = string;
export type ConfigurationItemDeliveryTime = Date;
export type ResourceDeletionTime = Date;
export type Description = string;
export type Percentage = number;
export type RelationshipName = string;
export type SupplementaryConfigurationName = string;
export type SupplementaryConfigurationValue = string;
export type FieldName = string;
export type Annotation = string;
export type ComplianceScore = string;
export type LastUpdatedTime = Date;

//# Schemas
export interface GetComplianceSummaryByConfigRuleRequest {}
export const GetComplianceSummaryByConfigRuleRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetComplianceSummaryByConfigRuleRequest",
}) as any as S.Schema<GetComplianceSummaryByConfigRuleRequest>;
export type ResourceType =
  | "AWS::EC2::CustomerGateway"
  | "AWS::EC2::EIP"
  | "AWS::EC2::Host"
  | "AWS::EC2::Instance"
  | "AWS::EC2::InternetGateway"
  | "AWS::EC2::NetworkAcl"
  | "AWS::EC2::NetworkInterface"
  | "AWS::EC2::RouteTable"
  | "AWS::EC2::SecurityGroup"
  | "AWS::EC2::Subnet"
  | "AWS::CloudTrail::Trail"
  | "AWS::EC2::Volume"
  | "AWS::EC2::VPC"
  | "AWS::EC2::VPNConnection"
  | "AWS::EC2::VPNGateway"
  | "AWS::EC2::RegisteredHAInstance"
  | "AWS::EC2::NatGateway"
  | "AWS::EC2::EgressOnlyInternetGateway"
  | "AWS::EC2::VPCEndpoint"
  | "AWS::EC2::VPCEndpointService"
  | "AWS::EC2::FlowLog"
  | "AWS::EC2::VPCPeeringConnection"
  | "AWS::Elasticsearch::Domain"
  | "AWS::IAM::Group"
  | "AWS::IAM::Policy"
  | "AWS::IAM::Role"
  | "AWS::IAM::User"
  | "AWS::ElasticLoadBalancingV2::LoadBalancer"
  | "AWS::ACM::Certificate"
  | "AWS::RDS::DBInstance"
  | "AWS::RDS::DBSubnetGroup"
  | "AWS::RDS::DBSecurityGroup"
  | "AWS::RDS::DBSnapshot"
  | "AWS::RDS::DBCluster"
  | "AWS::RDS::DBClusterSnapshot"
  | "AWS::RDS::EventSubscription"
  | "AWS::S3::Bucket"
  | "AWS::S3::AccountPublicAccessBlock"
  | "AWS::Redshift::Cluster"
  | "AWS::Redshift::ClusterSnapshot"
  | "AWS::Redshift::ClusterParameterGroup"
  | "AWS::Redshift::ClusterSecurityGroup"
  | "AWS::Redshift::ClusterSubnetGroup"
  | "AWS::Redshift::EventSubscription"
  | "AWS::SSM::ManagedInstanceInventory"
  | "AWS::CloudWatch::Alarm"
  | "AWS::CloudFormation::Stack"
  | "AWS::ElasticLoadBalancing::LoadBalancer"
  | "AWS::AutoScaling::AutoScalingGroup"
  | "AWS::AutoScaling::LaunchConfiguration"
  | "AWS::AutoScaling::ScalingPolicy"
  | "AWS::AutoScaling::ScheduledAction"
  | "AWS::DynamoDB::Table"
  | "AWS::CodeBuild::Project"
  | "AWS::WAF::RateBasedRule"
  | "AWS::WAF::Rule"
  | "AWS::WAF::RuleGroup"
  | "AWS::WAF::WebACL"
  | "AWS::WAFRegional::RateBasedRule"
  | "AWS::WAFRegional::Rule"
  | "AWS::WAFRegional::RuleGroup"
  | "AWS::WAFRegional::WebACL"
  | "AWS::CloudFront::Distribution"
  | "AWS::CloudFront::StreamingDistribution"
  | "AWS::Lambda::Function"
  | "AWS::NetworkFirewall::Firewall"
  | "AWS::NetworkFirewall::FirewallPolicy"
  | "AWS::NetworkFirewall::RuleGroup"
  | "AWS::ElasticBeanstalk::Application"
  | "AWS::ElasticBeanstalk::ApplicationVersion"
  | "AWS::ElasticBeanstalk::Environment"
  | "AWS::WAFv2::WebACL"
  | "AWS::WAFv2::RuleGroup"
  | "AWS::WAFv2::IPSet"
  | "AWS::WAFv2::RegexPatternSet"
  | "AWS::WAFv2::ManagedRuleSet"
  | "AWS::XRay::EncryptionConfig"
  | "AWS::SSM::AssociationCompliance"
  | "AWS::SSM::PatchCompliance"
  | "AWS::Shield::Protection"
  | "AWS::ShieldRegional::Protection"
  | "AWS::Config::ConformancePackCompliance"
  | "AWS::Config::ResourceCompliance"
  | "AWS::ApiGateway::Stage"
  | "AWS::ApiGateway::RestApi"
  | "AWS::ApiGatewayV2::Stage"
  | "AWS::ApiGatewayV2::Api"
  | "AWS::CodePipeline::Pipeline"
  | "AWS::ServiceCatalog::CloudFormationProvisionedProduct"
  | "AWS::ServiceCatalog::CloudFormationProduct"
  | "AWS::ServiceCatalog::Portfolio"
  | "AWS::SQS::Queue"
  | "AWS::KMS::Key"
  | "AWS::QLDB::Ledger"
  | "AWS::SecretsManager::Secret"
  | "AWS::SNS::Topic"
  | "AWS::SSM::FileData"
  | "AWS::Backup::BackupPlan"
  | "AWS::Backup::BackupSelection"
  | "AWS::Backup::BackupVault"
  | "AWS::Backup::RecoveryPoint"
  | "AWS::ECR::Repository"
  | "AWS::ECS::Cluster"
  | "AWS::ECS::Service"
  | "AWS::ECS::TaskDefinition"
  | "AWS::EFS::AccessPoint"
  | "AWS::EFS::FileSystem"
  | "AWS::EKS::Cluster"
  | "AWS::OpenSearch::Domain"
  | "AWS::EC2::TransitGateway"
  | "AWS::Kinesis::Stream"
  | "AWS::Kinesis::StreamConsumer"
  | "AWS::CodeDeploy::Application"
  | "AWS::CodeDeploy::DeploymentConfig"
  | "AWS::CodeDeploy::DeploymentGroup"
  | "AWS::EC2::LaunchTemplate"
  | "AWS::ECR::PublicRepository"
  | "AWS::GuardDuty::Detector"
  | "AWS::EMR::SecurityConfiguration"
  | "AWS::SageMaker::CodeRepository"
  | "AWS::Route53Resolver::ResolverEndpoint"
  | "AWS::Route53Resolver::ResolverRule"
  | "AWS::Route53Resolver::ResolverRuleAssociation"
  | "AWS::DMS::ReplicationSubnetGroup"
  | "AWS::DMS::EventSubscription"
  | "AWS::MSK::Cluster"
  | "AWS::StepFunctions::Activity"
  | "AWS::WorkSpaces::Workspace"
  | "AWS::WorkSpaces::ConnectionAlias"
  | "AWS::SageMaker::Model"
  | "AWS::ElasticLoadBalancingV2::Listener"
  | "AWS::StepFunctions::StateMachine"
  | "AWS::Batch::JobQueue"
  | "AWS::Batch::ComputeEnvironment"
  | "AWS::AccessAnalyzer::Analyzer"
  | "AWS::Athena::WorkGroup"
  | "AWS::Athena::DataCatalog"
  | "AWS::Detective::Graph"
  | "AWS::GlobalAccelerator::Accelerator"
  | "AWS::GlobalAccelerator::EndpointGroup"
  | "AWS::GlobalAccelerator::Listener"
  | "AWS::EC2::TransitGatewayAttachment"
  | "AWS::EC2::TransitGatewayRouteTable"
  | "AWS::DMS::Certificate"
  | "AWS::AppConfig::Application"
  | "AWS::AppSync::GraphQLApi"
  | "AWS::DataSync::LocationSMB"
  | "AWS::DataSync::LocationFSxLustre"
  | "AWS::DataSync::LocationS3"
  | "AWS::DataSync::LocationEFS"
  | "AWS::DataSync::Task"
  | "AWS::DataSync::LocationNFS"
  | "AWS::EC2::NetworkInsightsAccessScopeAnalysis"
  | "AWS::EKS::FargateProfile"
  | "AWS::Glue::Job"
  | "AWS::GuardDuty::ThreatIntelSet"
  | "AWS::GuardDuty::IPSet"
  | "AWS::SageMaker::Workteam"
  | "AWS::SageMaker::NotebookInstanceLifecycleConfig"
  | "AWS::ServiceDiscovery::Service"
  | "AWS::ServiceDiscovery::PublicDnsNamespace"
  | "AWS::SES::ContactList"
  | "AWS::SES::ConfigurationSet"
  | "AWS::Route53::HostedZone"
  | "AWS::IoTEvents::Input"
  | "AWS::IoTEvents::DetectorModel"
  | "AWS::IoTEvents::AlarmModel"
  | "AWS::ServiceDiscovery::HttpNamespace"
  | "AWS::Events::EventBus"
  | "AWS::ImageBuilder::ContainerRecipe"
  | "AWS::ImageBuilder::DistributionConfiguration"
  | "AWS::ImageBuilder::InfrastructureConfiguration"
  | "AWS::DataSync::LocationObjectStorage"
  | "AWS::DataSync::LocationHDFS"
  | "AWS::Glue::Classifier"
  | "AWS::Route53RecoveryReadiness::Cell"
  | "AWS::Route53RecoveryReadiness::ReadinessCheck"
  | "AWS::ECR::RegistryPolicy"
  | "AWS::Backup::ReportPlan"
  | "AWS::Lightsail::Certificate"
  | "AWS::RUM::AppMonitor"
  | "AWS::Events::Endpoint"
  | "AWS::SES::ReceiptRuleSet"
  | "AWS::Events::Archive"
  | "AWS::Events::ApiDestination"
  | "AWS::Lightsail::Disk"
  | "AWS::FIS::ExperimentTemplate"
  | "AWS::DataSync::LocationFSxWindows"
  | "AWS::SES::ReceiptFilter"
  | "AWS::GuardDuty::Filter"
  | "AWS::SES::Template"
  | "AWS::AmazonMQ::Broker"
  | "AWS::AppConfig::Environment"
  | "AWS::AppConfig::ConfigurationProfile"
  | "AWS::Cloud9::EnvironmentEC2"
  | "AWS::EventSchemas::Registry"
  | "AWS::EventSchemas::RegistryPolicy"
  | "AWS::EventSchemas::Discoverer"
  | "AWS::FraudDetector::Label"
  | "AWS::FraudDetector::EntityType"
  | "AWS::FraudDetector::Variable"
  | "AWS::FraudDetector::Outcome"
  | "AWS::IoT::Authorizer"
  | "AWS::IoT::SecurityProfile"
  | "AWS::IoT::RoleAlias"
  | "AWS::IoT::Dimension"
  | "AWS::IoTAnalytics::Datastore"
  | "AWS::Lightsail::Bucket"
  | "AWS::Lightsail::StaticIp"
  | "AWS::MediaPackage::PackagingGroup"
  | "AWS::Route53RecoveryReadiness::RecoveryGroup"
  | "AWS::ResilienceHub::ResiliencyPolicy"
  | "AWS::Transfer::Workflow"
  | "AWS::EKS::IdentityProviderConfig"
  | "AWS::EKS::Addon"
  | "AWS::Glue::MLTransform"
  | "AWS::IoT::Policy"
  | "AWS::IoT::MitigationAction"
  | "AWS::IoTTwinMaker::Workspace"
  | "AWS::IoTTwinMaker::Entity"
  | "AWS::IoTAnalytics::Dataset"
  | "AWS::IoTAnalytics::Pipeline"
  | "AWS::IoTAnalytics::Channel"
  | "AWS::IoTSiteWise::Dashboard"
  | "AWS::IoTSiteWise::Project"
  | "AWS::IoTSiteWise::Portal"
  | "AWS::IoTSiteWise::AssetModel"
  | "AWS::IVS::Channel"
  | "AWS::IVS::RecordingConfiguration"
  | "AWS::IVS::PlaybackKeyPair"
  | "AWS::KinesisAnalyticsV2::Application"
  | "AWS::RDS::GlobalCluster"
  | "AWS::S3::MultiRegionAccessPoint"
  | "AWS::DeviceFarm::TestGridProject"
  | "AWS::Budgets::BudgetsAction"
  | "AWS::Lex::Bot"
  | "AWS::CodeGuruReviewer::RepositoryAssociation"
  | "AWS::IoT::CustomMetric"
  | "AWS::Route53Resolver::FirewallDomainList"
  | "AWS::RoboMaker::RobotApplicationVersion"
  | "AWS::EC2::TrafficMirrorSession"
  | "AWS::IoTSiteWise::Gateway"
  | "AWS::Lex::BotAlias"
  | "AWS::LookoutMetrics::Alert"
  | "AWS::IoT::AccountAuditConfiguration"
  | "AWS::EC2::TrafficMirrorTarget"
  | "AWS::S3::StorageLens"
  | "AWS::IoT::ScheduledAudit"
  | "AWS::Events::Connection"
  | "AWS::EventSchemas::Schema"
  | "AWS::MediaPackage::PackagingConfiguration"
  | "AWS::KinesisVideo::SignalingChannel"
  | "AWS::AppStream::DirectoryConfig"
  | "AWS::LookoutVision::Project"
  | "AWS::Route53RecoveryControl::Cluster"
  | "AWS::Route53RecoveryControl::SafetyRule"
  | "AWS::Route53RecoveryControl::ControlPanel"
  | "AWS::Route53RecoveryControl::RoutingControl"
  | "AWS::Route53RecoveryReadiness::ResourceSet"
  | "AWS::RoboMaker::SimulationApplication"
  | "AWS::RoboMaker::RobotApplication"
  | "AWS::HealthLake::FHIRDatastore"
  | "AWS::Pinpoint::Segment"
  | "AWS::Pinpoint::ApplicationSettings"
  | "AWS::Events::Rule"
  | "AWS::EC2::DHCPOptions"
  | "AWS::EC2::NetworkInsightsPath"
  | "AWS::EC2::TrafficMirrorFilter"
  | "AWS::EC2::IPAM"
  | "AWS::IoTTwinMaker::Scene"
  | "AWS::NetworkManager::TransitGatewayRegistration"
  | "AWS::CustomerProfiles::Domain"
  | "AWS::AutoScaling::WarmPool"
  | "AWS::Connect::PhoneNumber"
  | "AWS::AppConfig::DeploymentStrategy"
  | "AWS::AppFlow::Flow"
  | "AWS::AuditManager::Assessment"
  | "AWS::CloudWatch::MetricStream"
  | "AWS::DeviceFarm::InstanceProfile"
  | "AWS::DeviceFarm::Project"
  | "AWS::EC2::EC2Fleet"
  | "AWS::EC2::SubnetRouteTableAssociation"
  | "AWS::ECR::PullThroughCacheRule"
  | "AWS::GroundStation::Config"
  | "AWS::ImageBuilder::ImagePipeline"
  | "AWS::IoT::FleetMetric"
  | "AWS::IoTWireless::ServiceProfile"
  | "AWS::NetworkManager::Device"
  | "AWS::NetworkManager::GlobalNetwork"
  | "AWS::NetworkManager::Link"
  | "AWS::NetworkManager::Site"
  | "AWS::Panorama::Package"
  | "AWS::Pinpoint::App"
  | "AWS::Redshift::ScheduledAction"
  | "AWS::Route53Resolver::FirewallRuleGroupAssociation"
  | "AWS::SageMaker::AppImageConfig"
  | "AWS::SageMaker::Image"
  | "AWS::ECS::TaskSet"
  | "AWS::Cassandra::Keyspace"
  | "AWS::Signer::SigningProfile"
  | "AWS::Amplify::App"
  | "AWS::AppMesh::VirtualNode"
  | "AWS::AppMesh::VirtualService"
  | "AWS::AppRunner::VpcConnector"
  | "AWS::AppStream::Application"
  | "AWS::CodeArtifact::Repository"
  | "AWS::EC2::PrefixList"
  | "AWS::EC2::SpotFleet"
  | "AWS::Evidently::Project"
  | "AWS::Forecast::Dataset"
  | "AWS::IAM::SAMLProvider"
  | "AWS::IAM::ServerCertificate"
  | "AWS::Pinpoint::Campaign"
  | "AWS::Pinpoint::InAppTemplate"
  | "AWS::SageMaker::Domain"
  | "AWS::Transfer::Agreement"
  | "AWS::Transfer::Connector"
  | "AWS::KinesisFirehose::DeliveryStream"
  | "AWS::Amplify::Branch"
  | "AWS::AppIntegrations::EventIntegration"
  | "AWS::AppMesh::Route"
  | "AWS::Athena::PreparedStatement"
  | "AWS::EC2::IPAMScope"
  | "AWS::Evidently::Launch"
  | "AWS::Forecast::DatasetGroup"
  | "AWS::GreengrassV2::ComponentVersion"
  | "AWS::GroundStation::MissionProfile"
  | "AWS::MediaConnect::FlowEntitlement"
  | "AWS::MediaConnect::FlowVpcInterface"
  | "AWS::MediaTailor::PlaybackConfiguration"
  | "AWS::MSK::Configuration"
  | "AWS::Personalize::Dataset"
  | "AWS::Personalize::Schema"
  | "AWS::Personalize::Solution"
  | "AWS::Pinpoint::EmailTemplate"
  | "AWS::Pinpoint::EventStream"
  | "AWS::ResilienceHub::App"
  | "AWS::ACMPCA::CertificateAuthority"
  | "AWS::AppConfig::HostedConfigurationVersion"
  | "AWS::AppMesh::VirtualGateway"
  | "AWS::AppMesh::VirtualRouter"
  | "AWS::AppRunner::Service"
  | "AWS::CustomerProfiles::ObjectType"
  | "AWS::DMS::Endpoint"
  | "AWS::EC2::CapacityReservation"
  | "AWS::EC2::ClientVpnEndpoint"
  | "AWS::Kendra::Index"
  | "AWS::KinesisVideo::Stream"
  | "AWS::Logs::Destination"
  | "AWS::Pinpoint::EmailChannel"
  | "AWS::S3::AccessPoint"
  | "AWS::NetworkManager::CustomerGatewayAssociation"
  | "AWS::NetworkManager::LinkAssociation"
  | "AWS::IoTWireless::MulticastGroup"
  | "AWS::Personalize::DatasetGroup"
  | "AWS::IoTTwinMaker::ComponentType"
  | "AWS::CodeBuild::ReportGroup"
  | "AWS::SageMaker::FeatureGroup"
  | "AWS::MSK::BatchScramSecret"
  | "AWS::AppStream::Stack"
  | "AWS::IoT::JobTemplate"
  | "AWS::IoTWireless::FuotaTask"
  | "AWS::IoT::ProvisioningTemplate"
  | "AWS::InspectorV2::Filter"
  | "AWS::Route53Resolver::ResolverQueryLoggingConfigAssociation"
  | "AWS::ServiceDiscovery::Instance"
  | "AWS::Transfer::Certificate"
  | "AWS::MediaConnect::FlowSource"
  | "AWS::APS::RuleGroupsNamespace"
  | "AWS::CodeGuruProfiler::ProfilingGroup"
  | "AWS::Route53Resolver::ResolverQueryLoggingConfig"
  | "AWS::Batch::SchedulingPolicy"
  | "AWS::ACMPCA::CertificateAuthorityActivation"
  | "AWS::AppMesh::GatewayRoute"
  | "AWS::AppMesh::Mesh"
  | "AWS::Connect::Instance"
  | "AWS::Connect::QuickConnect"
  | "AWS::EC2::CarrierGateway"
  | "AWS::EC2::IPAMPool"
  | "AWS::EC2::TransitGatewayConnect"
  | "AWS::EC2::TransitGatewayMulticastDomain"
  | "AWS::ECS::CapacityProvider"
  | "AWS::IAM::InstanceProfile"
  | "AWS::IoT::CACertificate"
  | "AWS::IoTTwinMaker::SyncJob"
  | "AWS::KafkaConnect::Connector"
  | "AWS::Lambda::CodeSigningConfig"
  | "AWS::NetworkManager::ConnectPeer"
  | "AWS::ResourceExplorer2::Index"
  | "AWS::AppStream::Fleet"
  | "AWS::Cognito::UserPool"
  | "AWS::Cognito::UserPoolClient"
  | "AWS::Cognito::UserPoolGroup"
  | "AWS::EC2::NetworkInsightsAccessScope"
  | "AWS::EC2::NetworkInsightsAnalysis"
  | "AWS::Grafana::Workspace"
  | "AWS::GroundStation::DataflowEndpointGroup"
  | "AWS::ImageBuilder::ImageRecipe"
  | "AWS::KMS::Alias"
  | "AWS::M2::Environment"
  | "AWS::QuickSight::DataSource"
  | "AWS::QuickSight::Template"
  | "AWS::QuickSight::Theme"
  | "AWS::RDS::OptionGroup"
  | "AWS::Redshift::EndpointAccess"
  | "AWS::Route53Resolver::FirewallRuleGroup"
  | "AWS::SSM::Document"
  | "AWS::AppConfig::ExtensionAssociation"
  | "AWS::AppIntegrations::Application"
  | "AWS::AppSync::ApiCache"
  | "AWS::Bedrock::Guardrail"
  | "AWS::Bedrock::KnowledgeBase"
  | "AWS::Cognito::IdentityPool"
  | "AWS::Connect::Rule"
  | "AWS::Connect::User"
  | "AWS::EC2::ClientVpnTargetNetworkAssociation"
  | "AWS::EC2::EIPAssociation"
  | "AWS::EC2::IPAMResourceDiscovery"
  | "AWS::EC2::IPAMResourceDiscoveryAssociation"
  | "AWS::EC2::InstanceConnectEndpoint"
  | "AWS::EC2::SnapshotBlockPublicAccess"
  | "AWS::EC2::VPCBlockPublicAccessExclusion"
  | "AWS::EC2::VPCBlockPublicAccessOptions"
  | "AWS::EC2::VPCEndpointConnectionNotification"
  | "AWS::EC2::VPNConnectionRoute"
  | "AWS::Evidently::Segment"
  | "AWS::IAM::OIDCProvider"
  | "AWS::InspectorV2::Activation"
  | "AWS::MSK::ClusterPolicy"
  | "AWS::MSK::VpcConnection"
  | "AWS::MediaConnect::Gateway"
  | "AWS::MemoryDB::SubnetGroup"
  | "AWS::OpenSearchServerless::Collection"
  | "AWS::OpenSearchServerless::VpcEndpoint"
  | "AWS::Redshift::EndpointAuthorization"
  | "AWS::Route53Profiles::Profile"
  | "AWS::S3::StorageLensGroup"
  | "AWS::S3Express::BucketPolicy"
  | "AWS::S3Express::DirectoryBucket"
  | "AWS::SageMaker::InferenceExperiment"
  | "AWS::SecurityHub::Standard"
  | "AWS::Transfer::Profile"
  | "AWS::CloudFormation::StackSet"
  | "AWS::MediaPackageV2::Channel"
  | "AWS::S3::AccessGrantsLocation"
  | "AWS::S3::AccessGrant"
  | "AWS::S3::AccessGrantsInstance"
  | "AWS::EMRServerless::Application"
  | "AWS::Config::AggregationAuthorization"
  | "AWS::Bedrock::ApplicationInferenceProfile"
  | "AWS::ApiGatewayV2::Integration"
  | "AWS::SageMaker::MlflowTrackingServer"
  | "AWS::SageMaker::ModelBiasJobDefinition"
  | "AWS::SecretsManager::RotationSchedule"
  | "AWS::Deadline::QueueFleetAssociation"
  | "AWS::ECR::RepositoryCreationTemplate"
  | "AWS::CloudFormation::LambdaHook"
  | "AWS::EC2::SubnetNetworkAclAssociation"
  | "AWS::ApiGateway::UsagePlan"
  | "AWS::AppConfig::Extension"
  | "AWS::Deadline::Fleet"
  | "AWS::EMR::Studio"
  | "AWS::S3Tables::TableBucket"
  | "AWS::CloudFront::RealtimeLogConfig"
  | "AWS::BackupGateway::Hypervisor"
  | "AWS::BCMDataExports::Export"
  | "AWS::CloudFormation::GuardHook"
  | "AWS::CloudFront::PublicKey"
  | "AWS::CloudTrail::EventDataStore"
  | "AWS::EntityResolution::IdMappingWorkflow"
  | "AWS::EntityResolution::SchemaMapping"
  | "AWS::IoT::DomainConfiguration"
  | "AWS::PCAConnectorAD::DirectoryRegistration"
  | "AWS::RDS::Integration"
  | "AWS::Config::ConformancePack"
  | "AWS::RolesAnywhere::Profile"
  | "AWS::CodeArtifact::Domain"
  | "AWS::Backup::RestoreTestingPlan"
  | "AWS::Config::StoredQuery"
  | "AWS::SageMaker::DataQualityJobDefinition"
  | "AWS::SageMaker::ModelExplainabilityJobDefinition"
  | "AWS::SageMaker::ModelQualityJobDefinition"
  | "AWS::SageMaker::StudioLifecycleConfig"
  | "AWS::SES::DedicatedIpPool"
  | "AWS::SES::MailManagerTrafficPolicy"
  | "AWS::SSM::ResourceDataSync"
  | "AWS::BedrockAgentCore::Runtime"
  | "AWS::BedrockAgentCore::BrowserCustom"
  | "AWS::ElasticLoadBalancingV2::TargetGroup"
  | "AWS::EMRContainers::VirtualCluster"
  | "AWS::EntityResolution::MatchingWorkflow"
  | "AWS::IoTCoreDeviceAdvisor::SuiteDefinition"
  | "AWS::EC2::SecurityGroupVpcAssociation"
  | "AWS::EC2::VerifiedAccessInstance"
  | "AWS::KafkaConnect::CustomPlugin"
  | "AWS::NetworkManager::TransitGatewayPeering"
  | "AWS::OpenSearchServerless::SecurityConfig"
  | "AWS::Redshift::Integration"
  | "AWS::RolesAnywhere::TrustAnchor"
  | "AWS::Route53Profiles::ProfileAssociation"
  | "AWS::SSMIncidents::ResponsePlan"
  | "AWS::Transfer::Server"
  | "AWS::Glue::Database"
  | "AWS::Organizations::OrganizationalUnit"
  | "AWS::EC2::IPAMPoolCidr"
  | "AWS::EC2::VPCGatewayAttachment"
  | "AWS::Bedrock::Prompt"
  | "AWS::Comprehend::Flywheel"
  | "AWS::DataSync::Agent"
  | "AWS::MediaTailor::LiveSource"
  | "AWS::MSK::ServerlessCluster"
  | "AWS::IoTSiteWise::Asset"
  | "AWS::B2BI::Capability"
  | "AWS::CloudFront::KeyValueStore"
  | "AWS::Deadline::Monitor"
  | "AWS::GuardDuty::MalwareProtectionPlan"
  | "AWS::Location::APIKey"
  | "AWS::MediaPackageV2::OriginEndpoint"
  | "AWS::PCAConnectorAD::Connector"
  | "AWS::S3Tables::TableBucketPolicy"
  | "AWS::SecretsManager::ResourcePolicy"
  | "AWS::SSMContacts::Contact"
  | "AWS::IoT::ThingGroup"
  | "AWS::ImageBuilder::LifecyclePolicy"
  | "AWS::GameLift::Build"
  | "AWS::ECR::ReplicationConfiguration"
  | "AWS::EC2::SubnetCidrBlock"
  | "AWS::Connect::SecurityProfile"
  | "AWS::CleanRoomsML::TrainingDataset"
  | "AWS::AppStream::AppBlockBuilder"
  | "AWS::Route53::DNSSEC"
  | "AWS::SageMaker::UserProfile"
  | "AWS::ApiGateway::Method";
export const ResourceType = S.Literal(
  "AWS::EC2::CustomerGateway",
  "AWS::EC2::EIP",
  "AWS::EC2::Host",
  "AWS::EC2::Instance",
  "AWS::EC2::InternetGateway",
  "AWS::EC2::NetworkAcl",
  "AWS::EC2::NetworkInterface",
  "AWS::EC2::RouteTable",
  "AWS::EC2::SecurityGroup",
  "AWS::EC2::Subnet",
  "AWS::CloudTrail::Trail",
  "AWS::EC2::Volume",
  "AWS::EC2::VPC",
  "AWS::EC2::VPNConnection",
  "AWS::EC2::VPNGateway",
  "AWS::EC2::RegisteredHAInstance",
  "AWS::EC2::NatGateway",
  "AWS::EC2::EgressOnlyInternetGateway",
  "AWS::EC2::VPCEndpoint",
  "AWS::EC2::VPCEndpointService",
  "AWS::EC2::FlowLog",
  "AWS::EC2::VPCPeeringConnection",
  "AWS::Elasticsearch::Domain",
  "AWS::IAM::Group",
  "AWS::IAM::Policy",
  "AWS::IAM::Role",
  "AWS::IAM::User",
  "AWS::ElasticLoadBalancingV2::LoadBalancer",
  "AWS::ACM::Certificate",
  "AWS::RDS::DBInstance",
  "AWS::RDS::DBSubnetGroup",
  "AWS::RDS::DBSecurityGroup",
  "AWS::RDS::DBSnapshot",
  "AWS::RDS::DBCluster",
  "AWS::RDS::DBClusterSnapshot",
  "AWS::RDS::EventSubscription",
  "AWS::S3::Bucket",
  "AWS::S3::AccountPublicAccessBlock",
  "AWS::Redshift::Cluster",
  "AWS::Redshift::ClusterSnapshot",
  "AWS::Redshift::ClusterParameterGroup",
  "AWS::Redshift::ClusterSecurityGroup",
  "AWS::Redshift::ClusterSubnetGroup",
  "AWS::Redshift::EventSubscription",
  "AWS::SSM::ManagedInstanceInventory",
  "AWS::CloudWatch::Alarm",
  "AWS::CloudFormation::Stack",
  "AWS::ElasticLoadBalancing::LoadBalancer",
  "AWS::AutoScaling::AutoScalingGroup",
  "AWS::AutoScaling::LaunchConfiguration",
  "AWS::AutoScaling::ScalingPolicy",
  "AWS::AutoScaling::ScheduledAction",
  "AWS::DynamoDB::Table",
  "AWS::CodeBuild::Project",
  "AWS::WAF::RateBasedRule",
  "AWS::WAF::Rule",
  "AWS::WAF::RuleGroup",
  "AWS::WAF::WebACL",
  "AWS::WAFRegional::RateBasedRule",
  "AWS::WAFRegional::Rule",
  "AWS::WAFRegional::RuleGroup",
  "AWS::WAFRegional::WebACL",
  "AWS::CloudFront::Distribution",
  "AWS::CloudFront::StreamingDistribution",
  "AWS::Lambda::Function",
  "AWS::NetworkFirewall::Firewall",
  "AWS::NetworkFirewall::FirewallPolicy",
  "AWS::NetworkFirewall::RuleGroup",
  "AWS::ElasticBeanstalk::Application",
  "AWS::ElasticBeanstalk::ApplicationVersion",
  "AWS::ElasticBeanstalk::Environment",
  "AWS::WAFv2::WebACL",
  "AWS::WAFv2::RuleGroup",
  "AWS::WAFv2::IPSet",
  "AWS::WAFv2::RegexPatternSet",
  "AWS::WAFv2::ManagedRuleSet",
  "AWS::XRay::EncryptionConfig",
  "AWS::SSM::AssociationCompliance",
  "AWS::SSM::PatchCompliance",
  "AWS::Shield::Protection",
  "AWS::ShieldRegional::Protection",
  "AWS::Config::ConformancePackCompliance",
  "AWS::Config::ResourceCompliance",
  "AWS::ApiGateway::Stage",
  "AWS::ApiGateway::RestApi",
  "AWS::ApiGatewayV2::Stage",
  "AWS::ApiGatewayV2::Api",
  "AWS::CodePipeline::Pipeline",
  "AWS::ServiceCatalog::CloudFormationProvisionedProduct",
  "AWS::ServiceCatalog::CloudFormationProduct",
  "AWS::ServiceCatalog::Portfolio",
  "AWS::SQS::Queue",
  "AWS::KMS::Key",
  "AWS::QLDB::Ledger",
  "AWS::SecretsManager::Secret",
  "AWS::SNS::Topic",
  "AWS::SSM::FileData",
  "AWS::Backup::BackupPlan",
  "AWS::Backup::BackupSelection",
  "AWS::Backup::BackupVault",
  "AWS::Backup::RecoveryPoint",
  "AWS::ECR::Repository",
  "AWS::ECS::Cluster",
  "AWS::ECS::Service",
  "AWS::ECS::TaskDefinition",
  "AWS::EFS::AccessPoint",
  "AWS::EFS::FileSystem",
  "AWS::EKS::Cluster",
  "AWS::OpenSearch::Domain",
  "AWS::EC2::TransitGateway",
  "AWS::Kinesis::Stream",
  "AWS::Kinesis::StreamConsumer",
  "AWS::CodeDeploy::Application",
  "AWS::CodeDeploy::DeploymentConfig",
  "AWS::CodeDeploy::DeploymentGroup",
  "AWS::EC2::LaunchTemplate",
  "AWS::ECR::PublicRepository",
  "AWS::GuardDuty::Detector",
  "AWS::EMR::SecurityConfiguration",
  "AWS::SageMaker::CodeRepository",
  "AWS::Route53Resolver::ResolverEndpoint",
  "AWS::Route53Resolver::ResolverRule",
  "AWS::Route53Resolver::ResolverRuleAssociation",
  "AWS::DMS::ReplicationSubnetGroup",
  "AWS::DMS::EventSubscription",
  "AWS::MSK::Cluster",
  "AWS::StepFunctions::Activity",
  "AWS::WorkSpaces::Workspace",
  "AWS::WorkSpaces::ConnectionAlias",
  "AWS::SageMaker::Model",
  "AWS::ElasticLoadBalancingV2::Listener",
  "AWS::StepFunctions::StateMachine",
  "AWS::Batch::JobQueue",
  "AWS::Batch::ComputeEnvironment",
  "AWS::AccessAnalyzer::Analyzer",
  "AWS::Athena::WorkGroup",
  "AWS::Athena::DataCatalog",
  "AWS::Detective::Graph",
  "AWS::GlobalAccelerator::Accelerator",
  "AWS::GlobalAccelerator::EndpointGroup",
  "AWS::GlobalAccelerator::Listener",
  "AWS::EC2::TransitGatewayAttachment",
  "AWS::EC2::TransitGatewayRouteTable",
  "AWS::DMS::Certificate",
  "AWS::AppConfig::Application",
  "AWS::AppSync::GraphQLApi",
  "AWS::DataSync::LocationSMB",
  "AWS::DataSync::LocationFSxLustre",
  "AWS::DataSync::LocationS3",
  "AWS::DataSync::LocationEFS",
  "AWS::DataSync::Task",
  "AWS::DataSync::LocationNFS",
  "AWS::EC2::NetworkInsightsAccessScopeAnalysis",
  "AWS::EKS::FargateProfile",
  "AWS::Glue::Job",
  "AWS::GuardDuty::ThreatIntelSet",
  "AWS::GuardDuty::IPSet",
  "AWS::SageMaker::Workteam",
  "AWS::SageMaker::NotebookInstanceLifecycleConfig",
  "AWS::ServiceDiscovery::Service",
  "AWS::ServiceDiscovery::PublicDnsNamespace",
  "AWS::SES::ContactList",
  "AWS::SES::ConfigurationSet",
  "AWS::Route53::HostedZone",
  "AWS::IoTEvents::Input",
  "AWS::IoTEvents::DetectorModel",
  "AWS::IoTEvents::AlarmModel",
  "AWS::ServiceDiscovery::HttpNamespace",
  "AWS::Events::EventBus",
  "AWS::ImageBuilder::ContainerRecipe",
  "AWS::ImageBuilder::DistributionConfiguration",
  "AWS::ImageBuilder::InfrastructureConfiguration",
  "AWS::DataSync::LocationObjectStorage",
  "AWS::DataSync::LocationHDFS",
  "AWS::Glue::Classifier",
  "AWS::Route53RecoveryReadiness::Cell",
  "AWS::Route53RecoveryReadiness::ReadinessCheck",
  "AWS::ECR::RegistryPolicy",
  "AWS::Backup::ReportPlan",
  "AWS::Lightsail::Certificate",
  "AWS::RUM::AppMonitor",
  "AWS::Events::Endpoint",
  "AWS::SES::ReceiptRuleSet",
  "AWS::Events::Archive",
  "AWS::Events::ApiDestination",
  "AWS::Lightsail::Disk",
  "AWS::FIS::ExperimentTemplate",
  "AWS::DataSync::LocationFSxWindows",
  "AWS::SES::ReceiptFilter",
  "AWS::GuardDuty::Filter",
  "AWS::SES::Template",
  "AWS::AmazonMQ::Broker",
  "AWS::AppConfig::Environment",
  "AWS::AppConfig::ConfigurationProfile",
  "AWS::Cloud9::EnvironmentEC2",
  "AWS::EventSchemas::Registry",
  "AWS::EventSchemas::RegistryPolicy",
  "AWS::EventSchemas::Discoverer",
  "AWS::FraudDetector::Label",
  "AWS::FraudDetector::EntityType",
  "AWS::FraudDetector::Variable",
  "AWS::FraudDetector::Outcome",
  "AWS::IoT::Authorizer",
  "AWS::IoT::SecurityProfile",
  "AWS::IoT::RoleAlias",
  "AWS::IoT::Dimension",
  "AWS::IoTAnalytics::Datastore",
  "AWS::Lightsail::Bucket",
  "AWS::Lightsail::StaticIp",
  "AWS::MediaPackage::PackagingGroup",
  "AWS::Route53RecoveryReadiness::RecoveryGroup",
  "AWS::ResilienceHub::ResiliencyPolicy",
  "AWS::Transfer::Workflow",
  "AWS::EKS::IdentityProviderConfig",
  "AWS::EKS::Addon",
  "AWS::Glue::MLTransform",
  "AWS::IoT::Policy",
  "AWS::IoT::MitigationAction",
  "AWS::IoTTwinMaker::Workspace",
  "AWS::IoTTwinMaker::Entity",
  "AWS::IoTAnalytics::Dataset",
  "AWS::IoTAnalytics::Pipeline",
  "AWS::IoTAnalytics::Channel",
  "AWS::IoTSiteWise::Dashboard",
  "AWS::IoTSiteWise::Project",
  "AWS::IoTSiteWise::Portal",
  "AWS::IoTSiteWise::AssetModel",
  "AWS::IVS::Channel",
  "AWS::IVS::RecordingConfiguration",
  "AWS::IVS::PlaybackKeyPair",
  "AWS::KinesisAnalyticsV2::Application",
  "AWS::RDS::GlobalCluster",
  "AWS::S3::MultiRegionAccessPoint",
  "AWS::DeviceFarm::TestGridProject",
  "AWS::Budgets::BudgetsAction",
  "AWS::Lex::Bot",
  "AWS::CodeGuruReviewer::RepositoryAssociation",
  "AWS::IoT::CustomMetric",
  "AWS::Route53Resolver::FirewallDomainList",
  "AWS::RoboMaker::RobotApplicationVersion",
  "AWS::EC2::TrafficMirrorSession",
  "AWS::IoTSiteWise::Gateway",
  "AWS::Lex::BotAlias",
  "AWS::LookoutMetrics::Alert",
  "AWS::IoT::AccountAuditConfiguration",
  "AWS::EC2::TrafficMirrorTarget",
  "AWS::S3::StorageLens",
  "AWS::IoT::ScheduledAudit",
  "AWS::Events::Connection",
  "AWS::EventSchemas::Schema",
  "AWS::MediaPackage::PackagingConfiguration",
  "AWS::KinesisVideo::SignalingChannel",
  "AWS::AppStream::DirectoryConfig",
  "AWS::LookoutVision::Project",
  "AWS::Route53RecoveryControl::Cluster",
  "AWS::Route53RecoveryControl::SafetyRule",
  "AWS::Route53RecoveryControl::ControlPanel",
  "AWS::Route53RecoveryControl::RoutingControl",
  "AWS::Route53RecoveryReadiness::ResourceSet",
  "AWS::RoboMaker::SimulationApplication",
  "AWS::RoboMaker::RobotApplication",
  "AWS::HealthLake::FHIRDatastore",
  "AWS::Pinpoint::Segment",
  "AWS::Pinpoint::ApplicationSettings",
  "AWS::Events::Rule",
  "AWS::EC2::DHCPOptions",
  "AWS::EC2::NetworkInsightsPath",
  "AWS::EC2::TrafficMirrorFilter",
  "AWS::EC2::IPAM",
  "AWS::IoTTwinMaker::Scene",
  "AWS::NetworkManager::TransitGatewayRegistration",
  "AWS::CustomerProfiles::Domain",
  "AWS::AutoScaling::WarmPool",
  "AWS::Connect::PhoneNumber",
  "AWS::AppConfig::DeploymentStrategy",
  "AWS::AppFlow::Flow",
  "AWS::AuditManager::Assessment",
  "AWS::CloudWatch::MetricStream",
  "AWS::DeviceFarm::InstanceProfile",
  "AWS::DeviceFarm::Project",
  "AWS::EC2::EC2Fleet",
  "AWS::EC2::SubnetRouteTableAssociation",
  "AWS::ECR::PullThroughCacheRule",
  "AWS::GroundStation::Config",
  "AWS::ImageBuilder::ImagePipeline",
  "AWS::IoT::FleetMetric",
  "AWS::IoTWireless::ServiceProfile",
  "AWS::NetworkManager::Device",
  "AWS::NetworkManager::GlobalNetwork",
  "AWS::NetworkManager::Link",
  "AWS::NetworkManager::Site",
  "AWS::Panorama::Package",
  "AWS::Pinpoint::App",
  "AWS::Redshift::ScheduledAction",
  "AWS::Route53Resolver::FirewallRuleGroupAssociation",
  "AWS::SageMaker::AppImageConfig",
  "AWS::SageMaker::Image",
  "AWS::ECS::TaskSet",
  "AWS::Cassandra::Keyspace",
  "AWS::Signer::SigningProfile",
  "AWS::Amplify::App",
  "AWS::AppMesh::VirtualNode",
  "AWS::AppMesh::VirtualService",
  "AWS::AppRunner::VpcConnector",
  "AWS::AppStream::Application",
  "AWS::CodeArtifact::Repository",
  "AWS::EC2::PrefixList",
  "AWS::EC2::SpotFleet",
  "AWS::Evidently::Project",
  "AWS::Forecast::Dataset",
  "AWS::IAM::SAMLProvider",
  "AWS::IAM::ServerCertificate",
  "AWS::Pinpoint::Campaign",
  "AWS::Pinpoint::InAppTemplate",
  "AWS::SageMaker::Domain",
  "AWS::Transfer::Agreement",
  "AWS::Transfer::Connector",
  "AWS::KinesisFirehose::DeliveryStream",
  "AWS::Amplify::Branch",
  "AWS::AppIntegrations::EventIntegration",
  "AWS::AppMesh::Route",
  "AWS::Athena::PreparedStatement",
  "AWS::EC2::IPAMScope",
  "AWS::Evidently::Launch",
  "AWS::Forecast::DatasetGroup",
  "AWS::GreengrassV2::ComponentVersion",
  "AWS::GroundStation::MissionProfile",
  "AWS::MediaConnect::FlowEntitlement",
  "AWS::MediaConnect::FlowVpcInterface",
  "AWS::MediaTailor::PlaybackConfiguration",
  "AWS::MSK::Configuration",
  "AWS::Personalize::Dataset",
  "AWS::Personalize::Schema",
  "AWS::Personalize::Solution",
  "AWS::Pinpoint::EmailTemplate",
  "AWS::Pinpoint::EventStream",
  "AWS::ResilienceHub::App",
  "AWS::ACMPCA::CertificateAuthority",
  "AWS::AppConfig::HostedConfigurationVersion",
  "AWS::AppMesh::VirtualGateway",
  "AWS::AppMesh::VirtualRouter",
  "AWS::AppRunner::Service",
  "AWS::CustomerProfiles::ObjectType",
  "AWS::DMS::Endpoint",
  "AWS::EC2::CapacityReservation",
  "AWS::EC2::ClientVpnEndpoint",
  "AWS::Kendra::Index",
  "AWS::KinesisVideo::Stream",
  "AWS::Logs::Destination",
  "AWS::Pinpoint::EmailChannel",
  "AWS::S3::AccessPoint",
  "AWS::NetworkManager::CustomerGatewayAssociation",
  "AWS::NetworkManager::LinkAssociation",
  "AWS::IoTWireless::MulticastGroup",
  "AWS::Personalize::DatasetGroup",
  "AWS::IoTTwinMaker::ComponentType",
  "AWS::CodeBuild::ReportGroup",
  "AWS::SageMaker::FeatureGroup",
  "AWS::MSK::BatchScramSecret",
  "AWS::AppStream::Stack",
  "AWS::IoT::JobTemplate",
  "AWS::IoTWireless::FuotaTask",
  "AWS::IoT::ProvisioningTemplate",
  "AWS::InspectorV2::Filter",
  "AWS::Route53Resolver::ResolverQueryLoggingConfigAssociation",
  "AWS::ServiceDiscovery::Instance",
  "AWS::Transfer::Certificate",
  "AWS::MediaConnect::FlowSource",
  "AWS::APS::RuleGroupsNamespace",
  "AWS::CodeGuruProfiler::ProfilingGroup",
  "AWS::Route53Resolver::ResolverQueryLoggingConfig",
  "AWS::Batch::SchedulingPolicy",
  "AWS::ACMPCA::CertificateAuthorityActivation",
  "AWS::AppMesh::GatewayRoute",
  "AWS::AppMesh::Mesh",
  "AWS::Connect::Instance",
  "AWS::Connect::QuickConnect",
  "AWS::EC2::CarrierGateway",
  "AWS::EC2::IPAMPool",
  "AWS::EC2::TransitGatewayConnect",
  "AWS::EC2::TransitGatewayMulticastDomain",
  "AWS::ECS::CapacityProvider",
  "AWS::IAM::InstanceProfile",
  "AWS::IoT::CACertificate",
  "AWS::IoTTwinMaker::SyncJob",
  "AWS::KafkaConnect::Connector",
  "AWS::Lambda::CodeSigningConfig",
  "AWS::NetworkManager::ConnectPeer",
  "AWS::ResourceExplorer2::Index",
  "AWS::AppStream::Fleet",
  "AWS::Cognito::UserPool",
  "AWS::Cognito::UserPoolClient",
  "AWS::Cognito::UserPoolGroup",
  "AWS::EC2::NetworkInsightsAccessScope",
  "AWS::EC2::NetworkInsightsAnalysis",
  "AWS::Grafana::Workspace",
  "AWS::GroundStation::DataflowEndpointGroup",
  "AWS::ImageBuilder::ImageRecipe",
  "AWS::KMS::Alias",
  "AWS::M2::Environment",
  "AWS::QuickSight::DataSource",
  "AWS::QuickSight::Template",
  "AWS::QuickSight::Theme",
  "AWS::RDS::OptionGroup",
  "AWS::Redshift::EndpointAccess",
  "AWS::Route53Resolver::FirewallRuleGroup",
  "AWS::SSM::Document",
  "AWS::AppConfig::ExtensionAssociation",
  "AWS::AppIntegrations::Application",
  "AWS::AppSync::ApiCache",
  "AWS::Bedrock::Guardrail",
  "AWS::Bedrock::KnowledgeBase",
  "AWS::Cognito::IdentityPool",
  "AWS::Connect::Rule",
  "AWS::Connect::User",
  "AWS::EC2::ClientVpnTargetNetworkAssociation",
  "AWS::EC2::EIPAssociation",
  "AWS::EC2::IPAMResourceDiscovery",
  "AWS::EC2::IPAMResourceDiscoveryAssociation",
  "AWS::EC2::InstanceConnectEndpoint",
  "AWS::EC2::SnapshotBlockPublicAccess",
  "AWS::EC2::VPCBlockPublicAccessExclusion",
  "AWS::EC2::VPCBlockPublicAccessOptions",
  "AWS::EC2::VPCEndpointConnectionNotification",
  "AWS::EC2::VPNConnectionRoute",
  "AWS::Evidently::Segment",
  "AWS::IAM::OIDCProvider",
  "AWS::InspectorV2::Activation",
  "AWS::MSK::ClusterPolicy",
  "AWS::MSK::VpcConnection",
  "AWS::MediaConnect::Gateway",
  "AWS::MemoryDB::SubnetGroup",
  "AWS::OpenSearchServerless::Collection",
  "AWS::OpenSearchServerless::VpcEndpoint",
  "AWS::Redshift::EndpointAuthorization",
  "AWS::Route53Profiles::Profile",
  "AWS::S3::StorageLensGroup",
  "AWS::S3Express::BucketPolicy",
  "AWS::S3Express::DirectoryBucket",
  "AWS::SageMaker::InferenceExperiment",
  "AWS::SecurityHub::Standard",
  "AWS::Transfer::Profile",
  "AWS::CloudFormation::StackSet",
  "AWS::MediaPackageV2::Channel",
  "AWS::S3::AccessGrantsLocation",
  "AWS::S3::AccessGrant",
  "AWS::S3::AccessGrantsInstance",
  "AWS::EMRServerless::Application",
  "AWS::Config::AggregationAuthorization",
  "AWS::Bedrock::ApplicationInferenceProfile",
  "AWS::ApiGatewayV2::Integration",
  "AWS::SageMaker::MlflowTrackingServer",
  "AWS::SageMaker::ModelBiasJobDefinition",
  "AWS::SecretsManager::RotationSchedule",
  "AWS::Deadline::QueueFleetAssociation",
  "AWS::ECR::RepositoryCreationTemplate",
  "AWS::CloudFormation::LambdaHook",
  "AWS::EC2::SubnetNetworkAclAssociation",
  "AWS::ApiGateway::UsagePlan",
  "AWS::AppConfig::Extension",
  "AWS::Deadline::Fleet",
  "AWS::EMR::Studio",
  "AWS::S3Tables::TableBucket",
  "AWS::CloudFront::RealtimeLogConfig",
  "AWS::BackupGateway::Hypervisor",
  "AWS::BCMDataExports::Export",
  "AWS::CloudFormation::GuardHook",
  "AWS::CloudFront::PublicKey",
  "AWS::CloudTrail::EventDataStore",
  "AWS::EntityResolution::IdMappingWorkflow",
  "AWS::EntityResolution::SchemaMapping",
  "AWS::IoT::DomainConfiguration",
  "AWS::PCAConnectorAD::DirectoryRegistration",
  "AWS::RDS::Integration",
  "AWS::Config::ConformancePack",
  "AWS::RolesAnywhere::Profile",
  "AWS::CodeArtifact::Domain",
  "AWS::Backup::RestoreTestingPlan",
  "AWS::Config::StoredQuery",
  "AWS::SageMaker::DataQualityJobDefinition",
  "AWS::SageMaker::ModelExplainabilityJobDefinition",
  "AWS::SageMaker::ModelQualityJobDefinition",
  "AWS::SageMaker::StudioLifecycleConfig",
  "AWS::SES::DedicatedIpPool",
  "AWS::SES::MailManagerTrafficPolicy",
  "AWS::SSM::ResourceDataSync",
  "AWS::BedrockAgentCore::Runtime",
  "AWS::BedrockAgentCore::BrowserCustom",
  "AWS::ElasticLoadBalancingV2::TargetGroup",
  "AWS::EMRContainers::VirtualCluster",
  "AWS::EntityResolution::MatchingWorkflow",
  "AWS::IoTCoreDeviceAdvisor::SuiteDefinition",
  "AWS::EC2::SecurityGroupVpcAssociation",
  "AWS::EC2::VerifiedAccessInstance",
  "AWS::KafkaConnect::CustomPlugin",
  "AWS::NetworkManager::TransitGatewayPeering",
  "AWS::OpenSearchServerless::SecurityConfig",
  "AWS::Redshift::Integration",
  "AWS::RolesAnywhere::TrustAnchor",
  "AWS::Route53Profiles::ProfileAssociation",
  "AWS::SSMIncidents::ResponsePlan",
  "AWS::Transfer::Server",
  "AWS::Glue::Database",
  "AWS::Organizations::OrganizationalUnit",
  "AWS::EC2::IPAMPoolCidr",
  "AWS::EC2::VPCGatewayAttachment",
  "AWS::Bedrock::Prompt",
  "AWS::Comprehend::Flywheel",
  "AWS::DataSync::Agent",
  "AWS::MediaTailor::LiveSource",
  "AWS::MSK::ServerlessCluster",
  "AWS::IoTSiteWise::Asset",
  "AWS::B2BI::Capability",
  "AWS::CloudFront::KeyValueStore",
  "AWS::Deadline::Monitor",
  "AWS::GuardDuty::MalwareProtectionPlan",
  "AWS::Location::APIKey",
  "AWS::MediaPackageV2::OriginEndpoint",
  "AWS::PCAConnectorAD::Connector",
  "AWS::S3Tables::TableBucketPolicy",
  "AWS::SecretsManager::ResourcePolicy",
  "AWS::SSMContacts::Contact",
  "AWS::IoT::ThingGroup",
  "AWS::ImageBuilder::LifecyclePolicy",
  "AWS::GameLift::Build",
  "AWS::ECR::ReplicationConfiguration",
  "AWS::EC2::SubnetCidrBlock",
  "AWS::Connect::SecurityProfile",
  "AWS::CleanRoomsML::TrainingDataset",
  "AWS::AppStream::AppBlockBuilder",
  "AWS::Route53::DNSSEC",
  "AWS::SageMaker::UserProfile",
  "AWS::ApiGateway::Method",
);
export type ResourceTypeList = ResourceType[];
export const ResourceTypeList = S.Array(ResourceType);
export type ConfigRuleNames = string[];
export const ConfigRuleNames = S.Array(S.String);
export type ComplianceType =
  | "COMPLIANT"
  | "NON_COMPLIANT"
  | "NOT_APPLICABLE"
  | "INSUFFICIENT_DATA";
export const ComplianceType = S.Literal(
  "COMPLIANT",
  "NON_COMPLIANT",
  "NOT_APPLICABLE",
  "INSUFFICIENT_DATA",
);
export type ComplianceTypes = ComplianceType[];
export const ComplianceTypes = S.Array(ComplianceType);
export type ConfigurationAggregatorNameList = string[];
export const ConfigurationAggregatorNameList = S.Array(S.String);
export type AggregatedSourceStatusType = "FAILED" | "SUCCEEDED" | "OUTDATED";
export const AggregatedSourceStatusType = S.Literal(
  "FAILED",
  "SUCCEEDED",
  "OUTDATED",
);
export type AggregatedSourceStatusTypeList = AggregatedSourceStatusType[];
export const AggregatedSourceStatusTypeList = S.Array(
  AggregatedSourceStatusType,
);
export type ConfigurationRecorderNameList = string[];
export const ConfigurationRecorderNameList = S.Array(S.String);
export type ConformancePackNamesList = string[];
export const ConformancePackNamesList = S.Array(S.String);
export type DeliveryChannelNameList = string[];
export const DeliveryChannelNameList = S.Array(S.String);
export type OrganizationConfigRuleNames = string[];
export const OrganizationConfigRuleNames = S.Array(S.String);
export type OrganizationConformancePackNames = string[];
export const OrganizationConformancePackNames = S.Array(S.String);
export type RetentionConfigurationNameList = string[];
export const RetentionConfigurationNameList = S.Array(S.String);
export type ConfigRuleComplianceSummaryGroupKey = "ACCOUNT_ID" | "AWS_REGION";
export const ConfigRuleComplianceSummaryGroupKey = S.Literal(
  "ACCOUNT_ID",
  "AWS_REGION",
);
export type AggregateConformancePackComplianceSummaryGroupKey =
  | "ACCOUNT_ID"
  | "AWS_REGION";
export const AggregateConformancePackComplianceSummaryGroupKey = S.Literal(
  "ACCOUNT_ID",
  "AWS_REGION",
);
export type ResourceCountGroupKey =
  | "RESOURCE_TYPE"
  | "ACCOUNT_ID"
  | "AWS_REGION";
export const ResourceCountGroupKey = S.Literal(
  "RESOURCE_TYPE",
  "ACCOUNT_ID",
  "AWS_REGION",
);
export type ResourceTypes = string[];
export const ResourceTypes = S.Array(S.String);
export type ConformancePackNamesToSummarizeList = string[];
export const ConformancePackNamesToSummarizeList = S.Array(S.String);
export type ChronologicalOrder = "Reverse" | "Forward";
export const ChronologicalOrder = S.Literal("Reverse", "Forward");
export type SortOrder = "ASCENDING" | "DESCENDING";
export const SortOrder = S.Literal("ASCENDING", "DESCENDING");
export type SortBy = "SCORE";
export const SortBy = S.Literal("SCORE");
export type ResourceIdList = string[];
export const ResourceIdList = S.Array(S.String);
export type ExcludedAccounts = string[];
export const ExcludedAccounts = S.Array(S.String);
export type ReevaluateConfigRuleNames = string[];
export const ReevaluateConfigRuleNames = S.Array(S.String);
export type EvaluationMode = "DETECTIVE" | "PROACTIVE";
export const EvaluationMode = S.Literal("DETECTIVE", "PROACTIVE");
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateResourceTypesRequest {
  ConfigurationRecorderArn: string;
  ResourceTypes: ResourceType[];
}
export const AssociateResourceTypesRequest = S.suspend(() =>
  S.Struct({
    ConfigurationRecorderArn: S.String,
    ResourceTypes: ResourceTypeList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateResourceTypesRequest",
}) as any as S.Schema<AssociateResourceTypesRequest>;
export interface DeleteAggregationAuthorizationRequest {
  AuthorizedAccountId: string;
  AuthorizedAwsRegion: string;
}
export const DeleteAggregationAuthorizationRequest = S.suspend(() =>
  S.Struct({
    AuthorizedAccountId: S.String,
    AuthorizedAwsRegion: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAggregationAuthorizationRequest",
}) as any as S.Schema<DeleteAggregationAuthorizationRequest>;
export interface DeleteAggregationAuthorizationResponse {}
export const DeleteAggregationAuthorizationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAggregationAuthorizationResponse",
}) as any as S.Schema<DeleteAggregationAuthorizationResponse>;
export interface DeleteConfigRuleRequest {
  ConfigRuleName: string;
}
export const DeleteConfigRuleRequest = S.suspend(() =>
  S.Struct({ ConfigRuleName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigRuleRequest",
}) as any as S.Schema<DeleteConfigRuleRequest>;
export interface DeleteConfigRuleResponse {}
export const DeleteConfigRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConfigRuleResponse",
}) as any as S.Schema<DeleteConfigRuleResponse>;
export interface DeleteConfigurationAggregatorRequest {
  ConfigurationAggregatorName: string;
}
export const DeleteConfigurationAggregatorRequest = S.suspend(() =>
  S.Struct({ ConfigurationAggregatorName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationAggregatorRequest",
}) as any as S.Schema<DeleteConfigurationAggregatorRequest>;
export interface DeleteConfigurationAggregatorResponse {}
export const DeleteConfigurationAggregatorResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConfigurationAggregatorResponse",
}) as any as S.Schema<DeleteConfigurationAggregatorResponse>;
export interface DeleteConfigurationRecorderRequest {
  ConfigurationRecorderName: string;
}
export const DeleteConfigurationRecorderRequest = S.suspend(() =>
  S.Struct({ ConfigurationRecorderName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationRecorderRequest",
}) as any as S.Schema<DeleteConfigurationRecorderRequest>;
export interface DeleteConfigurationRecorderResponse {}
export const DeleteConfigurationRecorderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConfigurationRecorderResponse",
}) as any as S.Schema<DeleteConfigurationRecorderResponse>;
export interface DeleteConformancePackRequest {
  ConformancePackName: string;
}
export const DeleteConformancePackRequest = S.suspend(() =>
  S.Struct({ ConformancePackName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConformancePackRequest",
}) as any as S.Schema<DeleteConformancePackRequest>;
export interface DeleteConformancePackResponse {}
export const DeleteConformancePackResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConformancePackResponse",
}) as any as S.Schema<DeleteConformancePackResponse>;
export interface DeleteDeliveryChannelRequest {
  DeliveryChannelName: string;
}
export const DeleteDeliveryChannelRequest = S.suspend(() =>
  S.Struct({ DeliveryChannelName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDeliveryChannelRequest",
}) as any as S.Schema<DeleteDeliveryChannelRequest>;
export interface DeleteDeliveryChannelResponse {}
export const DeleteDeliveryChannelResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDeliveryChannelResponse",
}) as any as S.Schema<DeleteDeliveryChannelResponse>;
export interface DeleteEvaluationResultsRequest {
  ConfigRuleName: string;
}
export const DeleteEvaluationResultsRequest = S.suspend(() =>
  S.Struct({ ConfigRuleName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEvaluationResultsRequest",
}) as any as S.Schema<DeleteEvaluationResultsRequest>;
export interface DeleteEvaluationResultsResponse {}
export const DeleteEvaluationResultsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEvaluationResultsResponse",
}) as any as S.Schema<DeleteEvaluationResultsResponse>;
export interface DeleteOrganizationConfigRuleRequest {
  OrganizationConfigRuleName: string;
}
export const DeleteOrganizationConfigRuleRequest = S.suspend(() =>
  S.Struct({ OrganizationConfigRuleName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOrganizationConfigRuleRequest",
}) as any as S.Schema<DeleteOrganizationConfigRuleRequest>;
export interface DeleteOrganizationConfigRuleResponse {}
export const DeleteOrganizationConfigRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOrganizationConfigRuleResponse",
}) as any as S.Schema<DeleteOrganizationConfigRuleResponse>;
export interface DeleteOrganizationConformancePackRequest {
  OrganizationConformancePackName: string;
}
export const DeleteOrganizationConformancePackRequest = S.suspend(() =>
  S.Struct({ OrganizationConformancePackName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOrganizationConformancePackRequest",
}) as any as S.Schema<DeleteOrganizationConformancePackRequest>;
export interface DeleteOrganizationConformancePackResponse {}
export const DeleteOrganizationConformancePackResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOrganizationConformancePackResponse",
}) as any as S.Schema<DeleteOrganizationConformancePackResponse>;
export interface DeletePendingAggregationRequestRequest {
  RequesterAccountId: string;
  RequesterAwsRegion: string;
}
export const DeletePendingAggregationRequestRequest = S.suspend(() =>
  S.Struct({ RequesterAccountId: S.String, RequesterAwsRegion: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePendingAggregationRequestRequest",
}) as any as S.Schema<DeletePendingAggregationRequestRequest>;
export interface DeletePendingAggregationRequestResponse {}
export const DeletePendingAggregationRequestResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePendingAggregationRequestResponse",
}) as any as S.Schema<DeletePendingAggregationRequestResponse>;
export interface DeleteRemediationConfigurationRequest {
  ConfigRuleName: string;
  ResourceType?: string;
}
export const DeleteRemediationConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    ResourceType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRemediationConfigurationRequest",
}) as any as S.Schema<DeleteRemediationConfigurationRequest>;
export interface DeleteRemediationConfigurationResponse {}
export const DeleteRemediationConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRemediationConfigurationResponse",
}) as any as S.Schema<DeleteRemediationConfigurationResponse>;
export interface DeleteResourceConfigRequest {
  ResourceType: string;
  ResourceId: string;
}
export const DeleteResourceConfigRequest = S.suspend(() =>
  S.Struct({ ResourceType: S.String, ResourceId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourceConfigRequest",
}) as any as S.Schema<DeleteResourceConfigRequest>;
export interface DeleteResourceConfigResponse {}
export const DeleteResourceConfigResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourceConfigResponse",
}) as any as S.Schema<DeleteResourceConfigResponse>;
export interface DeleteRetentionConfigurationRequest {
  RetentionConfigurationName: string;
}
export const DeleteRetentionConfigurationRequest = S.suspend(() =>
  S.Struct({ RetentionConfigurationName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRetentionConfigurationRequest",
}) as any as S.Schema<DeleteRetentionConfigurationRequest>;
export interface DeleteRetentionConfigurationResponse {}
export const DeleteRetentionConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRetentionConfigurationResponse",
}) as any as S.Schema<DeleteRetentionConfigurationResponse>;
export interface DeleteServiceLinkedConfigurationRecorderRequest {
  ServicePrincipal: string;
}
export const DeleteServiceLinkedConfigurationRecorderRequest = S.suspend(() =>
  S.Struct({ ServicePrincipal: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteServiceLinkedConfigurationRecorderRequest",
}) as any as S.Schema<DeleteServiceLinkedConfigurationRecorderRequest>;
export interface DeleteStoredQueryRequest {
  QueryName: string;
}
export const DeleteStoredQueryRequest = S.suspend(() =>
  S.Struct({ QueryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStoredQueryRequest",
}) as any as S.Schema<DeleteStoredQueryRequest>;
export interface DeleteStoredQueryResponse {}
export const DeleteStoredQueryResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStoredQueryResponse",
}) as any as S.Schema<DeleteStoredQueryResponse>;
export interface DeliverConfigSnapshotRequest {
  deliveryChannelName: string;
}
export const DeliverConfigSnapshotRequest = S.suspend(() =>
  S.Struct({ deliveryChannelName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeliverConfigSnapshotRequest",
}) as any as S.Schema<DeliverConfigSnapshotRequest>;
export interface DescribeAggregationAuthorizationsRequest {
  Limit?: number;
  NextToken?: string;
}
export const DescribeAggregationAuthorizationsRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAggregationAuthorizationsRequest",
}) as any as S.Schema<DescribeAggregationAuthorizationsRequest>;
export interface DescribeComplianceByConfigRuleRequest {
  ConfigRuleNames?: string[];
  ComplianceTypes?: ComplianceType[];
  NextToken?: string;
}
export const DescribeComplianceByConfigRuleRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleNames: S.optional(ConfigRuleNames),
    ComplianceTypes: S.optional(ComplianceTypes),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeComplianceByConfigRuleRequest",
}) as any as S.Schema<DescribeComplianceByConfigRuleRequest>;
export interface DescribeComplianceByResourceRequest {
  ResourceType?: string;
  ResourceId?: string;
  ComplianceTypes?: ComplianceType[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeComplianceByResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ComplianceTypes: S.optional(ComplianceTypes),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeComplianceByResourceRequest",
}) as any as S.Schema<DescribeComplianceByResourceRequest>;
export interface DescribeConfigRuleEvaluationStatusRequest {
  ConfigRuleNames?: string[];
  NextToken?: string;
  Limit?: number;
}
export const DescribeConfigRuleEvaluationStatusRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleNames: S.optional(ConfigRuleNames),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigRuleEvaluationStatusRequest",
}) as any as S.Schema<DescribeConfigRuleEvaluationStatusRequest>;
export interface DescribeConfigurationAggregatorsRequest {
  ConfigurationAggregatorNames?: string[];
  NextToken?: string;
  Limit?: number;
}
export const DescribeConfigurationAggregatorsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorNames: S.optional(ConfigurationAggregatorNameList),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationAggregatorsRequest",
}) as any as S.Schema<DescribeConfigurationAggregatorsRequest>;
export interface DescribeConfigurationAggregatorSourcesStatusRequest {
  ConfigurationAggregatorName: string;
  UpdateStatus?: AggregatedSourceStatusType[];
  NextToken?: string;
  Limit?: number;
}
export const DescribeConfigurationAggregatorSourcesStatusRequest = S.suspend(
  () =>
    S.Struct({
      ConfigurationAggregatorName: S.String,
      UpdateStatus: S.optional(AggregatedSourceStatusTypeList),
      NextToken: S.optional(S.String),
      Limit: S.optional(S.Number),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeConfigurationAggregatorSourcesStatusRequest",
}) as any as S.Schema<DescribeConfigurationAggregatorSourcesStatusRequest>;
export interface DescribeConfigurationRecordersRequest {
  ConfigurationRecorderNames?: string[];
  ServicePrincipal?: string;
  Arn?: string;
}
export const DescribeConfigurationRecordersRequest = S.suspend(() =>
  S.Struct({
    ConfigurationRecorderNames: S.optional(ConfigurationRecorderNameList),
    ServicePrincipal: S.optional(S.String),
    Arn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationRecordersRequest",
}) as any as S.Schema<DescribeConfigurationRecordersRequest>;
export interface DescribeConfigurationRecorderStatusRequest {
  ConfigurationRecorderNames?: string[];
  ServicePrincipal?: string;
  Arn?: string;
}
export const DescribeConfigurationRecorderStatusRequest = S.suspend(() =>
  S.Struct({
    ConfigurationRecorderNames: S.optional(ConfigurationRecorderNameList),
    ServicePrincipal: S.optional(S.String),
    Arn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationRecorderStatusRequest",
}) as any as S.Schema<DescribeConfigurationRecorderStatusRequest>;
export interface DescribeConformancePacksRequest {
  ConformancePackNames?: string[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeConformancePacksRequest = S.suspend(() =>
  S.Struct({
    ConformancePackNames: S.optional(ConformancePackNamesList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConformancePacksRequest",
}) as any as S.Schema<DescribeConformancePacksRequest>;
export interface DescribeConformancePackStatusRequest {
  ConformancePackNames?: string[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeConformancePackStatusRequest = S.suspend(() =>
  S.Struct({
    ConformancePackNames: S.optional(ConformancePackNamesList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConformancePackStatusRequest",
}) as any as S.Schema<DescribeConformancePackStatusRequest>;
export interface DescribeDeliveryChannelsRequest {
  DeliveryChannelNames?: string[];
}
export const DescribeDeliveryChannelsRequest = S.suspend(() =>
  S.Struct({ DeliveryChannelNames: S.optional(DeliveryChannelNameList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDeliveryChannelsRequest",
}) as any as S.Schema<DescribeDeliveryChannelsRequest>;
export interface DescribeDeliveryChannelStatusRequest {
  DeliveryChannelNames?: string[];
}
export const DescribeDeliveryChannelStatusRequest = S.suspend(() =>
  S.Struct({ DeliveryChannelNames: S.optional(DeliveryChannelNameList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDeliveryChannelStatusRequest",
}) as any as S.Schema<DescribeDeliveryChannelStatusRequest>;
export interface DescribeOrganizationConfigRulesRequest {
  OrganizationConfigRuleNames?: string[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeOrganizationConfigRulesRequest = S.suspend(() =>
  S.Struct({
    OrganizationConfigRuleNames: S.optional(OrganizationConfigRuleNames),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOrganizationConfigRulesRequest",
}) as any as S.Schema<DescribeOrganizationConfigRulesRequest>;
export interface DescribeOrganizationConfigRuleStatusesRequest {
  OrganizationConfigRuleNames?: string[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeOrganizationConfigRuleStatusesRequest = S.suspend(() =>
  S.Struct({
    OrganizationConfigRuleNames: S.optional(OrganizationConfigRuleNames),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOrganizationConfigRuleStatusesRequest",
}) as any as S.Schema<DescribeOrganizationConfigRuleStatusesRequest>;
export interface DescribeOrganizationConformancePacksRequest {
  OrganizationConformancePackNames?: string[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeOrganizationConformancePacksRequest = S.suspend(() =>
  S.Struct({
    OrganizationConformancePackNames: S.optional(
      OrganizationConformancePackNames,
    ),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOrganizationConformancePacksRequest",
}) as any as S.Schema<DescribeOrganizationConformancePacksRequest>;
export interface DescribeOrganizationConformancePackStatusesRequest {
  OrganizationConformancePackNames?: string[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeOrganizationConformancePackStatusesRequest = S.suspend(
  () =>
    S.Struct({
      OrganizationConformancePackNames: S.optional(
        OrganizationConformancePackNames,
      ),
      Limit: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeOrganizationConformancePackStatusesRequest",
}) as any as S.Schema<DescribeOrganizationConformancePackStatusesRequest>;
export interface DescribePendingAggregationRequestsRequest {
  Limit?: number;
  NextToken?: string;
}
export const DescribePendingAggregationRequestsRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePendingAggregationRequestsRequest",
}) as any as S.Schema<DescribePendingAggregationRequestsRequest>;
export interface DescribeRemediationConfigurationsRequest {
  ConfigRuleNames: string[];
}
export const DescribeRemediationConfigurationsRequest = S.suspend(() =>
  S.Struct({ ConfigRuleNames: ConfigRuleNames }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRemediationConfigurationsRequest",
}) as any as S.Schema<DescribeRemediationConfigurationsRequest>;
export interface RemediationExceptionResourceKey {
  ResourceType?: string;
  ResourceId?: string;
}
export const RemediationExceptionResourceKey = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
  }),
).annotations({
  identifier: "RemediationExceptionResourceKey",
}) as any as S.Schema<RemediationExceptionResourceKey>;
export type RemediationExceptionResourceKeys =
  RemediationExceptionResourceKey[];
export const RemediationExceptionResourceKeys = S.Array(
  RemediationExceptionResourceKey,
);
export interface DescribeRemediationExceptionsRequest {
  ConfigRuleName: string;
  ResourceKeys?: RemediationExceptionResourceKey[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeRemediationExceptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    ResourceKeys: S.optional(RemediationExceptionResourceKeys),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRemediationExceptionsRequest",
}) as any as S.Schema<DescribeRemediationExceptionsRequest>;
export interface ResourceKey {
  resourceType: ResourceType;
  resourceId: string;
}
export const ResourceKey = S.suspend(() =>
  S.Struct({ resourceType: ResourceType, resourceId: S.String }),
).annotations({ identifier: "ResourceKey" }) as any as S.Schema<ResourceKey>;
export type ResourceKeys = ResourceKey[];
export const ResourceKeys = S.Array(ResourceKey);
export interface DescribeRemediationExecutionStatusRequest {
  ConfigRuleName: string;
  ResourceKeys?: ResourceKey[];
  Limit?: number;
  NextToken?: string;
}
export const DescribeRemediationExecutionStatusRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    ResourceKeys: S.optional(ResourceKeys),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRemediationExecutionStatusRequest",
}) as any as S.Schema<DescribeRemediationExecutionStatusRequest>;
export interface DescribeRetentionConfigurationsRequest {
  RetentionConfigurationNames?: string[];
  NextToken?: string;
}
export const DescribeRetentionConfigurationsRequest = S.suspend(() =>
  S.Struct({
    RetentionConfigurationNames: S.optional(RetentionConfigurationNameList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRetentionConfigurationsRequest",
}) as any as S.Schema<DescribeRetentionConfigurationsRequest>;
export interface DisassociateResourceTypesRequest {
  ConfigurationRecorderArn: string;
  ResourceTypes: ResourceType[];
}
export const DisassociateResourceTypesRequest = S.suspend(() =>
  S.Struct({
    ConfigurationRecorderArn: S.String,
    ResourceTypes: ResourceTypeList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateResourceTypesRequest",
}) as any as S.Schema<DisassociateResourceTypesRequest>;
export interface GetAggregateComplianceDetailsByConfigRuleRequest {
  ConfigurationAggregatorName: string;
  ConfigRuleName: string;
  AccountId: string;
  AwsRegion: string;
  ComplianceType?: ComplianceType;
  Limit?: number;
  NextToken?: string;
}
export const GetAggregateComplianceDetailsByConfigRuleRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.String,
    ConfigRuleName: S.String,
    AccountId: S.String,
    AwsRegion: S.String,
    ComplianceType: S.optional(ComplianceType),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAggregateComplianceDetailsByConfigRuleRequest",
}) as any as S.Schema<GetAggregateComplianceDetailsByConfigRuleRequest>;
export interface AggregateResourceIdentifier {
  SourceAccountId: string;
  SourceRegion: string;
  ResourceId: string;
  ResourceType: ResourceType;
  ResourceName?: string;
}
export const AggregateResourceIdentifier = S.suspend(() =>
  S.Struct({
    SourceAccountId: S.String,
    SourceRegion: S.String,
    ResourceId: S.String,
    ResourceType: ResourceType,
    ResourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregateResourceIdentifier",
}) as any as S.Schema<AggregateResourceIdentifier>;
export interface GetAggregateResourceConfigRequest {
  ConfigurationAggregatorName: string;
  ResourceIdentifier: AggregateResourceIdentifier;
}
export const GetAggregateResourceConfigRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.String,
    ResourceIdentifier: AggregateResourceIdentifier,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAggregateResourceConfigRequest",
}) as any as S.Schema<GetAggregateResourceConfigRequest>;
export interface GetComplianceDetailsByConfigRuleRequest {
  ConfigRuleName: string;
  ComplianceTypes?: ComplianceType[];
  Limit?: number;
  NextToken?: string;
}
export const GetComplianceDetailsByConfigRuleRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    ComplianceTypes: S.optional(ComplianceTypes),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetComplianceDetailsByConfigRuleRequest",
}) as any as S.Schema<GetComplianceDetailsByConfigRuleRequest>;
export interface GetComplianceDetailsByResourceRequest {
  ResourceType?: string;
  ResourceId?: string;
  ComplianceTypes?: ComplianceType[];
  NextToken?: string;
  ResourceEvaluationId?: string;
}
export const GetComplianceDetailsByResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ComplianceTypes: S.optional(ComplianceTypes),
    NextToken: S.optional(S.String),
    ResourceEvaluationId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetComplianceDetailsByResourceRequest",
}) as any as S.Schema<GetComplianceDetailsByResourceRequest>;
export interface GetComplianceSummaryByResourceTypeRequest {
  ResourceTypes?: string[];
}
export const GetComplianceSummaryByResourceTypeRequest = S.suspend(() =>
  S.Struct({ ResourceTypes: S.optional(ResourceTypes) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetComplianceSummaryByResourceTypeRequest",
}) as any as S.Schema<GetComplianceSummaryByResourceTypeRequest>;
export interface GetConformancePackComplianceSummaryRequest {
  ConformancePackNames: string[];
  Limit?: number;
  NextToken?: string;
}
export const GetConformancePackComplianceSummaryRequest = S.suspend(() =>
  S.Struct({
    ConformancePackNames: ConformancePackNamesToSummarizeList,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConformancePackComplianceSummaryRequest",
}) as any as S.Schema<GetConformancePackComplianceSummaryRequest>;
export interface GetCustomRulePolicyRequest {
  ConfigRuleName?: string;
}
export const GetCustomRulePolicyRequest = S.suspend(() =>
  S.Struct({ ConfigRuleName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCustomRulePolicyRequest",
}) as any as S.Schema<GetCustomRulePolicyRequest>;
export interface GetDiscoveredResourceCountsRequest {
  resourceTypes?: string[];
  limit?: number;
  nextToken?: string;
}
export const GetDiscoveredResourceCountsRequest = S.suspend(() =>
  S.Struct({
    resourceTypes: S.optional(ResourceTypes),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDiscoveredResourceCountsRequest",
}) as any as S.Schema<GetDiscoveredResourceCountsRequest>;
export interface GetOrganizationCustomRulePolicyRequest {
  OrganizationConfigRuleName: string;
}
export const GetOrganizationCustomRulePolicyRequest = S.suspend(() =>
  S.Struct({ OrganizationConfigRuleName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOrganizationCustomRulePolicyRequest",
}) as any as S.Schema<GetOrganizationCustomRulePolicyRequest>;
export interface GetResourceConfigHistoryRequest {
  resourceType: ResourceType;
  resourceId: string;
  laterTime?: Date;
  earlierTime?: Date;
  chronologicalOrder?: ChronologicalOrder;
  limit?: number;
  nextToken?: string;
}
export const GetResourceConfigHistoryRequest = S.suspend(() =>
  S.Struct({
    resourceType: ResourceType,
    resourceId: S.String,
    laterTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    earlierTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    chronologicalOrder: S.optional(ChronologicalOrder),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceConfigHistoryRequest",
}) as any as S.Schema<GetResourceConfigHistoryRequest>;
export interface GetResourceEvaluationSummaryRequest {
  ResourceEvaluationId: string;
}
export const GetResourceEvaluationSummaryRequest = S.suspend(() =>
  S.Struct({ ResourceEvaluationId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceEvaluationSummaryRequest",
}) as any as S.Schema<GetResourceEvaluationSummaryRequest>;
export interface GetStoredQueryRequest {
  QueryName: string;
}
export const GetStoredQueryRequest = S.suspend(() =>
  S.Struct({ QueryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStoredQueryRequest",
}) as any as S.Schema<GetStoredQueryRequest>;
export interface ListDiscoveredResourcesRequest {
  resourceType: ResourceType;
  resourceIds?: string[];
  resourceName?: string;
  limit?: number;
  includeDeletedResources?: boolean;
  nextToken?: string;
}
export const ListDiscoveredResourcesRequest = S.suspend(() =>
  S.Struct({
    resourceType: ResourceType,
    resourceIds: S.optional(ResourceIdList),
    resourceName: S.optional(S.String),
    limit: S.optional(S.Number),
    includeDeletedResources: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDiscoveredResourcesRequest",
}) as any as S.Schema<ListDiscoveredResourcesRequest>;
export interface ListStoredQueriesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListStoredQueriesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStoredQueriesRequest",
}) as any as S.Schema<ListStoredQueriesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
  Limit?: number;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ConformancePackInputParameter {
  ParameterName: string;
  ParameterValue: string;
}
export const ConformancePackInputParameter = S.suspend(() =>
  S.Struct({ ParameterName: S.String, ParameterValue: S.String }),
).annotations({
  identifier: "ConformancePackInputParameter",
}) as any as S.Schema<ConformancePackInputParameter>;
export type ConformancePackInputParameters = ConformancePackInputParameter[];
export const ConformancePackInputParameters = S.Array(
  ConformancePackInputParameter,
);
export interface PutOrganizationConformancePackRequest {
  OrganizationConformancePackName: string;
  TemplateS3Uri?: string;
  TemplateBody?: string;
  DeliveryS3Bucket?: string;
  DeliveryS3KeyPrefix?: string;
  ConformancePackInputParameters?: ConformancePackInputParameter[];
  ExcludedAccounts?: string[];
}
export const PutOrganizationConformancePackRequest = S.suspend(() =>
  S.Struct({
    OrganizationConformancePackName: S.String,
    TemplateS3Uri: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    DeliveryS3Bucket: S.optional(S.String),
    DeliveryS3KeyPrefix: S.optional(S.String),
    ConformancePackInputParameters: S.optional(ConformancePackInputParameters),
    ExcludedAccounts: S.optional(ExcludedAccounts),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutOrganizationConformancePackRequest",
}) as any as S.Schema<PutOrganizationConformancePackRequest>;
export interface PutRemediationExceptionsRequest {
  ConfigRuleName: string;
  ResourceKeys: RemediationExceptionResourceKey[];
  Message?: string;
  ExpirationTime?: Date;
}
export const PutRemediationExceptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    ResourceKeys: RemediationExceptionResourceKeys,
    Message: S.optional(S.String),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRemediationExceptionsRequest",
}) as any as S.Schema<PutRemediationExceptionsRequest>;
export interface PutRetentionConfigurationRequest {
  RetentionPeriodInDays: number;
}
export const PutRetentionConfigurationRequest = S.suspend(() =>
  S.Struct({ RetentionPeriodInDays: S.Number }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRetentionConfigurationRequest",
}) as any as S.Schema<PutRetentionConfigurationRequest>;
export type TagsList = Tag[];
export const TagsList = S.Array(Tag);
export interface PutServiceLinkedConfigurationRecorderRequest {
  ServicePrincipal: string;
  Tags?: Tag[];
}
export const PutServiceLinkedConfigurationRecorderRequest = S.suspend(() =>
  S.Struct({ ServicePrincipal: S.String, Tags: S.optional(TagsList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutServiceLinkedConfigurationRecorderRequest",
}) as any as S.Schema<PutServiceLinkedConfigurationRecorderRequest>;
export interface SelectAggregateResourceConfigRequest {
  Expression: string;
  ConfigurationAggregatorName: string;
  Limit?: number;
  MaxResults?: number;
  NextToken?: string;
}
export const SelectAggregateResourceConfigRequest = S.suspend(() =>
  S.Struct({
    Expression: S.String,
    ConfigurationAggregatorName: S.String,
    Limit: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SelectAggregateResourceConfigRequest",
}) as any as S.Schema<SelectAggregateResourceConfigRequest>;
export interface SelectResourceConfigRequest {
  Expression: string;
  Limit?: number;
  NextToken?: string;
}
export const SelectResourceConfigRequest = S.suspend(() =>
  S.Struct({
    Expression: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SelectResourceConfigRequest",
}) as any as S.Schema<SelectResourceConfigRequest>;
export interface StartConfigRulesEvaluationRequest {
  ConfigRuleNames?: string[];
}
export const StartConfigRulesEvaluationRequest = S.suspend(() =>
  S.Struct({ ConfigRuleNames: S.optional(ReevaluateConfigRuleNames) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartConfigRulesEvaluationRequest",
}) as any as S.Schema<StartConfigRulesEvaluationRequest>;
export interface StartConfigRulesEvaluationResponse {}
export const StartConfigRulesEvaluationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StartConfigRulesEvaluationResponse",
}) as any as S.Schema<StartConfigRulesEvaluationResponse>;
export interface StartConfigurationRecorderRequest {
  ConfigurationRecorderName: string;
}
export const StartConfigurationRecorderRequest = S.suspend(() =>
  S.Struct({ ConfigurationRecorderName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartConfigurationRecorderRequest",
}) as any as S.Schema<StartConfigurationRecorderRequest>;
export interface StartConfigurationRecorderResponse {}
export const StartConfigurationRecorderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StartConfigurationRecorderResponse",
}) as any as S.Schema<StartConfigurationRecorderResponse>;
export interface StartRemediationExecutionRequest {
  ConfigRuleName: string;
  ResourceKeys: ResourceKey[];
}
export const StartRemediationExecutionRequest = S.suspend(() =>
  S.Struct({ ConfigRuleName: S.String, ResourceKeys: ResourceKeys }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRemediationExecutionRequest",
}) as any as S.Schema<StartRemediationExecutionRequest>;
export interface StopConfigurationRecorderRequest {
  ConfigurationRecorderName: string;
}
export const StopConfigurationRecorderRequest = S.suspend(() =>
  S.Struct({ ConfigurationRecorderName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopConfigurationRecorderRequest",
}) as any as S.Schema<StopConfigurationRecorderRequest>;
export interface StopConfigurationRecorderResponse {}
export const StopConfigurationRecorderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopConfigurationRecorderResponse",
}) as any as S.Schema<StopConfigurationRecorderResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type ConformancePackComplianceType =
  | "COMPLIANT"
  | "NON_COMPLIANT"
  | "INSUFFICIENT_DATA";
export const ConformancePackComplianceType = S.Literal(
  "COMPLIANT",
  "NON_COMPLIANT",
  "INSUFFICIENT_DATA",
);
export type ConformancePackConfigRuleNames = string[];
export const ConformancePackConfigRuleNames = S.Array(S.String);
export type ConformancePackComplianceResourceIds = string[];
export const ConformancePackComplianceResourceIds = S.Array(S.String);
export type MemberAccountRuleStatus =
  | "CREATE_SUCCESSFUL"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "DELETE_SUCCESSFUL"
  | "DELETE_FAILED"
  | "DELETE_IN_PROGRESS"
  | "UPDATE_SUCCESSFUL"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_FAILED";
export const MemberAccountRuleStatus = S.Literal(
  "CREATE_SUCCESSFUL",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "DELETE_SUCCESSFUL",
  "DELETE_FAILED",
  "DELETE_IN_PROGRESS",
  "UPDATE_SUCCESSFUL",
  "UPDATE_IN_PROGRESS",
  "UPDATE_FAILED",
);
export type OrganizationResourceDetailedStatus =
  | "CREATE_SUCCESSFUL"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "DELETE_SUCCESSFUL"
  | "DELETE_FAILED"
  | "DELETE_IN_PROGRESS"
  | "UPDATE_SUCCESSFUL"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_FAILED";
export const OrganizationResourceDetailedStatus = S.Literal(
  "CREATE_SUCCESSFUL",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "DELETE_SUCCESSFUL",
  "DELETE_FAILED",
  "DELETE_IN_PROGRESS",
  "UPDATE_SUCCESSFUL",
  "UPDATE_IN_PROGRESS",
  "UPDATE_FAILED",
);
export type ConfigurationRecorderFilterName = "recordingScope";
export const ConfigurationRecorderFilterName = S.Literal("recordingScope");
export type ConfigurationRecorderFilterValues = string[];
export const ConfigurationRecorderFilterValues = S.Array(S.String);
export type ConformancePackNameFilter = string[];
export const ConformancePackNameFilter = S.Array(S.String);
export type MaximumExecutionFrequency =
  | "One_Hour"
  | "Three_Hours"
  | "Six_Hours"
  | "Twelve_Hours"
  | "TwentyFour_Hours";
export const MaximumExecutionFrequency = S.Literal(
  "One_Hour",
  "Three_Hours",
  "Six_Hours",
  "Twelve_Hours",
  "TwentyFour_Hours",
);
export type ConfigRuleState =
  | "ACTIVE"
  | "DELETING"
  | "DELETING_RESULTS"
  | "EVALUATING";
export const ConfigRuleState = S.Literal(
  "ACTIVE",
  "DELETING",
  "DELETING_RESULTS",
  "EVALUATING",
);
export type AccountAggregationSourceAccountList = string[];
export const AccountAggregationSourceAccountList = S.Array(S.String);
export type AggregatorRegionList = string[];
export const AggregatorRegionList = S.Array(S.String);
export type RecordingScope = "INTERNAL" | "PAID";
export const RecordingScope = S.Literal("INTERNAL", "PAID");
export type ResourceTypesScope = string[];
export const ResourceTypesScope = S.Array(S.String);
export type OrganizationConfigRuleTriggerType =
  | "ConfigurationItemChangeNotification"
  | "OversizedConfigurationItemChangeNotification"
  | "ScheduledNotification";
export const OrganizationConfigRuleTriggerType = S.Literal(
  "ConfigurationItemChangeNotification",
  "OversizedConfigurationItemChangeNotification",
  "ScheduledNotification",
);
export type OrganizationConfigRuleTriggerTypes =
  OrganizationConfigRuleTriggerType[];
export const OrganizationConfigRuleTriggerTypes = S.Array(
  OrganizationConfigRuleTriggerType,
);
export type OrganizationConfigRuleTriggerTypeNoSN =
  | "ConfigurationItemChangeNotification"
  | "OversizedConfigurationItemChangeNotification";
export const OrganizationConfigRuleTriggerTypeNoSN = S.Literal(
  "ConfigurationItemChangeNotification",
  "OversizedConfigurationItemChangeNotification",
);
export type OrganizationConfigRuleTriggerTypeNoSNs =
  OrganizationConfigRuleTriggerTypeNoSN[];
export const OrganizationConfigRuleTriggerTypeNoSNs = S.Array(
  OrganizationConfigRuleTriggerTypeNoSN,
);
export type DebugLogDeliveryAccounts = string[];
export const DebugLogDeliveryAccounts = S.Array(S.String);
export type RemediationTargetType = "SSM_DOCUMENT";
export const RemediationTargetType = S.Literal("SSM_DOCUMENT");
export type ResourceConfigurationSchemaType = "CFN_RESOURCE_SCHEMA";
export const ResourceConfigurationSchemaType = S.Literal("CFN_RESOURCE_SCHEMA");
export type ResourceIdentifiersList = AggregateResourceIdentifier[];
export const ResourceIdentifiersList = S.Array(AggregateResourceIdentifier);
export interface ConfigRuleComplianceFilters {
  ConfigRuleName?: string;
  ComplianceType?: ComplianceType;
  AccountId?: string;
  AwsRegion?: string;
}
export const ConfigRuleComplianceFilters = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.optional(S.String),
    ComplianceType: S.optional(ComplianceType),
    AccountId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigRuleComplianceFilters",
}) as any as S.Schema<ConfigRuleComplianceFilters>;
export interface AggregateConformancePackComplianceFilters {
  ConformancePackName?: string;
  ComplianceType?: ConformancePackComplianceType;
  AccountId?: string;
  AwsRegion?: string;
}
export const AggregateConformancePackComplianceFilters = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.optional(S.String),
    ComplianceType: S.optional(ConformancePackComplianceType),
    AccountId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregateConformancePackComplianceFilters",
}) as any as S.Schema<AggregateConformancePackComplianceFilters>;
export interface DescribeConfigRulesFilters {
  EvaluationMode?: EvaluationMode;
}
export const DescribeConfigRulesFilters = S.suspend(() =>
  S.Struct({ EvaluationMode: S.optional(EvaluationMode) }),
).annotations({
  identifier: "DescribeConfigRulesFilters",
}) as any as S.Schema<DescribeConfigRulesFilters>;
export interface ExclusionByResourceTypes {
  resourceTypes?: ResourceType[];
}
export const ExclusionByResourceTypes = S.suspend(() =>
  S.Struct({ resourceTypes: S.optional(ResourceTypeList) }),
).annotations({
  identifier: "ExclusionByResourceTypes",
}) as any as S.Schema<ExclusionByResourceTypes>;
export type RecordingStrategyType =
  | "ALL_SUPPORTED_RESOURCE_TYPES"
  | "INCLUSION_BY_RESOURCE_TYPES"
  | "EXCLUSION_BY_RESOURCE_TYPES";
export const RecordingStrategyType = S.Literal(
  "ALL_SUPPORTED_RESOURCE_TYPES",
  "INCLUSION_BY_RESOURCE_TYPES",
  "EXCLUSION_BY_RESOURCE_TYPES",
);
export interface RecordingStrategy {
  useOnly?: RecordingStrategyType;
}
export const RecordingStrategy = S.suspend(() =>
  S.Struct({ useOnly: S.optional(RecordingStrategyType) }),
).annotations({
  identifier: "RecordingStrategy",
}) as any as S.Schema<RecordingStrategy>;
export interface RecordingGroup {
  allSupported?: boolean;
  includeGlobalResourceTypes?: boolean;
  resourceTypes?: ResourceType[];
  exclusionByResourceTypes?: ExclusionByResourceTypes;
  recordingStrategy?: RecordingStrategy;
}
export const RecordingGroup = S.suspend(() =>
  S.Struct({
    allSupported: S.optional(S.Boolean),
    includeGlobalResourceTypes: S.optional(S.Boolean),
    resourceTypes: S.optional(ResourceTypeList),
    exclusionByResourceTypes: S.optional(ExclusionByResourceTypes),
    recordingStrategy: S.optional(RecordingStrategy),
  }),
).annotations({
  identifier: "RecordingGroup",
}) as any as S.Schema<RecordingGroup>;
export type RecordingFrequency = "CONTINUOUS" | "DAILY";
export const RecordingFrequency = S.Literal("CONTINUOUS", "DAILY");
export type RecordingModeResourceTypesList = ResourceType[];
export const RecordingModeResourceTypesList = S.Array(ResourceType);
export interface RecordingModeOverride {
  description?: string;
  resourceTypes: ResourceType[];
  recordingFrequency: RecordingFrequency;
}
export const RecordingModeOverride = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    resourceTypes: RecordingModeResourceTypesList,
    recordingFrequency: RecordingFrequency,
  }),
).annotations({
  identifier: "RecordingModeOverride",
}) as any as S.Schema<RecordingModeOverride>;
export type RecordingModeOverrides = RecordingModeOverride[];
export const RecordingModeOverrides = S.Array(RecordingModeOverride);
export interface RecordingMode {
  recordingFrequency: RecordingFrequency;
  recordingModeOverrides?: RecordingModeOverride[];
}
export const RecordingMode = S.suspend(() =>
  S.Struct({
    recordingFrequency: RecordingFrequency,
    recordingModeOverrides: S.optional(RecordingModeOverrides),
  }),
).annotations({
  identifier: "RecordingMode",
}) as any as S.Schema<RecordingMode>;
export interface ConfigurationRecorder {
  arn?: string;
  name?: string;
  roleARN?: string;
  recordingGroup?: RecordingGroup;
  recordingMode?: RecordingMode;
  recordingScope?: RecordingScope;
  servicePrincipal?: string;
}
export const ConfigurationRecorder = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    roleARN: S.optional(S.String),
    recordingGroup: S.optional(RecordingGroup),
    recordingMode: S.optional(RecordingMode),
    recordingScope: S.optional(RecordingScope),
    servicePrincipal: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationRecorder",
}) as any as S.Schema<ConfigurationRecorder>;
export type ConfigurationRecorderList = ConfigurationRecorder[];
export const ConfigurationRecorderList = S.Array(ConfigurationRecorder);
export interface ConformancePackComplianceFilters {
  ConfigRuleNames?: string[];
  ComplianceType?: ConformancePackComplianceType;
}
export const ConformancePackComplianceFilters = S.suspend(() =>
  S.Struct({
    ConfigRuleNames: S.optional(ConformancePackConfigRuleNames),
    ComplianceType: S.optional(ConformancePackComplianceType),
  }),
).annotations({
  identifier: "ConformancePackComplianceFilters",
}) as any as S.Schema<ConformancePackComplianceFilters>;
export interface ConfigSnapshotDeliveryProperties {
  deliveryFrequency?: MaximumExecutionFrequency;
}
export const ConfigSnapshotDeliveryProperties = S.suspend(() =>
  S.Struct({ deliveryFrequency: S.optional(MaximumExecutionFrequency) }),
).annotations({
  identifier: "ConfigSnapshotDeliveryProperties",
}) as any as S.Schema<ConfigSnapshotDeliveryProperties>;
export interface DeliveryChannel {
  name?: string;
  s3BucketName?: string;
  s3KeyPrefix?: string;
  s3KmsKeyArn?: string;
  snsTopicARN?: string;
  configSnapshotDeliveryProperties?: ConfigSnapshotDeliveryProperties;
}
export const DeliveryChannel = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    s3BucketName: S.optional(S.String),
    s3KeyPrefix: S.optional(S.String),
    s3KmsKeyArn: S.optional(S.String),
    snsTopicARN: S.optional(S.String),
    configSnapshotDeliveryProperties: S.optional(
      ConfigSnapshotDeliveryProperties,
    ),
  }),
).annotations({
  identifier: "DeliveryChannel",
}) as any as S.Schema<DeliveryChannel>;
export type DeliveryChannelList = DeliveryChannel[];
export const DeliveryChannelList = S.Array(DeliveryChannel);
export interface ConfigRuleComplianceSummaryFilters {
  AccountId?: string;
  AwsRegion?: string;
}
export const ConfigRuleComplianceSummaryFilters = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigRuleComplianceSummaryFilters",
}) as any as S.Schema<ConfigRuleComplianceSummaryFilters>;
export interface AggregateConformancePackComplianceSummaryFilters {
  AccountId?: string;
  AwsRegion?: string;
}
export const AggregateConformancePackComplianceSummaryFilters = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregateConformancePackComplianceSummaryFilters",
}) as any as S.Schema<AggregateConformancePackComplianceSummaryFilters>;
export interface ResourceCountFilters {
  ResourceType?: ResourceType;
  AccountId?: string;
  Region?: string;
}
export const ResourceCountFilters = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(ResourceType),
    AccountId: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceCountFilters",
}) as any as S.Schema<ResourceCountFilters>;
export interface ConformancePackEvaluationFilters {
  ConfigRuleNames?: string[];
  ComplianceType?: ConformancePackComplianceType;
  ResourceType?: string;
  ResourceIds?: string[];
}
export const ConformancePackEvaluationFilters = S.suspend(() =>
  S.Struct({
    ConfigRuleNames: S.optional(ConformancePackConfigRuleNames),
    ComplianceType: S.optional(ConformancePackComplianceType),
    ResourceType: S.optional(S.String),
    ResourceIds: S.optional(ConformancePackComplianceResourceIds),
  }),
).annotations({
  identifier: "ConformancePackEvaluationFilters",
}) as any as S.Schema<ConformancePackEvaluationFilters>;
export interface StatusDetailFilters {
  AccountId?: string;
  MemberAccountRuleStatus?: MemberAccountRuleStatus;
}
export const StatusDetailFilters = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    MemberAccountRuleStatus: S.optional(MemberAccountRuleStatus),
  }),
).annotations({
  identifier: "StatusDetailFilters",
}) as any as S.Schema<StatusDetailFilters>;
export interface OrganizationResourceDetailedStatusFilters {
  AccountId?: string;
  Status?: OrganizationResourceDetailedStatus;
}
export const OrganizationResourceDetailedStatusFilters = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    Status: S.optional(OrganizationResourceDetailedStatus),
  }),
).annotations({
  identifier: "OrganizationResourceDetailedStatusFilters",
}) as any as S.Schema<OrganizationResourceDetailedStatusFilters>;
export type ConfigurationItemStatus =
  | "OK"
  | "ResourceDiscovered"
  | "ResourceNotRecorded"
  | "ResourceDeleted"
  | "ResourceDeletedNotRecorded";
export const ConfigurationItemStatus = S.Literal(
  "OK",
  "ResourceDiscovered",
  "ResourceNotRecorded",
  "ResourceDeleted",
  "ResourceDeletedNotRecorded",
);
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export type RelatedEventList = string[];
export const RelatedEventList = S.Array(S.String);
export interface Relationship {
  resourceType?: ResourceType;
  resourceId?: string;
  resourceName?: string;
  relationshipName?: string;
}
export const Relationship = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(ResourceType),
    resourceId: S.optional(S.String),
    resourceName: S.optional(S.String),
    relationshipName: S.optional(S.String),
  }),
).annotations({ identifier: "Relationship" }) as any as S.Schema<Relationship>;
export type RelationshipList = Relationship[];
export const RelationshipList = S.Array(Relationship);
export type SupplementaryConfiguration = { [key: string]: string };
export const SupplementaryConfiguration = S.Record({
  key: S.String,
  value: S.String,
});
export interface ConfigurationItem {
  version?: string;
  accountId?: string;
  configurationItemCaptureTime?: Date;
  configurationItemStatus?: ConfigurationItemStatus;
  configurationStateId?: string;
  configurationItemMD5Hash?: string;
  arn?: string;
  resourceType?: ResourceType;
  resourceId?: string;
  resourceName?: string;
  awsRegion?: string;
  availabilityZone?: string;
  resourceCreationTime?: Date;
  tags?: { [key: string]: string };
  relatedEvents?: string[];
  relationships?: Relationship[];
  configuration?: string;
  supplementaryConfiguration?: { [key: string]: string };
  recordingFrequency?: RecordingFrequency;
  configurationItemDeliveryTime?: Date;
}
export const ConfigurationItem = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    accountId: S.optional(S.String),
    configurationItemCaptureTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    configurationItemStatus: S.optional(ConfigurationItemStatus),
    configurationStateId: S.optional(S.String),
    configurationItemMD5Hash: S.optional(S.String),
    arn: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    resourceId: S.optional(S.String),
    resourceName: S.optional(S.String),
    awsRegion: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    resourceCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tags: S.optional(Tags),
    relatedEvents: S.optional(RelatedEventList),
    relationships: S.optional(RelationshipList),
    configuration: S.optional(S.String),
    supplementaryConfiguration: S.optional(SupplementaryConfiguration),
    recordingFrequency: S.optional(RecordingFrequency),
    configurationItemDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ConfigurationItem",
}) as any as S.Schema<ConfigurationItem>;
export type ConfigurationItemList = ConfigurationItem[];
export const ConfigurationItemList = S.Array(ConfigurationItem);
export interface ResourceFilters {
  AccountId?: string;
  ResourceId?: string;
  ResourceName?: string;
  Region?: string;
}
export const ResourceFilters = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceName: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceFilters",
}) as any as S.Schema<ResourceFilters>;
export interface ConfigurationRecorderFilter {
  filterName?: ConfigurationRecorderFilterName;
  filterValue?: string[];
}
export const ConfigurationRecorderFilter = S.suspend(() =>
  S.Struct({
    filterName: S.optional(ConfigurationRecorderFilterName),
    filterValue: S.optional(ConfigurationRecorderFilterValues),
  }),
).annotations({
  identifier: "ConfigurationRecorderFilter",
}) as any as S.Schema<ConfigurationRecorderFilter>;
export type ConfigurationRecorderFilterList = ConfigurationRecorderFilter[];
export const ConfigurationRecorderFilterList = S.Array(
  ConfigurationRecorderFilter,
);
export interface ConformancePackComplianceScoresFilters {
  ConformancePackNames: string[];
}
export const ConformancePackComplianceScoresFilters = S.suspend(() =>
  S.Struct({ ConformancePackNames: ConformancePackNameFilter }),
).annotations({
  identifier: "ConformancePackComplianceScoresFilters",
}) as any as S.Schema<ConformancePackComplianceScoresFilters>;
export interface AccountAggregationSource {
  AccountIds: string[];
  AllAwsRegions?: boolean;
  AwsRegions?: string[];
}
export const AccountAggregationSource = S.suspend(() =>
  S.Struct({
    AccountIds: AccountAggregationSourceAccountList,
    AllAwsRegions: S.optional(S.Boolean),
    AwsRegions: S.optional(AggregatorRegionList),
  }),
).annotations({
  identifier: "AccountAggregationSource",
}) as any as S.Schema<AccountAggregationSource>;
export type AccountAggregationSourceList = AccountAggregationSource[];
export const AccountAggregationSourceList = S.Array(AccountAggregationSource);
export interface OrganizationAggregationSource {
  RoleArn: string;
  AwsRegions?: string[];
  AllAwsRegions?: boolean;
}
export const OrganizationAggregationSource = S.suspend(() =>
  S.Struct({
    RoleArn: S.String,
    AwsRegions: S.optional(AggregatorRegionList),
    AllAwsRegions: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "OrganizationAggregationSource",
}) as any as S.Schema<OrganizationAggregationSource>;
export interface TemplateSSMDocumentDetails {
  DocumentName: string;
  DocumentVersion?: string;
}
export const TemplateSSMDocumentDetails = S.suspend(() =>
  S.Struct({ DocumentName: S.String, DocumentVersion: S.optional(S.String) }),
).annotations({
  identifier: "TemplateSSMDocumentDetails",
}) as any as S.Schema<TemplateSSMDocumentDetails>;
export interface Evaluation {
  ComplianceResourceType: string;
  ComplianceResourceId: string;
  ComplianceType: ComplianceType;
  Annotation?: string;
  OrderingTimestamp: Date;
}
export const Evaluation = S.suspend(() =>
  S.Struct({
    ComplianceResourceType: S.String,
    ComplianceResourceId: S.String,
    ComplianceType: ComplianceType,
    Annotation: S.optional(S.String),
    OrderingTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Evaluation" }) as any as S.Schema<Evaluation>;
export type Evaluations = Evaluation[];
export const Evaluations = S.Array(Evaluation);
export interface ExternalEvaluation {
  ComplianceResourceType: string;
  ComplianceResourceId: string;
  ComplianceType: ComplianceType;
  Annotation?: string;
  OrderingTimestamp: Date;
}
export const ExternalEvaluation = S.suspend(() =>
  S.Struct({
    ComplianceResourceType: S.String,
    ComplianceResourceId: S.String,
    ComplianceType: ComplianceType,
    Annotation: S.optional(S.String),
    OrderingTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ExternalEvaluation",
}) as any as S.Schema<ExternalEvaluation>;
export interface OrganizationManagedRuleMetadata {
  Description?: string;
  RuleIdentifier: string;
  InputParameters?: string;
  MaximumExecutionFrequency?: MaximumExecutionFrequency;
  ResourceTypesScope?: string[];
  ResourceIdScope?: string;
  TagKeyScope?: string;
  TagValueScope?: string;
}
export const OrganizationManagedRuleMetadata = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    RuleIdentifier: S.String,
    InputParameters: S.optional(S.String),
    MaximumExecutionFrequency: S.optional(MaximumExecutionFrequency),
    ResourceTypesScope: S.optional(ResourceTypesScope),
    ResourceIdScope: S.optional(S.String),
    TagKeyScope: S.optional(S.String),
    TagValueScope: S.optional(S.String),
  }),
).annotations({
  identifier: "OrganizationManagedRuleMetadata",
}) as any as S.Schema<OrganizationManagedRuleMetadata>;
export interface OrganizationCustomRuleMetadata {
  Description?: string;
  LambdaFunctionArn: string;
  OrganizationConfigRuleTriggerTypes: OrganizationConfigRuleTriggerType[];
  InputParameters?: string;
  MaximumExecutionFrequency?: MaximumExecutionFrequency;
  ResourceTypesScope?: string[];
  ResourceIdScope?: string;
  TagKeyScope?: string;
  TagValueScope?: string;
}
export const OrganizationCustomRuleMetadata = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    LambdaFunctionArn: S.String,
    OrganizationConfigRuleTriggerTypes: OrganizationConfigRuleTriggerTypes,
    InputParameters: S.optional(S.String),
    MaximumExecutionFrequency: S.optional(MaximumExecutionFrequency),
    ResourceTypesScope: S.optional(ResourceTypesScope),
    ResourceIdScope: S.optional(S.String),
    TagKeyScope: S.optional(S.String),
    TagValueScope: S.optional(S.String),
  }),
).annotations({
  identifier: "OrganizationCustomRuleMetadata",
}) as any as S.Schema<OrganizationCustomRuleMetadata>;
export interface OrganizationCustomPolicyRuleMetadata {
  Description?: string;
  OrganizationConfigRuleTriggerTypes?: OrganizationConfigRuleTriggerTypeNoSN[];
  InputParameters?: string;
  MaximumExecutionFrequency?: MaximumExecutionFrequency;
  ResourceTypesScope?: string[];
  ResourceIdScope?: string;
  TagKeyScope?: string;
  TagValueScope?: string;
  PolicyRuntime: string;
  PolicyText: string;
  DebugLogDeliveryAccounts?: string[];
}
export const OrganizationCustomPolicyRuleMetadata = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    OrganizationConfigRuleTriggerTypes: S.optional(
      OrganizationConfigRuleTriggerTypeNoSNs,
    ),
    InputParameters: S.optional(S.String),
    MaximumExecutionFrequency: S.optional(MaximumExecutionFrequency),
    ResourceTypesScope: S.optional(ResourceTypesScope),
    ResourceIdScope: S.optional(S.String),
    TagKeyScope: S.optional(S.String),
    TagValueScope: S.optional(S.String),
    PolicyRuntime: S.String,
    PolicyText: S.String,
    DebugLogDeliveryAccounts: S.optional(DebugLogDeliveryAccounts),
  }),
).annotations({
  identifier: "OrganizationCustomPolicyRuleMetadata",
}) as any as S.Schema<OrganizationCustomPolicyRuleMetadata>;
export interface StoredQuery {
  QueryId?: string;
  QueryArn?: string;
  QueryName: string;
  Description?: string;
  Expression?: string;
}
export const StoredQuery = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    QueryArn: S.optional(S.String),
    QueryName: S.String,
    Description: S.optional(S.String),
    Expression: S.optional(S.String),
  }),
).annotations({ identifier: "StoredQuery" }) as any as S.Schema<StoredQuery>;
export type Results = string[];
export const Results = S.Array(S.String);
export interface ResourceDetails {
  ResourceId: string;
  ResourceType: string;
  ResourceConfiguration: string;
  ResourceConfigurationSchemaType?: ResourceConfigurationSchemaType;
}
export const ResourceDetails = S.suspend(() =>
  S.Struct({
    ResourceId: S.String,
    ResourceType: S.String,
    ResourceConfiguration: S.String,
    ResourceConfigurationSchemaType: S.optional(
      ResourceConfigurationSchemaType,
    ),
  }),
).annotations({
  identifier: "ResourceDetails",
}) as any as S.Schema<ResourceDetails>;
export interface EvaluationContext {
  EvaluationContextIdentifier?: string;
}
export const EvaluationContext = S.suspend(() =>
  S.Struct({ EvaluationContextIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "EvaluationContext",
}) as any as S.Schema<EvaluationContext>;
export type ComplianceResourceTypes = string[];
export const ComplianceResourceTypes = S.Array(S.String);
export type Owner = "CUSTOM_LAMBDA" | "AWS" | "CUSTOM_POLICY";
export const Owner = S.Literal("CUSTOM_LAMBDA", "AWS", "CUSTOM_POLICY");
export type AggregatorFilterType = "INCLUDE";
export const AggregatorFilterType = S.Literal("INCLUDE");
export type ResourceTypeValueList = string[];
export const ResourceTypeValueList = S.Array(S.String);
export type ServicePrincipalValueList = string[];
export const ServicePrincipalValueList = S.Array(S.String);
export interface AssociateResourceTypesResponse {
  ConfigurationRecorder: ConfigurationRecorder;
}
export const AssociateResourceTypesResponse = S.suspend(() =>
  S.Struct({ ConfigurationRecorder: ConfigurationRecorder }).pipe(ns),
).annotations({
  identifier: "AssociateResourceTypesResponse",
}) as any as S.Schema<AssociateResourceTypesResponse>;
export interface BatchGetAggregateResourceConfigRequest {
  ConfigurationAggregatorName: string;
  ResourceIdentifiers: AggregateResourceIdentifier[];
}
export const BatchGetAggregateResourceConfigRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.String,
    ResourceIdentifiers: ResourceIdentifiersList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetAggregateResourceConfigRequest",
}) as any as S.Schema<BatchGetAggregateResourceConfigRequest>;
export interface BatchGetResourceConfigRequest {
  resourceKeys: ResourceKey[];
}
export const BatchGetResourceConfigRequest = S.suspend(() =>
  S.Struct({ resourceKeys: ResourceKeys }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetResourceConfigRequest",
}) as any as S.Schema<BatchGetResourceConfigRequest>;
export interface DeleteRemediationExceptionsRequest {
  ConfigRuleName: string;
  ResourceKeys: RemediationExceptionResourceKey[];
}
export const DeleteRemediationExceptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    ResourceKeys: RemediationExceptionResourceKeys,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRemediationExceptionsRequest",
}) as any as S.Schema<DeleteRemediationExceptionsRequest>;
export interface DeleteServiceLinkedConfigurationRecorderResponse {
  Arn: string;
  Name: string;
}
export const DeleteServiceLinkedConfigurationRecorderResponse = S.suspend(() =>
  S.Struct({ Arn: S.String, Name: S.String }).pipe(ns),
).annotations({
  identifier: "DeleteServiceLinkedConfigurationRecorderResponse",
}) as any as S.Schema<DeleteServiceLinkedConfigurationRecorderResponse>;
export interface DeliverConfigSnapshotResponse {
  configSnapshotId?: string;
}
export const DeliverConfigSnapshotResponse = S.suspend(() =>
  S.Struct({ configSnapshotId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeliverConfigSnapshotResponse",
}) as any as S.Schema<DeliverConfigSnapshotResponse>;
export interface DescribeAggregateComplianceByConfigRulesRequest {
  ConfigurationAggregatorName: string;
  Filters?: ConfigRuleComplianceFilters;
  Limit?: number;
  NextToken?: string;
}
export const DescribeAggregateComplianceByConfigRulesRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.String,
    Filters: S.optional(ConfigRuleComplianceFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAggregateComplianceByConfigRulesRequest",
}) as any as S.Schema<DescribeAggregateComplianceByConfigRulesRequest>;
export interface DescribeAggregateComplianceByConformancePacksRequest {
  ConfigurationAggregatorName: string;
  Filters?: AggregateConformancePackComplianceFilters;
  Limit?: number;
  NextToken?: string;
}
export const DescribeAggregateComplianceByConformancePacksRequest = S.suspend(
  () =>
    S.Struct({
      ConfigurationAggregatorName: S.String,
      Filters: S.optional(AggregateConformancePackComplianceFilters),
      Limit: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeAggregateComplianceByConformancePacksRequest",
}) as any as S.Schema<DescribeAggregateComplianceByConformancePacksRequest>;
export interface DescribeConfigRulesRequest {
  ConfigRuleNames?: string[];
  NextToken?: string;
  Filters?: DescribeConfigRulesFilters;
}
export const DescribeConfigRulesRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleNames: S.optional(ConfigRuleNames),
    NextToken: S.optional(S.String),
    Filters: S.optional(DescribeConfigRulesFilters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigRulesRequest",
}) as any as S.Schema<DescribeConfigRulesRequest>;
export interface DescribeConfigurationRecordersResponse {
  ConfigurationRecorders?: ConfigurationRecorder[];
}
export const DescribeConfigurationRecordersResponse = S.suspend(() =>
  S.Struct({
    ConfigurationRecorders: S.optional(ConfigurationRecorderList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConfigurationRecordersResponse",
}) as any as S.Schema<DescribeConfigurationRecordersResponse>;
export interface DescribeConformancePackComplianceRequest {
  ConformancePackName: string;
  Filters?: ConformancePackComplianceFilters;
  Limit?: number;
  NextToken?: string;
}
export const DescribeConformancePackComplianceRequest = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.String,
    Filters: S.optional(ConformancePackComplianceFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConformancePackComplianceRequest",
}) as any as S.Schema<DescribeConformancePackComplianceRequest>;
export interface DescribeDeliveryChannelsResponse {
  DeliveryChannels?: DeliveryChannel[];
}
export const DescribeDeliveryChannelsResponse = S.suspend(() =>
  S.Struct({ DeliveryChannels: S.optional(DeliveryChannelList) }).pipe(ns),
).annotations({
  identifier: "DescribeDeliveryChannelsResponse",
}) as any as S.Schema<DescribeDeliveryChannelsResponse>;
export type ResourceValueType = "RESOURCE_ID";
export const ResourceValueType = S.Literal("RESOURCE_ID");
export interface ResourceValue {
  Value: ResourceValueType;
}
export const ResourceValue = S.suspend(() =>
  S.Struct({ Value: ResourceValueType }),
).annotations({
  identifier: "ResourceValue",
}) as any as S.Schema<ResourceValue>;
export type StaticParameterValues = string[];
export const StaticParameterValues = S.Array(S.String);
export interface StaticValue {
  Values: string[];
}
export const StaticValue = S.suspend(() =>
  S.Struct({ Values: StaticParameterValues }),
).annotations({ identifier: "StaticValue" }) as any as S.Schema<StaticValue>;
export interface RemediationParameterValue {
  ResourceValue?: ResourceValue;
  StaticValue?: StaticValue;
}
export const RemediationParameterValue = S.suspend(() =>
  S.Struct({
    ResourceValue: S.optional(ResourceValue),
    StaticValue: S.optional(StaticValue),
  }),
).annotations({
  identifier: "RemediationParameterValue",
}) as any as S.Schema<RemediationParameterValue>;
export type RemediationParameters = {
  [key: string]: RemediationParameterValue;
};
export const RemediationParameters = S.Record({
  key: S.String,
  value: RemediationParameterValue,
});
export interface SsmControls {
  ConcurrentExecutionRatePercentage?: number;
  ErrorPercentage?: number;
}
export const SsmControls = S.suspend(() =>
  S.Struct({
    ConcurrentExecutionRatePercentage: S.optional(S.Number),
    ErrorPercentage: S.optional(S.Number),
  }),
).annotations({ identifier: "SsmControls" }) as any as S.Schema<SsmControls>;
export interface ExecutionControls {
  SsmControls?: SsmControls;
}
export const ExecutionControls = S.suspend(() =>
  S.Struct({ SsmControls: S.optional(SsmControls) }),
).annotations({
  identifier: "ExecutionControls",
}) as any as S.Schema<ExecutionControls>;
export interface RemediationConfiguration {
  ConfigRuleName: string;
  TargetType: RemediationTargetType;
  TargetId: string;
  TargetVersion?: string;
  Parameters?: { [key: string]: RemediationParameterValue };
  ResourceType?: string;
  Automatic?: boolean;
  ExecutionControls?: ExecutionControls;
  MaximumAutomaticAttempts?: number;
  RetryAttemptSeconds?: number;
  Arn?: string;
  CreatedByService?: string;
}
export const RemediationConfiguration = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    TargetType: RemediationTargetType,
    TargetId: S.String,
    TargetVersion: S.optional(S.String),
    Parameters: S.optional(RemediationParameters),
    ResourceType: S.optional(S.String),
    Automatic: S.optional(S.Boolean),
    ExecutionControls: S.optional(ExecutionControls),
    MaximumAutomaticAttempts: S.optional(S.Number),
    RetryAttemptSeconds: S.optional(S.Number),
    Arn: S.optional(S.String),
    CreatedByService: S.optional(S.String),
  }),
).annotations({
  identifier: "RemediationConfiguration",
}) as any as S.Schema<RemediationConfiguration>;
export type RemediationConfigurations = RemediationConfiguration[];
export const RemediationConfigurations = S.Array(RemediationConfiguration);
export interface DescribeRemediationConfigurationsResponse {
  RemediationConfigurations?: RemediationConfiguration[];
}
export const DescribeRemediationConfigurationsResponse = S.suspend(() =>
  S.Struct({
    RemediationConfigurations: S.optional(RemediationConfigurations),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRemediationConfigurationsResponse",
}) as any as S.Schema<DescribeRemediationConfigurationsResponse>;
export interface DisassociateResourceTypesResponse {
  ConfigurationRecorder: ConfigurationRecorder;
}
export const DisassociateResourceTypesResponse = S.suspend(() =>
  S.Struct({ ConfigurationRecorder: ConfigurationRecorder }).pipe(ns),
).annotations({
  identifier: "DisassociateResourceTypesResponse",
}) as any as S.Schema<DisassociateResourceTypesResponse>;
export interface GetAggregateConfigRuleComplianceSummaryRequest {
  ConfigurationAggregatorName: string;
  Filters?: ConfigRuleComplianceSummaryFilters;
  GroupByKey?: ConfigRuleComplianceSummaryGroupKey;
  Limit?: number;
  NextToken?: string;
}
export const GetAggregateConfigRuleComplianceSummaryRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.String,
    Filters: S.optional(ConfigRuleComplianceSummaryFilters),
    GroupByKey: S.optional(ConfigRuleComplianceSummaryGroupKey),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAggregateConfigRuleComplianceSummaryRequest",
}) as any as S.Schema<GetAggregateConfigRuleComplianceSummaryRequest>;
export interface GetAggregateConformancePackComplianceSummaryRequest {
  ConfigurationAggregatorName: string;
  Filters?: AggregateConformancePackComplianceSummaryFilters;
  GroupByKey?: AggregateConformancePackComplianceSummaryGroupKey;
  Limit?: number;
  NextToken?: string;
}
export const GetAggregateConformancePackComplianceSummaryRequest = S.suspend(
  () =>
    S.Struct({
      ConfigurationAggregatorName: S.String,
      Filters: S.optional(AggregateConformancePackComplianceSummaryFilters),
      GroupByKey: S.optional(AggregateConformancePackComplianceSummaryGroupKey),
      Limit: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "GetAggregateConformancePackComplianceSummaryRequest",
}) as any as S.Schema<GetAggregateConformancePackComplianceSummaryRequest>;
export interface GetAggregateDiscoveredResourceCountsRequest {
  ConfigurationAggregatorName: string;
  Filters?: ResourceCountFilters;
  GroupByKey?: ResourceCountGroupKey;
  Limit?: number;
  NextToken?: string;
}
export const GetAggregateDiscoveredResourceCountsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.String,
    Filters: S.optional(ResourceCountFilters),
    GroupByKey: S.optional(ResourceCountGroupKey),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAggregateDiscoveredResourceCountsRequest",
}) as any as S.Schema<GetAggregateDiscoveredResourceCountsRequest>;
export interface EvaluationResultQualifier {
  ConfigRuleName?: string;
  ResourceType?: string;
  ResourceId?: string;
  EvaluationMode?: EvaluationMode;
}
export const EvaluationResultQualifier = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    EvaluationMode: S.optional(EvaluationMode),
  }),
).annotations({
  identifier: "EvaluationResultQualifier",
}) as any as S.Schema<EvaluationResultQualifier>;
export interface EvaluationResultIdentifier {
  EvaluationResultQualifier?: EvaluationResultQualifier;
  OrderingTimestamp?: Date;
  ResourceEvaluationId?: string;
}
export const EvaluationResultIdentifier = S.suspend(() =>
  S.Struct({
    EvaluationResultQualifier: S.optional(EvaluationResultQualifier),
    OrderingTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResourceEvaluationId: S.optional(S.String),
  }),
).annotations({
  identifier: "EvaluationResultIdentifier",
}) as any as S.Schema<EvaluationResultIdentifier>;
export interface EvaluationResult {
  EvaluationResultIdentifier?: EvaluationResultIdentifier;
  ComplianceType?: ComplianceType;
  ResultRecordedTime?: Date;
  ConfigRuleInvokedTime?: Date;
  Annotation?: string;
  ResultToken?: string;
}
export const EvaluationResult = S.suspend(() =>
  S.Struct({
    EvaluationResultIdentifier: S.optional(EvaluationResultIdentifier),
    ComplianceType: S.optional(ComplianceType),
    ResultRecordedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ConfigRuleInvokedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Annotation: S.optional(S.String),
    ResultToken: S.optional(S.String),
  }),
).annotations({
  identifier: "EvaluationResult",
}) as any as S.Schema<EvaluationResult>;
export type EvaluationResults = EvaluationResult[];
export const EvaluationResults = S.Array(EvaluationResult);
export interface GetComplianceDetailsByResourceResponse {
  EvaluationResults?: EvaluationResult[];
  NextToken?: string;
}
export const GetComplianceDetailsByResourceResponse = S.suspend(() =>
  S.Struct({
    EvaluationResults: S.optional(EvaluationResults),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetComplianceDetailsByResourceResponse",
}) as any as S.Schema<GetComplianceDetailsByResourceResponse>;
export interface GetConformancePackComplianceDetailsRequest {
  ConformancePackName: string;
  Filters?: ConformancePackEvaluationFilters;
  Limit?: number;
  NextToken?: string;
}
export const GetConformancePackComplianceDetailsRequest = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.String,
    Filters: S.optional(ConformancePackEvaluationFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConformancePackComplianceDetailsRequest",
}) as any as S.Schema<GetConformancePackComplianceDetailsRequest>;
export interface GetCustomRulePolicyResponse {
  PolicyText?: string;
}
export const GetCustomRulePolicyResponse = S.suspend(() =>
  S.Struct({ PolicyText: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetCustomRulePolicyResponse",
}) as any as S.Schema<GetCustomRulePolicyResponse>;
export interface GetOrganizationConfigRuleDetailedStatusRequest {
  OrganizationConfigRuleName: string;
  Filters?: StatusDetailFilters;
  Limit?: number;
  NextToken?: string;
}
export const GetOrganizationConfigRuleDetailedStatusRequest = S.suspend(() =>
  S.Struct({
    OrganizationConfigRuleName: S.String,
    Filters: S.optional(StatusDetailFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOrganizationConfigRuleDetailedStatusRequest",
}) as any as S.Schema<GetOrganizationConfigRuleDetailedStatusRequest>;
export interface GetOrganizationConformancePackDetailedStatusRequest {
  OrganizationConformancePackName: string;
  Filters?: OrganizationResourceDetailedStatusFilters;
  Limit?: number;
  NextToken?: string;
}
export const GetOrganizationConformancePackDetailedStatusRequest = S.suspend(
  () =>
    S.Struct({
      OrganizationConformancePackName: S.String,
      Filters: S.optional(OrganizationResourceDetailedStatusFilters),
      Limit: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "GetOrganizationConformancePackDetailedStatusRequest",
}) as any as S.Schema<GetOrganizationConformancePackDetailedStatusRequest>;
export interface GetOrganizationCustomRulePolicyResponse {
  PolicyText?: string;
}
export const GetOrganizationCustomRulePolicyResponse = S.suspend(() =>
  S.Struct({ PolicyText: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetOrganizationCustomRulePolicyResponse",
}) as any as S.Schema<GetOrganizationCustomRulePolicyResponse>;
export interface GetResourceConfigHistoryResponse {
  configurationItems?: ConfigurationItem[];
  nextToken?: string;
}
export const GetResourceConfigHistoryResponse = S.suspend(() =>
  S.Struct({
    configurationItems: S.optional(ConfigurationItemList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetResourceConfigHistoryResponse",
}) as any as S.Schema<GetResourceConfigHistoryResponse>;
export interface GetStoredQueryResponse {
  StoredQuery?: StoredQuery;
}
export const GetStoredQueryResponse = S.suspend(() =>
  S.Struct({ StoredQuery: S.optional(StoredQuery) }).pipe(ns),
).annotations({
  identifier: "GetStoredQueryResponse",
}) as any as S.Schema<GetStoredQueryResponse>;
export interface ListAggregateDiscoveredResourcesRequest {
  ConfigurationAggregatorName: string;
  ResourceType: ResourceType;
  Filters?: ResourceFilters;
  Limit?: number;
  NextToken?: string;
}
export const ListAggregateDiscoveredResourcesRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.String,
    ResourceType: ResourceType,
    Filters: S.optional(ResourceFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAggregateDiscoveredResourcesRequest",
}) as any as S.Schema<ListAggregateDiscoveredResourcesRequest>;
export interface ListConfigurationRecordersRequest {
  Filters?: ConfigurationRecorderFilter[];
  MaxResults?: number;
  NextToken?: string;
}
export const ListConfigurationRecordersRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ConfigurationRecorderFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationRecordersRequest",
}) as any as S.Schema<ListConfigurationRecordersRequest>;
export interface ListConformancePackComplianceScoresRequest {
  Filters?: ConformancePackComplianceScoresFilters;
  SortOrder?: SortOrder;
  SortBy?: SortBy;
  Limit?: number;
  NextToken?: string;
}
export const ListConformancePackComplianceScoresRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ConformancePackComplianceScoresFilters),
    SortOrder: S.optional(SortOrder),
    SortBy: S.optional(SortBy),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConformancePackComplianceScoresRequest",
}) as any as S.Schema<ListConformancePackComplianceScoresRequest>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutAggregationAuthorizationRequest {
  AuthorizedAccountId: string;
  AuthorizedAwsRegion: string;
  Tags?: Tag[];
}
export const PutAggregationAuthorizationRequest = S.suspend(() =>
  S.Struct({
    AuthorizedAccountId: S.String,
    AuthorizedAwsRegion: S.String,
    Tags: S.optional(TagsList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAggregationAuthorizationRequest",
}) as any as S.Schema<PutAggregationAuthorizationRequest>;
export interface PutConformancePackRequest {
  ConformancePackName: string;
  TemplateS3Uri?: string;
  TemplateBody?: string;
  DeliveryS3Bucket?: string;
  DeliveryS3KeyPrefix?: string;
  ConformancePackInputParameters?: ConformancePackInputParameter[];
  TemplateSSMDocumentDetails?: TemplateSSMDocumentDetails;
}
export const PutConformancePackRequest = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.String,
    TemplateS3Uri: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    DeliveryS3Bucket: S.optional(S.String),
    DeliveryS3KeyPrefix: S.optional(S.String),
    ConformancePackInputParameters: S.optional(ConformancePackInputParameters),
    TemplateSSMDocumentDetails: S.optional(TemplateSSMDocumentDetails),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConformancePackRequest",
}) as any as S.Schema<PutConformancePackRequest>;
export interface PutEvaluationsRequest {
  Evaluations?: Evaluation[];
  ResultToken: string;
  TestMode?: boolean;
}
export const PutEvaluationsRequest = S.suspend(() =>
  S.Struct({
    Evaluations: S.optional(Evaluations),
    ResultToken: S.String,
    TestMode: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEvaluationsRequest",
}) as any as S.Schema<PutEvaluationsRequest>;
export interface PutExternalEvaluationRequest {
  ConfigRuleName: string;
  ExternalEvaluation: ExternalEvaluation;
}
export const PutExternalEvaluationRequest = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    ExternalEvaluation: ExternalEvaluation,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutExternalEvaluationRequest",
}) as any as S.Schema<PutExternalEvaluationRequest>;
export interface PutExternalEvaluationResponse {}
export const PutExternalEvaluationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutExternalEvaluationResponse",
}) as any as S.Schema<PutExternalEvaluationResponse>;
export interface PutOrganizationConfigRuleRequest {
  OrganizationConfigRuleName: string;
  OrganizationManagedRuleMetadata?: OrganizationManagedRuleMetadata;
  OrganizationCustomRuleMetadata?: OrganizationCustomRuleMetadata;
  ExcludedAccounts?: string[];
  OrganizationCustomPolicyRuleMetadata?: OrganizationCustomPolicyRuleMetadata;
}
export const PutOrganizationConfigRuleRequest = S.suspend(() =>
  S.Struct({
    OrganizationConfigRuleName: S.String,
    OrganizationManagedRuleMetadata: S.optional(
      OrganizationManagedRuleMetadata,
    ),
    OrganizationCustomRuleMetadata: S.optional(OrganizationCustomRuleMetadata),
    ExcludedAccounts: S.optional(ExcludedAccounts),
    OrganizationCustomPolicyRuleMetadata: S.optional(
      OrganizationCustomPolicyRuleMetadata,
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutOrganizationConfigRuleRequest",
}) as any as S.Schema<PutOrganizationConfigRuleRequest>;
export interface PutOrganizationConformancePackResponse {
  OrganizationConformancePackArn?: string;
}
export const PutOrganizationConformancePackResponse = S.suspend(() =>
  S.Struct({ OrganizationConformancePackArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutOrganizationConformancePackResponse",
}) as any as S.Schema<PutOrganizationConformancePackResponse>;
export interface PutResourceConfigRequest {
  ResourceType: string;
  SchemaVersionId: string;
  ResourceId: string;
  ResourceName?: string;
  Configuration: string;
  Tags?: { [key: string]: string };
}
export const PutResourceConfigRequest = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    SchemaVersionId: S.String,
    ResourceId: S.String,
    ResourceName: S.optional(S.String),
    Configuration: S.String,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourceConfigRequest",
}) as any as S.Schema<PutResourceConfigRequest>;
export interface PutResourceConfigResponse {}
export const PutResourceConfigResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutResourceConfigResponse",
}) as any as S.Schema<PutResourceConfigResponse>;
export interface RetentionConfiguration {
  Name: string;
  RetentionPeriodInDays: number;
}
export const RetentionConfiguration = S.suspend(() =>
  S.Struct({ Name: S.String, RetentionPeriodInDays: S.Number }),
).annotations({
  identifier: "RetentionConfiguration",
}) as any as S.Schema<RetentionConfiguration>;
export interface PutRetentionConfigurationResponse {
  RetentionConfiguration?: RetentionConfiguration;
}
export const PutRetentionConfigurationResponse = S.suspend(() =>
  S.Struct({ RetentionConfiguration: S.optional(RetentionConfiguration) }).pipe(
    ns,
  ),
).annotations({
  identifier: "PutRetentionConfigurationResponse",
}) as any as S.Schema<PutRetentionConfigurationResponse>;
export interface PutServiceLinkedConfigurationRecorderResponse {
  Arn?: string;
  Name?: string;
}
export const PutServiceLinkedConfigurationRecorderResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutServiceLinkedConfigurationRecorderResponse",
}) as any as S.Schema<PutServiceLinkedConfigurationRecorderResponse>;
export interface PutStoredQueryRequest {
  StoredQuery: StoredQuery;
  Tags?: Tag[];
}
export const PutStoredQueryRequest = S.suspend(() =>
  S.Struct({ StoredQuery: StoredQuery, Tags: S.optional(TagsList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutStoredQueryRequest",
}) as any as S.Schema<PutStoredQueryRequest>;
export interface FieldInfo {
  Name?: string;
}
export const FieldInfo = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({ identifier: "FieldInfo" }) as any as S.Schema<FieldInfo>;
export type FieldInfoList = FieldInfo[];
export const FieldInfoList = S.Array(FieldInfo);
export interface QueryInfo {
  SelectFields?: FieldInfo[];
}
export const QueryInfo = S.suspend(() =>
  S.Struct({ SelectFields: S.optional(FieldInfoList) }),
).annotations({ identifier: "QueryInfo" }) as any as S.Schema<QueryInfo>;
export interface SelectResourceConfigResponse {
  Results?: string[];
  QueryInfo?: QueryInfo;
  NextToken?: string;
}
export const SelectResourceConfigResponse = S.suspend(() =>
  S.Struct({
    Results: S.optional(Results),
    QueryInfo: S.optional(QueryInfo),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "SelectResourceConfigResponse",
}) as any as S.Schema<SelectResourceConfigResponse>;
export interface StartRemediationExecutionResponse {
  FailureMessage?: string;
  FailedItems?: ResourceKey[];
}
export const StartRemediationExecutionResponse = S.suspend(() =>
  S.Struct({
    FailureMessage: S.optional(S.String),
    FailedItems: S.optional(ResourceKeys),
  }).pipe(ns),
).annotations({
  identifier: "StartRemediationExecutionResponse",
}) as any as S.Schema<StartRemediationExecutionResponse>;
export interface StartResourceEvaluationRequest {
  ResourceDetails: ResourceDetails;
  EvaluationContext?: EvaluationContext;
  EvaluationMode: EvaluationMode;
  EvaluationTimeout?: number;
  ClientToken?: string;
}
export const StartResourceEvaluationRequest = S.suspend(() =>
  S.Struct({
    ResourceDetails: ResourceDetails,
    EvaluationContext: S.optional(EvaluationContext),
    EvaluationMode: EvaluationMode,
    EvaluationTimeout: S.optional(S.Number),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartResourceEvaluationRequest",
}) as any as S.Schema<StartResourceEvaluationRequest>;
export type AggregatedSourceType = "ACCOUNT" | "ORGANIZATION";
export const AggregatedSourceType = S.Literal("ACCOUNT", "ORGANIZATION");
export type RecorderStatus =
  | "Pending"
  | "Success"
  | "Failure"
  | "NotApplicable";
export const RecorderStatus = S.Literal(
  "Pending",
  "Success",
  "Failure",
  "NotApplicable",
);
export type ConformancePackState =
  | "CREATE_IN_PROGRESS"
  | "CREATE_COMPLETE"
  | "CREATE_FAILED"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED";
export const ConformancePackState = S.Literal(
  "CREATE_IN_PROGRESS",
  "CREATE_COMPLETE",
  "CREATE_FAILED",
  "DELETE_IN_PROGRESS",
  "DELETE_FAILED",
);
export type OrganizationRuleStatus =
  | "CREATE_SUCCESSFUL"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "DELETE_SUCCESSFUL"
  | "DELETE_FAILED"
  | "DELETE_IN_PROGRESS"
  | "UPDATE_SUCCESSFUL"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_FAILED";
export const OrganizationRuleStatus = S.Literal(
  "CREATE_SUCCESSFUL",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "DELETE_SUCCESSFUL",
  "DELETE_FAILED",
  "DELETE_IN_PROGRESS",
  "UPDATE_SUCCESSFUL",
  "UPDATE_IN_PROGRESS",
  "UPDATE_FAILED",
);
export type OrganizationResourceStatus =
  | "CREATE_SUCCESSFUL"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "DELETE_SUCCESSFUL"
  | "DELETE_FAILED"
  | "DELETE_IN_PROGRESS"
  | "UPDATE_SUCCESSFUL"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_FAILED";
export const OrganizationResourceStatus = S.Literal(
  "CREATE_SUCCESSFUL",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "DELETE_SUCCESSFUL",
  "DELETE_FAILED",
  "DELETE_IN_PROGRESS",
  "UPDATE_SUCCESSFUL",
  "UPDATE_IN_PROGRESS",
  "UPDATE_FAILED",
);
export type RemediationExecutionState =
  | "QUEUED"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "UNKNOWN";
export const RemediationExecutionState = S.Literal(
  "QUEUED",
  "IN_PROGRESS",
  "SUCCEEDED",
  "FAILED",
  "UNKNOWN",
);
export interface ComplianceContributorCount {
  CappedCount?: number;
  CapExceeded?: boolean;
}
export const ComplianceContributorCount = S.suspend(() =>
  S.Struct({
    CappedCount: S.optional(S.Number),
    CapExceeded: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ComplianceContributorCount",
}) as any as S.Schema<ComplianceContributorCount>;
export type ResourceEvaluationStatus = "IN_PROGRESS" | "FAILED" | "SUCCEEDED";
export const ResourceEvaluationStatus = S.Literal(
  "IN_PROGRESS",
  "FAILED",
  "SUCCEEDED",
);
export interface TimeWindow {
  StartTime?: Date;
  EndTime?: Date;
}
export const TimeWindow = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TimeWindow" }) as any as S.Schema<TimeWindow>;
export interface Scope {
  ComplianceResourceTypes?: string[];
  TagKey?: string;
  TagValue?: string;
  ComplianceResourceId?: string;
}
export const Scope = S.suspend(() =>
  S.Struct({
    ComplianceResourceTypes: S.optional(ComplianceResourceTypes),
    TagKey: S.optional(S.String),
    TagValue: S.optional(S.String),
    ComplianceResourceId: S.optional(S.String),
  }),
).annotations({ identifier: "Scope" }) as any as S.Schema<Scope>;
export interface EvaluationModeConfiguration {
  Mode?: EvaluationMode;
}
export const EvaluationModeConfiguration = S.suspend(() =>
  S.Struct({ Mode: S.optional(EvaluationMode) }),
).annotations({
  identifier: "EvaluationModeConfiguration",
}) as any as S.Schema<EvaluationModeConfiguration>;
export type EvaluationModes = EvaluationModeConfiguration[];
export const EvaluationModes = S.Array(EvaluationModeConfiguration);
export interface AggregatorFilterResourceType {
  Type?: AggregatorFilterType;
  Value?: string[];
}
export const AggregatorFilterResourceType = S.suspend(() =>
  S.Struct({
    Type: S.optional(AggregatorFilterType),
    Value: S.optional(ResourceTypeValueList),
  }),
).annotations({
  identifier: "AggregatorFilterResourceType",
}) as any as S.Schema<AggregatorFilterResourceType>;
export interface AggregatorFilterServicePrincipal {
  Type?: AggregatorFilterType;
  Value?: string[];
}
export const AggregatorFilterServicePrincipal = S.suspend(() =>
  S.Struct({
    Type: S.optional(AggregatorFilterType),
    Value: S.optional(ServicePrincipalValueList),
  }),
).annotations({
  identifier: "AggregatorFilterServicePrincipal",
}) as any as S.Schema<AggregatorFilterServicePrincipal>;
export type EventSource = "aws.config";
export const EventSource = S.Literal("aws.config");
export type MessageType =
  | "ConfigurationItemChangeNotification"
  | "ConfigurationSnapshotDeliveryCompleted"
  | "ScheduledNotification"
  | "OversizedConfigurationItemChangeNotification";
export const MessageType = S.Literal(
  "ConfigurationItemChangeNotification",
  "ConfigurationSnapshotDeliveryCompleted",
  "ScheduledNotification",
  "OversizedConfigurationItemChangeNotification",
);
export type UnprocessedResourceIdentifierList = AggregateResourceIdentifier[];
export const UnprocessedResourceIdentifierList = S.Array(
  AggregateResourceIdentifier,
);
export interface AggregationAuthorization {
  AggregationAuthorizationArn?: string;
  AuthorizedAccountId?: string;
  AuthorizedAwsRegion?: string;
  CreationTime?: Date;
}
export const AggregationAuthorization = S.suspend(() =>
  S.Struct({
    AggregationAuthorizationArn: S.optional(S.String),
    AuthorizedAccountId: S.optional(S.String),
    AuthorizedAwsRegion: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AggregationAuthorization",
}) as any as S.Schema<AggregationAuthorization>;
export type AggregationAuthorizationList = AggregationAuthorization[];
export const AggregationAuthorizationList = S.Array(AggregationAuthorization);
export interface Compliance {
  ComplianceType?: ComplianceType;
  ComplianceContributorCount?: ComplianceContributorCount;
}
export const Compliance = S.suspend(() =>
  S.Struct({
    ComplianceType: S.optional(ComplianceType),
    ComplianceContributorCount: S.optional(ComplianceContributorCount),
  }),
).annotations({ identifier: "Compliance" }) as any as S.Schema<Compliance>;
export interface ComplianceByResource {
  ResourceType?: string;
  ResourceId?: string;
  Compliance?: Compliance;
}
export const ComplianceByResource = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Compliance: S.optional(Compliance),
  }),
).annotations({
  identifier: "ComplianceByResource",
}) as any as S.Schema<ComplianceByResource>;
export type ComplianceByResources = ComplianceByResource[];
export const ComplianceByResources = S.Array(ComplianceByResource);
export interface ConfigRuleEvaluationStatus {
  ConfigRuleName?: string;
  ConfigRuleArn?: string;
  ConfigRuleId?: string;
  LastSuccessfulInvocationTime?: Date;
  LastFailedInvocationTime?: Date;
  LastSuccessfulEvaluationTime?: Date;
  LastFailedEvaluationTime?: Date;
  FirstActivatedTime?: Date;
  LastDeactivatedTime?: Date;
  LastErrorCode?: string;
  LastErrorMessage?: string;
  FirstEvaluationStarted?: boolean;
  LastDebugLogDeliveryStatus?: string;
  LastDebugLogDeliveryStatusReason?: string;
  LastDebugLogDeliveryTime?: Date;
}
export const ConfigRuleEvaluationStatus = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.optional(S.String),
    ConfigRuleArn: S.optional(S.String),
    ConfigRuleId: S.optional(S.String),
    LastSuccessfulInvocationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastFailedInvocationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastSuccessfulEvaluationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastFailedEvaluationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FirstActivatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastDeactivatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastErrorCode: S.optional(S.String),
    LastErrorMessage: S.optional(S.String),
    FirstEvaluationStarted: S.optional(S.Boolean),
    LastDebugLogDeliveryStatus: S.optional(S.String),
    LastDebugLogDeliveryStatusReason: S.optional(S.String),
    LastDebugLogDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ConfigRuleEvaluationStatus",
}) as any as S.Schema<ConfigRuleEvaluationStatus>;
export type ConfigRuleEvaluationStatusList = ConfigRuleEvaluationStatus[];
export const ConfigRuleEvaluationStatusList = S.Array(
  ConfigRuleEvaluationStatus,
);
export interface SourceDetail {
  EventSource?: EventSource;
  MessageType?: MessageType;
  MaximumExecutionFrequency?: MaximumExecutionFrequency;
}
export const SourceDetail = S.suspend(() =>
  S.Struct({
    EventSource: S.optional(EventSource),
    MessageType: S.optional(MessageType),
    MaximumExecutionFrequency: S.optional(MaximumExecutionFrequency),
  }),
).annotations({ identifier: "SourceDetail" }) as any as S.Schema<SourceDetail>;
export type SourceDetails = SourceDetail[];
export const SourceDetails = S.Array(SourceDetail);
export interface CustomPolicyDetails {
  PolicyRuntime: string;
  PolicyText: string;
  EnableDebugLogDelivery?: boolean;
}
export const CustomPolicyDetails = S.suspend(() =>
  S.Struct({
    PolicyRuntime: S.String,
    PolicyText: S.String,
    EnableDebugLogDelivery: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CustomPolicyDetails",
}) as any as S.Schema<CustomPolicyDetails>;
export interface Source {
  Owner: Owner;
  SourceIdentifier?: string;
  SourceDetails?: SourceDetail[];
  CustomPolicyDetails?: CustomPolicyDetails;
}
export const Source = S.suspend(() =>
  S.Struct({
    Owner: Owner,
    SourceIdentifier: S.optional(S.String),
    SourceDetails: S.optional(SourceDetails),
    CustomPolicyDetails: S.optional(CustomPolicyDetails),
  }),
).annotations({ identifier: "Source" }) as any as S.Schema<Source>;
export interface ConfigRule {
  ConfigRuleName?: string;
  ConfigRuleArn?: string;
  ConfigRuleId?: string;
  Description?: string;
  Scope?: Scope;
  Source: Source;
  InputParameters?: string;
  MaximumExecutionFrequency?: MaximumExecutionFrequency;
  ConfigRuleState?: ConfigRuleState;
  CreatedBy?: string;
  EvaluationModes?: EvaluationModeConfiguration[];
}
export const ConfigRule = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.optional(S.String),
    ConfigRuleArn: S.optional(S.String),
    ConfigRuleId: S.optional(S.String),
    Description: S.optional(S.String),
    Scope: S.optional(Scope),
    Source: Source,
    InputParameters: S.optional(S.String),
    MaximumExecutionFrequency: S.optional(MaximumExecutionFrequency),
    ConfigRuleState: S.optional(ConfigRuleState),
    CreatedBy: S.optional(S.String),
    EvaluationModes: S.optional(EvaluationModes),
  }),
).annotations({ identifier: "ConfigRule" }) as any as S.Schema<ConfigRule>;
export type ConfigRules = ConfigRule[];
export const ConfigRules = S.Array(ConfigRule);
export interface AggregatorFilters {
  ResourceType?: AggregatorFilterResourceType;
  ServicePrincipal?: AggregatorFilterServicePrincipal;
}
export const AggregatorFilters = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(AggregatorFilterResourceType),
    ServicePrincipal: S.optional(AggregatorFilterServicePrincipal),
  }),
).annotations({
  identifier: "AggregatorFilters",
}) as any as S.Schema<AggregatorFilters>;
export interface ConfigurationAggregator {
  ConfigurationAggregatorName?: string;
  ConfigurationAggregatorArn?: string;
  AccountAggregationSources?: AccountAggregationSource[];
  OrganizationAggregationSource?: OrganizationAggregationSource;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  CreatedBy?: string;
  AggregatorFilters?: AggregatorFilters;
}
export const ConfigurationAggregator = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.optional(S.String),
    ConfigurationAggregatorArn: S.optional(S.String),
    AccountAggregationSources: S.optional(AccountAggregationSourceList),
    OrganizationAggregationSource: S.optional(OrganizationAggregationSource),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedBy: S.optional(S.String),
    AggregatorFilters: S.optional(AggregatorFilters),
  }),
).annotations({
  identifier: "ConfigurationAggregator",
}) as any as S.Schema<ConfigurationAggregator>;
export type ConfigurationAggregatorList = ConfigurationAggregator[];
export const ConfigurationAggregatorList = S.Array(ConfigurationAggregator);
export interface AggregatedSourceStatus {
  SourceId?: string;
  SourceType?: AggregatedSourceType;
  AwsRegion?: string;
  LastUpdateStatus?: AggregatedSourceStatusType;
  LastUpdateTime?: Date;
  LastErrorCode?: string;
  LastErrorMessage?: string;
}
export const AggregatedSourceStatus = S.suspend(() =>
  S.Struct({
    SourceId: S.optional(S.String),
    SourceType: S.optional(AggregatedSourceType),
    AwsRegion: S.optional(S.String),
    LastUpdateStatus: S.optional(AggregatedSourceStatusType),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastErrorCode: S.optional(S.String),
    LastErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregatedSourceStatus",
}) as any as S.Schema<AggregatedSourceStatus>;
export type AggregatedSourceStatusList = AggregatedSourceStatus[];
export const AggregatedSourceStatusList = S.Array(AggregatedSourceStatus);
export interface ConfigurationRecorderStatus {
  arn?: string;
  name?: string;
  lastStartTime?: Date;
  lastStopTime?: Date;
  recording?: boolean;
  lastStatus?: RecorderStatus;
  lastErrorCode?: string;
  lastErrorMessage?: string;
  lastStatusChangeTime?: Date;
  servicePrincipal?: string;
}
export const ConfigurationRecorderStatus = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    lastStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastStopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    recording: S.optional(S.Boolean),
    lastStatus: S.optional(RecorderStatus),
    lastErrorCode: S.optional(S.String),
    lastErrorMessage: S.optional(S.String),
    lastStatusChangeTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    servicePrincipal: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationRecorderStatus",
}) as any as S.Schema<ConfigurationRecorderStatus>;
export type ConfigurationRecorderStatusList = ConfigurationRecorderStatus[];
export const ConfigurationRecorderStatusList = S.Array(
  ConfigurationRecorderStatus,
);
export interface ConformancePackDetail {
  ConformancePackName: string;
  ConformancePackArn: string;
  ConformancePackId: string;
  DeliveryS3Bucket?: string;
  DeliveryS3KeyPrefix?: string;
  ConformancePackInputParameters?: ConformancePackInputParameter[];
  LastUpdateRequestedTime?: Date;
  CreatedBy?: string;
  TemplateSSMDocumentDetails?: TemplateSSMDocumentDetails;
}
export const ConformancePackDetail = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.String,
    ConformancePackArn: S.String,
    ConformancePackId: S.String,
    DeliveryS3Bucket: S.optional(S.String),
    DeliveryS3KeyPrefix: S.optional(S.String),
    ConformancePackInputParameters: S.optional(ConformancePackInputParameters),
    LastUpdateRequestedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedBy: S.optional(S.String),
    TemplateSSMDocumentDetails: S.optional(TemplateSSMDocumentDetails),
  }),
).annotations({
  identifier: "ConformancePackDetail",
}) as any as S.Schema<ConformancePackDetail>;
export type ConformancePackDetailList = ConformancePackDetail[];
export const ConformancePackDetailList = S.Array(ConformancePackDetail);
export interface ConformancePackStatusDetail {
  ConformancePackName: string;
  ConformancePackId: string;
  ConformancePackArn: string;
  ConformancePackState: ConformancePackState;
  StackArn: string;
  ConformancePackStatusReason?: string;
  LastUpdateRequestedTime: Date;
  LastUpdateCompletedTime?: Date;
}
export const ConformancePackStatusDetail = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.String,
    ConformancePackId: S.String,
    ConformancePackArn: S.String,
    ConformancePackState: ConformancePackState,
    StackArn: S.String,
    ConformancePackStatusReason: S.optional(S.String),
    LastUpdateRequestedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdateCompletedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ConformancePackStatusDetail",
}) as any as S.Schema<ConformancePackStatusDetail>;
export type ConformancePackStatusDetailsList = ConformancePackStatusDetail[];
export const ConformancePackStatusDetailsList = S.Array(
  ConformancePackStatusDetail,
);
export interface OrganizationConfigRuleStatus {
  OrganizationConfigRuleName: string;
  OrganizationRuleStatus: OrganizationRuleStatus;
  ErrorCode?: string;
  ErrorMessage?: string;
  LastUpdateTime?: Date;
}
export const OrganizationConfigRuleStatus = S.suspend(() =>
  S.Struct({
    OrganizationConfigRuleName: S.String,
    OrganizationRuleStatus: OrganizationRuleStatus,
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OrganizationConfigRuleStatus",
}) as any as S.Schema<OrganizationConfigRuleStatus>;
export type OrganizationConfigRuleStatuses = OrganizationConfigRuleStatus[];
export const OrganizationConfigRuleStatuses = S.Array(
  OrganizationConfigRuleStatus,
);
export interface OrganizationConformancePack {
  OrganizationConformancePackName: string;
  OrganizationConformancePackArn: string;
  DeliveryS3Bucket?: string;
  DeliveryS3KeyPrefix?: string;
  ConformancePackInputParameters?: ConformancePackInputParameter[];
  ExcludedAccounts?: string[];
  LastUpdateTime: Date;
}
export const OrganizationConformancePack = S.suspend(() =>
  S.Struct({
    OrganizationConformancePackName: S.String,
    OrganizationConformancePackArn: S.String,
    DeliveryS3Bucket: S.optional(S.String),
    DeliveryS3KeyPrefix: S.optional(S.String),
    ConformancePackInputParameters: S.optional(ConformancePackInputParameters),
    ExcludedAccounts: S.optional(ExcludedAccounts),
    LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "OrganizationConformancePack",
}) as any as S.Schema<OrganizationConformancePack>;
export type OrganizationConformancePacks = OrganizationConformancePack[];
export const OrganizationConformancePacks = S.Array(
  OrganizationConformancePack,
);
export interface OrganizationConformancePackStatus {
  OrganizationConformancePackName: string;
  Status: OrganizationResourceStatus;
  ErrorCode?: string;
  ErrorMessage?: string;
  LastUpdateTime?: Date;
}
export const OrganizationConformancePackStatus = S.suspend(() =>
  S.Struct({
    OrganizationConformancePackName: S.String,
    Status: OrganizationResourceStatus,
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OrganizationConformancePackStatus",
}) as any as S.Schema<OrganizationConformancePackStatus>;
export type OrganizationConformancePackStatuses =
  OrganizationConformancePackStatus[];
export const OrganizationConformancePackStatuses = S.Array(
  OrganizationConformancePackStatus,
);
export interface PendingAggregationRequest {
  RequesterAccountId?: string;
  RequesterAwsRegion?: string;
}
export const PendingAggregationRequest = S.suspend(() =>
  S.Struct({
    RequesterAccountId: S.optional(S.String),
    RequesterAwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "PendingAggregationRequest",
}) as any as S.Schema<PendingAggregationRequest>;
export type PendingAggregationRequestList = PendingAggregationRequest[];
export const PendingAggregationRequestList = S.Array(PendingAggregationRequest);
export interface RemediationException {
  ConfigRuleName: string;
  ResourceType: string;
  ResourceId: string;
  Message?: string;
  ExpirationTime?: Date;
}
export const RemediationException = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.String,
    ResourceType: S.String,
    ResourceId: S.String,
    Message: S.optional(S.String),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "RemediationException",
}) as any as S.Schema<RemediationException>;
export type RemediationExceptions = RemediationException[];
export const RemediationExceptions = S.Array(RemediationException);
export type RetentionConfigurationList = RetentionConfiguration[];
export const RetentionConfigurationList = S.Array(RetentionConfiguration);
export interface ComplianceSummary {
  CompliantResourceCount?: ComplianceContributorCount;
  NonCompliantResourceCount?: ComplianceContributorCount;
  ComplianceSummaryTimestamp?: Date;
}
export const ComplianceSummary = S.suspend(() =>
  S.Struct({
    CompliantResourceCount: S.optional(ComplianceContributorCount),
    NonCompliantResourceCount: S.optional(ComplianceContributorCount),
    ComplianceSummaryTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ComplianceSummary",
}) as any as S.Schema<ComplianceSummary>;
export interface ComplianceSummaryByResourceType {
  ResourceType?: string;
  ComplianceSummary?: ComplianceSummary;
}
export const ComplianceSummaryByResourceType = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ComplianceSummary: S.optional(ComplianceSummary),
  }),
).annotations({
  identifier: "ComplianceSummaryByResourceType",
}) as any as S.Schema<ComplianceSummaryByResourceType>;
export type ComplianceSummariesByResourceType =
  ComplianceSummaryByResourceType[];
export const ComplianceSummariesByResourceType = S.Array(
  ComplianceSummaryByResourceType,
);
export interface ConformancePackComplianceSummary {
  ConformancePackName: string;
  ConformancePackComplianceStatus: ConformancePackComplianceType;
}
export const ConformancePackComplianceSummary = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.String,
    ConformancePackComplianceStatus: ConformancePackComplianceType,
  }),
).annotations({
  identifier: "ConformancePackComplianceSummary",
}) as any as S.Schema<ConformancePackComplianceSummary>;
export type ConformancePackComplianceSummaryList =
  ConformancePackComplianceSummary[];
export const ConformancePackComplianceSummaryList = S.Array(
  ConformancePackComplianceSummary,
);
export interface ResourceCount {
  resourceType?: ResourceType;
  count?: number;
}
export const ResourceCount = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(ResourceType),
    count: S.optional(S.Number),
  }),
).annotations({
  identifier: "ResourceCount",
}) as any as S.Schema<ResourceCount>;
export type ResourceCounts = ResourceCount[];
export const ResourceCounts = S.Array(ResourceCount);
export interface EvaluationStatus {
  Status: ResourceEvaluationStatus;
  FailureReason?: string;
}
export const EvaluationStatus = S.suspend(() =>
  S.Struct({
    Status: ResourceEvaluationStatus,
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "EvaluationStatus",
}) as any as S.Schema<EvaluationStatus>;
export type DiscoveredResourceIdentifierList = AggregateResourceIdentifier[];
export const DiscoveredResourceIdentifierList = S.Array(
  AggregateResourceIdentifier,
);
export interface ResourceIdentifier {
  resourceType?: ResourceType;
  resourceId?: string;
  resourceName?: string;
  resourceDeletionTime?: Date;
}
export const ResourceIdentifier = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(ResourceType),
    resourceId: S.optional(S.String),
    resourceName: S.optional(S.String),
    resourceDeletionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ResourceIdentifier",
}) as any as S.Schema<ResourceIdentifier>;
export type ResourceIdentifierList = ResourceIdentifier[];
export const ResourceIdentifierList = S.Array(ResourceIdentifier);
export interface ResourceEvaluationFilters {
  EvaluationMode?: EvaluationMode;
  TimeWindow?: TimeWindow;
  EvaluationContextIdentifier?: string;
}
export const ResourceEvaluationFilters = S.suspend(() =>
  S.Struct({
    EvaluationMode: S.optional(EvaluationMode),
    TimeWindow: S.optional(TimeWindow),
    EvaluationContextIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceEvaluationFilters",
}) as any as S.Schema<ResourceEvaluationFilters>;
export interface StoredQueryMetadata {
  QueryId: string;
  QueryArn: string;
  QueryName: string;
  Description?: string;
}
export const StoredQueryMetadata = S.suspend(() =>
  S.Struct({
    QueryId: S.String,
    QueryArn: S.String,
    QueryName: S.String,
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "StoredQueryMetadata",
}) as any as S.Schema<StoredQueryMetadata>;
export type StoredQueryMetadataList = StoredQueryMetadata[];
export const StoredQueryMetadataList = S.Array(StoredQueryMetadata);
export interface FailedRemediationExceptionBatch {
  FailureMessage?: string;
  FailedItems?: RemediationException[];
}
export const FailedRemediationExceptionBatch = S.suspend(() =>
  S.Struct({
    FailureMessage: S.optional(S.String),
    FailedItems: S.optional(RemediationExceptions),
  }),
).annotations({
  identifier: "FailedRemediationExceptionBatch",
}) as any as S.Schema<FailedRemediationExceptionBatch>;
export type FailedRemediationExceptionBatches =
  FailedRemediationExceptionBatch[];
export const FailedRemediationExceptionBatches = S.Array(
  FailedRemediationExceptionBatch,
);
export type DeliveryStatus = "Success" | "Failure" | "Not_Applicable";
export const DeliveryStatus = S.Literal("Success", "Failure", "Not_Applicable");
export type RemediationExecutionStepState =
  | "SUCCEEDED"
  | "PENDING"
  | "FAILED"
  | "IN_PROGRESS"
  | "EXITED"
  | "UNKNOWN";
export const RemediationExecutionStepState = S.Literal(
  "SUCCEEDED",
  "PENDING",
  "FAILED",
  "IN_PROGRESS",
  "EXITED",
  "UNKNOWN",
);
export interface BaseConfigurationItem {
  version?: string;
  accountId?: string;
  configurationItemCaptureTime?: Date;
  configurationItemStatus?: ConfigurationItemStatus;
  configurationStateId?: string;
  arn?: string;
  resourceType?: ResourceType;
  resourceId?: string;
  resourceName?: string;
  awsRegion?: string;
  availabilityZone?: string;
  resourceCreationTime?: Date;
  configuration?: string;
  supplementaryConfiguration?: { [key: string]: string };
  recordingFrequency?: RecordingFrequency;
  configurationItemDeliveryTime?: Date;
}
export const BaseConfigurationItem = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    accountId: S.optional(S.String),
    configurationItemCaptureTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    configurationItemStatus: S.optional(ConfigurationItemStatus),
    configurationStateId: S.optional(S.String),
    arn: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    resourceId: S.optional(S.String),
    resourceName: S.optional(S.String),
    awsRegion: S.optional(S.String),
    availabilityZone: S.optional(S.String),
    resourceCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    configuration: S.optional(S.String),
    supplementaryConfiguration: S.optional(SupplementaryConfiguration),
    recordingFrequency: S.optional(RecordingFrequency),
    configurationItemDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BaseConfigurationItem",
}) as any as S.Schema<BaseConfigurationItem>;
export type BaseConfigurationItems = BaseConfigurationItem[];
export const BaseConfigurationItems = S.Array(BaseConfigurationItem);
export interface BatchGetResourceConfigResponse {
  baseConfigurationItems?: BaseConfigurationItem[];
  unprocessedResourceKeys?: ResourceKey[];
}
export const BatchGetResourceConfigResponse = S.suspend(() =>
  S.Struct({
    baseConfigurationItems: S.optional(BaseConfigurationItems),
    unprocessedResourceKeys: S.optional(ResourceKeys),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetResourceConfigResponse",
}) as any as S.Schema<BatchGetResourceConfigResponse>;
export interface DescribeAggregationAuthorizationsResponse {
  AggregationAuthorizations?: AggregationAuthorization[];
  NextToken?: string;
}
export const DescribeAggregationAuthorizationsResponse = S.suspend(() =>
  S.Struct({
    AggregationAuthorizations: S.optional(AggregationAuthorizationList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAggregationAuthorizationsResponse",
}) as any as S.Schema<DescribeAggregationAuthorizationsResponse>;
export interface DescribeComplianceByResourceResponse {
  ComplianceByResources?: ComplianceByResource[];
  NextToken?: string;
}
export const DescribeComplianceByResourceResponse = S.suspend(() =>
  S.Struct({
    ComplianceByResources: S.optional(ComplianceByResources),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeComplianceByResourceResponse",
}) as any as S.Schema<DescribeComplianceByResourceResponse>;
export interface DescribeConfigRuleEvaluationStatusResponse {
  ConfigRulesEvaluationStatus?: ConfigRuleEvaluationStatus[];
  NextToken?: string;
}
export const DescribeConfigRuleEvaluationStatusResponse = S.suspend(() =>
  S.Struct({
    ConfigRulesEvaluationStatus: S.optional(ConfigRuleEvaluationStatusList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConfigRuleEvaluationStatusResponse",
}) as any as S.Schema<DescribeConfigRuleEvaluationStatusResponse>;
export interface DescribeConfigRulesResponse {
  ConfigRules?: ConfigRule[];
  NextToken?: string;
}
export const DescribeConfigRulesResponse = S.suspend(() =>
  S.Struct({
    ConfigRules: S.optional(ConfigRules),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConfigRulesResponse",
}) as any as S.Schema<DescribeConfigRulesResponse>;
export interface DescribeConfigurationAggregatorsResponse {
  ConfigurationAggregators?: ConfigurationAggregator[];
  NextToken?: string;
}
export const DescribeConfigurationAggregatorsResponse = S.suspend(() =>
  S.Struct({
    ConfigurationAggregators: S.optional(ConfigurationAggregatorList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConfigurationAggregatorsResponse",
}) as any as S.Schema<DescribeConfigurationAggregatorsResponse>;
export interface DescribeConfigurationAggregatorSourcesStatusResponse {
  AggregatedSourceStatusList?: AggregatedSourceStatus[];
  NextToken?: string;
}
export const DescribeConfigurationAggregatorSourcesStatusResponse = S.suspend(
  () =>
    S.Struct({
      AggregatedSourceStatusList: S.optional(AggregatedSourceStatusList),
      NextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "DescribeConfigurationAggregatorSourcesStatusResponse",
}) as any as S.Schema<DescribeConfigurationAggregatorSourcesStatusResponse>;
export interface DescribeConfigurationRecorderStatusResponse {
  ConfigurationRecordersStatus?: ConfigurationRecorderStatus[];
}
export const DescribeConfigurationRecorderStatusResponse = S.suspend(() =>
  S.Struct({
    ConfigurationRecordersStatus: S.optional(ConfigurationRecorderStatusList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConfigurationRecorderStatusResponse",
}) as any as S.Schema<DescribeConfigurationRecorderStatusResponse>;
export interface DescribeConformancePacksResponse {
  ConformancePackDetails?: ConformancePackDetail[];
  NextToken?: string;
}
export const DescribeConformancePacksResponse = S.suspend(() =>
  S.Struct({
    ConformancePackDetails: S.optional(ConformancePackDetailList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConformancePacksResponse",
}) as any as S.Schema<DescribeConformancePacksResponse>;
export interface DescribeConformancePackStatusResponse {
  ConformancePackStatusDetails?: ConformancePackStatusDetail[];
  NextToken?: string;
}
export const DescribeConformancePackStatusResponse = S.suspend(() =>
  S.Struct({
    ConformancePackStatusDetails: S.optional(ConformancePackStatusDetailsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConformancePackStatusResponse",
}) as any as S.Schema<DescribeConformancePackStatusResponse>;
export interface DescribeOrganizationConfigRuleStatusesResponse {
  OrganizationConfigRuleStatuses?: OrganizationConfigRuleStatus[];
  NextToken?: string;
}
export const DescribeOrganizationConfigRuleStatusesResponse = S.suspend(() =>
  S.Struct({
    OrganizationConfigRuleStatuses: S.optional(OrganizationConfigRuleStatuses),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeOrganizationConfigRuleStatusesResponse",
}) as any as S.Schema<DescribeOrganizationConfigRuleStatusesResponse>;
export interface DescribeOrganizationConformancePacksResponse {
  OrganizationConformancePacks?: OrganizationConformancePack[];
  NextToken?: string;
}
export const DescribeOrganizationConformancePacksResponse = S.suspend(() =>
  S.Struct({
    OrganizationConformancePacks: S.optional(OrganizationConformancePacks),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeOrganizationConformancePacksResponse",
}) as any as S.Schema<DescribeOrganizationConformancePacksResponse>;
export interface DescribeOrganizationConformancePackStatusesResponse {
  OrganizationConformancePackStatuses?: OrganizationConformancePackStatus[];
  NextToken?: string;
}
export const DescribeOrganizationConformancePackStatusesResponse = S.suspend(
  () =>
    S.Struct({
      OrganizationConformancePackStatuses: S.optional(
        OrganizationConformancePackStatuses,
      ),
      NextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "DescribeOrganizationConformancePackStatusesResponse",
}) as any as S.Schema<DescribeOrganizationConformancePackStatusesResponse>;
export interface DescribePendingAggregationRequestsResponse {
  PendingAggregationRequests?: PendingAggregationRequest[];
  NextToken?: string;
}
export const DescribePendingAggregationRequestsResponse = S.suspend(() =>
  S.Struct({
    PendingAggregationRequests: S.optional(PendingAggregationRequestList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePendingAggregationRequestsResponse",
}) as any as S.Schema<DescribePendingAggregationRequestsResponse>;
export interface DescribeRemediationExceptionsResponse {
  RemediationExceptions?: RemediationException[];
  NextToken?: string;
}
export const DescribeRemediationExceptionsResponse = S.suspend(() =>
  S.Struct({
    RemediationExceptions: S.optional(RemediationExceptions),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRemediationExceptionsResponse",
}) as any as S.Schema<DescribeRemediationExceptionsResponse>;
export interface DescribeRetentionConfigurationsResponse {
  RetentionConfigurations?: RetentionConfiguration[];
  NextToken?: string;
}
export const DescribeRetentionConfigurationsResponse = S.suspend(() =>
  S.Struct({
    RetentionConfigurations: S.optional(RetentionConfigurationList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRetentionConfigurationsResponse",
}) as any as S.Schema<DescribeRetentionConfigurationsResponse>;
export interface GetComplianceDetailsByConfigRuleResponse {
  EvaluationResults?: EvaluationResult[];
  NextToken?: string;
}
export const GetComplianceDetailsByConfigRuleResponse = S.suspend(() =>
  S.Struct({
    EvaluationResults: S.optional(EvaluationResults),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetComplianceDetailsByConfigRuleResponse",
}) as any as S.Schema<GetComplianceDetailsByConfigRuleResponse>;
export interface GetComplianceSummaryByConfigRuleResponse {
  ComplianceSummary?: ComplianceSummary;
}
export const GetComplianceSummaryByConfigRuleResponse = S.suspend(() =>
  S.Struct({ ComplianceSummary: S.optional(ComplianceSummary) }).pipe(ns),
).annotations({
  identifier: "GetComplianceSummaryByConfigRuleResponse",
}) as any as S.Schema<GetComplianceSummaryByConfigRuleResponse>;
export interface GetComplianceSummaryByResourceTypeResponse {
  ComplianceSummariesByResourceType?: ComplianceSummaryByResourceType[];
}
export const GetComplianceSummaryByResourceTypeResponse = S.suspend(() =>
  S.Struct({
    ComplianceSummariesByResourceType: S.optional(
      ComplianceSummariesByResourceType,
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetComplianceSummaryByResourceTypeResponse",
}) as any as S.Schema<GetComplianceSummaryByResourceTypeResponse>;
export interface GetConformancePackComplianceSummaryResponse {
  ConformancePackComplianceSummaryList?: ConformancePackComplianceSummary[];
  NextToken?: string;
}
export const GetConformancePackComplianceSummaryResponse = S.suspend(() =>
  S.Struct({
    ConformancePackComplianceSummaryList: S.optional(
      ConformancePackComplianceSummaryList,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetConformancePackComplianceSummaryResponse",
}) as any as S.Schema<GetConformancePackComplianceSummaryResponse>;
export interface GetDiscoveredResourceCountsResponse {
  totalDiscoveredResources?: number;
  resourceCounts?: ResourceCount[];
  nextToken?: string;
}
export const GetDiscoveredResourceCountsResponse = S.suspend(() =>
  S.Struct({
    totalDiscoveredResources: S.optional(S.Number),
    resourceCounts: S.optional(ResourceCounts),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDiscoveredResourceCountsResponse",
}) as any as S.Schema<GetDiscoveredResourceCountsResponse>;
export interface GetResourceEvaluationSummaryResponse {
  ResourceEvaluationId?: string;
  EvaluationMode?: EvaluationMode;
  EvaluationStatus?: EvaluationStatus;
  EvaluationStartTimestamp?: Date;
  Compliance?: ComplianceType;
  EvaluationContext?: EvaluationContext;
  ResourceDetails?: ResourceDetails;
}
export const GetResourceEvaluationSummaryResponse = S.suspend(() =>
  S.Struct({
    ResourceEvaluationId: S.optional(S.String),
    EvaluationMode: S.optional(EvaluationMode),
    EvaluationStatus: S.optional(EvaluationStatus),
    EvaluationStartTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Compliance: S.optional(ComplianceType),
    EvaluationContext: S.optional(EvaluationContext),
    ResourceDetails: S.optional(ResourceDetails),
  }).pipe(ns),
).annotations({
  identifier: "GetResourceEvaluationSummaryResponse",
}) as any as S.Schema<GetResourceEvaluationSummaryResponse>;
export interface ListAggregateDiscoveredResourcesResponse {
  ResourceIdentifiers?: AggregateResourceIdentifier[];
  NextToken?: string;
}
export const ListAggregateDiscoveredResourcesResponse = S.suspend(() =>
  S.Struct({
    ResourceIdentifiers: S.optional(DiscoveredResourceIdentifierList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAggregateDiscoveredResourcesResponse",
}) as any as S.Schema<ListAggregateDiscoveredResourcesResponse>;
export interface ListDiscoveredResourcesResponse {
  resourceIdentifiers?: ResourceIdentifier[];
  nextToken?: string;
}
export const ListDiscoveredResourcesResponse = S.suspend(() =>
  S.Struct({
    resourceIdentifiers: S.optional(ResourceIdentifierList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDiscoveredResourcesResponse",
}) as any as S.Schema<ListDiscoveredResourcesResponse>;
export interface ListResourceEvaluationsRequest {
  Filters?: ResourceEvaluationFilters;
  Limit?: number;
  NextToken?: string;
}
export const ListResourceEvaluationsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ResourceEvaluationFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceEvaluationsRequest",
}) as any as S.Schema<ListResourceEvaluationsRequest>;
export interface ListStoredQueriesResponse {
  StoredQueryMetadata?: StoredQueryMetadata[];
  NextToken?: string;
}
export const ListStoredQueriesResponse = S.suspend(() =>
  S.Struct({
    StoredQueryMetadata: S.optional(StoredQueryMetadataList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStoredQueriesResponse",
}) as any as S.Schema<ListStoredQueriesResponse>;
export interface PutAggregationAuthorizationResponse {
  AggregationAuthorization?: AggregationAuthorization;
}
export const PutAggregationAuthorizationResponse = S.suspend(() =>
  S.Struct({
    AggregationAuthorization: S.optional(AggregationAuthorization),
  }).pipe(ns),
).annotations({
  identifier: "PutAggregationAuthorizationResponse",
}) as any as S.Schema<PutAggregationAuthorizationResponse>;
export interface PutConfigurationAggregatorRequest {
  ConfigurationAggregatorName: string;
  AccountAggregationSources?: AccountAggregationSource[];
  OrganizationAggregationSource?: OrganizationAggregationSource;
  Tags?: Tag[];
  AggregatorFilters?: AggregatorFilters;
}
export const PutConfigurationAggregatorRequest = S.suspend(() =>
  S.Struct({
    ConfigurationAggregatorName: S.String,
    AccountAggregationSources: S.optional(AccountAggregationSourceList),
    OrganizationAggregationSource: S.optional(OrganizationAggregationSource),
    Tags: S.optional(TagsList),
    AggregatorFilters: S.optional(AggregatorFilters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationAggregatorRequest",
}) as any as S.Schema<PutConfigurationAggregatorRequest>;
export interface PutConformancePackResponse {
  ConformancePackArn?: string;
}
export const PutConformancePackResponse = S.suspend(() =>
  S.Struct({ ConformancePackArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutConformancePackResponse",
}) as any as S.Schema<PutConformancePackResponse>;
export interface PutDeliveryChannelRequest {
  DeliveryChannel: DeliveryChannel;
}
export const PutDeliveryChannelRequest = S.suspend(() =>
  S.Struct({ DeliveryChannel: DeliveryChannel }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDeliveryChannelRequest",
}) as any as S.Schema<PutDeliveryChannelRequest>;
export interface PutDeliveryChannelResponse {}
export const PutDeliveryChannelResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutDeliveryChannelResponse",
}) as any as S.Schema<PutDeliveryChannelResponse>;
export interface PutEvaluationsResponse {
  FailedEvaluations?: Evaluation[];
}
export const PutEvaluationsResponse = S.suspend(() =>
  S.Struct({ FailedEvaluations: S.optional(Evaluations) }).pipe(ns),
).annotations({
  identifier: "PutEvaluationsResponse",
}) as any as S.Schema<PutEvaluationsResponse>;
export interface PutOrganizationConfigRuleResponse {
  OrganizationConfigRuleArn?: string;
}
export const PutOrganizationConfigRuleResponse = S.suspend(() =>
  S.Struct({ OrganizationConfigRuleArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutOrganizationConfigRuleResponse",
}) as any as S.Schema<PutOrganizationConfigRuleResponse>;
export interface PutRemediationExceptionsResponse {
  FailedBatches?: FailedRemediationExceptionBatch[];
}
export const PutRemediationExceptionsResponse = S.suspend(() =>
  S.Struct({
    FailedBatches: S.optional(FailedRemediationExceptionBatches),
  }).pipe(ns),
).annotations({
  identifier: "PutRemediationExceptionsResponse",
}) as any as S.Schema<PutRemediationExceptionsResponse>;
export interface PutStoredQueryResponse {
  QueryArn?: string;
}
export const PutStoredQueryResponse = S.suspend(() =>
  S.Struct({ QueryArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutStoredQueryResponse",
}) as any as S.Schema<PutStoredQueryResponse>;
export interface StartResourceEvaluationResponse {
  ResourceEvaluationId?: string;
}
export const StartResourceEvaluationResponse = S.suspend(() =>
  S.Struct({ ResourceEvaluationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartResourceEvaluationResponse",
}) as any as S.Schema<StartResourceEvaluationResponse>;
export type ControlsList = string[];
export const ControlsList = S.Array(S.String);
export interface ConfigExportDeliveryInfo {
  lastStatus?: DeliveryStatus;
  lastErrorCode?: string;
  lastErrorMessage?: string;
  lastAttemptTime?: Date;
  lastSuccessfulTime?: Date;
  nextDeliveryTime?: Date;
}
export const ConfigExportDeliveryInfo = S.suspend(() =>
  S.Struct({
    lastStatus: S.optional(DeliveryStatus),
    lastErrorCode: S.optional(S.String),
    lastErrorMessage: S.optional(S.String),
    lastAttemptTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastSuccessfulTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    nextDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ConfigExportDeliveryInfo",
}) as any as S.Schema<ConfigExportDeliveryInfo>;
export interface ConfigStreamDeliveryInfo {
  lastStatus?: DeliveryStatus;
  lastErrorCode?: string;
  lastErrorMessage?: string;
  lastStatusChangeTime?: Date;
}
export const ConfigStreamDeliveryInfo = S.suspend(() =>
  S.Struct({
    lastStatus: S.optional(DeliveryStatus),
    lastErrorCode: S.optional(S.String),
    lastErrorMessage: S.optional(S.String),
    lastStatusChangeTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ConfigStreamDeliveryInfo",
}) as any as S.Schema<ConfigStreamDeliveryInfo>;
export interface OrganizationCustomPolicyRuleMetadataNoPolicy {
  Description?: string;
  OrganizationConfigRuleTriggerTypes?: OrganizationConfigRuleTriggerTypeNoSN[];
  InputParameters?: string;
  MaximumExecutionFrequency?: MaximumExecutionFrequency;
  ResourceTypesScope?: string[];
  ResourceIdScope?: string;
  TagKeyScope?: string;
  TagValueScope?: string;
  PolicyRuntime?: string;
  DebugLogDeliveryAccounts?: string[];
}
export const OrganizationCustomPolicyRuleMetadataNoPolicy = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    OrganizationConfigRuleTriggerTypes: S.optional(
      OrganizationConfigRuleTriggerTypeNoSNs,
    ),
    InputParameters: S.optional(S.String),
    MaximumExecutionFrequency: S.optional(MaximumExecutionFrequency),
    ResourceTypesScope: S.optional(ResourceTypesScope),
    ResourceIdScope: S.optional(S.String),
    TagKeyScope: S.optional(S.String),
    TagValueScope: S.optional(S.String),
    PolicyRuntime: S.optional(S.String),
    DebugLogDeliveryAccounts: S.optional(DebugLogDeliveryAccounts),
  }),
).annotations({
  identifier: "OrganizationCustomPolicyRuleMetadataNoPolicy",
}) as any as S.Schema<OrganizationCustomPolicyRuleMetadataNoPolicy>;
export interface RemediationExecutionStep {
  Name?: string;
  State?: RemediationExecutionStepState;
  ErrorMessage?: string;
  StartTime?: Date;
  StopTime?: Date;
}
export const RemediationExecutionStep = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    State: S.optional(RemediationExecutionStepState),
    ErrorMessage: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "RemediationExecutionStep",
}) as any as S.Schema<RemediationExecutionStep>;
export type RemediationExecutionSteps = RemediationExecutionStep[];
export const RemediationExecutionSteps = S.Array(RemediationExecutionStep);
export interface FailedDeleteRemediationExceptionsBatch {
  FailureMessage?: string;
  FailedItems?: RemediationExceptionResourceKey[];
}
export const FailedDeleteRemediationExceptionsBatch = S.suspend(() =>
  S.Struct({
    FailureMessage: S.optional(S.String),
    FailedItems: S.optional(RemediationExceptionResourceKeys),
  }),
).annotations({
  identifier: "FailedDeleteRemediationExceptionsBatch",
}) as any as S.Schema<FailedDeleteRemediationExceptionsBatch>;
export type FailedDeleteRemediationExceptionsBatches =
  FailedDeleteRemediationExceptionsBatch[];
export const FailedDeleteRemediationExceptionsBatches = S.Array(
  FailedDeleteRemediationExceptionsBatch,
);
export interface AggregateComplianceByConfigRule {
  ConfigRuleName?: string;
  Compliance?: Compliance;
  AccountId?: string;
  AwsRegion?: string;
}
export const AggregateComplianceByConfigRule = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.optional(S.String),
    Compliance: S.optional(Compliance),
    AccountId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregateComplianceByConfigRule",
}) as any as S.Schema<AggregateComplianceByConfigRule>;
export type AggregateComplianceByConfigRuleList =
  AggregateComplianceByConfigRule[];
export const AggregateComplianceByConfigRuleList = S.Array(
  AggregateComplianceByConfigRule,
);
export interface ComplianceByConfigRule {
  ConfigRuleName?: string;
  Compliance?: Compliance;
}
export const ComplianceByConfigRule = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.optional(S.String),
    Compliance: S.optional(Compliance),
  }),
).annotations({
  identifier: "ComplianceByConfigRule",
}) as any as S.Schema<ComplianceByConfigRule>;
export type ComplianceByConfigRules = ComplianceByConfigRule[];
export const ComplianceByConfigRules = S.Array(ComplianceByConfigRule);
export interface ConformancePackRuleCompliance {
  ConfigRuleName?: string;
  ComplianceType?: ConformancePackComplianceType;
  Controls?: string[];
}
export const ConformancePackRuleCompliance = S.suspend(() =>
  S.Struct({
    ConfigRuleName: S.optional(S.String),
    ComplianceType: S.optional(ConformancePackComplianceType),
    Controls: S.optional(ControlsList),
  }),
).annotations({
  identifier: "ConformancePackRuleCompliance",
}) as any as S.Schema<ConformancePackRuleCompliance>;
export type ConformancePackRuleComplianceList = ConformancePackRuleCompliance[];
export const ConformancePackRuleComplianceList = S.Array(
  ConformancePackRuleCompliance,
);
export interface DeliveryChannelStatus {
  name?: string;
  configSnapshotDeliveryInfo?: ConfigExportDeliveryInfo;
  configHistoryDeliveryInfo?: ConfigExportDeliveryInfo;
  configStreamDeliveryInfo?: ConfigStreamDeliveryInfo;
}
export const DeliveryChannelStatus = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    configSnapshotDeliveryInfo: S.optional(ConfigExportDeliveryInfo),
    configHistoryDeliveryInfo: S.optional(ConfigExportDeliveryInfo),
    configStreamDeliveryInfo: S.optional(ConfigStreamDeliveryInfo),
  }),
).annotations({
  identifier: "DeliveryChannelStatus",
}) as any as S.Schema<DeliveryChannelStatus>;
export type DeliveryChannelStatusList = DeliveryChannelStatus[];
export const DeliveryChannelStatusList = S.Array(DeliveryChannelStatus);
export interface OrganizationConfigRule {
  OrganizationConfigRuleName: string;
  OrganizationConfigRuleArn: string;
  OrganizationManagedRuleMetadata?: OrganizationManagedRuleMetadata;
  OrganizationCustomRuleMetadata?: OrganizationCustomRuleMetadata;
  ExcludedAccounts?: string[];
  LastUpdateTime?: Date;
  OrganizationCustomPolicyRuleMetadata?: OrganizationCustomPolicyRuleMetadataNoPolicy;
}
export const OrganizationConfigRule = S.suspend(() =>
  S.Struct({
    OrganizationConfigRuleName: S.String,
    OrganizationConfigRuleArn: S.String,
    OrganizationManagedRuleMetadata: S.optional(
      OrganizationManagedRuleMetadata,
    ),
    OrganizationCustomRuleMetadata: S.optional(OrganizationCustomRuleMetadata),
    ExcludedAccounts: S.optional(ExcludedAccounts),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OrganizationCustomPolicyRuleMetadata: S.optional(
      OrganizationCustomPolicyRuleMetadataNoPolicy,
    ),
  }),
).annotations({
  identifier: "OrganizationConfigRule",
}) as any as S.Schema<OrganizationConfigRule>;
export type OrganizationConfigRules = OrganizationConfigRule[];
export const OrganizationConfigRules = S.Array(OrganizationConfigRule);
export interface RemediationExecutionStatus {
  ResourceKey?: ResourceKey;
  State?: RemediationExecutionState;
  StepDetails?: RemediationExecutionStep[];
  InvocationTime?: Date;
  LastUpdatedTime?: Date;
}
export const RemediationExecutionStatus = S.suspend(() =>
  S.Struct({
    ResourceKey: S.optional(ResourceKey),
    State: S.optional(RemediationExecutionState),
    StepDetails: S.optional(RemediationExecutionSteps),
    InvocationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RemediationExecutionStatus",
}) as any as S.Schema<RemediationExecutionStatus>;
export type RemediationExecutionStatuses = RemediationExecutionStatus[];
export const RemediationExecutionStatuses = S.Array(RemediationExecutionStatus);
export interface AggregateComplianceCount {
  GroupName?: string;
  ComplianceSummary?: ComplianceSummary;
}
export const AggregateComplianceCount = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    ComplianceSummary: S.optional(ComplianceSummary),
  }),
).annotations({
  identifier: "AggregateComplianceCount",
}) as any as S.Schema<AggregateComplianceCount>;
export type AggregateComplianceCountList = AggregateComplianceCount[];
export const AggregateComplianceCountList = S.Array(AggregateComplianceCount);
export interface GroupedResourceCount {
  GroupName: string;
  ResourceCount: number;
}
export const GroupedResourceCount = S.suspend(() =>
  S.Struct({ GroupName: S.String, ResourceCount: S.Number }),
).annotations({
  identifier: "GroupedResourceCount",
}) as any as S.Schema<GroupedResourceCount>;
export type GroupedResourceCountList = GroupedResourceCount[];
export const GroupedResourceCountList = S.Array(GroupedResourceCount);
export interface ConformancePackEvaluationResult {
  ComplianceType: ConformancePackComplianceType;
  EvaluationResultIdentifier: EvaluationResultIdentifier;
  ConfigRuleInvokedTime: Date;
  ResultRecordedTime: Date;
  Annotation?: string;
}
export const ConformancePackEvaluationResult = S.suspend(() =>
  S.Struct({
    ComplianceType: ConformancePackComplianceType,
    EvaluationResultIdentifier: EvaluationResultIdentifier,
    ConfigRuleInvokedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ResultRecordedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Annotation: S.optional(S.String),
  }),
).annotations({
  identifier: "ConformancePackEvaluationResult",
}) as any as S.Schema<ConformancePackEvaluationResult>;
export type ConformancePackRuleEvaluationResultsList =
  ConformancePackEvaluationResult[];
export const ConformancePackRuleEvaluationResultsList = S.Array(
  ConformancePackEvaluationResult,
);
export interface MemberAccountStatus {
  AccountId: string;
  ConfigRuleName: string;
  MemberAccountRuleStatus: MemberAccountRuleStatus;
  ErrorCode?: string;
  ErrorMessage?: string;
  LastUpdateTime?: Date;
}
export const MemberAccountStatus = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    ConfigRuleName: S.String,
    MemberAccountRuleStatus: MemberAccountRuleStatus,
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "MemberAccountStatus",
}) as any as S.Schema<MemberAccountStatus>;
export type OrganizationConfigRuleDetailedStatus = MemberAccountStatus[];
export const OrganizationConfigRuleDetailedStatus =
  S.Array(MemberAccountStatus);
export interface OrganizationConformancePackDetailedStatus {
  AccountId: string;
  ConformancePackName: string;
  Status: OrganizationResourceDetailedStatus;
  ErrorCode?: string;
  ErrorMessage?: string;
  LastUpdateTime?: Date;
}
export const OrganizationConformancePackDetailedStatus = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    ConformancePackName: S.String,
    Status: OrganizationResourceDetailedStatus,
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OrganizationConformancePackDetailedStatus",
}) as any as S.Schema<OrganizationConformancePackDetailedStatus>;
export type OrganizationConformancePackDetailedStatuses =
  OrganizationConformancePackDetailedStatus[];
export const OrganizationConformancePackDetailedStatuses = S.Array(
  OrganizationConformancePackDetailedStatus,
);
export interface ConfigurationRecorderSummary {
  arn: string;
  name: string;
  servicePrincipal?: string;
  recordingScope: RecordingScope;
}
export const ConfigurationRecorderSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    servicePrincipal: S.optional(S.String),
    recordingScope: RecordingScope,
  }),
).annotations({
  identifier: "ConfigurationRecorderSummary",
}) as any as S.Schema<ConfigurationRecorderSummary>;
export type ConfigurationRecorderSummaries = ConfigurationRecorderSummary[];
export const ConfigurationRecorderSummaries = S.Array(
  ConfigurationRecorderSummary,
);
export interface ConformancePackComplianceScore {
  Score?: string;
  ConformancePackName?: string;
  LastUpdatedTime?: Date;
}
export const ConformancePackComplianceScore = S.suspend(() =>
  S.Struct({
    Score: S.optional(S.String),
    ConformancePackName: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ConformancePackComplianceScore",
}) as any as S.Schema<ConformancePackComplianceScore>;
export type ConformancePackComplianceScores = ConformancePackComplianceScore[];
export const ConformancePackComplianceScores = S.Array(
  ConformancePackComplianceScore,
);
export interface BatchGetAggregateResourceConfigResponse {
  BaseConfigurationItems?: BaseConfigurationItem[];
  UnprocessedResourceIdentifiers?: AggregateResourceIdentifier[];
}
export const BatchGetAggregateResourceConfigResponse = S.suspend(() =>
  S.Struct({
    BaseConfigurationItems: S.optional(BaseConfigurationItems),
    UnprocessedResourceIdentifiers: S.optional(
      UnprocessedResourceIdentifierList,
    ),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetAggregateResourceConfigResponse",
}) as any as S.Schema<BatchGetAggregateResourceConfigResponse>;
export interface DeleteRemediationExceptionsResponse {
  FailedBatches?: FailedDeleteRemediationExceptionsBatch[];
}
export const DeleteRemediationExceptionsResponse = S.suspend(() =>
  S.Struct({
    FailedBatches: S.optional(FailedDeleteRemediationExceptionsBatches),
  }).pipe(ns),
).annotations({
  identifier: "DeleteRemediationExceptionsResponse",
}) as any as S.Schema<DeleteRemediationExceptionsResponse>;
export interface DescribeAggregateComplianceByConfigRulesResponse {
  AggregateComplianceByConfigRules?: AggregateComplianceByConfigRule[];
  NextToken?: string;
}
export const DescribeAggregateComplianceByConfigRulesResponse = S.suspend(() =>
  S.Struct({
    AggregateComplianceByConfigRules: S.optional(
      AggregateComplianceByConfigRuleList,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAggregateComplianceByConfigRulesResponse",
}) as any as S.Schema<DescribeAggregateComplianceByConfigRulesResponse>;
export interface DescribeComplianceByConfigRuleResponse {
  ComplianceByConfigRules?: ComplianceByConfigRule[];
  NextToken?: string;
}
export const DescribeComplianceByConfigRuleResponse = S.suspend(() =>
  S.Struct({
    ComplianceByConfigRules: S.optional(ComplianceByConfigRules),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeComplianceByConfigRuleResponse",
}) as any as S.Schema<DescribeComplianceByConfigRuleResponse>;
export interface DescribeConformancePackComplianceResponse {
  ConformancePackName: string;
  ConformancePackRuleComplianceList: ConformancePackRuleCompliance[];
  NextToken?: string;
}
export const DescribeConformancePackComplianceResponse = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.String,
    ConformancePackRuleComplianceList: ConformancePackRuleComplianceList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConformancePackComplianceResponse",
}) as any as S.Schema<DescribeConformancePackComplianceResponse>;
export interface DescribeDeliveryChannelStatusResponse {
  DeliveryChannelsStatus?: DeliveryChannelStatus[];
}
export const DescribeDeliveryChannelStatusResponse = S.suspend(() =>
  S.Struct({
    DeliveryChannelsStatus: S.optional(DeliveryChannelStatusList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDeliveryChannelStatusResponse",
}) as any as S.Schema<DescribeDeliveryChannelStatusResponse>;
export interface DescribeOrganizationConfigRulesResponse {
  OrganizationConfigRules?: OrganizationConfigRule[];
  NextToken?: string;
}
export const DescribeOrganizationConfigRulesResponse = S.suspend(() =>
  S.Struct({
    OrganizationConfigRules: S.optional(OrganizationConfigRules),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeOrganizationConfigRulesResponse",
}) as any as S.Schema<DescribeOrganizationConfigRulesResponse>;
export interface DescribeRemediationExecutionStatusResponse {
  RemediationExecutionStatuses?: RemediationExecutionStatus[];
  NextToken?: string;
}
export const DescribeRemediationExecutionStatusResponse = S.suspend(() =>
  S.Struct({
    RemediationExecutionStatuses: S.optional(RemediationExecutionStatuses),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRemediationExecutionStatusResponse",
}) as any as S.Schema<DescribeRemediationExecutionStatusResponse>;
export interface GetAggregateConfigRuleComplianceSummaryResponse {
  GroupByKey?: string;
  AggregateComplianceCounts?: AggregateComplianceCount[];
  NextToken?: string;
}
export const GetAggregateConfigRuleComplianceSummaryResponse = S.suspend(() =>
  S.Struct({
    GroupByKey: S.optional(S.String),
    AggregateComplianceCounts: S.optional(AggregateComplianceCountList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAggregateConfigRuleComplianceSummaryResponse",
}) as any as S.Schema<GetAggregateConfigRuleComplianceSummaryResponse>;
export interface GetAggregateDiscoveredResourceCountsResponse {
  TotalDiscoveredResources: number;
  GroupByKey?: string;
  GroupedResourceCounts?: GroupedResourceCount[];
  NextToken?: string;
}
export const GetAggregateDiscoveredResourceCountsResponse = S.suspend(() =>
  S.Struct({
    TotalDiscoveredResources: S.Number,
    GroupByKey: S.optional(S.String),
    GroupedResourceCounts: S.optional(GroupedResourceCountList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAggregateDiscoveredResourceCountsResponse",
}) as any as S.Schema<GetAggregateDiscoveredResourceCountsResponse>;
export interface GetAggregateResourceConfigResponse {
  ConfigurationItem?: ConfigurationItem;
}
export const GetAggregateResourceConfigResponse = S.suspend(() =>
  S.Struct({ ConfigurationItem: S.optional(ConfigurationItem) }).pipe(ns),
).annotations({
  identifier: "GetAggregateResourceConfigResponse",
}) as any as S.Schema<GetAggregateResourceConfigResponse>;
export interface GetConformancePackComplianceDetailsResponse {
  ConformancePackName: string;
  ConformancePackRuleEvaluationResults?: ConformancePackEvaluationResult[];
  NextToken?: string;
}
export const GetConformancePackComplianceDetailsResponse = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.String,
    ConformancePackRuleEvaluationResults: S.optional(
      ConformancePackRuleEvaluationResultsList,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetConformancePackComplianceDetailsResponse",
}) as any as S.Schema<GetConformancePackComplianceDetailsResponse>;
export interface GetOrganizationConfigRuleDetailedStatusResponse {
  OrganizationConfigRuleDetailedStatus?: MemberAccountStatus[];
  NextToken?: string;
}
export const GetOrganizationConfigRuleDetailedStatusResponse = S.suspend(() =>
  S.Struct({
    OrganizationConfigRuleDetailedStatus: S.optional(
      OrganizationConfigRuleDetailedStatus,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetOrganizationConfigRuleDetailedStatusResponse",
}) as any as S.Schema<GetOrganizationConfigRuleDetailedStatusResponse>;
export interface GetOrganizationConformancePackDetailedStatusResponse {
  OrganizationConformancePackDetailedStatuses?: OrganizationConformancePackDetailedStatus[];
  NextToken?: string;
}
export const GetOrganizationConformancePackDetailedStatusResponse = S.suspend(
  () =>
    S.Struct({
      OrganizationConformancePackDetailedStatuses: S.optional(
        OrganizationConformancePackDetailedStatuses,
      ),
      NextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "GetOrganizationConformancePackDetailedStatusResponse",
}) as any as S.Schema<GetOrganizationConformancePackDetailedStatusResponse>;
export interface ListConfigurationRecordersResponse {
  ConfigurationRecorderSummaries: ConfigurationRecorderSummary[];
  NextToken?: string;
}
export const ListConfigurationRecordersResponse = S.suspend(() =>
  S.Struct({
    ConfigurationRecorderSummaries: ConfigurationRecorderSummaries,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListConfigurationRecordersResponse",
}) as any as S.Schema<ListConfigurationRecordersResponse>;
export interface ListConformancePackComplianceScoresResponse {
  NextToken?: string;
  ConformancePackComplianceScores: ConformancePackComplianceScore[];
}
export const ListConformancePackComplianceScoresResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ConformancePackComplianceScores: ConformancePackComplianceScores,
  }).pipe(ns),
).annotations({
  identifier: "ListConformancePackComplianceScoresResponse",
}) as any as S.Schema<ListConformancePackComplianceScoresResponse>;
export interface PutConfigRuleRequest {
  ConfigRule: ConfigRule;
  Tags?: Tag[];
}
export const PutConfigRuleRequest = S.suspend(() =>
  S.Struct({ ConfigRule: ConfigRule, Tags: S.optional(TagsList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigRuleRequest",
}) as any as S.Schema<PutConfigRuleRequest>;
export interface PutConfigRuleResponse {}
export const PutConfigRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutConfigRuleResponse",
}) as any as S.Schema<PutConfigRuleResponse>;
export interface PutConfigurationAggregatorResponse {
  ConfigurationAggregator?: ConfigurationAggregator;
}
export const PutConfigurationAggregatorResponse = S.suspend(() =>
  S.Struct({
    ConfigurationAggregator: S.optional(ConfigurationAggregator),
  }).pipe(ns),
).annotations({
  identifier: "PutConfigurationAggregatorResponse",
}) as any as S.Schema<PutConfigurationAggregatorResponse>;
export interface PutConfigurationRecorderRequest {
  ConfigurationRecorder: ConfigurationRecorder;
  Tags?: Tag[];
}
export const PutConfigurationRecorderRequest = S.suspend(() =>
  S.Struct({
    ConfigurationRecorder: ConfigurationRecorder,
    Tags: S.optional(TagsList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationRecorderRequest",
}) as any as S.Schema<PutConfigurationRecorderRequest>;
export interface PutConfigurationRecorderResponse {}
export const PutConfigurationRecorderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutConfigurationRecorderResponse",
}) as any as S.Schema<PutConfigurationRecorderResponse>;
export interface SelectAggregateResourceConfigResponse {
  Results?: string[];
  QueryInfo?: QueryInfo;
  NextToken?: string;
}
export const SelectAggregateResourceConfigResponse = S.suspend(() =>
  S.Struct({
    Results: S.optional(Results),
    QueryInfo: S.optional(QueryInfo),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "SelectAggregateResourceConfigResponse",
}) as any as S.Schema<SelectAggregateResourceConfigResponse>;
export interface AggregateConformancePackCompliance {
  ComplianceType?: ConformancePackComplianceType;
  CompliantRuleCount?: number;
  NonCompliantRuleCount?: number;
  TotalRuleCount?: number;
}
export const AggregateConformancePackCompliance = S.suspend(() =>
  S.Struct({
    ComplianceType: S.optional(ConformancePackComplianceType),
    CompliantRuleCount: S.optional(S.Number),
    NonCompliantRuleCount: S.optional(S.Number),
    TotalRuleCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "AggregateConformancePackCompliance",
}) as any as S.Schema<AggregateConformancePackCompliance>;
export interface AggregateConformancePackComplianceCount {
  CompliantConformancePackCount?: number;
  NonCompliantConformancePackCount?: number;
}
export const AggregateConformancePackComplianceCount = S.suspend(() =>
  S.Struct({
    CompliantConformancePackCount: S.optional(S.Number),
    NonCompliantConformancePackCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "AggregateConformancePackComplianceCount",
}) as any as S.Schema<AggregateConformancePackComplianceCount>;
export interface AggregateComplianceByConformancePack {
  ConformancePackName?: string;
  Compliance?: AggregateConformancePackCompliance;
  AccountId?: string;
  AwsRegion?: string;
}
export const AggregateComplianceByConformancePack = S.suspend(() =>
  S.Struct({
    ConformancePackName: S.optional(S.String),
    Compliance: S.optional(AggregateConformancePackCompliance),
    AccountId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregateComplianceByConformancePack",
}) as any as S.Schema<AggregateComplianceByConformancePack>;
export type AggregateComplianceByConformancePackList =
  AggregateComplianceByConformancePack[];
export const AggregateComplianceByConformancePackList = S.Array(
  AggregateComplianceByConformancePack,
);
export interface AggregateEvaluationResult {
  EvaluationResultIdentifier?: EvaluationResultIdentifier;
  ComplianceType?: ComplianceType;
  ResultRecordedTime?: Date;
  ConfigRuleInvokedTime?: Date;
  Annotation?: string;
  AccountId?: string;
  AwsRegion?: string;
}
export const AggregateEvaluationResult = S.suspend(() =>
  S.Struct({
    EvaluationResultIdentifier: S.optional(EvaluationResultIdentifier),
    ComplianceType: S.optional(ComplianceType),
    ResultRecordedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ConfigRuleInvokedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Annotation: S.optional(S.String),
    AccountId: S.optional(S.String),
    AwsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregateEvaluationResult",
}) as any as S.Schema<AggregateEvaluationResult>;
export type AggregateEvaluationResultList = AggregateEvaluationResult[];
export const AggregateEvaluationResultList = S.Array(AggregateEvaluationResult);
export interface AggregateConformancePackComplianceSummary {
  ComplianceSummary?: AggregateConformancePackComplianceCount;
  GroupName?: string;
}
export const AggregateConformancePackComplianceSummary = S.suspend(() =>
  S.Struct({
    ComplianceSummary: S.optional(AggregateConformancePackComplianceCount),
    GroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "AggregateConformancePackComplianceSummary",
}) as any as S.Schema<AggregateConformancePackComplianceSummary>;
export type AggregateConformancePackComplianceSummaryList =
  AggregateConformancePackComplianceSummary[];
export const AggregateConformancePackComplianceSummaryList = S.Array(
  AggregateConformancePackComplianceSummary,
);
export interface ResourceEvaluation {
  ResourceEvaluationId?: string;
  EvaluationMode?: EvaluationMode;
  EvaluationStartTimestamp?: Date;
}
export const ResourceEvaluation = S.suspend(() =>
  S.Struct({
    ResourceEvaluationId: S.optional(S.String),
    EvaluationMode: S.optional(EvaluationMode),
    EvaluationStartTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ResourceEvaluation",
}) as any as S.Schema<ResourceEvaluation>;
export type ResourceEvaluations = ResourceEvaluation[];
export const ResourceEvaluations = S.Array(ResourceEvaluation);
export interface DescribeAggregateComplianceByConformancePacksResponse {
  AggregateComplianceByConformancePacks?: AggregateComplianceByConformancePack[];
  NextToken?: string;
}
export const DescribeAggregateComplianceByConformancePacksResponse = S.suspend(
  () =>
    S.Struct({
      AggregateComplianceByConformancePacks: S.optional(
        AggregateComplianceByConformancePackList,
      ),
      NextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "DescribeAggregateComplianceByConformancePacksResponse",
}) as any as S.Schema<DescribeAggregateComplianceByConformancePacksResponse>;
export interface GetAggregateComplianceDetailsByConfigRuleResponse {
  AggregateEvaluationResults?: AggregateEvaluationResult[];
  NextToken?: string;
}
export const GetAggregateComplianceDetailsByConfigRuleResponse = S.suspend(() =>
  S.Struct({
    AggregateEvaluationResults: S.optional(AggregateEvaluationResultList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAggregateComplianceDetailsByConfigRuleResponse",
}) as any as S.Schema<GetAggregateComplianceDetailsByConfigRuleResponse>;
export interface GetAggregateConformancePackComplianceSummaryResponse {
  AggregateConformancePackComplianceSummaries?: AggregateConformancePackComplianceSummary[];
  GroupByKey?: string;
  NextToken?: string;
}
export const GetAggregateConformancePackComplianceSummaryResponse = S.suspend(
  () =>
    S.Struct({
      AggregateConformancePackComplianceSummaries: S.optional(
        AggregateConformancePackComplianceSummaryList,
      ),
      GroupByKey: S.optional(S.String),
      NextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "GetAggregateConformancePackComplianceSummaryResponse",
}) as any as S.Schema<GetAggregateConformancePackComplianceSummaryResponse>;
export interface ListResourceEvaluationsResponse {
  ResourceEvaluations?: ResourceEvaluation[];
  NextToken?: string;
}
export const ListResourceEvaluationsResponse = S.suspend(() =>
  S.Struct({
    ResourceEvaluations: S.optional(ResourceEvaluations),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceEvaluationsResponse",
}) as any as S.Schema<ListResourceEvaluationsResponse>;
export interface PutRemediationConfigurationsRequest {
  RemediationConfigurations: RemediationConfiguration[];
}
export const PutRemediationConfigurationsRequest = S.suspend(() =>
  S.Struct({ RemediationConfigurations: RemediationConfigurations }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRemediationConfigurationsRequest",
}) as any as S.Schema<PutRemediationConfigurationsRequest>;
export interface FailedRemediationBatch {
  FailureMessage?: string;
  FailedItems?: RemediationConfiguration[];
}
export const FailedRemediationBatch = S.suspend(() =>
  S.Struct({
    FailureMessage: S.optional(S.String),
    FailedItems: S.optional(RemediationConfigurations),
  }),
).annotations({
  identifier: "FailedRemediationBatch",
}) as any as S.Schema<FailedRemediationBatch>;
export type FailedRemediationBatches = FailedRemediationBatch[];
export const FailedRemediationBatches = S.Array(FailedRemediationBatch);
export interface PutRemediationConfigurationsResponse {
  FailedBatches?: FailedRemediationBatch[];
}
export const PutRemediationConfigurationsResponse = S.suspend(() =>
  S.Struct({ FailedBatches: S.optional(FailedRemediationBatches) }).pipe(ns),
).annotations({
  identifier: "PutRemediationConfigurationsResponse",
}) as any as S.Schema<PutRemediationConfigurationsResponse>;

//# Errors
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
) {}
export class NoSuchConfigRuleException extends S.TaggedError<NoSuchConfigRuleException>()(
  "NoSuchConfigRuleException",
  { message: S.optional(S.String) },
) {}
export class NoSuchConfigurationAggregatorException extends S.TaggedError<NoSuchConfigurationAggregatorException>()(
  "NoSuchConfigurationAggregatorException",
  { message: S.optional(S.String) },
) {}
export class NoSuchConfigurationRecorderException extends S.TaggedError<NoSuchConfigurationRecorderException>()(
  "NoSuchConfigurationRecorderException",
  { message: S.optional(S.String) },
) {}
export class NoSuchConformancePackException extends S.TaggedError<NoSuchConformancePackException>()(
  "NoSuchConformancePackException",
  { message: S.optional(S.String) },
) {}
export class LastDeliveryChannelDeleteFailedException extends S.TaggedError<LastDeliveryChannelDeleteFailedException>()(
  "LastDeliveryChannelDeleteFailedException",
  { message: S.optional(S.String) },
) {}
export class NoSuchOrganizationConfigRuleException extends S.TaggedError<NoSuchOrganizationConfigRuleException>()(
  "NoSuchOrganizationConfigRuleException",
  { message: S.optional(S.String) },
) {}
export class NoSuchOrganizationConformancePackException extends S.TaggedError<NoSuchOrganizationConformancePackException>()(
  "NoSuchOrganizationConformancePackException",
  { message: S.optional(S.String) },
) {}
export class InsufficientPermissionsException extends S.TaggedError<InsufficientPermissionsException>()(
  "InsufficientPermissionsException",
  { message: S.optional(S.String) },
) {}
export class NoRunningConfigurationRecorderException extends S.TaggedError<NoRunningConfigurationRecorderException>()(
  "NoRunningConfigurationRecorderException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class NoAvailableDeliveryChannelException extends S.TaggedError<NoAvailableDeliveryChannelException>()(
  "NoAvailableDeliveryChannelException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class UnmodifiableEntityException extends S.TaggedError<UnmodifiableEntityException>()(
  "UnmodifiableEntityException",
  { message: S.optional(S.String) },
) {}
export class NoSuchDeliveryChannelException extends S.TaggedError<NoSuchDeliveryChannelException>()(
  "NoSuchDeliveryChannelException",
  { message: S.optional(S.String) },
) {}
export class OrganizationAccessDeniedException extends S.TaggedError<OrganizationAccessDeniedException>()(
  "OrganizationAccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class NoSuchRemediationConfigurationException extends S.TaggedError<NoSuchRemediationConfigurationException>()(
  "NoSuchRemediationConfigurationException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class NoAvailableConfigurationRecorderException extends S.TaggedError<NoAvailableConfigurationRecorderException>()(
  "NoAvailableConfigurationRecorderException",
  { message: S.optional(S.String) },
) {}
export class InvalidLimitException extends S.TaggedError<InvalidLimitException>()(
  "InvalidLimitException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfOrganizationConformancePacksExceededException extends S.TaggedError<MaxNumberOfOrganizationConformancePacksExceededException>()(
  "MaxNumberOfOrganizationConformancePacksExceededException",
  { message: S.optional(S.String) },
) {}
export class MaxActiveResourcesExceededException extends S.TaggedError<MaxActiveResourcesExceededException>()(
  "MaxActiveResourcesExceededException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfRetentionConfigurationsExceededException extends S.TaggedError<MaxNumberOfRetentionConfigurationsExceededException>()(
  "MaxNumberOfRetentionConfigurationsExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidExpressionException extends S.TaggedError<InvalidExpressionException>()(
  "InvalidExpressionException",
  { message: S.optional(S.String) },
) {}
export class NoSuchRetentionConfigurationException extends S.TaggedError<NoSuchRetentionConfigurationException>()(
  "NoSuchRetentionConfigurationException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class RemediationInProgressException extends S.TaggedError<RemediationInProgressException>()(
  "RemediationInProgressException",
  { message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { message: S.optional(S.String) },
) {}
export class ConformancePackTemplateValidationException extends S.TaggedError<ConformancePackTemplateValidationException>()(
  "ConformancePackTemplateValidationException",
  { message: S.optional(S.String) },
) {}
export class InsufficientDeliveryPolicyException extends S.TaggedError<InsufficientDeliveryPolicyException>()(
  "InsufficientDeliveryPolicyException",
  { message: S.optional(S.String) },
) {}
export class InvalidResultTokenException extends S.TaggedError<InvalidResultTokenException>()(
  "InvalidResultTokenException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfOrganizationConfigRulesExceededException extends S.TaggedError<MaxNumberOfOrganizationConfigRulesExceededException>()(
  "MaxNumberOfOrganizationConfigRulesExceededException",
  { message: S.optional(S.String) },
) {}
export class NoAvailableOrganizationException extends S.TaggedError<NoAvailableOrganizationException>()(
  "NoAvailableOrganizationException",
  { message: S.optional(S.String) },
) {}
export class ResourceConcurrentModificationException extends S.TaggedError<ResourceConcurrentModificationException>()(
  "ResourceConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class IdempotentParameterMismatch extends S.TaggedError<IdempotentParameterMismatch>()(
  "IdempotentParameterMismatch",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchRemediationExceptionException extends S.TaggedError<NoSuchRemediationExceptionException>()(
  "NoSuchRemediationExceptionException",
  { message: S.optional(S.String) },
) {}
export class NoSuchConfigRuleInConformancePackException extends S.TaggedError<NoSuchConfigRuleInConformancePackException>()(
  "NoSuchConfigRuleInConformancePackException",
  { message: S.optional(S.String) },
) {}
export class OversizedConfigurationItemException extends S.TaggedError<OversizedConfigurationItemException>()(
  "OversizedConfigurationItemException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfConfigRulesExceededException extends S.TaggedError<MaxNumberOfConfigRulesExceededException>()(
  "MaxNumberOfConfigRulesExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidRoleException extends S.TaggedError<InvalidRoleException>()(
  "InvalidRoleException",
  { message: S.optional(S.String) },
) {}
export class InvalidConfigurationRecorderNameException extends S.TaggedError<InvalidConfigurationRecorderNameException>()(
  "InvalidConfigurationRecorderNameException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfConformancePacksExceededException extends S.TaggedError<MaxNumberOfConformancePacksExceededException>()(
  "MaxNumberOfConformancePacksExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeliveryChannelNameException extends S.TaggedError<InvalidDeliveryChannelNameException>()(
  "InvalidDeliveryChannelNameException",
  { message: S.optional(S.String) },
) {}
export class OrganizationAllFeaturesNotEnabledException extends S.TaggedError<OrganizationAllFeaturesNotEnabledException>()(
  "OrganizationAllFeaturesNotEnabledException",
  { message: S.optional(S.String) },
) {}
export class InvalidTimeRangeException extends S.TaggedError<InvalidTimeRangeException>()(
  "InvalidTimeRangeException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotDiscoveredException extends S.TaggedError<ResourceNotDiscoveredException>()(
  "ResourceNotDiscoveredException",
  { message: S.optional(S.String) },
) {}
export class InvalidRecordingGroupException extends S.TaggedError<InvalidRecordingGroupException>()(
  "InvalidRecordingGroupException",
  { message: S.optional(S.String) },
) {}
export class InvalidS3KeyPrefixException extends S.TaggedError<InvalidS3KeyPrefixException>()(
  "InvalidS3KeyPrefixException",
  { message: S.optional(S.String) },
) {}
export class OrganizationConformancePackTemplateValidationException extends S.TaggedError<OrganizationConformancePackTemplateValidationException>()(
  "OrganizationConformancePackTemplateValidationException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfConfigurationRecordersExceededException extends S.TaggedError<MaxNumberOfConfigurationRecordersExceededException>()(
  "MaxNumberOfConfigurationRecordersExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidS3KmsKeyArnException extends S.TaggedError<InvalidS3KmsKeyArnException>()(
  "InvalidS3KmsKeyArnException",
  { message: S.optional(S.String) },
) {}
export class InvalidSNSTopicARNException extends S.TaggedError<InvalidSNSTopicARNException>()(
  "InvalidSNSTopicARNException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfDeliveryChannelsExceededException extends S.TaggedError<MaxNumberOfDeliveryChannelsExceededException>()(
  "MaxNumberOfDeliveryChannelsExceededException",
  { message: S.optional(S.String) },
) {}
export class NoSuchBucketException extends S.TaggedError<NoSuchBucketException>()(
  "NoSuchBucketException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the authorization granted to the specified
 * configuration aggregator account in a specified region.
 */
export const deleteAggregationAuthorization: (
  input: DeleteAggregationAuthorizationRequest,
) => effect.Effect<
  DeleteAggregationAuthorizationResponse,
  InvalidParameterValueException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAggregationAuthorizationRequest,
  output: DeleteAggregationAuthorizationResponse,
  errors: [InvalidParameterValueException],
}));
/**
 * Deletes the specified configuration aggregator and the
 * aggregated data associated with the aggregator.
 */
export const deleteConfigurationAggregator: (
  input: DeleteConfigurationAggregatorRequest,
) => effect.Effect<
  DeleteConfigurationAggregatorResponse,
  NoSuchConfigurationAggregatorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationAggregatorRequest,
  output: DeleteConfigurationAggregatorResponse,
  errors: [NoSuchConfigurationAggregatorException],
}));
/**
 * Returns the details of one or more remediation configurations.
 */
export const describeRemediationConfigurations: (
  input: DescribeRemediationConfigurationsRequest,
) => effect.Effect<
  DescribeRemediationConfigurationsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRemediationConfigurationsRequest,
  output: DescribeRemediationConfigurationsResponse,
  errors: [],
}));
/**
 * Returns the evaluation results for the specified Amazon Web Services resource.
 * The results indicate which Config rules were used to evaluate
 * the resource, when each rule was last invoked, and whether the resource
 * complies with each rule.
 */
export const getComplianceDetailsByResource: {
  (
    input: GetComplianceDetailsByResourceRequest,
  ): effect.Effect<
    GetComplianceDetailsByResourceResponse,
    InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetComplianceDetailsByResourceRequest,
  ) => stream.Stream<
    GetComplianceDetailsByResourceResponse,
    InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetComplianceDetailsByResourceRequest,
  ) => stream.Stream<
    EvaluationResult,
    InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetComplianceDetailsByResourceRequest,
  output: GetComplianceDetailsByResourceResponse,
  errors: [InvalidParameterValueException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EvaluationResults",
  } as const,
}));
/**
 * Returns the policy definition containing the logic for your Config Custom Policy rule.
 */
export const getCustomRulePolicy: (
  input: GetCustomRulePolicyRequest,
) => effect.Effect<
  GetCustomRulePolicyResponse,
  NoSuchConfigRuleException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomRulePolicyRequest,
  output: GetCustomRulePolicyResponse,
  errors: [NoSuchConfigRuleException],
}));
/**
 * Add or updates the evaluations for process checks.
 * This API checks if the rule is a process check when the name of the Config rule is provided.
 */
export const putExternalEvaluation: (
  input: PutExternalEvaluationRequest,
) => effect.Effect<
  PutExternalEvaluationResponse,
  InvalidParameterValueException | NoSuchConfigRuleException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutExternalEvaluationRequest,
  output: PutExternalEvaluationResponse,
  errors: [InvalidParameterValueException, NoSuchConfigRuleException],
}));
/**
 * Deletes pending authorization requests for a specified
 * aggregator account in a specified region.
 */
export const deletePendingAggregationRequest: (
  input: DeletePendingAggregationRequestRequest,
) => effect.Effect<
  DeletePendingAggregationRequestResponse,
  InvalidParameterValueException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePendingAggregationRequestRequest,
  output: DeletePendingAggregationRequestResponse,
  errors: [InvalidParameterValueException],
}));
/**
 * Deletes the specified Config rule and all of its evaluation
 * results.
 *
 * Config sets the state of a rule to `DELETING`
 * until the deletion is complete. You cannot update a rule while it is
 * in this state. If you make a `PutConfigRule` or
 * `DeleteConfigRule` request for the rule, you will
 * receive a `ResourceInUseException`.
 *
 * You can check the state of a rule by using the
 * `DescribeConfigRules` request.
 *
 * **Recommendation: Consider excluding the `AWS::Config::ResourceCompliance` resource type from recording before deleting rules**
 *
 * Deleting rules creates configuration items (CIs) for `AWS::Config::ResourceCompliance`
 * that can affect your costs for the configuration recorder. If you are deleting rules which evaluate a large number of resource types,
 * this can lead to a spike in the number of CIs recorded.
 *
 * To avoid the associated costs, you can opt to disable recording
 * for the `AWS::Config::ResourceCompliance` resource type before deleting rules, and re-enable recording after the rules have been deleted.
 *
 * However, since deleting rules is an asynchronous process, it might take an hour or more to complete. During the time
 * when recording is disabled for `AWS::Config::ResourceCompliance`, rule evaluations will not be recorded in the associated resource’s history.
 */
export const deleteConfigRule: (
  input: DeleteConfigRuleRequest,
) => effect.Effect<
  DeleteConfigRuleResponse,
  NoSuchConfigRuleException | ResourceInUseException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigRuleRequest,
  output: DeleteConfigRuleResponse,
  errors: [NoSuchConfigRuleException, ResourceInUseException],
}));
/**
 * Deletes the customer managed configuration recorder.
 *
 * This operation does not delete the configuration information that
 * was previously recorded. You will be able to access the previously
 * recorded information by using the
 * GetResourceConfigHistory operation, but you will not
 * be able to access this information in the Config console until
 * you have created a new customer managed configuration recorder.
 */
export const deleteConfigurationRecorder: (
  input: DeleteConfigurationRecorderRequest,
) => effect.Effect<
  DeleteConfigurationRecorderResponse,
  | NoSuchConfigurationRecorderException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationRecorderRequest,
  output: DeleteConfigurationRecorderResponse,
  errors: [NoSuchConfigurationRecorderException, UnmodifiableEntityException],
}));
/**
 * Deletes the delivery channel.
 *
 * Before you can delete the delivery channel, you must stop the customer managed configuration recorder. You can use the StopConfigurationRecorder operation to stop the customer managed configuration recorder.
 */
export const deleteDeliveryChannel: (
  input: DeleteDeliveryChannelRequest,
) => effect.Effect<
  DeleteDeliveryChannelResponse,
  | LastDeliveryChannelDeleteFailedException
  | NoSuchDeliveryChannelException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeliveryChannelRequest,
  output: DeleteDeliveryChannelResponse,
  errors: [
    LastDeliveryChannelDeleteFailedException,
    NoSuchDeliveryChannelException,
  ],
}));
/**
 * Deletes the specified organization Config rule and all of its evaluation results from all member accounts in that organization.
 *
 * Only a management account and a delegated administrator account can delete an organization Config rule.
 * When calling this API with a delegated administrator, you must ensure Organizations
 * `ListDelegatedAdministrator` permissions are added.
 *
 * Config sets the state of a rule to DELETE_IN_PROGRESS until the deletion is complete.
 * You cannot update a rule while it is in this state.
 *
 * **Recommendation: Consider excluding the `AWS::Config::ResourceCompliance` resource type from recording before deleting rules**
 *
 * Deleting rules creates configuration items (CIs) for `AWS::Config::ResourceCompliance`
 * that can affect your costs for the configuration recorder. If you are deleting rules which evaluate a large number of resource types,
 * this can lead to a spike in the number of CIs recorded.
 *
 * To avoid the associated costs, you can opt to disable recording
 * for the `AWS::Config::ResourceCompliance` resource type before deleting rules, and re-enable recording after the rules have been deleted.
 *
 * However, since deleting rules is an asynchronous process, it might take an hour or more to complete. During the time
 * when recording is disabled for `AWS::Config::ResourceCompliance`, rule evaluations will not be recorded in the associated resource’s history.
 */
export const deleteOrganizationConfigRule: (
  input: DeleteOrganizationConfigRuleRequest,
) => effect.Effect<
  DeleteOrganizationConfigRuleResponse,
  | NoSuchOrganizationConfigRuleException
  | OrganizationAccessDeniedException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOrganizationConfigRuleRequest,
  output: DeleteOrganizationConfigRuleResponse,
  errors: [
    NoSuchOrganizationConfigRuleException,
    OrganizationAccessDeniedException,
    ResourceInUseException,
  ],
}));
/**
 * Records the configuration state for a custom resource that has been deleted. This API records a new ConfigurationItem with a ResourceDeleted status. You can retrieve the ConfigurationItems recorded for this resource in your Config History.
 */
export const deleteResourceConfig: (
  input: DeleteResourceConfigRequest,
) => effect.Effect<
  DeleteResourceConfigResponse,
  NoRunningConfigurationRecorderException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceConfigRequest,
  output: DeleteResourceConfigResponse,
  errors: [NoRunningConfigurationRecorderException, ValidationException],
}));
/**
 * Schedules delivery of a configuration snapshot to the Amazon S3
 * bucket in the specified delivery channel. After the delivery has
 * started, Config sends the following notifications using an
 * Amazon SNS topic that you have specified.
 *
 * - Notification of the start of the delivery.
 *
 * - Notification of the completion of the delivery, if the
 * delivery was successfully completed.
 *
 * - Notification of delivery failure, if the delivery
 * failed.
 */
export const deliverConfigSnapshot: (
  input: DeliverConfigSnapshotRequest,
) => effect.Effect<
  DeliverConfigSnapshotResponse,
  | NoAvailableConfigurationRecorderException
  | NoRunningConfigurationRecorderException
  | NoSuchDeliveryChannelException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeliverConfigSnapshotRequest,
  output: DeliverConfigSnapshotResponse,
  errors: [
    NoAvailableConfigurationRecorderException,
    NoRunningConfigurationRecorderException,
    NoSuchDeliveryChannelException,
  ],
}));
/**
 * Returns the current status of the configuration
 * recorder you specify as well as the status of the last recording event for the configuration recorders.
 *
 * For a detailed status of recording events over time, add your Config events to Amazon CloudWatch metrics and use CloudWatch metrics.
 *
 * If a configuration recorder is not specified, this operation returns the status for the customer managed configuration recorder configured for the
 * account, if applicable.
 *
 * When making a request to this operation, you can only specify one configuration recorder.
 */
export const describeConfigurationRecorderStatus: (
  input: DescribeConfigurationRecorderStatusRequest,
) => effect.Effect<
  DescribeConfigurationRecorderStatusResponse,
  NoSuchConfigurationRecorderException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigurationRecorderStatusRequest,
  output: DescribeConfigurationRecorderStatusResponse,
  errors: [NoSuchConfigurationRecorderException, ValidationException],
}));
/**
 * Returns the number of Config rules that are compliant and
 * noncompliant, up to a maximum of 25 for each.
 */
export const getComplianceSummaryByConfigRule: (
  input: GetComplianceSummaryByConfigRuleRequest,
) => effect.Effect<
  GetComplianceSummaryByConfigRuleResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComplianceSummaryByConfigRuleRequest,
  output: GetComplianceSummaryByConfigRuleResponse,
  errors: [],
}));
/**
 * Returns the number of resources that are compliant and the
 * number that are noncompliant. You can specify one or more resource
 * types to get these numbers for each resource type. The maximum
 * number returned is 100.
 */
export const getComplianceSummaryByResourceType: (
  input: GetComplianceSummaryByResourceTypeRequest,
) => effect.Effect<
  GetComplianceSummaryByResourceTypeResponse,
  InvalidParameterValueException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComplianceSummaryByResourceTypeRequest,
  output: GetComplianceSummaryByResourceTypeResponse,
  errors: [InvalidParameterValueException],
}));
/**
 * Returns a summary of resource evaluation for the specified resource evaluation ID from the proactive rules that were run.
 * The results indicate which evaluation context was used to evaluate the rules, which resource details were evaluated,
 * the evaluation mode that was run, and whether the resource details comply with the configuration of the proactive rules.
 *
 * To see additional information about the evaluation result, such as which rule flagged a resource as NON_COMPLIANT, use the GetComplianceDetailsByResource API.
 * For more information, see the Examples section.
 */
export const getResourceEvaluationSummary: (
  input: GetResourceEvaluationSummaryRequest,
) => effect.Effect<
  GetResourceEvaluationSummaryResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceEvaluationSummaryRequest,
  output: GetResourceEvaluationSummaryResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Authorizes the aggregator account and region to collect data
 * from the source account and region.
 *
 * **Tags are added at creation and cannot be updated with this operation**
 *
 * `PutAggregationAuthorization` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different `tags` values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, `tags` will not be updated, even if they are different.
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putAggregationAuthorization: (
  input: PutAggregationAuthorizationRequest,
) => effect.Effect<
  PutAggregationAuthorizationResponse,
  InvalidParameterValueException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAggregationAuthorizationRequest,
  output: PutAggregationAuthorizationResponse,
  errors: [InvalidParameterValueException],
}));
/**
 * A remediation exception is when a specified resource is no longer considered for auto-remediation.
 * This API adds a new exception or updates an existing exception for a specified resource with a specified Config rule.
 *
 * **Exceptions block auto remediation**
 *
 * Config generates a remediation exception when a problem occurs running a remediation action for a specified resource.
 * Remediation exceptions blocks auto-remediation until the exception is cleared.
 *
 * **Manual remediation is recommended when placing an exception**
 *
 * When placing an exception on an Amazon Web Services resource, it is recommended that remediation is set as manual remediation until
 * the given Config rule for the specified resource evaluates the resource as `NON_COMPLIANT`.
 * Once the resource has been evaluated as `NON_COMPLIANT`, you can add remediation exceptions and change the remediation type back from Manual to Auto if you want to use auto-remediation.
 * Otherwise, using auto-remediation before a `NON_COMPLIANT` evaluation result can delete resources before the exception is applied.
 *
 * **Exceptions can only be performed on non-compliant resources**
 *
 * Placing an exception can only be performed on resources that are `NON_COMPLIANT`.
 * If you use this API for `COMPLIANT` resources or resources that are `NOT_APPLICABLE`, a remediation exception will not be generated.
 * For more information on the conditions that initiate the possible Config evaluation results,
 * see Concepts | Config Rules in the *Config Developer Guide*.
 *
 * **Exceptions cannot be placed on service-linked remediation actions**
 *
 * You cannot place an exception on service-linked remediation actions, such as remediation actions put by an organizational conformance pack.
 *
 * **Auto remediation can be initiated even for compliant resources**
 *
 * If you enable auto remediation for a specific Config rule using the PutRemediationConfigurations API or the Config console,
 * it initiates the remediation process for all non-compliant resources for that specific rule.
 * The auto remediation process relies on the compliance data snapshot which is captured on a periodic basis.
 * Any non-compliant resource that is updated between the snapshot schedule will continue to be remediated based on the last known compliance data snapshot.
 *
 * This means that in some cases auto remediation can be initiated even for compliant resources, since the bootstrap processor uses a database that can have stale evaluation results based on the last known compliance data snapshot.
 */
export const putRemediationExceptions: (
  input: PutRemediationExceptionsRequest,
) => effect.Effect<
  PutRemediationExceptionsResponse,
  | InsufficientPermissionsException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRemediationExceptionsRequest,
  output: PutRemediationExceptionsResponse,
  errors: [InsufficientPermissionsException, InvalidParameterValueException],
}));
/**
 * Records the configuration state for the resource provided in the request.
 *
 * The configuration state of a resource is represented in Config as Configuration Items.
 * Once this API records the configuration item, you can retrieve the list of configuration items for the custom resource type using existing Config APIs.
 *
 * The custom resource type must be registered with CloudFormation. This API accepts the configuration item registered with CloudFormation.
 *
 * When you call this API, Config only stores configuration state of the resource provided in the request. This API does not change or remediate the configuration of the resource.
 *
 * Write-only schema properites are not recorded as part of the published configuration item.
 */
export const putResourceConfig: (
  input: PutResourceConfigRequest,
) => effect.Effect<
  PutResourceConfigResponse,
  | InsufficientPermissionsException
  | MaxActiveResourcesExceededException
  | NoRunningConfigurationRecorderException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourceConfigRequest,
  output: PutResourceConfigResponse,
  errors: [
    InsufficientPermissionsException,
    MaxActiveResourcesExceededException,
    NoRunningConfigurationRecorderException,
    ValidationException,
  ],
}));
/**
 * Creates and updates the retention configuration with details
 * about retention period (number of days) that Config stores your
 * historical information. The API creates the
 * `RetentionConfiguration` object and names the object
 * as **default**. When you have a
 * `RetentionConfiguration` object named **default**, calling the API modifies the
 * default object.
 *
 * Currently, Config supports only one retention
 * configuration per region in your account.
 */
export const putRetentionConfiguration: (
  input: PutRetentionConfigurationRequest,
) => effect.Effect<
  PutRetentionConfigurationResponse,
  | InvalidParameterValueException
  | MaxNumberOfRetentionConfigurationsExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRetentionConfigurationRequest,
  output: PutRetentionConfigurationResponse,
  errors: [
    InvalidParameterValueException,
    MaxNumberOfRetentionConfigurationsExceededException,
  ],
}));
/**
 * Deletes an existing service-linked configuration recorder.
 *
 * This operation does not delete the configuration information that was previously recorded. You will be able to access the previously
 * recorded information by using the
 * GetResourceConfigHistory operation, but you will not
 * be able to access this information in the Config console until
 * you have created a new service-linked configuration recorder for the same service.
 *
 * **The recording scope determines if you receive configuration items**
 *
 * The recording scope is set by the service that is linked to the configuration recorder and determines whether you receive configuration items (CIs) in the delivery channel. If the recording scope is internal, you will not receive CIs in the delivery channel.
 */
export const deleteServiceLinkedConfigurationRecorder: (
  input: DeleteServiceLinkedConfigurationRecorderRequest,
) => effect.Effect<
  DeleteServiceLinkedConfigurationRecorderResponse,
  | ConflictException
  | NoSuchConfigurationRecorderException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceLinkedConfigurationRecorderRequest,
  output: DeleteServiceLinkedConfigurationRecorderResponse,
  errors: [
    ConflictException,
    NoSuchConfigurationRecorderException,
    ValidationException,
  ],
}));
/**
 * Removes all resource types specified in the `ResourceTypes` list from the RecordingGroup of configuration recorder and excludes these resource types when recording.
 *
 * For this operation, the configuration recorder must use a RecordingStrategy that is either `INCLUSION_BY_RESOURCE_TYPES` or `EXCLUSION_BY_RESOURCE_TYPES`.
 */
export const disassociateResourceTypes: (
  input: DisassociateResourceTypesRequest,
) => effect.Effect<
  DisassociateResourceTypesResponse,
  | ConflictException
  | NoSuchConfigurationRecorderException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResourceTypesRequest,
  output: DisassociateResourceTypesResponse,
  errors: [
    ConflictException,
    NoSuchConfigurationRecorderException,
    ValidationException,
  ],
}));
/**
 * Deletes the retention configuration.
 */
export const deleteRetentionConfiguration: (
  input: DeleteRetentionConfigurationRequest,
) => effect.Effect<
  DeleteRetentionConfigurationResponse,
  | InvalidParameterValueException
  | NoSuchRetentionConfigurationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRetentionConfigurationRequest,
  output: DeleteRetentionConfigurationResponse,
  errors: [
    InvalidParameterValueException,
    NoSuchRetentionConfigurationException,
  ],
}));
/**
 * Runs an on-demand evaluation for the specified Config rules
 * against the last known configuration state of the resources. Use
 * `StartConfigRulesEvaluation` when you want to test
 * that a rule you updated is working as expected.
 * `StartConfigRulesEvaluation` does not re-record the
 * latest configuration state for your resources. It re-runs an
 * evaluation against the last known state of your resources.
 *
 * You can specify up to 25 Config rules per request.
 *
 * An existing `StartConfigRulesEvaluation` call for
 * the specified rules must complete before you can call the API again.
 * If you chose to have Config stream to an Amazon SNS topic, you
 * will receive a `ConfigRuleEvaluationStarted` notification
 * when the evaluation starts.
 *
 * You don't need to call the
 * `StartConfigRulesEvaluation` API to run an
 * evaluation for a new rule. When you create a rule, Config
 * evaluates your resources against the rule automatically.
 *
 * The `StartConfigRulesEvaluation` API is useful if
 * you want to run on-demand evaluations, such as the following
 * example:
 *
 * - You have a custom rule that evaluates your IAM
 * resources every 24 hours.
 *
 * - You update your Lambda function to add additional
 * conditions to your rule.
 *
 * - Instead of waiting for the next periodic evaluation,
 * you call the `StartConfigRulesEvaluation`
 * API.
 *
 * - Config invokes your Lambda function and evaluates
 * your IAM resources.
 *
 * - Your custom rule will still run periodic evaluations
 * every 24 hours.
 */
export const startConfigRulesEvaluation: (
  input: StartConfigRulesEvaluationRequest,
) => effect.Effect<
  StartConfigRulesEvaluationResponse,
  | InvalidParameterValueException
  | LimitExceededException
  | NoSuchConfigRuleException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartConfigRulesEvaluationRequest,
  output: StartConfigRulesEvaluationResponse,
  errors: [
    InvalidParameterValueException,
    LimitExceededException,
    NoSuchConfigRuleException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes the specified conformance pack and all the Config rules, remediation actions, and all evaluation results within that
 * conformance pack.
 *
 * Config sets the conformance pack to `DELETE_IN_PROGRESS` until the deletion is complete.
 * You cannot update a conformance pack while it is in this state.
 *
 * **Recommendation: Consider excluding the `AWS::Config::ResourceCompliance` resource type from recording before deleting rules**
 *
 * Deleting rules creates configuration items (CIs) for `AWS::Config::ResourceCompliance`
 * that can affect your costs for the configuration recorder. If you are deleting rules which evaluate a large number of resource types,
 * this can lead to a spike in the number of CIs recorded.
 *
 * To avoid the associated costs, you can opt to disable recording
 * for the `AWS::Config::ResourceCompliance` resource type before deleting rules, and re-enable recording after the rules have been deleted.
 *
 * However, since deleting rules is an asynchronous process, it might take an hour or more to complete. During the time
 * when recording is disabled for `AWS::Config::ResourceCompliance`, rule evaluations will not be recorded in the associated resource’s history.
 */
export const deleteConformancePack: (
  input: DeleteConformancePackRequest,
) => effect.Effect<
  DeleteConformancePackResponse,
  NoSuchConformancePackException | ResourceInUseException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConformancePackRequest,
  output: DeleteConformancePackResponse,
  errors: [NoSuchConformancePackException, ResourceInUseException],
}));
/**
 * Deletes the evaluation results for the specified Config
 * rule. You can specify one Config rule per request. After you
 * delete the evaluation results, you can call the StartConfigRulesEvaluation API to start evaluating
 * your Amazon Web Services resources against the rule.
 */
export const deleteEvaluationResults: (
  input: DeleteEvaluationResultsRequest,
) => effect.Effect<
  DeleteEvaluationResultsResponse,
  NoSuchConfigRuleException | ResourceInUseException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEvaluationResultsRequest,
  output: DeleteEvaluationResultsResponse,
  errors: [NoSuchConfigRuleException, ResourceInUseException],
}));
/**
 * Starts the customer managed configuration recorder. The customer managed configuration recorder will begin recording configuration changes for the resource types you specify.
 *
 * You must have created a delivery channel to
 * successfully start the customer managed configuration recorder. You can use the PutDeliveryChannel operation to create a delivery channel.
 */
export const startConfigurationRecorder: (
  input: StartConfigurationRecorderRequest,
) => effect.Effect<
  StartConfigurationRecorderResponse,
  | NoAvailableDeliveryChannelException
  | NoSuchConfigurationRecorderException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartConfigurationRecorderRequest,
  output: StartConfigurationRecorderResponse,
  errors: [
    NoAvailableDeliveryChannelException,
    NoSuchConfigurationRecorderException,
    UnmodifiableEntityException,
  ],
}));
/**
 * Stops the customer managed configuration recorder. The customer managed configuration recorder will stop recording configuration changes for the resource types you have specified.
 */
export const stopConfigurationRecorder: (
  input: StopConfigurationRecorderRequest,
) => effect.Effect<
  StopConfigurationRecorderResponse,
  | NoSuchConfigurationRecorderException
  | UnmodifiableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopConfigurationRecorderRequest,
  output: StopConfigurationRecorderResponse,
  errors: [NoSuchConfigurationRecorderException, UnmodifiableEntityException],
}));
/**
 * Returns details about the specified delivery channel. If a
 * delivery channel is not specified, this operation returns the details
 * of all delivery channels associated with the account.
 *
 * Currently, you can specify only one delivery channel per
 * region in your account.
 */
export const describeDeliveryChannels: (
  input: DescribeDeliveryChannelsRequest,
) => effect.Effect<
  DescribeDeliveryChannelsResponse,
  NoSuchDeliveryChannelException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeliveryChannelsRequest,
  output: DescribeDeliveryChannelsResponse,
  errors: [NoSuchDeliveryChannelException],
}));
/**
 * Deletes the specified organization conformance pack and all of the Config rules and remediation actions from
 * all member accounts in that organization.
 *
 * Only a management account or a delegated administrator account can delete an organization conformance pack.
 * When calling this API with a delegated administrator, you must ensure Organizations
 * `ListDelegatedAdministrator` permissions are added.
 *
 * Config sets the state of a conformance pack to DELETE_IN_PROGRESS until the deletion is complete.
 * You cannot update a conformance pack while it is in this state.
 *
 * **Recommendation: Consider excluding the `AWS::Config::ResourceCompliance` resource type from recording before deleting rules**
 *
 * Deleting rules creates configuration items (CIs) for `AWS::Config::ResourceCompliance`
 * that can affect your costs for the configuration recorder. If you are deleting rules which evaluate a large number of resource types,
 * this can lead to a spike in the number of CIs recorded.
 *
 * To avoid the associated costs, you can opt to disable recording
 * for the `AWS::Config::ResourceCompliance` resource type before deleting rules, and re-enable recording after the rules have been deleted.
 *
 * However, since deleting rules is an asynchronous process, it might take an hour or more to complete. During the time
 * when recording is disabled for `AWS::Config::ResourceCompliance`, rule evaluations will not be recorded in the associated resource’s history.
 */
export const deleteOrganizationConformancePack: (
  input: DeleteOrganizationConformancePackRequest,
) => effect.Effect<
  DeleteOrganizationConformancePackResponse,
  | NoSuchOrganizationConformancePackException
  | OrganizationAccessDeniedException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOrganizationConformancePackRequest,
  output: DeleteOrganizationConformancePackResponse,
  errors: [
    NoSuchOrganizationConformancePackException,
    OrganizationAccessDeniedException,
    ResourceInUseException,
  ],
}));
/**
 * Returns the policy definition containing the logic for your organization Config Custom Policy rule.
 */
export const getOrganizationCustomRulePolicy: (
  input: GetOrganizationCustomRulePolicyRequest,
) => effect.Effect<
  GetOrganizationCustomRulePolicyResponse,
  | NoSuchOrganizationConfigRuleException
  | OrganizationAccessDeniedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOrganizationCustomRulePolicyRequest,
  output: GetOrganizationCustomRulePolicyResponse,
  errors: [
    NoSuchOrganizationConfigRuleException,
    OrganizationAccessDeniedException,
  ],
}));
/**
 * Runs an on-demand remediation for the specified Config rules against the last known remediation configuration. It runs an execution against the current state of your resources. Remediation execution is asynchronous.
 *
 * You can specify up to 100 resource keys per request. An existing StartRemediationExecution call for the specified resource keys must complete before you can call the API again.
 */
export const startRemediationExecution: (
  input: StartRemediationExecutionRequest,
) => effect.Effect<
  StartRemediationExecutionResponse,
  | InsufficientPermissionsException
  | InvalidParameterValueException
  | NoSuchRemediationConfigurationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRemediationExecutionRequest,
  output: StartRemediationExecutionResponse,
  errors: [
    InsufficientPermissionsException,
    InvalidParameterValueException,
    NoSuchRemediationConfigurationException,
  ],
}));
/**
 * Deletes the stored query for a single Amazon Web Services account and a single Amazon Web Services Region.
 */
export const deleteStoredQuery: (
  input: DeleteStoredQueryRequest,
) => effect.Effect<
  DeleteStoredQueryResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStoredQueryRequest,
  output: DeleteStoredQueryResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns details for the configuration recorder you specify.
 *
 * If a configuration recorder is not specified, this operation returns details for the customer managed configuration recorder configured for the
 * account, if applicable.
 *
 * When making a request to this operation, you can only specify one configuration recorder.
 */
export const describeConfigurationRecorders: (
  input: DescribeConfigurationRecordersRequest,
) => effect.Effect<
  DescribeConfigurationRecordersResponse,
  NoSuchConfigurationRecorderException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigurationRecordersRequest,
  output: DescribeConfigurationRecordersResponse,
  errors: [NoSuchConfigurationRecorderException, ValidationException],
}));
/**
 * Returns the details of a specific stored query.
 */
export const getStoredQuery: (
  input: GetStoredQueryRequest,
) => effect.Effect<
  GetStoredQueryResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStoredQueryRequest,
  output: GetStoredQueryResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes specified tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds all resource types specified in the `ResourceTypes` list to the RecordingGroup of specified configuration recorder and includes those resource types when recording.
 *
 * For this operation, the specified configuration recorder must use a RecordingStrategy that is either `INCLUSION_BY_RESOURCE_TYPES` or `EXCLUSION_BY_RESOURCE_TYPES`.
 */
export const associateResourceTypes: (
  input: AssociateResourceTypesRequest,
) => effect.Effect<
  AssociateResourceTypesResponse,
  | ConflictException
  | NoSuchConfigurationRecorderException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResourceTypesRequest,
  output: AssociateResourceTypesResponse,
  errors: [
    ConflictException,
    NoSuchConfigurationRecorderException,
    ValidationException,
  ],
}));
/**
 * Associates the specified tags to a resource with the specified `ResourceArn`. If existing tags on a resource are not specified in the request parameters, they are not changed.
 * If existing tags are specified, however, then their values will be updated. When a resource is deleted, the tags associated with that resource are deleted as well.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ResourceNotFoundException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Returns the `BaseConfigurationItem` for one or more requested resources.
 * The operation also returns a list of resources that are
 * not processed in the current request. If there are no unprocessed
 * resources, the operation returns an empty unprocessedResourceKeys
 * list.
 *
 * - The API does not return results for deleted
 * resources.
 *
 * - The API does not return any tags for the requested
 * resources. This information is filtered out of the
 * supplementaryConfiguration section of the API
 * response.
 */
export const batchGetResourceConfig: (
  input: BatchGetResourceConfigRequest,
) => effect.Effect<
  BatchGetResourceConfigResponse,
  | NoAvailableConfigurationRecorderException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetResourceConfigRequest,
  output: BatchGetResourceConfigResponse,
  errors: [NoAvailableConfigurationRecorderException, ValidationException],
}));
/**
 * Creates a service-linked configuration recorder that is linked to a specific Amazon Web Services service based on the `ServicePrincipal` you specify.
 *
 * The configuration recorder's `name`, `recordingGroup`, `recordingMode`, and `recordingScope` is set by the service that is linked to the configuration recorder.
 *
 * For more information and a list of supported services/service principals, see
 * **Working with the Configuration Recorder**
 * in the *Config Developer Guide*.
 *
 * This API creates a service-linked role `AWSServiceRoleForConfig` in your account. The service-linked role is created only when the role does not exist in your account.
 *
 * **The recording scope determines if you receive configuration items**
 *
 * The recording scope is set by the service that is linked to the configuration recorder and determines whether you receive configuration items (CIs) in the delivery channel. If the recording scope is internal, you will not receive CIs in the delivery channel.
 *
 * **Tags are added at creation and cannot be updated with this operation**
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putServiceLinkedConfigurationRecorder: (
  input: PutServiceLinkedConfigurationRecorderRequest,
) => effect.Effect<
  PutServiceLinkedConfigurationRecorderResponse,
  | ConflictException
  | InsufficientPermissionsException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutServiceLinkedConfigurationRecorderRequest,
  output: PutServiceLinkedConfigurationRecorderResponse,
  errors: [
    ConflictException,
    InsufficientPermissionsException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Returns the current configuration items for resources that are present in your Config aggregator. The operation also returns a list of resources that are not processed in the current request.
 * If there are no unprocessed resources, the operation returns an empty `unprocessedResourceIdentifiers` list.
 *
 * - The API does not return results for deleted resources.
 *
 * - The API does not return tags and relationships.
 */
export const batchGetAggregateResourceConfig: (
  input: BatchGetAggregateResourceConfigRequest,
) => effect.Effect<
  BatchGetAggregateResourceConfigResponse,
  NoSuchConfigurationAggregatorException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetAggregateResourceConfigRequest,
  output: BatchGetAggregateResourceConfigResponse,
  errors: [NoSuchConfigurationAggregatorException, ValidationException],
}));
/**
 * Deletes the remediation configuration.
 */
export const deleteRemediationConfiguration: (
  input: DeleteRemediationConfigurationRequest,
) => effect.Effect<
  DeleteRemediationConfigurationResponse,
  | InsufficientPermissionsException
  | InvalidParameterValueException
  | NoSuchRemediationConfigurationException
  | RemediationInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRemediationConfigurationRequest,
  output: DeleteRemediationConfigurationResponse,
  errors: [
    InsufficientPermissionsException,
    InvalidParameterValueException,
    NoSuchRemediationConfigurationException,
    RemediationInProgressException,
  ],
}));
/**
 * Indicates whether the specified Amazon Web Services resources are compliant. If
 * a resource is noncompliant, this operation returns the number of Config rules that the resource does not comply with.
 *
 * A resource is compliant if it complies with all the Config
 * rules that evaluate it. It is noncompliant if it does not comply
 * with one or more of these rules.
 *
 * If Config has no current evaluation results for the
 * resource, it returns `INSUFFICIENT_DATA`. This result
 * might indicate one of the following conditions about the rules that
 * evaluate the resource:
 *
 * - Config has never invoked an evaluation for the
 * rule. To check whether it has, use the
 * `DescribeConfigRuleEvaluationStatus` action
 * to get the `LastSuccessfulInvocationTime` and
 * `LastFailedInvocationTime`.
 *
 * - The rule's Lambda function is failing to send
 * evaluation results to Config. Verify that the role that
 * you assigned to your configuration recorder includes the
 * `config:PutEvaluations` permission. If the
 * rule is a custom rule, verify that the Lambda execution
 * role includes the `config:PutEvaluations`
 * permission.
 *
 * - The rule's Lambda function has returned
 * `NOT_APPLICABLE` for all evaluation results.
 * This can occur if the resources were deleted or removed from
 * the rule's scope.
 */
export const describeComplianceByResource: {
  (
    input: DescribeComplianceByResourceRequest,
  ): effect.Effect<
    DescribeComplianceByResourceResponse,
    InvalidNextTokenException | InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeComplianceByResourceRequest,
  ) => stream.Stream<
    DescribeComplianceByResourceResponse,
    InvalidNextTokenException | InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeComplianceByResourceRequest,
  ) => stream.Stream<
    ComplianceByResource,
    InvalidNextTokenException | InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeComplianceByResourceRequest,
  output: DescribeComplianceByResourceResponse,
  errors: [InvalidNextTokenException, InvalidParameterValueException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ComplianceByResources",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the current status of the specified delivery channel.
 * If a delivery channel is not specified, this operation returns the
 * current status of all delivery channels associated with the
 * account.
 *
 * Currently, you can specify only one delivery channel per
 * region in your account.
 */
export const describeDeliveryChannelStatus: (
  input: DescribeDeliveryChannelStatusRequest,
) => effect.Effect<
  DescribeDeliveryChannelStatusResponse,
  NoSuchDeliveryChannelException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeliveryChannelStatusRequest,
  output: DescribeDeliveryChannelStatusResponse,
  errors: [NoSuchDeliveryChannelException],
}));
/**
 * Returns a list of organization Config rules.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 *
 * Limit and next token are not applicable if you specify organization Config rule names.
 * It is only applicable, when you request all the organization Config rules.
 *
 * *For accounts within an organization*
 *
 * If you deploy an organizational rule or conformance pack in an organization
 * administrator account, and then establish a delegated administrator and deploy an
 * organizational rule or conformance pack in the delegated administrator account, you
 * won't be able to see the organizational rule or conformance pack in the organization
 * administrator account from the delegated administrator account or see the organizational
 * rule or conformance pack in the delegated administrator account from organization
 * administrator account. The `DescribeOrganizationConfigRules` and
 * `DescribeOrganizationConformancePacks` APIs can only see and interact with
 * the organization-related resource that were deployed from within the account calling
 * those APIs.
 */
export const describeOrganizationConfigRules: {
  (
    input: DescribeOrganizationConfigRulesRequest,
  ): effect.Effect<
    DescribeOrganizationConfigRulesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrganizationConfigRulesRequest,
  ) => stream.Stream<
    DescribeOrganizationConfigRulesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrganizationConfigRulesRequest,
  ) => stream.Stream<
    OrganizationConfigRule,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOrganizationConfigRulesRequest,
  output: DescribeOrganizationConfigRulesResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchOrganizationConfigRuleException,
    OrganizationAccessDeniedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OrganizationConfigRules",
    pageSize: "Limit",
  } as const,
}));
/**
 * Provides a detailed view of a Remediation Execution for a set of resources including state, timestamps for when steps for the remediation execution occur, and any error messages for steps that have failed.
 * When you specify the limit and the next token, you receive a paginated response.
 */
export const describeRemediationExecutionStatus: {
  (
    input: DescribeRemediationExecutionStatusRequest,
  ): effect.Effect<
    DescribeRemediationExecutionStatusResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchRemediationConfigurationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRemediationExecutionStatusRequest,
  ) => stream.Stream<
    DescribeRemediationExecutionStatusResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchRemediationConfigurationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRemediationExecutionStatusRequest,
  ) => stream.Stream<
    RemediationExecutionStatus,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchRemediationConfigurationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRemediationExecutionStatusRequest,
  output: DescribeRemediationExecutionStatusResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchRemediationConfigurationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RemediationExecutionStatuses",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the number of compliant and noncompliant rules for one
 * or more accounts and regions in an aggregator.
 *
 * The results can return an empty result page, but if you
 * have a nextToken, the results are displayed on the next
 * page.
 */
export const getAggregateConfigRuleComplianceSummary: {
  (
    input: GetAggregateConfigRuleComplianceSummaryRequest,
  ): effect.Effect<
    GetAggregateConfigRuleComplianceSummaryResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAggregateConfigRuleComplianceSummaryRequest,
  ) => stream.Stream<
    GetAggregateConfigRuleComplianceSummaryResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAggregateConfigRuleComplianceSummaryRequest,
  ) => stream.Stream<
    unknown,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAggregateConfigRuleComplianceSummaryRequest,
  output: GetAggregateConfigRuleComplianceSummaryResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConfigurationAggregatorException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the resource counts across accounts and regions that are present in your Config aggregator. You can request the resource counts by providing filters and GroupByKey.
 *
 * For example, if the input contains accountID 12345678910 and region us-east-1 in filters, the API returns the count of resources in account ID 12345678910 and region us-east-1.
 * If the input contains ACCOUNT_ID as a GroupByKey, the API returns resource counts for all source accounts that are present in your aggregator.
 */
export const getAggregateDiscoveredResourceCounts: {
  (
    input: GetAggregateDiscoveredResourceCountsRequest,
  ): effect.Effect<
    GetAggregateDiscoveredResourceCountsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAggregateDiscoveredResourceCountsRequest,
  ) => stream.Stream<
    GetAggregateDiscoveredResourceCountsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAggregateDiscoveredResourceCountsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAggregateDiscoveredResourceCountsRequest,
  output: GetAggregateDiscoveredResourceCountsResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConfigurationAggregatorException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns detailed status for each member account within an organization for a given organization Config rule.
 */
export const getOrganizationConfigRuleDetailedStatus: {
  (
    input: GetOrganizationConfigRuleDetailedStatusRequest,
  ): effect.Effect<
    GetOrganizationConfigRuleDetailedStatusResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetOrganizationConfigRuleDetailedStatusRequest,
  ) => stream.Stream<
    GetOrganizationConfigRuleDetailedStatusResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetOrganizationConfigRuleDetailedStatusRequest,
  ) => stream.Stream<
    MemberAccountStatus,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetOrganizationConfigRuleDetailedStatusRequest,
  output: GetOrganizationConfigRuleDetailedStatusResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchOrganizationConfigRuleException,
    OrganizationAccessDeniedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OrganizationConfigRuleDetailedStatus",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns detailed status for each member account within an organization for a given organization conformance pack.
 */
export const getOrganizationConformancePackDetailedStatus: {
  (
    input: GetOrganizationConformancePackDetailedStatusRequest,
  ): effect.Effect<
    GetOrganizationConformancePackDetailedStatusResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetOrganizationConformancePackDetailedStatusRequest,
  ) => stream.Stream<
    GetOrganizationConformancePackDetailedStatusResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetOrganizationConformancePackDetailedStatusRequest,
  ) => stream.Stream<
    OrganizationConformancePackDetailedStatus,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetOrganizationConformancePackDetailedStatusRequest,
  output: GetOrganizationConformancePackDetailedStatusResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchOrganizationConformancePackException,
    OrganizationAccessDeniedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OrganizationConformancePackDetailedStatuses",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a list of configuration recorders depending on the filters you specify.
 */
export const listConfigurationRecorders: {
  (
    input: ListConfigurationRecordersRequest,
  ): effect.Effect<
    ListConfigurationRecordersResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationRecordersRequest,
  ) => stream.Stream<
    ListConfigurationRecordersResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationRecordersRequest,
  ) => stream.Stream<
    ConfigurationRecorderSummary,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationRecordersRequest,
  output: ListConfigurationRecordersResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigurationRecorderSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of conformance pack compliance scores.
 * A compliance score is the percentage of the number of compliant rule-resource combinations in a conformance pack compared to the number of total possible rule-resource combinations in the conformance pack.
 * This metric provides you with a high-level view of the compliance state of your conformance packs. You can use it to identify, investigate, and understand
 * the level of compliance in your conformance packs.
 *
 * Conformance packs with no evaluation results will have a compliance score of `INSUFFICIENT_DATA`.
 */
export const listConformancePackComplianceScores: {
  (
    input: ListConformancePackComplianceScoresRequest,
  ): effect.Effect<
    ListConformancePackComplianceScoresResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConformancePackComplianceScoresRequest,
  ) => stream.Stream<
    ListConformancePackComplianceScoresResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConformancePackComplianceScoresRequest,
  ) => stream.Stream<
    unknown,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConformancePackComplianceScoresRequest,
  output: ListConformancePackComplianceScoresResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Used by an Lambda function to deliver evaluation results to
 * Config. This operation is required in every Lambda function
 * that is invoked by an Config rule.
 */
export const putEvaluations: (
  input: PutEvaluationsRequest,
) => effect.Effect<
  PutEvaluationsResponse,
  | InvalidParameterValueException
  | InvalidResultTokenException
  | NoSuchConfigRuleException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEvaluationsRequest,
  output: PutEvaluationsResponse,
  errors: [
    InvalidParameterValueException,
    InvalidResultTokenException,
    NoSuchConfigRuleException,
  ],
}));
/**
 * Saves a new query or updates an existing saved query. The `QueryName` must be unique for a single Amazon Web Services account and a single Amazon Web Services Region.
 * You can create upto 300 queries in a single Amazon Web Services account and a single Amazon Web Services Region.
 *
 * **Tags are added at creation and cannot be updated**
 *
 * `PutStoredQuery` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different `tags` values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, `tags` will not be updated, even if they are different.
 */
export const putStoredQuery: (
  input: PutStoredQueryRequest,
) => effect.Effect<
  PutStoredQueryResponse,
  | ResourceConcurrentModificationException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutStoredQueryRequest,
  output: PutStoredQueryResponse,
  errors: [
    ResourceConcurrentModificationException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Accepts a structured query language (SQL) SELECT command and an aggregator to query configuration state of Amazon Web Services resources across multiple accounts and regions,
 * performs the corresponding search, and returns resource configurations matching the properties.
 *
 * For more information about query components, see the
 *
 * **Query Components**
 * section in the *Config Developer Guide*.
 *
 * If you run an aggregation query (i.e., using `GROUP BY` or using aggregate functions such as `COUNT`; e.g., `SELECT resourceId, COUNT(*) WHERE resourceType = 'AWS::IAM::Role' GROUP BY resourceId`)
 * and do not specify the `MaxResults` or the `Limit` query parameters, the default page size is set to 500.
 *
 * If you run a non-aggregation query (i.e., not using `GROUP BY` or aggregate function; e.g., `SELECT * WHERE resourceType = 'AWS::IAM::Role'`)
 * and do not specify the `MaxResults` or the `Limit` query parameters, the default page size is set to 25.
 */
export const selectAggregateResourceConfig: {
  (
    input: SelectAggregateResourceConfigRequest,
  ): effect.Effect<
    SelectAggregateResourceConfigResponse,
    | InvalidExpressionException
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SelectAggregateResourceConfigRequest,
  ) => stream.Stream<
    SelectAggregateResourceConfigResponse,
    | InvalidExpressionException
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SelectAggregateResourceConfigRequest,
  ) => stream.Stream<
    string,
    | InvalidExpressionException
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SelectAggregateResourceConfigRequest,
  output: SelectAggregateResourceConfigResponse,
  errors: [
    InvalidExpressionException,
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConfigurationAggregatorException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Results",
    pageSize: "Limit",
  } as const,
}));
/**
 * Runs an on-demand evaluation for the specified resource to determine whether the resource details will comply with configured Config rules.
 * You can also use it for evaluation purposes. Config recommends using an evaluation context. It runs an execution against the resource details with all
 * of the Config rules in your account that match with the specified proactive mode and resource type.
 *
 * Ensure you have the `cloudformation:DescribeType` role setup to validate the resource type schema.
 *
 * You can find the
 * Resource type schema in "*Amazon Web Services public extensions*" within the CloudFormation registry or with the following CLI commmand:
 * `aws cloudformation describe-type --type-name "AWS::S3::Bucket" --type RESOURCE`.
 *
 * For more information, see Managing extensions through the CloudFormation registry
 * and Amazon Web Services resource and property types reference in the CloudFormation User Guide.
 */
export const startResourceEvaluation: (
  input: StartResourceEvaluationRequest,
) => effect.Effect<
  StartResourceEvaluationResponse,
  IdempotentParameterMismatch | InvalidParameterValueException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartResourceEvaluationRequest,
  output: StartResourceEvaluationResponse,
  errors: [IdempotentParameterMismatch, InvalidParameterValueException],
}));
/**
 * Returns status information for each of your Config managed rules. The status includes information such as the last time Config invoked the rule, the last time Config failed to invoke
 * the rule, and the related error for the last failure.
 */
export const describeConfigRuleEvaluationStatus: {
  (
    input: DescribeConfigRuleEvaluationStatusRequest,
  ): effect.Effect<
    DescribeConfigRuleEvaluationStatusResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConfigRuleEvaluationStatusRequest,
  ) => stream.Stream<
    DescribeConfigRuleEvaluationStatusResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConfigRuleEvaluationStatusRequest,
  ) => stream.Stream<
    ConfigRuleEvaluationStatus,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConfigRuleEvaluationStatusRequest,
  output: DescribeConfigRuleEvaluationStatusResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigRuleException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigRulesEvaluationStatus",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns details about your Config rules.
 */
export const describeConfigRules: {
  (
    input: DescribeConfigRulesRequest,
  ): effect.Effect<
    DescribeConfigRulesResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConfigRulesRequest,
  ) => stream.Stream<
    DescribeConfigRulesResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConfigRulesRequest,
  ) => stream.Stream<
    ConfigRule,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConfigRulesRequest,
  output: DescribeConfigRulesResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigRuleException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigRules",
  } as const,
}));
/**
 * Returns the details of one or more remediation exceptions. A detailed view of a remediation exception for a set of resources that includes an explanation of an exception and the time when the exception will be deleted.
 * When you specify the limit and the next token, you receive a paginated response.
 *
 * Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource.
 * Remediation exceptions blocks auto-remediation until the exception is cleared.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 *
 * Limit and next token are not applicable if you request resources in batch. It is only applicable, when you request all resources.
 */
export const describeRemediationExceptions: {
  (
    input: DescribeRemediationExceptionsRequest,
  ): effect.Effect<
    DescribeRemediationExceptionsResponse,
    InvalidNextTokenException | InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRemediationExceptionsRequest,
  ) => stream.Stream<
    DescribeRemediationExceptionsResponse,
    InvalidNextTokenException | InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRemediationExceptionsRequest,
  ) => stream.Stream<
    unknown,
    InvalidNextTokenException | InvalidParameterValueException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRemediationExceptionsRequest,
  output: DescribeRemediationExceptionsResponse,
  errors: [InvalidNextTokenException, InvalidParameterValueException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the details of one or more retention configurations. If
 * the retention configuration name is not specified, this operation
 * returns the details for all the retention configurations for that
 * account.
 *
 * Currently, Config supports only one retention
 * configuration per region in your account.
 */
export const describeRetentionConfigurations: {
  (
    input: DescribeRetentionConfigurationsRequest,
  ): effect.Effect<
    DescribeRetentionConfigurationsResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchRetentionConfigurationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRetentionConfigurationsRequest,
  ) => stream.Stream<
    DescribeRetentionConfigurationsResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchRetentionConfigurationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRetentionConfigurationsRequest,
  ) => stream.Stream<
    RetentionConfiguration,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchRetentionConfigurationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRetentionConfigurationsRequest,
  output: DescribeRetentionConfigurationsResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchRetentionConfigurationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RetentionConfigurations",
  } as const,
}));
/**
 * Returns the evaluation results for the specified Config
 * rule. The results indicate which Amazon Web Services resources were evaluated by the
 * rule, when each resource was last evaluated, and whether each
 * resource complies with the rule.
 */
export const getComplianceDetailsByConfigRule: {
  (
    input: GetComplianceDetailsByConfigRuleRequest,
  ): effect.Effect<
    GetComplianceDetailsByConfigRuleResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetComplianceDetailsByConfigRuleRequest,
  ) => stream.Stream<
    GetComplianceDetailsByConfigRuleResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetComplianceDetailsByConfigRuleRequest,
  ) => stream.Stream<
    EvaluationResult,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetComplianceDetailsByConfigRuleRequest,
  output: GetComplianceDetailsByConfigRuleResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigRuleException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EvaluationResults",
    pageSize: "Limit",
  } as const,
}));
/**
 * Accepts a resource type and returns a list of resource identifiers that are aggregated for a specific resource type across accounts and regions.
 * A resource identifier includes the resource type, ID, (if available) the custom resource name, source account, and source region.
 * You can narrow the results to include only resources that have specific resource IDs, or a resource name, or source account ID, or source region.
 *
 * For example, if the input consists of accountID 12345678910 and the region is us-east-1 for resource type `AWS::EC2::Instance` then the API returns all the EC2 instance identifiers of accountID 12345678910 and region us-east-1.
 */
export const listAggregateDiscoveredResources: {
  (
    input: ListAggregateDiscoveredResourcesRequest,
  ): effect.Effect<
    ListAggregateDiscoveredResourcesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAggregateDiscoveredResourcesRequest,
  ) => stream.Stream<
    ListAggregateDiscoveredResourcesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAggregateDiscoveredResourcesRequest,
  ) => stream.Stream<
    AggregateResourceIdentifier,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAggregateDiscoveredResourcesRequest,
  output: ListAggregateDiscoveredResourcesResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConfigurationAggregatorException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceIdentifiers",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a list of resource
 * resource identifiers for the specified resource types for the resources of that type. A *resource identifier*
 * includes the resource type, ID, and (if available) the custom
 * resource name.
 *
 * The results consist of resources that Config has
 * *discovered*, including those that Config is not currently
 * recording. You can narrow the results to include only resources that
 * have specific resource IDs or a resource name.
 *
 * You can specify either resource IDs or a resource name, but
 * not both, in the same request.
 *
 * *CloudFormation stack recording behavior in Config*
 *
 * When a CloudFormation stack fails to create (for example, it enters the `ROLLBACK_FAILED` state),
 * Config does not record a configuration item (CI) for that stack. Configuration items are only recorded for stacks that reach
 * the following states:
 *
 * - `CREATE_COMPLETE`
 *
 * - `UPDATE_COMPLETE`
 *
 * - `UPDATE_ROLLBACK_COMPLETE`
 *
 * - `UPDATE_ROLLBACK_FAILED`
 *
 * - `DELETE_FAILED`
 *
 * - `DELETE_COMPLETE`
 *
 * Because no CI is created for a failed stack creation, you won't see configuration history
 * for that stack in Config, even after the stack is deleted. This helps make sure that Config only
 * tracks resources that were successfully provisioned.
 */
export const listDiscoveredResources: {
  (
    input: ListDiscoveredResourcesRequest,
  ): effect.Effect<
    ListDiscoveredResourcesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoAvailableConfigurationRecorderException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDiscoveredResourcesRequest,
  ) => stream.Stream<
    ListDiscoveredResourcesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoAvailableConfigurationRecorderException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDiscoveredResourcesRequest,
  ) => stream.Stream<
    ResourceIdentifier,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoAvailableConfigurationRecorderException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDiscoveredResourcesRequest,
  output: ListDiscoveredResourcesResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoAvailableConfigurationRecorderException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resourceIdentifiers",
    pageSize: "limit",
  } as const,
}));
/**
 * Lists the stored queries for a single Amazon Web Services account and a single Amazon Web Services Region. The default is 100.
 */
export const listStoredQueries: {
  (
    input: ListStoredQueriesRequest,
  ): effect.Effect<
    ListStoredQueriesResponse,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStoredQueriesRequest,
  ) => stream.Stream<
    ListStoredQueriesResponse,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStoredQueriesRequest,
  ) => stream.Stream<
    unknown,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStoredQueriesRequest,
  output: ListStoredQueriesResponse,
  errors: [InvalidNextTokenException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Accepts a structured query language (SQL) `SELECT` command, performs the corresponding search, and returns resource configurations matching the properties.
 *
 * For more information about query components, see the
 *
 * **Query Components**
 * section in the *Config Developer Guide*.
 */
export const selectResourceConfig: {
  (
    input: SelectResourceConfigRequest,
  ): effect.Effect<
    SelectResourceConfigResponse,
    | InvalidExpressionException
    | InvalidLimitException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SelectResourceConfigRequest,
  ) => stream.Stream<
    SelectResourceConfigResponse,
    | InvalidExpressionException
    | InvalidLimitException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SelectResourceConfigRequest,
  ) => stream.Stream<
    string,
    | InvalidExpressionException
    | InvalidLimitException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SelectResourceConfigRequest,
  output: SelectResourceConfigResponse,
  errors: [
    InvalidExpressionException,
    InvalidLimitException,
    InvalidNextTokenException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Results",
    pageSize: "Limit",
  } as const,
}));
/**
 * List the tags for Config resource.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): effect.Effect<
    ListTagsForResourceResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    ListTagsForResourceResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    Tag,
    | InvalidLimitException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a list of authorizations granted to various aggregator
 * accounts and regions.
 */
export const describeAggregationAuthorizations: {
  (
    input: DescribeAggregationAuthorizationsRequest,
  ): effect.Effect<
    DescribeAggregationAuthorizationsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAggregationAuthorizationsRequest,
  ) => stream.Stream<
    DescribeAggregationAuthorizationsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAggregationAuthorizationsRequest,
  ) => stream.Stream<
    AggregationAuthorization,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAggregationAuthorizationsRequest,
  output: DescribeAggregationAuthorizationsResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AggregationAuthorizations",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the details of one or more configuration aggregators.
 * If the configuration aggregator is not specified, this operation
 * returns the details for all the configuration aggregators associated
 * with the account.
 */
export const describeConfigurationAggregators: {
  (
    input: DescribeConfigurationAggregatorsRequest,
  ): effect.Effect<
    DescribeConfigurationAggregatorsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConfigurationAggregatorsRequest,
  ) => stream.Stream<
    DescribeConfigurationAggregatorsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConfigurationAggregatorsRequest,
  ) => stream.Stream<
    ConfigurationAggregator,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConfigurationAggregatorsRequest,
  output: DescribeConfigurationAggregatorsResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigurationAggregatorException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigurationAggregators",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns status information for sources within an aggregator.
 * The status includes information about the last time Config verified authorization between the source account and an aggregator account. In case of a failure, the status contains the related error code or message.
 */
export const describeConfigurationAggregatorSourcesStatus: {
  (
    input: DescribeConfigurationAggregatorSourcesStatusRequest,
  ): effect.Effect<
    DescribeConfigurationAggregatorSourcesStatusResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConfigurationAggregatorSourcesStatusRequest,
  ) => stream.Stream<
    DescribeConfigurationAggregatorSourcesStatusResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConfigurationAggregatorSourcesStatusRequest,
  ) => stream.Stream<
    AggregatedSourceStatus,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigurationAggregatorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConfigurationAggregatorSourcesStatusRequest,
  output: DescribeConfigurationAggregatorSourcesStatusResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigurationAggregatorException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AggregatedSourceStatusList",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a list of one or more conformance packs.
 */
export const describeConformancePacks: {
  (
    input: DescribeConformancePacksRequest,
  ): effect.Effect<
    DescribeConformancePacksResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConformancePacksRequest,
  ) => stream.Stream<
    DescribeConformancePacksResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConformancePacksRequest,
  ) => stream.Stream<
    ConformancePackDetail,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConformancePacksRequest,
  output: DescribeConformancePacksResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConformancePackException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConformancePackDetails",
    pageSize: "Limit",
  } as const,
}));
/**
 * Provides one or more conformance packs deployment status.
 *
 * If there are no conformance packs then you will see an empty result.
 */
export const describeConformancePackStatus: {
  (
    input: DescribeConformancePackStatusRequest,
  ): effect.Effect<
    DescribeConformancePackStatusResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConformancePackStatusRequest,
  ) => stream.Stream<
    DescribeConformancePackStatusResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConformancePackStatusRequest,
  ) => stream.Stream<
    ConformancePackStatusDetail,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConformancePackStatusRequest,
  output: DescribeConformancePackStatusResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConformancePackStatusDetails",
    pageSize: "Limit",
  } as const,
}));
/**
 * Provides organization Config rule deployment status for an organization.
 *
 * The status is not considered successful until organization Config rule is successfully deployed in all the member
 * accounts with an exception of excluded accounts.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 * Limit and next token are not applicable if you specify organization Config rule names.
 * It is only applicable, when you request all the organization Config rules.
 */
export const describeOrganizationConfigRuleStatuses: {
  (
    input: DescribeOrganizationConfigRuleStatusesRequest,
  ): effect.Effect<
    DescribeOrganizationConfigRuleStatusesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrganizationConfigRuleStatusesRequest,
  ) => stream.Stream<
    DescribeOrganizationConfigRuleStatusesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrganizationConfigRuleStatusesRequest,
  ) => stream.Stream<
    OrganizationConfigRuleStatus,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConfigRuleException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOrganizationConfigRuleStatusesRequest,
  output: DescribeOrganizationConfigRuleStatusesResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchOrganizationConfigRuleException,
    OrganizationAccessDeniedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OrganizationConfigRuleStatuses",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a list of organization conformance packs.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 *
 * Limit and next token are not applicable if you specify organization conformance packs names. They are only applicable,
 * when you request all the organization conformance packs.
 *
 * *For accounts within an organization*
 *
 * If you deploy an organizational rule or conformance pack in an organization
 * administrator account, and then establish a delegated administrator and deploy an
 * organizational rule or conformance pack in the delegated administrator account, you
 * won't be able to see the organizational rule or conformance pack in the organization
 * administrator account from the delegated administrator account or see the organizational
 * rule or conformance pack in the delegated administrator account from organization
 * administrator account. The `DescribeOrganizationConfigRules` and
 * `DescribeOrganizationConformancePacks` APIs can only see and interact with
 * the organization-related resource that were deployed from within the account calling
 * those APIs.
 */
export const describeOrganizationConformancePacks: {
  (
    input: DescribeOrganizationConformancePacksRequest,
  ): effect.Effect<
    DescribeOrganizationConformancePacksResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrganizationConformancePacksRequest,
  ) => stream.Stream<
    DescribeOrganizationConformancePacksResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrganizationConformancePacksRequest,
  ) => stream.Stream<
    OrganizationConformancePack,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOrganizationConformancePacksRequest,
  output: DescribeOrganizationConformancePacksResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchOrganizationConformancePackException,
    OrganizationAccessDeniedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OrganizationConformancePacks",
    pageSize: "Limit",
  } as const,
}));
/**
 * Provides organization conformance pack deployment status for an organization.
 *
 * The status is not considered successful until organization conformance pack is successfully
 * deployed in all the member accounts with an exception of excluded accounts.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 * Limit and next token are not applicable if you specify organization conformance pack names.
 * They are only applicable, when you request all the organization conformance packs.
 */
export const describeOrganizationConformancePackStatuses: {
  (
    input: DescribeOrganizationConformancePackStatusesRequest,
  ): effect.Effect<
    DescribeOrganizationConformancePackStatusesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrganizationConformancePackStatusesRequest,
  ) => stream.Stream<
    DescribeOrganizationConformancePackStatusesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrganizationConformancePackStatusesRequest,
  ) => stream.Stream<
    OrganizationConformancePackStatus,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchOrganizationConformancePackException
    | OrganizationAccessDeniedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOrganizationConformancePackStatusesRequest,
  output: DescribeOrganizationConformancePackStatusesResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchOrganizationConformancePackException,
    OrganizationAccessDeniedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OrganizationConformancePackStatuses",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a list of all pending aggregation requests.
 */
export const describePendingAggregationRequests: {
  (
    input: DescribePendingAggregationRequestsRequest,
  ): effect.Effect<
    DescribePendingAggregationRequestsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePendingAggregationRequestsRequest,
  ) => stream.Stream<
    DescribePendingAggregationRequestsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribePendingAggregationRequestsRequest,
  ) => stream.Stream<
    PendingAggregationRequest,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePendingAggregationRequestsRequest,
  output: DescribePendingAggregationRequestsResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PendingAggregationRequests",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns compliance details for the conformance pack based on the cumulative compliance results of all the rules in that conformance pack.
 */
export const getConformancePackComplianceSummary: {
  (
    input: GetConformancePackComplianceSummaryRequest,
  ): effect.Effect<
    GetConformancePackComplianceSummaryResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetConformancePackComplianceSummaryRequest,
  ) => stream.Stream<
    GetConformancePackComplianceSummaryResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetConformancePackComplianceSummaryRequest,
  ) => stream.Stream<
    ConformancePackComplianceSummary,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetConformancePackComplianceSummaryRequest,
  output: GetConformancePackComplianceSummaryResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConformancePackException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConformancePackComplianceSummaryList",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the resource types, the number of each resource type,
 * and the total number of resources that Config is recording in
 * this region for your Amazon Web Services account.
 *
 * **Example**
 *
 * - Config is recording three resource types in the US
 * East (Ohio) Region for your account: 25 EC2 instances, 20
 * IAM users, and 15 S3 buckets.
 *
 * - You make a call to the
 * `GetDiscoveredResourceCounts` action and
 * specify that you want all resource types.
 *
 * - Config returns the following:
 *
 * - The resource types (EC2 instances, IAM users,
 * and S3 buckets).
 *
 * - The number of each resource type (25, 20, and
 * 15).
 *
 * - The total number of all resources
 * (60).
 *
 * The response is paginated. By default, Config lists 100
 * ResourceCount objects on each page. You can
 * customize this number with the `limit` parameter. The
 * response includes a `nextToken` string. To get the next
 * page of results, run the request again and specify the string for
 * the `nextToken` parameter.
 *
 * If you make a call to the GetDiscoveredResourceCounts action, you might
 * not immediately receive resource counts in the following
 * situations:
 *
 * - You are a new Config customer.
 *
 * - You just enabled resource recording.
 *
 * It might take a few minutes for Config to record and
 * count your resources. Wait a few minutes and then retry the
 * GetDiscoveredResourceCounts action.
 */
export const getDiscoveredResourceCounts: {
  (
    input: GetDiscoveredResourceCountsRequest,
  ): effect.Effect<
    GetDiscoveredResourceCountsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDiscoveredResourceCountsRequest,
  ) => stream.Stream<
    GetDiscoveredResourceCountsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDiscoveredResourceCountsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidLimitException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDiscoveredResourceCountsRequest,
  output: GetDiscoveredResourceCountsResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "limit",
  } as const,
}));
/**
 * Returns a list of compliant and noncompliant rules with the
 * number of resources for compliant and noncompliant rules. Does not display rules that do not have compliance results.
 *
 * The results can return an empty result page, but if you
 * have a `nextToken`, the results are displayed on the next
 * page.
 */
export const describeAggregateComplianceByConfigRules: {
  (
    input: DescribeAggregateComplianceByConfigRulesRequest,
  ): effect.Effect<
    DescribeAggregateComplianceByConfigRulesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAggregateComplianceByConfigRulesRequest,
  ) => stream.Stream<
    DescribeAggregateComplianceByConfigRulesResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAggregateComplianceByConfigRulesRequest,
  ) => stream.Stream<
    unknown,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAggregateComplianceByConfigRulesRequest,
  output: DescribeAggregateComplianceByConfigRulesResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConfigurationAggregatorException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Indicates whether the specified Config rules are compliant.
 * If a rule is noncompliant, this operation returns the number of Amazon Web Services
 * resources that do not comply with the rule.
 *
 * A rule is compliant if all of the evaluated resources comply
 * with it. It is noncompliant if any of these resources do not
 * comply.
 *
 * If Config has no current evaluation results for the rule,
 * it returns `INSUFFICIENT_DATA`. This result might
 * indicate one of the following conditions:
 *
 * - Config has never invoked an evaluation for the
 * rule. To check whether it has, use the
 * `DescribeConfigRuleEvaluationStatus` action
 * to get the `LastSuccessfulInvocationTime` and
 * `LastFailedInvocationTime`.
 *
 * - The rule's Lambda function is failing to send
 * evaluation results to Config. Verify that the role you
 * assigned to your configuration recorder includes the
 * `config:PutEvaluations` permission. If the
 * rule is a custom rule, verify that the Lambda execution
 * role includes the `config:PutEvaluations`
 * permission.
 *
 * - The rule's Lambda function has returned
 * `NOT_APPLICABLE` for all evaluation results.
 * This can occur if the resources were deleted or removed from
 * the rule's scope.
 */
export const describeComplianceByConfigRule: {
  (
    input: DescribeComplianceByConfigRuleRequest,
  ): effect.Effect<
    DescribeComplianceByConfigRuleResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeComplianceByConfigRuleRequest,
  ) => stream.Stream<
    DescribeComplianceByConfigRuleResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeComplianceByConfigRuleRequest,
  ) => stream.Stream<
    ComplianceByConfigRule,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeComplianceByConfigRuleRequest,
  output: DescribeComplianceByConfigRuleResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigRuleException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ComplianceByConfigRules",
  } as const,
}));
/**
 * Deletes one or more remediation exceptions mentioned in the resource keys.
 *
 * Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource.
 * Remediation exceptions blocks auto-remediation until the exception is cleared.
 */
export const deleteRemediationExceptions: (
  input: DeleteRemediationExceptionsRequest,
) => effect.Effect<
  DeleteRemediationExceptionsResponse,
  NoSuchRemediationExceptionException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRemediationExceptionsRequest,
  output: DeleteRemediationExceptionsResponse,
  errors: [NoSuchRemediationExceptionException],
}));
/**
 * Returns a list of the existing and deleted conformance packs and their associated compliance status with the count of compliant and noncompliant Config rules within each
 * conformance pack. Also returns the total rule count which includes compliant rules, noncompliant rules, and rules that cannot be evaluated due to insufficient data.
 *
 * The results can return an empty result page, but if you have a `nextToken`, the results are displayed on the next page.
 */
export const describeAggregateComplianceByConformancePacks: {
  (
    input: DescribeAggregateComplianceByConformancePacksRequest,
  ): effect.Effect<
    DescribeAggregateComplianceByConformancePacksResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAggregateComplianceByConformancePacksRequest,
  ) => stream.Stream<
    DescribeAggregateComplianceByConformancePacksResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAggregateComplianceByConformancePacksRequest,
  ) => stream.Stream<
    AggregateComplianceByConformancePack,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAggregateComplianceByConformancePacksRequest,
  output: DescribeAggregateComplianceByConformancePacksResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConfigurationAggregatorException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AggregateComplianceByConformancePacks",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns compliance details for each rule in that conformance pack.
 *
 * You must provide exact rule names.
 */
export const describeConformancePackCompliance: {
  (
    input: DescribeConformancePackComplianceRequest,
  ): effect.Effect<
    DescribeConformancePackComplianceResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleInConformancePackException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConformancePackComplianceRequest,
  ) => stream.Stream<
    DescribeConformancePackComplianceResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleInConformancePackException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConformancePackComplianceRequest,
  ) => stream.Stream<
    unknown,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleInConformancePackException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConformancePackComplianceRequest,
  output: DescribeConformancePackComplianceResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigRuleInConformancePackException,
    NoSuchConformancePackException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the evaluation results for the specified Config
 * rule for a specific resource in a rule. The results indicate which
 * Amazon Web Services resources were evaluated by the rule, when each resource was
 * last evaluated, and whether each resource complies with the rule.
 *
 * The results can return an empty result page. But if you
 * have a `nextToken`, the results are displayed on the next
 * page.
 */
export const getAggregateComplianceDetailsByConfigRule: {
  (
    input: GetAggregateComplianceDetailsByConfigRuleRequest,
  ): effect.Effect<
    GetAggregateComplianceDetailsByConfigRuleResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAggregateComplianceDetailsByConfigRuleRequest,
  ) => stream.Stream<
    GetAggregateComplianceDetailsByConfigRuleResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAggregateComplianceDetailsByConfigRuleRequest,
  ) => stream.Stream<
    AggregateEvaluationResult,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAggregateComplianceDetailsByConfigRuleRequest,
  output: GetAggregateComplianceDetailsByConfigRuleResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConfigurationAggregatorException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AggregateEvaluationResults",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the count of compliant and noncompliant conformance packs across all Amazon Web Services accounts and Amazon Web Services Regions in an aggregator. You can filter based on Amazon Web Services account ID or Amazon Web Services Region.
 *
 * The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page.
 */
export const getAggregateConformancePackComplianceSummary: {
  (
    input: GetAggregateConformancePackComplianceSummaryRequest,
  ): effect.Effect<
    GetAggregateConformancePackComplianceSummaryResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAggregateConformancePackComplianceSummaryRequest,
  ) => stream.Stream<
    GetAggregateConformancePackComplianceSummaryResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAggregateConformancePackComplianceSummaryRequest,
  ) => stream.Stream<
    unknown,
    | InvalidLimitException
    | InvalidNextTokenException
    | NoSuchConfigurationAggregatorException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAggregateConformancePackComplianceSummaryRequest,
  output: GetAggregateConformancePackComplianceSummaryResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    NoSuchConfigurationAggregatorException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Adds or updates an Config rule to evaluate if your
 * Amazon Web Services resources comply with your desired configurations. For information on how many Config rules you can have per account,
 * see
 * **Service Limits**
 * in the *Config Developer Guide*.
 *
 * There are two types of rules: *Config Managed Rules* and *Config Custom Rules*.
 * You can use `PutConfigRule` to create both Config Managed Rules and Config Custom Rules.
 *
 * Config Managed Rules are predefined,
 * customizable rules created by Config. For a list of managed rules, see
 * List of Config
 * Managed Rules. If you are adding an Config managed rule, you must specify the
 * rule's identifier for the `SourceIdentifier` key.
 *
 * Config Custom Rules are rules that you create from scratch. There are two ways to create Config custom rules: with Lambda functions
 * ( Lambda Developer Guide) and with Guard (Guard GitHub
 * Repository), a policy-as-code language.
 *
 * Config custom rules created with Lambda
 * are called *Config Custom Lambda Rules* and Config custom rules created with
 * Guard are called *Config Custom Policy Rules*.
 *
 * If you are adding a new Config Custom Lambda rule,
 * you first need to create an Lambda function that the rule invokes to evaluate
 * your resources. When you use `PutConfigRule` to add a Custom Lambda rule to Config, you must specify the Amazon Resource
 * Name (ARN) that Lambda assigns to the function. You specify the ARN
 * in the `SourceIdentifier` key. This key is part of the
 * `Source` object, which is part of the
 * `ConfigRule` object.
 *
 * For any new Config rule that you add, specify the
 * `ConfigRuleName` in the `ConfigRule`
 * object. Do not specify the `ConfigRuleArn` or the
 * `ConfigRuleId`. These values are generated by Config for new rules.
 *
 * If you are updating a rule that you added previously, you can
 * specify the rule by `ConfigRuleName`,
 * `ConfigRuleId`, or `ConfigRuleArn` in the
 * `ConfigRule` data type that you use in this
 * request.
 *
 * For more information about developing and using Config
 * rules, see Evaluating Resources with Config Rules
 * in the *Config Developer Guide*.
 *
 * **Tags are added at creation and cannot be updated with this operation**
 *
 * `PutConfigRule` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different `tags` values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, `tags` will not be updated, even if they are different.
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putConfigRule: (
  input: PutConfigRuleRequest,
) => effect.Effect<
  PutConfigRuleResponse,
  | InsufficientPermissionsException
  | InvalidParameterValueException
  | MaxNumberOfConfigRulesExceededException
  | NoAvailableConfigurationRecorderException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigRuleRequest,
  output: PutConfigRuleResponse,
  errors: [
    InsufficientPermissionsException,
    InvalidParameterValueException,
    MaxNumberOfConfigRulesExceededException,
    NoAvailableConfigurationRecorderException,
    ResourceInUseException,
  ],
}));
/**
 * Creates or updates a conformance pack. A conformance pack is a collection of Config rules that can be easily deployed in an account and a region and across an organization.
 * For information on how many conformance packs you can have per account,
 * see
 * **Service Limits**
 * in the *Config Developer Guide*.
 *
 * When you use `PutConformancePack` to deploy conformance packs in your account,
 * the operation can create Config rules and remediation actions without
 * requiring `config:PutConfigRule` or
 * `config:PutRemediationConfigurations` permissions in your account IAM
 * policies.
 *
 * This API uses the `AWSServiceRoleForConfigConforms` service-linked role in your
 * account to create conformance pack resources. This service-linked role includes the
 * permissions to create Config rules and remediation configurations, even
 * if your account IAM policies explicitly deny these actions.
 *
 * This API creates a service-linked role `AWSServiceRoleForConfigConforms` in your account.
 * The service-linked role is created only when the role does not exist in your account.
 *
 * You must specify only one of the follow parameters: `TemplateS3Uri`, `TemplateBody` or `TemplateSSMDocumentDetails`.
 */
export const putConformancePack: (
  input: PutConformancePackRequest,
) => effect.Effect<
  PutConformancePackResponse,
  | ConformancePackTemplateValidationException
  | InsufficientPermissionsException
  | InvalidParameterValueException
  | MaxNumberOfConformancePacksExceededException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConformancePackRequest,
  output: PutConformancePackResponse,
  errors: [
    ConformancePackTemplateValidationException,
    InsufficientPermissionsException,
    InvalidParameterValueException,
    MaxNumberOfConformancePacksExceededException,
    ResourceInUseException,
  ],
}));
/**
 * Returns compliance details of a conformance pack for all Amazon Web Services resources that are monitered by conformance pack.
 */
export const getConformancePackComplianceDetails: {
  (
    input: GetConformancePackComplianceDetailsRequest,
  ): effect.Effect<
    GetConformancePackComplianceDetailsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleInConformancePackException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetConformancePackComplianceDetailsRequest,
  ) => stream.Stream<
    GetConformancePackComplianceDetailsResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleInConformancePackException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetConformancePackComplianceDetailsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidParameterValueException
    | NoSuchConfigRuleInConformancePackException
    | NoSuchConformancePackException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetConformancePackComplianceDetailsRequest,
  output: GetConformancePackComplianceDetailsResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigRuleInConformancePackException,
    NoSuchConformancePackException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Adds or updates an Config rule for your entire organization to evaluate if your Amazon Web Services resources comply with your
 * desired configurations. For information on how many organization Config rules you can have per account,
 * see
 * **Service Limits**
 * in the *Config Developer Guide*.
 *
 * Only a management account and a delegated administrator can create or update an organization Config rule.
 * When calling this API with a delegated administrator, you must ensure Organizations
 * `ListDelegatedAdministrator` permissions are added. An organization can have up to 3 delegated administrators.
 *
 * This API enables organization service access through the `EnableAWSServiceAccess` action and creates a service-linked
 * role `AWSServiceRoleForConfigMultiAccountSetup` in the management or delegated administrator account of your organization.
 * The service-linked role is created only when the role does not exist in the caller account.
 * Config verifies the existence of role with `GetRole` action.
 *
 * To use this API with delegated administrator, register a delegated administrator by calling Amazon Web Services Organization
 * `register-delegated-administrator` for `config-multiaccountsetup.amazonaws.com`.
 *
 * There are two types of rules: *Config Managed Rules* and *Config Custom Rules*.
 * You can use `PutOrganizationConfigRule` to create both Config Managed Rules and Config Custom Rules.
 *
 * Config Managed Rules are predefined,
 * customizable rules created by Config. For a list of managed rules, see
 * List of Config
 * Managed Rules. If you are adding an Config managed rule, you must specify the rule's identifier for the `RuleIdentifier` key.
 *
 * Config Custom Rules are rules that you create from scratch. There are two ways to create Config custom rules: with Lambda functions
 * ( Lambda Developer Guide) and with Guard (Guard GitHub
 * Repository), a policy-as-code language.
 *
 * Config custom rules created with Lambda
 * are called *Config Custom Lambda Rules* and Config custom rules created with
 * Guard are called *Config Custom Policy Rules*.
 *
 * If you are adding a new Config Custom Lambda rule, you first need to create an Lambda function in the management account or a delegated
 * administrator that the rule invokes to evaluate your resources. You also need to create an IAM role in the managed account that can be assumed by the Lambda function.
 * When you use `PutOrganizationConfigRule` to add a Custom Lambda rule to Config, you must
 * specify the Amazon Resource Name (ARN) that Lambda assigns to the function.
 *
 * Prerequisite: Ensure you call `EnableAllFeatures` API to enable all features in an organization.
 *
 * Make sure to specify one of either `OrganizationCustomPolicyRuleMetadata` for Custom Policy rules, `OrganizationCustomRuleMetadata` for Custom Lambda rules, or `OrganizationManagedRuleMetadata` for managed rules.
 */
export const putOrganizationConfigRule: (
  input: PutOrganizationConfigRuleRequest,
) => effect.Effect<
  PutOrganizationConfigRuleResponse,
  | InsufficientPermissionsException
  | InvalidParameterValueException
  | MaxNumberOfOrganizationConfigRulesExceededException
  | NoAvailableOrganizationException
  | OrganizationAccessDeniedException
  | OrganizationAllFeaturesNotEnabledException
  | ResourceInUseException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutOrganizationConfigRuleRequest,
  output: PutOrganizationConfigRuleResponse,
  errors: [
    InsufficientPermissionsException,
    InvalidParameterValueException,
    MaxNumberOfOrganizationConfigRulesExceededException,
    NoAvailableOrganizationException,
    OrganizationAccessDeniedException,
    OrganizationAllFeaturesNotEnabledException,
    ResourceInUseException,
    ValidationException,
  ],
}));
/**
 * Creates and updates the configuration aggregator with the
 * selected source accounts and regions. The source account can be
 * individual account(s) or an organization.
 *
 * `accountIds` that are passed will be replaced with existing accounts.
 * If you want to add additional accounts into the aggregator, call `DescribeConfigurationAggregators` to get the previous accounts and then append new ones.
 *
 * Config should be enabled in source accounts and regions
 * you want to aggregate.
 *
 * If your source type is an organization, you must be signed in to the management account or a registered delegated administrator and all the features must be enabled in your organization.
 * If the caller is a management account, Config calls `EnableAwsServiceAccess` API to enable integration between Config and Organizations.
 * If the caller is a registered delegated administrator, Config calls `ListDelegatedAdministrators` API to verify whether the caller is a valid delegated administrator.
 *
 * To register a delegated administrator, see Register a Delegated Administrator in the *Config developer guide*.
 *
 * **Tags are added at creation and cannot be updated with this operation**
 *
 * `PutConfigurationAggregator` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different `tags` values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, `tags` will not be updated, even if they are different.
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putConfigurationAggregator: (
  input: PutConfigurationAggregatorRequest,
) => effect.Effect<
  PutConfigurationAggregatorResponse,
  | InvalidParameterValueException
  | InvalidRoleException
  | LimitExceededException
  | NoAvailableOrganizationException
  | OrganizationAccessDeniedException
  | OrganizationAllFeaturesNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationAggregatorRequest,
  output: PutConfigurationAggregatorResponse,
  errors: [
    InvalidParameterValueException,
    InvalidRoleException,
    LimitExceededException,
    NoAvailableOrganizationException,
    OrganizationAccessDeniedException,
    OrganizationAllFeaturesNotEnabledException,
  ],
}));
/**
 * Returns a list of proactive resource evaluations.
 */
export const listResourceEvaluations: {
  (
    input: ListResourceEvaluationsRequest,
  ): effect.Effect<
    ListResourceEvaluationsResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | InvalidTimeRangeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceEvaluationsRequest,
  ) => stream.Stream<
    ListResourceEvaluationsResponse,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | InvalidTimeRangeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceEvaluationsRequest,
  ) => stream.Stream<
    ResourceEvaluation,
    | InvalidNextTokenException
    | InvalidParameterValueException
    | InvalidTimeRangeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceEvaluationsRequest,
  output: ListResourceEvaluationsResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterValueException,
    InvalidTimeRangeException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceEvaluations",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns configuration item that is aggregated for your specific resource in a specific source account and region.
 *
 * The API does not return results for deleted resources.
 */
export const getAggregateResourceConfig: (
  input: GetAggregateResourceConfigRequest,
) => effect.Effect<
  GetAggregateResourceConfigResponse,
  | NoSuchConfigurationAggregatorException
  | OversizedConfigurationItemException
  | ResourceNotDiscoveredException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAggregateResourceConfigRequest,
  output: GetAggregateResourceConfigResponse,
  errors: [
    NoSuchConfigurationAggregatorException,
    OversizedConfigurationItemException,
    ResourceNotDiscoveredException,
    ValidationException,
  ],
}));
/**
 * Deploys conformance packs across member accounts in an Amazon Web Services Organization. For information on how many organization conformance packs and how many Config rules you can have per account,
 * see
 * **Service Limits**
 * in the *Config Developer Guide*.
 *
 * Only a management account and a delegated administrator can call this API.
 * When calling this API with a delegated administrator, you must ensure Organizations
 * `ListDelegatedAdministrator` permissions are added. An organization can have up to 3 delegated administrators.
 *
 * When you use `PutOrganizationConformancePack` to deploy conformance packs across
 * member accounts, the operation can create Config rules and remediation
 * actions without requiring `config:PutConfigRule` or
 * `config:PutRemediationConfigurations` permissions in member account
 * IAM policies.
 *
 * This API uses the `AWSServiceRoleForConfigConforms` service-linked role in each
 * member account to create conformance pack resources. This service-linked role
 * includes the permissions to create Config rules and remediation
 * configurations, even if member account IAM policies explicitly deny these
 * actions.
 *
 * This API enables organization service access for `config-multiaccountsetup.amazonaws.com`
 * through the `EnableAWSServiceAccess` action and creates a
 * service-linked role `AWSServiceRoleForConfigMultiAccountSetup` in the management or delegated administrator account of your organization.
 * The service-linked role is created only when the role does not exist in the caller account.
 * To use this API with delegated administrator, register a delegated administrator by calling Amazon Web Services Organization
 * `register-delegate-admin` for `config-multiaccountsetup.amazonaws.com`.
 *
 * Prerequisite: Ensure you call `EnableAllFeatures` API to enable all features in an organization.
 *
 * You must specify either the `TemplateS3Uri` or the `TemplateBody` parameter, but not both.
 * If you provide both Config uses the `TemplateS3Uri` parameter and ignores the `TemplateBody` parameter.
 *
 * Config sets the state of a conformance pack to CREATE_IN_PROGRESS and UPDATE_IN_PROGRESS until the conformance pack is created or updated.
 * You cannot update a conformance pack while it is in this state.
 */
export const putOrganizationConformancePack: (
  input: PutOrganizationConformancePackRequest,
) => effect.Effect<
  PutOrganizationConformancePackResponse,
  | InsufficientPermissionsException
  | MaxNumberOfOrganizationConformancePacksExceededException
  | NoAvailableOrganizationException
  | OrganizationAccessDeniedException
  | OrganizationAllFeaturesNotEnabledException
  | OrganizationConformancePackTemplateValidationException
  | ResourceInUseException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutOrganizationConformancePackRequest,
  output: PutOrganizationConformancePackResponse,
  errors: [
    InsufficientPermissionsException,
    MaxNumberOfOrganizationConformancePacksExceededException,
    NoAvailableOrganizationException,
    OrganizationAccessDeniedException,
    OrganizationAllFeaturesNotEnabledException,
    OrganizationConformancePackTemplateValidationException,
    ResourceInUseException,
    ValidationException,
  ],
}));
/**
 * For accurate reporting on the compliance status, you must record the `AWS::Config::ResourceCompliance` resource type.
 *
 * For more information, see Recording Amazon Web Services Resources in the *Config Resources Developer Guide*.
 *
 * Returns a list of configurations items (CIs) for the specified resource.
 *
 * **Contents**
 *
 * The list contains details about each state of the resource
 * during the specified time interval. If you specified a retention
 * period to retain your CIs between a
 * minimum of 30 days and a maximum of 7 years (2557 days), Config
 * returns the CIs for the specified
 * retention period.
 *
 * **Pagination**
 *
 * The response is paginated. By default, Config returns a
 * limit of 10 configuration items per page. You can customize this
 * number with the `limit` parameter. The response includes
 * a `nextToken` string. To get the next page of results,
 * run the request again and specify the string for the
 * `nextToken` parameter.
 *
 * Each call to the API is limited to span a duration of seven
 * days. It is likely that the number of records returned is
 * smaller than the specified `limit`. In such cases,
 * you can make another call, using the
 * `nextToken`.
 */
export const getResourceConfigHistory: {
  (
    input: GetResourceConfigHistoryRequest,
  ): effect.Effect<
    GetResourceConfigHistoryResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | NoAvailableConfigurationRecorderException
    | ResourceNotDiscoveredException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourceConfigHistoryRequest,
  ) => stream.Stream<
    GetResourceConfigHistoryResponse,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | NoAvailableConfigurationRecorderException
    | ResourceNotDiscoveredException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourceConfigHistoryRequest,
  ) => stream.Stream<
    ConfigurationItem,
    | InvalidLimitException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | NoAvailableConfigurationRecorderException
    | ResourceNotDiscoveredException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourceConfigHistoryRequest,
  output: GetResourceConfigHistoryResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    InvalidTimeRangeException,
    NoAvailableConfigurationRecorderException,
    ResourceNotDiscoveredException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "configurationItems",
    pageSize: "limit",
  } as const,
}));
/**
 * Creates or updates the customer managed configuration recorder.
 *
 * You can use this operation to create a new customer managed configuration recorder or to update the `roleARN` and the `recordingGroup` for an existing customer managed configuration recorder.
 *
 * To start the customer managed configuration recorder and begin recording configuration changes for the resource types you specify,
 * use the StartConfigurationRecorder operation.
 *
 * For more information, see
 * **Working with the Configuration Recorder**
 * in the *Config Developer Guide*.
 *
 * **One customer managed configuration recorder per account per Region**
 *
 * You can create only one customer managed configuration recorder for each account for each Amazon Web Services Region.
 *
 * **Default is to record all supported resource types, excluding the global IAM resource types**
 *
 * If you have not specified values for the `recordingGroup` field, the default for the customer managed configuration recorder is to record all supported resource
 * types, excluding the global IAM resource types: `AWS::IAM::Group`, `AWS::IAM::Policy`, `AWS::IAM::Role`, and `AWS::IAM::User`.
 *
 * **Tags are added at creation and cannot be updated**
 *
 * `PutConfigurationRecorder` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different tags values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, tags will not be updated, even if they are different.
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putConfigurationRecorder: (
  input: PutConfigurationRecorderRequest,
) => effect.Effect<
  PutConfigurationRecorderResponse,
  | InvalidConfigurationRecorderNameException
  | InvalidRecordingGroupException
  | InvalidRoleException
  | MaxNumberOfConfigurationRecordersExceededException
  | UnmodifiableEntityException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationRecorderRequest,
  output: PutConfigurationRecorderResponse,
  errors: [
    InvalidConfigurationRecorderNameException,
    InvalidRecordingGroupException,
    InvalidRoleException,
    MaxNumberOfConfigurationRecordersExceededException,
    UnmodifiableEntityException,
    ValidationException,
  ],
}));
/**
 * Adds or updates the remediation configuration with a specific Config rule with the
 * selected target or action.
 * The API creates the `RemediationConfiguration` object for the Config rule.
 * The Config rule must already exist for you to add a remediation configuration.
 * The target (SSM document) must exist and have permissions to use the target.
 *
 * **Be aware of backward incompatible changes**
 *
 * If you make backward incompatible changes to the SSM document,
 * you must call this again to ensure the remediations can run.
 *
 * This API does not support adding remediation configurations for service-linked Config Rules such as Organization Config rules,
 * the rules deployed by conformance packs, and rules deployed by Amazon Web Services Security Hub.
 *
 * **Required fields**
 *
 * For manual remediation configuration, you need to provide a value for `automationAssumeRole` or use a value in the `assumeRole`field to remediate your resources. The SSM automation document can use either as long as it maps to a valid parameter.
 *
 * However, for automatic remediation configuration, the only valid `assumeRole` field value is `AutomationAssumeRole` and you need to provide a value for `AutomationAssumeRole` to remediate your resources.
 *
 * **Auto remediation can be initiated even for compliant resources**
 *
 * If you enable auto remediation for a specific Config rule using the PutRemediationConfigurations API or the Config console,
 * it initiates the remediation process for all non-compliant resources for that specific rule.
 * The auto remediation process relies on the compliance data snapshot which is captured on a periodic basis.
 * Any non-compliant resource that is updated between the snapshot schedule will continue to be remediated based on the last known compliance data snapshot.
 *
 * This means that in some cases auto remediation can be initiated even for compliant resources, since the bootstrap processor uses a database that can have stale evaluation results based on the last known compliance data snapshot.
 */
export const putRemediationConfigurations: (
  input: PutRemediationConfigurationsRequest,
) => effect.Effect<
  PutRemediationConfigurationsResponse,
  | InsufficientPermissionsException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRemediationConfigurationsRequest,
  output: PutRemediationConfigurationsResponse,
  errors: [InsufficientPermissionsException, InvalidParameterValueException],
}));
/**
 * Creates or updates a delivery channel to deliver configuration
 * information and other compliance information.
 *
 * You can use this operation to create a new delivery channel or to update the Amazon S3 bucket and the
 * Amazon SNS topic of an existing delivery channel.
 *
 * For more information, see
 * **Working with the Delivery Channel**
 * in the *Config Developer Guide.*
 *
 * **One delivery channel per account per Region**
 *
 * You can have only one delivery channel for each account for each Amazon Web Services Region.
 */
export const putDeliveryChannel: (
  input: PutDeliveryChannelRequest,
) => effect.Effect<
  PutDeliveryChannelResponse,
  | InsufficientDeliveryPolicyException
  | InvalidDeliveryChannelNameException
  | InvalidS3KeyPrefixException
  | InvalidS3KmsKeyArnException
  | InvalidSNSTopicARNException
  | MaxNumberOfDeliveryChannelsExceededException
  | NoAvailableConfigurationRecorderException
  | NoSuchBucketException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDeliveryChannelRequest,
  output: PutDeliveryChannelResponse,
  errors: [
    InsufficientDeliveryPolicyException,
    InvalidDeliveryChannelNameException,
    InvalidS3KeyPrefixException,
    InvalidS3KmsKeyArnException,
    InvalidSNSTopicARNException,
    MaxNumberOfDeliveryChannelsExceededException,
    NoAvailableConfigurationRecorderException,
    NoSuchBucketException,
  ],
}));
