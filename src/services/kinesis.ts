import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://kinesis.amazonaws.com/doc/2013-12-02");
const svc = T.AwsApiService({
  sdkId: "Kinesis",
  serviceShapeName: "Kinesis_20131202",
});
const auth = T.AwsAuthSigv4({ name: "kinesis" });
const ver = T.ServiceVersion("2013-12-02");
const proto = T.AwsProtocolsAwsJson1_1();
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
    StreamARN: {
      required: false,
      documentation: "The ARN of the Kinesis stream",
      type: "string",
    },
    OperationType: {
      required: false,
      documentation:
        "Internal parameter to distinguish between Control/Data plane API and accordingly generate control/data plane endpoint",
      type: "string",
    },
    ConsumerARN: {
      required: false,
      documentation: "The ARN of the Kinesis consumer",
      type: "string",
    },
    ResourceARN: {
      required: false,
      documentation: "The ARN of the Kinesis resource",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [
        { fn: "isSet", argv: [{ ref: "StreamARN" }] },
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso-b",
              ],
            },
          ],
        },
      ],
      rules: [
        {
          conditions: [
            { fn: "aws.parseArn", argv: [{ ref: "StreamARN" }], assign: "arn" },
          ],
          rules: [
            {
              conditions: [
                {
                  fn: "isValidHostLabel",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "arn" }, "accountId"] },
                    false,
                  ],
                },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "isValidHostLabel",
                      argv: [
                        { fn: "getAttr", argv: [{ ref: "arn" }, "region"] },
                        false,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "arn" }, "service"],
                            },
                            "kinesis",
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "arn" }, "resourceId[0]"],
                              assign: "arnType",
                            },
                            {
                              fn: "not",
                              argv: [
                                {
                                  fn: "stringEquals",
                                  argv: [{ ref: "arnType" }, ""],
                                },
                              ],
                            },
                          ],
                          rules: [
                            {
                              conditions: [
                                {
                                  fn: "stringEquals",
                                  argv: [{ ref: "arnType" }, "stream"],
                                },
                              ],
                              rules: [
                                {
                                  conditions: [
                                    {
                                      fn: "stringEquals",
                                      argv: [
                                        {
                                          fn: "getAttr",
                                          argv: [
                                            { ref: "PartitionResult" },
                                            "name",
                                          ],
                                        },
                                        "{arn#partition}",
                                      ],
                                    },
                                  ],
                                  rules: [
                                    {
                                      conditions: [
                                        {
                                          fn: "isSet",
                                          argv: [{ ref: "OperationType" }],
                                        },
                                      ],
                                      rules: [
                                        {
                                          conditions: [
                                            {
                                              fn: "booleanEquals",
                                              argv: [{ ref: "UseFIPS" }, true],
                                            },
                                            {
                                              fn: "booleanEquals",
                                              argv: [
                                                { ref: "UseDualStack" },
                                                true,
                                              ],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsFIPS",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [
                                                    {
                                                      fn: "booleanEquals",
                                                      argv: [
                                                        {
                                                          fn: "getAttr",
                                                          argv: [
                                                            {
                                                              ref: "PartitionResult",
                                                            },
                                                            "supportsDualStack",
                                                          ],
                                                        },
                                                        true,
                                                      ],
                                                    },
                                                  ],
                                                  rules: [
                                                    {
                                                      conditions: [],
                                                      endpoint: {
                                                        url: "https://{arn#accountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                                    "DualStack is enabled, but this partition does not support DualStack.",
                                                  type: "error",
                                                },
                                              ],
                                              type: "tree",
                                            },
                                            {
                                              conditions: [],
                                              error:
                                                "FIPS is enabled, but this partition does not support FIPS.",
                                              type: "error",
                                            },
                                          ],
                                          type: "tree",
                                        },
                                        {
                                          conditions: [
                                            {
                                              fn: "booleanEquals",
                                              argv: [{ ref: "UseFIPS" }, true],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsFIPS",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [],
                                                  endpoint: {
                                                    url: "https://{arn#accountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                            {
                                              fn: "booleanEquals",
                                              argv: [
                                                { ref: "UseDualStack" },
                                                true,
                                              ],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsDualStack",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [],
                                                  endpoint: {
                                                    url: "https://{arn#accountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                            url: "https://{arn#accountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dnsSuffix}",
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
                                        "Operation Type is not set. Please contact service team for resolution.",
                                      type: "error",
                                    },
                                  ],
                                  type: "tree",
                                },
                                {
                                  conditions: [],
                                  error:
                                    "Partition: {arn#partition} from ARN doesn't match with partition name: {PartitionResult#name}.",
                                  type: "error",
                                },
                              ],
                              type: "tree",
                            },
                            {
                              conditions: [],
                              error:
                                "Invalid ARN: Kinesis ARNs don't support `{arnType}` arn types.",
                              type: "error",
                            },
                          ],
                          type: "tree",
                        },
                        {
                          conditions: [],
                          error: "Invalid ARN: No ARN type specified",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "Invalid ARN: The ARN was not for the Kinesis service, found: {arn#service}.",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error: "Invalid ARN: Invalid region.",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              error: "Invalid ARN: Invalid account id.",
              type: "error",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid ARN: Failed to parse ARN.",
          type: "error",
        },
      ],
      type: "tree",
    },
    {
      conditions: [
        { fn: "isSet", argv: [{ ref: "ConsumerARN" }] },
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso-b",
              ],
            },
          ],
        },
      ],
      rules: [
        {
          conditions: [
            {
              fn: "aws.parseArn",
              argv: [{ ref: "ConsumerARN" }],
              assign: "arn",
            },
          ],
          rules: [
            {
              conditions: [
                {
                  fn: "isValidHostLabel",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "arn" }, "accountId"] },
                    false,
                  ],
                },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "isValidHostLabel",
                      argv: [
                        { fn: "getAttr", argv: [{ ref: "arn" }, "region"] },
                        false,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "arn" }, "service"],
                            },
                            "kinesis",
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "arn" }, "resourceId[0]"],
                              assign: "arnType",
                            },
                            {
                              fn: "not",
                              argv: [
                                {
                                  fn: "stringEquals",
                                  argv: [{ ref: "arnType" }, ""],
                                },
                              ],
                            },
                          ],
                          rules: [
                            {
                              conditions: [
                                {
                                  fn: "stringEquals",
                                  argv: [{ ref: "arnType" }, "stream"],
                                },
                              ],
                              rules: [
                                {
                                  conditions: [
                                    {
                                      fn: "stringEquals",
                                      argv: [
                                        {
                                          fn: "getAttr",
                                          argv: [
                                            { ref: "PartitionResult" },
                                            "name",
                                          ],
                                        },
                                        "{arn#partition}",
                                      ],
                                    },
                                  ],
                                  rules: [
                                    {
                                      conditions: [
                                        {
                                          fn: "isSet",
                                          argv: [{ ref: "OperationType" }],
                                        },
                                      ],
                                      rules: [
                                        {
                                          conditions: [
                                            {
                                              fn: "booleanEquals",
                                              argv: [{ ref: "UseFIPS" }, true],
                                            },
                                            {
                                              fn: "booleanEquals",
                                              argv: [
                                                { ref: "UseDualStack" },
                                                true,
                                              ],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsFIPS",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [
                                                    {
                                                      fn: "booleanEquals",
                                                      argv: [
                                                        {
                                                          fn: "getAttr",
                                                          argv: [
                                                            {
                                                              ref: "PartitionResult",
                                                            },
                                                            "supportsDualStack",
                                                          ],
                                                        },
                                                        true,
                                                      ],
                                                    },
                                                  ],
                                                  rules: [
                                                    {
                                                      conditions: [],
                                                      endpoint: {
                                                        url: "https://{arn#accountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                                    "DualStack is enabled, but this partition does not support DualStack.",
                                                  type: "error",
                                                },
                                              ],
                                              type: "tree",
                                            },
                                            {
                                              conditions: [],
                                              error:
                                                "FIPS is enabled, but this partition does not support FIPS.",
                                              type: "error",
                                            },
                                          ],
                                          type: "tree",
                                        },
                                        {
                                          conditions: [
                                            {
                                              fn: "booleanEquals",
                                              argv: [{ ref: "UseFIPS" }, true],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsFIPS",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [],
                                                  endpoint: {
                                                    url: "https://{arn#accountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                            {
                                              fn: "booleanEquals",
                                              argv: [
                                                { ref: "UseDualStack" },
                                                true,
                                              ],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsDualStack",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [],
                                                  endpoint: {
                                                    url: "https://{arn#accountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                            url: "https://{arn#accountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dnsSuffix}",
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
                                        "Operation Type is not set. Please contact service team for resolution.",
                                      type: "error",
                                    },
                                  ],
                                  type: "tree",
                                },
                                {
                                  conditions: [],
                                  error:
                                    "Partition: {arn#partition} from ARN doesn't match with partition name: {PartitionResult#name}.",
                                  type: "error",
                                },
                              ],
                              type: "tree",
                            },
                            {
                              conditions: [],
                              error:
                                "Invalid ARN: Kinesis ARNs don't support `{arnType}` arn types.",
                              type: "error",
                            },
                          ],
                          type: "tree",
                        },
                        {
                          conditions: [],
                          error: "Invalid ARN: No ARN type specified",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "Invalid ARN: The ARN was not for the Kinesis service, found: {arn#service}.",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error: "Invalid ARN: Invalid region.",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              error: "Invalid ARN: Invalid account id.",
              type: "error",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid ARN: Failed to parse ARN.",
          type: "error",
        },
      ],
      type: "tree",
    },
    {
      conditions: [
        { fn: "isSet", argv: [{ ref: "ResourceARN" }] },
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso",
              ],
            },
          ],
        },
        {
          fn: "not",
          argv: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-iso-b",
              ],
            },
          ],
        },
      ],
      rules: [
        {
          conditions: [
            {
              fn: "aws.parseArn",
              argv: [{ ref: "ResourceARN" }],
              assign: "arn",
            },
          ],
          rules: [
            {
              conditions: [
                {
                  fn: "isValidHostLabel",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "arn" }, "accountId"] },
                    false,
                  ],
                },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "isValidHostLabel",
                      argv: [
                        { fn: "getAttr", argv: [{ ref: "arn" }, "region"] },
                        false,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "arn" }, "service"],
                            },
                            "kinesis",
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "arn" }, "resourceId[0]"],
                              assign: "arnType",
                            },
                            {
                              fn: "not",
                              argv: [
                                {
                                  fn: "stringEquals",
                                  argv: [{ ref: "arnType" }, ""],
                                },
                              ],
                            },
                          ],
                          rules: [
                            {
                              conditions: [
                                {
                                  fn: "stringEquals",
                                  argv: [{ ref: "arnType" }, "stream"],
                                },
                              ],
                              rules: [
                                {
                                  conditions: [
                                    {
                                      fn: "stringEquals",
                                      argv: [
                                        {
                                          fn: "getAttr",
                                          argv: [
                                            { ref: "PartitionResult" },
                                            "name",
                                          ],
                                        },
                                        "{arn#partition}",
                                      ],
                                    },
                                  ],
                                  rules: [
                                    {
                                      conditions: [
                                        {
                                          fn: "isSet",
                                          argv: [{ ref: "OperationType" }],
                                        },
                                      ],
                                      rules: [
                                        {
                                          conditions: [
                                            {
                                              fn: "booleanEquals",
                                              argv: [{ ref: "UseFIPS" }, true],
                                            },
                                            {
                                              fn: "booleanEquals",
                                              argv: [
                                                { ref: "UseDualStack" },
                                                true,
                                              ],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsFIPS",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [
                                                    {
                                                      fn: "booleanEquals",
                                                      argv: [
                                                        {
                                                          fn: "getAttr",
                                                          argv: [
                                                            {
                                                              ref: "PartitionResult",
                                                            },
                                                            "supportsDualStack",
                                                          ],
                                                        },
                                                        true,
                                                      ],
                                                    },
                                                  ],
                                                  rules: [
                                                    {
                                                      conditions: [],
                                                      endpoint: {
                                                        url: "https://{arn#accountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                                    "DualStack is enabled, but this partition does not support DualStack.",
                                                  type: "error",
                                                },
                                              ],
                                              type: "tree",
                                            },
                                            {
                                              conditions: [],
                                              error:
                                                "FIPS is enabled, but this partition does not support FIPS.",
                                              type: "error",
                                            },
                                          ],
                                          type: "tree",
                                        },
                                        {
                                          conditions: [
                                            {
                                              fn: "booleanEquals",
                                              argv: [{ ref: "UseFIPS" }, true],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsFIPS",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [],
                                                  endpoint: {
                                                    url: "https://{arn#accountId}.{OperationType}-kinesis-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                            {
                                              fn: "booleanEquals",
                                              argv: [
                                                { ref: "UseDualStack" },
                                                true,
                                              ],
                                            },
                                          ],
                                          rules: [
                                            {
                                              conditions: [
                                                {
                                                  fn: "booleanEquals",
                                                  argv: [
                                                    {
                                                      fn: "getAttr",
                                                      argv: [
                                                        {
                                                          ref: "PartitionResult",
                                                        },
                                                        "supportsDualStack",
                                                      ],
                                                    },
                                                    true,
                                                  ],
                                                },
                                              ],
                                              rules: [
                                                {
                                                  conditions: [],
                                                  endpoint: {
                                                    url: "https://{arn#accountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                            url: "https://{arn#accountId}.{OperationType}-kinesis.{Region}.{PartitionResult#dnsSuffix}",
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
                                        "Operation Type is not set. Please contact service team for resolution.",
                                      type: "error",
                                    },
                                  ],
                                  type: "tree",
                                },
                                {
                                  conditions: [],
                                  error:
                                    "Partition: {arn#partition} from ARN doesn't match with partition name: {PartitionResult#name}.",
                                  type: "error",
                                },
                              ],
                              type: "tree",
                            },
                            {
                              conditions: [],
                              error:
                                "Invalid ARN: Kinesis ARNs don't support `{arnType}` arn types.",
                              type: "error",
                            },
                          ],
                          type: "tree",
                        },
                        {
                          conditions: [],
                          error: "Invalid ARN: No ARN type specified",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "Invalid ARN: The ARN was not for the Kinesis service, found: {arn#service}.",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error: "Invalid ARN: Invalid region.",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              error: "Invalid ARN: Invalid account id.",
              type: "error",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid ARN: Failed to parse ARN.",
          type: "error",
        },
      ],
      type: "tree",
    },
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
                        url: "https://kinesis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://kinesis.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://kinesis-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://kinesis.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://kinesis.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeAccountSettingsInput extends S.Class<DescribeAccountSettingsInput>(
  "DescribeAccountSettingsInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLimitsInput extends S.Class<DescribeLimitsInput>(
  "DescribeLimitsInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const MetricsNameList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DecreaseStreamRetentionPeriodInput extends S.Class<DecreaseStreamRetentionPeriodInput>(
  "DecreaseStreamRetentionPeriodInput",
)(
  {
    StreamName: S.optional(S.String),
    RetentionPeriodHours: S.Number,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class DecreaseStreamRetentionPeriodResponse extends S.Class<DecreaseStreamRetentionPeriodResponse>(
  "DecreaseStreamRetentionPeriodResponse",
)({}, ns) {}
export class DeleteResourcePolicyInput extends S.Class<DeleteResourcePolicyInput>(
  "DeleteResourcePolicyInput",
)(
  { ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}, ns) {}
export class DeleteStreamInput extends S.Class<DeleteStreamInput>(
  "DeleteStreamInput",
)(
  {
    StreamName: S.optional(S.String),
    EnforceConsumerDeletion: S.optional(S.Boolean),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class DeleteStreamResponse extends S.Class<DeleteStreamResponse>(
  "DeleteStreamResponse",
)({}, ns) {}
export class DeregisterStreamConsumerInput extends S.Class<DeregisterStreamConsumerInput>(
  "DeregisterStreamConsumerInput",
)(
  {
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
    ConsumerName: S.optional(S.String),
    ConsumerARN: S.optional(S.String).pipe(T.ContextParam("ConsumerARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class DeregisterStreamConsumerResponse extends S.Class<DeregisterStreamConsumerResponse>(
  "DeregisterStreamConsumerResponse",
)({}, ns) {}
export class DescribeLimitsOutput extends S.Class<DescribeLimitsOutput>(
  "DescribeLimitsOutput",
)(
  {
    ShardLimit: S.Number,
    OpenShardCount: S.Number,
    OnDemandStreamCount: S.Number,
    OnDemandStreamCountLimit: S.Number,
  },
  ns,
) {}
export class DescribeStreamInput extends S.Class<DescribeStreamInput>(
  "DescribeStreamInput",
)(
  {
    StreamName: S.optional(S.String),
    Limit: S.optional(S.Number),
    ExclusiveStartShardId: S.optional(S.String),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class DescribeStreamConsumerInput extends S.Class<DescribeStreamConsumerInput>(
  "DescribeStreamConsumerInput",
)(
  {
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
    ConsumerName: S.optional(S.String),
    ConsumerARN: S.optional(S.String).pipe(T.ContextParam("ConsumerARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class DescribeStreamSummaryInput extends S.Class<DescribeStreamSummaryInput>(
  "DescribeStreamSummaryInput",
)(
  {
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class DisableEnhancedMonitoringInput extends S.Class<DisableEnhancedMonitoringInput>(
  "DisableEnhancedMonitoringInput",
)(
  {
    StreamName: S.optional(S.String),
    ShardLevelMetrics: MetricsNameList,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class EnableEnhancedMonitoringInput extends S.Class<EnableEnhancedMonitoringInput>(
  "EnableEnhancedMonitoringInput",
)(
  {
    StreamName: S.optional(S.String),
    ShardLevelMetrics: MetricsNameList,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class GetRecordsInput extends S.Class<GetRecordsInput>(
  "GetRecordsInput",
)(
  {
    ShardIterator: S.String,
    Limit: S.optional(S.Number),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "data" } }),
  ),
) {}
export class GetResourcePolicyInput extends S.Class<GetResourcePolicyInput>(
  "GetResourcePolicyInput",
)(
  { ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class GetShardIteratorInput extends S.Class<GetShardIteratorInput>(
  "GetShardIteratorInput",
)(
  {
    StreamName: S.optional(S.String),
    ShardId: S.String,
    ShardIteratorType: S.String,
    StartingSequenceNumber: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "data" } }),
  ),
) {}
export class IncreaseStreamRetentionPeriodInput extends S.Class<IncreaseStreamRetentionPeriodInput>(
  "IncreaseStreamRetentionPeriodInput",
)(
  {
    StreamName: S.optional(S.String),
    RetentionPeriodHours: S.Number,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class IncreaseStreamRetentionPeriodResponse extends S.Class<IncreaseStreamRetentionPeriodResponse>(
  "IncreaseStreamRetentionPeriodResponse",
)({}, ns) {}
export class ListStreamConsumersInput extends S.Class<ListStreamConsumersInput>(
  "ListStreamConsumersInput",
)(
  {
    StreamARN: S.String.pipe(T.ContextParam("StreamARN")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StreamCreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class ListStreamsInput extends S.Class<ListStreamsInput>(
  "ListStreamsInput",
)(
  {
    Limit: S.optional(S.Number),
    ExclusiveStartStreamName: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class ListTagsForStreamInput extends S.Class<ListTagsForStreamInput>(
  "ListTagsForStreamInput",
)(
  {
    StreamName: S.optional(S.String),
    ExclusiveStartTagKey: S.optional(S.String),
    Limit: S.optional(S.Number),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class MergeShardsInput extends S.Class<MergeShardsInput>(
  "MergeShardsInput",
)(
  {
    StreamName: S.optional(S.String),
    ShardToMerge: S.String,
    AdjacentShardToMerge: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class MergeShardsResponse extends S.Class<MergeShardsResponse>(
  "MergeShardsResponse",
)({}, ns) {}
export class PutRecordInput extends S.Class<PutRecordInput>("PutRecordInput")(
  {
    StreamName: S.optional(S.String),
    Data: T.Blob,
    PartitionKey: S.String,
    ExplicitHashKey: S.optional(S.String),
    SequenceNumberForOrdering: S.optional(S.String),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "data" } }),
  ),
) {}
export class PutResourcePolicyInput extends S.Class<PutResourcePolicyInput>(
  "PutResourcePolicyInput",
)(
  {
    ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")),
    Policy: S.String,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({}, ns) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class RegisterStreamConsumerInput extends S.Class<RegisterStreamConsumerInput>(
  "RegisterStreamConsumerInput",
)(
  {
    StreamARN: S.String.pipe(T.ContextParam("StreamARN")),
    ConsumerName: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class RemoveTagsFromStreamInput extends S.Class<RemoveTagsFromStreamInput>(
  "RemoveTagsFromStreamInput",
)(
  {
    StreamName: S.optional(S.String),
    TagKeys: TagKeyList,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class RemoveTagsFromStreamResponse extends S.Class<RemoveTagsFromStreamResponse>(
  "RemoveTagsFromStreamResponse",
)({}, ns) {}
export class SplitShardInput extends S.Class<SplitShardInput>(
  "SplitShardInput",
)(
  {
    StreamName: S.optional(S.String),
    ShardToSplit: S.String,
    NewStartingHashKey: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class SplitShardResponse extends S.Class<SplitShardResponse>(
  "SplitShardResponse",
)({}, ns) {}
export class StartStreamEncryptionInput extends S.Class<StartStreamEncryptionInput>(
  "StartStreamEncryptionInput",
)(
  {
    StreamName: S.optional(S.String),
    EncryptionType: S.String,
    KeyId: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class StartStreamEncryptionResponse extends S.Class<StartStreamEncryptionResponse>(
  "StartStreamEncryptionResponse",
)({}, ns) {}
export class StopStreamEncryptionInput extends S.Class<StopStreamEncryptionInput>(
  "StopStreamEncryptionInput",
)(
  {
    StreamName: S.optional(S.String),
    EncryptionType: S.String,
    KeyId: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class StopStreamEncryptionResponse extends S.Class<StopStreamEncryptionResponse>(
  "StopStreamEncryptionResponse",
)({}, ns) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { Tags: TagMap, ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    TagKeys: TagKeyList,
    ResourceARN: S.String.pipe(T.ContextParam("ResourceARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UpdateMaxRecordSizeInput extends S.Class<UpdateMaxRecordSizeInput>(
  "UpdateMaxRecordSizeInput",
)(
  {
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
    MaxRecordSizeInKiB: S.Number,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class UpdateMaxRecordSizeResponse extends S.Class<UpdateMaxRecordSizeResponse>(
  "UpdateMaxRecordSizeResponse",
)({}, ns) {}
export class UpdateShardCountInput extends S.Class<UpdateShardCountInput>(
  "UpdateShardCountInput",
)(
  {
    StreamName: S.optional(S.String),
    TargetShardCount: S.Number,
    ScalingType: S.String,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class StreamModeDetails extends S.Class<StreamModeDetails>(
  "StreamModeDetails",
)({ StreamMode: S.String }) {}
export class UpdateStreamModeInput extends S.Class<UpdateStreamModeInput>(
  "UpdateStreamModeInput",
)(
  {
    StreamARN: S.String.pipe(T.ContextParam("StreamARN")),
    StreamModeDetails: StreamModeDetails,
    WarmThroughputMiBps: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class UpdateStreamModeResponse extends S.Class<UpdateStreamModeResponse>(
  "UpdateStreamModeResponse",
)({}, ns) {}
export class UpdateStreamWarmThroughputInput extends S.Class<UpdateStreamWarmThroughputInput>(
  "UpdateStreamWarmThroughputInput",
)(
  {
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
    StreamName: S.optional(S.String),
    WarmThroughputMiBps: S.Number,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class MinimumThroughputBillingCommitmentOutput extends S.Class<MinimumThroughputBillingCommitmentOutput>(
  "MinimumThroughputBillingCommitmentOutput",
)({
  Status: S.String,
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EarliestAllowedEndAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ShardFilter extends S.Class<ShardFilter>("ShardFilter")({
  Type: S.String,
  ShardId: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const StreamNameList = S.Array(S.String);
export class PutRecordsRequestEntry extends S.Class<PutRecordsRequestEntry>(
  "PutRecordsRequestEntry",
)({
  Data: T.Blob,
  ExplicitHashKey: S.optional(S.String),
  PartitionKey: S.String,
}) {}
export const PutRecordsRequestEntryList = S.Array(PutRecordsRequestEntry);
export class StartingPosition extends S.Class<StartingPosition>(
  "StartingPosition",
)({
  Type: S.String,
  SequenceNumber: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class MinimumThroughputBillingCommitmentInput extends S.Class<MinimumThroughputBillingCommitmentInput>(
  "MinimumThroughputBillingCommitmentInput",
)({ Status: S.String }) {}
export class AddTagsToStreamInput extends S.Class<AddTagsToStreamInput>(
  "AddTagsToStreamInput",
)(
  {
    StreamName: S.optional(S.String),
    Tags: TagMap,
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class AddTagsToStreamResponse extends S.Class<AddTagsToStreamResponse>(
  "AddTagsToStreamResponse",
)({}, ns) {}
export class CreateStreamInput extends S.Class<CreateStreamInput>(
  "CreateStreamInput",
)(
  {
    StreamName: S.String,
    ShardCount: S.optional(S.Number),
    StreamModeDetails: S.optional(StreamModeDetails),
    Tags: S.optional(TagMap),
    WarmThroughputMiBps: S.optional(S.Number),
    MaxRecordSizeInKiB: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStreamResponse extends S.Class<CreateStreamResponse>(
  "CreateStreamResponse",
)({}, ns) {}
export class DescribeAccountSettingsOutput extends S.Class<DescribeAccountSettingsOutput>(
  "DescribeAccountSettingsOutput",
)(
  {
    MinimumThroughputBillingCommitment: S.optional(
      MinimumThroughputBillingCommitmentOutput,
    ),
  },
  ns,
) {}
export class EnhancedMonitoringOutput extends S.Class<EnhancedMonitoringOutput>(
  "EnhancedMonitoringOutput",
)(
  {
    StreamName: S.optional(S.String),
    CurrentShardLevelMetrics: S.optional(MetricsNameList),
    DesiredShardLevelMetrics: S.optional(MetricsNameList),
    StreamARN: S.optional(S.String),
  },
  ns,
) {}
export class GetResourcePolicyOutput extends S.Class<GetResourcePolicyOutput>(
  "GetResourcePolicyOutput",
)({ Policy: S.String }, ns) {}
export class GetShardIteratorOutput extends S.Class<GetShardIteratorOutput>(
  "GetShardIteratorOutput",
)({ ShardIterator: S.optional(S.String) }, ns) {}
export class ListShardsInput extends S.Class<ListShardsInput>(
  "ListShardsInput",
)(
  {
    StreamName: S.optional(S.String),
    NextToken: S.optional(S.String),
    ExclusiveStartShardId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StreamCreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ShardFilter: S.optional(ShardFilter),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "control" } }),
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class ListTagsForStreamOutput extends S.Class<ListTagsForStreamOutput>(
  "ListTagsForStreamOutput",
)({ Tags: TagList, HasMoreTags: S.Boolean }, ns) {}
export class PutRecordOutput extends S.Class<PutRecordOutput>(
  "PutRecordOutput",
)(
  {
    ShardId: S.String,
    SequenceNumber: S.String,
    EncryptionType: S.optional(S.String),
  },
  ns,
) {}
export class PutRecordsInput extends S.Class<PutRecordsInput>(
  "PutRecordsInput",
)(
  {
    Records: PutRecordsRequestEntryList,
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String).pipe(T.ContextParam("StreamARN")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "data" } }),
  ),
) {}
export class Consumer extends S.Class<Consumer>("Consumer")({
  ConsumerName: S.String,
  ConsumerARN: S.String,
  ConsumerStatus: S.String,
  ConsumerCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class RegisterStreamConsumerOutput extends S.Class<RegisterStreamConsumerOutput>(
  "RegisterStreamConsumerOutput",
)({ Consumer: Consumer }, ns) {}
export class SubscribeToShardInput extends S.Class<SubscribeToShardInput>(
  "SubscribeToShardInput",
)(
  {
    ConsumerARN: S.String.pipe(T.ContextParam("ConsumerARN")),
    ShardId: S.String,
    StartingPosition: StartingPosition,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ OperationType: { value: "data" } }),
  ),
) {}
export class UpdateAccountSettingsInput extends S.Class<UpdateAccountSettingsInput>(
  "UpdateAccountSettingsInput",
)(
  {
    MinimumThroughputBillingCommitment: MinimumThroughputBillingCommitmentInput,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateShardCountOutput extends S.Class<UpdateShardCountOutput>(
  "UpdateShardCountOutput",
)(
  {
    StreamName: S.optional(S.String),
    CurrentShardCount: S.optional(S.Number),
    TargetShardCount: S.optional(S.Number),
    StreamARN: S.optional(S.String),
  },
  ns,
) {}
export const ShardIdList = S.Array(S.String);
export class ConsumerDescription extends S.Class<ConsumerDescription>(
  "ConsumerDescription",
)({
  ConsumerName: S.String,
  ConsumerARN: S.String,
  ConsumerStatus: S.String,
  ConsumerCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StreamARN: S.String,
}) {}
export class EnhancedMetrics extends S.Class<EnhancedMetrics>(
  "EnhancedMetrics",
)({ ShardLevelMetrics: S.optional(MetricsNameList) }) {}
export const EnhancedMonitoringList = S.Array(EnhancedMetrics);
export class WarmThroughputObject extends S.Class<WarmThroughputObject>(
  "WarmThroughputObject",
)({ TargetMiBps: S.optional(S.Number), CurrentMiBps: S.optional(S.Number) }) {}
export class StreamDescriptionSummary extends S.Class<StreamDescriptionSummary>(
  "StreamDescriptionSummary",
)({
  StreamName: S.String,
  StreamARN: S.String,
  StreamStatus: S.String,
  StreamModeDetails: S.optional(StreamModeDetails),
  RetentionPeriodHours: S.Number,
  StreamCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EnhancedMonitoring: EnhancedMonitoringList,
  EncryptionType: S.optional(S.String),
  KeyId: S.optional(S.String),
  OpenShardCount: S.Number,
  ConsumerCount: S.optional(S.Number),
  WarmThroughput: S.optional(WarmThroughputObject),
  MaxRecordSizeInKiB: S.optional(S.Number),
}) {}
export class Record extends S.Class<Record>("Record")({
  SequenceNumber: S.String,
  ApproximateArrivalTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Data: T.Blob,
  PartitionKey: S.String,
  EncryptionType: S.optional(S.String),
}) {}
export const RecordList = S.Array(Record);
export const ConsumerList = S.Array(Consumer);
export class StreamSummary extends S.Class<StreamSummary>("StreamSummary")({
  StreamName: S.String,
  StreamARN: S.String,
  StreamStatus: S.String,
  StreamModeDetails: S.optional(StreamModeDetails),
  StreamCreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const StreamSummaryList = S.Array(StreamSummary);
export class DescribeStreamConsumerOutput extends S.Class<DescribeStreamConsumerOutput>(
  "DescribeStreamConsumerOutput",
)({ ConsumerDescription: ConsumerDescription }, ns) {}
export class DescribeStreamSummaryOutput extends S.Class<DescribeStreamSummaryOutput>(
  "DescribeStreamSummaryOutput",
)({ StreamDescriptionSummary: StreamDescriptionSummary }, ns) {}
export class HashKeyRange extends S.Class<HashKeyRange>("HashKeyRange")({
  StartingHashKey: S.String,
  EndingHashKey: S.String,
}) {}
export class SequenceNumberRange extends S.Class<SequenceNumberRange>(
  "SequenceNumberRange",
)({
  StartingSequenceNumber: S.String,
  EndingSequenceNumber: S.optional(S.String),
}) {}
export class Shard extends S.Class<Shard>("Shard")({
  ShardId: S.String,
  ParentShardId: S.optional(S.String),
  AdjacentParentShardId: S.optional(S.String),
  HashKeyRange: HashKeyRange,
  SequenceNumberRange: SequenceNumberRange,
}) {}
export const ShardList = S.Array(Shard);
export class ListShardsOutput extends S.Class<ListShardsOutput>(
  "ListShardsOutput",
)({ Shards: S.optional(ShardList), NextToken: S.optional(S.String) }, ns) {}
export class ListStreamConsumersOutput extends S.Class<ListStreamConsumersOutput>(
  "ListStreamConsumersOutput",
)(
  { Consumers: S.optional(ConsumerList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListStreamsOutput extends S.Class<ListStreamsOutput>(
  "ListStreamsOutput",
)(
  {
    StreamNames: StreamNameList,
    HasMoreStreams: S.Boolean,
    NextToken: S.optional(S.String),
    StreamSummaries: S.optional(StreamSummaryList),
  },
  ns,
) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagList) }, ns) {}
export class UpdateAccountSettingsOutput extends S.Class<UpdateAccountSettingsOutput>(
  "UpdateAccountSettingsOutput",
)(
  {
    MinimumThroughputBillingCommitment: S.optional(
      MinimumThroughputBillingCommitmentOutput,
    ),
  },
  ns,
) {}
export class UpdateStreamWarmThroughputOutput extends S.Class<UpdateStreamWarmThroughputOutput>(
  "UpdateStreamWarmThroughputOutput",
)(
  {
    StreamARN: S.optional(S.String),
    StreamName: S.optional(S.String),
    WarmThroughput: S.optional(WarmThroughputObject),
  },
  ns,
) {}
export class ChildShard extends S.Class<ChildShard>("ChildShard")({
  ShardId: S.String,
  ParentShards: ShardIdList,
  HashKeyRange: HashKeyRange,
}) {}
export const ChildShardList = S.Array(ChildShard);
export class PutRecordsResultEntry extends S.Class<PutRecordsResultEntry>(
  "PutRecordsResultEntry",
)({
  SequenceNumber: S.optional(S.String),
  ShardId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const PutRecordsResultEntryList = S.Array(PutRecordsResultEntry);
export class GetRecordsOutput extends S.Class<GetRecordsOutput>(
  "GetRecordsOutput",
)(
  {
    Records: RecordList,
    NextShardIterator: S.optional(S.String),
    MillisBehindLatest: S.optional(S.Number),
    ChildShards: S.optional(ChildShardList),
  },
  ns,
) {}
export class PutRecordsOutput extends S.Class<PutRecordsOutput>(
  "PutRecordsOutput",
)(
  {
    FailedRecordCount: S.optional(S.Number),
    Records: PutRecordsResultEntryList,
    EncryptionType: S.optional(S.String),
  },
  ns,
) {}
export class SubscribeToShardEvent extends S.Class<SubscribeToShardEvent>(
  "SubscribeToShardEvent",
)({
  Records: RecordList,
  ContinuationSequenceNumber: S.String,
  MillisBehindLatest: S.Number,
  ChildShards: S.optional(ChildShardList),
}) {}
export class StreamDescription extends S.Class<StreamDescription>(
  "StreamDescription",
)({
  StreamName: S.String,
  StreamARN: S.String,
  StreamStatus: S.String,
  StreamModeDetails: S.optional(StreamModeDetails),
  Shards: ShardList,
  HasMoreShards: S.Boolean,
  RetentionPeriodHours: S.Number,
  StreamCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EnhancedMonitoring: EnhancedMonitoringList,
  EncryptionType: S.optional(S.String),
  KeyId: S.optional(S.String),
}) {}
export const SubscribeToShardEventStream = T.EventStream(
  S.Union(
    S.Struct({ SubscribeToShardEvent: SubscribeToShardEvent }),
    S.Struct({
      ResourceNotFoundException: S.suspend(() => ResourceNotFoundException),
    }),
    S.Struct({
      ResourceInUseException: S.suspend(() => ResourceInUseException),
    }),
    S.Struct({ KMSDisabledException: S.suspend(() => KMSDisabledException) }),
    S.Struct({
      KMSInvalidStateException: S.suspend(() => KMSInvalidStateException),
    }),
    S.Struct({
      KMSAccessDeniedException: S.suspend(() => KMSAccessDeniedException),
    }),
    S.Struct({ KMSNotFoundException: S.suspend(() => KMSNotFoundException) }),
    S.Struct({ KMSOptInRequired: S.suspend(() => KMSOptInRequired) }),
    S.Struct({
      KMSThrottlingException: S.suspend(() => KMSThrottlingException),
    }),
    S.Struct({
      InternalFailureException: S.suspend(() => InternalFailureException),
    }),
  ),
);
export class DescribeStreamOutput extends S.Class<DescribeStreamOutput>(
  "DescribeStreamOutput",
)({ StreamDescription: StreamDescription }, ns) {}
export class SubscribeToShardOutput extends S.Class<SubscribeToShardOutput>(
  "SubscribeToShardOutput",
)({ EventStream: SubscribeToShardEventStream }, ns) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class KMSAccessDeniedException extends S.TaggedError<KMSAccessDeniedException>()(
  "KMSAccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ProvisionedThroughputExceededException extends S.TaggedError<ProvisionedThroughputExceededException>()(
  "ProvisionedThroughputExceededException",
  { message: S.optional(S.String) },
) {}
export class ExpiredNextTokenException extends S.TaggedError<ExpiredNextTokenException>()(
  "ExpiredNextTokenException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class KMSDisabledException extends S.TaggedError<KMSDisabledException>()(
  "KMSDisabledException",
  { message: S.optional(S.String) },
) {}
export class KMSInvalidStateException extends S.TaggedError<KMSInvalidStateException>()(
  "KMSInvalidStateException",
  { message: S.optional(S.String) },
) {}
export class KMSNotFoundException extends S.TaggedError<KMSNotFoundException>()(
  "KMSNotFoundException",
  { message: S.optional(S.String) },
) {}
export class KMSOptInRequired extends S.TaggedError<KMSOptInRequired>()(
  "KMSOptInRequired",
  { message: S.optional(S.String) },
) {}
export class KMSThrottlingException extends S.TaggedError<KMSThrottlingException>()(
  "KMSThrottlingException",
  { message: S.optional(S.String) },
) {}
export class ExpiredIteratorException extends S.TaggedError<ExpiredIteratorException>()(
  "ExpiredIteratorException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes the shard limits and usage for the account.
 *
 * If you update your account limits, the old limits might be returned for a few
 * minutes.
 *
 * This operation has a limit of one transaction per second per account.
 */
export const describeLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLimitsInput,
  output: DescribeLimitsOutput,
  errors: [LimitExceededException],
}));
/**
 * Describes the account-level settings for Amazon Kinesis Data Streams. This operation returns information about the minimum throughput billing commitments and other account-level configurations.
 *
 * This API has a call limit of 5 transactions per second (TPS) for each Amazon Web Services account. TPS over 5 will initiate the `LimitExceededException`.
 */
export const describeAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountSettingsInput,
    output: DescribeAccountSettingsOutput,
    errors: [LimitExceededException],
  }),
);
/**
 * Lists the tags for the specified Kinesis data stream. This operation has a limit of
 * five transactions per second per account.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 */
export const listTagsForStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForStreamInput,
  output: ListTagsForStreamOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a policy attached to the specified data stream or consumer. Request patterns can be one of the following:
 *
 * - Data stream pattern: `arn:aws.*:kinesis:.*:\d{12}:.*stream/\S+`
 *
 * - Consumer pattern: `^(arn):aws.*:kinesis:.*:\d{12}:.*stream\/[a-zA-Z0-9_.-]+\/consumer\/[a-zA-Z0-9_.-]+:[0-9]+`
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyInput,
  output: GetResourcePolicyOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Registers a consumer with a Kinesis data stream. When you use this operation, the
 * consumer you register can then call SubscribeToShard to receive data
 * from the stream using enhanced fan-out, at a rate of up to 2 MiB per second for every
 * shard you subscribe to. This rate is unaffected by the total number of consumers that
 * read from the same stream.
 *
 * You can add tags to the registered consumer when making a `RegisterStreamConsumer` request by setting the `Tags` parameter. If you pass the `Tags` parameter, in addition to having the `kinesis:RegisterStreamConsumer` permission, you must also have the `kinesis:TagResource` permission for the consumer that will be registered. Tags will take effect from the `CREATING` status of the consumer.
 *
 * With On-demand Advantage streams, you can register up to 50 consumers per stream to use Enhanced Fan-out. With On-demand Standard and Provisioned streams, you can register up to 20 consumers per stream to use Enhanced Fan-out. A given consumer can only be
 * registered with one stream at a time.
 *
 * For an example of how to use this operation, see Enhanced Fan-Out
 * Using the Kinesis Data Streams API.
 *
 * The use of this operation has a limit of five transactions per second per account.
 * Also, only 5 consumers can be created simultaneously. In other words, you cannot have
 * more than 5 consumers in a `CREATING` status at the same time. Registering a
 * 6th consumer while there are 5 in a `CREATING` status results in a
 * `LimitExceededException`.
 */
export const registerStreamConsumer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterStreamConsumerInput,
    output: RegisterStreamConsumerOutput,
    errors: [
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Delete a policy for the specified data stream or consumer. Request patterns can be one of the following:
 *
 * - Data stream pattern: `arn:aws.*:kinesis:.*:\d{12}:.*stream/\S+`
 *
 * - Consumer pattern: `^(arn):aws.*:kinesis:.*:\d{12}:.*stream\/[a-zA-Z0-9_.-]+\/consumer\/[a-zA-Z0-9_.-]+:[0-9]+`
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyInput,
    output: DeleteResourcePolicyResponse,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a Kinesis data stream and all its shards and data. You must shut down any
 * applications that are operating on the stream before you delete the stream. If an
 * application attempts to operate on a deleted stream, it receives the exception
 * `ResourceNotFoundException`.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * If the stream is in the `ACTIVE` state, you can delete it. After a
 * `DeleteStream` request, the specified stream is in the
 * `DELETING` state until Kinesis Data Streams completes the
 * deletion.
 *
 * **Note:** Kinesis Data Streams might continue to accept
 * data read and write operations, such as PutRecord, PutRecords, and GetRecords, on a stream in the
 * `DELETING` state until the stream deletion is complete.
 *
 * When you delete a stream, any shards in that stream are also deleted, and any tags are
 * dissociated from the stream.
 *
 * You can use the DescribeStreamSummary operation to check the state
 * of the stream, which is returned in `StreamStatus`.
 *
 * DeleteStream has a limit of five transactions per second per
 * account.
 */
export const deleteStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStreamInput,
  output: DeleteStreamResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Enables enhanced Kinesis data stream monitoring for shard-level metrics.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 */
export const enableEnhancedMonitoring = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EnableEnhancedMonitoringInput,
    output: EnhancedMonitoringOutput,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Increases the Kinesis data stream's retention period, which is the length of time data
 * records are accessible after they are added to the stream. The maximum value of a
 * stream's retention period is 8760 hours (365 days).
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * If you choose a longer stream retention period, this operation increases the time
 * period during which records that have not yet expired are accessible. However, it does
 * not make previous, expired data (older than the stream's previous retention period)
 * accessible after the operation has been called. For example, if a stream's retention
 * period is set to 24 hours and is increased to 168 hours, any data that is older than 24
 * hours remains inaccessible to consumer applications.
 */
export const increaseStreamRetentionPeriod =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: IncreaseStreamRetentionPeriodInput,
    output: IncreaseStreamRetentionPeriodResponse,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Attaches a resource-based policy to a data stream or registered consumer. If you are using an identity other than the root user of
 * the Amazon Web Services account that owns the resource, the calling identity must have the `PutResourcePolicy` permissions on the
 * specified Kinesis Data Streams resource and belong to the owner's account in order to use this operation.
 * If you don't have `PutResourcePolicy` permissions, Amazon Kinesis Data Streams returns a `403 Access Denied error`.
 * If you receive a `ResourceNotFoundException`, check to see if you passed a valid stream or consumer resource.
 *
 * Request patterns can be one of the following:
 *
 * - Data stream pattern: `arn:aws.*:kinesis:.*:\d{12}:.*stream/\S+`
 *
 * - Consumer pattern: `^(arn):aws.*:kinesis:.*:\d{12}:.*stream\/[a-zA-Z0-9_.-]+\/consumer\/[a-zA-Z0-9_.-]+:[0-9]+`
 *
 * For more information, see Controlling Access to Amazon Kinesis Data Streams Resources Using IAM.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyInput,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes tags from the specified Kinesis data stream. Removed tags are deleted and
 * cannot be recovered after this operation successfully completes.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * If you specify a tag that does not exist, it is ignored.
 *
 * RemoveTagsFromStream has a limit of five transactions per second per
 * account.
 */
export const removeTagsFromStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTagsFromStreamInput,
    output: RemoveTagsFromStreamResponse,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Disables server-side encryption for a specified stream.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Stopping encryption is an asynchronous operation. Upon receiving the request, Kinesis
 * Data Streams returns immediately and sets the status of the stream to
 * `UPDATING`. After the update is complete, Kinesis Data Streams sets the
 * status of the stream back to `ACTIVE`. Stopping encryption normally takes a
 * few seconds to complete, but it can take minutes. You can continue to read and write
 * data to your stream while its status is `UPDATING`. Once the status of the
 * stream is `ACTIVE`, records written to the stream are no longer encrypted by
 * Kinesis Data Streams.
 *
 * API Limits: You can successfully disable server-side encryption 25 times in a rolling
 * 24-hour period.
 *
 * Note: It can take up to 5 seconds after the stream is in an `ACTIVE` status
 * before all records written to the stream are no longer subject to encryption. After you
 * disabled encryption, you can verify that encryption is not applied by inspecting the API
 * response from `PutRecord` or `PutRecords`.
 */
export const stopStreamEncryption = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopStreamEncryptionInput,
    output: StopStreamEncryptionResponse,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Adds or updates tags for the specified Kinesis resource. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources. You can assign up to 50 tags to a Kinesis resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes tags from the specified Kinesis resource. Removed tags are deleted and can't be recovered after this operation completes successfully.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds or updates tags for the specified Kinesis data stream. You can assign up to 50
 * tags to a data stream.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * If tags have already been assigned to the stream, `AddTagsToStream`
 * overwrites any existing tags that correspond to the specified tag keys.
 *
 * AddTagsToStream has a limit of five transactions per second per
 * account.
 */
export const addTagsToStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToStreamInput,
  output: AddTagsToStreamResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Decreases the Kinesis data stream's retention period, which is the length of time data
 * records are accessible after they are added to the stream. The minimum value of a
 * stream's retention period is 24 hours.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * This operation may result in lost data. For example, if the stream's retention period
 * is 48 hours and is decreased to 24 hours, any data already in the stream that is older
 * than 24 hours is inaccessible.
 */
export const decreaseStreamRetentionPeriod =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DecreaseStreamRetentionPeriodInput,
    output: DecreaseStreamRetentionPeriodResponse,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * To deregister a consumer, provide its ARN. Alternatively, you can provide the ARN of
 * the data stream and the name you gave the consumer when you registered it. You may also
 * provide all three parameters, as long as they don't conflict with each other. If you
 * don't know the name or ARN of the consumer that you want to deregister, you can use the
 * ListStreamConsumers operation to get a list of the descriptions of
 * all the consumers that are currently registered with a given data stream. The
 * description of a consumer contains its name and ARN.
 *
 * This operation has a limit of five transactions per second per stream.
 */
export const deregisterStreamConsumer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterStreamConsumerInput,
    output: DeregisterStreamConsumerResponse,
    errors: [
      InvalidArgumentException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * To get the description of a registered consumer, provide the ARN of the consumer.
 * Alternatively, you can provide the ARN of the data stream and the name you gave the
 * consumer when you registered it. You may also provide all three parameters, as long as
 * they don't conflict with each other. If you don't know the name or ARN of the consumer
 * that you want to describe, you can use the ListStreamConsumers
 * operation to get a list of the descriptions of all the consumers that are currently
 * registered with a given data stream.
 *
 * This operation has a limit of 20 transactions per second per stream.
 *
 * When making a cross-account call with `DescribeStreamConsumer`, make sure to provide the ARN of the consumer.
 */
export const describeStreamConsumer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStreamConsumerInput,
    output: DescribeStreamConsumerOutput,
    errors: [
      InvalidArgumentException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Provides a summarized description of the specified Kinesis data stream without the
 * shard list.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * The information returned includes the stream name, Amazon Resource Name (ARN), status,
 * record retention period, approximate creation time, monitoring, encryption details, and
 * open shard count.
 *
 * DescribeStreamSummary has a limit of 20 transactions per second per
 * account.
 */
export const describeStreamSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStreamSummaryInput,
    output: DescribeStreamSummaryOutput,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Disables enhanced monitoring.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 */
export const disableEnhancedMonitoring = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisableEnhancedMonitoringInput,
    output: EnhancedMonitoringOutput,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * List all tags added to the specified Kinesis resource. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
 *
 * For more information about tagging Kinesis resources, see Tag your Amazon Kinesis Data Streams resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets an Amazon Kinesis shard iterator. A shard iterator expires 5 minutes after it is
 * returned to the requester.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * A shard iterator specifies the shard position from which to start reading data records
 * sequentially. The position is specified using the sequence number of a data record in a
 * shard. A sequence number is the identifier associated with every record ingested in the
 * stream, and is assigned when a record is put into the stream. Each stream has one or
 * more shards.
 *
 * You must specify the shard iterator type. For example, you can set the
 * `ShardIteratorType` parameter to read exactly from the position denoted
 * by a specific sequence number by using the `AT_SEQUENCE_NUMBER` shard
 * iterator type. Alternatively, the parameter can read right after the sequence number by
 * using the `AFTER_SEQUENCE_NUMBER` shard iterator type, using sequence numbers
 * returned by earlier calls to PutRecord, PutRecords,
 * GetRecords, or DescribeStream. In the request,
 * you can specify the shard iterator type `AT_TIMESTAMP` to read records from
 * an arbitrary point in time, `TRIM_HORIZON` to cause
 * `ShardIterator` to point to the last untrimmed record in the shard in the
 * system (the oldest data record in the shard), or `LATEST` so that you always
 * read the most recent data in the shard.
 *
 * When you read repeatedly from a stream, use a GetShardIterator
 * request to get the first shard iterator for use in your first GetRecords request and for subsequent reads use the shard iterator returned by the GetRecords request in `NextShardIterator`. A new shard
 * iterator is returned by every GetRecords request in
 * `NextShardIterator`, which you use in the `ShardIterator`
 * parameter of the next GetRecords request.
 *
 * If a GetShardIterator request is made too often, you receive a
 * `ProvisionedThroughputExceededException`. For more information about
 * throughput limits, see GetRecords, and Streams Limits in the
 * *Amazon Kinesis Data Streams Developer Guide*.
 *
 * If the shard is closed, GetShardIterator returns a valid iterator
 * for the last sequence number of the shard. A shard can be closed as a result of using
 * SplitShard or MergeShards.
 *
 * GetShardIterator has a limit of five transactions per second per
 * account per open shard.
 */
export const getShardIterator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetShardIteratorInput,
  output: GetShardIteratorOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidArgumentException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the shards in a stream and provides information about each shard. This operation
 * has a limit of 1000 transactions per second per data stream.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * This action does not list expired shards. For information about expired shards, see
 * Data Routing, Data Persistence, and Shard State after a Reshard.
 *
 * This API is a new operation that is used by the Amazon Kinesis Client Library
 * (KCL). If you have a fine-grained IAM policy that only allows specific operations,
 * you must update your policy to allow calls to this API. For more information, see
 * Controlling Access to Amazon Kinesis Data Streams Resources Using
 * IAM.
 */
export const listShards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListShardsInput,
  output: ListShardsOutput,
  errors: [
    AccessDeniedException,
    ExpiredNextTokenException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the account-level settings for Amazon Kinesis Data Streams.
 *
 * Updating account settings is a synchronous operation. Upon receiving the request, Kinesis Data Streams will return immediately with your account’s updated settings.
 *
 * **API limits**
 *
 * - Certain account configurations have minimum commitment windows. Attempting to update your settings prior to the end of the minimum commitment window might have certain restrictions.
 *
 * - This API has a call limit of 5 transactions per second (TPS) for each Amazon Web Services account. TPS over 5 will initiate the `LimitExceededException`.
 */
export const updateAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountSettingsInput,
    output: UpdateAccountSettingsOutput,
    errors: [
      InvalidArgumentException,
      LimitExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the consumers registered to receive data from a stream using enhanced fan-out,
 * and provides information about each consumer.
 *
 * This operation has a limit of 5 transactions per second per stream.
 */
export const listStreamConsumers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListStreamConsumersInput,
    output: ListStreamConsumersOutput,
    errors: [
      ExpiredNextTokenException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists your Kinesis data streams.
 *
 * The number of streams may be too large to return from a single call to
 * `ListStreams`. You can limit the number of returned streams using the
 * `Limit` parameter. If you do not specify a value for the
 * `Limit` parameter, Kinesis Data Streams uses the default limit, which is
 * currently 100.
 *
 * You can detect if there are more streams available to list by using the
 * `HasMoreStreams` flag from the returned output. If there are more streams
 * available, you can request more streams by using the name of the last stream returned by
 * the `ListStreams` request in the `ExclusiveStartStreamName`
 * parameter in a subsequent request to `ListStreams`. The group of stream names
 * returned by the subsequent request is then added to the list. You can continue this
 * process until all the stream names have been collected in the list.
 *
 * ListStreams has a limit of five transactions per second per
 * account.
 */
export const listStreams = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListStreamsInput,
    output: ListStreamsOutput,
    errors: [
      ExpiredNextTokenException,
      InvalidArgumentException,
      LimitExceededException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "Limit",
    } as const,
  }),
);
/**
 * Updates the warm throughput configuration for the specified Amazon Kinesis Data Streams on-demand data stream. This operation allows you to proactively scale your on-demand data stream to a specified throughput level, enabling better performance for sudden traffic spikes.
 *
 * When invoking this API, you must use either the `StreamARN` or the `StreamName` parameter, or both. It is recommended that you use the `StreamARN` input parameter when you invoke this API.
 *
 * Updating the warm throughput is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to `UPDATING`. After the update is complete, Kinesis Data Streams sets the status of the stream back to `ACTIVE`. Depending on the size of the stream, the scaling action could take a few minutes to complete. You can continue to read and write data to your stream while its status is `UPDATING`.
 *
 * This operation is only supported for data streams with the on-demand capacity mode in accounts that have `MinimumThroughputBillingCommitment` enabled. Provisioned capacity mode streams do not support warm throughput configuration.
 *
 * This operation has the following default limits. By default, you cannot do the following:
 *
 * - Scale to more than 10 GiBps for an on-demand stream.
 *
 * - This API has a call limit of 5 transactions per second (TPS) for each Amazon Web Services account. TPS over 5 will initiate the `LimitExceededException`.
 *
 * For the default limits for an Amazon Web Services account, see Streams Limits in the Amazon Kinesis Data Streams Developer
 * Guide. To request an increase in the call rate limit, the shard limit for this API, or your overall shard limit, use the limits form.
 */
export const updateStreamWarmThroughput = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateStreamWarmThroughputInput,
    output: UpdateStreamWarmThroughputOutput,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the shard count of the specified stream to the specified number of shards.
 * This API is only supported for the data streams with the provisioned capacity
 * mode.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Updating the shard count is an asynchronous operation. Upon receiving the request,
 * Kinesis Data Streams returns immediately and sets the status of the stream to
 * `UPDATING`. After the update is complete, Kinesis Data Streams sets the
 * status of the stream back to `ACTIVE`. Depending on the size of the stream,
 * the scaling action could take a few minutes to complete. You can continue to read and
 * write data to your stream while its status is `UPDATING`.
 *
 * To update the shard count, Kinesis Data Streams performs splits or merges on
 * individual shards. This can cause short-lived shards to be created, in addition to the
 * final shards. These short-lived shards count towards your total shard limit for your
 * account in the Region.
 *
 * When using this operation, we recommend that you specify a target shard count that is
 * a multiple of 25% (25%, 50%, 75%, 100%). You can specify any target value within your
 * shard limit. However, if you specify a target that isn't a multiple of 25%, the scaling
 * action might take longer to complete.
 *
 * This operation has the following default limits. By default, you cannot do the
 * following:
 *
 * - Scale more than ten times per rolling 24-hour period per stream
 *
 * - Scale up to more than double your current shard count for a stream
 *
 * - Scale down below half your current shard count for a stream
 *
 * - Scale up to more than 10000 shards in a stream
 *
 * - Scale a stream with more than 10000 shards down unless the result is less than
 * 10000 shards
 *
 * - Scale up to more than the shard limit for your account
 *
 * - Make over 10 TPS. TPS over 10 will trigger the LimitExceededException
 *
 * For the default limits for an Amazon Web Services account, see Streams
 * Limits in the Amazon Kinesis Data Streams Developer
 * Guide. To request an increase in the call rate limit, the shard limit for
 * this API, or your overall shard limit, use the limits form.
 */
export const updateShardCount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateShardCountInput,
  output: UpdateShardCountOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Merges two adjacent shards in a Kinesis data stream and combines them into a single
 * shard to reduce the stream's capacity to ingest and transport data. This API is only
 * supported for the data streams with the provisioned capacity mode. Two shards are
 * considered adjacent if the union of the hash key ranges for the two shards form a
 * contiguous set with no gaps. For example, if you have two shards, one with a hash key
 * range of 276...381 and the other with a hash key range of 382...454, then you could
 * merge these two shards into a single shard that would have a hash key range of
 * 276...454. After the merge, the single child shard receives data for all hash key values
 * covered by the two parent shards.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * `MergeShards` is called when there is a need to reduce the overall capacity
 * of a stream because of excess capacity that is not being used. You must specify the
 * shard to be merged and the adjacent shard for a stream. For more information about
 * merging shards, see Merge Two
 * Shards in the Amazon Kinesis Data Streams Developer
 * Guide.
 *
 * If the stream is in the `ACTIVE` state, you can call
 * `MergeShards`. If a stream is in the `CREATING`,
 * `UPDATING`, or `DELETING` state, `MergeShards`
 * returns a `ResourceInUseException`. If the specified stream does not exist,
 * `MergeShards` returns a `ResourceNotFoundException`.
 *
 * You can use DescribeStreamSummary to check the state of the stream,
 * which is returned in `StreamStatus`.
 *
 * `MergeShards` is an asynchronous operation. Upon receiving a
 * `MergeShards` request, Amazon Kinesis Data Streams immediately returns a
 * response and sets the `StreamStatus` to `UPDATING`. After the
 * operation is completed, Kinesis Data Streams sets the `StreamStatus` to
 * `ACTIVE`. Read and write operations continue to work while the stream is
 * in the `UPDATING` state.
 *
 * You use DescribeStreamSummary and the ListShards
 * APIs to determine the shard IDs that are specified in the `MergeShards`
 * request.
 *
 * If you try to operate on too many streams in parallel using CreateStream, DeleteStream, `MergeShards`,
 * or SplitShard, you receive a `LimitExceededException`.
 *
 * `MergeShards` has a limit of five transactions per second per account.
 */
export const mergeShards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergeShardsInput,
  output: MergeShardsResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Splits a shard into two new shards in the Kinesis data stream, to increase the
 * stream's capacity to ingest and transport data. `SplitShard` is called when
 * there is a need to increase the overall capacity of a stream because of an expected
 * increase in the volume of data records being ingested. This API is only supported for
 * the data streams with the provisioned capacity mode.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * You can also use `SplitShard` when a shard appears to be approaching its
 * maximum utilization; for example, the producers sending data into the specific shard are
 * suddenly sending more than previously anticipated. You can also call
 * `SplitShard` to increase stream capacity, so that more Kinesis Data
 * Streams applications can simultaneously read data from the stream for real-time
 * processing.
 *
 * You must specify the shard to be split and the new hash key, which is the position in
 * the shard where the shard gets split in two. In many cases, the new hash key might be
 * the average of the beginning and ending hash key, but it can be any hash key value in
 * the range being mapped into the shard. For more information, see Split a
 * Shard in the Amazon Kinesis Data Streams Developer
 * Guide.
 *
 * You can use DescribeStreamSummary and the ListShards APIs to determine the shard ID and hash key values for the `ShardToSplit`
 * and `NewStartingHashKey` parameters that are specified in the
 * `SplitShard` request.
 *
 * `SplitShard` is an asynchronous operation. Upon receiving a
 * `SplitShard` request, Kinesis Data Streams immediately returns a response
 * and sets the stream status to `UPDATING`. After the operation is completed,
 * Kinesis Data Streams sets the stream status to `ACTIVE`. Read and write
 * operations continue to work while the stream is in the `UPDATING` state.
 *
 * You can use DescribeStreamSummary to check the status of the stream,
 * which is returned in `StreamStatus`. If the stream is in the
 * `ACTIVE` state, you can call `SplitShard`.
 *
 * If the specified stream does not exist, DescribeStreamSummary
 * returns a `ResourceNotFoundException`. If you try to create more shards than
 * are authorized for your account, you receive a `LimitExceededException`.
 *
 * For the default shard limit for an Amazon Web Services account, see Kinesis
 * Data Streams Limits in the Amazon Kinesis Data Streams Developer
 * Guide. To increase this limit, contact Amazon Web Services
 * Support.
 *
 * If you try to operate on too many streams simultaneously using CreateStream, DeleteStream, MergeShards, and/or SplitShard, you receive a
 * `LimitExceededException`.
 *
 * `SplitShard` has a limit of five transactions per second per account.
 */
export const splitShard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SplitShardInput,
  output: SplitShardResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * This allows you to update the `MaxRecordSize` of a single record that you can write to, and read from a stream. You can ingest and digest single records up to 10240 KiB.
 */
export const updateMaxRecordSize = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMaxRecordSizeInput,
  output: UpdateMaxRecordSizeResponse,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the capacity mode of the data stream. Currently, in Kinesis Data Streams, you
 * can choose between an **on-demand** capacity mode and a
 * **provisioned** capacity mode for your data stream.
 *
 * If you'd still like to proactively scale your on-demand data stream’s capacity, you can unlock the warm throughput feature for on-demand data streams by enabling `MinimumThroughputBillingCommitment` for your account. Once your account has `MinimumThroughputBillingCommitment` enabled, you can specify the warm throughput in MiB per second that your stream can support in writes.
 */
export const updateStreamMode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStreamModeInput,
  output: UpdateStreamModeResponse,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a Kinesis data stream. A stream captures and transports data records that are
 * continuously emitted from different data sources or *producers*.
 * Scale-out within a stream is explicitly supported by means of shards, which are uniquely
 * identified groups of data records in a stream.
 *
 * You can create your data stream using either on-demand or provisioned capacity mode. Data streams with an on-demand mode require no capacity planning and automatically scale to handle gigabytes of write and read throughput per minute. With the on-demand mode, Kinesis Data Streams automatically manages the shards in order to provide the necessary throughput.
 *
 * If you'd still like to proactively scale your on-demand data stream’s capacity, you can unlock the warm throughput feature for on-demand data streams by enabling `MinimumThroughputBillingCommitment` for your account. Once your account has `MinimumThroughputBillingCommitment` enabled, you can specify the warm throughput in MiB per second that your stream can support in writes.
 *
 * For the data streams with a provisioned mode, you must specify the number of shards for the data stream. Each shard can support reads up to five transactions per second, up to a maximum data read total of 2 MiB per second. Each shard can support writes up to 1,000 records per second, up to a maximum data write total of 1 MiB per second. If the amount of data input increases or decreases, you can add or remove shards.
 *
 * The stream name identifies the stream. The name is scoped to the Amazon Web Services
 * account used by the application. It is also scoped by Amazon Web Services Region. That
 * is, two streams in two different accounts can have the same name, and two streams in the
 * same account, but in two different Regions, can have the same name.
 *
 * `CreateStream` is an asynchronous operation. Upon receiving a
 * `CreateStream` request, Kinesis Data Streams immediately returns and sets
 * the stream status to `CREATING`. After the stream is created, Kinesis Data
 * Streams sets the stream status to `ACTIVE`. You should perform read and write
 * operations only on an `ACTIVE` stream.
 *
 * You receive a `LimitExceededException` when making a
 * `CreateStream` request when you try to do one of the following:
 *
 * - Have more than five streams in the `CREATING` state at any point in
 * time.
 *
 * - Create more shards than are authorized for your account.
 *
 * For the default shard or on-demand throughput limits for an Amazon Web Services account, see Amazon Kinesis Data Streams Limits in the *Amazon Kinesis Data Streams Developer Guide*. To increase this limit, contact Amazon Web Services Support.
 *
 * You can use DescribeStreamSummary to check the stream status, which
 * is returned in `StreamStatus`.
 *
 * CreateStream has a limit of five transactions per second per
 * account.
 *
 * You can add tags to the stream when making a `CreateStream` request by setting the `Tags` parameter. If you pass the `Tags` parameter, in addition to having the `kinesis:CreateStream` permission, you must also have the `kinesis:AddTagsToStream` permission for the stream that will be created. The `kinesis:TagResource` permission won’t work to tag streams on creation. Tags will take effect from the `CREATING` status of the stream, but you can't make any updates to the tags until the stream is in `ACTIVE` state.
 */
export const createStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStreamInput,
  output: CreateStreamResponse,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ValidationException,
  ],
}));
/**
 * Writes a single data record into an Amazon Kinesis data stream. Call
 * `PutRecord` to send data into the stream for real-time ingestion and
 * subsequent processing, one record at a time. Each shard can support writes up to 1,000
 * records per second, up to a maximum data write total of 10 MiB per second.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * You must specify the name of the stream that captures, stores, and transports the
 * data; a partition key; and the data blob itself.
 *
 * The data blob can be any type of data; for example, a segment from a log file,
 * geographic/location data, website clickstream data, and so on.
 *
 * The partition key is used by Kinesis Data Streams to distribute data across shards.
 * Kinesis Data Streams segregates the data records that belong to a stream into multiple
 * shards, using the partition key associated with each data record to determine the shard
 * to which a given data record belongs.
 *
 * Partition keys are Unicode strings, with a maximum length limit of 256 characters for
 * each key. An MD5 hash function is used to map partition keys to 128-bit integer values
 * and to map associated data records to shards using the hash key ranges of the shards.
 * You can override hashing the partition key to determine the shard by explicitly
 * specifying a hash value using the `ExplicitHashKey` parameter. For more
 * information, see Adding Data to a Stream in the Amazon Kinesis Data Streams
 * Developer Guide.
 *
 * `PutRecord` returns the shard ID of where the data record was placed and the
 * sequence number that was assigned to the data record.
 *
 * Sequence numbers increase over time and are specific to a shard within a stream, not
 * across all shards within a stream. To guarantee strictly increasing ordering, write
 * serially to a shard and use the `SequenceNumberForOrdering` parameter. For
 * more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams
 * Developer Guide.
 *
 * After you write a record to a stream, you cannot modify that record or its order
 * within the stream.
 *
 * If a `PutRecord` request cannot be processed because of insufficient
 * provisioned throughput on the shard involved in the request, `PutRecord`
 * throws `ProvisionedThroughputExceededException`.
 *
 * By default, data records are accessible for 24 hours from the time that they are added
 * to a stream. You can use IncreaseStreamRetentionPeriod or DecreaseStreamRetentionPeriod to modify this retention period.
 */
export const putRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecordInput,
  output: PutRecordOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidArgumentException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Writes multiple data records into a Kinesis data stream in a single call (also
 * referred to as a `PutRecords` request). Use this operation to send data into
 * the stream for data ingestion and processing.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Each `PutRecords` request can support up to 500 records. Each record in the
 * request can be as large as 10 MiB, up to a limit of 10 MiB for the entire request,
 * including partition keys. Each shard can support writes up to 1,000 records per second,
 * up to a maximum data write total of 1 MB per second.
 *
 * You must specify the name of the stream that captures, stores, and transports the
 * data; and an array of request `Records`, with each record in the array
 * requiring a partition key and data blob. The record size limit applies to the total size
 * of the partition key and data blob.
 *
 * The data blob can be any type of data; for example, a segment from a log file,
 * geographic/location data, website clickstream data, and so on.
 *
 * The partition key is used by Kinesis Data Streams as input to a hash function that
 * maps the partition key and associated data to a specific shard. An MD5 hash function is
 * used to map partition keys to 128-bit integer values and to map associated data records
 * to shards. As a result of this hashing mechanism, all data records with the same
 * partition key map to the same shard within the stream. For more information, see Adding Data to a Stream in the Amazon Kinesis Data Streams
 * Developer Guide.
 *
 * Each record in the `Records` array may include an optional parameter,
 * `ExplicitHashKey`, which overrides the partition key to shard mapping.
 * This parameter allows a data producer to determine explicitly the shard where the record
 * is stored. For more information, see Adding Multiple Records with PutRecords in the Amazon Kinesis
 * Data Streams Developer Guide.
 *
 * The `PutRecords` response includes an array of response
 * `Records`. Each record in the response array directly correlates with a
 * record in the request array using natural ordering, from the top to the bottom of the
 * request and response. The response `Records` array always includes the same
 * number of records as the request array.
 *
 * The response `Records` array includes both successfully and unsuccessfully
 * processed records. Kinesis Data Streams attempts to process all records in each
 * `PutRecords` request. A single record failure does not stop the
 * processing of subsequent records. As a result, PutRecords doesn't guarantee the ordering
 * of records. If you need to read records in the same order they are written to the
 * stream, use PutRecord instead of `PutRecords`, and write to
 * the same shard.
 *
 * A successfully processed record includes `ShardId` and
 * `SequenceNumber` values. The `ShardId` parameter identifies
 * the shard in the stream where the record is stored. The `SequenceNumber`
 * parameter is an identifier assigned to the put record, unique to all records in the
 * stream.
 *
 * An unsuccessfully processed record includes `ErrorCode` and
 * `ErrorMessage` values. `ErrorCode` reflects the type of error
 * and can be one of the following values:
 * `ProvisionedThroughputExceededException` or `InternalFailure`.
 * `ErrorMessage` provides more detailed information about the
 * `ProvisionedThroughputExceededException` exception including the account
 * ID, stream name, and shard ID of the record that was throttled. For more information
 * about partially successful responses, see Adding Multiple Records with PutRecords in the Amazon Kinesis
 * Data Streams Developer Guide.
 *
 * After you write a record to a stream, you cannot modify that record or its order
 * within the stream.
 *
 * By default, data records are accessible for 24 hours from the time that they are added
 * to a stream. You can use IncreaseStreamRetentionPeriod or DecreaseStreamRetentionPeriod to modify this retention period.
 */
export const putRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecordsInput,
  output: PutRecordsOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidArgumentException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Enables or updates server-side encryption using an Amazon Web Services KMS key for a
 * specified stream.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Starting encryption is an asynchronous operation. Upon receiving the request, Kinesis
 * Data Streams returns immediately and sets the status of the stream to
 * `UPDATING`. After the update is complete, Kinesis Data Streams sets the
 * status of the stream back to `ACTIVE`. Updating or applying encryption
 * normally takes a few seconds to complete, but it can take minutes. You can continue to
 * read and write data to your stream while its status is `UPDATING`. Once the
 * status of the stream is `ACTIVE`, encryption begins for records written to
 * the stream.
 *
 * API Limits: You can successfully apply a new Amazon Web Services KMS key for
 * server-side encryption 25 times in a rolling 24-hour period.
 *
 * Note: It can take up to 5 seconds after the stream is in an `ACTIVE` status
 * before all records written to the stream are encrypted. After you enable encryption, you
 * can verify that encryption is applied by inspecting the API response from
 * `PutRecord` or `PutRecords`.
 */
export const startStreamEncryption = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartStreamEncryptionInput,
    output: StartStreamEncryptionResponse,
    errors: [
      AccessDeniedException,
      InvalidArgumentException,
      KMSAccessDeniedException,
      KMSDisabledException,
      KMSInvalidStateException,
      KMSNotFoundException,
      KMSOptInRequired,
      KMSThrottlingException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Describes the specified Kinesis data stream.
 *
 * This API has been revised. It's highly recommended that you use the DescribeStreamSummary API to get a summarized description of the
 * specified Kinesis data stream and the ListShards API to list the
 * shards in a specified data stream and obtain information about each shard.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * The information returned includes the stream name, Amazon Resource Name (ARN),
 * creation time, enhanced metric configuration, and shard map. The shard map is an array
 * of shard objects. For each shard object, there is the hash key and sequence number
 * ranges that the shard spans, and the IDs of any earlier shards that played in a role in
 * creating the shard. Every record ingested in the stream is identified by a sequence
 * number, which is assigned when the record is put into the stream.
 *
 * You can limit the number of shards returned by each call. For more information, see
 * Retrieving
 * Shards from a Stream in the Amazon Kinesis Data Streams Developer
 * Guide.
 *
 * There are no guarantees about the chronological order shards returned. To process
 * shards in chronological order, use the ID of the parent shard to track the lineage to
 * the oldest shard.
 *
 * This operation has a limit of 10 transactions per second per account.
 */
export const describeStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStreamInput,
  output: DescribeStreamOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets data records from a Kinesis data stream's shard.
 *
 * When invoking this API, you must use either the `StreamARN` or the
 * `StreamName` parameter, or both. It is recommended that you use the
 * `StreamARN` input parameter when you invoke this API.
 *
 * Specify a shard iterator using the `ShardIterator` parameter. The shard
 * iterator specifies the position in the shard from which you want to start reading data
 * records sequentially. If there are no records available in the portion of the shard that
 * the iterator points to, GetRecords returns an empty list. It might
 * take multiple calls to get to a portion of the shard that contains records.
 *
 * You can scale by provisioning multiple shards per stream while considering service
 * limits (for more information, see Amazon Kinesis Data Streams
 * Limits in the Amazon Kinesis Data Streams Developer
 * Guide). Your application should have one thread per shard, each reading
 * continuously from its stream. To read from a stream continually, call GetRecords in a loop. Use GetShardIterator to get the
 * shard iterator to specify in the first GetRecords call. GetRecords returns a new shard iterator in
 * `NextShardIterator`. Specify the shard iterator returned in
 * `NextShardIterator` in subsequent calls to GetRecords.
 * If the shard has been closed, the shard iterator can't return more data and GetRecords returns `null` in `NextShardIterator`.
 * You can terminate the loop when the shard is closed, or when the shard iterator reaches
 * the record with the sequence number or other attribute that marks it as the last record
 * to process.
 *
 * Each data record can be up to 1 MiB in size, and each shard can read up to 2 MiB per
 * second. You can ensure that your calls don't exceed the maximum supported size or
 * throughput by using the `Limit` parameter to specify the maximum number of
 * records that GetRecords can return. Consider your average record size
 * when determining this limit. The maximum number of records that can be returned per call
 * is 10,000.
 *
 * The size of the data returned by GetRecords varies depending on the
 * utilization of the shard. It is recommended that consumer applications retrieve records
 * via the `GetRecords` command using the 5 TPS limit to remain caught up.
 * Retrieving records less frequently can lead to consumer applications falling behind. The
 * maximum size of data that GetRecords can return is 10 MiB. If a call
 * returns this amount of data, subsequent calls made within the next 5 seconds throw
 * `ProvisionedThroughputExceededException`. If there is insufficient
 * provisioned throughput on the stream, subsequent calls made within the next 1 second
 * throw `ProvisionedThroughputExceededException`. GetRecords
 * doesn't return any data when it throws an exception. For this reason, we recommend that
 * you wait 1 second between calls to GetRecords. However, it's possible
 * that the application will get exceptions for longer than 1 second.
 *
 * To detect whether the application is falling behind in processing, you can use the
 * `MillisBehindLatest` response attribute. You can also monitor the stream
 * using CloudWatch metrics and other mechanisms (see Monitoring in the Amazon
 * Kinesis Data Streams Developer Guide).
 *
 * Each Amazon Kinesis record includes a value, `ApproximateArrivalTimestamp`,
 * that is set when a stream successfully receives and stores a record. This is commonly
 * referred to as a server-side time stamp, whereas a client-side time stamp is set when a
 * data producer creates or sends the record to a stream (a data producer is any data
 * source putting data records into a stream, for example with PutRecords). The time stamp has millisecond precision. There are no guarantees about the time
 * stamp accuracy, or that the time stamp is always increasing. For example, records in a
 * shard or across a stream might have time stamps that are out of order.
 *
 * This operation has a limit of five transactions per second per shard.
 */
export const getRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecordsInput,
  output: GetRecordsOutput,
  errors: [
    AccessDeniedException,
    ExpiredIteratorException,
    InternalFailureException,
    InvalidArgumentException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * This operation establishes an HTTP/2 connection between the consumer you specify in
 * the `ConsumerARN` parameter and the shard you specify in the
 * `ShardId` parameter. After the connection is successfully established,
 * Kinesis Data Streams pushes records from the shard to the consumer over this connection.
 * Before you call this operation, call RegisterStreamConsumer to
 * register the consumer with Kinesis Data Streams.
 *
 * When the `SubscribeToShard` call succeeds, your consumer starts receiving
 * events of type SubscribeToShardEvent over the HTTP/2 connection for up
 * to 5 minutes, after which time you need to call `SubscribeToShard` again to
 * renew the subscription if you want to continue to receive records.
 *
 * You can make one call to `SubscribeToShard` per second per registered
 * consumer per shard. For example, if you have a 4000 shard stream and two registered
 * stream consumers, you can make one `SubscribeToShard` request per second for
 * each combination of shard and registered consumer, allowing you to subscribe both
 * consumers to all 4000 shards in one second.
 *
 * If you call `SubscribeToShard` again with the same `ConsumerARN`
 * and `ShardId` within 5 seconds of a successful call, you'll get a
 * `ResourceInUseException`. If you call `SubscribeToShard` 5
 * seconds or more after a successful call, the second call takes over the subscription and
 * the previous connection expires or fails with a
 * `ResourceInUseException`.
 *
 * For an example of how to use this operation, see Enhanced Fan-Out
 * Using the Kinesis Data Streams API.
 */
export const subscribeToShard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubscribeToShardInput,
  output: SubscribeToShardOutput,
  errors: [
    AccessDeniedException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
