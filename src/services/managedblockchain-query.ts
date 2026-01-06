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
const svc = T.AwsApiService({
  sdkId: "ManagedBlockchain Query",
  serviceShapeName: "TietonChainQueryService",
});
const auth = T.AwsAuthSigv4({ name: "managedblockchain-query" });
const ver = T.ServiceVersion("2023-05-04");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://managedblockchain-query-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://managedblockchain-query-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://managedblockchain-query.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://managedblockchain-query.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Newtypes
export type QueryTransactionHash = string;
export type QueryTransactionId = string;
export type QueryNetwork = string;
export type NextToken = string;
export type ChainAddress = string;
export type QueryTokenId = string;
export type QueryTokenStandard = string;
export type ConfirmationStatus = string;
export type ListFilteredTransactionEventsSortBy = string;
export type SortOrder = string;
export type ListTransactionsSortBy = string;
export type BlockHash = string;
export type ExecutionStatus = string;
export type QueryTransactionEventType = string;
export type ErrorType = string;
export type ExceptionMessage = string;
export type ResourceId = string;
export type ResourceType = string;
export type ServiceCode = string;
export type QuotaCode = string;
export type ValidationExceptionReason = string;

//# Schemas
export interface GetTransactionInput {
  transactionHash?: string;
  transactionId?: string;
  network: string;
}
export const GetTransactionInput = S.suspend(() =>
  S.Struct({
    transactionHash: S.optional(S.String),
    transactionId: S.optional(S.String),
    network: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-transaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTransactionInput",
}) as any as S.Schema<GetTransactionInput>;
export interface ListTransactionEventsInput {
  transactionHash?: string;
  transactionId?: string;
  network: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTransactionEventsInput = S.suspend(() =>
  S.Struct({
    transactionHash: S.optional(S.String),
    transactionId: S.optional(S.String),
    network: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-transaction-events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTransactionEventsInput",
}) as any as S.Schema<ListTransactionEventsInput>;
export type ChainAddresses = string[];
export const ChainAddresses = S.Array(S.String);
export type ConfirmationStatusIncludeList = string[];
export const ConfirmationStatusIncludeList = S.Array(S.String);
export interface TokenIdentifier {
  network: string;
  contractAddress?: string;
  tokenId?: string;
}
export const TokenIdentifier = S.suspend(() =>
  S.Struct({
    network: S.String,
    contractAddress: S.optional(S.String),
    tokenId: S.optional(S.String),
  }),
).annotations({
  identifier: "TokenIdentifier",
}) as any as S.Schema<TokenIdentifier>;
export interface OwnerIdentifier {
  address: string;
}
export const OwnerIdentifier = S.suspend(() =>
  S.Struct({ address: S.String }),
).annotations({
  identifier: "OwnerIdentifier",
}) as any as S.Schema<OwnerIdentifier>;
export interface BlockchainInstant {
  time?: Date;
}
export const BlockchainInstant = S.suspend(() =>
  S.Struct({
    time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "BlockchainInstant",
}) as any as S.Schema<BlockchainInstant>;
export interface BatchGetTokenBalanceInputItem {
  tokenIdentifier: TokenIdentifier;
  ownerIdentifier: OwnerIdentifier;
  atBlockchainInstant?: BlockchainInstant;
}
export const BatchGetTokenBalanceInputItem = S.suspend(() =>
  S.Struct({
    tokenIdentifier: TokenIdentifier,
    ownerIdentifier: OwnerIdentifier,
    atBlockchainInstant: S.optional(BlockchainInstant),
  }),
).annotations({
  identifier: "BatchGetTokenBalanceInputItem",
}) as any as S.Schema<BatchGetTokenBalanceInputItem>;
export type GetTokenBalanceInputList = BatchGetTokenBalanceInputItem[];
export const GetTokenBalanceInputList = S.Array(BatchGetTokenBalanceInputItem);
export interface ContractIdentifier {
  network: string;
  contractAddress: string;
}
export const ContractIdentifier = S.suspend(() =>
  S.Struct({ network: S.String, contractAddress: S.String }),
).annotations({
  identifier: "ContractIdentifier",
}) as any as S.Schema<ContractIdentifier>;
export interface ContractFilter {
  network: string;
  tokenStandard: string;
  deployerAddress: string;
}
export const ContractFilter = S.suspend(() =>
  S.Struct({
    network: S.String,
    tokenStandard: S.String,
    deployerAddress: S.String,
  }),
).annotations({
  identifier: "ContractFilter",
}) as any as S.Schema<ContractFilter>;
export interface AddressIdentifierFilter {
  transactionEventToAddress: ChainAddresses;
}
export const AddressIdentifierFilter = S.suspend(() =>
  S.Struct({ transactionEventToAddress: ChainAddresses }),
).annotations({
  identifier: "AddressIdentifierFilter",
}) as any as S.Schema<AddressIdentifierFilter>;
export interface TimeFilter {
  from?: BlockchainInstant;
  to?: BlockchainInstant;
}
export const TimeFilter = S.suspend(() =>
  S.Struct({
    from: S.optional(BlockchainInstant),
    to: S.optional(BlockchainInstant),
  }),
).annotations({ identifier: "TimeFilter" }) as any as S.Schema<TimeFilter>;
export interface VoutFilter {
  voutSpent: boolean;
}
export const VoutFilter = S.suspend(() =>
  S.Struct({ voutSpent: S.Boolean }),
).annotations({ identifier: "VoutFilter" }) as any as S.Schema<VoutFilter>;
export interface ConfirmationStatusFilter {
  include: ConfirmationStatusIncludeList;
}
export const ConfirmationStatusFilter = S.suspend(() =>
  S.Struct({ include: ConfirmationStatusIncludeList }),
).annotations({
  identifier: "ConfirmationStatusFilter",
}) as any as S.Schema<ConfirmationStatusFilter>;
export interface ListFilteredTransactionEventsSort {
  sortBy?: string;
  sortOrder?: string;
}
export const ListFilteredTransactionEventsSort = S.suspend(() =>
  S.Struct({ sortBy: S.optional(S.String), sortOrder: S.optional(S.String) }),
).annotations({
  identifier: "ListFilteredTransactionEventsSort",
}) as any as S.Schema<ListFilteredTransactionEventsSort>;
export interface OwnerFilter {
  address: string;
}
export const OwnerFilter = S.suspend(() =>
  S.Struct({ address: S.String }),
).annotations({ identifier: "OwnerFilter" }) as any as S.Schema<OwnerFilter>;
export interface TokenFilter {
  network: string;
  contractAddress?: string;
  tokenId?: string;
}
export const TokenFilter = S.suspend(() =>
  S.Struct({
    network: S.String,
    contractAddress: S.optional(S.String),
    tokenId: S.optional(S.String),
  }),
).annotations({ identifier: "TokenFilter" }) as any as S.Schema<TokenFilter>;
export interface ListTransactionsSort {
  sortBy?: string;
  sortOrder?: string;
}
export const ListTransactionsSort = S.suspend(() =>
  S.Struct({ sortBy: S.optional(S.String), sortOrder: S.optional(S.String) }),
).annotations({
  identifier: "ListTransactionsSort",
}) as any as S.Schema<ListTransactionsSort>;
export interface BatchGetTokenBalanceInput {
  getTokenBalanceInputs?: GetTokenBalanceInputList;
}
export const BatchGetTokenBalanceInput = S.suspend(() =>
  S.Struct({
    getTokenBalanceInputs: S.optional(GetTokenBalanceInputList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/batch-get-token-balance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetTokenBalanceInput",
}) as any as S.Schema<BatchGetTokenBalanceInput>;
export interface GetAssetContractInput {
  contractIdentifier: ContractIdentifier;
}
export const GetAssetContractInput = S.suspend(() =>
  S.Struct({ contractIdentifier: ContractIdentifier }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-asset-contract" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssetContractInput",
}) as any as S.Schema<GetAssetContractInput>;
export interface GetTokenBalanceInput {
  tokenIdentifier: TokenIdentifier;
  ownerIdentifier: OwnerIdentifier;
  atBlockchainInstant?: BlockchainInstant;
}
export const GetTokenBalanceInput = S.suspend(() =>
  S.Struct({
    tokenIdentifier: TokenIdentifier,
    ownerIdentifier: OwnerIdentifier,
    atBlockchainInstant: S.optional(BlockchainInstant),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-token-balance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTokenBalanceInput",
}) as any as S.Schema<GetTokenBalanceInput>;
export interface ListAssetContractsInput {
  contractFilter: ContractFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssetContractsInput = S.suspend(() =>
  S.Struct({
    contractFilter: ContractFilter,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-asset-contracts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetContractsInput",
}) as any as S.Schema<ListAssetContractsInput>;
export interface ListFilteredTransactionEventsInput {
  network: string;
  addressIdentifierFilter: AddressIdentifierFilter;
  timeFilter?: TimeFilter;
  voutFilter?: VoutFilter;
  confirmationStatusFilter?: ConfirmationStatusFilter;
  sort?: ListFilteredTransactionEventsSort;
  nextToken?: string;
  maxResults?: number;
}
export const ListFilteredTransactionEventsInput = S.suspend(() =>
  S.Struct({
    network: S.String,
    addressIdentifierFilter: AddressIdentifierFilter,
    timeFilter: S.optional(TimeFilter),
    voutFilter: S.optional(VoutFilter),
    confirmationStatusFilter: S.optional(ConfirmationStatusFilter),
    sort: S.optional(ListFilteredTransactionEventsSort),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-filtered-transaction-events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFilteredTransactionEventsInput",
}) as any as S.Schema<ListFilteredTransactionEventsInput>;
export interface ListTokenBalancesInput {
  ownerFilter?: OwnerFilter;
  tokenFilter: TokenFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListTokenBalancesInput = S.suspend(() =>
  S.Struct({
    ownerFilter: S.optional(OwnerFilter),
    tokenFilter: TokenFilter,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-token-balances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTokenBalancesInput",
}) as any as S.Schema<ListTokenBalancesInput>;
export interface ListTransactionsInput {
  address: string;
  network: string;
  fromBlockchainInstant?: BlockchainInstant;
  toBlockchainInstant?: BlockchainInstant;
  sort?: ListTransactionsSort;
  nextToken?: string;
  maxResults?: number;
  confirmationStatusFilter?: ConfirmationStatusFilter;
}
export const ListTransactionsInput = S.suspend(() =>
  S.Struct({
    address: S.String,
    network: S.String,
    fromBlockchainInstant: S.optional(BlockchainInstant),
    toBlockchainInstant: S.optional(BlockchainInstant),
    sort: S.optional(ListTransactionsSort),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    confirmationStatusFilter: S.optional(ConfirmationStatusFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-transactions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTransactionsInput",
}) as any as S.Schema<ListTransactionsInput>;
export interface Transaction {
  network: string;
  blockHash?: string;
  transactionHash: string;
  blockNumber?: string;
  transactionTimestamp: Date;
  transactionIndex: number;
  numberOfTransactions: number;
  to: string;
  from?: string;
  contractAddress?: string;
  gasUsed?: string;
  cumulativeGasUsed?: string;
  effectiveGasPrice?: string;
  signatureV?: number;
  signatureR?: string;
  signatureS?: string;
  transactionFee?: string;
  transactionId?: string;
  confirmationStatus?: string;
  executionStatus?: string;
}
export const Transaction = S.suspend(() =>
  S.Struct({
    network: S.String,
    blockHash: S.optional(S.String),
    transactionHash: S.String,
    blockNumber: S.optional(S.String),
    transactionTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    transactionIndex: S.Number,
    numberOfTransactions: S.Number,
    to: S.String,
    from: S.optional(S.String),
    contractAddress: S.optional(S.String),
    gasUsed: S.optional(S.String),
    cumulativeGasUsed: S.optional(S.String),
    effectiveGasPrice: S.optional(S.String),
    signatureV: S.optional(S.Number),
    signatureR: S.optional(S.String),
    signatureS: S.optional(S.String),
    transactionFee: S.optional(S.String),
    transactionId: S.optional(S.String),
    confirmationStatus: S.optional(S.String),
    executionStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Transaction" }) as any as S.Schema<Transaction>;
export interface TransactionEvent {
  network: string;
  transactionHash: string;
  eventType: string;
  from?: string;
  to?: string;
  value?: string;
  contractAddress?: string;
  tokenId?: string;
  transactionId?: string;
  voutIndex?: number;
  voutSpent?: boolean;
  spentVoutTransactionId?: string;
  spentVoutTransactionHash?: string;
  spentVoutIndex?: number;
  blockchainInstant?: BlockchainInstant;
  confirmationStatus?: string;
}
export const TransactionEvent = S.suspend(() =>
  S.Struct({
    network: S.String,
    transactionHash: S.String,
    eventType: S.String,
    from: S.optional(S.String),
    to: S.optional(S.String),
    value: S.optional(S.String),
    contractAddress: S.optional(S.String),
    tokenId: S.optional(S.String),
    transactionId: S.optional(S.String),
    voutIndex: S.optional(S.Number),
    voutSpent: S.optional(S.Boolean),
    spentVoutTransactionId: S.optional(S.String),
    spentVoutTransactionHash: S.optional(S.String),
    spentVoutIndex: S.optional(S.Number),
    blockchainInstant: S.optional(BlockchainInstant),
    confirmationStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "TransactionEvent",
}) as any as S.Schema<TransactionEvent>;
export type TransactionEventList = TransactionEvent[];
export const TransactionEventList = S.Array(TransactionEvent);
export interface GetTokenBalanceOutput {
  ownerIdentifier?: OwnerIdentifier;
  tokenIdentifier?: TokenIdentifier;
  balance: string;
  atBlockchainInstant: BlockchainInstant;
  lastUpdatedTime?: BlockchainInstant;
}
export const GetTokenBalanceOutput = S.suspend(() =>
  S.Struct({
    ownerIdentifier: S.optional(OwnerIdentifier),
    tokenIdentifier: S.optional(TokenIdentifier),
    balance: S.String,
    atBlockchainInstant: BlockchainInstant,
    lastUpdatedTime: S.optional(BlockchainInstant),
  }),
).annotations({
  identifier: "GetTokenBalanceOutput",
}) as any as S.Schema<GetTokenBalanceOutput>;
export interface GetTransactionOutput {
  transaction: Transaction;
}
export const GetTransactionOutput = S.suspend(() =>
  S.Struct({ transaction: Transaction }),
).annotations({
  identifier: "GetTransactionOutput",
}) as any as S.Schema<GetTransactionOutput>;
export interface ListFilteredTransactionEventsOutput {
  events: TransactionEventList;
  nextToken?: string;
}
export const ListFilteredTransactionEventsOutput = S.suspend(() =>
  S.Struct({ events: TransactionEventList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFilteredTransactionEventsOutput",
}) as any as S.Schema<ListFilteredTransactionEventsOutput>;
export interface ListTransactionEventsOutput {
  events: TransactionEventList;
  nextToken?: string;
}
export const ListTransactionEventsOutput = S.suspend(() =>
  S.Struct({ events: TransactionEventList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTransactionEventsOutput",
}) as any as S.Schema<ListTransactionEventsOutput>;
export interface BatchGetTokenBalanceOutputItem {
  ownerIdentifier?: OwnerIdentifier;
  tokenIdentifier?: TokenIdentifier;
  balance: string;
  atBlockchainInstant: BlockchainInstant;
  lastUpdatedTime?: BlockchainInstant;
}
export const BatchGetTokenBalanceOutputItem = S.suspend(() =>
  S.Struct({
    ownerIdentifier: S.optional(OwnerIdentifier),
    tokenIdentifier: S.optional(TokenIdentifier),
    balance: S.String,
    atBlockchainInstant: BlockchainInstant,
    lastUpdatedTime: S.optional(BlockchainInstant),
  }),
).annotations({
  identifier: "BatchGetTokenBalanceOutputItem",
}) as any as S.Schema<BatchGetTokenBalanceOutputItem>;
export type BatchGetTokenBalanceOutputList = BatchGetTokenBalanceOutputItem[];
export const BatchGetTokenBalanceOutputList = S.Array(
  BatchGetTokenBalanceOutputItem,
);
export interface BatchGetTokenBalanceErrorItem {
  tokenIdentifier?: TokenIdentifier;
  ownerIdentifier?: OwnerIdentifier;
  atBlockchainInstant?: BlockchainInstant;
  errorCode: string;
  errorMessage: string;
  errorType: string;
}
export const BatchGetTokenBalanceErrorItem = S.suspend(() =>
  S.Struct({
    tokenIdentifier: S.optional(TokenIdentifier),
    ownerIdentifier: S.optional(OwnerIdentifier),
    atBlockchainInstant: S.optional(BlockchainInstant),
    errorCode: S.String,
    errorMessage: S.String,
    errorType: S.String,
  }),
).annotations({
  identifier: "BatchGetTokenBalanceErrorItem",
}) as any as S.Schema<BatchGetTokenBalanceErrorItem>;
export type BatchGetTokenBalanceErrors = BatchGetTokenBalanceErrorItem[];
export const BatchGetTokenBalanceErrors = S.Array(
  BatchGetTokenBalanceErrorItem,
);
export interface ContractMetadata {
  name?: string;
  symbol?: string;
  decimals?: number;
}
export const ContractMetadata = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    symbol: S.optional(S.String),
    decimals: S.optional(S.Number),
  }),
).annotations({
  identifier: "ContractMetadata",
}) as any as S.Schema<ContractMetadata>;
export interface AssetContract {
  contractIdentifier: ContractIdentifier;
  tokenStandard: string;
  deployerAddress: string;
}
export const AssetContract = S.suspend(() =>
  S.Struct({
    contractIdentifier: ContractIdentifier,
    tokenStandard: S.String,
    deployerAddress: S.String,
  }),
).annotations({
  identifier: "AssetContract",
}) as any as S.Schema<AssetContract>;
export type AssetContractList = AssetContract[];
export const AssetContractList = S.Array(AssetContract);
export interface TokenBalance {
  ownerIdentifier?: OwnerIdentifier;
  tokenIdentifier?: TokenIdentifier;
  balance: string;
  atBlockchainInstant: BlockchainInstant;
  lastUpdatedTime?: BlockchainInstant;
}
export const TokenBalance = S.suspend(() =>
  S.Struct({
    ownerIdentifier: S.optional(OwnerIdentifier),
    tokenIdentifier: S.optional(TokenIdentifier),
    balance: S.String,
    atBlockchainInstant: BlockchainInstant,
    lastUpdatedTime: S.optional(BlockchainInstant),
  }),
).annotations({ identifier: "TokenBalance" }) as any as S.Schema<TokenBalance>;
export type TokenBalanceList = TokenBalance[];
export const TokenBalanceList = S.Array(TokenBalance);
export interface TransactionOutputItem {
  transactionHash: string;
  transactionId?: string;
  network: string;
  transactionTimestamp: Date;
  confirmationStatus?: string;
}
export const TransactionOutputItem = S.suspend(() =>
  S.Struct({
    transactionHash: S.String,
    transactionId: S.optional(S.String),
    network: S.String,
    transactionTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    confirmationStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "TransactionOutputItem",
}) as any as S.Schema<TransactionOutputItem>;
export type TransactionOutputList = TransactionOutputItem[];
export const TransactionOutputList = S.Array(TransactionOutputItem);
export interface BatchGetTokenBalanceOutput {
  tokenBalances: BatchGetTokenBalanceOutputList;
  errors: BatchGetTokenBalanceErrors;
}
export const BatchGetTokenBalanceOutput = S.suspend(() =>
  S.Struct({
    tokenBalances: BatchGetTokenBalanceOutputList,
    errors: BatchGetTokenBalanceErrors,
  }),
).annotations({
  identifier: "BatchGetTokenBalanceOutput",
}) as any as S.Schema<BatchGetTokenBalanceOutput>;
export interface GetAssetContractOutput {
  contractIdentifier: ContractIdentifier;
  tokenStandard: string;
  deployerAddress: string;
  metadata?: ContractMetadata;
}
export const GetAssetContractOutput = S.suspend(() =>
  S.Struct({
    contractIdentifier: ContractIdentifier,
    tokenStandard: S.String,
    deployerAddress: S.String,
    metadata: S.optional(ContractMetadata),
  }),
).annotations({
  identifier: "GetAssetContractOutput",
}) as any as S.Schema<GetAssetContractOutput>;
export interface ListAssetContractsOutput {
  contracts: AssetContractList;
  nextToken?: string;
}
export const ListAssetContractsOutput = S.suspend(() =>
  S.Struct({ contracts: AssetContractList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAssetContractsOutput",
}) as any as S.Schema<ListAssetContractsOutput>;
export interface ListTokenBalancesOutput {
  tokenBalances: TokenBalanceList;
  nextToken?: string;
}
export const ListTokenBalancesOutput = S.suspend(() =>
  S.Struct({
    tokenBalances: TokenBalanceList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTokenBalancesOutput",
}) as any as S.Schema<ListTokenBalancesOutput>;
export interface ListTransactionsOutput {
  transactions: TransactionOutputList;
  nextToken?: string;
}
export const ListTransactionsOutput = S.suspend(() =>
  S.Struct({
    transactions: TransactionOutputList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTransactionsOutput",
}) as any as S.Schema<ListTransactionsOutput>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all the contracts for a given contract type deployed by an address
 * (either a contract address or a wallet address).
 *
 * The Bitcoin blockchain networks do not support this
 * operation.
 */
export const listAssetContracts: {
  (
    input: ListAssetContractsInput,
  ): Effect.Effect<
    ListAssetContractsOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetContractsInput,
  ) => Stream.Stream<
    ListAssetContractsOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetContractsInput,
  ) => Stream.Stream<
    AssetContract,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetContractsInput,
  output: ListAssetContractsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "contracts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the details of a transaction.
 *
 * This action will return transaction details for all transactions
 * that are *confirmed* on the blockchain, even if they have not reached
 * finality.
 */
export const getTransaction: (
  input: GetTransactionInput,
) => Effect.Effect<
  GetTransactionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTransactionInput,
  output: GetTransactionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the token balance for a batch of tokens by using the `BatchGetTokenBalance`
 * action for every token in the request.
 *
 * Only the native tokens BTC and ETH, and the ERC-20,
 * ERC-721, and ERC 1155 token standards are supported.
 */
export const batchGetTokenBalance: (
  input: BatchGetTokenBalanceInput,
) => Effect.Effect<
  BatchGetTokenBalanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetTokenBalanceInput,
  output: BatchGetTokenBalanceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the information about a specific contract deployed on the blockchain.
 *
 * - The Bitcoin blockchain networks do not support this
 * operation.
 *
 * - Metadata is currently only available for some `ERC-20` contracts.
 * Metadata will be available for additional contracts in the future.
 */
export const getAssetContract: (
  input: GetAssetContractInput,
) => Effect.Effect<
  GetAssetContractOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetContractInput,
  output: GetAssetContractOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This action returns the following for a given blockchain network:
 *
 * - Lists all token balances owned by an address (either a contract
 * address or a wallet address).
 *
 * - Lists all token balances for all tokens created by a contract.
 *
 * - Lists all token balances for a given token.
 *
 * You must always specify the network property of
 * the `tokenFilter` when using this operation.
 */
export const listTokenBalances: {
  (
    input: ListTokenBalancesInput,
  ): Effect.Effect<
    ListTokenBalancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTokenBalancesInput,
  ) => Stream.Stream<
    ListTokenBalancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTokenBalancesInput,
  ) => Stream.Stream<
    TokenBalance,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTokenBalancesInput,
  output: ListTokenBalancesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tokenBalances",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the transaction events for a transaction.
 */
export const listTransactions: {
  (
    input: ListTransactionsInput,
  ): Effect.Effect<
    ListTransactionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTransactionsInput,
  ) => Stream.Stream<
    ListTransactionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTransactionsInput,
  ) => Stream.Stream<
    TransactionOutputItem,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTransactionsInput,
  output: ListTransactionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "transactions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the transaction events for an address on the blockchain.
 *
 * This operation is only supported on the Bitcoin networks.
 */
export const listFilteredTransactionEvents: {
  (
    input: ListFilteredTransactionEventsInput,
  ): Effect.Effect<
    ListFilteredTransactionEventsOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFilteredTransactionEventsInput,
  ) => Stream.Stream<
    ListFilteredTransactionEventsOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFilteredTransactionEventsInput,
  ) => Stream.Stream<
    TransactionEvent,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFilteredTransactionEventsInput,
  output: ListFilteredTransactionEventsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "events",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the transaction events for a transaction
 *
 * This action will return transaction details for all transactions
 * that are *confirmed* on the blockchain, even if they have not reached
 * finality.
 */
export const listTransactionEvents: {
  (
    input: ListTransactionEventsInput,
  ): Effect.Effect<
    ListTransactionEventsOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTransactionEventsInput,
  ) => Stream.Stream<
    ListTransactionEventsOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTransactionEventsInput,
  ) => Stream.Stream<
    TransactionEvent,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTransactionEventsInput,
  output: ListTransactionEventsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "events",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the balance of a specific token, including native tokens, for a given address (wallet or contract) on the blockchain.
 *
 * Only the native tokens BTC and ETH, and the ERC-20,
 * ERC-721, and ERC 1155 token standards are supported.
 */
export const getTokenBalance: (
  input: GetTokenBalanceInput,
) => Effect.Effect<
  GetTokenBalanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTokenBalanceInput,
  output: GetTokenBalanceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
