import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://dynamodb.amazonaws.com/doc/2012-08-10/");
const svc = T.AwsApiService({
  sdkId: "DynamoDB",
  serviceShapeName: "DynamoDB_20120810",
});
const auth = T.AwsAuthSigv4({ name: "dynamodb" });
const ver = T.ServiceVersion("2012-08-10");
const proto = T.AwsProtocolsAwsJson1_0();
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
    AccountId: {
      builtIn: "AWS::Auth::AccountId",
      required: false,
      documentation: "The AWS AccountId used for the request.",
      type: "string",
    },
    AccountIdEndpointMode: {
      builtIn: "AWS::Auth::AccountIdEndpointMode",
      required: false,
      documentation: "The AccountId Endpoint Mode.",
      type: "string",
    },
    ResourceArn: {
      required: false,
      documentation: "ResourceArn containing arn of resource",
      type: "string",
    },
    ResourceArnList: {
      required: false,
      documentation: "ResourceArnList containing list of resource arns",
      type: "stringArray",
    },
  },
  rules: [
    {
      conditions: [
        { fn: "isSet", argv: [{ ref: "Endpoint" }] },
        { fn: "isSet", argv: [{ ref: "Region" }] },
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
          conditions: [
            {
              fn: "stringEquals",
              argv: [
                { ref: "Endpoint" },
                "https://dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}",
              ],
            },
          ],
          error:
            "Endpoint override is not supported for dual-stack endpoints. Please enable dual-stack functionality by enabling the configuration. For more details, see: https://docs.aws.amazon.com/sdkref/latest/guide/feature-endpoints.html",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: "{Endpoint}", properties: {}, headers: {} },
          type: "endpoint",
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
          endpoint: { url: "{Endpoint}", properties: {}, headers: {} },
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
                { fn: "stringEquals", argv: [{ ref: "Region" }, "local"] },
              ],
              rules: [
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                  error:
                    "Invalid Configuration: FIPS and local endpoint are not supported",
                  type: "error",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  error:
                    "Invalid Configuration: Dualstack and local endpoint are not supported",
                  type: "error",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "http://localhost:8000",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingName: "dynamodb",
                          signingRegion: "us-east-1",
                        },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
              ],
              type: "tree",
            },
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
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
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
                          fn: "isSet",
                          argv: [{ ref: "AccountIdEndpointMode" }],
                        },
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "AccountIdEndpointMode" }, "required"],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          error:
                            "Invalid Configuration: AccountIdEndpointMode is required and FIPS is enabled, but FIPS account endpoints are not supported",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://dynamodb-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      rules: [
                        {
                          conditions: [
                            {
                              fn: "isSet",
                              argv: [{ ref: "AccountIdEndpointMode" }],
                            },
                            {
                              fn: "stringEquals",
                              argv: [
                                { ref: "AccountIdEndpointMode" },
                                "required",
                              ],
                            },
                          ],
                          rules: [
                            {
                              conditions: [],
                              error:
                                "Invalid Configuration: AccountIdEndpointMode is required and FIPS is enabled, but FIPS account endpoints are not supported",
                              type: "error",
                            },
                          ],
                          type: "tree",
                        },
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://dynamodb.{Region}.{PartitionResult#dnsSuffix}",
                            properties: {},
                            headers: {},
                          },
                          type: "endpoint",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [
                        {
                          fn: "isSet",
                          argv: [{ ref: "AccountIdEndpointMode" }],
                        },
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "AccountIdEndpointMode" }, "required"],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          error:
                            "Invalid Configuration: AccountIdEndpointMode is required and FIPS is enabled, but FIPS account endpoints are not supported",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://dynamodb-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
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
                          fn: "isSet",
                          argv: [{ ref: "AccountIdEndpointMode" }],
                        },
                        {
                          fn: "not",
                          argv: [
                            {
                              fn: "stringEquals",
                              argv: [
                                { ref: "AccountIdEndpointMode" },
                                "disabled",
                              ],
                            },
                          ],
                        },
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws",
                          ],
                        },
                        {
                          fn: "not",
                          argv: [
                            {
                              fn: "booleanEquals",
                              argv: [{ ref: "UseFIPS" }, true],
                            },
                          ],
                        },
                        { fn: "isSet", argv: [{ ref: "ResourceArn" }] },
                        {
                          fn: "aws.parseArn",
                          argv: [{ ref: "ResourceArn" }],
                          assign: "ParsedArn",
                        },
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "ParsedArn" }, "service"],
                            },
                            "dynamodb",
                          ],
                        },
                        {
                          fn: "isValidHostLabel",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "ParsedArn" }, "region"],
                            },
                            false,
                          ],
                        },
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "ParsedArn" }, "region"],
                            },
                            "{Region}",
                          ],
                        },
                        {
                          fn: "isValidHostLabel",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "ParsedArn" }, "accountId"],
                            },
                            false,
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://{ParsedArn#accountId}.ddb.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: { metricValues: ["O"] },
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "isSet",
                          argv: [{ ref: "AccountIdEndpointMode" }],
                        },
                        {
                          fn: "not",
                          argv: [
                            {
                              fn: "stringEquals",
                              argv: [
                                { ref: "AccountIdEndpointMode" },
                                "disabled",
                              ],
                            },
                          ],
                        },
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws",
                          ],
                        },
                        {
                          fn: "not",
                          argv: [
                            {
                              fn: "booleanEquals",
                              argv: [{ ref: "UseFIPS" }, true],
                            },
                          ],
                        },
                        { fn: "isSet", argv: [{ ref: "ResourceArnList" }] },
                        {
                          fn: "getAttr",
                          argv: [{ ref: "ResourceArnList" }, "[0]"],
                          assign: "FirstArn",
                        },
                        {
                          fn: "aws.parseArn",
                          argv: [{ ref: "FirstArn" }],
                          assign: "ParsedArn",
                        },
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "ParsedArn" }, "service"],
                            },
                            "dynamodb",
                          ],
                        },
                        {
                          fn: "isValidHostLabel",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "ParsedArn" }, "region"],
                            },
                            false,
                          ],
                        },
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "ParsedArn" }, "region"],
                            },
                            "{Region}",
                          ],
                        },
                        {
                          fn: "isValidHostLabel",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "ParsedArn" }, "accountId"],
                            },
                            false,
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://{ParsedArn#accountId}.ddb.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: { metricValues: ["O"] },
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "isSet",
                          argv: [{ ref: "AccountIdEndpointMode" }],
                        },
                        {
                          fn: "not",
                          argv: [
                            {
                              fn: "stringEquals",
                              argv: [
                                { ref: "AccountIdEndpointMode" },
                                "disabled",
                              ],
                            },
                          ],
                        },
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws",
                          ],
                        },
                        {
                          fn: "not",
                          argv: [
                            {
                              fn: "booleanEquals",
                              argv: [{ ref: "UseFIPS" }, true],
                            },
                          ],
                        },
                        { fn: "isSet", argv: [{ ref: "AccountId" }] },
                      ],
                      rules: [
                        {
                          conditions: [
                            {
                              fn: "isValidHostLabel",
                              argv: [{ ref: "AccountId" }, false],
                            },
                          ],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://{AccountId}.ddb.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                properties: { metricValues: ["O"] },
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
                            "Credentials-sourced account ID parameter is invalid",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [
                        {
                          fn: "isSet",
                          argv: [{ ref: "AccountIdEndpointMode" }],
                        },
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "AccountIdEndpointMode" }, "required"],
                        },
                      ],
                      rules: [
                        {
                          conditions: [
                            {
                              fn: "not",
                              argv: [
                                {
                                  fn: "booleanEquals",
                                  argv: [{ ref: "UseFIPS" }, true],
                                },
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
                                      argv: [
                                        { ref: "PartitionResult" },
                                        "name",
                                      ],
                                    },
                                    "aws",
                                  ],
                                },
                              ],
                              rules: [
                                {
                                  conditions: [],
                                  error:
                                    "AccountIdEndpointMode is required but no AccountID was provided or able to be loaded",
                                  type: "error",
                                },
                              ],
                              type: "tree",
                            },
                            {
                              conditions: [],
                              error:
                                "Invalid Configuration: AccountIdEndpointMode is required but account endpoints are not supported in this partition",
                              type: "error",
                            },
                          ],
                          type: "tree",
                        },
                        {
                          conditions: [],
                          error:
                            "Invalid Configuration: AccountIdEndpointMode is required and FIPS is enabled, but FIPS account endpoints are not supported",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://dynamodb.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                { fn: "isSet", argv: [{ ref: "AccountIdEndpointMode" }] },
                {
                  fn: "not",
                  argv: [
                    {
                      fn: "stringEquals",
                      argv: [{ ref: "AccountIdEndpointMode" }, "disabled"],
                    },
                  ],
                },
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                {
                  fn: "not",
                  argv: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                },
                { fn: "isSet", argv: [{ ref: "ResourceArn" }] },
                {
                  fn: "aws.parseArn",
                  argv: [{ ref: "ResourceArn" }],
                  assign: "ParsedArn",
                },
                {
                  fn: "stringEquals",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "ParsedArn" }, "service"] },
                    "dynamodb",
                  ],
                },
                {
                  fn: "isValidHostLabel",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "ParsedArn" }, "region"] },
                    false,
                  ],
                },
                {
                  fn: "stringEquals",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "ParsedArn" }, "region"] },
                    "{Region}",
                  ],
                },
                {
                  fn: "isValidHostLabel",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "ParsedArn" }, "accountId"],
                    },
                    false,
                  ],
                },
              ],
              endpoint: {
                url: "https://{ParsedArn#accountId}.ddb.{Region}.{PartitionResult#dnsSuffix}",
                properties: { metricValues: ["O"] },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                { fn: "isSet", argv: [{ ref: "AccountIdEndpointMode" }] },
                {
                  fn: "not",
                  argv: [
                    {
                      fn: "stringEquals",
                      argv: [{ ref: "AccountIdEndpointMode" }, "disabled"],
                    },
                  ],
                },
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                {
                  fn: "not",
                  argv: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                },
                { fn: "isSet", argv: [{ ref: "ResourceArnList" }] },
                {
                  fn: "getAttr",
                  argv: [{ ref: "ResourceArnList" }, "[0]"],
                  assign: "FirstArn",
                },
                {
                  fn: "aws.parseArn",
                  argv: [{ ref: "FirstArn" }],
                  assign: "ParsedArn",
                },
                {
                  fn: "stringEquals",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "ParsedArn" }, "service"] },
                    "dynamodb",
                  ],
                },
                {
                  fn: "isValidHostLabel",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "ParsedArn" }, "region"] },
                    false,
                  ],
                },
                {
                  fn: "stringEquals",
                  argv: [
                    { fn: "getAttr", argv: [{ ref: "ParsedArn" }, "region"] },
                    "{Region}",
                  ],
                },
                {
                  fn: "isValidHostLabel",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "ParsedArn" }, "accountId"],
                    },
                    false,
                  ],
                },
              ],
              endpoint: {
                url: "https://{ParsedArn#accountId}.ddb.{Region}.{PartitionResult#dnsSuffix}",
                properties: { metricValues: ["O"] },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                { fn: "isSet", argv: [{ ref: "AccountIdEndpointMode" }] },
                {
                  fn: "not",
                  argv: [
                    {
                      fn: "stringEquals",
                      argv: [{ ref: "AccountIdEndpointMode" }, "disabled"],
                    },
                  ],
                },
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                {
                  fn: "not",
                  argv: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                },
                { fn: "isSet", argv: [{ ref: "AccountId" }] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "isValidHostLabel",
                      argv: [{ ref: "AccountId" }, false],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://{AccountId}.ddb.{Region}.{PartitionResult#dnsSuffix}",
                        properties: { metricValues: ["O"] },
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error: "Credentials-sourced account ID parameter is invalid",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "isSet", argv: [{ ref: "AccountIdEndpointMode" }] },
                {
                  fn: "stringEquals",
                  argv: [{ ref: "AccountIdEndpointMode" }, "required"],
                },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "not",
                      argv: [
                        {
                          fn: "booleanEquals",
                          argv: [{ ref: "UseFIPS" }, true],
                        },
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
                            "aws",
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          error:
                            "AccountIdEndpointMode is required but no AccountID was provided or able to be loaded",
                          type: "error",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "Invalid Configuration: AccountIdEndpointMode is required but account endpoints are not supported in this partition",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "Invalid Configuration: AccountIdEndpointMode is required and FIPS is enabled, but FIPS account endpoints are not supported",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://dynamodb.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type TableArn = string;
export type BackupName = string;
export type TableName = string;
export type ResourcePolicy = string;
export type BackupArn = string;
export type ConditionExpression = string;
export type ResourceArnString = string;
export type PolicyRevisionId = string;
export type IndexName = string;
export type ExportArn = string;
export type ImportArn = string;
export type PositiveLongObject = number;
export type StreamArn = string;
export type PartiQLStatement = string;
export type PartiQLNextToken = string;
export type PositiveIntegerObject = number;
export type ClientRequestToken = string;
export type ClientToken = string;
export type S3Bucket = string;
export type S3BucketOwner = string;
export type S3Prefix = string;
export type S3SseKmsKeyId = string;
export type AttributeName = string;
export type ProjectionExpression = string;
export type BackupsInputLimit = number;
export type NextTokenString = string;
export type ListContributorInsightsLimit = number;
export type ListExportsMaxLimit = number;
export type ExportNextToken = string;
export type RegionName = string;
export type ListImportsMaxLimit = number;
export type ImportNextToken = string;
export type ListTablesInputLimit = number;
export type KeyExpression = string;
export type ScanTotalSegments = number;
export type ScanSegment = number;
export type TagKeyString = string;
export type UpdateExpression = string;
export type KeySchemaAttributeName = string;
export type KMSMasterKeyId = string;
export type TagValueString = string;
export type LongObject = number;
export type ExpressionAttributeNameVariable = string;
export type ExpressionAttributeValueVariable = string;
export type Long = number;
export type StringAttributeValue = string;
export type NumberAttributeValue = string;
export type RecoveryPeriodInDays = number;
export type AutoScalingRoleArn = string;
export type TimeToLiveAttributeName = string;
export type ContributorInsightsRule = string;
export type ErrorMessage = string;
export type Integer = number;
export type NonKeyAttributeName = string;
export type CsvDelimiter = string;
export type CsvHeader = string;
export type AutoScalingPolicyName = string;
export type BackupSizeBytes = number;
export type TableId = string;
export type ExceptionName = string;
export type ExceptionDescription = string;
export type ExportManifest = string;
export type FailureCode = string;
export type FailureMessage = string;
export type BilledSizeBytes = number;
export type ItemCount = number;
export type GlobalTableArnString = string;
export type NonNegativeLongObject = number;
export type ErrorCount = number;
export type CloudWatchLogGroupArn = string;
export type ProcessedItemCount = number;
export type ImportedItemCount = number;
export type ConsumedCapacityUnits = number;
export type IntegerObject = number;
export type DoubleObject = number;
export type ReplicaStatusDescription = string;
export type ReplicaStatusPercentProgress = string;
export type KMSMasterKeyArn = string;
export type ArchivalReason = string;
export type ItemCollectionSizeEstimateBound = number;
export type Reason = string;
export type Resource = string;
export type AvailabilityErrorMessage = string;
export type Code = string;

//# Schemas
export interface DescribeEndpointsRequest {}
export const DescribeEndpointsRequest = S.suspend(() =>
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
  identifier: "DescribeEndpointsRequest",
}) as any as S.Schema<DescribeEndpointsRequest>;
export interface DescribeLimitsInput {}
export const DescribeLimitsInput = S.suspend(() =>
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
  identifier: "DescribeLimitsInput",
}) as any as S.Schema<DescribeLimitsInput>;
export type AttributeNameList = string[];
export const AttributeNameList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateBackupInput {
  TableName: string;
  BackupName: string;
}
export const CreateBackupInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    BackupName: S.String,
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
  identifier: "CreateBackupInput",
}) as any as S.Schema<CreateBackupInput>;
export interface DeleteBackupInput {
  BackupArn: string;
}
export const DeleteBackupInput = S.suspend(() =>
  S.Struct({ BackupArn: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DeleteBackupInput",
}) as any as S.Schema<DeleteBackupInput>;
export interface DeleteResourcePolicyInput {
  ResourceArn: string;
  ExpectedRevisionId?: string;
}
export const DeleteResourcePolicyInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.ContextParam("ResourceArn")),
    ExpectedRevisionId: S.optional(S.String),
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
  identifier: "DeleteResourcePolicyInput",
}) as any as S.Schema<DeleteResourcePolicyInput>;
export interface DeleteTableInput {
  TableName: string;
}
export const DeleteTableInput = S.suspend(() =>
  S.Struct({ TableName: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DeleteTableInput",
}) as any as S.Schema<DeleteTableInput>;
export interface DescribeBackupInput {
  BackupArn: string;
}
export const DescribeBackupInput = S.suspend(() =>
  S.Struct({ BackupArn: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DescribeBackupInput",
}) as any as S.Schema<DescribeBackupInput>;
export interface DescribeContinuousBackupsInput {
  TableName: string;
}
export const DescribeContinuousBackupsInput = S.suspend(() =>
  S.Struct({ TableName: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DescribeContinuousBackupsInput",
}) as any as S.Schema<DescribeContinuousBackupsInput>;
export interface DescribeContributorInsightsInput {
  TableName: string;
  IndexName?: string;
}
export const DescribeContributorInsightsInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    IndexName: S.optional(S.String),
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
  identifier: "DescribeContributorInsightsInput",
}) as any as S.Schema<DescribeContributorInsightsInput>;
export interface DescribeExportInput {
  ExportArn: string;
}
export const DescribeExportInput = S.suspend(() =>
  S.Struct({ ExportArn: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DescribeExportInput",
}) as any as S.Schema<DescribeExportInput>;
export interface DescribeGlobalTableInput {
  GlobalTableName: string;
}
export const DescribeGlobalTableInput = S.suspend(() =>
  S.Struct({
    GlobalTableName: S.String.pipe(T.ContextParam("ResourceArn")),
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
  identifier: "DescribeGlobalTableInput",
}) as any as S.Schema<DescribeGlobalTableInput>;
export interface DescribeGlobalTableSettingsInput {
  GlobalTableName: string;
}
export const DescribeGlobalTableSettingsInput = S.suspend(() =>
  S.Struct({
    GlobalTableName: S.String.pipe(T.ContextParam("ResourceArn")),
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
  identifier: "DescribeGlobalTableSettingsInput",
}) as any as S.Schema<DescribeGlobalTableSettingsInput>;
export interface DescribeImportInput {
  ImportArn: string;
}
export const DescribeImportInput = S.suspend(() =>
  S.Struct({ ImportArn: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DescribeImportInput",
}) as any as S.Schema<DescribeImportInput>;
export interface DescribeKinesisStreamingDestinationInput {
  TableName: string;
}
export const DescribeKinesisStreamingDestinationInput = S.suspend(() =>
  S.Struct({ TableName: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DescribeKinesisStreamingDestinationInput",
}) as any as S.Schema<DescribeKinesisStreamingDestinationInput>;
export interface DescribeLimitsOutput {
  AccountMaxReadCapacityUnits?: number;
  AccountMaxWriteCapacityUnits?: number;
  TableMaxReadCapacityUnits?: number;
  TableMaxWriteCapacityUnits?: number;
}
export const DescribeLimitsOutput = S.suspend(() =>
  S.Struct({
    AccountMaxReadCapacityUnits: S.optional(S.Number),
    AccountMaxWriteCapacityUnits: S.optional(S.Number),
    TableMaxReadCapacityUnits: S.optional(S.Number),
    TableMaxWriteCapacityUnits: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribeLimitsOutput",
}) as any as S.Schema<DescribeLimitsOutput>;
export interface DescribeTableInput {
  TableName: string;
}
export const DescribeTableInput = S.suspend(() =>
  S.Struct({ TableName: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DescribeTableInput",
}) as any as S.Schema<DescribeTableInput>;
export interface DescribeTableReplicaAutoScalingInput {
  TableName: string;
}
export const DescribeTableReplicaAutoScalingInput = S.suspend(() =>
  S.Struct({ TableName: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DescribeTableReplicaAutoScalingInput",
}) as any as S.Schema<DescribeTableReplicaAutoScalingInput>;
export interface DescribeTimeToLiveInput {
  TableName: string;
}
export const DescribeTimeToLiveInput = S.suspend(() =>
  S.Struct({ TableName: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "DescribeTimeToLiveInput",
}) as any as S.Schema<DescribeTimeToLiveInput>;
export interface EnableKinesisStreamingConfiguration {
  ApproximateCreationDateTimePrecision?: string;
}
export const EnableKinesisStreamingConfiguration = S.suspend(() =>
  S.Struct({ ApproximateCreationDateTimePrecision: S.optional(S.String) }),
).annotations({
  identifier: "EnableKinesisStreamingConfiguration",
}) as any as S.Schema<EnableKinesisStreamingConfiguration>;
export interface KinesisStreamingDestinationOutput {
  TableName?: string;
  StreamArn?: string;
  DestinationStatus?: string;
  EnableKinesisStreamingConfiguration?: EnableKinesisStreamingConfiguration;
}
export const KinesisStreamingDestinationOutput = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    StreamArn: S.optional(S.String),
    DestinationStatus: S.optional(S.String),
    EnableKinesisStreamingConfiguration: S.optional(
      EnableKinesisStreamingConfiguration,
    ),
  }).pipe(ns),
).annotations({
  identifier: "KinesisStreamingDestinationOutput",
}) as any as S.Schema<KinesisStreamingDestinationOutput>;
export type StringSetAttributeValue = string[];
export const StringSetAttributeValue = S.Array(S.String);
export type NumberSetAttributeValue = string[];
export const NumberSetAttributeValue = S.Array(S.String);
export type BinarySetAttributeValue = Uint8Array[];
export const BinarySetAttributeValue = S.Array(T.Blob);
export type AttributeValue =
  | { S: string }
  | { N: string }
  | { B: Uint8Array }
  | { SS: StringSetAttributeValue }
  | { NS: NumberSetAttributeValue }
  | { BS: BinarySetAttributeValue }
  | { M: MapAttributeValue }
  | { L: ListAttributeValue }
  | { NULL: boolean }
  | { BOOL: boolean };
export const AttributeValue = S.Union(
  S.Struct({ S: S.String }),
  S.Struct({ N: S.String }),
  S.Struct({ B: T.Blob }),
  S.Struct({ SS: StringSetAttributeValue }),
  S.Struct({ NS: NumberSetAttributeValue }),
  S.Struct({ BS: BinarySetAttributeValue }),
  S.Struct({
    M: S.suspend(() => MapAttributeValue).annotations({
      identifier: "MapAttributeValue",
    }),
  }),
  S.Struct({
    L: S.suspend(() => ListAttributeValue).annotations({
      identifier: "ListAttributeValue",
    }),
  }),
  S.Struct({ NULL: S.Boolean }),
  S.Struct({ BOOL: S.Boolean }),
) as any as S.Schema<AttributeValue>;
export type Key = { [key: string]: AttributeValue };
export const Key = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue).annotations({
    identifier: "AttributeValue",
  }),
});
export type ExpressionAttributeNameMap = { [key: string]: string };
export const ExpressionAttributeNameMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface GetItemInput {
  TableName: string;
  Key: Key;
  AttributesToGet?: AttributeNameList;
  ConsistentRead?: boolean;
  ReturnConsumedCapacity?: string;
  ProjectionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
}
export const GetItemInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    Key: Key,
    AttributesToGet: S.optional(AttributeNameList),
    ConsistentRead: S.optional(S.Boolean),
    ReturnConsumedCapacity: S.optional(S.String),
    ProjectionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
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
).annotations({ identifier: "GetItemInput" }) as any as S.Schema<GetItemInput>;
export interface GetResourcePolicyInput {
  ResourceArn: string;
}
export const GetResourcePolicyInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.ContextParam("ResourceArn")) }).pipe(
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
  identifier: "GetResourcePolicyInput",
}) as any as S.Schema<GetResourcePolicyInput>;
export interface ListBackupsInput {
  TableName?: string;
  Limit?: number;
  TimeRangeLowerBound?: Date;
  TimeRangeUpperBound?: Date;
  ExclusiveStartBackupArn?: string;
  BackupType?: string;
}
export const ListBackupsInput = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String).pipe(T.ContextParam("ResourceArn")),
    Limit: S.optional(S.Number),
    TimeRangeLowerBound: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TimeRangeUpperBound: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExclusiveStartBackupArn: S.optional(S.String),
    BackupType: S.optional(S.String),
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
  identifier: "ListBackupsInput",
}) as any as S.Schema<ListBackupsInput>;
export interface ListContributorInsightsInput {
  TableName?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListContributorInsightsInput = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String).pipe(T.ContextParam("ResourceArn")),
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
  identifier: "ListContributorInsightsInput",
}) as any as S.Schema<ListContributorInsightsInput>;
export interface ListExportsInput {
  TableArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListExportsInput = S.suspend(() =>
  S.Struct({
    TableArn: S.optional(S.String).pipe(T.ContextParam("ResourceArn")),
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
  identifier: "ListExportsInput",
}) as any as S.Schema<ListExportsInput>;
export interface ListGlobalTablesInput {
  ExclusiveStartGlobalTableName?: string;
  Limit?: number;
  RegionName?: string;
}
export const ListGlobalTablesInput = S.suspend(() =>
  S.Struct({
    ExclusiveStartGlobalTableName: S.optional(S.String),
    Limit: S.optional(S.Number),
    RegionName: S.optional(S.String),
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
  identifier: "ListGlobalTablesInput",
}) as any as S.Schema<ListGlobalTablesInput>;
export interface ListImportsInput {
  TableArn?: string;
  PageSize?: number;
  NextToken?: string;
}
export const ListImportsInput = S.suspend(() =>
  S.Struct({
    TableArn: S.optional(S.String).pipe(T.ContextParam("ResourceArn")),
    PageSize: S.optional(S.Number),
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
  identifier: "ListImportsInput",
}) as any as S.Schema<ListImportsInput>;
export interface ListTablesInput {
  ExclusiveStartTableName?: string;
  Limit?: number;
}
export const ListTablesInput = S.suspend(() =>
  S.Struct({
    ExclusiveStartTableName: S.optional(S.String),
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
  identifier: "ListTablesInput",
}) as any as S.Schema<ListTablesInput>;
export interface ListTagsOfResourceInput {
  ResourceArn: string;
  NextToken?: string;
}
export const ListTagsOfResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.ContextParam("ResourceArn")),
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
  identifier: "ListTagsOfResourceInput",
}) as any as S.Schema<ListTagsOfResourceInput>;
export interface PutResourcePolicyInput {
  ResourceArn: string;
  Policy: string;
  ExpectedRevisionId?: string;
  ConfirmRemoveSelfResourceAccess?: boolean;
}
export const PutResourcePolicyInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.ContextParam("ResourceArn")),
    Policy: S.String,
    ExpectedRevisionId: S.optional(S.String),
    ConfirmRemoveSelfResourceAccess: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-confirm-remove-self-resource-access"),
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
  identifier: "PutResourcePolicyInput",
}) as any as S.Schema<PutResourcePolicyInput>;
export interface KeySchemaElement {
  AttributeName: string;
  KeyType: string;
}
export const KeySchemaElement = S.suspend(() =>
  S.Struct({ AttributeName: S.String, KeyType: S.String }),
).annotations({
  identifier: "KeySchemaElement",
}) as any as S.Schema<KeySchemaElement>;
export type KeySchema = KeySchemaElement[];
export const KeySchema = S.Array(KeySchemaElement);
export type NonKeyAttributeNameList = string[];
export const NonKeyAttributeNameList = S.Array(S.String);
export interface Projection {
  ProjectionType?: string;
  NonKeyAttributes?: NonKeyAttributeNameList;
}
export const Projection = S.suspend(() =>
  S.Struct({
    ProjectionType: S.optional(S.String),
    NonKeyAttributes: S.optional(NonKeyAttributeNameList),
  }),
).annotations({ identifier: "Projection" }) as any as S.Schema<Projection>;
export interface ProvisionedThroughput {
  ReadCapacityUnits: number;
  WriteCapacityUnits: number;
}
export const ProvisionedThroughput = S.suspend(() =>
  S.Struct({ ReadCapacityUnits: S.Number, WriteCapacityUnits: S.Number }),
).annotations({
  identifier: "ProvisionedThroughput",
}) as any as S.Schema<ProvisionedThroughput>;
export interface OnDemandThroughput {
  MaxReadRequestUnits?: number;
  MaxWriteRequestUnits?: number;
}
export const OnDemandThroughput = S.suspend(() =>
  S.Struct({
    MaxReadRequestUnits: S.optional(S.Number),
    MaxWriteRequestUnits: S.optional(S.Number),
  }),
).annotations({
  identifier: "OnDemandThroughput",
}) as any as S.Schema<OnDemandThroughput>;
export interface WarmThroughput {
  ReadUnitsPerSecond?: number;
  WriteUnitsPerSecond?: number;
}
export const WarmThroughput = S.suspend(() =>
  S.Struct({
    ReadUnitsPerSecond: S.optional(S.Number),
    WriteUnitsPerSecond: S.optional(S.Number),
  }),
).annotations({
  identifier: "WarmThroughput",
}) as any as S.Schema<WarmThroughput>;
export interface GlobalSecondaryIndex {
  IndexName: string;
  KeySchema: KeySchema;
  Projection: Projection;
  ProvisionedThroughput?: ProvisionedThroughput;
  OnDemandThroughput?: OnDemandThroughput;
  WarmThroughput?: WarmThroughput;
}
export const GlobalSecondaryIndex = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    KeySchema: KeySchema,
    Projection: Projection,
    ProvisionedThroughput: S.optional(ProvisionedThroughput),
    OnDemandThroughput: S.optional(OnDemandThroughput),
    WarmThroughput: S.optional(WarmThroughput),
  }),
).annotations({
  identifier: "GlobalSecondaryIndex",
}) as any as S.Schema<GlobalSecondaryIndex>;
export type GlobalSecondaryIndexList = GlobalSecondaryIndex[];
export const GlobalSecondaryIndexList = S.Array(GlobalSecondaryIndex);
export interface LocalSecondaryIndex {
  IndexName: string;
  KeySchema: KeySchema;
  Projection: Projection;
}
export const LocalSecondaryIndex = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    KeySchema: KeySchema,
    Projection: Projection,
  }),
).annotations({
  identifier: "LocalSecondaryIndex",
}) as any as S.Schema<LocalSecondaryIndex>;
export type LocalSecondaryIndexList = LocalSecondaryIndex[];
export const LocalSecondaryIndexList = S.Array(LocalSecondaryIndex);
export interface SSESpecification {
  Enabled?: boolean;
  SSEType?: string;
  KMSMasterKeyId?: string;
}
export const SSESpecification = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    SSEType: S.optional(S.String),
    KMSMasterKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "SSESpecification",
}) as any as S.Schema<SSESpecification>;
export interface RestoreTableFromBackupInput {
  TargetTableName: string;
  BackupArn: string;
  BillingModeOverride?: string;
  GlobalSecondaryIndexOverride?: GlobalSecondaryIndexList;
  LocalSecondaryIndexOverride?: LocalSecondaryIndexList;
  ProvisionedThroughputOverride?: ProvisionedThroughput;
  OnDemandThroughputOverride?: OnDemandThroughput;
  SSESpecificationOverride?: SSESpecification;
}
export const RestoreTableFromBackupInput = S.suspend(() =>
  S.Struct({
    TargetTableName: S.String.pipe(T.ContextParam("ResourceArn")),
    BackupArn: S.String,
    BillingModeOverride: S.optional(S.String),
    GlobalSecondaryIndexOverride: S.optional(GlobalSecondaryIndexList),
    LocalSecondaryIndexOverride: S.optional(LocalSecondaryIndexList),
    ProvisionedThroughputOverride: S.optional(ProvisionedThroughput),
    OnDemandThroughputOverride: S.optional(OnDemandThroughput),
    SSESpecificationOverride: S.optional(SSESpecification),
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
  identifier: "RestoreTableFromBackupInput",
}) as any as S.Schema<RestoreTableFromBackupInput>;
export interface RestoreTableToPointInTimeInput {
  SourceTableArn?: string;
  SourceTableName?: string;
  TargetTableName: string;
  UseLatestRestorableTime?: boolean;
  RestoreDateTime?: Date;
  BillingModeOverride?: string;
  GlobalSecondaryIndexOverride?: GlobalSecondaryIndexList;
  LocalSecondaryIndexOverride?: LocalSecondaryIndexList;
  ProvisionedThroughputOverride?: ProvisionedThroughput;
  OnDemandThroughputOverride?: OnDemandThroughput;
  SSESpecificationOverride?: SSESpecification;
}
export const RestoreTableToPointInTimeInput = S.suspend(() =>
  S.Struct({
    SourceTableArn: S.optional(S.String),
    SourceTableName: S.optional(S.String),
    TargetTableName: S.String.pipe(T.ContextParam("ResourceArn")),
    UseLatestRestorableTime: S.optional(S.Boolean),
    RestoreDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BillingModeOverride: S.optional(S.String),
    GlobalSecondaryIndexOverride: S.optional(GlobalSecondaryIndexList),
    LocalSecondaryIndexOverride: S.optional(LocalSecondaryIndexList),
    ProvisionedThroughputOverride: S.optional(ProvisionedThroughput),
    OnDemandThroughputOverride: S.optional(OnDemandThroughput),
    SSESpecificationOverride: S.optional(SSESpecification),
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
  identifier: "RestoreTableToPointInTimeInput",
}) as any as S.Schema<RestoreTableToPointInTimeInput>;
export type AttributeValueList = AttributeValue[];
export const AttributeValueList = S.Array(
  S.suspend(() => AttributeValue).annotations({ identifier: "AttributeValue" }),
);
export interface Condition {
  AttributeValueList?: AttributeValueList;
  ComparisonOperator: string;
}
export const Condition = S.suspend(() =>
  S.Struct({
    AttributeValueList: S.optional(AttributeValueList),
    ComparisonOperator: S.String,
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export type FilterConditionMap = { [key: string]: Condition };
export const FilterConditionMap = S.Record({ key: S.String, value: Condition });
export type ExpressionAttributeValueMap = { [key: string]: AttributeValue };
export const ExpressionAttributeValueMap = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue).annotations({
    identifier: "AttributeValue",
  }),
});
export interface ScanInput {
  TableName: string;
  IndexName?: string;
  AttributesToGet?: AttributeNameList;
  Limit?: number;
  Select?: string;
  ScanFilter?: FilterConditionMap;
  ConditionalOperator?: string;
  ExclusiveStartKey?: Key;
  ReturnConsumedCapacity?: string;
  TotalSegments?: number;
  Segment?: number;
  ProjectionExpression?: string;
  FilterExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
  ConsistentRead?: boolean;
}
export const ScanInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    IndexName: S.optional(S.String),
    AttributesToGet: S.optional(AttributeNameList),
    Limit: S.optional(S.Number),
    Select: S.optional(S.String),
    ScanFilter: S.optional(FilterConditionMap),
    ConditionalOperator: S.optional(S.String),
    ExclusiveStartKey: S.optional(Key),
    ReturnConsumedCapacity: S.optional(S.String),
    TotalSegments: S.optional(S.Number),
    Segment: S.optional(S.Number),
    ProjectionExpression: S.optional(S.String),
    FilterExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
    ConsistentRead: S.optional(S.Boolean),
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
).annotations({ identifier: "ScanInput" }) as any as S.Schema<ScanInput>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceInput {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.ContextParam("ResourceArn")),
    Tags: TagList,
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
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceInput {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.ContextParam("ResourceArn")),
    TagKeys: TagKeyList,
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
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateContributorInsightsInput {
  TableName: string;
  IndexName?: string;
  ContributorInsightsAction: string;
  ContributorInsightsMode?: string;
}
export const UpdateContributorInsightsInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    IndexName: S.optional(S.String),
    ContributorInsightsAction: S.String,
    ContributorInsightsMode: S.optional(S.String),
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
  identifier: "UpdateContributorInsightsInput",
}) as any as S.Schema<UpdateContributorInsightsInput>;
export type ListAttributeValue = AttributeValue[];
export const ListAttributeValue = S.Array(
  S.suspend(() => AttributeValue).annotations({ identifier: "AttributeValue" }),
) as any as S.Schema<ListAttributeValue>;
export type PreparedStatementParameters = AttributeValue[];
export const PreparedStatementParameters = S.Array(
  S.suspend(() => AttributeValue).annotations({ identifier: "AttributeValue" }),
);
export interface BatchStatementRequest {
  Statement: string;
  Parameters?: PreparedStatementParameters;
  ConsistentRead?: boolean;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const BatchStatementRequest = S.suspend(() =>
  S.Struct({
    Statement: S.String,
    Parameters: S.optional(PreparedStatementParameters),
    ConsistentRead: S.optional(S.Boolean),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchStatementRequest",
}) as any as S.Schema<BatchStatementRequest>;
export type PartiQLBatchRequest = BatchStatementRequest[];
export const PartiQLBatchRequest = S.Array(BatchStatementRequest);
export interface Replica {
  RegionName?: string;
}
export const Replica = S.suspend(() =>
  S.Struct({ RegionName: S.optional(S.String) }),
).annotations({ identifier: "Replica" }) as any as S.Schema<Replica>;
export type ReplicaList = Replica[];
export const ReplicaList = S.Array(Replica);
export interface AttributeDefinition {
  AttributeName: string;
  AttributeType: string;
}
export const AttributeDefinition = S.suspend(() =>
  S.Struct({ AttributeName: S.String, AttributeType: S.String }),
).annotations({
  identifier: "AttributeDefinition",
}) as any as S.Schema<AttributeDefinition>;
export type AttributeDefinitions = AttributeDefinition[];
export const AttributeDefinitions = S.Array(AttributeDefinition);
export interface StreamSpecification {
  StreamEnabled: boolean;
  StreamViewType?: string;
}
export const StreamSpecification = S.suspend(() =>
  S.Struct({ StreamEnabled: S.Boolean, StreamViewType: S.optional(S.String) }),
).annotations({
  identifier: "StreamSpecification",
}) as any as S.Schema<StreamSpecification>;
export type ContributorInsightsRuleList = string[];
export const ContributorInsightsRuleList = S.Array(S.String);
export interface Endpoint {
  Address: string;
  CachePeriodInMinutes: number;
}
export const Endpoint = S.suspend(() =>
  S.Struct({ Address: S.String, CachePeriodInMinutes: S.Number }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export type Endpoints = Endpoint[];
export const Endpoints = S.Array(Endpoint);
export interface ParameterizedStatement {
  Statement: string;
  Parameters?: PreparedStatementParameters;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const ParameterizedStatement = S.suspend(() =>
  S.Struct({
    Statement: S.String,
    Parameters: S.optional(PreparedStatementParameters),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterizedStatement",
}) as any as S.Schema<ParameterizedStatement>;
export type ParameterizedStatements = ParameterizedStatement[];
export const ParameterizedStatements = S.Array(ParameterizedStatement);
export interface IncrementalExportSpecification {
  ExportFromTime?: Date;
  ExportToTime?: Date;
  ExportViewType?: string;
}
export const IncrementalExportSpecification = S.suspend(() =>
  S.Struct({
    ExportFromTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExportToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExportViewType: S.optional(S.String),
  }),
).annotations({
  identifier: "IncrementalExportSpecification",
}) as any as S.Schema<IncrementalExportSpecification>;
export interface S3BucketSource {
  S3BucketOwner?: string;
  S3Bucket: string;
  S3KeyPrefix?: string;
}
export const S3BucketSource = S.suspend(() =>
  S.Struct({
    S3BucketOwner: S.optional(S.String),
    S3Bucket: S.String,
    S3KeyPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "S3BucketSource",
}) as any as S.Schema<S3BucketSource>;
export interface TableCreationParameters {
  TableName: string;
  AttributeDefinitions: AttributeDefinitions;
  KeySchema: KeySchema;
  BillingMode?: string;
  ProvisionedThroughput?: ProvisionedThroughput;
  OnDemandThroughput?: OnDemandThroughput;
  SSESpecification?: SSESpecification;
  GlobalSecondaryIndexes?: GlobalSecondaryIndexList;
}
export const TableCreationParameters = S.suspend(() =>
  S.Struct({
    TableName: S.String,
    AttributeDefinitions: AttributeDefinitions,
    KeySchema: KeySchema,
    BillingMode: S.optional(S.String),
    ProvisionedThroughput: S.optional(ProvisionedThroughput),
    OnDemandThroughput: S.optional(OnDemandThroughput),
    SSESpecification: S.optional(SSESpecification),
    GlobalSecondaryIndexes: S.optional(GlobalSecondaryIndexList),
  }),
).annotations({
  identifier: "TableCreationParameters",
}) as any as S.Schema<TableCreationParameters>;
export type TableNameList = string[];
export const TableNameList = S.Array(S.String);
export type PutItemInputAttributeMap = { [key: string]: AttributeValue };
export const PutItemInputAttributeMap = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue).annotations({
    identifier: "AttributeValue",
  }),
});
export type AttributeMap = { [key: string]: AttributeValue };
export const AttributeMap = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue).annotations({
    identifier: "AttributeValue",
  }),
});
export type ItemList = AttributeMap[];
export const ItemList = S.Array(AttributeMap);
export interface PointInTimeRecoverySpecification {
  PointInTimeRecoveryEnabled: boolean;
  RecoveryPeriodInDays?: number;
}
export const PointInTimeRecoverySpecification = S.suspend(() =>
  S.Struct({
    PointInTimeRecoveryEnabled: S.Boolean,
    RecoveryPeriodInDays: S.optional(S.Number),
  }),
).annotations({
  identifier: "PointInTimeRecoverySpecification",
}) as any as S.Schema<PointInTimeRecoverySpecification>;
export interface AutoScalingTargetTrackingScalingPolicyConfigurationUpdate {
  DisableScaleIn?: boolean;
  ScaleInCooldown?: number;
  ScaleOutCooldown?: number;
  TargetValue: number;
}
export const AutoScalingTargetTrackingScalingPolicyConfigurationUpdate =
  S.suspend(() =>
    S.Struct({
      DisableScaleIn: S.optional(S.Boolean),
      ScaleInCooldown: S.optional(S.Number),
      ScaleOutCooldown: S.optional(S.Number),
      TargetValue: S.Number,
    }),
  ).annotations({
    identifier: "AutoScalingTargetTrackingScalingPolicyConfigurationUpdate",
  }) as any as S.Schema<AutoScalingTargetTrackingScalingPolicyConfigurationUpdate>;
export interface AutoScalingPolicyUpdate {
  PolicyName?: string;
  TargetTrackingScalingPolicyConfiguration: AutoScalingTargetTrackingScalingPolicyConfigurationUpdate;
}
export const AutoScalingPolicyUpdate = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    TargetTrackingScalingPolicyConfiguration:
      AutoScalingTargetTrackingScalingPolicyConfigurationUpdate,
  }),
).annotations({
  identifier: "AutoScalingPolicyUpdate",
}) as any as S.Schema<AutoScalingPolicyUpdate>;
export interface AutoScalingSettingsUpdate {
  MinimumUnits?: number;
  MaximumUnits?: number;
  AutoScalingDisabled?: boolean;
  AutoScalingRoleArn?: string;
  ScalingPolicyUpdate?: AutoScalingPolicyUpdate;
}
export const AutoScalingSettingsUpdate = S.suspend(() =>
  S.Struct({
    MinimumUnits: S.optional(S.Number),
    MaximumUnits: S.optional(S.Number),
    AutoScalingDisabled: S.optional(S.Boolean),
    AutoScalingRoleArn: S.optional(S.String),
    ScalingPolicyUpdate: S.optional(AutoScalingPolicyUpdate),
  }),
).annotations({
  identifier: "AutoScalingSettingsUpdate",
}) as any as S.Schema<AutoScalingSettingsUpdate>;
export interface GlobalTableGlobalSecondaryIndexSettingsUpdate {
  IndexName: string;
  ProvisionedWriteCapacityUnits?: number;
  ProvisionedWriteCapacityAutoScalingSettingsUpdate?: AutoScalingSettingsUpdate;
}
export const GlobalTableGlobalSecondaryIndexSettingsUpdate = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    ProvisionedWriteCapacityUnits: S.optional(S.Number),
    ProvisionedWriteCapacityAutoScalingSettingsUpdate: S.optional(
      AutoScalingSettingsUpdate,
    ),
  }),
).annotations({
  identifier: "GlobalTableGlobalSecondaryIndexSettingsUpdate",
}) as any as S.Schema<GlobalTableGlobalSecondaryIndexSettingsUpdate>;
export type GlobalTableGlobalSecondaryIndexSettingsUpdateList =
  GlobalTableGlobalSecondaryIndexSettingsUpdate[];
export const GlobalTableGlobalSecondaryIndexSettingsUpdateList = S.Array(
  GlobalTableGlobalSecondaryIndexSettingsUpdate,
);
export interface UpdateKinesisStreamingConfiguration {
  ApproximateCreationDateTimePrecision?: string;
}
export const UpdateKinesisStreamingConfiguration = S.suspend(() =>
  S.Struct({ ApproximateCreationDateTimePrecision: S.optional(S.String) }),
).annotations({
  identifier: "UpdateKinesisStreamingConfiguration",
}) as any as S.Schema<UpdateKinesisStreamingConfiguration>;
export interface GlobalSecondaryIndexAutoScalingUpdate {
  IndexName?: string;
  ProvisionedWriteCapacityAutoScalingUpdate?: AutoScalingSettingsUpdate;
}
export const GlobalSecondaryIndexAutoScalingUpdate = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    ProvisionedWriteCapacityAutoScalingUpdate: S.optional(
      AutoScalingSettingsUpdate,
    ),
  }),
).annotations({
  identifier: "GlobalSecondaryIndexAutoScalingUpdate",
}) as any as S.Schema<GlobalSecondaryIndexAutoScalingUpdate>;
export type GlobalSecondaryIndexAutoScalingUpdateList =
  GlobalSecondaryIndexAutoScalingUpdate[];
export const GlobalSecondaryIndexAutoScalingUpdateList = S.Array(
  GlobalSecondaryIndexAutoScalingUpdate,
);
export interface TimeToLiveSpecification {
  Enabled: boolean;
  AttributeName: string;
}
export const TimeToLiveSpecification = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, AttributeName: S.String }),
).annotations({
  identifier: "TimeToLiveSpecification",
}) as any as S.Schema<TimeToLiveSpecification>;
export type KeyList = Key[];
export const KeyList = S.Array(Key);
export type CsvHeaderList = string[];
export const CsvHeaderList = S.Array(S.String);
export interface BatchExecuteStatementInput {
  Statements: PartiQLBatchRequest;
  ReturnConsumedCapacity?: string;
}
export const BatchExecuteStatementInput = S.suspend(() =>
  S.Struct({
    Statements: PartiQLBatchRequest,
    ReturnConsumedCapacity: S.optional(S.String),
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
  identifier: "BatchExecuteStatementInput",
}) as any as S.Schema<BatchExecuteStatementInput>;
export interface CreateGlobalTableInput {
  GlobalTableName: string;
  ReplicationGroup: ReplicaList;
}
export const CreateGlobalTableInput = S.suspend(() =>
  S.Struct({
    GlobalTableName: S.String.pipe(T.ContextParam("ResourceArn")),
    ReplicationGroup: ReplicaList,
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
  identifier: "CreateGlobalTableInput",
}) as any as S.Schema<CreateGlobalTableInput>;
export interface DeleteResourcePolicyOutput {
  RevisionId?: string;
}
export const DeleteResourcePolicyOutput = S.suspend(() =>
  S.Struct({ RevisionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyOutput",
}) as any as S.Schema<DeleteResourcePolicyOutput>;
export interface BackupDetails {
  BackupArn: string;
  BackupName: string;
  BackupSizeBytes?: number;
  BackupStatus: string;
  BackupType: string;
  BackupCreationDateTime: Date;
  BackupExpiryDateTime?: Date;
}
export const BackupDetails = S.suspend(() =>
  S.Struct({
    BackupArn: S.String,
    BackupName: S.String,
    BackupSizeBytes: S.optional(S.Number),
    BackupStatus: S.String,
    BackupType: S.String,
    BackupCreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    BackupExpiryDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BackupDetails",
}) as any as S.Schema<BackupDetails>;
export interface SourceTableDetails {
  TableName: string;
  TableId: string;
  TableArn?: string;
  TableSizeBytes?: number;
  KeySchema: KeySchema;
  TableCreationDateTime: Date;
  ProvisionedThroughput: ProvisionedThroughput;
  OnDemandThroughput?: OnDemandThroughput;
  ItemCount?: number;
  BillingMode?: string;
}
export const SourceTableDetails = S.suspend(() =>
  S.Struct({
    TableName: S.String,
    TableId: S.String,
    TableArn: S.optional(S.String),
    TableSizeBytes: S.optional(S.Number),
    KeySchema: KeySchema,
    TableCreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ProvisionedThroughput: ProvisionedThroughput,
    OnDemandThroughput: S.optional(OnDemandThroughput),
    ItemCount: S.optional(S.Number),
    BillingMode: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceTableDetails",
}) as any as S.Schema<SourceTableDetails>;
export interface LocalSecondaryIndexInfo {
  IndexName?: string;
  KeySchema?: KeySchema;
  Projection?: Projection;
}
export const LocalSecondaryIndexInfo = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    KeySchema: S.optional(KeySchema),
    Projection: S.optional(Projection),
  }),
).annotations({
  identifier: "LocalSecondaryIndexInfo",
}) as any as S.Schema<LocalSecondaryIndexInfo>;
export type LocalSecondaryIndexes = LocalSecondaryIndexInfo[];
export const LocalSecondaryIndexes = S.Array(LocalSecondaryIndexInfo);
export interface GlobalSecondaryIndexInfo {
  IndexName?: string;
  KeySchema?: KeySchema;
  Projection?: Projection;
  ProvisionedThroughput?: ProvisionedThroughput;
  OnDemandThroughput?: OnDemandThroughput;
}
export const GlobalSecondaryIndexInfo = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    KeySchema: S.optional(KeySchema),
    Projection: S.optional(Projection),
    ProvisionedThroughput: S.optional(ProvisionedThroughput),
    OnDemandThroughput: S.optional(OnDemandThroughput),
  }),
).annotations({
  identifier: "GlobalSecondaryIndexInfo",
}) as any as S.Schema<GlobalSecondaryIndexInfo>;
export type GlobalSecondaryIndexes = GlobalSecondaryIndexInfo[];
export const GlobalSecondaryIndexes = S.Array(GlobalSecondaryIndexInfo);
export interface TimeToLiveDescription {
  TimeToLiveStatus?: string;
  AttributeName?: string;
}
export const TimeToLiveDescription = S.suspend(() =>
  S.Struct({
    TimeToLiveStatus: S.optional(S.String),
    AttributeName: S.optional(S.String),
  }),
).annotations({
  identifier: "TimeToLiveDescription",
}) as any as S.Schema<TimeToLiveDescription>;
export interface SSEDescription {
  Status?: string;
  SSEType?: string;
  KMSMasterKeyArn?: string;
  InaccessibleEncryptionDateTime?: Date;
}
export const SSEDescription = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    SSEType: S.optional(S.String),
    KMSMasterKeyArn: S.optional(S.String),
    InaccessibleEncryptionDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "SSEDescription",
}) as any as S.Schema<SSEDescription>;
export interface SourceTableFeatureDetails {
  LocalSecondaryIndexes?: LocalSecondaryIndexes;
  GlobalSecondaryIndexes?: GlobalSecondaryIndexes;
  StreamDescription?: StreamSpecification;
  TimeToLiveDescription?: TimeToLiveDescription;
  SSEDescription?: SSEDescription;
}
export const SourceTableFeatureDetails = S.suspend(() =>
  S.Struct({
    LocalSecondaryIndexes: S.optional(LocalSecondaryIndexes),
    GlobalSecondaryIndexes: S.optional(GlobalSecondaryIndexes),
    StreamDescription: S.optional(StreamSpecification),
    TimeToLiveDescription: S.optional(TimeToLiveDescription),
    SSEDescription: S.optional(SSEDescription),
  }),
).annotations({
  identifier: "SourceTableFeatureDetails",
}) as any as S.Schema<SourceTableFeatureDetails>;
export interface BackupDescription {
  BackupDetails?: BackupDetails;
  SourceTableDetails?: SourceTableDetails;
  SourceTableFeatureDetails?: SourceTableFeatureDetails;
}
export const BackupDescription = S.suspend(() =>
  S.Struct({
    BackupDetails: S.optional(BackupDetails),
    SourceTableDetails: S.optional(SourceTableDetails),
    SourceTableFeatureDetails: S.optional(SourceTableFeatureDetails),
  }),
).annotations({
  identifier: "BackupDescription",
}) as any as S.Schema<BackupDescription>;
export interface DescribeBackupOutput {
  BackupDescription?: BackupDescription;
}
export const DescribeBackupOutput = S.suspend(() =>
  S.Struct({ BackupDescription: S.optional(BackupDescription) }).pipe(ns),
).annotations({
  identifier: "DescribeBackupOutput",
}) as any as S.Schema<DescribeBackupOutput>;
export interface DescribeEndpointsResponse {
  Endpoints: Endpoints;
}
export const DescribeEndpointsResponse = S.suspend(() =>
  S.Struct({ Endpoints: Endpoints }).pipe(ns),
).annotations({
  identifier: "DescribeEndpointsResponse",
}) as any as S.Schema<DescribeEndpointsResponse>;
export interface ProvisionedThroughputDescription {
  LastIncreaseDateTime?: Date;
  LastDecreaseDateTime?: Date;
  NumberOfDecreasesToday?: number;
  ReadCapacityUnits?: number;
  WriteCapacityUnits?: number;
}
export const ProvisionedThroughputDescription = S.suspend(() =>
  S.Struct({
    LastIncreaseDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastDecreaseDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NumberOfDecreasesToday: S.optional(S.Number),
    ReadCapacityUnits: S.optional(S.Number),
    WriteCapacityUnits: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProvisionedThroughputDescription",
}) as any as S.Schema<ProvisionedThroughputDescription>;
export interface BillingModeSummary {
  BillingMode?: string;
  LastUpdateToPayPerRequestDateTime?: Date;
}
export const BillingModeSummary = S.suspend(() =>
  S.Struct({
    BillingMode: S.optional(S.String),
    LastUpdateToPayPerRequestDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BillingModeSummary",
}) as any as S.Schema<BillingModeSummary>;
export interface LocalSecondaryIndexDescription {
  IndexName?: string;
  KeySchema?: KeySchema;
  Projection?: Projection;
  IndexSizeBytes?: number;
  ItemCount?: number;
  IndexArn?: string;
}
export const LocalSecondaryIndexDescription = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    KeySchema: S.optional(KeySchema),
    Projection: S.optional(Projection),
    IndexSizeBytes: S.optional(S.Number),
    ItemCount: S.optional(S.Number),
    IndexArn: S.optional(S.String),
  }),
).annotations({
  identifier: "LocalSecondaryIndexDescription",
}) as any as S.Schema<LocalSecondaryIndexDescription>;
export type LocalSecondaryIndexDescriptionList =
  LocalSecondaryIndexDescription[];
export const LocalSecondaryIndexDescriptionList = S.Array(
  LocalSecondaryIndexDescription,
);
export interface GlobalSecondaryIndexWarmThroughputDescription {
  ReadUnitsPerSecond?: number;
  WriteUnitsPerSecond?: number;
  Status?: string;
}
export const GlobalSecondaryIndexWarmThroughputDescription = S.suspend(() =>
  S.Struct({
    ReadUnitsPerSecond: S.optional(S.Number),
    WriteUnitsPerSecond: S.optional(S.Number),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "GlobalSecondaryIndexWarmThroughputDescription",
}) as any as S.Schema<GlobalSecondaryIndexWarmThroughputDescription>;
export interface GlobalSecondaryIndexDescription {
  IndexName?: string;
  KeySchema?: KeySchema;
  Projection?: Projection;
  IndexStatus?: string;
  Backfilling?: boolean;
  ProvisionedThroughput?: ProvisionedThroughputDescription;
  IndexSizeBytes?: number;
  ItemCount?: number;
  IndexArn?: string;
  OnDemandThroughput?: OnDemandThroughput;
  WarmThroughput?: GlobalSecondaryIndexWarmThroughputDescription;
}
export const GlobalSecondaryIndexDescription = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    KeySchema: S.optional(KeySchema),
    Projection: S.optional(Projection),
    IndexStatus: S.optional(S.String),
    Backfilling: S.optional(S.Boolean),
    ProvisionedThroughput: S.optional(ProvisionedThroughputDescription),
    IndexSizeBytes: S.optional(S.Number),
    ItemCount: S.optional(S.Number),
    IndexArn: S.optional(S.String),
    OnDemandThroughput: S.optional(OnDemandThroughput),
    WarmThroughput: S.optional(GlobalSecondaryIndexWarmThroughputDescription),
  }),
).annotations({
  identifier: "GlobalSecondaryIndexDescription",
}) as any as S.Schema<GlobalSecondaryIndexDescription>;
export type GlobalSecondaryIndexDescriptionList =
  GlobalSecondaryIndexDescription[];
export const GlobalSecondaryIndexDescriptionList = S.Array(
  GlobalSecondaryIndexDescription,
);
export interface ProvisionedThroughputOverride {
  ReadCapacityUnits?: number;
}
export const ProvisionedThroughputOverride = S.suspend(() =>
  S.Struct({ ReadCapacityUnits: S.optional(S.Number) }),
).annotations({
  identifier: "ProvisionedThroughputOverride",
}) as any as S.Schema<ProvisionedThroughputOverride>;
export interface OnDemandThroughputOverride {
  MaxReadRequestUnits?: number;
}
export const OnDemandThroughputOverride = S.suspend(() =>
  S.Struct({ MaxReadRequestUnits: S.optional(S.Number) }),
).annotations({
  identifier: "OnDemandThroughputOverride",
}) as any as S.Schema<OnDemandThroughputOverride>;
export interface TableWarmThroughputDescription {
  ReadUnitsPerSecond?: number;
  WriteUnitsPerSecond?: number;
  Status?: string;
}
export const TableWarmThroughputDescription = S.suspend(() =>
  S.Struct({
    ReadUnitsPerSecond: S.optional(S.Number),
    WriteUnitsPerSecond: S.optional(S.Number),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "TableWarmThroughputDescription",
}) as any as S.Schema<TableWarmThroughputDescription>;
export interface ReplicaGlobalSecondaryIndexDescription {
  IndexName?: string;
  ProvisionedThroughputOverride?: ProvisionedThroughputOverride;
  OnDemandThroughputOverride?: OnDemandThroughputOverride;
  WarmThroughput?: GlobalSecondaryIndexWarmThroughputDescription;
}
export const ReplicaGlobalSecondaryIndexDescription = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    ProvisionedThroughputOverride: S.optional(ProvisionedThroughputOverride),
    OnDemandThroughputOverride: S.optional(OnDemandThroughputOverride),
    WarmThroughput: S.optional(GlobalSecondaryIndexWarmThroughputDescription),
  }),
).annotations({
  identifier: "ReplicaGlobalSecondaryIndexDescription",
}) as any as S.Schema<ReplicaGlobalSecondaryIndexDescription>;
export type ReplicaGlobalSecondaryIndexDescriptionList =
  ReplicaGlobalSecondaryIndexDescription[];
export const ReplicaGlobalSecondaryIndexDescriptionList = S.Array(
  ReplicaGlobalSecondaryIndexDescription,
);
export interface TableClassSummary {
  TableClass?: string;
  LastUpdateDateTime?: Date;
}
export const TableClassSummary = S.suspend(() =>
  S.Struct({
    TableClass: S.optional(S.String),
    LastUpdateDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "TableClassSummary",
}) as any as S.Schema<TableClassSummary>;
export interface ReplicaDescription {
  RegionName?: string;
  ReplicaStatus?: string;
  ReplicaStatusDescription?: string;
  ReplicaStatusPercentProgress?: string;
  KMSMasterKeyId?: string;
  ProvisionedThroughputOverride?: ProvisionedThroughputOverride;
  OnDemandThroughputOverride?: OnDemandThroughputOverride;
  WarmThroughput?: TableWarmThroughputDescription;
  GlobalSecondaryIndexes?: ReplicaGlobalSecondaryIndexDescriptionList;
  ReplicaInaccessibleDateTime?: Date;
  ReplicaTableClassSummary?: TableClassSummary;
}
export const ReplicaDescription = S.suspend(() =>
  S.Struct({
    RegionName: S.optional(S.String),
    ReplicaStatus: S.optional(S.String),
    ReplicaStatusDescription: S.optional(S.String),
    ReplicaStatusPercentProgress: S.optional(S.String),
    KMSMasterKeyId: S.optional(S.String),
    ProvisionedThroughputOverride: S.optional(ProvisionedThroughputOverride),
    OnDemandThroughputOverride: S.optional(OnDemandThroughputOverride),
    WarmThroughput: S.optional(TableWarmThroughputDescription),
    GlobalSecondaryIndexes: S.optional(
      ReplicaGlobalSecondaryIndexDescriptionList,
    ),
    ReplicaInaccessibleDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReplicaTableClassSummary: S.optional(TableClassSummary),
  }),
).annotations({
  identifier: "ReplicaDescription",
}) as any as S.Schema<ReplicaDescription>;
export type ReplicaDescriptionList = ReplicaDescription[];
export const ReplicaDescriptionList = S.Array(ReplicaDescription);
export interface GlobalTableWitnessDescription {
  RegionName?: string;
  WitnessStatus?: string;
}
export const GlobalTableWitnessDescription = S.suspend(() =>
  S.Struct({
    RegionName: S.optional(S.String),
    WitnessStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "GlobalTableWitnessDescription",
}) as any as S.Schema<GlobalTableWitnessDescription>;
export type GlobalTableWitnessDescriptionList = GlobalTableWitnessDescription[];
export const GlobalTableWitnessDescriptionList = S.Array(
  GlobalTableWitnessDescription,
);
export interface RestoreSummary {
  SourceBackupArn?: string;
  SourceTableArn?: string;
  RestoreDateTime: Date;
  RestoreInProgress: boolean;
}
export const RestoreSummary = S.suspend(() =>
  S.Struct({
    SourceBackupArn: S.optional(S.String),
    SourceTableArn: S.optional(S.String),
    RestoreDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RestoreInProgress: S.Boolean,
  }),
).annotations({
  identifier: "RestoreSummary",
}) as any as S.Schema<RestoreSummary>;
export interface ArchivalSummary {
  ArchivalDateTime?: Date;
  ArchivalReason?: string;
  ArchivalBackupArn?: string;
}
export const ArchivalSummary = S.suspend(() =>
  S.Struct({
    ArchivalDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ArchivalReason: S.optional(S.String),
    ArchivalBackupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ArchivalSummary",
}) as any as S.Schema<ArchivalSummary>;
export interface TableDescription {
  AttributeDefinitions?: AttributeDefinitions;
  TableName?: string;
  KeySchema?: KeySchema;
  TableStatus?: string;
  CreationDateTime?: Date;
  ProvisionedThroughput?: ProvisionedThroughputDescription;
  TableSizeBytes?: number;
  ItemCount?: number;
  TableArn?: string;
  TableId?: string;
  BillingModeSummary?: BillingModeSummary;
  LocalSecondaryIndexes?: LocalSecondaryIndexDescriptionList;
  GlobalSecondaryIndexes?: GlobalSecondaryIndexDescriptionList;
  StreamSpecification?: StreamSpecification;
  LatestStreamLabel?: string;
  LatestStreamArn?: string;
  GlobalTableVersion?: string;
  Replicas?: ReplicaDescriptionList;
  GlobalTableWitnesses?: GlobalTableWitnessDescriptionList;
  RestoreSummary?: RestoreSummary;
  SSEDescription?: SSEDescription;
  ArchivalSummary?: ArchivalSummary;
  TableClassSummary?: TableClassSummary;
  DeletionProtectionEnabled?: boolean;
  OnDemandThroughput?: OnDemandThroughput;
  WarmThroughput?: TableWarmThroughputDescription;
  MultiRegionConsistency?: string;
}
export const TableDescription = S.suspend(() =>
  S.Struct({
    AttributeDefinitions: S.optional(AttributeDefinitions),
    TableName: S.optional(S.String),
    KeySchema: S.optional(KeySchema),
    TableStatus: S.optional(S.String),
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ProvisionedThroughput: S.optional(ProvisionedThroughputDescription),
    TableSizeBytes: S.optional(S.Number),
    ItemCount: S.optional(S.Number),
    TableArn: S.optional(S.String),
    TableId: S.optional(S.String),
    BillingModeSummary: S.optional(BillingModeSummary),
    LocalSecondaryIndexes: S.optional(LocalSecondaryIndexDescriptionList),
    GlobalSecondaryIndexes: S.optional(GlobalSecondaryIndexDescriptionList),
    StreamSpecification: S.optional(StreamSpecification),
    LatestStreamLabel: S.optional(S.String),
    LatestStreamArn: S.optional(S.String),
    GlobalTableVersion: S.optional(S.String),
    Replicas: S.optional(ReplicaDescriptionList),
    GlobalTableWitnesses: S.optional(GlobalTableWitnessDescriptionList),
    RestoreSummary: S.optional(RestoreSummary),
    SSEDescription: S.optional(SSEDescription),
    ArchivalSummary: S.optional(ArchivalSummary),
    TableClassSummary: S.optional(TableClassSummary),
    DeletionProtectionEnabled: S.optional(S.Boolean),
    OnDemandThroughput: S.optional(OnDemandThroughput),
    WarmThroughput: S.optional(TableWarmThroughputDescription),
    MultiRegionConsistency: S.optional(S.String),
  }),
).annotations({
  identifier: "TableDescription",
}) as any as S.Schema<TableDescription>;
export interface DescribeTableOutput {
  Table?: TableDescription;
}
export const DescribeTableOutput = S.suspend(() =>
  S.Struct({ Table: S.optional(TableDescription) }).pipe(ns),
).annotations({
  identifier: "DescribeTableOutput",
}) as any as S.Schema<DescribeTableOutput>;
export interface KinesisStreamingDestinationInput {
  TableName: string;
  StreamArn: string;
  EnableKinesisStreamingConfiguration?: EnableKinesisStreamingConfiguration;
}
export const KinesisStreamingDestinationInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    StreamArn: S.String,
    EnableKinesisStreamingConfiguration: S.optional(
      EnableKinesisStreamingConfiguration,
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
  identifier: "KinesisStreamingDestinationInput",
}) as any as S.Schema<KinesisStreamingDestinationInput>;
export interface ExecuteTransactionInput {
  TransactStatements: ParameterizedStatements;
  ClientRequestToken?: string;
  ReturnConsumedCapacity?: string;
}
export const ExecuteTransactionInput = S.suspend(() =>
  S.Struct({
    TransactStatements: ParameterizedStatements,
    ClientRequestToken: S.optional(S.String),
    ReturnConsumedCapacity: S.optional(S.String),
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
  identifier: "ExecuteTransactionInput",
}) as any as S.Schema<ExecuteTransactionInput>;
export interface ExportTableToPointInTimeInput {
  TableArn: string;
  ExportTime?: Date;
  ClientToken?: string;
  S3Bucket: string;
  S3BucketOwner?: string;
  S3Prefix?: string;
  S3SseAlgorithm?: string;
  S3SseKmsKeyId?: string;
  ExportFormat?: string;
  ExportType?: string;
  IncrementalExportSpecification?: IncrementalExportSpecification;
}
export const ExportTableToPointInTimeInput = S.suspend(() =>
  S.Struct({
    TableArn: S.String.pipe(T.ContextParam("ResourceArn")),
    ExportTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClientToken: S.optional(S.String),
    S3Bucket: S.String,
    S3BucketOwner: S.optional(S.String),
    S3Prefix: S.optional(S.String),
    S3SseAlgorithm: S.optional(S.String),
    S3SseKmsKeyId: S.optional(S.String),
    ExportFormat: S.optional(S.String),
    ExportType: S.optional(S.String),
    IncrementalExportSpecification: S.optional(IncrementalExportSpecification),
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
  identifier: "ExportTableToPointInTimeInput",
}) as any as S.Schema<ExportTableToPointInTimeInput>;
export interface GetResourcePolicyOutput {
  Policy?: string;
  RevisionId?: string;
}
export const GetResourcePolicyOutput = S.suspend(() =>
  S.Struct({
    Policy: S.optional(S.String),
    RevisionId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetResourcePolicyOutput",
}) as any as S.Schema<GetResourcePolicyOutput>;
export interface ListTablesOutput {
  TableNames?: TableNameList;
  LastEvaluatedTableName?: string;
}
export const ListTablesOutput = S.suspend(() =>
  S.Struct({
    TableNames: S.optional(TableNameList),
    LastEvaluatedTableName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTablesOutput",
}) as any as S.Schema<ListTablesOutput>;
export interface ListTagsOfResourceOutput {
  Tags?: TagList;
  NextToken?: string;
}
export const ListTagsOfResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsOfResourceOutput",
}) as any as S.Schema<ListTagsOfResourceOutput>;
export interface ExpectedAttributeValue {
  Value?: AttributeValue;
  Exists?: boolean;
  ComparisonOperator?: string;
  AttributeValueList?: AttributeValueList;
}
export const ExpectedAttributeValue = S.suspend(() =>
  S.Struct({
    Value: S.optional(AttributeValue),
    Exists: S.optional(S.Boolean),
    ComparisonOperator: S.optional(S.String),
    AttributeValueList: S.optional(AttributeValueList),
  }),
).annotations({
  identifier: "ExpectedAttributeValue",
}) as any as S.Schema<ExpectedAttributeValue>;
export type ExpectedAttributeMap = { [key: string]: ExpectedAttributeValue };
export const ExpectedAttributeMap = S.Record({
  key: S.String,
  value: ExpectedAttributeValue,
});
export interface PutItemInput {
  TableName: string;
  Item: PutItemInputAttributeMap;
  Expected?: ExpectedAttributeMap;
  ReturnValues?: string;
  ReturnConsumedCapacity?: string;
  ReturnItemCollectionMetrics?: string;
  ConditionalOperator?: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const PutItemInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    Item: PutItemInputAttributeMap,
    Expected: S.optional(ExpectedAttributeMap),
    ReturnValues: S.optional(S.String),
    ReturnConsumedCapacity: S.optional(S.String),
    ReturnItemCollectionMetrics: S.optional(S.String),
    ConditionalOperator: S.optional(S.String),
    ConditionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
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
).annotations({ identifier: "PutItemInput" }) as any as S.Schema<PutItemInput>;
export interface PutResourcePolicyOutput {
  RevisionId?: string;
}
export const PutResourcePolicyOutput = S.suspend(() =>
  S.Struct({ RevisionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyOutput",
}) as any as S.Schema<PutResourcePolicyOutput>;
export interface RestoreTableFromBackupOutput {
  TableDescription?: TableDescription;
}
export const RestoreTableFromBackupOutput = S.suspend(() =>
  S.Struct({ TableDescription: S.optional(TableDescription) }).pipe(ns),
).annotations({
  identifier: "RestoreTableFromBackupOutput",
}) as any as S.Schema<RestoreTableFromBackupOutput>;
export interface RestoreTableToPointInTimeOutput {
  TableDescription?: TableDescription;
}
export const RestoreTableToPointInTimeOutput = S.suspend(() =>
  S.Struct({ TableDescription: S.optional(TableDescription) }).pipe(ns),
).annotations({
  identifier: "RestoreTableToPointInTimeOutput",
}) as any as S.Schema<RestoreTableToPointInTimeOutput>;
export interface Capacity {
  ReadCapacityUnits?: number;
  WriteCapacityUnits?: number;
  CapacityUnits?: number;
}
export const Capacity = S.suspend(() =>
  S.Struct({
    ReadCapacityUnits: S.optional(S.Number),
    WriteCapacityUnits: S.optional(S.Number),
    CapacityUnits: S.optional(S.Number),
  }),
).annotations({ identifier: "Capacity" }) as any as S.Schema<Capacity>;
export type SecondaryIndexesCapacityMap = { [key: string]: Capacity };
export const SecondaryIndexesCapacityMap = S.Record({
  key: S.String,
  value: Capacity,
});
export interface ConsumedCapacity {
  TableName?: string;
  CapacityUnits?: number;
  ReadCapacityUnits?: number;
  WriteCapacityUnits?: number;
  Table?: Capacity;
  LocalSecondaryIndexes?: SecondaryIndexesCapacityMap;
  GlobalSecondaryIndexes?: SecondaryIndexesCapacityMap;
}
export const ConsumedCapacity = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    CapacityUnits: S.optional(S.Number),
    ReadCapacityUnits: S.optional(S.Number),
    WriteCapacityUnits: S.optional(S.Number),
    Table: S.optional(Capacity),
    LocalSecondaryIndexes: S.optional(SecondaryIndexesCapacityMap),
    GlobalSecondaryIndexes: S.optional(SecondaryIndexesCapacityMap),
  }),
).annotations({
  identifier: "ConsumedCapacity",
}) as any as S.Schema<ConsumedCapacity>;
export interface ScanOutput {
  Items?: ItemList;
  Count?: number;
  ScannedCount?: number;
  LastEvaluatedKey?: Key;
  ConsumedCapacity?: ConsumedCapacity;
}
export const ScanOutput = S.suspend(() =>
  S.Struct({
    Items: S.optional(ItemList),
    Count: S.optional(S.Number),
    ScannedCount: S.optional(S.Number),
    LastEvaluatedKey: S.optional(Key),
    ConsumedCapacity: S.optional(ConsumedCapacity),
  }).pipe(ns),
).annotations({ identifier: "ScanOutput" }) as any as S.Schema<ScanOutput>;
export interface UpdateContinuousBackupsInput {
  TableName: string;
  PointInTimeRecoverySpecification: PointInTimeRecoverySpecification;
}
export const UpdateContinuousBackupsInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    PointInTimeRecoverySpecification: PointInTimeRecoverySpecification,
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
  identifier: "UpdateContinuousBackupsInput",
}) as any as S.Schema<UpdateContinuousBackupsInput>;
export interface UpdateContributorInsightsOutput {
  TableName?: string;
  IndexName?: string;
  ContributorInsightsStatus?: string;
  ContributorInsightsMode?: string;
}
export const UpdateContributorInsightsOutput = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    IndexName: S.optional(S.String),
    ContributorInsightsStatus: S.optional(S.String),
    ContributorInsightsMode: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateContributorInsightsOutput",
}) as any as S.Schema<UpdateContributorInsightsOutput>;
export interface UpdateKinesisStreamingDestinationInput {
  TableName: string;
  StreamArn: string;
  UpdateKinesisStreamingConfiguration?: UpdateKinesisStreamingConfiguration;
}
export const UpdateKinesisStreamingDestinationInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    StreamArn: S.String,
    UpdateKinesisStreamingConfiguration: S.optional(
      UpdateKinesisStreamingConfiguration,
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
  identifier: "UpdateKinesisStreamingDestinationInput",
}) as any as S.Schema<UpdateKinesisStreamingDestinationInput>;
export interface UpdateTimeToLiveInput {
  TableName: string;
  TimeToLiveSpecification: TimeToLiveSpecification;
}
export const UpdateTimeToLiveInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    TimeToLiveSpecification: TimeToLiveSpecification,
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
  identifier: "UpdateTimeToLiveInput",
}) as any as S.Schema<UpdateTimeToLiveInput>;
export interface KeysAndAttributes {
  Keys: KeyList;
  AttributesToGet?: AttributeNameList;
  ConsistentRead?: boolean;
  ProjectionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
}
export const KeysAndAttributes = S.suspend(() =>
  S.Struct({
    Keys: KeyList,
    AttributesToGet: S.optional(AttributeNameList),
    ConsistentRead: S.optional(S.Boolean),
    ProjectionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
  }),
).annotations({
  identifier: "KeysAndAttributes",
}) as any as S.Schema<KeysAndAttributes>;
export type MapAttributeValue = { [key: string]: AttributeValue };
export const MapAttributeValue = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue).annotations({
    identifier: "AttributeValue",
  }),
}) as any as S.Schema<MapAttributeValue>;
export interface CsvOptions {
  Delimiter?: string;
  HeaderList?: CsvHeaderList;
}
export const CsvOptions = S.suspend(() =>
  S.Struct({
    Delimiter: S.optional(S.String),
    HeaderList: S.optional(CsvHeaderList),
  }),
).annotations({ identifier: "CsvOptions" }) as any as S.Schema<CsvOptions>;
export interface Get {
  Key: Key;
  TableName: string;
  ProjectionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
}
export const Get = S.suspend(() =>
  S.Struct({
    Key: Key,
    TableName: S.String,
    ProjectionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
  }),
).annotations({ identifier: "Get" }) as any as S.Schema<Get>;
export interface ConditionCheck {
  Key: Key;
  TableName: string;
  ConditionExpression: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const ConditionCheck = S.suspend(() =>
  S.Struct({
    Key: Key,
    TableName: S.String,
    ConditionExpression: S.String,
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
  }),
).annotations({
  identifier: "ConditionCheck",
}) as any as S.Schema<ConditionCheck>;
export interface Put {
  Item: PutItemInputAttributeMap;
  TableName: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const Put = S.suspend(() =>
  S.Struct({
    Item: PutItemInputAttributeMap,
    TableName: S.String,
    ConditionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
  }),
).annotations({ identifier: "Put" }) as any as S.Schema<Put>;
export interface Delete {
  Key: Key;
  TableName: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const Delete = S.suspend(() =>
  S.Struct({
    Key: Key,
    TableName: S.String,
    ConditionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
  }),
).annotations({ identifier: "Delete" }) as any as S.Schema<Delete>;
export interface Update {
  Key: Key;
  UpdateExpression: string;
  TableName: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const Update = S.suspend(() =>
  S.Struct({
    Key: Key,
    UpdateExpression: S.String,
    TableName: S.String,
    ConditionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
  }),
).annotations({ identifier: "Update" }) as any as S.Schema<Update>;
export interface CreateReplicaAction {
  RegionName: string;
}
export const CreateReplicaAction = S.suspend(() =>
  S.Struct({ RegionName: S.String }),
).annotations({
  identifier: "CreateReplicaAction",
}) as any as S.Schema<CreateReplicaAction>;
export interface DeleteReplicaAction {
  RegionName: string;
}
export const DeleteReplicaAction = S.suspend(() =>
  S.Struct({ RegionName: S.String }),
).annotations({
  identifier: "DeleteReplicaAction",
}) as any as S.Schema<DeleteReplicaAction>;
export interface ReplicaGlobalSecondaryIndexSettingsUpdate {
  IndexName: string;
  ProvisionedReadCapacityUnits?: number;
  ProvisionedReadCapacityAutoScalingSettingsUpdate?: AutoScalingSettingsUpdate;
}
export const ReplicaGlobalSecondaryIndexSettingsUpdate = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    ProvisionedReadCapacityUnits: S.optional(S.Number),
    ProvisionedReadCapacityAutoScalingSettingsUpdate: S.optional(
      AutoScalingSettingsUpdate,
    ),
  }),
).annotations({
  identifier: "ReplicaGlobalSecondaryIndexSettingsUpdate",
}) as any as S.Schema<ReplicaGlobalSecondaryIndexSettingsUpdate>;
export type ReplicaGlobalSecondaryIndexSettingsUpdateList =
  ReplicaGlobalSecondaryIndexSettingsUpdate[];
export const ReplicaGlobalSecondaryIndexSettingsUpdateList = S.Array(
  ReplicaGlobalSecondaryIndexSettingsUpdate,
);
export interface AttributeValueUpdate {
  Value?: AttributeValue;
  Action?: string;
}
export const AttributeValueUpdate = S.suspend(() =>
  S.Struct({ Value: S.optional(AttributeValue), Action: S.optional(S.String) }),
).annotations({
  identifier: "AttributeValueUpdate",
}) as any as S.Schema<AttributeValueUpdate>;
export interface UpdateGlobalSecondaryIndexAction {
  IndexName: string;
  ProvisionedThroughput?: ProvisionedThroughput;
  OnDemandThroughput?: OnDemandThroughput;
  WarmThroughput?: WarmThroughput;
}
export const UpdateGlobalSecondaryIndexAction = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    ProvisionedThroughput: S.optional(ProvisionedThroughput),
    OnDemandThroughput: S.optional(OnDemandThroughput),
    WarmThroughput: S.optional(WarmThroughput),
  }),
).annotations({
  identifier: "UpdateGlobalSecondaryIndexAction",
}) as any as S.Schema<UpdateGlobalSecondaryIndexAction>;
export interface CreateGlobalSecondaryIndexAction {
  IndexName: string;
  KeySchema: KeySchema;
  Projection: Projection;
  ProvisionedThroughput?: ProvisionedThroughput;
  OnDemandThroughput?: OnDemandThroughput;
  WarmThroughput?: WarmThroughput;
}
export const CreateGlobalSecondaryIndexAction = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    KeySchema: KeySchema,
    Projection: Projection,
    ProvisionedThroughput: S.optional(ProvisionedThroughput),
    OnDemandThroughput: S.optional(OnDemandThroughput),
    WarmThroughput: S.optional(WarmThroughput),
  }),
).annotations({
  identifier: "CreateGlobalSecondaryIndexAction",
}) as any as S.Schema<CreateGlobalSecondaryIndexAction>;
export interface DeleteGlobalSecondaryIndexAction {
  IndexName: string;
}
export const DeleteGlobalSecondaryIndexAction = S.suspend(() =>
  S.Struct({ IndexName: S.String }),
).annotations({
  identifier: "DeleteGlobalSecondaryIndexAction",
}) as any as S.Schema<DeleteGlobalSecondaryIndexAction>;
export interface ReplicaGlobalSecondaryIndex {
  IndexName: string;
  ProvisionedThroughputOverride?: ProvisionedThroughputOverride;
  OnDemandThroughputOverride?: OnDemandThroughputOverride;
}
export const ReplicaGlobalSecondaryIndex = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    ProvisionedThroughputOverride: S.optional(ProvisionedThroughputOverride),
    OnDemandThroughputOverride: S.optional(OnDemandThroughputOverride),
  }),
).annotations({
  identifier: "ReplicaGlobalSecondaryIndex",
}) as any as S.Schema<ReplicaGlobalSecondaryIndex>;
export type ReplicaGlobalSecondaryIndexList = ReplicaGlobalSecondaryIndex[];
export const ReplicaGlobalSecondaryIndexList = S.Array(
  ReplicaGlobalSecondaryIndex,
);
export interface UpdateReplicationGroupMemberAction {
  RegionName: string;
  KMSMasterKeyId?: string;
  ProvisionedThroughputOverride?: ProvisionedThroughputOverride;
  OnDemandThroughputOverride?: OnDemandThroughputOverride;
  GlobalSecondaryIndexes?: ReplicaGlobalSecondaryIndexList;
  TableClassOverride?: string;
}
export const UpdateReplicationGroupMemberAction = S.suspend(() =>
  S.Struct({
    RegionName: S.String,
    KMSMasterKeyId: S.optional(S.String),
    ProvisionedThroughputOverride: S.optional(ProvisionedThroughputOverride),
    OnDemandThroughputOverride: S.optional(OnDemandThroughputOverride),
    GlobalSecondaryIndexes: S.optional(ReplicaGlobalSecondaryIndexList),
    TableClassOverride: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateReplicationGroupMemberAction",
}) as any as S.Schema<UpdateReplicationGroupMemberAction>;
export interface DeleteReplicationGroupMemberAction {
  RegionName: string;
}
export const DeleteReplicationGroupMemberAction = S.suspend(() =>
  S.Struct({ RegionName: S.String }),
).annotations({
  identifier: "DeleteReplicationGroupMemberAction",
}) as any as S.Schema<DeleteReplicationGroupMemberAction>;
export interface CreateGlobalTableWitnessGroupMemberAction {
  RegionName: string;
}
export const CreateGlobalTableWitnessGroupMemberAction = S.suspend(() =>
  S.Struct({ RegionName: S.String }),
).annotations({
  identifier: "CreateGlobalTableWitnessGroupMemberAction",
}) as any as S.Schema<CreateGlobalTableWitnessGroupMemberAction>;
export interface DeleteGlobalTableWitnessGroupMemberAction {
  RegionName: string;
}
export const DeleteGlobalTableWitnessGroupMemberAction = S.suspend(() =>
  S.Struct({ RegionName: S.String }),
).annotations({
  identifier: "DeleteGlobalTableWitnessGroupMemberAction",
}) as any as S.Schema<DeleteGlobalTableWitnessGroupMemberAction>;
export interface ReplicaGlobalSecondaryIndexAutoScalingUpdate {
  IndexName?: string;
  ProvisionedReadCapacityAutoScalingUpdate?: AutoScalingSettingsUpdate;
}
export const ReplicaGlobalSecondaryIndexAutoScalingUpdate = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    ProvisionedReadCapacityAutoScalingUpdate: S.optional(
      AutoScalingSettingsUpdate,
    ),
  }),
).annotations({
  identifier: "ReplicaGlobalSecondaryIndexAutoScalingUpdate",
}) as any as S.Schema<ReplicaGlobalSecondaryIndexAutoScalingUpdate>;
export type ReplicaGlobalSecondaryIndexAutoScalingUpdateList =
  ReplicaGlobalSecondaryIndexAutoScalingUpdate[];
export const ReplicaGlobalSecondaryIndexAutoScalingUpdateList = S.Array(
  ReplicaGlobalSecondaryIndexAutoScalingUpdate,
);
export type ConsumedCapacityMultiple = ConsumedCapacity[];
export const ConsumedCapacityMultiple = S.Array(ConsumedCapacity);
export type BatchGetRequestMap = { [key: string]: KeysAndAttributes };
export const BatchGetRequestMap = S.Record({
  key: S.String,
  value: KeysAndAttributes,
});
export interface FailureException {
  ExceptionName?: string;
  ExceptionDescription?: string;
}
export const FailureException = S.suspend(() =>
  S.Struct({
    ExceptionName: S.optional(S.String),
    ExceptionDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "FailureException",
}) as any as S.Schema<FailureException>;
export interface ExportDescription {
  ExportArn?: string;
  ExportStatus?: string;
  StartTime?: Date;
  EndTime?: Date;
  ExportManifest?: string;
  TableArn?: string;
  TableId?: string;
  ExportTime?: Date;
  ClientToken?: string;
  S3Bucket?: string;
  S3BucketOwner?: string;
  S3Prefix?: string;
  S3SseAlgorithm?: string;
  S3SseKmsKeyId?: string;
  FailureCode?: string;
  FailureMessage?: string;
  ExportFormat?: string;
  BilledSizeBytes?: number;
  ItemCount?: number;
  ExportType?: string;
  IncrementalExportSpecification?: IncrementalExportSpecification;
}
export const ExportDescription = S.suspend(() =>
  S.Struct({
    ExportArn: S.optional(S.String),
    ExportStatus: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExportManifest: S.optional(S.String),
    TableArn: S.optional(S.String),
    TableId: S.optional(S.String),
    ExportTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClientToken: S.optional(S.String),
    S3Bucket: S.optional(S.String),
    S3BucketOwner: S.optional(S.String),
    S3Prefix: S.optional(S.String),
    S3SseAlgorithm: S.optional(S.String),
    S3SseKmsKeyId: S.optional(S.String),
    FailureCode: S.optional(S.String),
    FailureMessage: S.optional(S.String),
    ExportFormat: S.optional(S.String),
    BilledSizeBytes: S.optional(S.Number),
    ItemCount: S.optional(S.Number),
    ExportType: S.optional(S.String),
    IncrementalExportSpecification: S.optional(IncrementalExportSpecification),
  }),
).annotations({
  identifier: "ExportDescription",
}) as any as S.Schema<ExportDescription>;
export interface GlobalTableDescription {
  ReplicationGroup?: ReplicaDescriptionList;
  GlobalTableArn?: string;
  CreationDateTime?: Date;
  GlobalTableStatus?: string;
  GlobalTableName?: string;
}
export const GlobalTableDescription = S.suspend(() =>
  S.Struct({
    ReplicationGroup: S.optional(ReplicaDescriptionList),
    GlobalTableArn: S.optional(S.String),
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    GlobalTableStatus: S.optional(S.String),
    GlobalTableName: S.optional(S.String),
  }),
).annotations({
  identifier: "GlobalTableDescription",
}) as any as S.Schema<GlobalTableDescription>;
export interface InputFormatOptions {
  Csv?: CsvOptions;
}
export const InputFormatOptions = S.suspend(() =>
  S.Struct({ Csv: S.optional(CsvOptions) }),
).annotations({
  identifier: "InputFormatOptions",
}) as any as S.Schema<InputFormatOptions>;
export interface ImportTableDescription {
  ImportArn?: string;
  ImportStatus?: string;
  TableArn?: string;
  TableId?: string;
  ClientToken?: string;
  S3BucketSource?: S3BucketSource;
  ErrorCount?: number;
  CloudWatchLogGroupArn?: string;
  InputFormat?: string;
  InputFormatOptions?: InputFormatOptions;
  InputCompressionType?: string;
  TableCreationParameters?: TableCreationParameters;
  StartTime?: Date;
  EndTime?: Date;
  ProcessedSizeBytes?: number;
  ProcessedItemCount?: number;
  ImportedItemCount?: number;
  FailureCode?: string;
  FailureMessage?: string;
}
export const ImportTableDescription = S.suspend(() =>
  S.Struct({
    ImportArn: S.optional(S.String),
    ImportStatus: S.optional(S.String),
    TableArn: S.optional(S.String),
    TableId: S.optional(S.String),
    ClientToken: S.optional(S.String),
    S3BucketSource: S.optional(S3BucketSource),
    ErrorCount: S.optional(S.Number),
    CloudWatchLogGroupArn: S.optional(S.String),
    InputFormat: S.optional(S.String),
    InputFormatOptions: S.optional(InputFormatOptions),
    InputCompressionType: S.optional(S.String),
    TableCreationParameters: S.optional(TableCreationParameters),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ProcessedSizeBytes: S.optional(S.Number),
    ProcessedItemCount: S.optional(S.Number),
    ImportedItemCount: S.optional(S.Number),
    FailureCode: S.optional(S.String),
    FailureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportTableDescription",
}) as any as S.Schema<ImportTableDescription>;
export interface KinesisDataStreamDestination {
  StreamArn?: string;
  DestinationStatus?: string;
  DestinationStatusDescription?: string;
  ApproximateCreationDateTimePrecision?: string;
}
export const KinesisDataStreamDestination = S.suspend(() =>
  S.Struct({
    StreamArn: S.optional(S.String),
    DestinationStatus: S.optional(S.String),
    DestinationStatusDescription: S.optional(S.String),
    ApproximateCreationDateTimePrecision: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisDataStreamDestination",
}) as any as S.Schema<KinesisDataStreamDestination>;
export type KinesisDataStreamDestinations = KinesisDataStreamDestination[];
export const KinesisDataStreamDestinations = S.Array(
  KinesisDataStreamDestination,
);
export interface BackupSummary {
  TableName?: string;
  TableId?: string;
  TableArn?: string;
  BackupArn?: string;
  BackupName?: string;
  BackupCreationDateTime?: Date;
  BackupExpiryDateTime?: Date;
  BackupStatus?: string;
  BackupType?: string;
  BackupSizeBytes?: number;
}
export const BackupSummary = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    TableId: S.optional(S.String),
    TableArn: S.optional(S.String),
    BackupArn: S.optional(S.String),
    BackupName: S.optional(S.String),
    BackupCreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BackupExpiryDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BackupStatus: S.optional(S.String),
    BackupType: S.optional(S.String),
    BackupSizeBytes: S.optional(S.Number),
  }),
).annotations({
  identifier: "BackupSummary",
}) as any as S.Schema<BackupSummary>;
export type BackupSummaries = BackupSummary[];
export const BackupSummaries = S.Array(BackupSummary);
export interface ContributorInsightsSummary {
  TableName?: string;
  IndexName?: string;
  ContributorInsightsStatus?: string;
  ContributorInsightsMode?: string;
}
export const ContributorInsightsSummary = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    IndexName: S.optional(S.String),
    ContributorInsightsStatus: S.optional(S.String),
    ContributorInsightsMode: S.optional(S.String),
  }),
).annotations({
  identifier: "ContributorInsightsSummary",
}) as any as S.Schema<ContributorInsightsSummary>;
export type ContributorInsightsSummaries = ContributorInsightsSummary[];
export const ContributorInsightsSummaries = S.Array(ContributorInsightsSummary);
export interface ExportSummary {
  ExportArn?: string;
  ExportStatus?: string;
  ExportType?: string;
}
export const ExportSummary = S.suspend(() =>
  S.Struct({
    ExportArn: S.optional(S.String),
    ExportStatus: S.optional(S.String),
    ExportType: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportSummary",
}) as any as S.Schema<ExportSummary>;
export type ExportSummaries = ExportSummary[];
export const ExportSummaries = S.Array(ExportSummary);
export interface GlobalTable {
  GlobalTableName?: string;
  ReplicationGroup?: ReplicaList;
}
export const GlobalTable = S.suspend(() =>
  S.Struct({
    GlobalTableName: S.optional(S.String),
    ReplicationGroup: S.optional(ReplicaList),
  }),
).annotations({ identifier: "GlobalTable" }) as any as S.Schema<GlobalTable>;
export type GlobalTableList = GlobalTable[];
export const GlobalTableList = S.Array(GlobalTable);
export interface ImportSummary {
  ImportArn?: string;
  ImportStatus?: string;
  TableArn?: string;
  S3BucketSource?: S3BucketSource;
  CloudWatchLogGroupArn?: string;
  InputFormat?: string;
  StartTime?: Date;
  EndTime?: Date;
}
export const ImportSummary = S.suspend(() =>
  S.Struct({
    ImportArn: S.optional(S.String),
    ImportStatus: S.optional(S.String),
    TableArn: S.optional(S.String),
    S3BucketSource: S.optional(S3BucketSource),
    CloudWatchLogGroupArn: S.optional(S.String),
    InputFormat: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ImportSummary",
}) as any as S.Schema<ImportSummary>;
export type ImportSummaryList = ImportSummary[];
export const ImportSummaryList = S.Array(ImportSummary);
export type KeyConditions = { [key: string]: Condition };
export const KeyConditions = S.Record({ key: S.String, value: Condition });
export interface TransactGetItem {
  Get: Get;
}
export const TransactGetItem = S.suspend(() =>
  S.Struct({ Get: Get }),
).annotations({
  identifier: "TransactGetItem",
}) as any as S.Schema<TransactGetItem>;
export type TransactGetItemList = TransactGetItem[];
export const TransactGetItemList = S.Array(TransactGetItem);
export interface TransactWriteItem {
  ConditionCheck?: ConditionCheck;
  Put?: Put;
  Delete?: Delete;
  Update?: Update;
}
export const TransactWriteItem = S.suspend(() =>
  S.Struct({
    ConditionCheck: S.optional(ConditionCheck),
    Put: S.optional(Put),
    Delete: S.optional(Delete),
    Update: S.optional(Update),
  }),
).annotations({
  identifier: "TransactWriteItem",
}) as any as S.Schema<TransactWriteItem>;
export type TransactWriteItemList = TransactWriteItem[];
export const TransactWriteItemList = S.Array(TransactWriteItem);
export interface ReplicaUpdate {
  Create?: CreateReplicaAction;
  Delete?: DeleteReplicaAction;
}
export const ReplicaUpdate = S.suspend(() =>
  S.Struct({
    Create: S.optional(CreateReplicaAction),
    Delete: S.optional(DeleteReplicaAction),
  }),
).annotations({
  identifier: "ReplicaUpdate",
}) as any as S.Schema<ReplicaUpdate>;
export type ReplicaUpdateList = ReplicaUpdate[];
export const ReplicaUpdateList = S.Array(ReplicaUpdate);
export interface ReplicaSettingsUpdate {
  RegionName: string;
  ReplicaProvisionedReadCapacityUnits?: number;
  ReplicaProvisionedReadCapacityAutoScalingSettingsUpdate?: AutoScalingSettingsUpdate;
  ReplicaGlobalSecondaryIndexSettingsUpdate?: ReplicaGlobalSecondaryIndexSettingsUpdateList;
  ReplicaTableClass?: string;
}
export const ReplicaSettingsUpdate = S.suspend(() =>
  S.Struct({
    RegionName: S.String,
    ReplicaProvisionedReadCapacityUnits: S.optional(S.Number),
    ReplicaProvisionedReadCapacityAutoScalingSettingsUpdate: S.optional(
      AutoScalingSettingsUpdate,
    ),
    ReplicaGlobalSecondaryIndexSettingsUpdate: S.optional(
      ReplicaGlobalSecondaryIndexSettingsUpdateList,
    ),
    ReplicaTableClass: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplicaSettingsUpdate",
}) as any as S.Schema<ReplicaSettingsUpdate>;
export type ReplicaSettingsUpdateList = ReplicaSettingsUpdate[];
export const ReplicaSettingsUpdateList = S.Array(ReplicaSettingsUpdate);
export type AttributeUpdates = { [key: string]: AttributeValueUpdate };
export const AttributeUpdates = S.Record({
  key: S.String,
  value: AttributeValueUpdate,
});
export interface GlobalSecondaryIndexUpdate {
  Update?: UpdateGlobalSecondaryIndexAction;
  Create?: CreateGlobalSecondaryIndexAction;
  Delete?: DeleteGlobalSecondaryIndexAction;
}
export const GlobalSecondaryIndexUpdate = S.suspend(() =>
  S.Struct({
    Update: S.optional(UpdateGlobalSecondaryIndexAction),
    Create: S.optional(CreateGlobalSecondaryIndexAction),
    Delete: S.optional(DeleteGlobalSecondaryIndexAction),
  }),
).annotations({
  identifier: "GlobalSecondaryIndexUpdate",
}) as any as S.Schema<GlobalSecondaryIndexUpdate>;
export type GlobalSecondaryIndexUpdateList = GlobalSecondaryIndexUpdate[];
export const GlobalSecondaryIndexUpdateList = S.Array(
  GlobalSecondaryIndexUpdate,
);
export interface GlobalTableWitnessGroupUpdate {
  Create?: CreateGlobalTableWitnessGroupMemberAction;
  Delete?: DeleteGlobalTableWitnessGroupMemberAction;
}
export const GlobalTableWitnessGroupUpdate = S.suspend(() =>
  S.Struct({
    Create: S.optional(CreateGlobalTableWitnessGroupMemberAction),
    Delete: S.optional(DeleteGlobalTableWitnessGroupMemberAction),
  }),
).annotations({
  identifier: "GlobalTableWitnessGroupUpdate",
}) as any as S.Schema<GlobalTableWitnessGroupUpdate>;
export type GlobalTableWitnessGroupUpdateList = GlobalTableWitnessGroupUpdate[];
export const GlobalTableWitnessGroupUpdateList = S.Array(
  GlobalTableWitnessGroupUpdate,
);
export interface ReplicaAutoScalingUpdate {
  RegionName: string;
  ReplicaGlobalSecondaryIndexUpdates?: ReplicaGlobalSecondaryIndexAutoScalingUpdateList;
  ReplicaProvisionedReadCapacityAutoScalingUpdate?: AutoScalingSettingsUpdate;
}
export const ReplicaAutoScalingUpdate = S.suspend(() =>
  S.Struct({
    RegionName: S.String,
    ReplicaGlobalSecondaryIndexUpdates: S.optional(
      ReplicaGlobalSecondaryIndexAutoScalingUpdateList,
    ),
    ReplicaProvisionedReadCapacityAutoScalingUpdate: S.optional(
      AutoScalingSettingsUpdate,
    ),
  }),
).annotations({
  identifier: "ReplicaAutoScalingUpdate",
}) as any as S.Schema<ReplicaAutoScalingUpdate>;
export type ReplicaAutoScalingUpdateList = ReplicaAutoScalingUpdate[];
export const ReplicaAutoScalingUpdateList = S.Array(ReplicaAutoScalingUpdate);
export interface PutRequest {
  Item: PutItemInputAttributeMap;
}
export const PutRequest = S.suspend(() =>
  S.Struct({ Item: PutItemInputAttributeMap }),
).annotations({ identifier: "PutRequest" }) as any as S.Schema<PutRequest>;
export interface DeleteRequest {
  Key: Key;
}
export const DeleteRequest = S.suspend(() =>
  S.Struct({ Key: Key }),
).annotations({
  identifier: "DeleteRequest",
}) as any as S.Schema<DeleteRequest>;
export interface BatchGetItemInput {
  RequestItems: BatchGetRequestMap;
  ReturnConsumedCapacity?: string;
}
export const BatchGetItemInput = S.suspend(() =>
  S.Struct({
    RequestItems: BatchGetRequestMap,
    ReturnConsumedCapacity: S.optional(S.String),
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
  identifier: "BatchGetItemInput",
}) as any as S.Schema<BatchGetItemInput>;
export interface CreateBackupOutput {
  BackupDetails?: BackupDetails;
}
export const CreateBackupOutput = S.suspend(() =>
  S.Struct({ BackupDetails: S.optional(BackupDetails) }).pipe(ns),
).annotations({
  identifier: "CreateBackupOutput",
}) as any as S.Schema<CreateBackupOutput>;
export interface CreateGlobalTableOutput {
  GlobalTableDescription?: GlobalTableDescription;
}
export const CreateGlobalTableOutput = S.suspend(() =>
  S.Struct({ GlobalTableDescription: S.optional(GlobalTableDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateGlobalTableOutput",
}) as any as S.Schema<CreateGlobalTableOutput>;
export interface CreateTableInput {
  AttributeDefinitions: AttributeDefinitions;
  TableName: string;
  KeySchema: KeySchema;
  LocalSecondaryIndexes?: LocalSecondaryIndexList;
  GlobalSecondaryIndexes?: GlobalSecondaryIndexList;
  BillingMode?: string;
  ProvisionedThroughput?: ProvisionedThroughput;
  StreamSpecification?: StreamSpecification;
  SSESpecification?: SSESpecification;
  Tags?: TagList;
  TableClass?: string;
  DeletionProtectionEnabled?: boolean;
  WarmThroughput?: WarmThroughput;
  ResourcePolicy?: string;
  OnDemandThroughput?: OnDemandThroughput;
}
export const CreateTableInput = S.suspend(() =>
  S.Struct({
    AttributeDefinitions: AttributeDefinitions,
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    KeySchema: KeySchema,
    LocalSecondaryIndexes: S.optional(LocalSecondaryIndexList),
    GlobalSecondaryIndexes: S.optional(GlobalSecondaryIndexList),
    BillingMode: S.optional(S.String),
    ProvisionedThroughput: S.optional(ProvisionedThroughput),
    StreamSpecification: S.optional(StreamSpecification),
    SSESpecification: S.optional(SSESpecification),
    Tags: S.optional(TagList),
    TableClass: S.optional(S.String),
    DeletionProtectionEnabled: S.optional(S.Boolean),
    WarmThroughput: S.optional(WarmThroughput),
    ResourcePolicy: S.optional(S.String),
    OnDemandThroughput: S.optional(OnDemandThroughput),
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
  identifier: "CreateTableInput",
}) as any as S.Schema<CreateTableInput>;
export interface DeleteItemInput {
  TableName: string;
  Key: Key;
  Expected?: ExpectedAttributeMap;
  ConditionalOperator?: string;
  ReturnValues?: string;
  ReturnConsumedCapacity?: string;
  ReturnItemCollectionMetrics?: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const DeleteItemInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    Key: Key,
    Expected: S.optional(ExpectedAttributeMap),
    ConditionalOperator: S.optional(S.String),
    ReturnValues: S.optional(S.String),
    ReturnConsumedCapacity: S.optional(S.String),
    ReturnItemCollectionMetrics: S.optional(S.String),
    ConditionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
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
  identifier: "DeleteItemInput",
}) as any as S.Schema<DeleteItemInput>;
export interface DescribeContributorInsightsOutput {
  TableName?: string;
  IndexName?: string;
  ContributorInsightsRuleList?: ContributorInsightsRuleList;
  ContributorInsightsStatus?: string;
  LastUpdateDateTime?: Date;
  FailureException?: FailureException;
  ContributorInsightsMode?: string;
}
export const DescribeContributorInsightsOutput = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    IndexName: S.optional(S.String),
    ContributorInsightsRuleList: S.optional(ContributorInsightsRuleList),
    ContributorInsightsStatus: S.optional(S.String),
    LastUpdateDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailureException: S.optional(FailureException),
    ContributorInsightsMode: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeContributorInsightsOutput",
}) as any as S.Schema<DescribeContributorInsightsOutput>;
export interface DescribeExportOutput {
  ExportDescription?: ExportDescription;
}
export const DescribeExportOutput = S.suspend(() =>
  S.Struct({ ExportDescription: S.optional(ExportDescription) }).pipe(ns),
).annotations({
  identifier: "DescribeExportOutput",
}) as any as S.Schema<DescribeExportOutput>;
export interface DescribeGlobalTableOutput {
  GlobalTableDescription?: GlobalTableDescription;
}
export const DescribeGlobalTableOutput = S.suspend(() =>
  S.Struct({ GlobalTableDescription: S.optional(GlobalTableDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeGlobalTableOutput",
}) as any as S.Schema<DescribeGlobalTableOutput>;
export interface DescribeImportOutput {
  ImportTableDescription: ImportTableDescription;
}
export const DescribeImportOutput = S.suspend(() =>
  S.Struct({ ImportTableDescription: ImportTableDescription }).pipe(ns),
).annotations({
  identifier: "DescribeImportOutput",
}) as any as S.Schema<DescribeImportOutput>;
export interface DescribeKinesisStreamingDestinationOutput {
  TableName?: string;
  KinesisDataStreamDestinations?: KinesisDataStreamDestinations;
}
export const DescribeKinesisStreamingDestinationOutput = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    KinesisDataStreamDestinations: S.optional(KinesisDataStreamDestinations),
  }).pipe(ns),
).annotations({
  identifier: "DescribeKinesisStreamingDestinationOutput",
}) as any as S.Schema<DescribeKinesisStreamingDestinationOutput>;
export interface DescribeTimeToLiveOutput {
  TimeToLiveDescription?: TimeToLiveDescription;
}
export const DescribeTimeToLiveOutput = S.suspend(() =>
  S.Struct({ TimeToLiveDescription: S.optional(TimeToLiveDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeTimeToLiveOutput",
}) as any as S.Schema<DescribeTimeToLiveOutput>;
export interface ExecuteStatementInput {
  Statement: string;
  Parameters?: PreparedStatementParameters;
  ConsistentRead?: boolean;
  NextToken?: string;
  ReturnConsumedCapacity?: string;
  Limit?: number;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const ExecuteStatementInput = S.suspend(() =>
  S.Struct({
    Statement: S.String,
    Parameters: S.optional(PreparedStatementParameters),
    ConsistentRead: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    ReturnConsumedCapacity: S.optional(S.String),
    Limit: S.optional(S.Number),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
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
  identifier: "ExecuteStatementInput",
}) as any as S.Schema<ExecuteStatementInput>;
export interface ExportTableToPointInTimeOutput {
  ExportDescription?: ExportDescription;
}
export const ExportTableToPointInTimeOutput = S.suspend(() =>
  S.Struct({ ExportDescription: S.optional(ExportDescription) }).pipe(ns),
).annotations({
  identifier: "ExportTableToPointInTimeOutput",
}) as any as S.Schema<ExportTableToPointInTimeOutput>;
export interface ImportTableInput {
  ClientToken?: string;
  S3BucketSource: S3BucketSource;
  InputFormat: string;
  InputFormatOptions?: InputFormatOptions;
  InputCompressionType?: string;
  TableCreationParameters: TableCreationParameters;
}
export const ImportTableInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    S3BucketSource: S3BucketSource,
    InputFormat: S.String,
    InputFormatOptions: S.optional(InputFormatOptions),
    InputCompressionType: S.optional(S.String),
    TableCreationParameters: TableCreationParameters,
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
  identifier: "ImportTableInput",
}) as any as S.Schema<ImportTableInput>;
export interface ListBackupsOutput {
  BackupSummaries?: BackupSummaries;
  LastEvaluatedBackupArn?: string;
}
export const ListBackupsOutput = S.suspend(() =>
  S.Struct({
    BackupSummaries: S.optional(BackupSummaries),
    LastEvaluatedBackupArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListBackupsOutput",
}) as any as S.Schema<ListBackupsOutput>;
export interface ListContributorInsightsOutput {
  ContributorInsightsSummaries?: ContributorInsightsSummaries;
  NextToken?: string;
}
export const ListContributorInsightsOutput = S.suspend(() =>
  S.Struct({
    ContributorInsightsSummaries: S.optional(ContributorInsightsSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListContributorInsightsOutput",
}) as any as S.Schema<ListContributorInsightsOutput>;
export interface ListExportsOutput {
  ExportSummaries?: ExportSummaries;
  NextToken?: string;
}
export const ListExportsOutput = S.suspend(() =>
  S.Struct({
    ExportSummaries: S.optional(ExportSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListExportsOutput",
}) as any as S.Schema<ListExportsOutput>;
export interface ListGlobalTablesOutput {
  GlobalTables?: GlobalTableList;
  LastEvaluatedGlobalTableName?: string;
}
export const ListGlobalTablesOutput = S.suspend(() =>
  S.Struct({
    GlobalTables: S.optional(GlobalTableList),
    LastEvaluatedGlobalTableName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGlobalTablesOutput",
}) as any as S.Schema<ListGlobalTablesOutput>;
export interface ListImportsOutput {
  ImportSummaryList?: ImportSummaryList;
  NextToken?: string;
}
export const ListImportsOutput = S.suspend(() =>
  S.Struct({
    ImportSummaryList: S.optional(ImportSummaryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListImportsOutput",
}) as any as S.Schema<ListImportsOutput>;
export interface QueryInput {
  TableName: string;
  IndexName?: string;
  Select?: string;
  AttributesToGet?: AttributeNameList;
  Limit?: number;
  ConsistentRead?: boolean;
  KeyConditions?: KeyConditions;
  QueryFilter?: FilterConditionMap;
  ConditionalOperator?: string;
  ScanIndexForward?: boolean;
  ExclusiveStartKey?: Key;
  ReturnConsumedCapacity?: string;
  ProjectionExpression?: string;
  FilterExpression?: string;
  KeyConditionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
}
export const QueryInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    IndexName: S.optional(S.String),
    Select: S.optional(S.String),
    AttributesToGet: S.optional(AttributeNameList),
    Limit: S.optional(S.Number),
    ConsistentRead: S.optional(S.Boolean),
    KeyConditions: S.optional(KeyConditions),
    QueryFilter: S.optional(FilterConditionMap),
    ConditionalOperator: S.optional(S.String),
    ScanIndexForward: S.optional(S.Boolean),
    ExclusiveStartKey: S.optional(Key),
    ReturnConsumedCapacity: S.optional(S.String),
    ProjectionExpression: S.optional(S.String),
    FilterExpression: S.optional(S.String),
    KeyConditionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
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
).annotations({ identifier: "QueryInput" }) as any as S.Schema<QueryInput>;
export interface TransactGetItemsInput {
  TransactItems: TransactGetItemList;
  ReturnConsumedCapacity?: string;
}
export const TransactGetItemsInput = S.suspend(() =>
  S.Struct({
    TransactItems: TransactGetItemList,
    ReturnConsumedCapacity: S.optional(S.String),
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
  identifier: "TransactGetItemsInput",
}) as any as S.Schema<TransactGetItemsInput>;
export interface TransactWriteItemsInput {
  TransactItems: TransactWriteItemList;
  ReturnConsumedCapacity?: string;
  ReturnItemCollectionMetrics?: string;
  ClientRequestToken?: string;
}
export const TransactWriteItemsInput = S.suspend(() =>
  S.Struct({
    TransactItems: TransactWriteItemList,
    ReturnConsumedCapacity: S.optional(S.String),
    ReturnItemCollectionMetrics: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
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
  identifier: "TransactWriteItemsInput",
}) as any as S.Schema<TransactWriteItemsInput>;
export interface PointInTimeRecoveryDescription {
  PointInTimeRecoveryStatus?: string;
  RecoveryPeriodInDays?: number;
  EarliestRestorableDateTime?: Date;
  LatestRestorableDateTime?: Date;
}
export const PointInTimeRecoveryDescription = S.suspend(() =>
  S.Struct({
    PointInTimeRecoveryStatus: S.optional(S.String),
    RecoveryPeriodInDays: S.optional(S.Number),
    EarliestRestorableDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestRestorableDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PointInTimeRecoveryDescription",
}) as any as S.Schema<PointInTimeRecoveryDescription>;
export interface ContinuousBackupsDescription {
  ContinuousBackupsStatus: string;
  PointInTimeRecoveryDescription?: PointInTimeRecoveryDescription;
}
export const ContinuousBackupsDescription = S.suspend(() =>
  S.Struct({
    ContinuousBackupsStatus: S.String,
    PointInTimeRecoveryDescription: S.optional(PointInTimeRecoveryDescription),
  }),
).annotations({
  identifier: "ContinuousBackupsDescription",
}) as any as S.Schema<ContinuousBackupsDescription>;
export interface UpdateContinuousBackupsOutput {
  ContinuousBackupsDescription?: ContinuousBackupsDescription;
}
export const UpdateContinuousBackupsOutput = S.suspend(() =>
  S.Struct({
    ContinuousBackupsDescription: S.optional(ContinuousBackupsDescription),
  }).pipe(ns),
).annotations({
  identifier: "UpdateContinuousBackupsOutput",
}) as any as S.Schema<UpdateContinuousBackupsOutput>;
export interface UpdateGlobalTableInput {
  GlobalTableName: string;
  ReplicaUpdates: ReplicaUpdateList;
}
export const UpdateGlobalTableInput = S.suspend(() =>
  S.Struct({
    GlobalTableName: S.String.pipe(T.ContextParam("ResourceArn")),
    ReplicaUpdates: ReplicaUpdateList,
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
  identifier: "UpdateGlobalTableInput",
}) as any as S.Schema<UpdateGlobalTableInput>;
export interface UpdateItemInput {
  TableName: string;
  Key: Key;
  AttributeUpdates?: AttributeUpdates;
  Expected?: ExpectedAttributeMap;
  ConditionalOperator?: string;
  ReturnValues?: string;
  ReturnConsumedCapacity?: string;
  ReturnItemCollectionMetrics?: string;
  UpdateExpression?: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: ExpressionAttributeNameMap;
  ExpressionAttributeValues?: ExpressionAttributeValueMap;
  ReturnValuesOnConditionCheckFailure?: string;
}
export const UpdateItemInput = S.suspend(() =>
  S.Struct({
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    Key: Key,
    AttributeUpdates: S.optional(AttributeUpdates),
    Expected: S.optional(ExpectedAttributeMap),
    ConditionalOperator: S.optional(S.String),
    ReturnValues: S.optional(S.String),
    ReturnConsumedCapacity: S.optional(S.String),
    ReturnItemCollectionMetrics: S.optional(S.String),
    UpdateExpression: S.optional(S.String),
    ConditionExpression: S.optional(S.String),
    ExpressionAttributeNames: S.optional(ExpressionAttributeNameMap),
    ExpressionAttributeValues: S.optional(ExpressionAttributeValueMap),
    ReturnValuesOnConditionCheckFailure: S.optional(S.String),
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
  identifier: "UpdateItemInput",
}) as any as S.Schema<UpdateItemInput>;
export interface UpdateKinesisStreamingDestinationOutput {
  TableName?: string;
  StreamArn?: string;
  DestinationStatus?: string;
  UpdateKinesisStreamingConfiguration?: UpdateKinesisStreamingConfiguration;
}
export const UpdateKinesisStreamingDestinationOutput = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    StreamArn: S.optional(S.String),
    DestinationStatus: S.optional(S.String),
    UpdateKinesisStreamingConfiguration: S.optional(
      UpdateKinesisStreamingConfiguration,
    ),
  }).pipe(ns),
).annotations({
  identifier: "UpdateKinesisStreamingDestinationOutput",
}) as any as S.Schema<UpdateKinesisStreamingDestinationOutput>;
export interface UpdateTableReplicaAutoScalingInput {
  GlobalSecondaryIndexUpdates?: GlobalSecondaryIndexAutoScalingUpdateList;
  TableName: string;
  ProvisionedWriteCapacityAutoScalingUpdate?: AutoScalingSettingsUpdate;
  ReplicaUpdates?: ReplicaAutoScalingUpdateList;
}
export const UpdateTableReplicaAutoScalingInput = S.suspend(() =>
  S.Struct({
    GlobalSecondaryIndexUpdates: S.optional(
      GlobalSecondaryIndexAutoScalingUpdateList,
    ),
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    ProvisionedWriteCapacityAutoScalingUpdate: S.optional(
      AutoScalingSettingsUpdate,
    ),
    ReplicaUpdates: S.optional(ReplicaAutoScalingUpdateList),
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
  identifier: "UpdateTableReplicaAutoScalingInput",
}) as any as S.Schema<UpdateTableReplicaAutoScalingInput>;
export interface UpdateTimeToLiveOutput {
  TimeToLiveSpecification?: TimeToLiveSpecification;
}
export const UpdateTimeToLiveOutput = S.suspend(() =>
  S.Struct({
    TimeToLiveSpecification: S.optional(TimeToLiveSpecification),
  }).pipe(ns),
).annotations({
  identifier: "UpdateTimeToLiveOutput",
}) as any as S.Schema<UpdateTimeToLiveOutput>;
export interface WriteRequest {
  PutRequest?: PutRequest;
  DeleteRequest?: DeleteRequest;
}
export const WriteRequest = S.suspend(() =>
  S.Struct({
    PutRequest: S.optional(PutRequest),
    DeleteRequest: S.optional(DeleteRequest),
  }),
).annotations({ identifier: "WriteRequest" }) as any as S.Schema<WriteRequest>;
export type WriteRequests = WriteRequest[];
export const WriteRequests = S.Array(WriteRequest);
export interface AutoScalingTargetTrackingScalingPolicyConfigurationDescription {
  DisableScaleIn?: boolean;
  ScaleInCooldown?: number;
  ScaleOutCooldown?: number;
  TargetValue: number;
}
export const AutoScalingTargetTrackingScalingPolicyConfigurationDescription =
  S.suspend(() =>
    S.Struct({
      DisableScaleIn: S.optional(S.Boolean),
      ScaleInCooldown: S.optional(S.Number),
      ScaleOutCooldown: S.optional(S.Number),
      TargetValue: S.Number,
    }),
  ).annotations({
    identifier:
      "AutoScalingTargetTrackingScalingPolicyConfigurationDescription",
  }) as any as S.Schema<AutoScalingTargetTrackingScalingPolicyConfigurationDescription>;
export interface AutoScalingPolicyDescription {
  PolicyName?: string;
  TargetTrackingScalingPolicyConfiguration?: AutoScalingTargetTrackingScalingPolicyConfigurationDescription;
}
export const AutoScalingPolicyDescription = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    TargetTrackingScalingPolicyConfiguration: S.optional(
      AutoScalingTargetTrackingScalingPolicyConfigurationDescription,
    ),
  }),
).annotations({
  identifier: "AutoScalingPolicyDescription",
}) as any as S.Schema<AutoScalingPolicyDescription>;
export type AutoScalingPolicyDescriptionList = AutoScalingPolicyDescription[];
export const AutoScalingPolicyDescriptionList = S.Array(
  AutoScalingPolicyDescription,
);
export interface AutoScalingSettingsDescription {
  MinimumUnits?: number;
  MaximumUnits?: number;
  AutoScalingDisabled?: boolean;
  AutoScalingRoleArn?: string;
  ScalingPolicies?: AutoScalingPolicyDescriptionList;
}
export const AutoScalingSettingsDescription = S.suspend(() =>
  S.Struct({
    MinimumUnits: S.optional(S.Number),
    MaximumUnits: S.optional(S.Number),
    AutoScalingDisabled: S.optional(S.Boolean),
    AutoScalingRoleArn: S.optional(S.String),
    ScalingPolicies: S.optional(AutoScalingPolicyDescriptionList),
  }),
).annotations({
  identifier: "AutoScalingSettingsDescription",
}) as any as S.Schema<AutoScalingSettingsDescription>;
export interface ReplicaGlobalSecondaryIndexSettingsDescription {
  IndexName: string;
  IndexStatus?: string;
  ProvisionedReadCapacityUnits?: number;
  ProvisionedReadCapacityAutoScalingSettings?: AutoScalingSettingsDescription;
  ProvisionedWriteCapacityUnits?: number;
  ProvisionedWriteCapacityAutoScalingSettings?: AutoScalingSettingsDescription;
}
export const ReplicaGlobalSecondaryIndexSettingsDescription = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    IndexStatus: S.optional(S.String),
    ProvisionedReadCapacityUnits: S.optional(S.Number),
    ProvisionedReadCapacityAutoScalingSettings: S.optional(
      AutoScalingSettingsDescription,
    ),
    ProvisionedWriteCapacityUnits: S.optional(S.Number),
    ProvisionedWriteCapacityAutoScalingSettings: S.optional(
      AutoScalingSettingsDescription,
    ),
  }),
).annotations({
  identifier: "ReplicaGlobalSecondaryIndexSettingsDescription",
}) as any as S.Schema<ReplicaGlobalSecondaryIndexSettingsDescription>;
export type ReplicaGlobalSecondaryIndexSettingsDescriptionList =
  ReplicaGlobalSecondaryIndexSettingsDescription[];
export const ReplicaGlobalSecondaryIndexSettingsDescriptionList = S.Array(
  ReplicaGlobalSecondaryIndexSettingsDescription,
);
export type ItemCollectionSizeEstimateRange = number[];
export const ItemCollectionSizeEstimateRange = S.Array(S.Number);
export interface CreateReplicationGroupMemberAction {
  RegionName: string;
  KMSMasterKeyId?: string;
  ProvisionedThroughputOverride?: ProvisionedThroughputOverride;
  OnDemandThroughputOverride?: OnDemandThroughputOverride;
  GlobalSecondaryIndexes?: ReplicaGlobalSecondaryIndexList;
  TableClassOverride?: string;
}
export const CreateReplicationGroupMemberAction = S.suspend(() =>
  S.Struct({
    RegionName: S.String,
    KMSMasterKeyId: S.optional(S.String),
    ProvisionedThroughputOverride: S.optional(ProvisionedThroughputOverride),
    OnDemandThroughputOverride: S.optional(OnDemandThroughputOverride),
    GlobalSecondaryIndexes: S.optional(ReplicaGlobalSecondaryIndexList),
    TableClassOverride: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateReplicationGroupMemberAction",
}) as any as S.Schema<CreateReplicationGroupMemberAction>;
export type BatchWriteItemRequestMap = { [key: string]: WriteRequests };
export const BatchWriteItemRequestMap = S.Record({
  key: S.String,
  value: WriteRequests,
});
export interface ItemResponse {
  Item?: AttributeMap;
}
export const ItemResponse = S.suspend(() =>
  S.Struct({ Item: S.optional(AttributeMap) }),
).annotations({ identifier: "ItemResponse" }) as any as S.Schema<ItemResponse>;
export type ItemResponseList = ItemResponse[];
export const ItemResponseList = S.Array(ItemResponse);
export interface ReplicationGroupUpdate {
  Create?: CreateReplicationGroupMemberAction;
  Update?: UpdateReplicationGroupMemberAction;
  Delete?: DeleteReplicationGroupMemberAction;
}
export const ReplicationGroupUpdate = S.suspend(() =>
  S.Struct({
    Create: S.optional(CreateReplicationGroupMemberAction),
    Update: S.optional(UpdateReplicationGroupMemberAction),
    Delete: S.optional(DeleteReplicationGroupMemberAction),
  }),
).annotations({
  identifier: "ReplicationGroupUpdate",
}) as any as S.Schema<ReplicationGroupUpdate>;
export type ReplicationGroupUpdateList = ReplicationGroupUpdate[];
export const ReplicationGroupUpdateList = S.Array(ReplicationGroupUpdate);
export interface ReplicaGlobalSecondaryIndexAutoScalingDescription {
  IndexName?: string;
  IndexStatus?: string;
  ProvisionedReadCapacityAutoScalingSettings?: AutoScalingSettingsDescription;
  ProvisionedWriteCapacityAutoScalingSettings?: AutoScalingSettingsDescription;
}
export const ReplicaGlobalSecondaryIndexAutoScalingDescription = S.suspend(() =>
  S.Struct({
    IndexName: S.optional(S.String),
    IndexStatus: S.optional(S.String),
    ProvisionedReadCapacityAutoScalingSettings: S.optional(
      AutoScalingSettingsDescription,
    ),
    ProvisionedWriteCapacityAutoScalingSettings: S.optional(
      AutoScalingSettingsDescription,
    ),
  }),
).annotations({
  identifier: "ReplicaGlobalSecondaryIndexAutoScalingDescription",
}) as any as S.Schema<ReplicaGlobalSecondaryIndexAutoScalingDescription>;
export type ReplicaGlobalSecondaryIndexAutoScalingDescriptionList =
  ReplicaGlobalSecondaryIndexAutoScalingDescription[];
export const ReplicaGlobalSecondaryIndexAutoScalingDescriptionList = S.Array(
  ReplicaGlobalSecondaryIndexAutoScalingDescription,
);
export interface BatchWriteItemInput {
  RequestItems: BatchWriteItemRequestMap;
  ReturnConsumedCapacity?: string;
  ReturnItemCollectionMetrics?: string;
}
export const BatchWriteItemInput = S.suspend(() =>
  S.Struct({
    RequestItems: BatchWriteItemRequestMap,
    ReturnConsumedCapacity: S.optional(S.String),
    ReturnItemCollectionMetrics: S.optional(S.String),
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
  identifier: "BatchWriteItemInput",
}) as any as S.Schema<BatchWriteItemInput>;
export interface CreateTableOutput {
  TableDescription?: TableDescription;
}
export const CreateTableOutput = S.suspend(() =>
  S.Struct({ TableDescription: S.optional(TableDescription) }).pipe(ns),
).annotations({
  identifier: "CreateTableOutput",
}) as any as S.Schema<CreateTableOutput>;
export type ItemCollectionKeyAttributeMap = { [key: string]: AttributeValue };
export const ItemCollectionKeyAttributeMap = S.Record({
  key: S.String,
  value: S.suspend(() => AttributeValue).annotations({
    identifier: "AttributeValue",
  }),
});
export interface ItemCollectionMetrics {
  ItemCollectionKey?: ItemCollectionKeyAttributeMap;
  SizeEstimateRangeGB?: ItemCollectionSizeEstimateRange;
}
export const ItemCollectionMetrics = S.suspend(() =>
  S.Struct({
    ItemCollectionKey: S.optional(ItemCollectionKeyAttributeMap),
    SizeEstimateRangeGB: S.optional(ItemCollectionSizeEstimateRange),
  }),
).annotations({
  identifier: "ItemCollectionMetrics",
}) as any as S.Schema<ItemCollectionMetrics>;
export interface DeleteItemOutput {
  Attributes?: AttributeMap;
  ConsumedCapacity?: ConsumedCapacity;
  ItemCollectionMetrics?: ItemCollectionMetrics;
}
export const DeleteItemOutput = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(AttributeMap),
    ConsumedCapacity: S.optional(ConsumedCapacity),
    ItemCollectionMetrics: S.optional(ItemCollectionMetrics),
  }).pipe(ns),
).annotations({
  identifier: "DeleteItemOutput",
}) as any as S.Schema<DeleteItemOutput>;
export interface DescribeContinuousBackupsOutput {
  ContinuousBackupsDescription?: ContinuousBackupsDescription;
}
export const DescribeContinuousBackupsOutput = S.suspend(() =>
  S.Struct({
    ContinuousBackupsDescription: S.optional(ContinuousBackupsDescription),
  }).pipe(ns),
).annotations({
  identifier: "DescribeContinuousBackupsOutput",
}) as any as S.Schema<DescribeContinuousBackupsOutput>;
export interface ExecuteStatementOutput {
  Items?: ItemList;
  NextToken?: string;
  ConsumedCapacity?: ConsumedCapacity;
  LastEvaluatedKey?: Key;
}
export const ExecuteStatementOutput = S.suspend(() =>
  S.Struct({
    Items: S.optional(ItemList),
    NextToken: S.optional(S.String),
    ConsumedCapacity: S.optional(ConsumedCapacity),
    LastEvaluatedKey: S.optional(Key),
  }).pipe(ns),
).annotations({
  identifier: "ExecuteStatementOutput",
}) as any as S.Schema<ExecuteStatementOutput>;
export interface ExecuteTransactionOutput {
  Responses?: ItemResponseList;
  ConsumedCapacity?: ConsumedCapacityMultiple;
}
export const ExecuteTransactionOutput = S.suspend(() =>
  S.Struct({
    Responses: S.optional(ItemResponseList),
    ConsumedCapacity: S.optional(ConsumedCapacityMultiple),
  }).pipe(ns),
).annotations({
  identifier: "ExecuteTransactionOutput",
}) as any as S.Schema<ExecuteTransactionOutput>;
export interface GetItemOutput {
  Item?: AttributeMap;
  ConsumedCapacity?: ConsumedCapacity;
}
export const GetItemOutput = S.suspend(() =>
  S.Struct({
    Item: S.optional(AttributeMap),
    ConsumedCapacity: S.optional(ConsumedCapacity),
  }).pipe(ns),
).annotations({
  identifier: "GetItemOutput",
}) as any as S.Schema<GetItemOutput>;
export interface ImportTableOutput {
  ImportTableDescription: ImportTableDescription;
}
export const ImportTableOutput = S.suspend(() =>
  S.Struct({ ImportTableDescription: ImportTableDescription }).pipe(ns),
).annotations({
  identifier: "ImportTableOutput",
}) as any as S.Schema<ImportTableOutput>;
export interface QueryOutput {
  Items?: ItemList;
  Count?: number;
  ScannedCount?: number;
  LastEvaluatedKey?: Key;
  ConsumedCapacity?: ConsumedCapacity;
}
export const QueryOutput = S.suspend(() =>
  S.Struct({
    Items: S.optional(ItemList),
    Count: S.optional(S.Number),
    ScannedCount: S.optional(S.Number),
    LastEvaluatedKey: S.optional(Key),
    ConsumedCapacity: S.optional(ConsumedCapacity),
  }).pipe(ns),
).annotations({ identifier: "QueryOutput" }) as any as S.Schema<QueryOutput>;
export interface TransactGetItemsOutput {
  ConsumedCapacity?: ConsumedCapacityMultiple;
  Responses?: ItemResponseList;
}
export const TransactGetItemsOutput = S.suspend(() =>
  S.Struct({
    ConsumedCapacity: S.optional(ConsumedCapacityMultiple),
    Responses: S.optional(ItemResponseList),
  }).pipe(ns),
).annotations({
  identifier: "TransactGetItemsOutput",
}) as any as S.Schema<TransactGetItemsOutput>;
export interface UpdateGlobalTableOutput {
  GlobalTableDescription?: GlobalTableDescription;
}
export const UpdateGlobalTableOutput = S.suspend(() =>
  S.Struct({ GlobalTableDescription: S.optional(GlobalTableDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "UpdateGlobalTableOutput",
}) as any as S.Schema<UpdateGlobalTableOutput>;
export interface UpdateGlobalTableSettingsInput {
  GlobalTableName: string;
  GlobalTableBillingMode?: string;
  GlobalTableProvisionedWriteCapacityUnits?: number;
  GlobalTableProvisionedWriteCapacityAutoScalingSettingsUpdate?: AutoScalingSettingsUpdate;
  GlobalTableGlobalSecondaryIndexSettingsUpdate?: GlobalTableGlobalSecondaryIndexSettingsUpdateList;
  ReplicaSettingsUpdate?: ReplicaSettingsUpdateList;
}
export const UpdateGlobalTableSettingsInput = S.suspend(() =>
  S.Struct({
    GlobalTableName: S.String.pipe(T.ContextParam("ResourceArn")),
    GlobalTableBillingMode: S.optional(S.String),
    GlobalTableProvisionedWriteCapacityUnits: S.optional(S.Number),
    GlobalTableProvisionedWriteCapacityAutoScalingSettingsUpdate: S.optional(
      AutoScalingSettingsUpdate,
    ),
    GlobalTableGlobalSecondaryIndexSettingsUpdate: S.optional(
      GlobalTableGlobalSecondaryIndexSettingsUpdateList,
    ),
    ReplicaSettingsUpdate: S.optional(ReplicaSettingsUpdateList),
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
  identifier: "UpdateGlobalTableSettingsInput",
}) as any as S.Schema<UpdateGlobalTableSettingsInput>;
export interface UpdateItemOutput {
  Attributes?: AttributeMap;
  ConsumedCapacity?: ConsumedCapacity;
  ItemCollectionMetrics?: ItemCollectionMetrics;
}
export const UpdateItemOutput = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(AttributeMap),
    ConsumedCapacity: S.optional(ConsumedCapacity),
    ItemCollectionMetrics: S.optional(ItemCollectionMetrics),
  }).pipe(ns),
).annotations({
  identifier: "UpdateItemOutput",
}) as any as S.Schema<UpdateItemOutput>;
export interface UpdateTableInput {
  AttributeDefinitions?: AttributeDefinitions;
  TableName: string;
  BillingMode?: string;
  ProvisionedThroughput?: ProvisionedThroughput;
  GlobalSecondaryIndexUpdates?: GlobalSecondaryIndexUpdateList;
  StreamSpecification?: StreamSpecification;
  SSESpecification?: SSESpecification;
  ReplicaUpdates?: ReplicationGroupUpdateList;
  TableClass?: string;
  DeletionProtectionEnabled?: boolean;
  MultiRegionConsistency?: string;
  GlobalTableWitnessUpdates?: GlobalTableWitnessGroupUpdateList;
  OnDemandThroughput?: OnDemandThroughput;
  WarmThroughput?: WarmThroughput;
}
export const UpdateTableInput = S.suspend(() =>
  S.Struct({
    AttributeDefinitions: S.optional(AttributeDefinitions),
    TableName: S.String.pipe(T.ContextParam("ResourceArn")),
    BillingMode: S.optional(S.String),
    ProvisionedThroughput: S.optional(ProvisionedThroughput),
    GlobalSecondaryIndexUpdates: S.optional(GlobalSecondaryIndexUpdateList),
    StreamSpecification: S.optional(StreamSpecification),
    SSESpecification: S.optional(SSESpecification),
    ReplicaUpdates: S.optional(ReplicationGroupUpdateList),
    TableClass: S.optional(S.String),
    DeletionProtectionEnabled: S.optional(S.Boolean),
    MultiRegionConsistency: S.optional(S.String),
    GlobalTableWitnessUpdates: S.optional(GlobalTableWitnessGroupUpdateList),
    OnDemandThroughput: S.optional(OnDemandThroughput),
    WarmThroughput: S.optional(WarmThroughput),
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
  identifier: "UpdateTableInput",
}) as any as S.Schema<UpdateTableInput>;
export interface ReplicaAutoScalingDescription {
  RegionName?: string;
  GlobalSecondaryIndexes?: ReplicaGlobalSecondaryIndexAutoScalingDescriptionList;
  ReplicaProvisionedReadCapacityAutoScalingSettings?: AutoScalingSettingsDescription;
  ReplicaProvisionedWriteCapacityAutoScalingSettings?: AutoScalingSettingsDescription;
  ReplicaStatus?: string;
}
export const ReplicaAutoScalingDescription = S.suspend(() =>
  S.Struct({
    RegionName: S.optional(S.String),
    GlobalSecondaryIndexes: S.optional(
      ReplicaGlobalSecondaryIndexAutoScalingDescriptionList,
    ),
    ReplicaProvisionedReadCapacityAutoScalingSettings: S.optional(
      AutoScalingSettingsDescription,
    ),
    ReplicaProvisionedWriteCapacityAutoScalingSettings: S.optional(
      AutoScalingSettingsDescription,
    ),
    ReplicaStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplicaAutoScalingDescription",
}) as any as S.Schema<ReplicaAutoScalingDescription>;
export type ReplicaAutoScalingDescriptionList = ReplicaAutoScalingDescription[];
export const ReplicaAutoScalingDescriptionList = S.Array(
  ReplicaAutoScalingDescription,
);
export interface TableAutoScalingDescription {
  TableName?: string;
  TableStatus?: string;
  Replicas?: ReplicaAutoScalingDescriptionList;
}
export const TableAutoScalingDescription = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    TableStatus: S.optional(S.String),
    Replicas: S.optional(ReplicaAutoScalingDescriptionList),
  }),
).annotations({
  identifier: "TableAutoScalingDescription",
}) as any as S.Schema<TableAutoScalingDescription>;
export interface UpdateTableReplicaAutoScalingOutput {
  TableAutoScalingDescription?: TableAutoScalingDescription;
}
export const UpdateTableReplicaAutoScalingOutput = S.suspend(() =>
  S.Struct({
    TableAutoScalingDescription: S.optional(TableAutoScalingDescription),
  }).pipe(ns),
).annotations({
  identifier: "UpdateTableReplicaAutoScalingOutput",
}) as any as S.Schema<UpdateTableReplicaAutoScalingOutput>;
export interface BatchStatementError {
  Code?: string;
  Message?: string;
  Item?: AttributeMap;
}
export const BatchStatementError = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Item: S.optional(AttributeMap),
  }),
).annotations({
  identifier: "BatchStatementError",
}) as any as S.Schema<BatchStatementError>;
export type ItemCollectionMetricsMultiple = ItemCollectionMetrics[];
export const ItemCollectionMetricsMultiple = S.Array(ItemCollectionMetrics);
export interface BatchStatementResponse {
  Error?: BatchStatementError;
  TableName?: string;
  Item?: AttributeMap;
}
export const BatchStatementResponse = S.suspend(() =>
  S.Struct({
    Error: S.optional(BatchStatementError),
    TableName: S.optional(S.String),
    Item: S.optional(AttributeMap),
  }),
).annotations({
  identifier: "BatchStatementResponse",
}) as any as S.Schema<BatchStatementResponse>;
export type PartiQLBatchResponse = BatchStatementResponse[];
export const PartiQLBatchResponse = S.Array(BatchStatementResponse);
export type BatchGetResponseMap = { [key: string]: ItemList };
export const BatchGetResponseMap = S.Record({ key: S.String, value: ItemList });
export type ItemCollectionMetricsPerTable = {
  [key: string]: ItemCollectionMetricsMultiple;
};
export const ItemCollectionMetricsPerTable = S.Record({
  key: S.String,
  value: ItemCollectionMetricsMultiple,
});
export interface ThrottlingReason {
  reason?: string;
  resource?: string;
}
export const ThrottlingReason = S.suspend(() =>
  S.Struct({ reason: S.optional(S.String), resource: S.optional(S.String) }),
).annotations({
  identifier: "ThrottlingReason",
}) as any as S.Schema<ThrottlingReason>;
export type ThrottlingReasonList = ThrottlingReason[];
export const ThrottlingReasonList = S.Array(ThrottlingReason);
export interface BatchExecuteStatementOutput {
  Responses?: PartiQLBatchResponse;
  ConsumedCapacity?: ConsumedCapacityMultiple;
}
export const BatchExecuteStatementOutput = S.suspend(() =>
  S.Struct({
    Responses: S.optional(PartiQLBatchResponse),
    ConsumedCapacity: S.optional(ConsumedCapacityMultiple),
  }).pipe(ns),
).annotations({
  identifier: "BatchExecuteStatementOutput",
}) as any as S.Schema<BatchExecuteStatementOutput>;
export interface BatchGetItemOutput {
  Responses?: BatchGetResponseMap;
  UnprocessedKeys?: BatchGetRequestMap;
  ConsumedCapacity?: ConsumedCapacityMultiple;
}
export const BatchGetItemOutput = S.suspend(() =>
  S.Struct({
    Responses: S.optional(BatchGetResponseMap),
    UnprocessedKeys: S.optional(BatchGetRequestMap),
    ConsumedCapacity: S.optional(ConsumedCapacityMultiple),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetItemOutput",
}) as any as S.Schema<BatchGetItemOutput>;
export interface BatchWriteItemOutput {
  UnprocessedItems?: BatchWriteItemRequestMap;
  ItemCollectionMetrics?: ItemCollectionMetricsPerTable;
  ConsumedCapacity?: ConsumedCapacityMultiple;
}
export const BatchWriteItemOutput = S.suspend(() =>
  S.Struct({
    UnprocessedItems: S.optional(BatchWriteItemRequestMap),
    ItemCollectionMetrics: S.optional(ItemCollectionMetricsPerTable),
    ConsumedCapacity: S.optional(ConsumedCapacityMultiple),
  }).pipe(ns),
).annotations({
  identifier: "BatchWriteItemOutput",
}) as any as S.Schema<BatchWriteItemOutput>;
export interface DeleteBackupOutput {
  BackupDescription?: BackupDescription;
}
export const DeleteBackupOutput = S.suspend(() =>
  S.Struct({ BackupDescription: S.optional(BackupDescription) }).pipe(ns),
).annotations({
  identifier: "DeleteBackupOutput",
}) as any as S.Schema<DeleteBackupOutput>;
export interface DeleteTableOutput {
  TableDescription?: TableDescription;
}
export const DeleteTableOutput = S.suspend(() =>
  S.Struct({ TableDescription: S.optional(TableDescription) }).pipe(ns),
).annotations({
  identifier: "DeleteTableOutput",
}) as any as S.Schema<DeleteTableOutput>;
export interface DescribeTableReplicaAutoScalingOutput {
  TableAutoScalingDescription?: TableAutoScalingDescription;
}
export const DescribeTableReplicaAutoScalingOutput = S.suspend(() =>
  S.Struct({
    TableAutoScalingDescription: S.optional(TableAutoScalingDescription),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTableReplicaAutoScalingOutput",
}) as any as S.Schema<DescribeTableReplicaAutoScalingOutput>;
export interface PutItemOutput {
  Attributes?: AttributeMap;
  ConsumedCapacity?: ConsumedCapacity;
  ItemCollectionMetrics?: ItemCollectionMetrics;
}
export const PutItemOutput = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(AttributeMap),
    ConsumedCapacity: S.optional(ConsumedCapacity),
    ItemCollectionMetrics: S.optional(ItemCollectionMetrics),
  }).pipe(ns),
).annotations({
  identifier: "PutItemOutput",
}) as any as S.Schema<PutItemOutput>;
export interface TransactWriteItemsOutput {
  ConsumedCapacity?: ConsumedCapacityMultiple;
  ItemCollectionMetrics?: ItemCollectionMetricsPerTable;
}
export const TransactWriteItemsOutput = S.suspend(() =>
  S.Struct({
    ConsumedCapacity: S.optional(ConsumedCapacityMultiple),
    ItemCollectionMetrics: S.optional(ItemCollectionMetricsPerTable),
  }).pipe(ns),
).annotations({
  identifier: "TransactWriteItemsOutput",
}) as any as S.Schema<TransactWriteItemsOutput>;
export interface ReplicaSettingsDescription {
  RegionName: string;
  ReplicaStatus?: string;
  ReplicaBillingModeSummary?: BillingModeSummary;
  ReplicaProvisionedReadCapacityUnits?: number;
  ReplicaProvisionedReadCapacityAutoScalingSettings?: AutoScalingSettingsDescription;
  ReplicaProvisionedWriteCapacityUnits?: number;
  ReplicaProvisionedWriteCapacityAutoScalingSettings?: AutoScalingSettingsDescription;
  ReplicaGlobalSecondaryIndexSettings?: ReplicaGlobalSecondaryIndexSettingsDescriptionList;
  ReplicaTableClassSummary?: TableClassSummary;
}
export const ReplicaSettingsDescription = S.suspend(() =>
  S.Struct({
    RegionName: S.String,
    ReplicaStatus: S.optional(S.String),
    ReplicaBillingModeSummary: S.optional(BillingModeSummary),
    ReplicaProvisionedReadCapacityUnits: S.optional(S.Number),
    ReplicaProvisionedReadCapacityAutoScalingSettings: S.optional(
      AutoScalingSettingsDescription,
    ),
    ReplicaProvisionedWriteCapacityUnits: S.optional(S.Number),
    ReplicaProvisionedWriteCapacityAutoScalingSettings: S.optional(
      AutoScalingSettingsDescription,
    ),
    ReplicaGlobalSecondaryIndexSettings: S.optional(
      ReplicaGlobalSecondaryIndexSettingsDescriptionList,
    ),
    ReplicaTableClassSummary: S.optional(TableClassSummary),
  }),
).annotations({
  identifier: "ReplicaSettingsDescription",
}) as any as S.Schema<ReplicaSettingsDescription>;
export type ReplicaSettingsDescriptionList = ReplicaSettingsDescription[];
export const ReplicaSettingsDescriptionList = S.Array(
  ReplicaSettingsDescription,
);
export interface UpdateGlobalTableSettingsOutput {
  GlobalTableName?: string;
  ReplicaSettings?: ReplicaSettingsDescriptionList;
}
export const UpdateGlobalTableSettingsOutput = S.suspend(() =>
  S.Struct({
    GlobalTableName: S.optional(S.String),
    ReplicaSettings: S.optional(ReplicaSettingsDescriptionList),
  }).pipe(ns),
).annotations({
  identifier: "UpdateGlobalTableSettingsOutput",
}) as any as S.Schema<UpdateGlobalTableSettingsOutput>;
export interface UpdateTableOutput {
  TableDescription?: TableDescription;
}
export const UpdateTableOutput = S.suspend(() =>
  S.Struct({ TableDescription: S.optional(TableDescription) }).pipe(ns),
).annotations({
  identifier: "UpdateTableOutput",
}) as any as S.Schema<UpdateTableOutput>;
export interface DescribeGlobalTableSettingsOutput {
  GlobalTableName?: string;
  ReplicaSettings?: ReplicaSettingsDescriptionList;
}
export const DescribeGlobalTableSettingsOutput = S.suspend(() =>
  S.Struct({
    GlobalTableName: S.optional(S.String),
    ReplicaSettings: S.optional(ReplicaSettingsDescriptionList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeGlobalTableSettingsOutput",
}) as any as S.Schema<DescribeGlobalTableSettingsOutput>;
export interface CancellationReason {
  Item?: AttributeMap;
  Code?: string;
  Message?: string;
}
export const CancellationReason = S.suspend(() =>
  S.Struct({
    Item: S.optional(AttributeMap),
    Code: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "CancellationReason",
}) as any as S.Schema<CancellationReason>;
export type CancellationReasonList = CancellationReason[];
export const CancellationReasonList = S.Array(CancellationReason);

//# Errors
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { message: S.optional(S.String) },
) {}
export class BackupNotFoundException extends S.TaggedError<BackupNotFoundException>()(
  "BackupNotFoundException",
  { message: S.optional(S.String) },
) {}
export class InvalidEndpointException extends S.TaggedError<InvalidEndpointException>()(
  "InvalidEndpointException",
  { Message: S.optional(S.String) },
) {}
export class BackupInUseException extends S.TaggedError<BackupInUseException>()(
  "BackupInUseException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class GlobalTableAlreadyExistsException extends S.TaggedError<GlobalTableAlreadyExistsException>()(
  "GlobalTableAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class ExportNotFoundException extends S.TaggedError<ExportNotFoundException>()(
  "ExportNotFoundException",
  { message: S.optional(S.String) },
) {}
export class GlobalTableNotFoundException extends S.TaggedError<GlobalTableNotFoundException>()(
  "GlobalTableNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ImportNotFoundException extends S.TaggedError<ImportNotFoundException>()(
  "ImportNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ExportConflictException extends S.TaggedError<ExportConflictException>()(
  "ExportConflictException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ContinuousBackupsUnavailableException extends S.TaggedError<ContinuousBackupsUnavailableException>()(
  "ContinuousBackupsUnavailableException",
  { message: S.optional(S.String) },
) {}
export class PolicyNotFoundException extends S.TaggedError<PolicyNotFoundException>()(
  "PolicyNotFoundException",
  { message: S.optional(S.String) },
) {}
export class InvalidRestoreTimeException extends S.TaggedError<InvalidRestoreTimeException>()(
  "InvalidRestoreTimeException",
  { message: S.optional(S.String) },
) {}
export class ConditionalCheckFailedException extends S.TaggedError<ConditionalCheckFailedException>()(
  "ConditionalCheckFailedException",
  { message: S.optional(S.String), Item: S.optional(AttributeMap) },
) {}
export class TableNotFoundException extends S.TaggedError<TableNotFoundException>()(
  "TableNotFoundException",
  { message: S.optional(S.String) },
) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  { Message: S.optional(S.String) },
) {}
export class InvalidExportTimeException extends S.TaggedError<InvalidExportTimeException>()(
  "InvalidExportTimeException",
  { message: S.optional(S.String) },
) {}
export class ImportConflictException extends S.TaggedError<ImportConflictException>()(
  "ImportConflictException",
  { message: S.optional(S.String) },
) {}
export class ReplicaAlreadyExistsException extends S.TaggedError<ReplicaAlreadyExistsException>()(
  "ReplicaAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class PointInTimeRecoveryUnavailableException extends S.TaggedError<PointInTimeRecoveryUnavailableException>()(
  "PointInTimeRecoveryUnavailableException",
  { message: S.optional(S.String) },
) {}
export class ProvisionedThroughputExceededException extends S.TaggedError<ProvisionedThroughputExceededException>()(
  "ProvisionedThroughputExceededException",
  {
    message: S.optional(S.String),
    ThrottlingReasons: S.optional(ThrottlingReasonList),
  },
) {}
export class TableAlreadyExistsException extends S.TaggedError<TableAlreadyExistsException>()(
  "TableAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class TableInUseException extends S.TaggedError<TableInUseException>()(
  "TableInUseException",
  { message: S.optional(S.String) },
) {}
export class RequestLimitExceeded extends S.TaggedError<RequestLimitExceeded>()(
  "RequestLimitExceeded",
  {
    message: S.optional(S.String),
    ThrottlingReasons: S.optional(ThrottlingReasonList),
  },
) {}
export class ItemCollectionSizeLimitExceededException extends S.TaggedError<ItemCollectionSizeLimitExceededException>()(
  "ItemCollectionSizeLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ReplicaNotFoundException extends S.TaggedError<ReplicaNotFoundException>()(
  "ReplicaNotFoundException",
  { message: S.optional(S.String) },
) {}
export class IndexNotFoundException extends S.TaggedError<IndexNotFoundException>()(
  "IndexNotFoundException",
  { message: S.optional(S.String) },
) {}
export class DuplicateItemException extends S.TaggedError<DuplicateItemException>()(
  "DuplicateItemException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    throttlingReasons: S.optional(ThrottlingReasonList),
  },
  T.AwsQueryError({ code: "Throttling", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReplicatedWriteConflictException extends S.TaggedError<ReplicatedWriteConflictException>()(
  "ReplicatedWriteConflictException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withRetryableError) {}
export class TransactionConflictException extends S.TaggedError<TransactionConflictException>()(
  "TransactionConflictException",
  { message: S.optional(S.String) },
) {}
export class TransactionCanceledException extends S.TaggedError<TransactionCanceledException>()(
  "TransactionCanceledException",
  {
    Message: S.optional(S.String),
    CancellationReasons: S.optional(CancellationReasonList),
  },
) {}
export class TransactionInProgressException extends S.TaggedError<TransactionInProgressException>()(
  "TransactionInProgressException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns the regional endpoint information. For more information on policy permissions,
 * please see Internetwork traffic privacy.
 */
export const describeEndpoints: (
  input: DescribeEndpointsRequest,
) => Effect.Effect<
  DescribeEndpointsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointsRequest,
  output: DescribeEndpointsResponse,
  errors: [],
}));
/**
 * Returns the current provisioned-capacity quotas for your Amazon Web Services account in
 * a Region, both for the Region as a whole and for any one DynamoDB table that you create
 * there.
 *
 * When you establish an Amazon Web Services account, the account has initial quotas on
 * the maximum read capacity units and write capacity units that you can provision across
 * all of your DynamoDB tables in a given Region. Also, there are per-table
 * quotas that apply when you create a table there. For more information, see Service,
 * Account, and Table Quotas page in the Amazon DynamoDB
 * Developer Guide.
 *
 * Although you can increase these quotas by filing a case at Amazon Web Services Support Center, obtaining the
 * increase is not instantaneous. The `DescribeLimits` action lets you write
 * code to compare the capacity you are currently using to those quotas imposed by your
 * account so that you have enough time to apply for an increase before you hit a
 * quota.
 *
 * For example, you could use one of the Amazon Web Services SDKs to do the
 * following:
 *
 * - Call `DescribeLimits` for a particular Region to obtain your
 * current account quotas on provisioned capacity there.
 *
 * - Create a variable to hold the aggregate read capacity units provisioned for
 * all your tables in that Region, and one to hold the aggregate write capacity
 * units. Zero them both.
 *
 * - Call `ListTables` to obtain a list of all your DynamoDB
 * tables.
 *
 * - For each table name listed by `ListTables`, do the
 * following:
 *
 * - Call `DescribeTable` with the table name.
 *
 * - Use the data returned by `DescribeTable` to add the read
 * capacity units and write capacity units provisioned for the table itself
 * to your variables.
 *
 * - If the table has one or more global secondary indexes (GSIs), loop
 * over these GSIs and add their provisioned capacity values to your
 * variables as well.
 *
 * - Report the account quotas for that Region returned by
 * `DescribeLimits`, along with the total current provisioned
 * capacity levels you have calculated.
 *
 * This will let you see whether you are getting close to your account-level
 * quotas.
 *
 * The per-table quotas apply only when you are creating a new table. They restrict the
 * sum of the provisioned capacity of the new table itself and all its global secondary
 * indexes.
 *
 * For existing tables and their GSIs, DynamoDB doesn't let you increase provisioned
 * capacity extremely rapidly, but the only quota that applies is that the aggregate
 * provisioned capacity over all your tables and GSIs cannot exceed either of the
 * per-account quotas.
 *
 * `DescribeLimits` should only be called periodically. You can expect
 * throttling errors if you call it more than once in a minute.
 *
 * The `DescribeLimits` Request element has no content.
 */
export const describeLimits: (
  input: DescribeLimitsInput,
) => Effect.Effect<
  DescribeLimitsOutput,
  InternalServerError | InvalidEndpointException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLimitsInput,
  output: DescribeLimitsOutput,
  errors: [InternalServerError, InvalidEndpointException],
}));
/**
 * List DynamoDB backups that are associated with an Amazon Web Services account and
 * weren't made with Amazon Web Services Backup. To list these backups for a given table,
 * specify `TableName`. `ListBackups` returns a paginated list of
 * results with at most 1 MB worth of items in a page. You can also specify a maximum
 * number of entries to be returned in a page.
 *
 * In the request, start time is inclusive, but end time is exclusive. Note that these
 * boundaries are for the time at which the original backup was requested.
 *
 * You can call `ListBackups` a maximum of five times per second.
 *
 * If you want to retrieve the complete list of backups made with Amazon Web Services
 * Backup, use the Amazon Web Services Backup
 * list API.
 */
export const listBackups: (
  input: ListBackupsInput,
) => Effect.Effect<
  ListBackupsOutput,
  InternalServerError | InvalidEndpointException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBackupsInput,
  output: ListBackupsOutput,
  errors: [InternalServerError, InvalidEndpointException],
}));
/**
 * Lists all global tables that have a replica in the specified Region.
 *
 * This documentation is for version 2017.11.29 (Legacy) of global tables, which should be avoided for new global tables. Customers should use Global Tables version 2019.11.21 (Current) when possible, because it provides greater flexibility, higher efficiency, and consumes less write capacity than 2017.11.29 (Legacy).
 *
 * To determine which version you're using, see Determining the global table version you are using. To update existing global tables from version 2017.11.29 (Legacy) to version 2019.11.21 (Current), see Upgrading global tables.
 */
export const listGlobalTables: (
  input: ListGlobalTablesInput,
) => Effect.Effect<
  ListGlobalTablesOutput,
  InternalServerError | InvalidEndpointException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGlobalTablesInput,
  output: ListGlobalTablesOutput,
  errors: [InternalServerError, InvalidEndpointException],
}));
/**
 * Updates the status for contributor insights for a specific table or index. CloudWatch
 * Contributor Insights for DynamoDB graphs display the partition key and (if applicable)
 * sort key of frequently accessed items and frequently throttled items in plaintext. If
 * you require the use of Amazon Web Services Key Management Service (KMS) to encrypt this
 * table’s partition key and sort key data with an Amazon Web Services managed key or
 * customer managed key, you should not enable CloudWatch Contributor Insights for DynamoDB
 * for this table.
 */
export const updateContributorInsights: (
  input: UpdateContributorInsightsInput,
) => Effect.Effect<
  UpdateContributorInsightsOutput,
  InternalServerError | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContributorInsightsInput,
  output: UpdateContributorInsightsOutput,
  errors: [InternalServerError, ResourceNotFoundException],
}));
/**
 * Returns information about the table, including the current status of the table, when
 * it was created, the primary key schema, and any indexes on the table.
 *
 * If you issue a `DescribeTable` request immediately after a
 * `CreateTable` request, DynamoDB might return a
 * `ResourceNotFoundException`. This is because
 * `DescribeTable` uses an eventually consistent query, and the metadata
 * for your table might not be available at that moment. Wait for a few seconds, and
 * then try the `DescribeTable` request again.
 */
export const describeTable: (
  input: DescribeTableInput,
) => Effect.Effect<
  DescribeTableOutput,
  | InternalServerError
  | InvalidEndpointException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTableInput,
  output: DescribeTableOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an array of table names associated with the current account and endpoint. The
 * output from `ListTables` is paginated, with each page returning a maximum of
 * 100 table names.
 */
export const listTables: {
  (
    input: ListTablesInput,
  ): Effect.Effect<
    ListTablesOutput,
    InternalServerError | InvalidEndpointException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTablesInput,
  ) => Stream.Stream<
    ListTablesOutput,
    InternalServerError | InvalidEndpointException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTablesInput,
  ) => Stream.Stream<
    TableName,
    InternalServerError | InvalidEndpointException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTablesInput,
  output: ListTablesOutput,
  errors: [InternalServerError, InvalidEndpointException],
  pagination: {
    inputToken: "ExclusiveStartTableName",
    outputToken: "LastEvaluatedTableName",
    items: "TableNames",
    pageSize: "Limit",
  } as const,
}));
/**
 * List all tags on an Amazon DynamoDB resource. You can call ListTagsOfResource up to 10
 * times per second, per account.
 *
 * For an overview on tagging DynamoDB resources, see Tagging for DynamoDB
 * in the *Amazon DynamoDB Developer Guide*.
 */
export const listTagsOfResource: (
  input: ListTagsOfResourceInput,
) => Effect.Effect<
  ListTagsOfResourceOutput,
  | InternalServerError
  | InvalidEndpointException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsOfResourceInput,
  output: ListTagsOfResourceOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes an existing backup of a table.
 *
 * You can call `DescribeBackup` at a maximum rate of 10 times per
 * second.
 */
export const describeBackup: (
  input: DescribeBackupInput,
) => Effect.Effect<
  DescribeBackupOutput,
  | BackupNotFoundException
  | InternalServerError
  | InvalidEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBackupInput,
  output: DescribeBackupOutput,
  errors: [
    BackupNotFoundException,
    InternalServerError,
    InvalidEndpointException,
  ],
}));
/**
 * Returns information about the status of Kinesis streaming.
 */
export const describeKinesisStreamingDestination: (
  input: DescribeKinesisStreamingDestinationInput,
) => Effect.Effect<
  DescribeKinesisStreamingDestinationOutput,
  | InternalServerError
  | InvalidEndpointException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeKinesisStreamingDestinationInput,
  output: DescribeKinesisStreamingDestinationOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about contributor insights for a given table or global secondary
 * index.
 */
export const describeContributorInsights: (
  input: DescribeContributorInsightsInput,
) => Effect.Effect<
  DescribeContributorInsightsOutput,
  InternalServerError | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContributorInsightsInput,
  output: DescribeContributorInsightsOutput,
  errors: [InternalServerError, ResourceNotFoundException],
}));
/**
 * Gives a description of the Time to Live (TTL) status on the specified table.
 */
export const describeTimeToLive: (
  input: DescribeTimeToLiveInput,
) => Effect.Effect<
  DescribeTimeToLiveOutput,
  | InternalServerError
  | InvalidEndpointException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTimeToLiveInput,
  output: DescribeTimeToLiveOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of ContributorInsightsSummary for a table and all its global secondary
 * indexes.
 */
export const listContributorInsights: {
  (
    input: ListContributorInsightsInput,
  ): Effect.Effect<
    ListContributorInsightsOutput,
    InternalServerError | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContributorInsightsInput,
  ) => Stream.Stream<
    ListContributorInsightsOutput,
    InternalServerError | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContributorInsightsInput,
  ) => Stream.Stream<
    unknown,
    InternalServerError | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContributorInsightsInput,
  output: ListContributorInsightsOutput,
  errors: [InternalServerError, ResourceNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about the specified global table.
 *
 * This documentation is for version 2017.11.29 (Legacy) of global tables, which should be avoided for new global tables. Customers should use Global Tables version 2019.11.21 (Current) when possible, because it provides greater flexibility, higher efficiency, and consumes less write capacity than 2017.11.29 (Legacy).
 *
 * To determine which version you're using, see Determining the global table version you are using. To update existing global tables from version 2017.11.29 (Legacy) to version 2019.11.21 (Current), see Upgrading global tables.
 */
export const describeGlobalTable: (
  input: DescribeGlobalTableInput,
) => Effect.Effect<
  DescribeGlobalTableOutput,
  | GlobalTableNotFoundException
  | InternalServerError
  | InvalidEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGlobalTableInput,
  output: DescribeGlobalTableOutput,
  errors: [
    GlobalTableNotFoundException,
    InternalServerError,
    InvalidEndpointException,
  ],
}));
/**
 * Represents the properties of the import.
 */
export const describeImport: (
  input: DescribeImportInput,
) => Effect.Effect<
  DescribeImportOutput,
  ImportNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImportInput,
  output: DescribeImportOutput,
  errors: [ImportNotFoundException],
}));
/**
 * Lists completed exports within the past 90 days.
 */
export const listExports: {
  (
    input: ListExportsInput,
  ): Effect.Effect<
    ListExportsOutput,
    InternalServerError | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExportsInput,
  ) => Stream.Stream<
    ListExportsOutput,
    InternalServerError | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExportsInput,
  ) => Stream.Stream<
    unknown,
    InternalServerError | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExportsInput,
  output: ListExportsOutput,
  errors: [InternalServerError, LimitExceededException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the resource-based policy document attached to the resource, which can be a
 * table or stream, in JSON format.
 *
 * `GetResourcePolicy` follows an
 * *eventually consistent*
 * model. The following list
 * describes the outcomes when you issue the `GetResourcePolicy` request
 * immediately after issuing another request:
 *
 * - If you issue a `GetResourcePolicy` request immediately after a
 * `PutResourcePolicy` request, DynamoDB might return a
 * `PolicyNotFoundException`.
 *
 * - If you issue a `GetResourcePolicy`request immediately after a
 * `DeleteResourcePolicy` request, DynamoDB might return
 * the policy that was present before the deletion request.
 *
 * - If you issue a `GetResourcePolicy` request immediately after a
 * `CreateTable` request, which includes a resource-based policy,
 * DynamoDB might return a `ResourceNotFoundException` or
 * a `PolicyNotFoundException`.
 *
 * Because `GetResourcePolicy` uses an eventually
 * consistent query, the metadata for your policy or table might not be
 * available at that moment. Wait for a few seconds, and then retry the
 * `GetResourcePolicy` request.
 *
 * After a `GetResourcePolicy` request returns a policy created using the
 * `PutResourcePolicy` request, the policy will be applied in the
 * authorization of requests to the resource. Because this process is eventually
 * consistent, it will take some time to apply the policy to all requests to a resource.
 * Policies that you attach while creating a table using the `CreateTable`
 * request will always be applied to all requests for that table.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyInput,
) => Effect.Effect<
  GetResourcePolicyOutput,
  | InternalServerError
  | InvalidEndpointException
  | PolicyNotFoundException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyInput,
  output: GetResourcePolicyOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    PolicyNotFoundException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists completed imports within the past 90 days.
 */
export const listImports: {
  (
    input: ListImportsInput,
  ): Effect.Effect<
    ListImportsOutput,
    LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportsInput,
  ) => Stream.Stream<
    ListImportsOutput,
    LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportsInput,
  ) => Stream.Stream<
    unknown,
    LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportsInput,
  output: ListImportsOutput,
  errors: [LimitExceededException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Describes an existing table export.
 */
export const describeExport: (
  input: DescribeExportInput,
) => Effect.Effect<
  DescribeExportOutput,
  | ExportNotFoundException
  | InternalServerError
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExportInput,
  output: DescribeExportOutput,
  errors: [
    ExportNotFoundException,
    InternalServerError,
    LimitExceededException,
  ],
}));
/**
 * Deletes an existing backup of a table.
 *
 * You can call `DeleteBackup` at a maximum rate of 10 times per
 * second.
 */
export const deleteBackup: (
  input: DeleteBackupInput,
) => Effect.Effect<
  DeleteBackupOutput,
  | BackupInUseException
  | BackupNotFoundException
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackupInput,
  output: DeleteBackupOutput,
  errors: [
    BackupInUseException,
    BackupNotFoundException,
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
  ],
}));
/**
 * Checks the status of continuous backups and point in time recovery on the specified
 * table. Continuous backups are `ENABLED` on all tables at table creation. If
 * point in time recovery is enabled, `PointInTimeRecoveryStatus` will be set to
 * ENABLED.
 *
 * After continuous backups and point in time recovery are enabled, you can restore to
 * any point in time within `EarliestRestorableDateTime` and
 * `LatestRestorableDateTime`.
 *
 * `LatestRestorableDateTime` is typically 5 minutes before the current time.
 * You can restore your table to any point in time in the last 35 days. You can set the
 * recovery period to any value between 1 and 35 days.
 *
 * You can call `DescribeContinuousBackups` at a maximum rate of 10 times per
 * second.
 */
export const describeContinuousBackups: (
  input: DescribeContinuousBackupsInput,
) => Effect.Effect<
  DescribeContinuousBackupsOutput,
  | InternalServerError
  | InvalidEndpointException
  | TableNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContinuousBackupsInput,
  output: DescribeContinuousBackupsOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    TableNotFoundException,
  ],
}));
/**
 * Describes auto scaling settings across replicas of the global table at once.
 */
export const describeTableReplicaAutoScaling: (
  input: DescribeTableReplicaAutoScalingInput,
) => Effect.Effect<
  DescribeTableReplicaAutoScalingOutput,
  InternalServerError | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTableReplicaAutoScalingInput,
  output: DescribeTableReplicaAutoScalingOutput,
  errors: [InternalServerError, ResourceNotFoundException],
}));
/**
 * Updates auto scaling settings on your global tables at once.
 */
export const updateTableReplicaAutoScaling: (
  input: UpdateTableReplicaAutoScalingInput,
) => Effect.Effect<
  UpdateTableReplicaAutoScalingOutput,
  | InternalServerError
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTableReplicaAutoScalingInput,
  output: UpdateTableReplicaAutoScalingOutput,
  errors: [
    InternalServerError,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * `UpdateContinuousBackups` enables or disables point in time recovery for
 * the specified table. A successful `UpdateContinuousBackups` call returns the
 * current `ContinuousBackupsDescription`. Continuous backups are
 * `ENABLED` on all tables at table creation. If point in time recovery is
 * enabled, `PointInTimeRecoveryStatus` will be set to ENABLED.
 *
 * Once continuous backups and point in time recovery are enabled, you can restore to
 * any point in time within `EarliestRestorableDateTime` and
 * `LatestRestorableDateTime`.
 *
 * `LatestRestorableDateTime` is typically 5 minutes before the current time.
 * You can restore your table to any point in time in the last 35 days. You can set the
 * `RecoveryPeriodInDays` to any value between 1 and 35 days.
 */
export const updateContinuousBackups: (
  input: UpdateContinuousBackupsInput,
) => Effect.Effect<
  UpdateContinuousBackupsOutput,
  | ContinuousBackupsUnavailableException
  | InternalServerError
  | InvalidEndpointException
  | TableNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContinuousBackupsInput,
  output: UpdateContinuousBackupsOutput,
  errors: [
    ContinuousBackupsUnavailableException,
    InternalServerError,
    InvalidEndpointException,
    TableNotFoundException,
  ],
}));
/**
 * Creates a global table from an existing table. A global table creates a replication
 * relationship between two or more DynamoDB tables with the same table name in the
 * provided Regions.
 *
 * This documentation is for version 2017.11.29 (Legacy) of global tables, which should be avoided for new global tables. Customers should use Global Tables version 2019.11.21 (Current) when possible, because it provides greater flexibility, higher efficiency, and consumes less write capacity than 2017.11.29 (Legacy).
 *
 * To determine which version you're using, see Determining the global table version you are using. To update existing global tables from version 2017.11.29 (Legacy) to version 2019.11.21 (Current), see Upgrading global tables.
 *
 * If you want to add a new replica table to a global table, each of the following
 * conditions must be true:
 *
 * - The table must have the same primary key as all of the other replicas.
 *
 * - The table must have the same name as all of the other replicas.
 *
 * - The table must have DynamoDB Streams enabled, with the stream containing both
 * the new and the old images of the item.
 *
 * - None of the replica tables in the global table can contain any data.
 *
 * If global secondary indexes are specified, then the following conditions must also be
 * met:
 *
 * - The global secondary indexes must have the same name.
 *
 * - The global secondary indexes must have the same hash key and sort key (if
 * present).
 *
 * If local secondary indexes are specified, then the following conditions must also be
 * met:
 *
 * - The local secondary indexes must have the same name.
 *
 * - The local secondary indexes must have the same hash key and sort key (if
 * present).
 *
 * Write capacity settings should be set consistently across your replica tables and
 * secondary indexes. DynamoDB strongly recommends enabling auto scaling to manage the
 * write capacity settings for all of your global tables replicas and indexes.
 *
 * If you prefer to manage write capacity settings manually, you should provision
 * equal replicated write capacity units to your replica tables. You should also
 * provision equal replicated write capacity units to matching secondary indexes across
 * your global table.
 */
export const createGlobalTable: (
  input: CreateGlobalTableInput,
) => Effect.Effect<
  CreateGlobalTableOutput,
  | GlobalTableAlreadyExistsException
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | TableNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlobalTableInput,
  output: CreateGlobalTableOutput,
  errors: [
    GlobalTableAlreadyExistsException,
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    TableNotFoundException,
  ],
}));
/**
 * Creates a backup for an existing table.
 *
 * Each time you create an on-demand backup, the entire table data is backed up. There
 * is no limit to the number of on-demand backups that can be taken.
 *
 * When you create an on-demand backup, a time marker of the request is cataloged, and
 * the backup is created asynchronously, by applying all changes until the time of the
 * request to the last full table snapshot. Backup requests are processed instantaneously
 * and become available for restore within minutes.
 *
 * You can call `CreateBackup` at a maximum rate of 50 times per
 * second.
 *
 * All backups in DynamoDB work without consuming any provisioned throughput on the
 * table.
 *
 * If you submit a backup request on 2018-12-14 at 14:25:00, the backup is guaranteed to
 * contain all data committed to the table up to 14:24:00, and data committed after
 * 14:26:00 will not be. The backup might contain data modifications made between 14:24:00
 * and 14:26:00. On-demand backup does not support causal consistency.
 *
 * Along with data, the following are also included on the backups:
 *
 * - Global secondary indexes (GSIs)
 *
 * - Local secondary indexes (LSIs)
 *
 * - Streams
 *
 * - Provisioned read and write capacity
 */
export const createBackup: (
  input: CreateBackupInput,
) => Effect.Effect<
  CreateBackupOutput,
  | BackupInUseException
  | ContinuousBackupsUnavailableException
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | TableInUseException
  | TableNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackupInput,
  output: CreateBackupOutput,
  errors: [
    BackupInUseException,
    ContinuousBackupsUnavailableException,
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    TableInUseException,
    TableNotFoundException,
  ],
}));
/**
 * The command to update the Kinesis stream destination.
 */
export const updateKinesisStreamingDestination: (
  input: UpdateKinesisStreamingDestinationInput,
) => Effect.Effect<
  UpdateKinesisStreamingDestinationOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKinesisStreamingDestinationInput,
  output: UpdateKinesisStreamingDestinationOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * The `UpdateTimeToLive` method enables or disables Time to Live (TTL) for
 * the specified table. A successful `UpdateTimeToLive` call returns the current
 * `TimeToLiveSpecification`. It can take up to one hour for the change to
 * fully process. Any additional `UpdateTimeToLive` calls for the same table
 * during this one hour duration result in a `ValidationException`.
 *
 * TTL compares the current time in epoch time format to the time stored in the TTL
 * attribute of an item. If the epoch time value stored in the attribute is less than the
 * current time, the item is marked as expired and subsequently deleted.
 *
 * The epoch time format is the number of seconds elapsed since 12:00:00 AM January
 * 1, 1970 UTC.
 *
 * DynamoDB deletes expired items on a best-effort basis to ensure availability of
 * throughput for other data operations.
 *
 * DynamoDB typically deletes expired items within two days of expiration. The exact
 * duration within which an item gets deleted after expiration is specific to the
 * nature of the workload. Items that have expired and not been deleted will still show
 * up in reads, queries, and scans.
 *
 * As items are deleted, they are removed from any local secondary index and global
 * secondary index immediately in the same eventually consistent way as a standard delete
 * operation.
 *
 * For more information, see Time To Live in the
 * Amazon DynamoDB Developer Guide.
 */
export const updateTimeToLive: (
  input: UpdateTimeToLiveInput,
) => Effect.Effect<
  UpdateTimeToLiveOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTimeToLiveInput,
  output: UpdateTimeToLiveOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops replication from the DynamoDB table to the Kinesis data stream. This
 * is done without deleting either of the resources.
 */
export const disableKinesisStreamingDestination: (
  input: KinesisStreamingDestinationInput,
) => Effect.Effect<
  KinesisStreamingDestinationOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: KinesisStreamingDestinationInput,
  output: KinesisStreamingDestinationOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Attaches a resource-based policy document to the resource, which can be a table or
 * stream. When you attach a resource-based policy using this API, the policy application
 * is
 * *eventually consistent*
 * .
 *
 * `PutResourcePolicy` is an idempotent operation; running it multiple times
 * on the same resource using the same policy document will return the same revision ID. If
 * you specify an `ExpectedRevisionId` that doesn't match the current policy's
 * `RevisionId`, the `PolicyNotFoundException` will be
 * returned.
 *
 * `PutResourcePolicy` is an asynchronous operation. If you issue a
 * `GetResourcePolicy` request immediately after a
 * `PutResourcePolicy` request, DynamoDB might return your
 * previous policy, if there was one, or return the
 * `PolicyNotFoundException`. This is because
 * `GetResourcePolicy` uses an eventually consistent query, and the
 * metadata for your policy or table might not be available at that moment. Wait for a
 * few seconds, and then try the `GetResourcePolicy` request again.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyInput,
) => Effect.Effect<
  PutResourcePolicyOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | PolicyNotFoundException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyInput,
  output: PutResourcePolicyOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    PolicyNotFoundException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts table data replication to the specified Kinesis data stream at a timestamp
 * chosen during the enable workflow. If this operation doesn't return results immediately,
 * use DescribeKinesisStreamingDestination to check if streaming to the Kinesis data stream
 * is ACTIVE.
 */
export const enableKinesisStreamingDestination: (
  input: KinesisStreamingDestinationInput,
) => Effect.Effect<
  KinesisStreamingDestinationOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: KinesisStreamingDestinationInput,
  output: KinesisStreamingDestinationOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associate a set of tags with an Amazon DynamoDB resource. You can then activate these
 * user-defined tags so that they appear on the Billing and Cost Management console for
 * cost allocation tracking. You can call TagResource up to five times per second, per
 * account.
 *
 * - `TagResource` is an asynchronous operation. If you issue a ListTagsOfResource request immediately after a
 * `TagResource` request, DynamoDB might return your
 * previous tag set, if there was one, or an empty tag set. This is because
 * `ListTagsOfResource` uses an eventually consistent query, and the
 * metadata for your tags or table might not be available at that moment. Wait for
 * a few seconds, and then try the `ListTagsOfResource` request
 * again.
 *
 * - The application or removal of tags using `TagResource` and
 * `UntagResource` APIs is eventually consistent.
 * `ListTagsOfResource` API will only reflect the changes after a
 * few seconds.
 *
 * For an overview on tagging DynamoDB resources, see Tagging for DynamoDB
 * in the *Amazon DynamoDB Developer Guide*.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes the association of tags from an Amazon DynamoDB resource. You can call
 * `UntagResource` up to five times per second, per account.
 *
 * - `UntagResource` is an asynchronous operation. If you issue a ListTagsOfResource request immediately after an
 * `UntagResource` request, DynamoDB might return your
 * previous tag set, if there was one, or an empty tag set. This is because
 * `ListTagsOfResource` uses an eventually consistent query, and the
 * metadata for your tags or table might not be available at that moment. Wait for
 * a few seconds, and then try the `ListTagsOfResource` request
 * again.
 *
 * - The application or removal of tags using `TagResource` and
 * `UntagResource` APIs is eventually consistent.
 * `ListTagsOfResource` API will only reflect the changes after a
 * few seconds.
 *
 * For an overview on tagging DynamoDB resources, see Tagging for DynamoDB
 * in the *Amazon DynamoDB Developer Guide*.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the resource-based policy attached to the resource, which can be a table or
 * stream.
 *
 * `DeleteResourcePolicy` is an idempotent operation; running it multiple
 * times on the same resource *doesn't* result in an error response,
 * unless you specify an `ExpectedRevisionId`, which will then return a
 * `PolicyNotFoundException`.
 *
 * To make sure that you don't inadvertently lock yourself out of your own resources,
 * the root principal in your Amazon Web Services account can perform
 * `DeleteResourcePolicy` requests, even if your resource-based policy
 * explicitly denies the root principal's access.
 *
 * `DeleteResourcePolicy` is an asynchronous operation. If you issue a
 * `GetResourcePolicy` request immediately after running the
 * `DeleteResourcePolicy` request, DynamoDB might still return
 * the deleted policy. This is because the policy for your resource might not have been
 * deleted yet. Wait for a few seconds, and then try the `GetResourcePolicy`
 * request again.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyInput,
) => Effect.Effect<
  DeleteResourcePolicyOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | PolicyNotFoundException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyInput,
  output: DeleteResourcePolicyOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    PolicyNotFoundException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * The `CreateTable` operation adds a new table to your account. In an Amazon Web Services account, table names must be unique within each Region. That is, you can
 * have two tables with same name if you create the tables in different Regions.
 *
 * `CreateTable` is an asynchronous operation. Upon receiving a
 * `CreateTable` request, DynamoDB immediately returns a response with a
 * `TableStatus` of `CREATING`. After the table is created,
 * DynamoDB sets the `TableStatus` to `ACTIVE`. You can perform read
 * and write operations only on an `ACTIVE` table.
 *
 * You can optionally define secondary indexes on the new table, as part of the
 * `CreateTable` operation. If you want to create multiple tables with
 * secondary indexes on them, you must create the tables sequentially. Only one table with
 * secondary indexes can be in the `CREATING` state at any given time.
 *
 * You can use the `DescribeTable` action to check the table status.
 */
export const createTable: (
  input: CreateTableInput,
) => Effect.Effect<
  CreateTableOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTableInput,
  output: CreateTableOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
  ],
}));
/**
 * The `DeleteTable` operation deletes a table and all of its items. After a
 * `DeleteTable` request, the specified table is in the
 * `DELETING` state until DynamoDB completes the deletion. If the table is
 * in the `ACTIVE` state, you can delete it. If a table is in
 * `CREATING` or `UPDATING` states, then DynamoDB returns a
 * `ResourceInUseException`. If the specified table does not exist, DynamoDB
 * returns a `ResourceNotFoundException`. If table is already in the
 * `DELETING` state, no error is returned.
 *
 * DynamoDB might continue to accept data read and write operations, such as
 * `GetItem` and `PutItem`, on a table in the
 * `DELETING` state until the table deletion is complete. For the full
 * list of table states, see TableStatus.
 *
 * When you delete a table, any indexes on that table are also deleted.
 *
 * If you have DynamoDB Streams enabled on the table, then the corresponding stream on
 * that table goes into the `DISABLED` state, and the stream is automatically
 * deleted after 24 hours.
 *
 * Use the `DescribeTable` action to check the status of the table.
 */
export const deleteTable: (
  input: DeleteTableInput,
) => Effect.Effect<
  DeleteTableOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTableInput,
  output: DeleteTableOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Imports table data from an S3 bucket.
 */
export const importTable: (
  input: ImportTableInput,
) => Effect.Effect<
  ImportTableOutput,
  | ImportConflictException
  | LimitExceededException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportTableInput,
  output: ImportTableOutput,
  errors: [
    ImportConflictException,
    LimitExceededException,
    ResourceInUseException,
  ],
}));
/**
 * Modifies the provisioned throughput settings, global secondary indexes, or DynamoDB
 * Streams settings for a given table.
 *
 * You can only perform one of the following operations at once:
 *
 * - Modify the provisioned throughput settings of the table.
 *
 * - Remove a global secondary index from the table.
 *
 * - Create a new global secondary index on the table. After the index begins
 * backfilling, you can use `UpdateTable` to perform other
 * operations.
 *
 * `UpdateTable` is an asynchronous operation; while it's executing, the table
 * status changes from `ACTIVE` to `UPDATING`. While it's
 * `UPDATING`, you can't issue another `UpdateTable` request.
 * When the table returns to the `ACTIVE` state, the `UpdateTable`
 * operation is complete.
 */
export const updateTable: (
  input: UpdateTableInput,
) => Effect.Effect<
  UpdateTableOutput,
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTableInput,
  output: UpdateTableOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Exports table data to an S3 bucket. The table must have point in time recovery
 * enabled, and you can export data from any time within the point in time recovery
 * window.
 */
export const exportTableToPointInTime: (
  input: ExportTableToPointInTimeInput,
) => Effect.Effect<
  ExportTableToPointInTimeOutput,
  | ExportConflictException
  | InternalServerError
  | InvalidExportTimeException
  | LimitExceededException
  | PointInTimeRecoveryUnavailableException
  | TableNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportTableToPointInTimeInput,
  output: ExportTableToPointInTimeOutput,
  errors: [
    ExportConflictException,
    InternalServerError,
    InvalidExportTimeException,
    LimitExceededException,
    PointInTimeRecoveryUnavailableException,
    TableNotFoundException,
  ],
}));
/**
 * Restores the specified table to the specified point in time within
 * `EarliestRestorableDateTime` and `LatestRestorableDateTime`.
 * You can restore your table to any point in time in the last 35 days. You can set the
 * recovery period to any value between 1 and 35 days. Any number of users can execute up
 * to 50 concurrent restores (any type of restore) in a given account.
 *
 * When you restore using point in time recovery, DynamoDB restores your table data to
 * the state based on the selected date and time (day:hour:minute:second) to a new table.
 *
 * Along with data, the following are also included on the new restored table using point
 * in time recovery:
 *
 * - Global secondary indexes (GSIs)
 *
 * - Local secondary indexes (LSIs)
 *
 * - Provisioned read and write capacity
 *
 * - Encryption settings
 *
 * All these settings come from the current settings of the source table at
 * the time of restore.
 *
 * You must manually set up the following on the restored table:
 *
 * - Auto scaling policies
 *
 * - IAM policies
 *
 * - Amazon CloudWatch metrics and alarms
 *
 * - Tags
 *
 * - Stream settings
 *
 * - Time to Live (TTL) settings
 *
 * - Point in time recovery settings
 */
export const restoreTableToPointInTime: (
  input: RestoreTableToPointInTimeInput,
) => Effect.Effect<
  RestoreTableToPointInTimeOutput,
  | InternalServerError
  | InvalidEndpointException
  | InvalidRestoreTimeException
  | LimitExceededException
  | PointInTimeRecoveryUnavailableException
  | TableAlreadyExistsException
  | TableInUseException
  | TableNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreTableToPointInTimeInput,
  output: RestoreTableToPointInTimeOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    InvalidRestoreTimeException,
    LimitExceededException,
    PointInTimeRecoveryUnavailableException,
    TableAlreadyExistsException,
    TableInUseException,
    TableNotFoundException,
  ],
}));
/**
 * Creates a new table from an existing backup. Any number of users can execute up to 50
 * concurrent restores (any type of restore) in a given account.
 *
 * You can call `RestoreTableFromBackup` at a maximum rate of 10 times per
 * second.
 *
 * You must manually set up the following on the restored table:
 *
 * - Auto scaling policies
 *
 * - IAM policies
 *
 * - Amazon CloudWatch metrics and alarms
 *
 * - Tags
 *
 * - Stream settings
 *
 * - Time to Live (TTL) settings
 */
export const restoreTableFromBackup: (
  input: RestoreTableFromBackupInput,
) => Effect.Effect<
  RestoreTableFromBackupOutput,
  | BackupInUseException
  | BackupNotFoundException
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | TableAlreadyExistsException
  | TableInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreTableFromBackupInput,
  output: RestoreTableFromBackupOutput,
  errors: [
    BackupInUseException,
    BackupNotFoundException,
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    TableAlreadyExistsException,
    TableInUseException,
  ],
}));
/**
 * Describes Region-specific settings for a global table.
 *
 * This documentation is for version 2017.11.29 (Legacy) of global tables, which should be avoided for new global tables. Customers should use Global Tables version 2019.11.21 (Current) when possible, because it provides greater flexibility, higher efficiency, and consumes less write capacity than 2017.11.29 (Legacy).
 *
 * To determine which version you're using, see Determining the global table version you are using. To update existing global tables from version 2017.11.29 (Legacy) to version 2019.11.21 (Current), see Upgrading global tables.
 */
export const describeGlobalTableSettings: (
  input: DescribeGlobalTableSettingsInput,
) => Effect.Effect<
  DescribeGlobalTableSettingsOutput,
  | GlobalTableNotFoundException
  | InternalServerError
  | InvalidEndpointException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGlobalTableSettingsInput,
  output: DescribeGlobalTableSettingsOutput,
  errors: [
    GlobalTableNotFoundException,
    InternalServerError,
    InvalidEndpointException,
  ],
}));
/**
 * Adds or removes replicas in the specified global table. The global table must already
 * exist to be able to use this operation. Any replica to be added must be empty, have the
 * same name as the global table, have the same key schema, have DynamoDB Streams enabled,
 * and have the same provisioned and maximum write capacity units.
 *
 * This documentation is for version 2017.11.29 (Legacy) of global tables, which should be avoided for new global tables. Customers should use Global Tables version 2019.11.21 (Current) when possible, because it provides greater flexibility, higher efficiency, and consumes less write capacity than 2017.11.29 (Legacy).
 *
 * To determine which version you're using, see Determining the global table version you are using. To update existing global tables from version 2017.11.29 (Legacy) to version 2019.11.21 (Current), see Upgrading global tables.
 *
 * If you are using global tables Version
 * 2019.11.21 (Current) you can use UpdateTable instead.
 *
 * Although you can use `UpdateGlobalTable` to add replicas and remove
 * replicas in a single request, for simplicity we recommend that you issue separate
 * requests for adding or removing replicas.
 *
 * If global secondary indexes are specified, then the following conditions must also be
 * met:
 *
 * - The global secondary indexes must have the same name.
 *
 * - The global secondary indexes must have the same hash key and sort key (if
 * present).
 *
 * - The global secondary indexes must have the same provisioned and maximum write
 * capacity units.
 */
export const updateGlobalTable: (
  input: UpdateGlobalTableInput,
) => Effect.Effect<
  UpdateGlobalTableOutput,
  | GlobalTableNotFoundException
  | InternalServerError
  | InvalidEndpointException
  | ReplicaAlreadyExistsException
  | ReplicaNotFoundException
  | TableNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlobalTableInput,
  output: UpdateGlobalTableOutput,
  errors: [
    GlobalTableNotFoundException,
    InternalServerError,
    InvalidEndpointException,
    ReplicaAlreadyExistsException,
    ReplicaNotFoundException,
    TableNotFoundException,
  ],
}));
/**
 * Updates settings for a global table.
 *
 * This documentation is for version 2017.11.29 (Legacy) of global tables, which should be avoided for new global tables. Customers should use Global Tables version 2019.11.21 (Current) when possible, because it provides greater flexibility, higher efficiency, and consumes less write capacity than 2017.11.29 (Legacy).
 *
 * To determine which version you're using, see Determining the global table version you are using. To update existing global tables from version 2017.11.29 (Legacy) to version 2019.11.21 (Current), see Upgrading global tables.
 */
export const updateGlobalTableSettings: (
  input: UpdateGlobalTableSettingsInput,
) => Effect.Effect<
  UpdateGlobalTableSettingsOutput,
  | GlobalTableNotFoundException
  | IndexNotFoundException
  | InternalServerError
  | InvalidEndpointException
  | LimitExceededException
  | ReplicaNotFoundException
  | ResourceInUseException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlobalTableSettingsInput,
  output: UpdateGlobalTableSettingsOutput,
  errors: [
    GlobalTableNotFoundException,
    IndexNotFoundException,
    InternalServerError,
    InvalidEndpointException,
    LimitExceededException,
    ReplicaNotFoundException,
    ResourceInUseException,
  ],
}));
/**
 * This operation allows you to perform batch reads or writes on data stored in DynamoDB,
 * using PartiQL. Each read statement in a `BatchExecuteStatement` must specify
 * an equality condition on all key attributes. This enforces that each `SELECT`
 * statement in a batch returns at most a single item. For more information, see Running batch operations with PartiQL for DynamoDB .
 *
 * The entire batch must consist of either read statements or write statements, you
 * cannot mix both in one batch.
 *
 * A HTTP 200 response does not mean that all statements in the BatchExecuteStatement
 * succeeded. Error details for individual statements can be found under the Error field of the `BatchStatementResponse` for each
 * statement.
 */
export const batchExecuteStatement: (
  input: BatchExecuteStatementInput,
) => Effect.Effect<
  BatchExecuteStatementOutput,
  | InternalServerError
  | RequestLimitExceeded
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchExecuteStatementInput,
  output: BatchExecuteStatementOutput,
  errors: [InternalServerError, RequestLimitExceeded, ThrottlingException],
}));
/**
 * The `BatchWriteItem` operation puts or deletes multiple items in one or
 * more tables. A single call to `BatchWriteItem` can transmit up to 16MB of
 * data over the network, consisting of up to 25 item put or delete operations. While
 * individual items can be up to 400 KB once stored, it's important to note that an item's
 * representation might be greater than 400KB while being sent in DynamoDB's JSON format
 * for the API call. For more details on this distinction, see Naming Rules and Data Types.
 *
 * `BatchWriteItem` cannot update items. If you perform a
 * `BatchWriteItem` operation on an existing item, that item's values
 * will be overwritten by the operation and it will appear like it was updated. To
 * update items, we recommend you use the `UpdateItem` action.
 *
 * The individual `PutItem` and `DeleteItem` operations specified
 * in `BatchWriteItem` are atomic; however `BatchWriteItem` as a
 * whole is not. If any requested operations fail because the table's provisioned
 * throughput is exceeded or an internal processing failure occurs, the failed operations
 * are returned in the `UnprocessedItems` response parameter. You can
 * investigate and optionally resend the requests. Typically, you would call
 * `BatchWriteItem` in a loop. Each iteration would check for unprocessed
 * items and submit a new `BatchWriteItem` request with those unprocessed items
 * until all items have been processed.
 *
 * For tables and indexes with provisioned capacity, if none of the items can be
 * processed due to insufficient provisioned throughput on all of the tables in the
 * request, then `BatchWriteItem` returns a
 * `ProvisionedThroughputExceededException`. For all tables and indexes, if
 * none of the items can be processed due to other throttling scenarios (such as exceeding
 * partition level limits), then `BatchWriteItem` returns a
 * `ThrottlingException`.
 *
 * If DynamoDB returns any unprocessed items, you should retry the batch operation on
 * those items. However, we strongly recommend that you use an exponential
 * backoff algorithm. If you retry the batch operation immediately, the
 * underlying read or write requests can still fail due to throttling on the individual
 * tables. If you delay the batch operation using exponential backoff, the individual
 * requests in the batch are much more likely to succeed.
 *
 * For more information, see Batch Operations and Error Handling in the Amazon DynamoDB
 * Developer Guide.
 *
 * With `BatchWriteItem`, you can efficiently write or delete large amounts of
 * data, such as from Amazon EMR, or copy data from another database into DynamoDB. In
 * order to improve performance with these large-scale operations,
 * `BatchWriteItem` does not behave in the same way as individual
 * `PutItem` and `DeleteItem` calls would. For example, you
 * cannot specify conditions on individual put and delete requests, and
 * `BatchWriteItem` does not return deleted items in the response.
 *
 * If you use a programming language that supports concurrency, you can use threads to
 * write items in parallel. Your application must include the necessary logic to manage the
 * threads. With languages that don't support threading, you must update or delete the
 * specified items one at a time. In both situations, `BatchWriteItem` performs
 * the specified put and delete operations in parallel, giving you the power of the thread
 * pool approach without having to introduce complexity into your application.
 *
 * Parallel processing reduces latency, but each specified put and delete request
 * consumes the same number of write capacity units whether it is processed in parallel or
 * not. Delete operations on nonexistent items consume one write capacity unit.
 *
 * If one or more of the following is true, DynamoDB rejects the entire batch write
 * operation:
 *
 * - One or more tables specified in the `BatchWriteItem` request does
 * not exist.
 *
 * - Primary key attributes specified on an item in the request do not match those
 * in the corresponding table's primary key schema.
 *
 * - You try to perform multiple operations on the same item in the same
 * `BatchWriteItem` request. For example, you cannot put and delete
 * the same item in the same `BatchWriteItem` request.
 *
 * - Your request contains at least two items with identical hash and range keys
 * (which essentially is two put operations).
 *
 * - There are more than 25 requests in the batch.
 *
 * - Any individual item in a batch exceeds 400 KB.
 *
 * - The total request size exceeds 16 MB.
 *
 * - Any individual items with keys exceeding the key length limits. For a
 * partition key, the limit is 2048 bytes and for a sort key, the limit is 1024
 * bytes.
 */
export const batchWriteItem: (
  input: BatchWriteItemInput,
) => Effect.Effect<
  BatchWriteItemOutput,
  | InternalServerError
  | InvalidEndpointException
  | ItemCollectionSizeLimitExceededException
  | ProvisionedThroughputExceededException
  | ReplicatedWriteConflictException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchWriteItemInput,
  output: BatchWriteItemOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ItemCollectionSizeLimitExceededException,
    ProvisionedThroughputExceededException,
    ReplicatedWriteConflictException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * The `Scan` operation returns one or more items and item attributes by
 * accessing every item in a table or a secondary index. To have DynamoDB return fewer
 * items, you can provide a `FilterExpression` operation.
 *
 * If the total size of scanned items exceeds the maximum dataset size limit of 1 MB, the
 * scan completes and results are returned to the user. The `LastEvaluatedKey`
 * value is also returned and the requestor can use the `LastEvaluatedKey` to
 * continue the scan in a subsequent operation. Each scan response also includes number of
 * items that were scanned (ScannedCount) as part of the request. If using a
 * `FilterExpression`, a scan result can result in no items meeting the
 * criteria and the `Count` will result in zero. If you did not use a
 * `FilterExpression` in the scan request, then `Count` is the
 * same as `ScannedCount`.
 *
 * `Count` and `ScannedCount` only return the count of items
 * specific to a single scan request and, unless the table is less than 1MB, do not
 * represent the total number of items in the table.
 *
 * A single `Scan` operation first reads up to the maximum number of items set
 * (if using the `Limit` parameter) or a maximum of 1 MB of data and then
 * applies any filtering to the results if a `FilterExpression` is provided. If
 * `LastEvaluatedKey` is present in the response, pagination is required to
 * complete the full table scan. For more information, see Paginating the
 * Results in the *Amazon DynamoDB Developer Guide*.
 *
 * `Scan` operations proceed sequentially; however, for faster performance on
 * a large table or secondary index, applications can request a parallel `Scan`
 * operation by providing the `Segment` and `TotalSegments`
 * parameters. For more information, see Parallel
 * Scan in the *Amazon DynamoDB Developer Guide*.
 *
 * By default, a `Scan` uses eventually consistent reads when accessing the
 * items in a table. Therefore, the results from an eventually consistent `Scan`
 * may not include the latest item changes at the time the scan iterates through each item
 * in the table. If you require a strongly consistent read of each item as the scan
 * iterates through the items in the table, you can set the `ConsistentRead`
 * parameter to true. Strong consistency only relates to the consistency of the read at the
 * item level.
 *
 * DynamoDB does not provide snapshot isolation for a scan operation when the
 * `ConsistentRead` parameter is set to true. Thus, a DynamoDB scan
 * operation does not guarantee that all reads in a scan see a consistent snapshot of
 * the table when the scan operation was requested.
 */
export const scan: {
  (
    input: ScanInput,
  ): Effect.Effect<
    ScanOutput,
    | InternalServerError
    | InvalidEndpointException
    | ProvisionedThroughputExceededException
    | RequestLimitExceeded
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ScanInput,
  ) => Stream.Stream<
    ScanOutput,
    | InternalServerError
    | InvalidEndpointException
    | ProvisionedThroughputExceededException
    | RequestLimitExceeded
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ScanInput,
  ) => Stream.Stream<
    S.Schema.Type<typeof AttributeMap>,
    | InternalServerError
    | InvalidEndpointException
    | ProvisionedThroughputExceededException
    | RequestLimitExceeded
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ScanInput,
  output: ScanOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "ExclusiveStartKey",
    outputToken: "LastEvaluatedKey",
    items: "Items",
    pageSize: "Limit",
  } as const,
}));
/**
 * The `GetItem` operation returns a set of attributes for the item with the
 * given primary key. If there is no matching item, `GetItem` does not return
 * any data and there will be no `Item` element in the response.
 *
 * `GetItem` provides an eventually consistent read by default. If your
 * application requires a strongly consistent read, set `ConsistentRead` to
 * `true`. Although a strongly consistent read might take more time than an
 * eventually consistent read, it always returns the last updated value.
 */
export const getItem: (
  input: GetItemInput,
) => Effect.Effect<
  GetItemOutput,
  | InternalServerError
  | InvalidEndpointException
  | ProvisionedThroughputExceededException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetItemInput,
  output: GetItemOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * You must provide the name of the partition key attribute and a single value for that
 * attribute. `Query` returns all items with that partition key value.
 * Optionally, you can provide a sort key attribute and use a comparison operator to refine
 * the search results.
 *
 * Use the `KeyConditionExpression` parameter to provide a specific value for
 * the partition key. The `Query` operation will return all of the items from
 * the table or index with that partition key value. You can optionally narrow the scope of
 * the `Query` operation by specifying a sort key value and a comparison
 * operator in `KeyConditionExpression`. To further refine the
 * `Query` results, you can optionally provide a
 * `FilterExpression`. A `FilterExpression` determines which
 * items within the results should be returned to you. All of the other results are
 * discarded.
 *
 * A `Query` operation always returns a result set. If no matching items are
 * found, the result set will be empty. Queries that do not return results consume the
 * minimum number of read capacity units for that type of read operation.
 *
 * DynamoDB calculates the number of read capacity units consumed based on item
 * size, not on the amount of data that is returned to an application. The number of
 * capacity units consumed will be the same whether you request all of the attributes
 * (the default behavior) or just some of them (using a projection expression). The
 * number will also be the same whether or not you use a `FilterExpression`.
 *
 * `Query` results are always sorted by the sort key value. If the data type of
 * the sort key is Number, the results are returned in numeric order; otherwise, the
 * results are returned in order of UTF-8 bytes. By default, the sort order is ascending.
 * To reverse the order, set the `ScanIndexForward` parameter to false.
 *
 * A single `Query` operation will read up to the maximum number of items set
 * (if using the `Limit` parameter) or a maximum of 1 MB of data and then apply
 * any filtering to the results using `FilterExpression`. If
 * `LastEvaluatedKey` is present in the response, you will need to paginate
 * the result set. For more information, see Paginating
 * the Results in the *Amazon DynamoDB Developer Guide*.
 *
 * `FilterExpression` is applied after a `Query` finishes, but before
 * the results are returned. A `FilterExpression` cannot contain partition key
 * or sort key attributes. You need to specify those attributes in the
 * `KeyConditionExpression`.
 *
 * A `Query` operation can return an empty result set and a
 * `LastEvaluatedKey` if all the items read for the page of results are
 * filtered out.
 *
 * You can query a table, a local secondary index, or a global secondary index. For a
 * query on a table or on a local secondary index, you can set the
 * `ConsistentRead` parameter to `true` and obtain a strongly
 * consistent result. Global secondary indexes support eventually consistent reads only, so
 * do not specify `ConsistentRead` when querying a global secondary
 * index.
 */
export const query: {
  (
    input: QueryInput,
  ): Effect.Effect<
    QueryOutput,
    | InternalServerError
    | InvalidEndpointException
    | ProvisionedThroughputExceededException
    | RequestLimitExceeded
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: QueryInput,
  ) => Stream.Stream<
    QueryOutput,
    | InternalServerError
    | InvalidEndpointException
    | ProvisionedThroughputExceededException
    | RequestLimitExceeded
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: QueryInput,
  ) => Stream.Stream<
    S.Schema.Type<typeof AttributeMap>,
    | InternalServerError
    | InvalidEndpointException
    | ProvisionedThroughputExceededException
    | RequestLimitExceeded
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: QueryInput,
  output: QueryOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "ExclusiveStartKey",
    outputToken: "LastEvaluatedKey",
    items: "Items",
    pageSize: "Limit",
  } as const,
}));
/**
 * The `BatchGetItem` operation returns the attributes of one or more items
 * from one or more tables. You identify requested items by primary key.
 *
 * A single operation can retrieve up to 16 MB of data, which can contain as many as 100
 * items. `BatchGetItem` returns a partial result if the response size limit is
 * exceeded, the table's provisioned throughput is exceeded, more than 1MB per partition is
 * requested, or an internal processing failure occurs. If a partial result is returned,
 * the operation returns a value for `UnprocessedKeys`. You can use this value
 * to retry the operation starting with the next item to get.
 *
 * If you request more than 100 items, `BatchGetItem` returns a
 * `ValidationException` with the message "Too many items requested for
 * the BatchGetItem call."
 *
 * For example, if you ask to retrieve 100 items, but each individual item is 300 KB in
 * size, the system returns 52 items (so as not to exceed the 16 MB limit). It also returns
 * an appropriate `UnprocessedKeys` value so you can get the next page of
 * results. If desired, your application can include its own logic to assemble the pages of
 * results into one dataset.
 *
 * If *none* of the items can be processed due to insufficient
 * provisioned throughput on all of the tables in the request, then
 * `BatchGetItem` returns a
 * `ProvisionedThroughputExceededException`. If at least
 * one of the items is successfully processed, then
 * `BatchGetItem` completes successfully, while returning the keys of the
 * unread items in `UnprocessedKeys`.
 *
 * If DynamoDB returns any unprocessed items, you should retry the batch operation on
 * those items. However, we strongly recommend that you use an exponential
 * backoff algorithm. If you retry the batch operation immediately, the
 * underlying read or write requests can still fail due to throttling on the individual
 * tables. If you delay the batch operation using exponential backoff, the individual
 * requests in the batch are much more likely to succeed.
 *
 * For more information, see Batch Operations and Error Handling in the Amazon DynamoDB
 * Developer Guide.
 *
 * By default, `BatchGetItem` performs eventually consistent reads on every
 * table in the request. If you want strongly consistent reads instead, you can set
 * `ConsistentRead` to `true` for any or all tables.
 *
 * In order to minimize response latency, `BatchGetItem` may retrieve items in
 * parallel.
 *
 * When designing your application, keep in mind that DynamoDB does not return items in
 * any particular order. To help parse the response by item, include the primary key values
 * for the items in your request in the `ProjectionExpression` parameter.
 *
 * If a requested item does not exist, it is not returned in the result. Requests for
 * nonexistent items consume the minimum read capacity units according to the type of read.
 * For more information, see Working with Tables in the Amazon DynamoDB Developer
 * Guide.
 *
 * `BatchGetItem` will result in a `ValidationException` if the
 * same key is specified multiple times.
 */
export const batchGetItem: (
  input: BatchGetItemInput,
) => Effect.Effect<
  BatchGetItemOutput,
  | InternalServerError
  | InvalidEndpointException
  | ProvisionedThroughputExceededException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetItemInput,
  output: BatchGetItemOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This operation allows you to perform reads and singleton writes on data stored in
 * DynamoDB, using PartiQL.
 *
 * For PartiQL reads (`SELECT` statement), if the total number of processed
 * items exceeds the maximum dataset size limit of 1 MB, the read stops and results are
 * returned to the user as a `LastEvaluatedKey` value to continue the read in a
 * subsequent operation. If the filter criteria in `WHERE` clause does not match
 * any data, the read will return an empty result set.
 *
 * A single `SELECT` statement response can return up to the maximum number of
 * items (if using the Limit parameter) or a maximum of 1 MB of data (and then apply any
 * filtering to the results using `WHERE` clause). If
 * `LastEvaluatedKey` is present in the response, you need to paginate the
 * result set. If `NextToken` is present, you need to paginate the result set
 * and include `NextToken`.
 */
export const executeStatement: (
  input: ExecuteStatementInput,
) => Effect.Effect<
  ExecuteStatementOutput,
  | ConditionalCheckFailedException
  | DuplicateItemException
  | InternalServerError
  | ItemCollectionSizeLimitExceededException
  | ProvisionedThroughputExceededException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | TransactionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteStatementInput,
  output: ExecuteStatementOutput,
  errors: [
    ConditionalCheckFailedException,
    DuplicateItemException,
    InternalServerError,
    ItemCollectionSizeLimitExceededException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
    TransactionConflictException,
  ],
}));
/**
 * Deletes a single item in a table by primary key. You can perform a conditional delete
 * operation that deletes the item if it exists, or if it has an expected attribute
 * value.
 *
 * In addition to deleting an item, you can also return the item's attribute values in
 * the same operation, using the `ReturnValues` parameter.
 *
 * Unless you specify conditions, the `DeleteItem` is an idempotent operation;
 * running it multiple times on the same item or attribute does *not*
 * result in an error response.
 *
 * Conditional deletes are useful for deleting items only if specific conditions are met.
 * If those conditions are met, DynamoDB performs the delete. Otherwise, the item is not
 * deleted.
 */
export const deleteItem: (
  input: DeleteItemInput,
) => Effect.Effect<
  DeleteItemOutput,
  | ConditionalCheckFailedException
  | InternalServerError
  | InvalidEndpointException
  | ItemCollectionSizeLimitExceededException
  | ProvisionedThroughputExceededException
  | ReplicatedWriteConflictException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | TransactionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteItemInput,
  output: DeleteItemOutput,
  errors: [
    ConditionalCheckFailedException,
    InternalServerError,
    InvalidEndpointException,
    ItemCollectionSizeLimitExceededException,
    ProvisionedThroughputExceededException,
    ReplicatedWriteConflictException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
    TransactionConflictException,
  ],
}));
/**
 * Creates a new item, or replaces an old item with a new item. If an item that has the
 * same primary key as the new item already exists in the specified table, the new item
 * completely replaces the existing item. You can perform a conditional put operation (add
 * a new item if one with the specified primary key doesn't exist), or replace an existing
 * item if it has certain attribute values. You can return the item's attribute values in
 * the same operation, using the `ReturnValues` parameter.
 *
 * When you add an item, the primary key attributes are the only required attributes.
 *
 * Empty String and Binary attribute values are allowed. Attribute values of type String
 * and Binary must have a length greater than zero if the attribute is used as a key
 * attribute for a table or index. Set type attributes cannot be empty.
 *
 * Invalid Requests with empty values will be rejected with a
 * `ValidationException` exception.
 *
 * To prevent a new item from replacing an existing item, use a conditional
 * expression that contains the `attribute_not_exists` function with the
 * name of the attribute being used as the partition key for the table. Since every
 * record must contain that attribute, the `attribute_not_exists` function
 * will only succeed if no matching item exists.
 *
 * For more information about `PutItem`, see Working with
 * Items in the *Amazon DynamoDB Developer Guide*.
 */
export const putItem: (
  input: PutItemInput,
) => Effect.Effect<
  PutItemOutput,
  | ConditionalCheckFailedException
  | InternalServerError
  | InvalidEndpointException
  | ItemCollectionSizeLimitExceededException
  | ProvisionedThroughputExceededException
  | ReplicatedWriteConflictException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | TransactionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutItemInput,
  output: PutItemOutput,
  errors: [
    ConditionalCheckFailedException,
    InternalServerError,
    InvalidEndpointException,
    ItemCollectionSizeLimitExceededException,
    ProvisionedThroughputExceededException,
    ReplicatedWriteConflictException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
    TransactionConflictException,
  ],
}));
/**
 * Edits an existing item's attributes, or adds a new item to the table if it does not
 * already exist. You can put, delete, or add attribute values. You can also perform a
 * conditional update on an existing item (insert a new attribute name-value pair if it
 * doesn't exist, or replace an existing name-value pair if it has certain expected
 * attribute values).
 *
 * You can also return the item's attribute values in the same `UpdateItem`
 * operation using the `ReturnValues` parameter.
 */
export const updateItem: (
  input: UpdateItemInput,
) => Effect.Effect<
  UpdateItemOutput,
  | ConditionalCheckFailedException
  | InternalServerError
  | InvalidEndpointException
  | ItemCollectionSizeLimitExceededException
  | ProvisionedThroughputExceededException
  | ReplicatedWriteConflictException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | TransactionConflictException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateItemInput,
  output: UpdateItemOutput,
  errors: [
    ConditionalCheckFailedException,
    InternalServerError,
    InvalidEndpointException,
    ItemCollectionSizeLimitExceededException,
    ProvisionedThroughputExceededException,
    ReplicatedWriteConflictException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
    TransactionConflictException,
  ],
}));
/**
 * `TransactGetItems` is a synchronous operation that atomically retrieves
 * multiple items from one or more tables (but not from indexes) in a single account and
 * Region. A `TransactGetItems` call can contain up to 100
 * `TransactGetItem` objects, each of which contains a `Get`
 * structure that specifies an item to retrieve from a table in the account and Region. A
 * call to `TransactGetItems` cannot retrieve items from tables in more than one
 * Amazon Web Services account or Region. The aggregate size of the items in the
 * transaction cannot exceed 4 MB.
 *
 * DynamoDB rejects the entire `TransactGetItems` request if any of
 * the following is true:
 *
 * - A conflicting operation is in the process of updating an item to be
 * read.
 *
 * - There is insufficient provisioned capacity for the transaction to be
 * completed.
 *
 * - There is a user error, such as an invalid data format.
 *
 * - The aggregate size of the items in the transaction exceeded 4 MB.
 */
export const transactGetItems: (
  input: TransactGetItemsInput,
) => Effect.Effect<
  TransactGetItemsOutput,
  | InternalServerError
  | InvalidEndpointException
  | ProvisionedThroughputExceededException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | TransactionCanceledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TransactGetItemsInput,
  output: TransactGetItemsOutput,
  errors: [
    InternalServerError,
    InvalidEndpointException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
    TransactionCanceledException,
  ],
}));
/**
 * This operation allows you to perform transactional reads or writes on data stored in
 * DynamoDB, using PartiQL.
 *
 * The entire transaction must consist of either read statements or write statements,
 * you cannot mix both in one transaction. The EXISTS function is an exception and can
 * be used to check the condition of specific attributes of the item in a similar
 * manner to `ConditionCheck` in the TransactWriteItems API.
 */
export const executeTransaction: (
  input: ExecuteTransactionInput,
) => Effect.Effect<
  ExecuteTransactionOutput,
  | IdempotentParameterMismatchException
  | InternalServerError
  | ProvisionedThroughputExceededException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | TransactionCanceledException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteTransactionInput,
  output: ExecuteTransactionOutput,
  errors: [
    IdempotentParameterMismatchException,
    InternalServerError,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
    TransactionCanceledException,
    TransactionInProgressException,
  ],
}));
/**
 * `TransactWriteItems` is a synchronous write operation that groups up to 100
 * action requests. These actions can target items in different tables, but not in
 * different Amazon Web Services accounts or Regions, and no two actions can target the same
 * item. For example, you cannot both `ConditionCheck` and `Update`
 * the same item. The aggregate size of the items in the transaction cannot exceed 4
 * MB.
 *
 * The actions are completed atomically so that either all of them succeed, or all of
 * them fail. They are defined by the following objects:
 *
 * - `Put`  —   Initiates a `PutItem`
 * operation to write a new item. This structure specifies the primary key of the
 * item to be written, the name of the table to write it in, an optional condition
 * expression that must be satisfied for the write to succeed, a list of the item's
 * attributes, and a field indicating whether to retrieve the item's attributes if
 * the condition is not met.
 *
 * - `Update`  —   Initiates an `UpdateItem`
 * operation to update an existing item. This structure specifies the primary key
 * of the item to be updated, the name of the table where it resides, an optional
 * condition expression that must be satisfied for the update to succeed, an
 * expression that defines one or more attributes to be updated, and a field
 * indicating whether to retrieve the item's attributes if the condition is not
 * met.
 *
 * - `Delete`  —   Initiates a `DeleteItem`
 * operation to delete an existing item. This structure specifies the primary key
 * of the item to be deleted, the name of the table where it resides, an optional
 * condition expression that must be satisfied for the deletion to succeed, and a
 * field indicating whether to retrieve the item's attributes if the condition is
 * not met.
 *
 * - `ConditionCheck`  —   Applies a condition to an item
 * that is not being modified by the transaction. This structure specifies the
 * primary key of the item to be checked, the name of the table where it resides, a
 * condition expression that must be satisfied for the transaction to succeed, and
 * a field indicating whether to retrieve the item's attributes if the condition is
 * not met.
 *
 * DynamoDB rejects the entire `TransactWriteItems` request if any of the
 * following is true:
 *
 * - A condition in one of the condition expressions is not met.
 *
 * - An ongoing operation is in the process of updating the same item.
 *
 * - There is insufficient provisioned capacity for the transaction to be
 * completed.
 *
 * - An item size becomes too large (bigger than 400 KB), a local secondary index
 * (LSI) becomes too large, or a similar validation error occurs because of changes
 * made by the transaction.
 *
 * - The aggregate size of the items in the transaction exceeds 4 MB.
 *
 * - There is a user error, such as an invalid data format.
 */
export const transactWriteItems: (
  input: TransactWriteItemsInput,
) => Effect.Effect<
  TransactWriteItemsOutput,
  | IdempotentParameterMismatchException
  | InternalServerError
  | InvalidEndpointException
  | ProvisionedThroughputExceededException
  | RequestLimitExceeded
  | ResourceNotFoundException
  | ThrottlingException
  | TransactionCanceledException
  | TransactionInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TransactWriteItemsInput,
  output: TransactWriteItemsOutput,
  errors: [
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidEndpointException,
    ProvisionedThroughputExceededException,
    RequestLimitExceeded,
    ResourceNotFoundException,
    ThrottlingException,
    TransactionCanceledException,
    TransactionInProgressException,
  ],
}));
