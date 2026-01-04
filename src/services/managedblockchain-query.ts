import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export class GetTransactionInput extends S.Class<GetTransactionInput>(
  "GetTransactionInput",
)(
  {
    transactionHash: S.optional(S.String),
    transactionId: S.optional(S.String),
    network: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/get-transaction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTransactionEventsInput extends S.Class<ListTransactionEventsInput>(
  "ListTransactionEventsInput",
)(
  {
    transactionHash: S.optional(S.String),
    transactionId: S.optional(S.String),
    network: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-transaction-events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ChainAddresses = S.Array(S.String);
export const ConfirmationStatusIncludeList = S.Array(S.String);
export class TokenIdentifier extends S.Class<TokenIdentifier>(
  "TokenIdentifier",
)({
  network: S.String,
  contractAddress: S.optional(S.String),
  tokenId: S.optional(S.String),
}) {}
export class OwnerIdentifier extends S.Class<OwnerIdentifier>(
  "OwnerIdentifier",
)({ address: S.String }) {}
export class BlockchainInstant extends S.Class<BlockchainInstant>(
  "BlockchainInstant",
)({ time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))) }) {}
export class BatchGetTokenBalanceInputItem extends S.Class<BatchGetTokenBalanceInputItem>(
  "BatchGetTokenBalanceInputItem",
)({
  tokenIdentifier: TokenIdentifier,
  ownerIdentifier: OwnerIdentifier,
  atBlockchainInstant: S.optional(BlockchainInstant),
}) {}
export const GetTokenBalanceInputList = S.Array(BatchGetTokenBalanceInputItem);
export class ContractIdentifier extends S.Class<ContractIdentifier>(
  "ContractIdentifier",
)({ network: S.String, contractAddress: S.String }) {}
export class ContractFilter extends S.Class<ContractFilter>("ContractFilter")({
  network: S.String,
  tokenStandard: S.String,
  deployerAddress: S.String,
}) {}
export class AddressIdentifierFilter extends S.Class<AddressIdentifierFilter>(
  "AddressIdentifierFilter",
)({ transactionEventToAddress: ChainAddresses }) {}
export class TimeFilter extends S.Class<TimeFilter>("TimeFilter")({
  from: S.optional(BlockchainInstant),
  to: S.optional(BlockchainInstant),
}) {}
export class VoutFilter extends S.Class<VoutFilter>("VoutFilter")({
  voutSpent: S.Boolean,
}) {}
export class ConfirmationStatusFilter extends S.Class<ConfirmationStatusFilter>(
  "ConfirmationStatusFilter",
)({ include: ConfirmationStatusIncludeList }) {}
export class ListFilteredTransactionEventsSort extends S.Class<ListFilteredTransactionEventsSort>(
  "ListFilteredTransactionEventsSort",
)({ sortBy: S.optional(S.String), sortOrder: S.optional(S.String) }) {}
export class OwnerFilter extends S.Class<OwnerFilter>("OwnerFilter")({
  address: S.String,
}) {}
export class TokenFilter extends S.Class<TokenFilter>("TokenFilter")({
  network: S.String,
  contractAddress: S.optional(S.String),
  tokenId: S.optional(S.String),
}) {}
export class ListTransactionsSort extends S.Class<ListTransactionsSort>(
  "ListTransactionsSort",
)({ sortBy: S.optional(S.String), sortOrder: S.optional(S.String) }) {}
export class BatchGetTokenBalanceInput extends S.Class<BatchGetTokenBalanceInput>(
  "BatchGetTokenBalanceInput",
)(
  { getTokenBalanceInputs: S.optional(GetTokenBalanceInputList) },
  T.all(
    T.Http({ method: "POST", uri: "/batch-get-token-balance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssetContractInput extends S.Class<GetAssetContractInput>(
  "GetAssetContractInput",
)(
  { contractIdentifier: ContractIdentifier },
  T.all(
    T.Http({ method: "POST", uri: "/get-asset-contract" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTokenBalanceInput extends S.Class<GetTokenBalanceInput>(
  "GetTokenBalanceInput",
)(
  {
    tokenIdentifier: TokenIdentifier,
    ownerIdentifier: OwnerIdentifier,
    atBlockchainInstant: S.optional(BlockchainInstant),
  },
  T.all(
    T.Http({ method: "POST", uri: "/get-token-balance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetContractsInput extends S.Class<ListAssetContractsInput>(
  "ListAssetContractsInput",
)(
  {
    contractFilter: ContractFilter,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-asset-contracts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFilteredTransactionEventsInput extends S.Class<ListFilteredTransactionEventsInput>(
  "ListFilteredTransactionEventsInput",
)(
  {
    network: S.String,
    addressIdentifierFilter: AddressIdentifierFilter,
    timeFilter: S.optional(TimeFilter),
    voutFilter: S.optional(VoutFilter),
    confirmationStatusFilter: S.optional(ConfirmationStatusFilter),
    sort: S.optional(ListFilteredTransactionEventsSort),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-filtered-transaction-events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTokenBalancesInput extends S.Class<ListTokenBalancesInput>(
  "ListTokenBalancesInput",
)(
  {
    ownerFilter: S.optional(OwnerFilter),
    tokenFilter: TokenFilter,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-token-balances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTransactionsInput extends S.Class<ListTransactionsInput>(
  "ListTransactionsInput",
)(
  {
    address: S.String,
    network: S.String,
    fromBlockchainInstant: S.optional(BlockchainInstant),
    toBlockchainInstant: S.optional(BlockchainInstant),
    sort: S.optional(ListTransactionsSort),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    confirmationStatusFilter: S.optional(ConfirmationStatusFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-transactions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Transaction extends S.Class<Transaction>("Transaction")({
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
}) {}
export class TransactionEvent extends S.Class<TransactionEvent>(
  "TransactionEvent",
)({
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
}) {}
export const TransactionEventList = S.Array(TransactionEvent);
export class GetTokenBalanceOutput extends S.Class<GetTokenBalanceOutput>(
  "GetTokenBalanceOutput",
)({
  ownerIdentifier: S.optional(OwnerIdentifier),
  tokenIdentifier: S.optional(TokenIdentifier),
  balance: S.String,
  atBlockchainInstant: BlockchainInstant,
  lastUpdatedTime: S.optional(BlockchainInstant),
}) {}
export class GetTransactionOutput extends S.Class<GetTransactionOutput>(
  "GetTransactionOutput",
)({ transaction: Transaction }) {}
export class ListFilteredTransactionEventsOutput extends S.Class<ListFilteredTransactionEventsOutput>(
  "ListFilteredTransactionEventsOutput",
)({ events: TransactionEventList, nextToken: S.optional(S.String) }) {}
export class ListTransactionEventsOutput extends S.Class<ListTransactionEventsOutput>(
  "ListTransactionEventsOutput",
)({ events: TransactionEventList, nextToken: S.optional(S.String) }) {}
export class BatchGetTokenBalanceOutputItem extends S.Class<BatchGetTokenBalanceOutputItem>(
  "BatchGetTokenBalanceOutputItem",
)({
  ownerIdentifier: S.optional(OwnerIdentifier),
  tokenIdentifier: S.optional(TokenIdentifier),
  balance: S.String,
  atBlockchainInstant: BlockchainInstant,
  lastUpdatedTime: S.optional(BlockchainInstant),
}) {}
export const BatchGetTokenBalanceOutputList = S.Array(
  BatchGetTokenBalanceOutputItem,
);
export class BatchGetTokenBalanceErrorItem extends S.Class<BatchGetTokenBalanceErrorItem>(
  "BatchGetTokenBalanceErrorItem",
)({
  tokenIdentifier: S.optional(TokenIdentifier),
  ownerIdentifier: S.optional(OwnerIdentifier),
  atBlockchainInstant: S.optional(BlockchainInstant),
  errorCode: S.String,
  errorMessage: S.String,
  errorType: S.String,
}) {}
export const BatchGetTokenBalanceErrors = S.Array(
  BatchGetTokenBalanceErrorItem,
);
export class ContractMetadata extends S.Class<ContractMetadata>(
  "ContractMetadata",
)({
  name: S.optional(S.String),
  symbol: S.optional(S.String),
  decimals: S.optional(S.Number),
}) {}
export class AssetContract extends S.Class<AssetContract>("AssetContract")({
  contractIdentifier: ContractIdentifier,
  tokenStandard: S.String,
  deployerAddress: S.String,
}) {}
export const AssetContractList = S.Array(AssetContract);
export class TokenBalance extends S.Class<TokenBalance>("TokenBalance")({
  ownerIdentifier: S.optional(OwnerIdentifier),
  tokenIdentifier: S.optional(TokenIdentifier),
  balance: S.String,
  atBlockchainInstant: BlockchainInstant,
  lastUpdatedTime: S.optional(BlockchainInstant),
}) {}
export const TokenBalanceList = S.Array(TokenBalance);
export class TransactionOutputItem extends S.Class<TransactionOutputItem>(
  "TransactionOutputItem",
)({
  transactionHash: S.String,
  transactionId: S.optional(S.String),
  network: S.String,
  transactionTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  confirmationStatus: S.optional(S.String),
}) {}
export const TransactionOutputList = S.Array(TransactionOutputItem);
export class BatchGetTokenBalanceOutput extends S.Class<BatchGetTokenBalanceOutput>(
  "BatchGetTokenBalanceOutput",
)({
  tokenBalances: BatchGetTokenBalanceOutputList,
  errors: BatchGetTokenBalanceErrors,
}) {}
export class GetAssetContractOutput extends S.Class<GetAssetContractOutput>(
  "GetAssetContractOutput",
)({
  contractIdentifier: ContractIdentifier,
  tokenStandard: S.String,
  deployerAddress: S.String,
  metadata: S.optional(ContractMetadata),
}) {}
export class ListAssetContractsOutput extends S.Class<ListAssetContractsOutput>(
  "ListAssetContractsOutput",
)({ contracts: AssetContractList, nextToken: S.optional(S.String) }) {}
export class ListTokenBalancesOutput extends S.Class<ListTokenBalancesOutput>(
  "ListTokenBalancesOutput",
)({ tokenBalances: TokenBalanceList, nextToken: S.optional(S.String) }) {}
export class ListTransactionsOutput extends S.Class<ListTransactionsOutput>(
  "ListTransactionsOutput",
)({ transactions: TransactionOutputList, nextToken: S.optional(S.String) }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}

//# Operations
/**
 * Gets the balance of a specific token, including native tokens, for a given address (wallet or contract) on the blockchain.
 *
 * Only the native tokens BTC and ETH, and the ERC-20,
 * ERC-721, and ERC 1155 token standards are supported.
 */
export const getTokenBalance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Gets the details of a transaction.
 *
 * This action will return transaction details for all transactions
 * that are *confirmed* on the blockchain, even if they have not reached
 * finality.
 */
export const getTransaction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all the contracts for a given contract type deployed by an address
 * (either a contract address or a wallet address).
 *
 * The Bitcoin blockchain networks do not support this
 * operation.
 */
export const listAssetContracts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssetContractsInput,
  output: ListAssetContractsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the transaction events for an address on the blockchain.
 *
 * This operation is only supported on the Bitcoin networks.
 */
export const listFilteredTransactionEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListFilteredTransactionEventsInput,
    output: ListFilteredTransactionEventsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
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
export const listTokenBalances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTokenBalancesInput,
  output: ListTokenBalancesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the transaction events for a transaction
 *
 * This action will return transaction details for all transactions
 * that are *confirmed* on the blockchain, even if they have not reached
 * finality.
 */
export const listTransactionEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTransactionEventsInput,
    output: ListTransactionEventsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all the transaction events for a transaction.
 */
export const listTransactions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTransactionsInput,
  output: ListTransactionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
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
export const batchGetTokenBalance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Gets the information about a specific contract deployed on the blockchain.
 *
 * - The Bitcoin blockchain networks do not support this
 * operation.
 *
 * - Metadata is currently only available for some `ERC-20` contracts.
 * Metadata will be available for additional contracts in the future.
 */
export const getAssetContract = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
