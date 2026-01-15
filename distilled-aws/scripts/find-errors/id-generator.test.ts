import { NodeContext } from "@effect/platform-node";
import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";
import {
  ARN_BASED_RESOURCES,
  AWS_ID_PREFIXES,
  FIELD_FORMAT_OVERRIDES,
  generateFakeId,
  generateFakeInputs,
  NAME_BASED_RESOURCES,
  SPECIAL_FORMAT_RESOURCES,
} from "./id-generator.ts";
import { buildDependencyGraph } from "./topology.ts";

describe("generateFakeId", () => {
  describe("EC2-style resources with prefixes", () => {
    it.effect("generates vpc ID with vpc- prefix", () =>
      Effect.sync(() => {
        expect(generateFakeId("Vpc")).toBe("vpc-0123456789abcdef0");
      }),
    );

    it.effect("generates subnet ID with subnet- prefix", () =>
      Effect.sync(() => {
        expect(generateFakeId("Subnet")).toBe("subnet-0123456789abcdef0");
      }),
    );

    it.effect("generates instance ID with i- prefix", () =>
      Effect.sync(() => {
        expect(generateFakeId("Instance")).toBe("i-0123456789abcdef0");
      }),
    );

    it.effect("generates security group ID with sg- prefix", () =>
      Effect.sync(() => {
        expect(generateFakeId("SecurityGroup")).toBe("sg-0123456789abcdef0");
      }),
    );

    it.effect("generates transit gateway ID with tgw- prefix", () =>
      Effect.sync(() => {
        expect(generateFakeId("TransitGateway")).toBe("tgw-0123456789abcdef0");
      }),
    );

    it.effect("generates IPAM pool ID with ipam-pool- prefix", () =>
      Effect.sync(() => {
        expect(generateFakeId("IpamPool")).toBe("ipam-pool-0123456789abcdef0");
      }),
    );
  });

  describe("name-based resources", () => {
    it.effect("generates fake bucket name", () =>
      Effect.sync(() => {
        expect(generateFakeId("Bucket")).toBe("itty-fake-bucket-notfound");
      }),
    );

    it.effect("generates fake function name", () =>
      Effect.sync(() => {
        expect(generateFakeId("Function")).toBe("itty-fake-function-notfound");
      }),
    );

    it.effect("generates fake table name", () =>
      Effect.sync(() => {
        expect(generateFakeId("Table")).toBe("itty-fake-table-notfound");
      }),
    );

    it.effect("generates fake queue name", () =>
      Effect.sync(() => {
        expect(generateFakeId("Queue")).toBe("itty-fake-queue-notfound");
      }),
    );
  });

  describe("ARN-based resources", () => {
    it.effect("generates fake certificate ARN", () =>
      Effect.sync(() => {
        expect(generateFakeId("Certificate")).toBe(
          "arn:aws:acm:us-east-1:123456789012:certificate/fake-certificate-notfound",
        );
      }),
    );

    it.effect("generates fake role ARN", () =>
      Effect.sync(() => {
        expect(generateFakeId("Role")).toBe(
          "arn:aws:acm:us-east-1:123456789012:role/fake-role-notfound",
        );
      }),
    );

    it.effect("generates fake principal ARN", () =>
      Effect.sync(() => {
        expect(generateFakeId("Principal")).toBe(
          "arn:aws:acm:us-east-1:123456789012:principal/fake-principal-notfound",
        );
      }),
    );
  });

  describe("special format resources", () => {
    it.effect("generates IP address for Address", () =>
      Effect.sync(() => {
        expect(generateFakeId("Address")).toBe("192.0.2.1");
      }),
    );

    it.effect("generates bundle ID for Bundle", () =>
      Effect.sync(() => {
        expect(generateFakeId("Bundle")).toBe("bun-12345678");
      }),
    );

    it.effect("generates conversion task ID", () =>
      Effect.sync(() => {
        expect(generateFakeId("ConversionTask")).toBe("import-i-12345678");
      }),
    );
  });

  describe("unknown resources", () => {
    it.effect("generates inferred prefix for unknown resource", () =>
      Effect.sync(() => {
        const id = generateFakeId("SomeNewResource");
        expect(id).toBe("some-0123456789abcdef0");
      }),
    );
  });

  describe("all prefixes are valid", () => {
    it.effect(
      "all AWS_ID_PREFIXES produce valid IDs (special format takes precedence)",
      () =>
        Effect.sync(() => {
          for (const [resource, prefix] of Object.entries(AWS_ID_PREFIXES)) {
            const id = generateFakeId(resource);

            // Special format resources use their special value instead of prefix
            if (SPECIAL_FORMAT_RESOURCES[resource]) {
              expect(id).toBe(SPECIAL_FORMAT_RESOURCES[resource]);
            } else {
              expect(id).toMatch(new RegExp(`^${prefix}-`));
            }
          }
        }),
    );

    it.effect("all NAME_BASED_RESOURCES produce fake names", () =>
      Effect.sync(() => {
        for (const resource of NAME_BASED_RESOURCES) {
          const id = generateFakeId(resource);
          expect(id).toMatch(/^itty-fake-.*-notfound$/);
        }
      }),
    );

    it.effect("all ARN_BASED_RESOURCES produce ARNs", () =>
      Effect.sync(() => {
        for (const resource of ARN_BASED_RESOURCES) {
          const id = generateFakeId(resource);
          expect(id).toMatch(/^arn:aws:/);
        }
      }),
    );

    it.effect("all SPECIAL_FORMAT_RESOURCES return their value", () =>
      Effect.sync(() => {
        for (const [resource, expected] of Object.entries(
          SPECIAL_FORMAT_RESOURCES,
        )) {
          expect(generateFakeId(resource)).toBe(expected);
        }
      }),
    );
  });
});

describe("generateFakeInputs with real EC2 operations", () => {
  it.effect("generates inputs for deleteVpc", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteVpc");

      expect(inputs).toHaveProperty("VpcId");
      expect(inputs!.VpcId).toBe("vpc-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteSubnet", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteSubnet");

      expect(inputs).toHaveProperty("SubnetId");
      expect(inputs!.SubnetId).toBe("subnet-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteSecurityGroup", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteSecurityGroup");

      // deleteSecurityGroup has optional GroupId/GroupName, so may return empty
      // This is a valid case - we generate inputs for required fields
      expect(inputs).not.toBeNull();
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for terminateInstances", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "terminateInstances");

      expect(inputs).toHaveProperty("InstanceIds");
      expect(inputs!.InstanceIds).toEqual(["i-0123456789abcdef0"]);
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for detachInternetGateway", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "detachInternetGateway");

      expect(inputs).toHaveProperty("InternetGatewayId");
      expect(inputs).toHaveProperty("VpcId");
      expect(inputs!.InternetGatewayId).toBe("igw-0123456789abcdef0");
      expect(inputs!.VpcId).toBe("vpc-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteInternetGateway", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteInternetGateway");

      expect(inputs).toHaveProperty("InternetGatewayId");
      expect(inputs!.InternetGatewayId).toBe("igw-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteNatGateway", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteNatGateway");

      expect(inputs).toHaveProperty("NatGatewayId");
      expect(inputs!.NatGatewayId).toBe("nat-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteRouteTable", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteRouteTable");

      expect(inputs).toHaveProperty("RouteTableId");
      expect(inputs!.RouteTableId).toBe("rtb-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteNetworkAcl", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteNetworkAcl");

      expect(inputs).toHaveProperty("NetworkAclId");
      expect(inputs!.NetworkAclId).toBe("acl-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteVolume", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteVolume");

      expect(inputs).toHaveProperty("VolumeId");
      expect(inputs!.VolumeId).toBe("vol-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteSnapshot", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteSnapshot");

      expect(inputs).toHaveProperty("SnapshotId");
      expect(inputs!.SnapshotId).toBe("snap-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteLaunchTemplate", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteLaunchTemplate");

      // deleteLaunchTemplate has optional ID/name fields, so may return empty
      expect(inputs).not.toBeNull();
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteTransitGateway", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteTransitGateway");

      expect(inputs).toHaveProperty("TransitGatewayId");
      expect(inputs!.TransitGatewayId).toBe("tgw-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteVpnGateway", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteVpnGateway");

      expect(inputs).toHaveProperty("VpnGatewayId");
      expect(inputs!.VpnGatewayId).toBe("vgw-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteCustomerGateway", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteCustomerGateway");

      expect(inputs).toHaveProperty("CustomerGatewayId");
      expect(inputs!.CustomerGatewayId).toBe("cgw-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteVpnConnection", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteVpnConnection");

      expect(inputs).toHaveProperty("VpnConnectionId");
      expect(inputs!.VpnConnectionId).toBe("vpn-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteVpcEndpoints", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteVpcEndpoints");

      expect(inputs).toHaveProperty("VpcEndpointIds");
      expect(inputs!.VpcEndpointIds).toEqual(["vpce-0123456789abcdef0"]);
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates inputs for deleteVpcPeeringConnection", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      const inputs = generateFakeInputs(graph, "deleteVpcPeeringConnection");

      expect(inputs).toHaveProperty("VpcPeeringConnectionId");
      expect(inputs!.VpcPeeringConnectionId).toBe("pcx-0123456789abcdef0");
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("returns null for unknown operation", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");
      expect(generateFakeInputs(graph, "unknownOperation")).toBeNull();
    }).pipe(Effect.provide(NodeContext.layer)),
  );
});

describe("generateFakeInputs with SQS operations", () => {
  it.effect("generates proper QueueUrl format for deleteQueue", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("sqs");
      const inputs = generateFakeInputs(graph, "deleteQueue");

      expect(inputs).toHaveProperty("QueueUrl");
      expect(inputs!.QueueUrl).toBe(FIELD_FORMAT_OVERRIDES.QueueUrl);
      expect(inputs!.QueueUrl).toMatch(/^https:\/\/sqs\..*\.amazonaws\.com/);
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates proper QueueUrl format for getQueueAttributes", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("sqs");
      const inputs = generateFakeInputs(graph, "getQueueAttributes");

      expect(inputs).toHaveProperty("QueueUrl");
      expect(inputs!.QueueUrl).toMatch(/^https:\/\/sqs\..*\.amazonaws\.com/);
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates proper SourceArn format for listMessageMoveTasks", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("sqs");
      const inputs = generateFakeInputs(graph, "listMessageMoveTasks");

      expect(inputs).toHaveProperty("SourceArn");
      expect(inputs!.SourceArn).toBe(FIELD_FORMAT_OVERRIDES.SourceArn);
      expect(inputs!.SourceArn).toMatch(/^arn:aws:sqs:/);
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("generates proper SourceArn format for startMessageMoveTask", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("sqs");
      const inputs = generateFakeInputs(graph, "startMessageMoveTask");

      expect(inputs).toHaveProperty("SourceArn");
      expect(inputs!.SourceArn).toMatch(/^arn:aws:sqs:/);
    }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect(
    "generates proper TaskHandle format for cancelMessageMoveTask",
    () =>
      Effect.gen(function* () {
        const graph = yield* buildDependencyGraph("sqs");
        const inputs = generateFakeInputs(graph, "cancelMessageMoveTask");

        expect(inputs).toHaveProperty("TaskHandle");
        expect(inputs!.TaskHandle).toBe(FIELD_FORMAT_OVERRIDES.TaskHandle);
      }).pipe(Effect.provide(NodeContext.layer)),
  );
});

describe("generateFakeInputs covers all EC2 delete operations", () => {
  it.effect(
    "generates inputs for all delete operations (may be empty for optional-only ops)",
    () =>
      Effect.gen(function* () {
        const graph = yield* buildDependencyGraph("ec2");

        const deleteOps = Object.entries(graph.operations).filter(
          ([_, op]) => op.type === "delete",
        );

        expect(deleteOps.length).toBeGreaterThan(50); // EC2 has many delete ops

        let withInputs = 0;
        for (const [opName, _op] of deleteOps) {
          const inputs = generateFakeInputs(graph, opName);
          // Every delete operation should return an object (not null)
          expect(inputs).not.toBeNull();
          if (Object.keys(inputs!).length > 0) {
            withInputs++;
          }
        }
        // Most delete operations should have required inputs
        expect(withInputs).toBeGreaterThan(deleteOps.length * 0.8);
      }).pipe(Effect.provide(NodeContext.layer)),
  );

  it.effect("all generated IDs use correct prefixes", () =>
    Effect.gen(function* () {
      const graph = yield* buildDependencyGraph("ec2");

      const deleteOps = Object.entries(graph.operations).filter(
        ([_, op]) => op.type === "delete",
      );

      for (const [opName, _op] of deleteOps) {
        const inputs = generateFakeInputs(graph, opName);
        if (!inputs) continue;

        for (const [key, value] of Object.entries(inputs)) {
          if (key.endsWith("Id") || key.endsWith("Ids")) {
            const values = Array.isArray(value) ? value : [value];
            for (const v of values) {
              // Should either be a prefixed ID, ARN, name, or special format
              expect(
                typeof v === "string" &&
                  (v.includes("-") ||
                    v.startsWith("arn:") ||
                    v.startsWith("itty-")),
              ).toBe(true);
            }
          }
        }
      }
    }).pipe(Effect.provide(NodeContext.layer)),
  );
});
