import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials as Creds } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://awss3control.amazonaws.com/doc/2018-08-20/");
const svc = T.AwsApiService({
  sdkId: "S3 Control",
  serviceShapeName: "AWSS3ControlServiceV20180820",
});
const auth = T.AwsAuthSigv4({ name: "s3" });
const ver = T.ServiceVersion("2018-08-20");
const proto = T.AwsProtocolsRestXml();
const rules = T.EndpointResolver((p, _) => {
  const {
    Region,
    UseFIPS = false,
    UseDualStack = false,
    Endpoint,
    AccountId,
    RequiresAccountId,
    OutpostId,
    Bucket,
    AccessPointName,
    UseArnRegion,
    ResourceArn,
    UseS3ExpressControlEndpoint,
  } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3-outposts",
        signingRegion: `${_0}`,
      },
    ],
  });
  const _p1 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3express",
        signingRegion: `${_0}`,
      },
    ],
  });
  const _p2 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3",
        signingRegion: `${_0}`,
      },
    ],
  });
  const _p3 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3-outposts",
        signingRegion: `${_.getAttr(_0, "region")}`,
      },
    ],
  });
  if (Region != null) {
    {
      const partitionResult = _.partition(Region);
      if (
        UseFIPS === true &&
        partitionResult != null &&
        partitionResult !== false &&
        _.getAttr(partitionResult, "name") === "aws-cn"
      ) {
        return err("Partition does not support FIPS");
      }
    }
    if (OutpostId != null) {
      {
        const partitionResult = _.partition(Region);
        if (partitionResult != null && partitionResult !== false) {
          if (
            RequiresAccountId != null &&
            RequiresAccountId === true &&
            !(AccountId != null)
          ) {
            return err("AccountId is required but not set");
          }
          if (AccountId != null && !_.isValidHostLabel(AccountId, false)) {
            return err("AccountId must only contain a-z, A-Z, 0-9 and `-`.");
          }
          if (!_.isValidHostLabel(OutpostId, false)) {
            return err("OutpostId must only contain a-z, A-Z, 0-9 and `-`.");
          }
          if (Endpoint != null && UseDualStack === true) {
            return err(
              "Invalid Configuration: DualStack and custom endpoint are not supported",
            );
          }
          if (_.isValidHostLabel(Region, true)) {
            {
              const url = _.parseURL(Endpoint);
              if (Endpoint != null && url != null && url !== false) {
                return e(
                  `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p0(Region),
                  {},
                );
              }
            }
            if (UseFIPS === true && UseDualStack === true) {
              return e(
                `https://s3-outposts-fips.${Region}.${_.getAttr(partitionResult, "dualStackDnsSuffix")}`,
                _p0(Region),
                {},
              );
            }
            if (UseFIPS === true) {
              return e(
                `https://s3-outposts-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p0(Region),
                {},
              );
            }
            if (UseDualStack === true) {
              return e(
                `https://s3-outposts.${Region}.${_.getAttr(partitionResult, "dualStackDnsSuffix")}`,
                _p0(Region),
                {},
              );
            }
            return e(
              `https://s3-outposts.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p0(Region),
              {},
            );
          }
          return err("Invalid region: region was not a valid DNS name.");
        }
      }
    }
    {
      const resourceArn = _.parseArn(ResourceArn);
      if (
        ResourceArn != null &&
        resourceArn != null &&
        resourceArn !== false &&
        _.getAttr(resourceArn, "service") === "s3express"
      ) {
        {
          const partitionResult = _.partition(Region);
          if (partitionResult != null && partitionResult !== false) {
            {
              const arnPartition = _.partition(
                _.getAttr(resourceArn, "region"),
              );
              if (arnPartition != null && arnPartition !== false) {
                if (
                  _.getAttr(arnPartition, "name") ===
                  _.getAttr(partitionResult, "name")
                ) {
                  if (
                    UseArnRegion != null &&
                    UseArnRegion === false &&
                    !(_.getAttr(resourceArn, "region") === `${Region}`)
                  ) {
                    return err(
                      `Invalid configuration: region from ARN \`${_.getAttr(resourceArn, "region")}\` does not match client region \`${Region}\` and UseArnRegion is \`false\``,
                    );
                  }
                  if (Endpoint != null && UseDualStack === true) {
                    return err(
                      "Invalid Configuration: DualStack and custom endpoint are not supported",
                    );
                  }
                  if (UseDualStack === true) {
                    return err("S3Express does not support Dual-stack.");
                  }
                  {
                    const url = _.parseURL(Endpoint);
                    if (Endpoint != null && url != null && url !== false) {
                      return e(
                        `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}`,
                        _p1(Region),
                        {},
                      );
                    }
                  }
                  if (UseFIPS === true) {
                    return e(
                      `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  return e(
                    `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                    _p1(Region),
                    {},
                  );
                }
                return err(
                  `Client was configured for partition \`${_.getAttr(partitionResult, "name")}\` but ARN has \`${_.getAttr(arnPartition, "name")}\``,
                );
              }
            }
          }
        }
      }
    }
    {
      const accessPointSuffix = _.substring(AccessPointName, 0, 7, true);
      if (
        AccessPointName != null &&
        accessPointSuffix != null &&
        accessPointSuffix !== false &&
        accessPointSuffix === "--xa-s3"
      ) {
        {
          const partitionResult = _.partition(Region);
          if (partitionResult != null && partitionResult !== false) {
            if (Endpoint != null && UseDualStack === true) {
              return err(
                "Invalid Configuration: DualStack and custom endpoint are not supported",
              );
            }
            if (UseDualStack === true) {
              return err("S3Express does not support Dual-stack.");
            }
            {
              const url = _.parseURL(Endpoint);
              if (Endpoint != null && url != null && url !== false) {
                return e(
                  `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}`,
                  _p1(Region),
                  {},
                );
              }
            }
            {
              const s3expressAvailabilityZoneId = _.substring(
                AccessPointName,
                7,
                15,
                true,
              );
              const s3expressAvailabilityZoneDelim = _.substring(
                AccessPointName,
                15,
                17,
                true,
              );
              if (
                s3expressAvailabilityZoneId != null &&
                s3expressAvailabilityZoneId !== false &&
                s3expressAvailabilityZoneDelim != null &&
                s3expressAvailabilityZoneDelim !== false &&
                s3expressAvailabilityZoneDelim === "--"
              ) {
                if (UseFIPS === true) {
                  return e(
                    `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                    _p1(Region),
                    {},
                  );
                }
                return e(
                  `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p1(Region),
                  {},
                );
              }
            }
            {
              const s3expressAvailabilityZoneId = _.substring(
                AccessPointName,
                7,
                16,
                true,
              );
              const s3expressAvailabilityZoneDelim = _.substring(
                AccessPointName,
                16,
                18,
                true,
              );
              if (
                s3expressAvailabilityZoneId != null &&
                s3expressAvailabilityZoneId !== false &&
                s3expressAvailabilityZoneDelim != null &&
                s3expressAvailabilityZoneDelim !== false &&
                s3expressAvailabilityZoneDelim === "--"
              ) {
                if (UseFIPS === true) {
                  return e(
                    `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                    _p1(Region),
                    {},
                  );
                }
                return e(
                  `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p1(Region),
                  {},
                );
              }
            }
            {
              const s3expressAvailabilityZoneId = _.substring(
                AccessPointName,
                7,
                20,
                true,
              );
              const s3expressAvailabilityZoneDelim = _.substring(
                AccessPointName,
                20,
                22,
                true,
              );
              if (
                s3expressAvailabilityZoneId != null &&
                s3expressAvailabilityZoneId !== false &&
                s3expressAvailabilityZoneDelim != null &&
                s3expressAvailabilityZoneDelim !== false &&
                s3expressAvailabilityZoneDelim === "--"
              ) {
                if (UseFIPS === true) {
                  return e(
                    `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                    _p1(Region),
                    {},
                  );
                }
                return e(
                  `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p1(Region),
                  {},
                );
              }
            }
            {
              const s3expressAvailabilityZoneId = _.substring(
                AccessPointName,
                7,
                21,
                true,
              );
              const s3expressAvailabilityZoneDelim = _.substring(
                AccessPointName,
                21,
                23,
                true,
              );
              if (
                s3expressAvailabilityZoneId != null &&
                s3expressAvailabilityZoneId !== false &&
                s3expressAvailabilityZoneDelim != null &&
                s3expressAvailabilityZoneDelim !== false &&
                s3expressAvailabilityZoneDelim === "--"
              ) {
                if (UseFIPS === true) {
                  return e(
                    `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                    _p1(Region),
                    {},
                  );
                }
                return e(
                  `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p1(Region),
                  {},
                );
              }
            }
            {
              const s3expressAvailabilityZoneId = _.substring(
                AccessPointName,
                7,
                27,
                true,
              );
              const s3expressAvailabilityZoneDelim = _.substring(
                AccessPointName,
                27,
                29,
                true,
              );
              if (
                s3expressAvailabilityZoneId != null &&
                s3expressAvailabilityZoneId !== false &&
                s3expressAvailabilityZoneDelim != null &&
                s3expressAvailabilityZoneDelim !== false &&
                s3expressAvailabilityZoneDelim === "--"
              ) {
                if (UseFIPS === true) {
                  return e(
                    `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                    _p1(Region),
                    {},
                  );
                }
                return e(
                  `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p1(Region),
                  {},
                );
              }
            }
            return err("Unrecognized S3Express Access Point name format.");
          }
        }
      }
    }
    if (
      UseS3ExpressControlEndpoint != null &&
      UseS3ExpressControlEndpoint === true
    ) {
      {
        const partitionResult = _.partition(Region);
        if (partitionResult != null && partitionResult !== false) {
          if (Endpoint != null && UseDualStack === true) {
            return err(
              "Invalid Configuration: DualStack and custom endpoint are not supported",
            );
          }
          if (UseDualStack === true) {
            return err("S3Express does not support Dual-stack.");
          }
          {
            const url = _.parseURL(Endpoint);
            if (Endpoint != null && url != null && url !== false) {
              return e(
                `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}`,
                _p1(Region),
                {},
              );
            }
          }
          if (UseFIPS === true) {
            return e(
              `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p1(Region),
              {},
            );
          }
          return e(
            `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
            _p1(Region),
            {},
          );
        }
      }
    }
    {
      const url = _.parseURL(Endpoint);
      if (
        Region === "snow" &&
        Endpoint != null &&
        url != null &&
        url !== false
      ) {
        {
          const partitionResult = _.partition(Region);
          if (partitionResult != null && partitionResult !== false) {
            if (UseDualStack === true) {
              return err("S3 Snow does not support DualStack");
            }
            if (UseFIPS === true) {
              return err("S3 Snow does not support FIPS");
            }
            return e(
              `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}`,
              _p2(Region),
              {},
            );
          }
        }
      }
    }
    {
      const accessPointArn = _.parseArn(AccessPointName);
      if (
        AccessPointName != null &&
        accessPointArn != null &&
        accessPointArn !== false
      ) {
        {
          const arnType = _.getAttr(accessPointArn, "resourceId[0]");
          if (arnType != null && arnType !== false && !(arnType === "")) {
            if (_.getAttr(accessPointArn, "service") === "s3-outposts") {
              {
                const outpostId = _.getAttr(accessPointArn, "resourceId[1]");
                if (outpostId != null && outpostId !== false) {
                  if (_.isValidHostLabel(outpostId, false)) {
                    if (Endpoint != null && UseDualStack === true) {
                      return err(
                        "Invalid Configuration: DualStack and custom endpoint are not supported",
                      );
                    }
                    if (
                      UseArnRegion != null &&
                      UseArnRegion === false &&
                      !(_.getAttr(accessPointArn, "region") === `${Region}`)
                    ) {
                      return err(
                        `Invalid configuration: region from ARN \`${_.getAttr(accessPointArn, "region")}\` does not match client region \`${Region}\` and UseArnRegion is \`false\``,
                      );
                    }
                    {
                      const partitionResult = _.partition(Region);
                      if (
                        partitionResult != null &&
                        partitionResult !== false
                      ) {
                        {
                          const arnPartition = _.partition(
                            _.getAttr(accessPointArn, "region"),
                          );
                          if (arnPartition != null && arnPartition !== false) {
                            if (
                              _.getAttr(arnPartition, "name") ===
                              _.getAttr(partitionResult, "name")
                            ) {
                              if (
                                _.isValidHostLabel(
                                  _.getAttr(accessPointArn, "region"),
                                  true,
                                )
                              ) {
                                if (
                                  !(
                                    _.getAttr(accessPointArn, "accountId") ===
                                    ""
                                  )
                                ) {
                                  if (
                                    _.isValidHostLabel(
                                      _.getAttr(accessPointArn, "accountId"),
                                      false,
                                    )
                                  ) {
                                    if (
                                      AccountId != null &&
                                      !(
                                        AccountId ===
                                        `${_.getAttr(accessPointArn, "accountId")}`
                                      )
                                    ) {
                                      return err(
                                        `Invalid ARN: the accountId specified in the ARN (\`${_.getAttr(accessPointArn, "accountId")}\`) does not match the parameter (\`${AccountId}\`)`,
                                      );
                                    }
                                    {
                                      const outpostType = _.getAttr(
                                        accessPointArn,
                                        "resourceId[2]",
                                      );
                                      if (
                                        outpostType != null &&
                                        outpostType !== false
                                      ) {
                                        {
                                          const accessPointName = _.getAttr(
                                            accessPointArn,
                                            "resourceId[3]",
                                          );
                                          if (
                                            accessPointName != null &&
                                            accessPointName !== false
                                          ) {
                                            if (outpostType === "accesspoint") {
                                              if (
                                                UseFIPS === true &&
                                                UseDualStack === true
                                              ) {
                                                return e(
                                                  `https://s3-outposts-fips.${_.getAttr(accessPointArn, "region")}.${_.getAttr(arnPartition, "dualStackDnsSuffix")}`,
                                                  _p3(accessPointArn),
                                                  {
                                                    "x-amz-account-id": [
                                                      `${_.getAttr(accessPointArn, "accountId")}`,
                                                    ],
                                                    "x-amz-outpost-id": [
                                                      `${outpostId}`,
                                                    ],
                                                  },
                                                );
                                              }
                                              if (UseFIPS === true) {
                                                return e(
                                                  `https://s3-outposts-fips.${_.getAttr(accessPointArn, "region")}.${_.getAttr(arnPartition, "dnsSuffix")}`,
                                                  _p3(accessPointArn),
                                                  {
                                                    "x-amz-account-id": [
                                                      `${_.getAttr(accessPointArn, "accountId")}`,
                                                    ],
                                                    "x-amz-outpost-id": [
                                                      `${outpostId}`,
                                                    ],
                                                  },
                                                );
                                              }
                                              if (UseDualStack === true) {
                                                return e(
                                                  `https://s3-outposts.${_.getAttr(accessPointArn, "region")}.${_.getAttr(arnPartition, "dualStackDnsSuffix")}`,
                                                  _p3(accessPointArn),
                                                  {
                                                    "x-amz-account-id": [
                                                      `${_.getAttr(accessPointArn, "accountId")}`,
                                                    ],
                                                    "x-amz-outpost-id": [
                                                      `${outpostId}`,
                                                    ],
                                                  },
                                                );
                                              }
                                              {
                                                const url =
                                                  _.parseURL(Endpoint);
                                                if (
                                                  Endpoint != null &&
                                                  url != null &&
                                                  url !== false
                                                ) {
                                                  return e(
                                                    `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                                                    _p3(accessPointArn),
                                                    {
                                                      "x-amz-account-id": [
                                                        `${_.getAttr(accessPointArn, "accountId")}`,
                                                      ],
                                                      "x-amz-outpost-id": [
                                                        `${outpostId}`,
                                                      ],
                                                    },
                                                  );
                                                }
                                              }
                                              return e(
                                                `https://s3-outposts.${_.getAttr(accessPointArn, "region")}.${_.getAttr(arnPartition, "dnsSuffix")}`,
                                                _p3(accessPointArn),
                                                {
                                                  "x-amz-account-id": [
                                                    `${_.getAttr(accessPointArn, "accountId")}`,
                                                  ],
                                                  "x-amz-outpost-id": [
                                                    `${outpostId}`,
                                                  ],
                                                },
                                              );
                                            }
                                            return err(
                                              `Expected an outpost type \`accesspoint\`, found \`${outpostType}\``,
                                            );
                                          }
                                        }
                                        return err(
                                          "Invalid ARN: expected an access point name",
                                        );
                                      }
                                    }
                                    return err(
                                      "Invalid ARN: Expected a 4-component resource",
                                    );
                                  }
                                  return err(
                                    `Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and \`-\`. Found: \`${_.getAttr(accessPointArn, "accountId")}\``,
                                  );
                                }
                                return err("Invalid ARN: missing account ID");
                              }
                              return err(
                                `Invalid region in ARN: \`${_.getAttr(accessPointArn, "region")}\` (invalid DNS name)`,
                              );
                            }
                            return err(
                              `Client was configured for partition \`${_.getAttr(partitionResult, "name")}\` but ARN has \`${_.getAttr(arnPartition, "name")}\``,
                            );
                          }
                        }
                      }
                    }
                  }
                  return err(
                    `Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and \`-\`., found: \`${outpostId}\``,
                  );
                }
              }
              return err("Invalid ARN: The Outpost Id was not set");
            }
          }
        }
        return err("Invalid ARN: No ARN type specified");
      }
    }
    {
      const bucketArn = _.parseArn(Bucket);
      if (Bucket != null && bucketArn != null && bucketArn !== false) {
        {
          const arnType = _.getAttr(bucketArn, "resourceId[0]");
          if (arnType != null && arnType !== false && !(arnType === "")) {
            if (_.getAttr(bucketArn, "service") === "s3-outposts") {
              {
                const outpostId = _.getAttr(bucketArn, "resourceId[1]");
                if (outpostId != null && outpostId !== false) {
                  if (_.isValidHostLabel(outpostId, false)) {
                    if (Endpoint != null && UseDualStack === true) {
                      return err(
                        "Invalid Configuration: DualStack and custom endpoint are not supported",
                      );
                    }
                    if (
                      UseArnRegion != null &&
                      UseArnRegion === false &&
                      !(_.getAttr(bucketArn, "region") === `${Region}`)
                    ) {
                      return err(
                        `Invalid configuration: region from ARN \`${_.getAttr(bucketArn, "region")}\` does not match client region \`${Region}\` and UseArnRegion is \`false\``,
                      );
                    }
                    {
                      const arnPartition = _.partition(
                        _.getAttr(bucketArn, "region"),
                      );
                      if (arnPartition != null && arnPartition !== false) {
                        {
                          const partitionResult = _.partition(Region);
                          if (
                            partitionResult != null &&
                            partitionResult !== false
                          ) {
                            if (
                              _.getAttr(arnPartition, "name") ===
                              _.getAttr(partitionResult, "name")
                            ) {
                              if (
                                _.isValidHostLabel(
                                  _.getAttr(bucketArn, "region"),
                                  true,
                                )
                              ) {
                                if (
                                  !(_.getAttr(bucketArn, "accountId") === "")
                                ) {
                                  if (
                                    _.isValidHostLabel(
                                      _.getAttr(bucketArn, "accountId"),
                                      false,
                                    )
                                  ) {
                                    if (
                                      AccountId != null &&
                                      !(
                                        AccountId ===
                                        `${_.getAttr(bucketArn, "accountId")}`
                                      )
                                    ) {
                                      return err(
                                        `Invalid ARN: the accountId specified in the ARN (\`${_.getAttr(bucketArn, "accountId")}\`) does not match the parameter (\`${AccountId}\`)`,
                                      );
                                    }
                                    {
                                      const outpostType = _.getAttr(
                                        bucketArn,
                                        "resourceId[2]",
                                      );
                                      if (
                                        outpostType != null &&
                                        outpostType !== false
                                      ) {
                                        {
                                          const bucketName = _.getAttr(
                                            bucketArn,
                                            "resourceId[3]",
                                          );
                                          if (
                                            bucketName != null &&
                                            bucketName !== false
                                          ) {
                                            if (outpostType === "bucket") {
                                              if (
                                                UseFIPS === true &&
                                                UseDualStack === true
                                              ) {
                                                return e(
                                                  `https://s3-outposts-fips.${_.getAttr(bucketArn, "region")}.${_.getAttr(arnPartition, "dualStackDnsSuffix")}`,
                                                  _p3(bucketArn),
                                                  {
                                                    "x-amz-account-id": [
                                                      `${_.getAttr(bucketArn, "accountId")}`,
                                                    ],
                                                    "x-amz-outpost-id": [
                                                      `${outpostId}`,
                                                    ],
                                                  },
                                                );
                                              }
                                              if (UseFIPS === true) {
                                                return e(
                                                  `https://s3-outposts-fips.${_.getAttr(bucketArn, "region")}.${_.getAttr(arnPartition, "dnsSuffix")}`,
                                                  _p3(bucketArn),
                                                  {
                                                    "x-amz-account-id": [
                                                      `${_.getAttr(bucketArn, "accountId")}`,
                                                    ],
                                                    "x-amz-outpost-id": [
                                                      `${outpostId}`,
                                                    ],
                                                  },
                                                );
                                              }
                                              if (UseDualStack === true) {
                                                return e(
                                                  `https://s3-outposts.${_.getAttr(bucketArn, "region")}.${_.getAttr(arnPartition, "dualStackDnsSuffix")}`,
                                                  _p3(bucketArn),
                                                  {
                                                    "x-amz-account-id": [
                                                      `${_.getAttr(bucketArn, "accountId")}`,
                                                    ],
                                                    "x-amz-outpost-id": [
                                                      `${outpostId}`,
                                                    ],
                                                  },
                                                );
                                              }
                                              {
                                                const url =
                                                  _.parseURL(Endpoint);
                                                if (
                                                  Endpoint != null &&
                                                  url != null &&
                                                  url !== false
                                                ) {
                                                  return e(
                                                    `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                                                    _p3(bucketArn),
                                                    {
                                                      "x-amz-account-id": [
                                                        `${_.getAttr(bucketArn, "accountId")}`,
                                                      ],
                                                      "x-amz-outpost-id": [
                                                        `${outpostId}`,
                                                      ],
                                                    },
                                                  );
                                                }
                                              }
                                              return e(
                                                `https://s3-outposts.${_.getAttr(bucketArn, "region")}.${_.getAttr(arnPartition, "dnsSuffix")}`,
                                                _p3(bucketArn),
                                                {
                                                  "x-amz-account-id": [
                                                    `${_.getAttr(bucketArn, "accountId")}`,
                                                  ],
                                                  "x-amz-outpost-id": [
                                                    `${outpostId}`,
                                                  ],
                                                },
                                              );
                                            }
                                            return err(
                                              `Invalid ARN: Expected an outpost type \`bucket\`, found \`${outpostType}\``,
                                            );
                                          }
                                        }
                                        return err(
                                          "Invalid ARN: expected a bucket name",
                                        );
                                      }
                                    }
                                    return err(
                                      "Invalid ARN: Expected a 4-component resource",
                                    );
                                  }
                                  return err(
                                    `Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and \`-\`. Found: \`${_.getAttr(bucketArn, "accountId")}\``,
                                  );
                                }
                                return err("Invalid ARN: missing account ID");
                              }
                              return err(
                                `Invalid region in ARN: \`${_.getAttr(bucketArn, "region")}\` (invalid DNS name)`,
                              );
                            }
                            return err(
                              `Client was configured for partition \`${_.getAttr(partitionResult, "name")}\` but ARN has \`${_.getAttr(arnPartition, "name")}\``,
                            );
                          }
                        }
                      }
                    }
                  }
                  return err(
                    `Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and \`-\`., found: \`${outpostId}\``,
                  );
                }
              }
              return err("Invalid ARN: The Outpost Id was not set");
            }
          }
        }
        return err("Invalid ARN: No ARN type specified");
      }
    }
    {
      const partitionResult = _.partition(Region);
      if (partitionResult != null && partitionResult !== false) {
        if (_.isValidHostLabel(Region, true)) {
          if (
            RequiresAccountId != null &&
            RequiresAccountId === true &&
            !(AccountId != null)
          ) {
            return err("AccountId is required but not set");
          }
          if (AccountId != null && !_.isValidHostLabel(AccountId, false)) {
            return err("AccountId must only contain a-z, A-Z, 0-9 and `-`.");
          }
          {
            const url = _.parseURL(Endpoint);
            if (Endpoint != null && url != null && url !== false) {
              if (UseDualStack === true) {
                return err(
                  "Invalid Configuration: DualStack and custom endpoint are not supported",
                );
              }
              if (
                RequiresAccountId != null &&
                RequiresAccountId === true &&
                AccountId != null
              ) {
                return e(
                  `${_.getAttr(url, "scheme")}://${AccountId}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p2(Region),
                  {},
                );
              }
              return e(
                `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                _p2(Region),
                {},
              );
            }
          }
          if (
            UseFIPS === true &&
            UseDualStack === true &&
            RequiresAccountId != null &&
            RequiresAccountId === true &&
            AccountId != null
          ) {
            return e(
              `https://${AccountId}.s3-control-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p2(Region),
              {},
            );
          }
          if (UseFIPS === true && UseDualStack === true) {
            return e(
              `https://s3-control-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p2(Region),
              {},
            );
          }
          if (
            UseFIPS === true &&
            UseDualStack === false &&
            RequiresAccountId != null &&
            RequiresAccountId === true &&
            AccountId != null
          ) {
            return e(
              `https://${AccountId}.s3-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p2(Region),
              {},
            );
          }
          if (UseFIPS === true && UseDualStack === false) {
            return e(
              `https://s3-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p2(Region),
              {},
            );
          }
          if (
            UseFIPS === false &&
            UseDualStack === true &&
            RequiresAccountId != null &&
            RequiresAccountId === true &&
            AccountId != null
          ) {
            return e(
              `https://${AccountId}.s3-control.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p2(Region),
              {},
            );
          }
          if (UseFIPS === false && UseDualStack === true) {
            return e(
              `https://s3-control.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p2(Region),
              {},
            );
          }
          if (
            UseFIPS === false &&
            UseDualStack === false &&
            RequiresAccountId != null &&
            RequiresAccountId === true &&
            AccountId != null
          ) {
            return e(
              `https://${AccountId}.s3-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p2(Region),
              {},
            );
          }
          if (UseFIPS === false && UseDualStack === false) {
            return e(
              `https://s3-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p2(Region),
              {},
            );
          }
        }
        return err("Invalid region: region was not a valid DNS name.");
      }
    }
  }
  return err("Region must be set");
});

//# Newtypes
export type AccountId = string;
export type IdentityCenterArn = string;
export type AccessGrantsLocationId = string;
export type IdentityCenterApplicationArn = string;
export type S3Prefix = string;
export type IAMRoleArn = string;
export type AccessPointName = string;
export type BucketName = string;
export type ObjectLambdaAccessPointName = string;
export type GrantFullControl = string;
export type GrantRead = string;
export type GrantReadACP = string;
export type GrantWrite = string;
export type GrantWriteACP = string;
export type ObjectLockEnabledForBucket = boolean;
export type NonEmptyMaxLength64String = string;
export type ConfirmationRequired = boolean;
export type NonEmptyMaxLength256String = string;
export type JobPriority = number;
export type MultiRegionAccessPointClientToken = string;
export type AccessGrantId = string;
export type JobId = string;
export type ConfigId = string;
export type StorageLensGroupName = string;
export type AsyncRequestTokenARN = string;
export type DurationSeconds = number;
export type MultiRegionAccessPointName = string;
export type MultiRegionAccessPointId = string;
export type ContinuationToken = string;
export type MaxResults = number;
export type GranteeIdentifier = string;
export type NonEmptyMaxLength1024String = string;
export type DataSourceId = string;
export type DataSourceType = string;
export type StringForNextToken = string;
export type S3ResourceArn = string;
export type PolicyDocument = string;
export type Organization = string;
export type Policy = string;
export type ObjectLambdaPolicy = string;
export type ConfirmRemoveSelfBucketAccess = boolean;
export type MFA = string;
export type TagKeyString = string;
export type JobStatusUpdateReason = string;
export type TagValueString = string;
export type VpcId = string;
export type Setting = boolean;
export type Prefix = string;
export type ObjectLambdaSupportingAccessPointArn = string;
export type S3BucketArnString = string;
export type ReportPrefixString = string;
export type StorageLensGroupArn = string;
export type Role = string;
export type IsEnabled = boolean;
export type StorageLensArn = string;
export type StorageLensPrefixLevelDelimiter = string;
export type RegionName = string;
export type TrafficDialPercentage = number;
export type CreationTimestamp = Date;
export type AccessGrantsInstanceId = string;
export type AccessGrantsInstanceArn = string;
export type AccessGrantsLocationArn = string;
export type ExceptionMessage = string;
export type AccessGrantArn = string;
export type AccessPointBucketName = string;
export type CreationDate = Date;
export type Alias = string;
export type S3AccessPointArn = string;
export type PublicAccessBlockEnabled = boolean;
export type FunctionArnString = string;
export type S3RegionalOrS3ExpressBucketArnString = string;
export type NonEmptyMaxLength2048String = string;
export type KmsKeyArnString = string;
export type S3ExpirationInDays = number;
export type S3KeyArnString = string;
export type S3ObjectVersionId = string;
export type Suffix = string;
export type ID = string;
export type Priority = number;
export type BucketIdentifierString = string;
export type S3AWSRegion = string;
export type AwsOrgArn = string;
export type JobArn = string;
export type JobCreationTime = Date;
export type JobTerminationDate = Date;
export type SuspendedDate = Date;
export type SuspendedCause = string;
export type AsyncCreationTimestamp = Date;
export type AsyncRequestStatus = string;
export type ObjectLambdaAccessPointAliasValue = string;
export type IsPublic = boolean;
export type AccessKeyId = string | redacted.Redacted<string>;
export type SecretAccessKey = string | redacted.Redacted<string>;
export type SessionToken = string | redacted.Redacted<string>;
export type Expiration = Date;
export type MultiRegionAccessPointAlias = string;
export type ObjectLambdaAccessPointArn = string;
export type S3RegionalBucketArn = string;
export type MaxLength1024String = string;
export type S3ContentLength = number;
export type ManifestPrefixString = string;
export type ObjectCreationTime = Date;
export type ObjectSizeGreaterThanBytes = number;
export type ObjectSizeLessThanBytes = number;
export type ObjectAgeValue = number;
export type ObjectSizeValue = number;
export type Days = number;
export type ExpiredObjectDeleteMarker = boolean;
export type NoncurrentVersionCount = number;
export type DaysAfterInitiation = number;
export type Location = string;
export type NoSuchPublicAccessBlockConfigurationMessage = string;
export type JobTotalNumberOfTasks = number;
export type JobNumberOfTasksSucceeded = number;
export type JobNumberOfTasksFailed = number;
export type JobFailureCode = string;
export type JobFailureReason = string;
export type AwsLambdaTransformationPayload = string;
export type ReplicaKmsKeyID = string;
export type JobTimeInStateSeconds = number;
export type NonEmptyKmsKeyArnString = string;
export type Minutes = number;
export type SSEKMSKeyId = string;
export type StorageLensPrefixLevelMaxDepth = number;
export type MinStorageBytesPercentage = number;

//# Schemas
export type Permission = "READ" | "WRITE" | "READWRITE";
export const Permission = S.Literal("READ", "WRITE", "READWRITE");
export type S3PrefixType = "Object";
export const S3PrefixType = S.Literal("Object");
export type BucketCannedACL =
  | "private"
  | "public-read"
  | "public-read-write"
  | "authenticated-read";
export const BucketCannedACL = S.Literal(
  "private",
  "public-read",
  "public-read-write",
  "authenticated-read",
);
export type Privilege = "Minimal" | "Default";
export const Privilege = S.Literal("Minimal", "Default");
export type GranteeType = "DIRECTORY_USER" | "DIRECTORY_GROUP" | "IAM";
export const GranteeType = S.Literal(
  "DIRECTORY_USER",
  "DIRECTORY_GROUP",
  "IAM",
);
export type JobStatus =
  | "Active"
  | "Cancelled"
  | "Cancelling"
  | "Complete"
  | "Completing"
  | "Failed"
  | "Failing"
  | "New"
  | "Paused"
  | "Pausing"
  | "Preparing"
  | "Ready"
  | "Suspended";
export const JobStatus = S.Literal(
  "Active",
  "Cancelled",
  "Cancelling",
  "Complete",
  "Completing",
  "Failed",
  "Failing",
  "New",
  "Paused",
  "Pausing",
  "Preparing",
  "Ready",
  "Suspended",
);
export type JobStatusList = JobStatus[];
export const JobStatusList = S.Array(JobStatus);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type RequestedJobStatus = "Cancelled" | "Ready";
export const RequestedJobStatus = S.Literal("Cancelled", "Ready");
export interface AssociateAccessGrantsIdentityCenterRequest {
  AccountId: string;
  IdentityCenterArn: string;
}
export const AssociateAccessGrantsIdentityCenterRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    IdentityCenterArn: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/v20180820/accessgrantsinstance/identitycenter",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "AssociateAccessGrantsIdentityCenterRequest",
}) as any as S.Schema<AssociateAccessGrantsIdentityCenterRequest>;
export interface AssociateAccessGrantsIdentityCenterResponse {}
export const AssociateAccessGrantsIdentityCenterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateAccessGrantsIdentityCenterResponse",
}) as any as S.Schema<AssociateAccessGrantsIdentityCenterResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(
  Tag.pipe(T.XmlName("Tag")).annotations({ identifier: "Tag" }),
);
export interface CreateAccessGrantsInstanceRequest {
  AccountId: string;
  IdentityCenterArn?: string;
  Tags?: Tag[];
}
export const CreateAccessGrantsInstanceRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    IdentityCenterArn: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/accessgrantsinstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateAccessGrantsInstanceRequest",
}) as any as S.Schema<CreateAccessGrantsInstanceRequest>;
export interface CreateAccessGrantsLocationRequest {
  AccountId: string;
  LocationScope: string;
  IAMRoleArn: string;
  Tags?: Tag[];
}
export const CreateAccessGrantsLocationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    LocationScope: S.String,
    IAMRoleArn: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/v20180820/accessgrantsinstance/location",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateAccessGrantsLocationRequest",
}) as any as S.Schema<CreateAccessGrantsLocationRequest>;
export interface DeleteAccessGrantRequest {
  AccountId: string;
  AccessGrantId: string;
}
export const DeleteAccessGrantRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    AccessGrantId: S.String.pipe(T.HttpLabel("AccessGrantId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/accessgrantsinstance/grant/{AccessGrantId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessGrantRequest",
}) as any as S.Schema<DeleteAccessGrantRequest>;
export interface DeleteAccessGrantResponse {}
export const DeleteAccessGrantResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessGrantResponse",
}) as any as S.Schema<DeleteAccessGrantResponse>;
export interface DeleteAccessGrantsInstanceRequest {
  AccountId: string;
}
export const DeleteAccessGrantsInstanceRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/accessgrantsinstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessGrantsInstanceRequest",
}) as any as S.Schema<DeleteAccessGrantsInstanceRequest>;
export interface DeleteAccessGrantsInstanceResponse {}
export const DeleteAccessGrantsInstanceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessGrantsInstanceResponse",
}) as any as S.Schema<DeleteAccessGrantsInstanceResponse>;
export interface DeleteAccessGrantsInstanceResourcePolicyRequest {
  AccountId: string;
}
export const DeleteAccessGrantsInstanceResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/accessgrantsinstance/resourcepolicy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessGrantsInstanceResourcePolicyRequest",
}) as any as S.Schema<DeleteAccessGrantsInstanceResourcePolicyRequest>;
export interface DeleteAccessGrantsInstanceResourcePolicyResponse {}
export const DeleteAccessGrantsInstanceResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessGrantsInstanceResourcePolicyResponse",
}) as any as S.Schema<DeleteAccessGrantsInstanceResourcePolicyResponse>;
export interface DeleteAccessGrantsLocationRequest {
  AccountId: string;
  AccessGrantsLocationId: string;
}
export const DeleteAccessGrantsLocationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    AccessGrantsLocationId: S.String.pipe(
      T.HttpLabel("AccessGrantsLocationId"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/accessgrantsinstance/location/{AccessGrantsLocationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessGrantsLocationRequest",
}) as any as S.Schema<DeleteAccessGrantsLocationRequest>;
export interface DeleteAccessGrantsLocationResponse {}
export const DeleteAccessGrantsLocationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessGrantsLocationResponse",
}) as any as S.Schema<DeleteAccessGrantsLocationResponse>;
export interface DeleteAccessPointRequest {
  AccountId: string;
  Name: string;
}
export const DeleteAccessPointRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/accesspoint/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessPointRequest",
}) as any as S.Schema<DeleteAccessPointRequest>;
export interface DeleteAccessPointResponse {}
export const DeleteAccessPointResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessPointResponse",
}) as any as S.Schema<DeleteAccessPointResponse>;
export interface DeleteAccessPointForObjectLambdaRequest {
  AccountId: string;
  Name: string;
}
export const DeleteAccessPointForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/accesspointforobjectlambda/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessPointForObjectLambdaRequest",
}) as any as S.Schema<DeleteAccessPointForObjectLambdaRequest>;
export interface DeleteAccessPointForObjectLambdaResponse {}
export const DeleteAccessPointForObjectLambdaResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessPointForObjectLambdaResponse",
}) as any as S.Schema<DeleteAccessPointForObjectLambdaResponse>;
export interface DeleteAccessPointPolicyRequest {
  AccountId: string;
  Name: string;
}
export const DeleteAccessPointPolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/accesspoint/{Name}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessPointPolicyRequest",
}) as any as S.Schema<DeleteAccessPointPolicyRequest>;
export interface DeleteAccessPointPolicyResponse {}
export const DeleteAccessPointPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessPointPolicyResponse",
}) as any as S.Schema<DeleteAccessPointPolicyResponse>;
export interface DeleteAccessPointPolicyForObjectLambdaRequest {
  AccountId: string;
  Name: string;
}
export const DeleteAccessPointPolicyForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/accesspointforobjectlambda/{Name}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessPointPolicyForObjectLambdaRequest",
}) as any as S.Schema<DeleteAccessPointPolicyForObjectLambdaRequest>;
export interface DeleteAccessPointPolicyForObjectLambdaResponse {}
export const DeleteAccessPointPolicyForObjectLambdaResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessPointPolicyForObjectLambdaResponse",
}) as any as S.Schema<DeleteAccessPointPolicyForObjectLambdaResponse>;
export interface DeleteAccessPointScopeRequest {
  AccountId: string;
  Name: string;
}
export const DeleteAccessPointScopeRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/accesspoint/{Name}/scope" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({
        RequiresAccountId: { value: true },
        UseS3ExpressControlEndpoint: { value: true },
      }),
    ),
  ),
).annotations({
  identifier: "DeleteAccessPointScopeRequest",
}) as any as S.Schema<DeleteAccessPointScopeRequest>;
export interface DeleteAccessPointScopeResponse {}
export const DeleteAccessPointScopeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAccessPointScopeResponse",
}) as any as S.Schema<DeleteAccessPointScopeResponse>;
export interface DeleteBucketRequest {
  AccountId: string;
  Bucket: string;
}
export const DeleteBucketRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/bucket/{Bucket}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketRequest",
}) as any as S.Schema<DeleteBucketRequest>;
export interface DeleteBucketResponse {}
export const DeleteBucketResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketResponse",
}) as any as S.Schema<DeleteBucketResponse>;
export interface DeleteBucketLifecycleConfigurationRequest {
  AccountId: string;
  Bucket: string;
}
export const DeleteBucketLifecycleConfigurationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/bucket/{Bucket}/lifecycleconfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketLifecycleConfigurationRequest",
}) as any as S.Schema<DeleteBucketLifecycleConfigurationRequest>;
export interface DeleteBucketLifecycleConfigurationResponse {}
export const DeleteBucketLifecycleConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketLifecycleConfigurationResponse",
}) as any as S.Schema<DeleteBucketLifecycleConfigurationResponse>;
export interface DeleteBucketPolicyRequest {
  AccountId: string;
  Bucket: string;
}
export const DeleteBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/bucket/{Bucket}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketPolicyRequest",
}) as any as S.Schema<DeleteBucketPolicyRequest>;
export interface DeleteBucketPolicyResponse {}
export const DeleteBucketPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketPolicyResponse",
}) as any as S.Schema<DeleteBucketPolicyResponse>;
export interface DeleteBucketReplicationRequest {
  AccountId: string;
  Bucket: string;
}
export const DeleteBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/bucket/{Bucket}/replication",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketReplicationRequest",
}) as any as S.Schema<DeleteBucketReplicationRequest>;
export interface DeleteBucketReplicationResponse {}
export const DeleteBucketReplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketReplicationResponse",
}) as any as S.Schema<DeleteBucketReplicationResponse>;
export interface DeleteBucketTaggingRequest {
  AccountId: string;
  Bucket: string;
}
export const DeleteBucketTaggingRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/bucket/{Bucket}/tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketTaggingRequest",
}) as any as S.Schema<DeleteBucketTaggingRequest>;
export interface DeleteBucketTaggingResponse {}
export const DeleteBucketTaggingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketTaggingResponse",
}) as any as S.Schema<DeleteBucketTaggingResponse>;
export interface DeleteJobTaggingRequest {
  AccountId: string;
  JobId: string;
}
export const DeleteJobTaggingRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/jobs/{JobId}/tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteJobTaggingRequest",
}) as any as S.Schema<DeleteJobTaggingRequest>;
export interface DeleteJobTaggingResult {}
export const DeleteJobTaggingResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteJobTaggingResult",
}) as any as S.Schema<DeleteJobTaggingResult>;
export interface DeletePublicAccessBlockRequest {
  AccountId: string;
}
export const DeletePublicAccessBlockRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/configuration/publicAccessBlock",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeletePublicAccessBlockRequest",
}) as any as S.Schema<DeletePublicAccessBlockRequest>;
export interface DeletePublicAccessBlockResponse {}
export const DeletePublicAccessBlockResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePublicAccessBlockResponse",
}) as any as S.Schema<DeletePublicAccessBlockResponse>;
export interface DeleteStorageLensConfigurationRequest {
  ConfigId: string;
  AccountId: string;
}
export const DeleteStorageLensConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigId: S.String.pipe(T.HttpLabel("ConfigId")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/storagelens/{ConfigId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteStorageLensConfigurationRequest",
}) as any as S.Schema<DeleteStorageLensConfigurationRequest>;
export interface DeleteStorageLensConfigurationResponse {}
export const DeleteStorageLensConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStorageLensConfigurationResponse",
}) as any as S.Schema<DeleteStorageLensConfigurationResponse>;
export interface DeleteStorageLensConfigurationTaggingRequest {
  ConfigId: string;
  AccountId: string;
}
export const DeleteStorageLensConfigurationTaggingRequest = S.suspend(() =>
  S.Struct({
    ConfigId: S.String.pipe(T.HttpLabel("ConfigId")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/storagelens/{ConfigId}/tagging",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteStorageLensConfigurationTaggingRequest",
}) as any as S.Schema<DeleteStorageLensConfigurationTaggingRequest>;
export interface DeleteStorageLensConfigurationTaggingResult {}
export const DeleteStorageLensConfigurationTaggingResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStorageLensConfigurationTaggingResult",
}) as any as S.Schema<DeleteStorageLensConfigurationTaggingResult>;
export interface DeleteStorageLensGroupRequest {
  Name: string;
  AccountId: string;
}
export const DeleteStorageLensGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/storagelensgroup/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteStorageLensGroupRequest",
}) as any as S.Schema<DeleteStorageLensGroupRequest>;
export interface DeleteStorageLensGroupResponse {}
export const DeleteStorageLensGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStorageLensGroupResponse",
}) as any as S.Schema<DeleteStorageLensGroupResponse>;
export interface DescribeJobRequest {
  AccountId: string;
  JobId: string;
}
export const DescribeJobRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/jobs/{JobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DescribeJobRequest",
}) as any as S.Schema<DescribeJobRequest>;
export interface DescribeMultiRegionAccessPointOperationRequest {
  AccountId: string;
  RequestTokenARN: string;
}
export const DescribeMultiRegionAccessPointOperationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    RequestTokenARN: S.String.pipe(T.HttpLabel("RequestTokenARN")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/async-requests/mrap/{RequestTokenARN+}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DescribeMultiRegionAccessPointOperationRequest",
}) as any as S.Schema<DescribeMultiRegionAccessPointOperationRequest>;
export interface DissociateAccessGrantsIdentityCenterRequest {
  AccountId: string;
}
export const DissociateAccessGrantsIdentityCenterRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/v20180820/accessgrantsinstance/identitycenter",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DissociateAccessGrantsIdentityCenterRequest",
}) as any as S.Schema<DissociateAccessGrantsIdentityCenterRequest>;
export interface DissociateAccessGrantsIdentityCenterResponse {}
export const DissociateAccessGrantsIdentityCenterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DissociateAccessGrantsIdentityCenterResponse",
}) as any as S.Schema<DissociateAccessGrantsIdentityCenterResponse>;
export interface GetAccessGrantRequest {
  AccountId: string;
  AccessGrantId: string;
}
export const GetAccessGrantRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    AccessGrantId: S.String.pipe(T.HttpLabel("AccessGrantId")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accessgrantsinstance/grant/{AccessGrantId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessGrantRequest",
}) as any as S.Schema<GetAccessGrantRequest>;
export interface GetAccessGrantsInstanceRequest {
  AccountId: string;
}
export const GetAccessGrantsInstanceRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accessgrantsinstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessGrantsInstanceRequest",
}) as any as S.Schema<GetAccessGrantsInstanceRequest>;
export interface GetAccessGrantsInstanceForPrefixRequest {
  AccountId: string;
  S3Prefix: string;
}
export const GetAccessGrantsInstanceForPrefixRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    S3Prefix: S.String.pipe(T.HttpQuery("s3prefix")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accessgrantsinstance/prefix" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessGrantsInstanceForPrefixRequest",
}) as any as S.Schema<GetAccessGrantsInstanceForPrefixRequest>;
export interface GetAccessGrantsInstanceResourcePolicyRequest {
  AccountId: string;
}
export const GetAccessGrantsInstanceResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accessgrantsinstance/resourcepolicy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessGrantsInstanceResourcePolicyRequest",
}) as any as S.Schema<GetAccessGrantsInstanceResourcePolicyRequest>;
export interface GetAccessGrantsLocationRequest {
  AccountId: string;
  AccessGrantsLocationId: string;
}
export const GetAccessGrantsLocationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    AccessGrantsLocationId: S.String.pipe(
      T.HttpLabel("AccessGrantsLocationId"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accessgrantsinstance/location/{AccessGrantsLocationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessGrantsLocationRequest",
}) as any as S.Schema<GetAccessGrantsLocationRequest>;
export interface GetAccessPointRequest {
  AccountId: string;
  Name: string;
}
export const GetAccessPointRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accesspoint/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessPointRequest",
}) as any as S.Schema<GetAccessPointRequest>;
export interface GetAccessPointConfigurationForObjectLambdaRequest {
  AccountId: string;
  Name: string;
}
export const GetAccessPointConfigurationForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accesspointforobjectlambda/{Name}/configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessPointConfigurationForObjectLambdaRequest",
}) as any as S.Schema<GetAccessPointConfigurationForObjectLambdaRequest>;
export interface GetAccessPointForObjectLambdaRequest {
  AccountId: string;
  Name: string;
}
export const GetAccessPointForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accesspointforobjectlambda/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessPointForObjectLambdaRequest",
}) as any as S.Schema<GetAccessPointForObjectLambdaRequest>;
export interface GetAccessPointPolicyRequest {
  AccountId: string;
  Name: string;
}
export const GetAccessPointPolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accesspoint/{Name}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessPointPolicyRequest",
}) as any as S.Schema<GetAccessPointPolicyRequest>;
export interface GetAccessPointPolicyForObjectLambdaRequest {
  AccountId: string;
  Name: string;
}
export const GetAccessPointPolicyForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accesspointforobjectlambda/{Name}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessPointPolicyForObjectLambdaRequest",
}) as any as S.Schema<GetAccessPointPolicyForObjectLambdaRequest>;
export interface GetAccessPointPolicyStatusRequest {
  AccountId: string;
  Name: string;
}
export const GetAccessPointPolicyStatusRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accesspoint/{Name}/policyStatus",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessPointPolicyStatusRequest",
}) as any as S.Schema<GetAccessPointPolicyStatusRequest>;
export interface GetAccessPointPolicyStatusForObjectLambdaRequest {
  AccountId: string;
  Name: string;
}
export const GetAccessPointPolicyStatusForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accesspointforobjectlambda/{Name}/policyStatus",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetAccessPointPolicyStatusForObjectLambdaRequest",
}) as any as S.Schema<GetAccessPointPolicyStatusForObjectLambdaRequest>;
export interface GetAccessPointScopeRequest {
  AccountId: string;
  Name: string;
}
export const GetAccessPointScopeRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accesspoint/{Name}/scope" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({
        RequiresAccountId: { value: true },
        UseS3ExpressControlEndpoint: { value: true },
      }),
    ),
  ),
).annotations({
  identifier: "GetAccessPointScopeRequest",
}) as any as S.Schema<GetAccessPointScopeRequest>;
export interface GetBucketRequest {
  AccountId: string;
  Bucket: string;
}
export const GetBucketRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/bucket/{Bucket}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketRequest",
}) as any as S.Schema<GetBucketRequest>;
export interface GetBucketLifecycleConfigurationRequest {
  AccountId: string;
  Bucket: string;
}
export const GetBucketLifecycleConfigurationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/bucket/{Bucket}/lifecycleconfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketLifecycleConfigurationRequest",
}) as any as S.Schema<GetBucketLifecycleConfigurationRequest>;
export interface GetBucketPolicyRequest {
  AccountId: string;
  Bucket: string;
}
export const GetBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/bucket/{Bucket}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketPolicyRequest",
}) as any as S.Schema<GetBucketPolicyRequest>;
export interface GetBucketReplicationRequest {
  AccountId: string;
  Bucket: string;
}
export const GetBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/bucket/{Bucket}/replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketReplicationRequest",
}) as any as S.Schema<GetBucketReplicationRequest>;
export interface GetBucketTaggingRequest {
  AccountId: string;
  Bucket: string;
}
export const GetBucketTaggingRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/bucket/{Bucket}/tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketTaggingRequest",
}) as any as S.Schema<GetBucketTaggingRequest>;
export interface GetBucketVersioningRequest {
  AccountId: string;
  Bucket: string;
}
export const GetBucketVersioningRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/bucket/{Bucket}/versioning" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketVersioningRequest",
}) as any as S.Schema<GetBucketVersioningRequest>;
export interface GetDataAccessRequest {
  AccountId: string;
  Target: string;
  Permission: Permission;
  DurationSeconds?: number;
  Privilege?: Privilege;
  TargetType?: S3PrefixType;
}
export const GetDataAccessRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Target: S.String.pipe(T.HttpQuery("target")),
    Permission: Permission.pipe(T.HttpQuery("permission")),
    DurationSeconds: S.optional(S.Number).pipe(T.HttpQuery("durationSeconds")),
    Privilege: S.optional(Privilege).pipe(T.HttpQuery("privilege")),
    TargetType: S.optional(S3PrefixType).pipe(T.HttpQuery("targetType")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accessgrantsinstance/dataaccess",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetDataAccessRequest",
}) as any as S.Schema<GetDataAccessRequest>;
export interface GetJobTaggingRequest {
  AccountId: string;
  JobId: string;
}
export const GetJobTaggingRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/jobs/{JobId}/tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetJobTaggingRequest",
}) as any as S.Schema<GetJobTaggingRequest>;
export interface GetMultiRegionAccessPointRequest {
  AccountId: string;
  Name: string;
}
export const GetMultiRegionAccessPointRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/mrap/instances/{Name+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetMultiRegionAccessPointRequest",
}) as any as S.Schema<GetMultiRegionAccessPointRequest>;
export interface GetMultiRegionAccessPointPolicyRequest {
  AccountId: string;
  Name: string;
}
export const GetMultiRegionAccessPointPolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/mrap/instances/{Name+}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetMultiRegionAccessPointPolicyRequest",
}) as any as S.Schema<GetMultiRegionAccessPointPolicyRequest>;
export interface GetMultiRegionAccessPointPolicyStatusRequest {
  AccountId: string;
  Name: string;
}
export const GetMultiRegionAccessPointPolicyStatusRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/mrap/instances/{Name+}/policystatus",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetMultiRegionAccessPointPolicyStatusRequest",
}) as any as S.Schema<GetMultiRegionAccessPointPolicyStatusRequest>;
export interface GetMultiRegionAccessPointRoutesRequest {
  AccountId: string;
  Mrap: string;
}
export const GetMultiRegionAccessPointRoutesRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Mrap: S.String.pipe(T.HttpLabel("Mrap")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/mrap/instances/{Mrap+}/routes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetMultiRegionAccessPointRoutesRequest",
}) as any as S.Schema<GetMultiRegionAccessPointRoutesRequest>;
export interface GetPublicAccessBlockRequest {
  AccountId: string;
}
export const GetPublicAccessBlockRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/configuration/publicAccessBlock",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetPublicAccessBlockRequest",
}) as any as S.Schema<GetPublicAccessBlockRequest>;
export interface GetStorageLensConfigurationRequest {
  ConfigId: string;
  AccountId: string;
}
export const GetStorageLensConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigId: S.String.pipe(T.HttpLabel("ConfigId")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/storagelens/{ConfigId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetStorageLensConfigurationRequest",
}) as any as S.Schema<GetStorageLensConfigurationRequest>;
export interface GetStorageLensConfigurationTaggingRequest {
  ConfigId: string;
  AccountId: string;
}
export const GetStorageLensConfigurationTaggingRequest = S.suspend(() =>
  S.Struct({
    ConfigId: S.String.pipe(T.HttpLabel("ConfigId")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/storagelens/{ConfigId}/tagging",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetStorageLensConfigurationTaggingRequest",
}) as any as S.Schema<GetStorageLensConfigurationTaggingRequest>;
export interface GetStorageLensGroupRequest {
  Name: string;
  AccountId: string;
}
export const GetStorageLensGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/storagelensgroup/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetStorageLensGroupRequest",
}) as any as S.Schema<GetStorageLensGroupRequest>;
export interface ListAccessGrantsRequest {
  AccountId: string;
  NextToken?: string;
  MaxResults?: number;
  GranteeType?: GranteeType;
  GranteeIdentifier?: string;
  Permission?: Permission;
  GrantScope?: string;
  ApplicationArn?: string;
}
export const ListAccessGrantsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    GranteeType: S.optional(GranteeType).pipe(T.HttpQuery("granteetype")),
    GranteeIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("granteeidentifier"),
    ),
    Permission: S.optional(Permission).pipe(T.HttpQuery("permission")),
    GrantScope: S.optional(S.String).pipe(T.HttpQuery("grantscope")),
    ApplicationArn: S.optional(S.String).pipe(T.HttpQuery("application_arn")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accessgrantsinstance/grants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListAccessGrantsRequest",
}) as any as S.Schema<ListAccessGrantsRequest>;
export interface ListAccessGrantsInstancesRequest {
  AccountId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAccessGrantsInstancesRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accessgrantsinstances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListAccessGrantsInstancesRequest",
}) as any as S.Schema<ListAccessGrantsInstancesRequest>;
export interface ListAccessGrantsLocationsRequest {
  AccountId: string;
  NextToken?: string;
  MaxResults?: number;
  LocationScope?: string;
}
export const ListAccessGrantsLocationsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    LocationScope: S.optional(S.String).pipe(T.HttpQuery("locationscope")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accessgrantsinstance/locations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListAccessGrantsLocationsRequest",
}) as any as S.Schema<ListAccessGrantsLocationsRequest>;
export interface ListAccessPointsRequest {
  AccountId: string;
  Bucket?: string;
  NextToken?: string;
  MaxResults?: number;
  DataSourceId?: string;
  DataSourceType?: string;
}
export const ListAccessPointsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.optional(S.String).pipe(
      T.HttpQuery("bucket"),
      T.ContextParam("Bucket"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    DataSourceId: S.optional(S.String).pipe(T.HttpQuery("dataSourceId")),
    DataSourceType: S.optional(S.String).pipe(T.HttpQuery("dataSourceType")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accesspoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListAccessPointsRequest",
}) as any as S.Schema<ListAccessPointsRequest>;
export interface ListAccessPointsForDirectoryBucketsRequest {
  AccountId: string;
  DirectoryBucket?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAccessPointsForDirectoryBucketsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    DirectoryBucket: S.optional(S.String).pipe(T.HttpQuery("directoryBucket")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accesspointfordirectory" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({
        RequiresAccountId: { value: true },
        UseS3ExpressControlEndpoint: { value: true },
      }),
    ),
  ),
).annotations({
  identifier: "ListAccessPointsForDirectoryBucketsRequest",
}) as any as S.Schema<ListAccessPointsForDirectoryBucketsRequest>;
export interface ListAccessPointsForObjectLambdaRequest {
  AccountId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAccessPointsForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/accesspointforobjectlambda" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListAccessPointsForObjectLambdaRequest",
}) as any as S.Schema<ListAccessPointsForObjectLambdaRequest>;
export interface ListCallerAccessGrantsRequest {
  AccountId: string;
  GrantScope?: string;
  NextToken?: string;
  MaxResults?: number;
  AllowedByApplication?: boolean;
}
export const ListCallerAccessGrantsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    GrantScope: S.optional(S.String).pipe(T.HttpQuery("grantscope")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    AllowedByApplication: S.optional(S.Boolean).pipe(
      T.HttpQuery("allowedByApplication"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v20180820/accessgrantsinstance/caller/grants",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListCallerAccessGrantsRequest",
}) as any as S.Schema<ListCallerAccessGrantsRequest>;
export interface ListJobsRequest {
  AccountId: string;
  JobStatuses?: JobStatus[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    JobStatuses: S.optional(JobStatusList).pipe(T.HttpQuery("jobStatuses")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface ListMultiRegionAccessPointsRequest {
  AccountId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMultiRegionAccessPointsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/mrap/instances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListMultiRegionAccessPointsRequest",
}) as any as S.Schema<ListMultiRegionAccessPointsRequest>;
export interface ListRegionalBucketsRequest {
  AccountId: string;
  NextToken?: string;
  MaxResults?: number;
  OutpostId?: string;
}
export const ListRegionalBucketsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    OutpostId: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-outpost-id"),
      T.ContextParam("OutpostId"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/bucket" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListRegionalBucketsRequest",
}) as any as S.Schema<ListRegionalBucketsRequest>;
export interface ListStorageLensConfigurationsRequest {
  AccountId: string;
  NextToken?: string;
}
export const ListStorageLensConfigurationsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/storagelens" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListStorageLensConfigurationsRequest",
}) as any as S.Schema<ListStorageLensConfigurationsRequest>;
export interface ListStorageLensGroupsRequest {
  AccountId: string;
  NextToken?: string;
}
export const ListStorageLensGroupsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/storagelensgroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListStorageLensGroupsRequest",
}) as any as S.Schema<ListStorageLensGroupsRequest>;
export interface ListTagsForResourceRequest {
  AccountId: string;
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.ContextParam("ResourceArn"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v20180820/tags/{ResourceArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutAccessGrantsInstanceResourcePolicyRequest {
  AccountId: string;
  Policy: string;
  Organization?: string;
}
export const PutAccessGrantsInstanceResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Policy: S.String,
    Organization: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/v20180820/accessgrantsinstance/resourcepolicy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutAccessGrantsInstanceResourcePolicyRequest",
}) as any as S.Schema<PutAccessGrantsInstanceResourcePolicyRequest>;
export type ObjectLambdaAllowedFeature =
  | "GetObject-Range"
  | "GetObject-PartNumber"
  | "HeadObject-Range"
  | "HeadObject-PartNumber";
export const ObjectLambdaAllowedFeature = S.Literal(
  "GetObject-Range",
  "GetObject-PartNumber",
  "HeadObject-Range",
  "HeadObject-PartNumber",
);
export type ObjectLambdaAllowedFeaturesList = ObjectLambdaAllowedFeature[];
export const ObjectLambdaAllowedFeaturesList = S.Array(
  ObjectLambdaAllowedFeature.pipe(T.XmlName("AllowedFeature")),
);
export type ObjectLambdaTransformationConfigurationAction =
  | "GetObject"
  | "HeadObject"
  | "ListObjects"
  | "ListObjectsV2";
export const ObjectLambdaTransformationConfigurationAction = S.Literal(
  "GetObject",
  "HeadObject",
  "ListObjects",
  "ListObjectsV2",
);
export type ObjectLambdaTransformationConfigurationActionsList =
  ObjectLambdaTransformationConfigurationAction[];
export const ObjectLambdaTransformationConfigurationActionsList = S.Array(
  ObjectLambdaTransformationConfigurationAction.pipe(T.XmlName("Action")),
);
export interface AwsLambdaTransformation {
  FunctionArn: string;
  FunctionPayload?: string;
}
export const AwsLambdaTransformation = S.suspend(() =>
  S.Struct({ FunctionArn: S.String, FunctionPayload: S.optional(S.String) }),
).annotations({
  identifier: "AwsLambdaTransformation",
}) as any as S.Schema<AwsLambdaTransformation>;
export type ObjectLambdaContentTransformation = {
  AwsLambda: AwsLambdaTransformation;
};
export const ObjectLambdaContentTransformation = S.Union(
  S.Struct({ AwsLambda: AwsLambdaTransformation }),
);
export interface ObjectLambdaTransformationConfiguration {
  Actions: ObjectLambdaTransformationConfigurationAction[];
  ContentTransformation: ObjectLambdaContentTransformation;
}
export const ObjectLambdaTransformationConfiguration = S.suspend(() =>
  S.Struct({
    Actions: ObjectLambdaTransformationConfigurationActionsList,
    ContentTransformation: ObjectLambdaContentTransformation,
  }),
).annotations({
  identifier: "ObjectLambdaTransformationConfiguration",
}) as any as S.Schema<ObjectLambdaTransformationConfiguration>;
export type ObjectLambdaTransformationConfigurationsList =
  ObjectLambdaTransformationConfiguration[];
export const ObjectLambdaTransformationConfigurationsList = S.Array(
  ObjectLambdaTransformationConfiguration.pipe(
    T.XmlName("TransformationConfiguration"),
  ).annotations({ identifier: "ObjectLambdaTransformationConfiguration" }),
);
export interface ObjectLambdaConfiguration {
  SupportingAccessPoint: string;
  CloudWatchMetricsEnabled?: boolean;
  AllowedFeatures?: ObjectLambdaAllowedFeature[];
  TransformationConfigurations: ObjectLambdaTransformationConfiguration[];
}
export const ObjectLambdaConfiguration = S.suspend(() =>
  S.Struct({
    SupportingAccessPoint: S.String,
    CloudWatchMetricsEnabled: S.optional(S.Boolean),
    AllowedFeatures: S.optional(ObjectLambdaAllowedFeaturesList),
    TransformationConfigurations: ObjectLambdaTransformationConfigurationsList,
  }),
).annotations({
  identifier: "ObjectLambdaConfiguration",
}) as any as S.Schema<ObjectLambdaConfiguration>;
export interface PutAccessPointConfigurationForObjectLambdaRequest {
  AccountId: string;
  Name: string;
  Configuration: ObjectLambdaConfiguration;
}
export const PutAccessPointConfigurationForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
    Configuration: ObjectLambdaConfiguration,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/v20180820/accesspointforobjectlambda/{Name}/configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutAccessPointConfigurationForObjectLambdaRequest",
}) as any as S.Schema<PutAccessPointConfigurationForObjectLambdaRequest>;
export interface PutAccessPointConfigurationForObjectLambdaResponse {}
export const PutAccessPointConfigurationForObjectLambdaResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutAccessPointConfigurationForObjectLambdaResponse",
}) as any as S.Schema<PutAccessPointConfigurationForObjectLambdaResponse>;
export interface PutAccessPointPolicyRequest {
  AccountId: string;
  Name: string;
  Policy: string;
}
export const PutAccessPointPolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
    Policy: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/accesspoint/{Name}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutAccessPointPolicyRequest",
}) as any as S.Schema<PutAccessPointPolicyRequest>;
export interface PutAccessPointPolicyResponse {}
export const PutAccessPointPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutAccessPointPolicyResponse",
}) as any as S.Schema<PutAccessPointPolicyResponse>;
export interface PutAccessPointPolicyForObjectLambdaRequest {
  AccountId: string;
  Name: string;
  Policy: string;
}
export const PutAccessPointPolicyForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
    Policy: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/v20180820/accesspointforobjectlambda/{Name}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutAccessPointPolicyForObjectLambdaRequest",
}) as any as S.Schema<PutAccessPointPolicyForObjectLambdaRequest>;
export interface PutAccessPointPolicyForObjectLambdaResponse {}
export const PutAccessPointPolicyForObjectLambdaResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutAccessPointPolicyForObjectLambdaResponse",
}) as any as S.Schema<PutAccessPointPolicyForObjectLambdaResponse>;
export type PrefixesList = string[];
export const PrefixesList = S.Array(S.String.pipe(T.XmlName("Prefix")));
export type ScopePermission =
  | "GetObject"
  | "GetObjectAttributes"
  | "ListMultipartUploadParts"
  | "ListBucket"
  | "ListBucketMultipartUploads"
  | "PutObject"
  | "DeleteObject"
  | "AbortMultipartUpload";
export const ScopePermission = S.Literal(
  "GetObject",
  "GetObjectAttributes",
  "ListMultipartUploadParts",
  "ListBucket",
  "ListBucketMultipartUploads",
  "PutObject",
  "DeleteObject",
  "AbortMultipartUpload",
);
export type ScopePermissionList = ScopePermission[];
export const ScopePermissionList = S.Array(
  ScopePermission.pipe(T.XmlName("Permission")),
);
export interface Scope {
  Prefixes?: string[];
  Permissions?: ScopePermission[];
}
export const Scope = S.suspend(() =>
  S.Struct({
    Prefixes: S.optional(PrefixesList).pipe(T.XmlName("Prefixes")),
    Permissions: S.optional(ScopePermissionList).pipe(T.XmlName("Permissions")),
  }),
).annotations({ identifier: "Scope" }) as any as S.Schema<Scope>;
export interface PutAccessPointScopeRequest {
  AccountId: string;
  Name: string;
  Scope: Scope;
}
export const PutAccessPointScopeRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
    Scope: Scope,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/accesspoint/{Name}/scope" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({
        RequiresAccountId: { value: true },
        UseS3ExpressControlEndpoint: { value: true },
      }),
    ),
  ),
).annotations({
  identifier: "PutAccessPointScopeRequest",
}) as any as S.Schema<PutAccessPointScopeRequest>;
export interface PutAccessPointScopeResponse {}
export const PutAccessPointScopeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutAccessPointScopeResponse",
}) as any as S.Schema<PutAccessPointScopeResponse>;
export interface PutBucketPolicyRequest {
  AccountId: string;
  Bucket: string;
  ConfirmRemoveSelfBucketAccess?: boolean;
  Policy: string;
}
export const PutBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ConfirmRemoveSelfBucketAccess: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-confirm-remove-self-bucket-access"),
    ),
    Policy: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/bucket/{Bucket}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketPolicyRequest",
}) as any as S.Schema<PutBucketPolicyRequest>;
export interface PutBucketPolicyResponse {}
export const PutBucketPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketPolicyResponse",
}) as any as S.Schema<PutBucketPolicyResponse>;
export interface S3Tag {
  Key: string;
  Value: string;
}
export const S3Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "S3Tag" }) as any as S.Schema<S3Tag>;
export type S3TagSet = S3Tag[];
export const S3TagSet = S.Array(S3Tag);
export interface PutJobTaggingRequest {
  AccountId: string;
  JobId: string;
  Tags: S3Tag[];
}
export const PutJobTaggingRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
    Tags: S3TagSet,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/jobs/{JobId}/tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutJobTaggingRequest",
}) as any as S.Schema<PutJobTaggingRequest>;
export interface PutJobTaggingResult {}
export const PutJobTaggingResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutJobTaggingResult",
}) as any as S.Schema<PutJobTaggingResult>;
export interface PublicAccessBlockConfiguration {
  BlockPublicAcls?: boolean;
  IgnorePublicAcls?: boolean;
  BlockPublicPolicy?: boolean;
  RestrictPublicBuckets?: boolean;
}
export const PublicAccessBlockConfiguration = S.suspend(() =>
  S.Struct({
    BlockPublicAcls: S.optional(S.Boolean).pipe(T.XmlName("BlockPublicAcls")),
    IgnorePublicAcls: S.optional(S.Boolean).pipe(T.XmlName("IgnorePublicAcls")),
    BlockPublicPolicy: S.optional(S.Boolean).pipe(
      T.XmlName("BlockPublicPolicy"),
    ),
    RestrictPublicBuckets: S.optional(S.Boolean).pipe(
      T.XmlName("RestrictPublicBuckets"),
    ),
  }),
).annotations({
  identifier: "PublicAccessBlockConfiguration",
}) as any as S.Schema<PublicAccessBlockConfiguration>;
export interface PutPublicAccessBlockRequest {
  PublicAccessBlockConfiguration: PublicAccessBlockConfiguration;
  AccountId: string;
}
export const PutPublicAccessBlockRequest = S.suspend(() =>
  S.Struct({
    PublicAccessBlockConfiguration: PublicAccessBlockConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("PublicAccessBlockConfiguration"),
    ).annotations({ identifier: "PublicAccessBlockConfiguration" }),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/v20180820/configuration/publicAccessBlock",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutPublicAccessBlockRequest",
}) as any as S.Schema<PutPublicAccessBlockRequest>;
export interface PutPublicAccessBlockResponse {}
export const PutPublicAccessBlockResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutPublicAccessBlockResponse",
}) as any as S.Schema<PutPublicAccessBlockResponse>;
export interface StorageLensTag {
  Key: string;
  Value: string;
}
export const StorageLensTag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({
  identifier: "StorageLensTag",
}) as any as S.Schema<StorageLensTag>;
export type StorageLensTags = StorageLensTag[];
export const StorageLensTags = S.Array(
  StorageLensTag.pipe(T.XmlName("Tag")).annotations({
    identifier: "StorageLensTag",
  }),
);
export interface PutStorageLensConfigurationTaggingRequest {
  ConfigId: string;
  AccountId: string;
  Tags: StorageLensTag[];
}
export const PutStorageLensConfigurationTaggingRequest = S.suspend(() =>
  S.Struct({
    ConfigId: S.String.pipe(T.HttpLabel("ConfigId")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Tags: StorageLensTags,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/v20180820/storagelens/{ConfigId}/tagging",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutStorageLensConfigurationTaggingRequest",
}) as any as S.Schema<PutStorageLensConfigurationTaggingRequest>;
export interface PutStorageLensConfigurationTaggingResult {}
export const PutStorageLensConfigurationTaggingResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutStorageLensConfigurationTaggingResult",
}) as any as S.Schema<PutStorageLensConfigurationTaggingResult>;
export interface TagResourceRequest {
  AccountId: string;
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.ContextParam("ResourceArn"),
    ),
    Tags: TagList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/tags/{ResourceArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResult {}
export const TagResourceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResult",
}) as any as S.Schema<TagResourceResult>;
export interface UntagResourceRequest {
  AccountId: string;
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.ContextParam("ResourceArn"),
    ),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v20180820/tags/{ResourceArn+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResult {}
export const UntagResourceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResult",
}) as any as S.Schema<UntagResourceResult>;
export interface UpdateAccessGrantsLocationRequest {
  AccountId: string;
  AccessGrantsLocationId: string;
  IAMRoleArn: string;
}
export const UpdateAccessGrantsLocationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    AccessGrantsLocationId: S.String.pipe(
      T.HttpLabel("AccessGrantsLocationId"),
    ),
    IAMRoleArn: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/v20180820/accessgrantsinstance/location/{AccessGrantsLocationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "UpdateAccessGrantsLocationRequest",
}) as any as S.Schema<UpdateAccessGrantsLocationRequest>;
export interface UpdateJobPriorityRequest {
  AccountId: string;
  JobId: string;
  Priority: number;
}
export const UpdateJobPriorityRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
    Priority: S.Number.pipe(T.HttpQuery("priority")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/jobs/{JobId}/priority" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "UpdateJobPriorityRequest",
}) as any as S.Schema<UpdateJobPriorityRequest>;
export interface UpdateJobStatusRequest {
  AccountId: string;
  JobId: string;
  RequestedJobStatus: RequestedJobStatus;
  StatusUpdateReason?: string;
}
export const UpdateJobStatusRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
    RequestedJobStatus: RequestedJobStatus.pipe(
      T.HttpQuery("requestedJobStatus"),
    ),
    StatusUpdateReason: S.optional(S.String).pipe(
      T.HttpQuery("statusUpdateReason"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/jobs/{JobId}/status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "UpdateJobStatusRequest",
}) as any as S.Schema<UpdateJobStatusRequest>;
export type MatchAnyPrefix = string[];
export const MatchAnyPrefix = S.Array(S.String.pipe(T.XmlName("Prefix")));
export type MatchAnySuffix = string[];
export const MatchAnySuffix = S.Array(S.String.pipe(T.XmlName("Suffix")));
export type MatchAnyTag = S3Tag[];
export const MatchAnyTag = S.Array(
  S3Tag.pipe(T.XmlName("Tag")).annotations({ identifier: "S3Tag" }),
);
export interface MatchObjectAge {
  DaysGreaterThan?: number;
  DaysLessThan?: number;
}
export const MatchObjectAge = S.suspend(() =>
  S.Struct({
    DaysGreaterThan: S.optional(S.Number),
    DaysLessThan: S.optional(S.Number),
  }),
).annotations({
  identifier: "MatchObjectAge",
}) as any as S.Schema<MatchObjectAge>;
export interface MatchObjectSize {
  BytesGreaterThan?: number;
  BytesLessThan?: number;
}
export const MatchObjectSize = S.suspend(() =>
  S.Struct({
    BytesGreaterThan: S.optional(S.Number),
    BytesLessThan: S.optional(S.Number),
  }),
).annotations({
  identifier: "MatchObjectSize",
}) as any as S.Schema<MatchObjectSize>;
export interface StorageLensGroupAndOperator {
  MatchAnyPrefix?: string[];
  MatchAnySuffix?: string[];
  MatchAnyTag?: S3Tag[];
  MatchObjectAge?: MatchObjectAge;
  MatchObjectSize?: MatchObjectSize;
}
export const StorageLensGroupAndOperator = S.suspend(() =>
  S.Struct({
    MatchAnyPrefix: S.optional(MatchAnyPrefix),
    MatchAnySuffix: S.optional(MatchAnySuffix),
    MatchAnyTag: S.optional(MatchAnyTag),
    MatchObjectAge: S.optional(MatchObjectAge),
    MatchObjectSize: S.optional(MatchObjectSize),
  }),
).annotations({
  identifier: "StorageLensGroupAndOperator",
}) as any as S.Schema<StorageLensGroupAndOperator>;
export interface StorageLensGroupOrOperator {
  MatchAnyPrefix?: string[];
  MatchAnySuffix?: string[];
  MatchAnyTag?: S3Tag[];
  MatchObjectAge?: MatchObjectAge;
  MatchObjectSize?: MatchObjectSize;
}
export const StorageLensGroupOrOperator = S.suspend(() =>
  S.Struct({
    MatchAnyPrefix: S.optional(MatchAnyPrefix),
    MatchAnySuffix: S.optional(MatchAnySuffix),
    MatchAnyTag: S.optional(MatchAnyTag),
    MatchObjectAge: S.optional(MatchObjectAge),
    MatchObjectSize: S.optional(MatchObjectSize),
  }),
).annotations({
  identifier: "StorageLensGroupOrOperator",
}) as any as S.Schema<StorageLensGroupOrOperator>;
export interface StorageLensGroupFilter {
  MatchAnyPrefix?: string[];
  MatchAnySuffix?: string[];
  MatchAnyTag?: S3Tag[];
  MatchObjectAge?: MatchObjectAge;
  MatchObjectSize?: MatchObjectSize;
  And?: StorageLensGroupAndOperator;
  Or?: StorageLensGroupOrOperator;
}
export const StorageLensGroupFilter = S.suspend(() =>
  S.Struct({
    MatchAnyPrefix: S.optional(MatchAnyPrefix),
    MatchAnySuffix: S.optional(MatchAnySuffix),
    MatchAnyTag: S.optional(MatchAnyTag),
    MatchObjectAge: S.optional(MatchObjectAge),
    MatchObjectSize: S.optional(MatchObjectSize),
    And: S.optional(StorageLensGroupAndOperator),
    Or: S.optional(StorageLensGroupOrOperator),
  }),
).annotations({
  identifier: "StorageLensGroupFilter",
}) as any as S.Schema<StorageLensGroupFilter>;
export interface StorageLensGroup {
  Name: string;
  Filter: StorageLensGroupFilter;
  StorageLensGroupArn?: string;
}
export const StorageLensGroup = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Filter: StorageLensGroupFilter,
    StorageLensGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "StorageLensGroup",
}) as any as S.Schema<StorageLensGroup>;
export interface UpdateStorageLensGroupRequest {
  Name: string;
  AccountId: string;
  StorageLensGroup: StorageLensGroup;
}
export const UpdateStorageLensGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    StorageLensGroup: StorageLensGroup,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/storagelensgroup/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "UpdateStorageLensGroupRequest",
}) as any as S.Schema<UpdateStorageLensGroupRequest>;
export interface UpdateStorageLensGroupResponse {}
export const UpdateStorageLensGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateStorageLensGroupResponse",
}) as any as S.Schema<UpdateStorageLensGroupResponse>;
export type BucketLocationConstraint =
  | "EU"
  | "eu-west-1"
  | "us-west-1"
  | "us-west-2"
  | "ap-south-1"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-northeast-1"
  | "sa-east-1"
  | "cn-north-1"
  | "eu-central-1";
export const BucketLocationConstraint = S.Literal(
  "EU",
  "eu-west-1",
  "us-west-1",
  "us-west-2",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "sa-east-1",
  "cn-north-1",
  "eu-central-1",
);
export interface S3DeleteObjectTaggingOperation {}
export const S3DeleteObjectTaggingOperation = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "S3DeleteObjectTaggingOperation",
}) as any as S.Schema<S3DeleteObjectTaggingOperation>;
export interface S3ReplicateObjectOperation {}
export const S3ReplicateObjectOperation = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "S3ReplicateObjectOperation",
}) as any as S.Schema<S3ReplicateObjectOperation>;
export type JobReportFormat = "Report_CSV_20180820";
export const JobReportFormat = S.Literal("Report_CSV_20180820");
export type JobReportScope = "AllTasks" | "FailedTasksOnly";
export const JobReportScope = S.Literal("AllTasks", "FailedTasksOnly");
export type MFADelete = "Enabled" | "Disabled";
export const MFADelete = S.Literal("Enabled", "Disabled");
export type BucketVersioningStatus = "Enabled" | "Suspended";
export const BucketVersioningStatus = S.Literal("Enabled", "Suspended");
export interface AccessGrantsLocationConfiguration {
  S3SubPrefix?: string;
}
export const AccessGrantsLocationConfiguration = S.suspend(() =>
  S.Struct({ S3SubPrefix: S.optional(S.String) }),
).annotations({
  identifier: "AccessGrantsLocationConfiguration",
}) as any as S.Schema<AccessGrantsLocationConfiguration>;
export interface Grantee {
  GranteeType?: GranteeType;
  GranteeIdentifier?: string;
}
export const Grantee = S.suspend(() =>
  S.Struct({
    GranteeType: S.optional(GranteeType),
    GranteeIdentifier: S.optional(S.String),
  }),
).annotations({ identifier: "Grantee" }) as any as S.Schema<Grantee>;
export interface VpcConfiguration {
  VpcId: string;
}
export const VpcConfiguration = S.suspend(() =>
  S.Struct({ VpcId: S.String }),
).annotations({
  identifier: "VpcConfiguration",
}) as any as S.Schema<VpcConfiguration>;
export interface CreateBucketConfiguration {
  LocationConstraint?: BucketLocationConstraint;
}
export const CreateBucketConfiguration = S.suspend(() =>
  S.Struct({ LocationConstraint: S.optional(BucketLocationConstraint) }),
).annotations({
  identifier: "CreateBucketConfiguration",
}) as any as S.Schema<CreateBucketConfiguration>;
export interface JobReport {
  Bucket?: string;
  Format?: JobReportFormat;
  Enabled: boolean;
  Prefix?: string;
  ReportScope?: JobReportScope;
  ExpectedBucketOwner?: string;
}
export const JobReport = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String),
    Format: S.optional(JobReportFormat),
    Enabled: S.Boolean,
    Prefix: S.optional(S.String),
    ReportScope: S.optional(JobReportScope),
    ExpectedBucketOwner: S.optional(S.String),
  }),
).annotations({ identifier: "JobReport" }) as any as S.Schema<JobReport>;
export interface DeleteMultiRegionAccessPointInput {
  Name: string;
}
export const DeleteMultiRegionAccessPointInput = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "DeleteMultiRegionAccessPointInput",
}) as any as S.Schema<DeleteMultiRegionAccessPointInput>;
export type NetworkOrigin = "Internet" | "VPC";
export const NetworkOrigin = S.Literal("Internet", "VPC");
export type MFADeleteStatus = "Enabled" | "Disabled";
export const MFADeleteStatus = S.Literal("Enabled", "Disabled");
export type MultiRegionAccessPointStatus =
  | "READY"
  | "INCONSISTENT_ACROSS_REGIONS"
  | "CREATING"
  | "PARTIALLY_CREATED"
  | "PARTIALLY_DELETED"
  | "DELETING";
export const MultiRegionAccessPointStatus = S.Literal(
  "READY",
  "INCONSISTENT_ACROSS_REGIONS",
  "CREATING",
  "PARTIALLY_CREATED",
  "PARTIALLY_DELETED",
  "DELETING",
);
export interface RegionReport {
  Bucket?: string;
  Region?: string;
  BucketAccountId?: string;
}
export const RegionReport = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String),
    Region: S.optional(S.String),
    BucketAccountId: S.optional(S.String),
  }),
).annotations({ identifier: "RegionReport" }) as any as S.Schema<RegionReport>;
export type RegionReportList = RegionReport[];
export const RegionReportList = S.Array(
  RegionReport.pipe(T.XmlName("Region")).annotations({
    identifier: "RegionReport",
  }),
);
export interface MultiRegionAccessPointReport {
  Name?: string;
  Alias?: string;
  CreatedAt?: Date;
  PublicAccessBlock?: PublicAccessBlockConfiguration;
  Status?: MultiRegionAccessPointStatus;
  Regions?: RegionReport[];
}
export const MultiRegionAccessPointReport = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Alias: S.optional(S.String),
    CreatedAt: S.optional(S.Date),
    PublicAccessBlock: S.optional(PublicAccessBlockConfiguration),
    Status: S.optional(MultiRegionAccessPointStatus),
    Regions: S.optional(RegionReportList),
  }),
).annotations({
  identifier: "MultiRegionAccessPointReport",
}) as any as S.Schema<MultiRegionAccessPointReport>;
export type MultiRegionAccessPointReportList = MultiRegionAccessPointReport[];
export const MultiRegionAccessPointReportList = S.Array(
  MultiRegionAccessPointReport.pipe(T.XmlName("AccessPoint")).annotations({
    identifier: "MultiRegionAccessPointReport",
  }),
);
export interface Tagging {
  TagSet: S3Tag[];
}
export const Tagging = S.suspend(() =>
  S.Struct({ TagSet: S3TagSet }),
).annotations({ identifier: "Tagging" }) as any as S.Schema<Tagging>;
export interface VersioningConfiguration {
  MFADelete?: MFADelete;
  Status?: BucketVersioningStatus;
}
export const VersioningConfiguration = S.suspend(() =>
  S.Struct({
    MFADelete: S.optional(MFADelete).pipe(T.XmlName("MfaDelete")),
    Status: S.optional(BucketVersioningStatus),
  }),
).annotations({
  identifier: "VersioningConfiguration",
}) as any as S.Schema<VersioningConfiguration>;
export interface PutMultiRegionAccessPointPolicyInput {
  Name: string;
  Policy: string;
}
export const PutMultiRegionAccessPointPolicyInput = S.suspend(() =>
  S.Struct({ Name: S.String, Policy: S.String }),
).annotations({
  identifier: "PutMultiRegionAccessPointPolicyInput",
}) as any as S.Schema<PutMultiRegionAccessPointPolicyInput>;
export interface MultiRegionAccessPointRoute {
  Bucket?: string;
  Region?: string;
  TrafficDialPercentage: number;
}
export const MultiRegionAccessPointRoute = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String),
    Region: S.optional(S.String),
    TrafficDialPercentage: S.Number,
  }),
).annotations({
  identifier: "MultiRegionAccessPointRoute",
}) as any as S.Schema<MultiRegionAccessPointRoute>;
export type RouteList = MultiRegionAccessPointRoute[];
export const RouteList = S.Array(
  MultiRegionAccessPointRoute.pipe(T.XmlName("Route")).annotations({
    identifier: "MultiRegionAccessPointRoute",
  }),
);
export type S3CannedAccessControlList =
  | "private"
  | "public-read"
  | "public-read-write"
  | "aws-exec-read"
  | "authenticated-read"
  | "bucket-owner-read"
  | "bucket-owner-full-control";
export const S3CannedAccessControlList = S.Literal(
  "private",
  "public-read",
  "public-read-write",
  "aws-exec-read",
  "authenticated-read",
  "bucket-owner-read",
  "bucket-owner-full-control",
);
export type S3MetadataDirective = "COPY" | "REPLACE";
export const S3MetadataDirective = S.Literal("COPY", "REPLACE");
export type S3StorageClass =
  | "STANDARD"
  | "STANDARD_IA"
  | "ONEZONE_IA"
  | "GLACIER"
  | "INTELLIGENT_TIERING"
  | "DEEP_ARCHIVE"
  | "GLACIER_IR";
export const S3StorageClass = S.Literal(
  "STANDARD",
  "STANDARD_IA",
  "ONEZONE_IA",
  "GLACIER",
  "INTELLIGENT_TIERING",
  "DEEP_ARCHIVE",
  "GLACIER_IR",
);
export type S3ObjectLockLegalHoldStatus = "OFF" | "ON";
export const S3ObjectLockLegalHoldStatus = S.Literal("OFF", "ON");
export type S3ObjectLockMode = "COMPLIANCE" | "GOVERNANCE";
export const S3ObjectLockMode = S.Literal("COMPLIANCE", "GOVERNANCE");
export type S3ChecksumAlgorithm =
  | "CRC32"
  | "CRC32C"
  | "SHA1"
  | "SHA256"
  | "CRC64NVME";
export const S3ChecksumAlgorithm = S.Literal(
  "CRC32",
  "CRC32C",
  "SHA1",
  "SHA256",
  "CRC64NVME",
);
export type S3GlacierJobTier = "BULK" | "STANDARD";
export const S3GlacierJobTier = S.Literal("BULK", "STANDARD");
export type ComputeObjectChecksumAlgorithm =
  | "CRC32"
  | "CRC32C"
  | "CRC64NVME"
  | "MD5"
  | "SHA1"
  | "SHA256";
export const ComputeObjectChecksumAlgorithm = S.Literal(
  "CRC32",
  "CRC32C",
  "CRC64NVME",
  "MD5",
  "SHA1",
  "SHA256",
);
export type ComputeObjectChecksumType = "FULL_OBJECT" | "COMPOSITE";
export const ComputeObjectChecksumType = S.Literal("FULL_OBJECT", "COMPOSITE");
export type JobManifestFormat =
  | "S3BatchOperations_CSV_20180820"
  | "S3InventoryReport_CSV_20161130";
export const JobManifestFormat = S.Literal(
  "S3BatchOperations_CSV_20180820",
  "S3InventoryReport_CSV_20161130",
);
export type JobManifestFieldName = "Ignore" | "Bucket" | "Key" | "VersionId";
export const JobManifestFieldName = S.Literal(
  "Ignore",
  "Bucket",
  "Key",
  "VersionId",
);
export type JobManifestFieldList = JobManifestFieldName[];
export const JobManifestFieldList = S.Array(JobManifestFieldName);
export type ExpirationStatus = "Enabled" | "Disabled";
export const ExpirationStatus = S.Literal("Enabled", "Disabled");
export type ReplicationRuleStatus = "Enabled" | "Disabled";
export const ReplicationRuleStatus = S.Literal("Enabled", "Disabled");
export type Buckets = string[];
export const Buckets = S.Array(S.String.pipe(T.XmlName("Arn")));
export type Regions = string[];
export const Regions = S.Array(S.String.pipe(T.XmlName("Region")));
export interface CreateAccessGrantRequest {
  AccountId: string;
  AccessGrantsLocationId: string;
  AccessGrantsLocationConfiguration?: AccessGrantsLocationConfiguration;
  Grantee: Grantee;
  Permission: Permission;
  ApplicationArn?: string;
  S3PrefixType?: S3PrefixType;
  Tags?: Tag[];
}
export const CreateAccessGrantRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    AccessGrantsLocationId: S.String,
    AccessGrantsLocationConfiguration: S.optional(
      AccessGrantsLocationConfiguration,
    ),
    Grantee: Grantee,
    Permission: Permission,
    ApplicationArn: S.optional(S.String),
    S3PrefixType: S.optional(S3PrefixType),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/accessgrantsinstance/grant" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateAccessGrantRequest",
}) as any as S.Schema<CreateAccessGrantRequest>;
export interface CreateAccessGrantsInstanceResult {
  CreatedAt?: Date;
  AccessGrantsInstanceId?: string;
  AccessGrantsInstanceArn?: string;
  IdentityCenterArn?: string;
  IdentityCenterInstanceArn?: string;
  IdentityCenterApplicationArn?: string;
}
export const CreateAccessGrantsInstanceResult = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date),
    AccessGrantsInstanceId: S.optional(S.String),
    AccessGrantsInstanceArn: S.optional(S.String),
    IdentityCenterArn: S.optional(S.String),
    IdentityCenterInstanceArn: S.optional(S.String),
    IdentityCenterApplicationArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateAccessGrantsInstanceResult",
}) as any as S.Schema<CreateAccessGrantsInstanceResult>;
export interface CreateAccessGrantsLocationResult {
  CreatedAt?: Date;
  AccessGrantsLocationId?: string;
  AccessGrantsLocationArn?: string;
  LocationScope?: string;
  IAMRoleArn?: string;
}
export const CreateAccessGrantsLocationResult = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date),
    AccessGrantsLocationId: S.optional(S.String),
    AccessGrantsLocationArn: S.optional(S.String),
    LocationScope: S.optional(S.String),
    IAMRoleArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateAccessGrantsLocationResult",
}) as any as S.Schema<CreateAccessGrantsLocationResult>;
export interface CreateAccessPointRequest {
  AccountId: string;
  Name: string;
  Bucket: string;
  VpcConfiguration?: VpcConfiguration;
  PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
  BucketAccountId?: string;
  Scope?: Scope;
  Tags?: Tag[];
}
export const CreateAccessPointRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name"), T.ContextParam("AccessPointName")),
    Bucket: S.String.pipe(T.ContextParam("Bucket")),
    VpcConfiguration: S.optional(VpcConfiguration),
    PublicAccessBlockConfiguration: S.optional(PublicAccessBlockConfiguration),
    BucketAccountId: S.optional(S.String),
    Scope: S.optional(Scope),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/accesspoint/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateAccessPointRequest",
}) as any as S.Schema<CreateAccessPointRequest>;
export interface CreateBucketRequest {
  ACL?: BucketCannedACL;
  Bucket: string;
  CreateBucketConfiguration?: CreateBucketConfiguration;
  GrantFullControl?: string;
  GrantRead?: string;
  GrantReadACP?: string;
  GrantWrite?: string;
  GrantWriteACP?: string;
  ObjectLockEnabledForBucket?: boolean;
  OutpostId?: string;
}
export const CreateBucketRequest = S.suspend(() =>
  S.Struct({
    ACL: S.optional(BucketCannedACL).pipe(T.HttpHeader("x-amz-acl")),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    CreateBucketConfiguration: S.optional(CreateBucketConfiguration)
      .pipe(T.HttpPayload(), T.XmlName("CreateBucketConfiguration"))
      .annotations({ identifier: "CreateBucketConfiguration" }),
    GrantFullControl: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-full-control"),
    ),
    GrantRead: S.optional(S.String).pipe(T.HttpHeader("x-amz-grant-read")),
    GrantReadACP: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-read-acp"),
    ),
    GrantWrite: S.optional(S.String).pipe(T.HttpHeader("x-amz-grant-write")),
    GrantWriteACP: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-write-acp"),
    ),
    ObjectLockEnabledForBucket: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-bucket-object-lock-enabled"),
    ),
    OutpostId: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-outpost-id"),
      T.ContextParam("OutpostId"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/bucket/{Bucket}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBucketRequest",
}) as any as S.Schema<CreateBucketRequest>;
export interface DeleteMultiRegionAccessPointRequest {
  AccountId: string;
  ClientToken: string;
  Details: DeleteMultiRegionAccessPointInput;
}
export const DeleteMultiRegionAccessPointRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Details: DeleteMultiRegionAccessPointInput,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/async-requests/mrap/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteMultiRegionAccessPointRequest",
}) as any as S.Schema<DeleteMultiRegionAccessPointRequest>;
export interface GetAccessGrantResult {
  CreatedAt?: Date;
  AccessGrantId?: string;
  AccessGrantArn?: string;
  Grantee?: Grantee;
  Permission?: Permission;
  AccessGrantsLocationId?: string;
  AccessGrantsLocationConfiguration?: AccessGrantsLocationConfiguration;
  GrantScope?: string;
  ApplicationArn?: string;
}
export const GetAccessGrantResult = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date),
    AccessGrantId: S.optional(S.String),
    AccessGrantArn: S.optional(S.String),
    Grantee: S.optional(Grantee),
    Permission: S.optional(Permission),
    AccessGrantsLocationId: S.optional(S.String),
    AccessGrantsLocationConfiguration: S.optional(
      AccessGrantsLocationConfiguration,
    ),
    GrantScope: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessGrantResult",
}) as any as S.Schema<GetAccessGrantResult>;
export interface GetAccessGrantsInstanceResult {
  AccessGrantsInstanceArn?: string;
  AccessGrantsInstanceId?: string;
  IdentityCenterArn?: string;
  IdentityCenterInstanceArn?: string;
  IdentityCenterApplicationArn?: string;
  CreatedAt?: Date;
}
export const GetAccessGrantsInstanceResult = S.suspend(() =>
  S.Struct({
    AccessGrantsInstanceArn: S.optional(S.String),
    AccessGrantsInstanceId: S.optional(S.String),
    IdentityCenterArn: S.optional(S.String),
    IdentityCenterInstanceArn: S.optional(S.String),
    IdentityCenterApplicationArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessGrantsInstanceResult",
}) as any as S.Schema<GetAccessGrantsInstanceResult>;
export interface GetAccessGrantsInstanceForPrefixResult {
  AccessGrantsInstanceArn?: string;
  AccessGrantsInstanceId?: string;
}
export const GetAccessGrantsInstanceForPrefixResult = S.suspend(() =>
  S.Struct({
    AccessGrantsInstanceArn: S.optional(S.String),
    AccessGrantsInstanceId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessGrantsInstanceForPrefixResult",
}) as any as S.Schema<GetAccessGrantsInstanceForPrefixResult>;
export interface GetAccessGrantsInstanceResourcePolicyResult {
  Policy?: string;
  Organization?: string;
  CreatedAt?: Date;
}
export const GetAccessGrantsInstanceResourcePolicyResult = S.suspend(() =>
  S.Struct({
    Policy: S.optional(S.String),
    Organization: S.optional(S.String),
    CreatedAt: S.optional(S.Date),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessGrantsInstanceResourcePolicyResult",
}) as any as S.Schema<GetAccessGrantsInstanceResourcePolicyResult>;
export interface GetAccessGrantsLocationResult {
  CreatedAt?: Date;
  AccessGrantsLocationId?: string;
  AccessGrantsLocationArn?: string;
  LocationScope?: string;
  IAMRoleArn?: string;
}
export const GetAccessGrantsLocationResult = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date),
    AccessGrantsLocationId: S.optional(S.String),
    AccessGrantsLocationArn: S.optional(S.String),
    LocationScope: S.optional(S.String),
    IAMRoleArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessGrantsLocationResult",
}) as any as S.Schema<GetAccessGrantsLocationResult>;
export interface GetAccessPointConfigurationForObjectLambdaResult {
  Configuration?: ObjectLambdaConfiguration;
}
export const GetAccessPointConfigurationForObjectLambdaResult = S.suspend(() =>
  S.Struct({ Configuration: S.optional(ObjectLambdaConfiguration) }).pipe(ns),
).annotations({
  identifier: "GetAccessPointConfigurationForObjectLambdaResult",
}) as any as S.Schema<GetAccessPointConfigurationForObjectLambdaResult>;
export interface GetAccessPointPolicyResult {
  Policy?: string;
}
export const GetAccessPointPolicyResult = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetAccessPointPolicyResult",
}) as any as S.Schema<GetAccessPointPolicyResult>;
export interface GetAccessPointPolicyForObjectLambdaResult {
  Policy?: string;
}
export const GetAccessPointPolicyForObjectLambdaResult = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetAccessPointPolicyForObjectLambdaResult",
}) as any as S.Schema<GetAccessPointPolicyForObjectLambdaResult>;
export interface PolicyStatus {
  IsPublic?: boolean;
}
export const PolicyStatus = S.suspend(() =>
  S.Struct({ IsPublic: S.optional(S.Boolean).pipe(T.XmlName("IsPublic")) }),
).annotations({ identifier: "PolicyStatus" }) as any as S.Schema<PolicyStatus>;
export interface GetAccessPointPolicyStatusForObjectLambdaResult {
  PolicyStatus?: PolicyStatus;
}
export const GetAccessPointPolicyStatusForObjectLambdaResult = S.suspend(() =>
  S.Struct({ PolicyStatus: S.optional(PolicyStatus) }).pipe(ns),
).annotations({
  identifier: "GetAccessPointPolicyStatusForObjectLambdaResult",
}) as any as S.Schema<GetAccessPointPolicyStatusForObjectLambdaResult>;
export interface GetAccessPointScopeResult {
  Scope?: Scope;
}
export const GetAccessPointScopeResult = S.suspend(() =>
  S.Struct({ Scope: S.optional(Scope) }).pipe(ns),
).annotations({
  identifier: "GetAccessPointScopeResult",
}) as any as S.Schema<GetAccessPointScopeResult>;
export interface GetBucketResult {
  Bucket?: string;
  PublicAccessBlockEnabled?: boolean;
  CreationDate?: Date;
}
export const GetBucketResult = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String),
    PublicAccessBlockEnabled: S.optional(S.Boolean),
    CreationDate: S.optional(S.Date),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketResult",
}) as any as S.Schema<GetBucketResult>;
export interface LifecycleExpiration {
  Date?: Date;
  Days?: number;
  ExpiredObjectDeleteMarker?: boolean;
}
export const LifecycleExpiration = S.suspend(() =>
  S.Struct({
    Date: S.optional(S.Date),
    Days: S.optional(S.Number),
    ExpiredObjectDeleteMarker: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LifecycleExpiration",
}) as any as S.Schema<LifecycleExpiration>;
export interface LifecycleRuleAndOperator {
  Prefix?: string;
  Tags?: S3Tag[];
  ObjectSizeGreaterThan?: number;
  ObjectSizeLessThan?: number;
}
export const LifecycleRuleAndOperator = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tags: S.optional(S3TagSet),
    ObjectSizeGreaterThan: S.optional(S.Number),
    ObjectSizeLessThan: S.optional(S.Number),
  }),
).annotations({
  identifier: "LifecycleRuleAndOperator",
}) as any as S.Schema<LifecycleRuleAndOperator>;
export interface LifecycleRuleFilter {
  Prefix?: string;
  Tag?: S3Tag;
  And?: LifecycleRuleAndOperator;
  ObjectSizeGreaterThan?: number;
  ObjectSizeLessThan?: number;
}
export const LifecycleRuleFilter = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tag: S.optional(S3Tag),
    And: S.optional(LifecycleRuleAndOperator),
    ObjectSizeGreaterThan: S.optional(S.Number),
    ObjectSizeLessThan: S.optional(S.Number),
  }),
).annotations({
  identifier: "LifecycleRuleFilter",
}) as any as S.Schema<LifecycleRuleFilter>;
export type TransitionStorageClass =
  | "GLACIER"
  | "STANDARD_IA"
  | "ONEZONE_IA"
  | "INTELLIGENT_TIERING"
  | "DEEP_ARCHIVE";
export const TransitionStorageClass = S.Literal(
  "GLACIER",
  "STANDARD_IA",
  "ONEZONE_IA",
  "INTELLIGENT_TIERING",
  "DEEP_ARCHIVE",
);
export interface Transition {
  Date?: Date;
  Days?: number;
  StorageClass?: TransitionStorageClass;
}
export const Transition = S.suspend(() =>
  S.Struct({
    Date: S.optional(S.Date),
    Days: S.optional(S.Number),
    StorageClass: S.optional(TransitionStorageClass),
  }),
).annotations({ identifier: "Transition" }) as any as S.Schema<Transition>;
export type TransitionList = Transition[];
export const TransitionList = S.Array(
  Transition.pipe(T.XmlName("Transition")).annotations({
    identifier: "Transition",
  }),
);
export interface NoncurrentVersionTransition {
  NoncurrentDays?: number;
  StorageClass?: TransitionStorageClass;
}
export const NoncurrentVersionTransition = S.suspend(() =>
  S.Struct({
    NoncurrentDays: S.optional(S.Number),
    StorageClass: S.optional(TransitionStorageClass),
  }),
).annotations({
  identifier: "NoncurrentVersionTransition",
}) as any as S.Schema<NoncurrentVersionTransition>;
export type NoncurrentVersionTransitionList = NoncurrentVersionTransition[];
export const NoncurrentVersionTransitionList = S.Array(
  NoncurrentVersionTransition.pipe(
    T.XmlName("NoncurrentVersionTransition"),
  ).annotations({ identifier: "NoncurrentVersionTransition" }),
);
export interface NoncurrentVersionExpiration {
  NoncurrentDays?: number;
  NewerNoncurrentVersions?: number;
}
export const NoncurrentVersionExpiration = S.suspend(() =>
  S.Struct({
    NoncurrentDays: S.optional(S.Number),
    NewerNoncurrentVersions: S.optional(S.Number),
  }),
).annotations({
  identifier: "NoncurrentVersionExpiration",
}) as any as S.Schema<NoncurrentVersionExpiration>;
export interface AbortIncompleteMultipartUpload {
  DaysAfterInitiation?: number;
}
export const AbortIncompleteMultipartUpload = S.suspend(() =>
  S.Struct({ DaysAfterInitiation: S.optional(S.Number) }),
).annotations({
  identifier: "AbortIncompleteMultipartUpload",
}) as any as S.Schema<AbortIncompleteMultipartUpload>;
export interface LifecycleRule {
  Expiration?: LifecycleExpiration;
  ID?: string;
  Filter?: LifecycleRuleFilter;
  Status: ExpirationStatus;
  Transitions?: Transition[];
  NoncurrentVersionTransitions?: NoncurrentVersionTransition[];
  NoncurrentVersionExpiration?: NoncurrentVersionExpiration;
  AbortIncompleteMultipartUpload?: AbortIncompleteMultipartUpload;
}
export const LifecycleRule = S.suspend(() =>
  S.Struct({
    Expiration: S.optional(LifecycleExpiration),
    ID: S.optional(S.String),
    Filter: S.optional(LifecycleRuleFilter),
    Status: ExpirationStatus,
    Transitions: S.optional(TransitionList),
    NoncurrentVersionTransitions: S.optional(NoncurrentVersionTransitionList),
    NoncurrentVersionExpiration: S.optional(NoncurrentVersionExpiration),
    AbortIncompleteMultipartUpload: S.optional(AbortIncompleteMultipartUpload),
  }),
).annotations({
  identifier: "LifecycleRule",
}) as any as S.Schema<LifecycleRule>;
export type LifecycleRules = LifecycleRule[];
export const LifecycleRules = S.Array(
  LifecycleRule.pipe(T.XmlName("Rule")).annotations({
    identifier: "LifecycleRule",
  }),
);
export interface GetBucketLifecycleConfigurationResult {
  Rules?: LifecycleRule[];
}
export const GetBucketLifecycleConfigurationResult = S.suspend(() =>
  S.Struct({ Rules: S.optional(LifecycleRules) }).pipe(ns),
).annotations({
  identifier: "GetBucketLifecycleConfigurationResult",
}) as any as S.Schema<GetBucketLifecycleConfigurationResult>;
export interface GetBucketPolicyResult {
  Policy?: string;
}
export const GetBucketPolicyResult = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetBucketPolicyResult",
}) as any as S.Schema<GetBucketPolicyResult>;
export interface ReplicationRuleAndOperator {
  Prefix?: string;
  Tags?: S3Tag[];
}
export const ReplicationRuleAndOperator = S.suspend(() =>
  S.Struct({ Prefix: S.optional(S.String), Tags: S.optional(S3TagSet) }),
).annotations({
  identifier: "ReplicationRuleAndOperator",
}) as any as S.Schema<ReplicationRuleAndOperator>;
export interface ReplicationRuleFilter {
  Prefix?: string;
  Tag?: S3Tag;
  And?: ReplicationRuleAndOperator;
}
export const ReplicationRuleFilter = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tag: S.optional(S3Tag),
    And: S.optional(ReplicationRuleAndOperator),
  }),
).annotations({
  identifier: "ReplicationRuleFilter",
}) as any as S.Schema<ReplicationRuleFilter>;
export type SseKmsEncryptedObjectsStatus = "Enabled" | "Disabled";
export const SseKmsEncryptedObjectsStatus = S.Literal("Enabled", "Disabled");
export interface SseKmsEncryptedObjects {
  Status: SseKmsEncryptedObjectsStatus;
}
export const SseKmsEncryptedObjects = S.suspend(() =>
  S.Struct({ Status: SseKmsEncryptedObjectsStatus }),
).annotations({
  identifier: "SseKmsEncryptedObjects",
}) as any as S.Schema<SseKmsEncryptedObjects>;
export type ReplicaModificationsStatus = "Enabled" | "Disabled";
export const ReplicaModificationsStatus = S.Literal("Enabled", "Disabled");
export interface ReplicaModifications {
  Status: ReplicaModificationsStatus;
}
export const ReplicaModifications = S.suspend(() =>
  S.Struct({ Status: ReplicaModificationsStatus }),
).annotations({
  identifier: "ReplicaModifications",
}) as any as S.Schema<ReplicaModifications>;
export interface SourceSelectionCriteria {
  SseKmsEncryptedObjects?: SseKmsEncryptedObjects;
  ReplicaModifications?: ReplicaModifications;
}
export const SourceSelectionCriteria = S.suspend(() =>
  S.Struct({
    SseKmsEncryptedObjects: S.optional(SseKmsEncryptedObjects),
    ReplicaModifications: S.optional(ReplicaModifications),
  }),
).annotations({
  identifier: "SourceSelectionCriteria",
}) as any as S.Schema<SourceSelectionCriteria>;
export type ExistingObjectReplicationStatus = "Enabled" | "Disabled";
export const ExistingObjectReplicationStatus = S.Literal("Enabled", "Disabled");
export interface ExistingObjectReplication {
  Status: ExistingObjectReplicationStatus;
}
export const ExistingObjectReplication = S.suspend(() =>
  S.Struct({ Status: ExistingObjectReplicationStatus }),
).annotations({
  identifier: "ExistingObjectReplication",
}) as any as S.Schema<ExistingObjectReplication>;
export type ReplicationTimeStatus = "Enabled" | "Disabled";
export const ReplicationTimeStatus = S.Literal("Enabled", "Disabled");
export interface ReplicationTimeValue {
  Minutes?: number;
}
export const ReplicationTimeValue = S.suspend(() =>
  S.Struct({ Minutes: S.optional(S.Number) }),
).annotations({
  identifier: "ReplicationTimeValue",
}) as any as S.Schema<ReplicationTimeValue>;
export interface ReplicationTime {
  Status: ReplicationTimeStatus;
  Time: ReplicationTimeValue;
}
export const ReplicationTime = S.suspend(() =>
  S.Struct({ Status: ReplicationTimeStatus, Time: ReplicationTimeValue }),
).annotations({
  identifier: "ReplicationTime",
}) as any as S.Schema<ReplicationTime>;
export type OwnerOverride = "Destination";
export const OwnerOverride = S.Literal("Destination");
export interface AccessControlTranslation {
  Owner: OwnerOverride;
}
export const AccessControlTranslation = S.suspend(() =>
  S.Struct({ Owner: OwnerOverride }),
).annotations({
  identifier: "AccessControlTranslation",
}) as any as S.Schema<AccessControlTranslation>;
export interface EncryptionConfiguration {
  ReplicaKmsKeyID?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ ReplicaKmsKeyID: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export type MetricsStatus = "Enabled" | "Disabled";
export const MetricsStatus = S.Literal("Enabled", "Disabled");
export interface Metrics {
  Status: MetricsStatus;
  EventThreshold?: ReplicationTimeValue;
}
export const Metrics = S.suspend(() =>
  S.Struct({
    Status: MetricsStatus,
    EventThreshold: S.optional(ReplicationTimeValue),
  }),
).annotations({ identifier: "Metrics" }) as any as S.Schema<Metrics>;
export type ReplicationStorageClass =
  | "STANDARD"
  | "REDUCED_REDUNDANCY"
  | "STANDARD_IA"
  | "ONEZONE_IA"
  | "INTELLIGENT_TIERING"
  | "GLACIER"
  | "DEEP_ARCHIVE"
  | "OUTPOSTS"
  | "GLACIER_IR";
export const ReplicationStorageClass = S.Literal(
  "STANDARD",
  "REDUCED_REDUNDANCY",
  "STANDARD_IA",
  "ONEZONE_IA",
  "INTELLIGENT_TIERING",
  "GLACIER",
  "DEEP_ARCHIVE",
  "OUTPOSTS",
  "GLACIER_IR",
);
export interface Destination {
  Account?: string;
  Bucket: string;
  ReplicationTime?: ReplicationTime;
  AccessControlTranslation?: AccessControlTranslation;
  EncryptionConfiguration?: EncryptionConfiguration;
  Metrics?: Metrics;
  StorageClass?: ReplicationStorageClass;
}
export const Destination = S.suspend(() =>
  S.Struct({
    Account: S.optional(S.String),
    Bucket: S.String,
    ReplicationTime: S.optional(ReplicationTime),
    AccessControlTranslation: S.optional(AccessControlTranslation),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    Metrics: S.optional(Metrics),
    StorageClass: S.optional(ReplicationStorageClass),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export type DeleteMarkerReplicationStatus = "Enabled" | "Disabled";
export const DeleteMarkerReplicationStatus = S.Literal("Enabled", "Disabled");
export interface DeleteMarkerReplication {
  Status: DeleteMarkerReplicationStatus;
}
export const DeleteMarkerReplication = S.suspend(() =>
  S.Struct({ Status: DeleteMarkerReplicationStatus }),
).annotations({
  identifier: "DeleteMarkerReplication",
}) as any as S.Schema<DeleteMarkerReplication>;
export interface ReplicationRule {
  ID?: string;
  Priority?: number;
  Prefix?: string;
  Filter?: ReplicationRuleFilter;
  Status: ReplicationRuleStatus;
  SourceSelectionCriteria?: SourceSelectionCriteria;
  ExistingObjectReplication?: ExistingObjectReplication;
  Destination: Destination;
  DeleteMarkerReplication?: DeleteMarkerReplication;
  Bucket: string;
}
export const ReplicationRule = S.suspend(() =>
  S.Struct({
    ID: S.optional(S.String),
    Priority: S.optional(S.Number),
    Prefix: S.optional(S.String),
    Filter: S.optional(ReplicationRuleFilter),
    Status: ReplicationRuleStatus,
    SourceSelectionCriteria: S.optional(SourceSelectionCriteria),
    ExistingObjectReplication: S.optional(ExistingObjectReplication),
    Destination: Destination,
    DeleteMarkerReplication: S.optional(DeleteMarkerReplication),
    Bucket: S.String,
  }),
).annotations({
  identifier: "ReplicationRule",
}) as any as S.Schema<ReplicationRule>;
export type ReplicationRules = ReplicationRule[];
export const ReplicationRules = S.Array(
  ReplicationRule.pipe(T.XmlName("Rule")).annotations({
    identifier: "ReplicationRule",
  }),
);
export interface ReplicationConfiguration {
  Role: string;
  Rules: ReplicationRule[];
}
export const ReplicationConfiguration = S.suspend(() =>
  S.Struct({ Role: S.String, Rules: ReplicationRules }),
).annotations({
  identifier: "ReplicationConfiguration",
}) as any as S.Schema<ReplicationConfiguration>;
export interface GetBucketReplicationResult {
  ReplicationConfiguration?: ReplicationConfiguration;
}
export const GetBucketReplicationResult = S.suspend(() =>
  S.Struct({
    ReplicationConfiguration: S.optional(ReplicationConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketReplicationResult",
}) as any as S.Schema<GetBucketReplicationResult>;
export interface GetBucketTaggingResult {
  TagSet: S3Tag[];
}
export const GetBucketTaggingResult = S.suspend(() =>
  S.Struct({ TagSet: S3TagSet }).pipe(ns),
).annotations({
  identifier: "GetBucketTaggingResult",
}) as any as S.Schema<GetBucketTaggingResult>;
export interface GetBucketVersioningResult {
  Status?: BucketVersioningStatus;
  MFADelete?: MFADeleteStatus;
}
export const GetBucketVersioningResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(BucketVersioningStatus),
    MFADelete: S.optional(MFADeleteStatus).pipe(T.XmlName("MfaDelete")),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketVersioningResult",
}) as any as S.Schema<GetBucketVersioningResult>;
export interface GetJobTaggingResult {
  Tags?: S3Tag[];
}
export const GetJobTaggingResult = S.suspend(() =>
  S.Struct({ Tags: S.optional(S3TagSet) }).pipe(ns),
).annotations({
  identifier: "GetJobTaggingResult",
}) as any as S.Schema<GetJobTaggingResult>;
export interface GetMultiRegionAccessPointPolicyStatusResult {
  Established?: PolicyStatus;
}
export const GetMultiRegionAccessPointPolicyStatusResult = S.suspend(() =>
  S.Struct({ Established: S.optional(PolicyStatus) }).pipe(ns),
).annotations({
  identifier: "GetMultiRegionAccessPointPolicyStatusResult",
}) as any as S.Schema<GetMultiRegionAccessPointPolicyStatusResult>;
export interface GetMultiRegionAccessPointRoutesResult {
  Mrap?: string;
  Routes?: MultiRegionAccessPointRoute[];
}
export const GetMultiRegionAccessPointRoutesResult = S.suspend(() =>
  S.Struct({ Mrap: S.optional(S.String), Routes: S.optional(RouteList) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetMultiRegionAccessPointRoutesResult",
}) as any as S.Schema<GetMultiRegionAccessPointRoutesResult>;
export interface GetPublicAccessBlockOutput {
  PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
}
export const GetPublicAccessBlockOutput = S.suspend(() =>
  S.Struct({
    PublicAccessBlockConfiguration: S.optional(PublicAccessBlockConfiguration)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PublicAccessBlockConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetPublicAccessBlockOutput",
}) as any as S.Schema<GetPublicAccessBlockOutput>;
export interface ActivityMetrics {
  IsEnabled?: boolean;
}
export const ActivityMetrics = S.suspend(() =>
  S.Struct({ IsEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "ActivityMetrics",
}) as any as S.Schema<ActivityMetrics>;
export interface SelectionCriteria {
  Delimiter?: string;
  MaxDepth?: number;
  MinStorageBytesPercentage?: number;
}
export const SelectionCriteria = S.suspend(() =>
  S.Struct({
    Delimiter: S.optional(S.String),
    MaxDepth: S.optional(S.Number),
    MinStorageBytesPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "SelectionCriteria",
}) as any as S.Schema<SelectionCriteria>;
export interface PrefixLevelStorageMetrics {
  IsEnabled?: boolean;
  SelectionCriteria?: SelectionCriteria;
}
export const PrefixLevelStorageMetrics = S.suspend(() =>
  S.Struct({
    IsEnabled: S.optional(S.Boolean),
    SelectionCriteria: S.optional(SelectionCriteria),
  }),
).annotations({
  identifier: "PrefixLevelStorageMetrics",
}) as any as S.Schema<PrefixLevelStorageMetrics>;
export interface PrefixLevel {
  StorageMetrics: PrefixLevelStorageMetrics;
}
export const PrefixLevel = S.suspend(() =>
  S.Struct({ StorageMetrics: PrefixLevelStorageMetrics }),
).annotations({ identifier: "PrefixLevel" }) as any as S.Schema<PrefixLevel>;
export interface AdvancedCostOptimizationMetrics {
  IsEnabled?: boolean;
}
export const AdvancedCostOptimizationMetrics = S.suspend(() =>
  S.Struct({ IsEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AdvancedCostOptimizationMetrics",
}) as any as S.Schema<AdvancedCostOptimizationMetrics>;
export interface AdvancedDataProtectionMetrics {
  IsEnabled?: boolean;
}
export const AdvancedDataProtectionMetrics = S.suspend(() =>
  S.Struct({ IsEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AdvancedDataProtectionMetrics",
}) as any as S.Schema<AdvancedDataProtectionMetrics>;
export interface DetailedStatusCodesMetrics {
  IsEnabled?: boolean;
}
export const DetailedStatusCodesMetrics = S.suspend(() =>
  S.Struct({ IsEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "DetailedStatusCodesMetrics",
}) as any as S.Schema<DetailedStatusCodesMetrics>;
export interface AdvancedPerformanceMetrics {
  IsEnabled?: boolean;
}
export const AdvancedPerformanceMetrics = S.suspend(() =>
  S.Struct({ IsEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AdvancedPerformanceMetrics",
}) as any as S.Schema<AdvancedPerformanceMetrics>;
export interface BucketLevel {
  ActivityMetrics?: ActivityMetrics;
  PrefixLevel?: PrefixLevel;
  AdvancedCostOptimizationMetrics?: AdvancedCostOptimizationMetrics;
  AdvancedDataProtectionMetrics?: AdvancedDataProtectionMetrics;
  DetailedStatusCodesMetrics?: DetailedStatusCodesMetrics;
  AdvancedPerformanceMetrics?: AdvancedPerformanceMetrics;
}
export const BucketLevel = S.suspend(() =>
  S.Struct({
    ActivityMetrics: S.optional(ActivityMetrics),
    PrefixLevel: S.optional(PrefixLevel),
    AdvancedCostOptimizationMetrics: S.optional(
      AdvancedCostOptimizationMetrics,
    ),
    AdvancedDataProtectionMetrics: S.optional(AdvancedDataProtectionMetrics),
    DetailedStatusCodesMetrics: S.optional(DetailedStatusCodesMetrics),
    AdvancedPerformanceMetrics: S.optional(AdvancedPerformanceMetrics),
  }),
).annotations({ identifier: "BucketLevel" }) as any as S.Schema<BucketLevel>;
export type StorageLensGroupLevelInclude = string[];
export const StorageLensGroupLevelInclude = S.Array(
  S.String.pipe(T.XmlName("Arn")),
);
export type StorageLensGroupLevelExclude = string[];
export const StorageLensGroupLevelExclude = S.Array(
  S.String.pipe(T.XmlName("Arn")),
);
export interface StorageLensGroupLevelSelectionCriteria {
  Include?: string[];
  Exclude?: string[];
}
export const StorageLensGroupLevelSelectionCriteria = S.suspend(() =>
  S.Struct({
    Include: S.optional(StorageLensGroupLevelInclude),
    Exclude: S.optional(StorageLensGroupLevelExclude),
  }),
).annotations({
  identifier: "StorageLensGroupLevelSelectionCriteria",
}) as any as S.Schema<StorageLensGroupLevelSelectionCriteria>;
export interface StorageLensGroupLevel {
  SelectionCriteria?: StorageLensGroupLevelSelectionCriteria;
}
export const StorageLensGroupLevel = S.suspend(() =>
  S.Struct({
    SelectionCriteria: S.optional(StorageLensGroupLevelSelectionCriteria),
  }),
).annotations({
  identifier: "StorageLensGroupLevel",
}) as any as S.Schema<StorageLensGroupLevel>;
export interface AccountLevel {
  ActivityMetrics?: ActivityMetrics;
  BucketLevel: BucketLevel;
  AdvancedCostOptimizationMetrics?: AdvancedCostOptimizationMetrics;
  AdvancedDataProtectionMetrics?: AdvancedDataProtectionMetrics;
  DetailedStatusCodesMetrics?: DetailedStatusCodesMetrics;
  AdvancedPerformanceMetrics?: AdvancedPerformanceMetrics;
  StorageLensGroupLevel?: StorageLensGroupLevel;
}
export const AccountLevel = S.suspend(() =>
  S.Struct({
    ActivityMetrics: S.optional(ActivityMetrics),
    BucketLevel: BucketLevel,
    AdvancedCostOptimizationMetrics: S.optional(
      AdvancedCostOptimizationMetrics,
    ),
    AdvancedDataProtectionMetrics: S.optional(AdvancedDataProtectionMetrics),
    DetailedStatusCodesMetrics: S.optional(DetailedStatusCodesMetrics),
    AdvancedPerformanceMetrics: S.optional(AdvancedPerformanceMetrics),
    StorageLensGroupLevel: S.optional(StorageLensGroupLevel),
  }),
).annotations({ identifier: "AccountLevel" }) as any as S.Schema<AccountLevel>;
export interface Include {
  Buckets?: string[];
  Regions?: string[];
}
export const Include = S.suspend(() =>
  S.Struct({ Buckets: S.optional(Buckets), Regions: S.optional(Regions) }),
).annotations({ identifier: "Include" }) as any as S.Schema<Include>;
export interface Exclude {
  Buckets?: string[];
  Regions?: string[];
}
export const Exclude = S.suspend(() =>
  S.Struct({ Buckets: S.optional(Buckets), Regions: S.optional(Regions) }),
).annotations({ identifier: "Exclude" }) as any as S.Schema<Exclude>;
export type Format = "CSV" | "Parquet";
export const Format = S.Literal("CSV", "Parquet");
export type OutputSchemaVersion = "V_1";
export const OutputSchemaVersion = S.Literal("V_1");
export interface SSES3 {}
export const SSES3 = S.suspend(() =>
  S.Struct({}).pipe(T.XmlName("SSE-S3")),
).annotations({ identifier: "SSES3" }) as any as S.Schema<SSES3>;
export interface SSEKMS {
  KeyId: string;
}
export const SSEKMS = S.suspend(() =>
  S.Struct({ KeyId: S.String }).pipe(T.XmlName("SSE-KMS")),
).annotations({ identifier: "SSEKMS" }) as any as S.Schema<SSEKMS>;
export interface StorageLensDataExportEncryption {
  SSES3?: SSES3;
  SSEKMS?: SSEKMS;
}
export const StorageLensDataExportEncryption = S.suspend(() =>
  S.Struct({
    SSES3: S.optional(SSES3)
      .pipe(T.XmlName("SSE-S3"))
      .annotations({ identifier: "SSES3" }),
    SSEKMS: S.optional(SSEKMS)
      .pipe(T.XmlName("SSE-KMS"))
      .annotations({ identifier: "SSEKMS" }),
  }),
).annotations({
  identifier: "StorageLensDataExportEncryption",
}) as any as S.Schema<StorageLensDataExportEncryption>;
export interface S3BucketDestination {
  Format: Format;
  OutputSchemaVersion: OutputSchemaVersion;
  AccountId: string;
  Arn: string;
  Prefix?: string;
  Encryption?: StorageLensDataExportEncryption;
}
export const S3BucketDestination = S.suspend(() =>
  S.Struct({
    Format: Format,
    OutputSchemaVersion: OutputSchemaVersion,
    AccountId: S.String,
    Arn: S.String,
    Prefix: S.optional(S.String),
    Encryption: S.optional(StorageLensDataExportEncryption),
  }),
).annotations({
  identifier: "S3BucketDestination",
}) as any as S.Schema<S3BucketDestination>;
export interface CloudWatchMetrics {
  IsEnabled: boolean;
}
export const CloudWatchMetrics = S.suspend(() =>
  S.Struct({ IsEnabled: S.Boolean }),
).annotations({
  identifier: "CloudWatchMetrics",
}) as any as S.Schema<CloudWatchMetrics>;
export interface StorageLensTableDestination {
  IsEnabled: boolean;
  Encryption?: StorageLensDataExportEncryption;
}
export const StorageLensTableDestination = S.suspend(() =>
  S.Struct({
    IsEnabled: S.Boolean,
    Encryption: S.optional(StorageLensDataExportEncryption),
  }),
).annotations({
  identifier: "StorageLensTableDestination",
}) as any as S.Schema<StorageLensTableDestination>;
export interface StorageLensDataExport {
  S3BucketDestination?: S3BucketDestination;
  CloudWatchMetrics?: CloudWatchMetrics;
  StorageLensTableDestination?: StorageLensTableDestination;
}
export const StorageLensDataExport = S.suspend(() =>
  S.Struct({
    S3BucketDestination: S.optional(S3BucketDestination),
    CloudWatchMetrics: S.optional(CloudWatchMetrics),
    StorageLensTableDestination: S.optional(StorageLensTableDestination),
  }),
).annotations({
  identifier: "StorageLensDataExport",
}) as any as S.Schema<StorageLensDataExport>;
export interface StorageLensExpandedPrefixesDataExport {
  S3BucketDestination?: S3BucketDestination;
  StorageLensTableDestination?: StorageLensTableDestination;
}
export const StorageLensExpandedPrefixesDataExport = S.suspend(() =>
  S.Struct({
    S3BucketDestination: S.optional(S3BucketDestination),
    StorageLensTableDestination: S.optional(StorageLensTableDestination),
  }),
).annotations({
  identifier: "StorageLensExpandedPrefixesDataExport",
}) as any as S.Schema<StorageLensExpandedPrefixesDataExport>;
export interface StorageLensAwsOrg {
  Arn: string;
}
export const StorageLensAwsOrg = S.suspend(() =>
  S.Struct({ Arn: S.String }),
).annotations({
  identifier: "StorageLensAwsOrg",
}) as any as S.Schema<StorageLensAwsOrg>;
export interface StorageLensConfiguration {
  Id: string;
  AccountLevel: AccountLevel;
  Include?: Include;
  Exclude?: Exclude;
  DataExport?: StorageLensDataExport;
  ExpandedPrefixesDataExport?: StorageLensExpandedPrefixesDataExport;
  IsEnabled: boolean;
  AwsOrg?: StorageLensAwsOrg;
  StorageLensArn?: string;
  PrefixDelimiter?: string;
}
export const StorageLensConfiguration = S.suspend(() =>
  S.Struct({
    Id: S.String,
    AccountLevel: AccountLevel,
    Include: S.optional(Include),
    Exclude: S.optional(Exclude),
    DataExport: S.optional(StorageLensDataExport),
    ExpandedPrefixesDataExport: S.optional(
      StorageLensExpandedPrefixesDataExport,
    ),
    IsEnabled: S.Boolean,
    AwsOrg: S.optional(StorageLensAwsOrg),
    StorageLensArn: S.optional(S.String),
    PrefixDelimiter: S.optional(S.String),
  }),
).annotations({
  identifier: "StorageLensConfiguration",
}) as any as S.Schema<StorageLensConfiguration>;
export interface GetStorageLensConfigurationResult {
  StorageLensConfiguration?: StorageLensConfiguration;
}
export const GetStorageLensConfigurationResult = S.suspend(() =>
  S.Struct({
    StorageLensConfiguration: S.optional(StorageLensConfiguration)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "StorageLensConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetStorageLensConfigurationResult",
}) as any as S.Schema<GetStorageLensConfigurationResult>;
export interface GetStorageLensConfigurationTaggingResult {
  Tags?: StorageLensTag[];
}
export const GetStorageLensConfigurationTaggingResult = S.suspend(() =>
  S.Struct({ Tags: S.optional(StorageLensTags) }).pipe(ns),
).annotations({
  identifier: "GetStorageLensConfigurationTaggingResult",
}) as any as S.Schema<GetStorageLensConfigurationTaggingResult>;
export interface GetStorageLensGroupResult {
  StorageLensGroup?: StorageLensGroup;
}
export const GetStorageLensGroupResult = S.suspend(() =>
  S.Struct({
    StorageLensGroup: S.optional(StorageLensGroup)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "StorageLensGroup" }),
  }).pipe(ns),
).annotations({
  identifier: "GetStorageLensGroupResult",
}) as any as S.Schema<GetStorageLensGroupResult>;
export interface AccessPoint {
  Name: string;
  NetworkOrigin: NetworkOrigin;
  VpcConfiguration?: VpcConfiguration;
  Bucket: string;
  AccessPointArn?: string;
  Alias?: string;
  BucketAccountId?: string;
  DataSourceId?: string;
  DataSourceType?: string;
}
export const AccessPoint = S.suspend(() =>
  S.Struct({
    Name: S.String,
    NetworkOrigin: NetworkOrigin,
    VpcConfiguration: S.optional(VpcConfiguration),
    Bucket: S.String,
    AccessPointArn: S.optional(S.String),
    Alias: S.optional(S.String),
    BucketAccountId: S.optional(S.String),
    DataSourceId: S.optional(S.String),
    DataSourceType: S.optional(S.String),
  }),
).annotations({ identifier: "AccessPoint" }) as any as S.Schema<AccessPoint>;
export type AccessPointList = AccessPoint[];
export const AccessPointList = S.Array(
  AccessPoint.pipe(T.XmlName("AccessPoint")).annotations({
    identifier: "AccessPoint",
  }),
);
export interface ListAccessPointsForDirectoryBucketsResult {
  AccessPointList?: AccessPoint[];
  NextToken?: string;
}
export const ListAccessPointsForDirectoryBucketsResult = S.suspend(() =>
  S.Struct({
    AccessPointList: S.optional(AccessPointList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccessPointsForDirectoryBucketsResult",
}) as any as S.Schema<ListAccessPointsForDirectoryBucketsResult>;
export interface ListMultiRegionAccessPointsResult {
  AccessPoints?: MultiRegionAccessPointReport[];
  NextToken?: string;
}
export const ListMultiRegionAccessPointsResult = S.suspend(() =>
  S.Struct({
    AccessPoints: S.optional(MultiRegionAccessPointReportList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListMultiRegionAccessPointsResult",
}) as any as S.Schema<ListMultiRegionAccessPointsResult>;
export interface ListTagsForResourceResult {
  Tags?: Tag[];
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export interface PutAccessGrantsInstanceResourcePolicyResult {
  Policy?: string;
  Organization?: string;
  CreatedAt?: Date;
}
export const PutAccessGrantsInstanceResourcePolicyResult = S.suspend(() =>
  S.Struct({
    Policy: S.optional(S.String),
    Organization: S.optional(S.String),
    CreatedAt: S.optional(S.Date),
  }).pipe(ns),
).annotations({
  identifier: "PutAccessGrantsInstanceResourcePolicyResult",
}) as any as S.Schema<PutAccessGrantsInstanceResourcePolicyResult>;
export interface PutBucketTaggingRequest {
  AccountId: string;
  Bucket: string;
  Tagging: Tagging;
}
export const PutBucketTaggingRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Tagging: Tagging.pipe(T.HttpPayload(), T.XmlName("Tagging")).annotations({
      identifier: "Tagging",
    }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/bucket/{Bucket}/tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketTaggingRequest",
}) as any as S.Schema<PutBucketTaggingRequest>;
export interface PutBucketTaggingResponse {}
export const PutBucketTaggingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketTaggingResponse",
}) as any as S.Schema<PutBucketTaggingResponse>;
export interface PutBucketVersioningRequest {
  AccountId: string;
  Bucket: string;
  MFA?: string;
  VersioningConfiguration: VersioningConfiguration;
}
export const PutBucketVersioningRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    MFA: S.optional(S.String).pipe(T.HttpHeader("x-amz-mfa")),
    VersioningConfiguration: VersioningConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("VersioningConfiguration"),
    ).annotations({ identifier: "VersioningConfiguration" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/bucket/{Bucket}/versioning" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketVersioningRequest",
}) as any as S.Schema<PutBucketVersioningRequest>;
export interface PutBucketVersioningResponse {}
export const PutBucketVersioningResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketVersioningResponse",
}) as any as S.Schema<PutBucketVersioningResponse>;
export interface PutMultiRegionAccessPointPolicyRequest {
  AccountId: string;
  ClientToken: string;
  Details: PutMultiRegionAccessPointPolicyInput;
}
export const PutMultiRegionAccessPointPolicyRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Details: PutMultiRegionAccessPointPolicyInput,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/v20180820/async-requests/mrap/put-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutMultiRegionAccessPointPolicyRequest",
}) as any as S.Schema<PutMultiRegionAccessPointPolicyRequest>;
export interface SubmitMultiRegionAccessPointRoutesRequest {
  AccountId: string;
  Mrap: string;
  RouteUpdates: MultiRegionAccessPointRoute[];
}
export const SubmitMultiRegionAccessPointRoutesRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Mrap: S.String.pipe(T.HttpLabel("Mrap")),
    RouteUpdates: RouteList,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PATCH",
        uri: "/v20180820/mrap/instances/{Mrap+}/routes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "SubmitMultiRegionAccessPointRoutesRequest",
}) as any as S.Schema<SubmitMultiRegionAccessPointRoutesRequest>;
export interface SubmitMultiRegionAccessPointRoutesResult {}
export const SubmitMultiRegionAccessPointRoutesResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SubmitMultiRegionAccessPointRoutesResult",
}) as any as S.Schema<SubmitMultiRegionAccessPointRoutesResult>;
export interface UpdateAccessGrantsLocationResult {
  CreatedAt?: Date;
  AccessGrantsLocationId?: string;
  AccessGrantsLocationArn?: string;
  LocationScope?: string;
  IAMRoleArn?: string;
}
export const UpdateAccessGrantsLocationResult = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date),
    AccessGrantsLocationId: S.optional(S.String),
    AccessGrantsLocationArn: S.optional(S.String),
    LocationScope: S.optional(S.String),
    IAMRoleArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateAccessGrantsLocationResult",
}) as any as S.Schema<UpdateAccessGrantsLocationResult>;
export interface UpdateJobPriorityResult {
  JobId: string;
  Priority: number;
}
export const UpdateJobPriorityResult = S.suspend(() =>
  S.Struct({ JobId: S.String, Priority: S.Number }).pipe(ns),
).annotations({
  identifier: "UpdateJobPriorityResult",
}) as any as S.Schema<UpdateJobPriorityResult>;
export interface UpdateJobStatusResult {
  JobId?: string;
  Status?: JobStatus;
  StatusUpdateReason?: string;
}
export const UpdateJobStatusResult = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    Status: S.optional(JobStatus),
    StatusUpdateReason: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateJobStatusResult",
}) as any as S.Schema<UpdateJobStatusResult>;
export interface S3SetObjectTaggingOperation {
  TagSet?: S3Tag[];
}
export const S3SetObjectTaggingOperation = S.suspend(() =>
  S.Struct({ TagSet: S.optional(S3TagSet) }),
).annotations({
  identifier: "S3SetObjectTaggingOperation",
}) as any as S.Schema<S3SetObjectTaggingOperation>;
export interface S3InitiateRestoreObjectOperation {
  ExpirationInDays?: number;
  GlacierJobTier?: S3GlacierJobTier;
}
export const S3InitiateRestoreObjectOperation = S.suspend(() =>
  S.Struct({
    ExpirationInDays: S.optional(S.Number),
    GlacierJobTier: S.optional(S3GlacierJobTier),
  }),
).annotations({
  identifier: "S3InitiateRestoreObjectOperation",
}) as any as S.Schema<S3InitiateRestoreObjectOperation>;
export interface S3ComputeObjectChecksumOperation {
  ChecksumAlgorithm?: ComputeObjectChecksumAlgorithm;
  ChecksumType?: ComputeObjectChecksumType;
}
export const S3ComputeObjectChecksumOperation = S.suspend(() =>
  S.Struct({
    ChecksumAlgorithm: S.optional(ComputeObjectChecksumAlgorithm),
    ChecksumType: S.optional(ComputeObjectChecksumType),
  }),
).annotations({
  identifier: "S3ComputeObjectChecksumOperation",
}) as any as S.Schema<S3ComputeObjectChecksumOperation>;
export interface JobManifestSpec {
  Format: JobManifestFormat;
  Fields?: JobManifestFieldName[];
}
export const JobManifestSpec = S.suspend(() =>
  S.Struct({
    Format: JobManifestFormat,
    Fields: S.optional(JobManifestFieldList),
  }),
).annotations({
  identifier: "JobManifestSpec",
}) as any as S.Schema<JobManifestSpec>;
export interface JobManifestLocation {
  ObjectArn: string;
  ObjectVersionId?: string;
  ETag: string;
}
export const JobManifestLocation = S.suspend(() =>
  S.Struct({
    ObjectArn: S.String,
    ObjectVersionId: S.optional(S.String),
    ETag: S.String,
  }),
).annotations({
  identifier: "JobManifestLocation",
}) as any as S.Schema<JobManifestLocation>;
export interface Region {
  Bucket: string;
  BucketAccountId?: string;
}
export const Region = S.suspend(() =>
  S.Struct({ Bucket: S.String, BucketAccountId: S.optional(S.String) }),
).annotations({ identifier: "Region" }) as any as S.Schema<Region>;
export type RegionCreationList = Region[];
export const RegionCreationList = S.Array(
  Region.pipe(T.XmlName("Region")).annotations({ identifier: "Region" }),
);
export type AsyncOperationName =
  | "CreateMultiRegionAccessPoint"
  | "DeleteMultiRegionAccessPoint"
  | "PutMultiRegionAccessPointPolicy";
export const AsyncOperationName = S.Literal(
  "CreateMultiRegionAccessPoint",
  "DeleteMultiRegionAccessPoint",
  "PutMultiRegionAccessPointPolicy",
);
export type ObjectLambdaAccessPointAliasStatus = "PROVISIONING" | "READY";
export const ObjectLambdaAccessPointAliasStatus = S.Literal(
  "PROVISIONING",
  "READY",
);
export type OperationName =
  | "LambdaInvoke"
  | "S3PutObjectCopy"
  | "S3PutObjectAcl"
  | "S3PutObjectTagging"
  | "S3DeleteObjectTagging"
  | "S3InitiateRestoreObject"
  | "S3PutObjectLegalHold"
  | "S3PutObjectRetention"
  | "S3ReplicateObject"
  | "S3ComputeObjectChecksum";
export const OperationName = S.Literal(
  "LambdaInvoke",
  "S3PutObjectCopy",
  "S3PutObjectAcl",
  "S3PutObjectTagging",
  "S3DeleteObjectTagging",
  "S3InitiateRestoreObject",
  "S3PutObjectLegalHold",
  "S3PutObjectRetention",
  "S3ReplicateObject",
  "S3ComputeObjectChecksum",
);
export type S3Permission =
  | "FULL_CONTROL"
  | "READ"
  | "WRITE"
  | "READ_ACP"
  | "WRITE_ACP";
export const S3Permission = S.Literal(
  "FULL_CONTROL",
  "READ",
  "WRITE",
  "READ_ACP",
  "WRITE_ACP",
);
export type S3SSEAlgorithm = "AES256" | "KMS";
export const S3SSEAlgorithm = S.Literal("AES256", "KMS");
export type S3ObjectLockRetentionMode = "COMPLIANCE" | "GOVERNANCE";
export const S3ObjectLockRetentionMode = S.Literal("COMPLIANCE", "GOVERNANCE");
export type GeneratedManifestFormat = "S3InventoryReport_CSV_20211130";
export const GeneratedManifestFormat = S.Literal(
  "S3InventoryReport_CSV_20211130",
);
export type ReplicationStatus = "COMPLETED" | "FAILED" | "REPLICA" | "NONE";
export const ReplicationStatus = S.Literal(
  "COMPLETED",
  "FAILED",
  "REPLICA",
  "NONE",
);
export type ReplicationStatusFilterList = ReplicationStatus[];
export const ReplicationStatusFilterList = S.Array(ReplicationStatus);
export type StorageClassList = S3StorageClass[];
export const StorageClassList = S.Array(S3StorageClass);
export interface JobManifest {
  Spec: JobManifestSpec;
  Location: JobManifestLocation;
}
export const JobManifest = S.suspend(() =>
  S.Struct({ Spec: JobManifestSpec, Location: JobManifestLocation }),
).annotations({ identifier: "JobManifest" }) as any as S.Schema<JobManifest>;
export interface CreateMultiRegionAccessPointInput {
  Name: string;
  PublicAccessBlock?: PublicAccessBlockConfiguration;
  Regions: Region[];
}
export const CreateMultiRegionAccessPointInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    PublicAccessBlock: S.optional(PublicAccessBlockConfiguration),
    Regions: RegionCreationList,
  }),
).annotations({
  identifier: "CreateMultiRegionAccessPointInput",
}) as any as S.Schema<CreateMultiRegionAccessPointInput>;
export type Endpoints = { [key: string]: string };
export const Endpoints = S.Record({ key: S.String, value: S.String });
export interface ObjectLambdaAccessPointAlias {
  Value?: string;
  Status?: ObjectLambdaAccessPointAliasStatus;
}
export const ObjectLambdaAccessPointAlias = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    Status: S.optional(ObjectLambdaAccessPointAliasStatus),
  }),
).annotations({
  identifier: "ObjectLambdaAccessPointAlias",
}) as any as S.Schema<ObjectLambdaAccessPointAlias>;
export interface Credentials {
  AccessKeyId?: string | redacted.Redacted<string>;
  SecretAccessKey?: string | redacted.Redacted<string>;
  SessionToken?: string | redacted.Redacted<string>;
  Expiration?: Date;
}
export const Credentials = S.suspend(() =>
  S.Struct({
    AccessKeyId: S.optional(SensitiveString),
    SecretAccessKey: S.optional(SensitiveString),
    SessionToken: S.optional(SensitiveString),
    Expiration: S.optional(S.Date),
  }),
).annotations({ identifier: "Credentials" }) as any as S.Schema<Credentials>;
export interface ListAccessGrantEntry {
  CreatedAt?: Date;
  AccessGrantId?: string;
  AccessGrantArn?: string;
  Grantee?: Grantee;
  Permission?: Permission;
  AccessGrantsLocationId?: string;
  AccessGrantsLocationConfiguration?: AccessGrantsLocationConfiguration;
  GrantScope?: string;
  ApplicationArn?: string;
}
export const ListAccessGrantEntry = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date),
    AccessGrantId: S.optional(S.String),
    AccessGrantArn: S.optional(S.String),
    Grantee: S.optional(Grantee),
    Permission: S.optional(Permission),
    AccessGrantsLocationId: S.optional(S.String),
    AccessGrantsLocationConfiguration: S.optional(
      AccessGrantsLocationConfiguration,
    ),
    GrantScope: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessGrantEntry",
}) as any as S.Schema<ListAccessGrantEntry>;
export type AccessGrantsList = ListAccessGrantEntry[];
export const AccessGrantsList = S.Array(
  ListAccessGrantEntry.pipe(T.XmlName("AccessGrant")).annotations({
    identifier: "ListAccessGrantEntry",
  }),
);
export interface ListAccessGrantsInstanceEntry {
  AccessGrantsInstanceId?: string;
  AccessGrantsInstanceArn?: string;
  CreatedAt?: Date;
  IdentityCenterArn?: string;
  IdentityCenterInstanceArn?: string;
  IdentityCenterApplicationArn?: string;
}
export const ListAccessGrantsInstanceEntry = S.suspend(() =>
  S.Struct({
    AccessGrantsInstanceId: S.optional(S.String),
    AccessGrantsInstanceArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date),
    IdentityCenterArn: S.optional(S.String),
    IdentityCenterInstanceArn: S.optional(S.String),
    IdentityCenterApplicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessGrantsInstanceEntry",
}) as any as S.Schema<ListAccessGrantsInstanceEntry>;
export type AccessGrantsInstancesList = ListAccessGrantsInstanceEntry[];
export const AccessGrantsInstancesList = S.Array(
  ListAccessGrantsInstanceEntry.pipe(
    T.XmlName("AccessGrantsInstance"),
  ).annotations({ identifier: "ListAccessGrantsInstanceEntry" }),
);
export interface ListAccessGrantsLocationsEntry {
  CreatedAt?: Date;
  AccessGrantsLocationId?: string;
  AccessGrantsLocationArn?: string;
  LocationScope?: string;
  IAMRoleArn?: string;
}
export const ListAccessGrantsLocationsEntry = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date),
    AccessGrantsLocationId: S.optional(S.String),
    AccessGrantsLocationArn: S.optional(S.String),
    LocationScope: S.optional(S.String),
    IAMRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessGrantsLocationsEntry",
}) as any as S.Schema<ListAccessGrantsLocationsEntry>;
export type AccessGrantsLocationsList = ListAccessGrantsLocationsEntry[];
export const AccessGrantsLocationsList = S.Array(
  ListAccessGrantsLocationsEntry.pipe(
    T.XmlName("AccessGrantsLocation"),
  ).annotations({ identifier: "ListAccessGrantsLocationsEntry" }),
);
export interface ObjectLambdaAccessPoint {
  Name: string;
  ObjectLambdaAccessPointArn?: string;
  Alias?: ObjectLambdaAccessPointAlias;
}
export const ObjectLambdaAccessPoint = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ObjectLambdaAccessPointArn: S.optional(S.String),
    Alias: S.optional(ObjectLambdaAccessPointAlias),
  }),
).annotations({
  identifier: "ObjectLambdaAccessPoint",
}) as any as S.Schema<ObjectLambdaAccessPoint>;
export type ObjectLambdaAccessPointList = ObjectLambdaAccessPoint[];
export const ObjectLambdaAccessPointList = S.Array(
  ObjectLambdaAccessPoint.pipe(
    T.XmlName("ObjectLambdaAccessPoint"),
  ).annotations({ identifier: "ObjectLambdaAccessPoint" }),
);
export interface ListCallerAccessGrantsEntry {
  Permission?: Permission;
  GrantScope?: string;
  ApplicationArn?: string;
}
export const ListCallerAccessGrantsEntry = S.suspend(() =>
  S.Struct({
    Permission: S.optional(Permission),
    GrantScope: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCallerAccessGrantsEntry",
}) as any as S.Schema<ListCallerAccessGrantsEntry>;
export type CallerAccessGrantsList = ListCallerAccessGrantsEntry[];
export const CallerAccessGrantsList = S.Array(
  ListCallerAccessGrantsEntry.pipe(T.XmlName("AccessGrant")).annotations({
    identifier: "ListCallerAccessGrantsEntry",
  }),
);
export interface JobTimers {
  ElapsedTimeInActiveSeconds?: number;
}
export const JobTimers = S.suspend(() =>
  S.Struct({ ElapsedTimeInActiveSeconds: S.optional(S.Number) }),
).annotations({ identifier: "JobTimers" }) as any as S.Schema<JobTimers>;
export interface JobProgressSummary {
  TotalNumberOfTasks?: number;
  NumberOfTasksSucceeded?: number;
  NumberOfTasksFailed?: number;
  Timers?: JobTimers;
}
export const JobProgressSummary = S.suspend(() =>
  S.Struct({
    TotalNumberOfTasks: S.optional(S.Number),
    NumberOfTasksSucceeded: S.optional(S.Number),
    NumberOfTasksFailed: S.optional(S.Number),
    Timers: S.optional(JobTimers),
  }),
).annotations({
  identifier: "JobProgressSummary",
}) as any as S.Schema<JobProgressSummary>;
export interface JobListDescriptor {
  JobId?: string;
  Description?: string;
  Operation?: OperationName;
  Priority?: number;
  Status?: JobStatus;
  CreationTime?: Date;
  TerminationDate?: Date;
  ProgressSummary?: JobProgressSummary;
}
export const JobListDescriptor = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    Description: S.optional(S.String),
    Operation: S.optional(OperationName),
    Priority: S.optional(S.Number),
    Status: S.optional(JobStatus),
    CreationTime: S.optional(S.Date),
    TerminationDate: S.optional(S.Date),
    ProgressSummary: S.optional(JobProgressSummary),
  }),
).annotations({
  identifier: "JobListDescriptor",
}) as any as S.Schema<JobListDescriptor>;
export type JobListDescriptorList = JobListDescriptor[];
export const JobListDescriptorList = S.Array(JobListDescriptor);
export interface RegionalBucket {
  Bucket: string;
  BucketArn?: string;
  PublicAccessBlockEnabled: boolean;
  CreationDate: Date;
  OutpostId?: string;
}
export const RegionalBucket = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    BucketArn: S.optional(S.String),
    PublicAccessBlockEnabled: S.Boolean,
    CreationDate: S.Date,
    OutpostId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegionalBucket",
}) as any as S.Schema<RegionalBucket>;
export type RegionalBucketList = RegionalBucket[];
export const RegionalBucketList = S.Array(
  RegionalBucket.pipe(T.XmlName("RegionalBucket")).annotations({
    identifier: "RegionalBucket",
  }),
);
export interface ListStorageLensConfigurationEntry {
  Id: string;
  StorageLensArn: string;
  HomeRegion: string;
  IsEnabled?: boolean;
}
export const ListStorageLensConfigurationEntry = S.suspend(() =>
  S.Struct({
    Id: S.String,
    StorageLensArn: S.String,
    HomeRegion: S.String,
    IsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ListStorageLensConfigurationEntry",
}) as any as S.Schema<ListStorageLensConfigurationEntry>;
export type StorageLensConfigurationList = ListStorageLensConfigurationEntry[];
export const StorageLensConfigurationList = S.Array(
  ListStorageLensConfigurationEntry.pipe(
    T.XmlName("StorageLensConfiguration"),
  ).annotations({ identifier: "ListStorageLensConfigurationEntry" }),
);
export interface ListStorageLensGroupEntry {
  Name: string;
  StorageLensGroupArn: string;
  HomeRegion: string;
}
export const ListStorageLensGroupEntry = S.suspend(() =>
  S.Struct({
    Name: S.String,
    StorageLensGroupArn: S.String,
    HomeRegion: S.String,
  }),
).annotations({
  identifier: "ListStorageLensGroupEntry",
}) as any as S.Schema<ListStorageLensGroupEntry>;
export type StorageLensGroupList = ListStorageLensGroupEntry[];
export const StorageLensGroupList = S.Array(
  ListStorageLensGroupEntry.pipe(T.XmlName("StorageLensGroup")).annotations({
    identifier: "ListStorageLensGroupEntry",
  }),
);
export type UserArguments = { [key: string]: string };
export const UserArguments = S.Record({ key: S.String, value: S.String });
export interface S3ObjectLockLegalHold {
  Status: S3ObjectLockLegalHoldStatus;
}
export const S3ObjectLockLegalHold = S.suspend(() =>
  S.Struct({ Status: S3ObjectLockLegalHoldStatus }),
).annotations({
  identifier: "S3ObjectLockLegalHold",
}) as any as S.Schema<S3ObjectLockLegalHold>;
export interface S3Retention {
  RetainUntilDate?: Date;
  Mode?: S3ObjectLockRetentionMode;
}
export const S3Retention = S.suspend(() =>
  S.Struct({
    RetainUntilDate: S.optional(S.Date),
    Mode: S.optional(S3ObjectLockRetentionMode),
  }),
).annotations({ identifier: "S3Retention" }) as any as S.Schema<S3Retention>;
export interface CreateAccessGrantResult {
  CreatedAt?: Date;
  AccessGrantId?: string;
  AccessGrantArn?: string;
  Grantee?: Grantee;
  AccessGrantsLocationId?: string;
  AccessGrantsLocationConfiguration?: AccessGrantsLocationConfiguration;
  Permission?: Permission;
  ApplicationArn?: string;
  GrantScope?: string;
}
export const CreateAccessGrantResult = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date),
    AccessGrantId: S.optional(S.String),
    AccessGrantArn: S.optional(S.String),
    Grantee: S.optional(Grantee),
    AccessGrantsLocationId: S.optional(S.String),
    AccessGrantsLocationConfiguration: S.optional(
      AccessGrantsLocationConfiguration,
    ),
    Permission: S.optional(Permission),
    ApplicationArn: S.optional(S.String),
    GrantScope: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateAccessGrantResult",
}) as any as S.Schema<CreateAccessGrantResult>;
export interface CreateAccessPointResult {
  AccessPointArn?: string;
  Alias?: string;
}
export const CreateAccessPointResult = S.suspend(() =>
  S.Struct({
    AccessPointArn: S.optional(S.String),
    Alias: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateAccessPointResult",
}) as any as S.Schema<CreateAccessPointResult>;
export interface CreateBucketResult {
  Location?: string;
  BucketArn?: string;
}
export const CreateBucketResult = S.suspend(() =>
  S.Struct({
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    BucketArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateBucketResult",
}) as any as S.Schema<CreateBucketResult>;
export type S3GranteeTypeIdentifier = "id" | "emailAddress" | "uri";
export const S3GranteeTypeIdentifier = S.Literal("id", "emailAddress", "uri");
export interface SSES3Encryption {}
export const SSES3Encryption = S.suspend(() =>
  S.Struct({}).pipe(T.XmlName("SSE-S3")),
).annotations({
  identifier: "SSES3Encryption",
}) as any as S.Schema<SSES3Encryption>;
export type NonEmptyMaxLength1024StringList = string[];
export const NonEmptyMaxLength1024StringList = S.Array(S.String);
export interface SSES3Filter {}
export const SSES3Filter = S.suspend(() => S.Struct({})).annotations({
  identifier: "SSES3Filter",
}) as any as S.Schema<SSES3Filter>;
export interface SSECFilter {}
export const SSECFilter = S.suspend(() => S.Struct({})).annotations({
  identifier: "SSECFilter",
}) as any as S.Schema<SSECFilter>;
export interface NotSSEFilter {}
export const NotSSEFilter = S.suspend(() => S.Struct({})).annotations({
  identifier: "NotSSEFilter",
}) as any as S.Schema<NotSSEFilter>;
export interface CreateMultiRegionAccessPointRequest {
  AccountId: string;
  ClientToken: string;
  Details: CreateMultiRegionAccessPointInput;
}
export const CreateMultiRegionAccessPointRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Details: CreateMultiRegionAccessPointInput,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/async-requests/mrap/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateMultiRegionAccessPointRequest",
}) as any as S.Schema<CreateMultiRegionAccessPointRequest>;
export interface DeleteMultiRegionAccessPointResult {
  RequestTokenARN?: string;
}
export const DeleteMultiRegionAccessPointResult = S.suspend(() =>
  S.Struct({ RequestTokenARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteMultiRegionAccessPointResult",
}) as any as S.Schema<DeleteMultiRegionAccessPointResult>;
export interface GetAccessPointResult {
  Name?: string;
  Bucket?: string;
  NetworkOrigin?: NetworkOrigin;
  VpcConfiguration?: VpcConfiguration;
  PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
  CreationDate?: Date;
  Alias?: string;
  AccessPointArn?: string;
  Endpoints?: { [key: string]: string };
  BucketAccountId?: string;
  DataSourceId?: string;
  DataSourceType?: string;
}
export const GetAccessPointResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Bucket: S.optional(S.String),
    NetworkOrigin: S.optional(NetworkOrigin),
    VpcConfiguration: S.optional(VpcConfiguration),
    PublicAccessBlockConfiguration: S.optional(PublicAccessBlockConfiguration),
    CreationDate: S.optional(S.Date),
    Alias: S.optional(S.String),
    AccessPointArn: S.optional(S.String),
    Endpoints: S.optional(Endpoints),
    BucketAccountId: S.optional(S.String),
    DataSourceId: S.optional(S.String),
    DataSourceType: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessPointResult",
}) as any as S.Schema<GetAccessPointResult>;
export interface GetAccessPointForObjectLambdaResult {
  Name?: string;
  PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
  CreationDate?: Date;
  Alias?: ObjectLambdaAccessPointAlias;
}
export const GetAccessPointForObjectLambdaResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    PublicAccessBlockConfiguration: S.optional(PublicAccessBlockConfiguration),
    CreationDate: S.optional(S.Date),
    Alias: S.optional(ObjectLambdaAccessPointAlias),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessPointForObjectLambdaResult",
}) as any as S.Schema<GetAccessPointForObjectLambdaResult>;
export interface GetAccessPointPolicyStatusResult {
  PolicyStatus?: PolicyStatus;
}
export const GetAccessPointPolicyStatusResult = S.suspend(() =>
  S.Struct({ PolicyStatus: S.optional(PolicyStatus) }).pipe(ns),
).annotations({
  identifier: "GetAccessPointPolicyStatusResult",
}) as any as S.Schema<GetAccessPointPolicyStatusResult>;
export interface GetDataAccessResult {
  Credentials?: Credentials;
  MatchedGrantTarget?: string;
  Grantee?: Grantee;
}
export const GetDataAccessResult = S.suspend(() =>
  S.Struct({
    Credentials: S.optional(Credentials),
    MatchedGrantTarget: S.optional(S.String),
    Grantee: S.optional(Grantee),
  }).pipe(ns),
).annotations({
  identifier: "GetDataAccessResult",
}) as any as S.Schema<GetDataAccessResult>;
export interface ListAccessGrantsResult {
  NextToken?: string;
  AccessGrantsList?: ListAccessGrantEntry[];
}
export const ListAccessGrantsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    AccessGrantsList: S.optional(AccessGrantsList),
  }).pipe(ns),
).annotations({
  identifier: "ListAccessGrantsResult",
}) as any as S.Schema<ListAccessGrantsResult>;
export interface ListAccessGrantsInstancesResult {
  NextToken?: string;
  AccessGrantsInstancesList?: ListAccessGrantsInstanceEntry[];
}
export const ListAccessGrantsInstancesResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    AccessGrantsInstancesList: S.optional(AccessGrantsInstancesList),
  }).pipe(ns),
).annotations({
  identifier: "ListAccessGrantsInstancesResult",
}) as any as S.Schema<ListAccessGrantsInstancesResult>;
export interface ListAccessGrantsLocationsResult {
  NextToken?: string;
  AccessGrantsLocationsList?: ListAccessGrantsLocationsEntry[];
}
export const ListAccessGrantsLocationsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    AccessGrantsLocationsList: S.optional(AccessGrantsLocationsList),
  }).pipe(ns),
).annotations({
  identifier: "ListAccessGrantsLocationsResult",
}) as any as S.Schema<ListAccessGrantsLocationsResult>;
export interface ListAccessPointsResult {
  AccessPointList?: AccessPoint[];
  NextToken?: string;
}
export const ListAccessPointsResult = S.suspend(() =>
  S.Struct({
    AccessPointList: S.optional(AccessPointList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccessPointsResult",
}) as any as S.Schema<ListAccessPointsResult>;
export interface ListAccessPointsForObjectLambdaResult {
  ObjectLambdaAccessPointList?: ObjectLambdaAccessPoint[];
  NextToken?: string;
}
export const ListAccessPointsForObjectLambdaResult = S.suspend(() =>
  S.Struct({
    ObjectLambdaAccessPointList: S.optional(ObjectLambdaAccessPointList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccessPointsForObjectLambdaResult",
}) as any as S.Schema<ListAccessPointsForObjectLambdaResult>;
export interface ListCallerAccessGrantsResult {
  NextToken?: string;
  CallerAccessGrantsList?: ListCallerAccessGrantsEntry[];
}
export const ListCallerAccessGrantsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    CallerAccessGrantsList: S.optional(CallerAccessGrantsList),
  }).pipe(ns),
).annotations({
  identifier: "ListCallerAccessGrantsResult",
}) as any as S.Schema<ListCallerAccessGrantsResult>;
export interface ListJobsResult {
  NextToken?: string;
  Jobs?: JobListDescriptor[];
}
export const ListJobsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Jobs: S.optional(JobListDescriptorList),
  }).pipe(ns),
).annotations({
  identifier: "ListJobsResult",
}) as any as S.Schema<ListJobsResult>;
export interface ListRegionalBucketsResult {
  RegionalBucketList?: RegionalBucket[];
  NextToken?: string;
}
export const ListRegionalBucketsResult = S.suspend(() =>
  S.Struct({
    RegionalBucketList: S.optional(RegionalBucketList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRegionalBucketsResult",
}) as any as S.Schema<ListRegionalBucketsResult>;
export interface ListStorageLensConfigurationsResult {
  NextToken?: string;
  StorageLensConfigurationList?: ListStorageLensConfigurationEntry[];
}
export const ListStorageLensConfigurationsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    StorageLensConfigurationList: S.optional(StorageLensConfigurationList).pipe(
      T.XmlName("StorageLensConfiguration"),
      T.XmlFlattened(),
    ),
  }).pipe(T.all(T.XmlName("ListStorageLensConfigurationResult"), ns)),
).annotations({
  identifier: "ListStorageLensConfigurationsResult",
}) as any as S.Schema<ListStorageLensConfigurationsResult>;
export interface ListStorageLensGroupsResult {
  NextToken?: string;
  StorageLensGroupList?: ListStorageLensGroupEntry[];
}
export const ListStorageLensGroupsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    StorageLensGroupList: S.optional(StorageLensGroupList).pipe(
      T.XmlName("StorageLensGroup"),
      T.XmlFlattened(),
    ),
  }).pipe(ns),
).annotations({
  identifier: "ListStorageLensGroupsResult",
}) as any as S.Schema<ListStorageLensGroupsResult>;
export interface PutMultiRegionAccessPointPolicyResult {
  RequestTokenARN?: string;
}
export const PutMultiRegionAccessPointPolicyResult = S.suspend(() =>
  S.Struct({ RequestTokenARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutMultiRegionAccessPointPolicyResult",
}) as any as S.Schema<PutMultiRegionAccessPointPolicyResult>;
export interface LambdaInvokeOperation {
  FunctionArn?: string;
  InvocationSchemaVersion?: string;
  UserArguments?: { [key: string]: string };
}
export const LambdaInvokeOperation = S.suspend(() =>
  S.Struct({
    FunctionArn: S.optional(S.String),
    InvocationSchemaVersion: S.optional(S.String),
    UserArguments: S.optional(UserArguments),
  }),
).annotations({
  identifier: "LambdaInvokeOperation",
}) as any as S.Schema<LambdaInvokeOperation>;
export interface S3SetObjectLegalHoldOperation {
  LegalHold: S3ObjectLockLegalHold;
}
export const S3SetObjectLegalHoldOperation = S.suspend(() =>
  S.Struct({ LegalHold: S3ObjectLockLegalHold }),
).annotations({
  identifier: "S3SetObjectLegalHoldOperation",
}) as any as S.Schema<S3SetObjectLegalHoldOperation>;
export interface S3SetObjectRetentionOperation {
  BypassGovernanceRetention?: boolean;
  Retention: S3Retention;
}
export const S3SetObjectRetentionOperation = S.suspend(() =>
  S.Struct({
    BypassGovernanceRetention: S.optional(S.Boolean),
    Retention: S3Retention,
  }),
).annotations({
  identifier: "S3SetObjectRetentionOperation",
}) as any as S.Schema<S3SetObjectRetentionOperation>;
export interface JobFailure {
  FailureCode?: string;
  FailureReason?: string;
}
export const JobFailure = S.suspend(() =>
  S.Struct({
    FailureCode: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({ identifier: "JobFailure" }) as any as S.Schema<JobFailure>;
export type JobFailureList = JobFailure[];
export const JobFailureList = S.Array(JobFailure);
export interface S3GeneratedManifestDescriptor {
  Format?: GeneratedManifestFormat;
  Location?: JobManifestLocation;
}
export const S3GeneratedManifestDescriptor = S.suspend(() =>
  S.Struct({
    Format: S.optional(GeneratedManifestFormat),
    Location: S.optional(JobManifestLocation),
  }),
).annotations({
  identifier: "S3GeneratedManifestDescriptor",
}) as any as S.Schema<S3GeneratedManifestDescriptor>;
export interface AsyncRequestParameters {
  CreateMultiRegionAccessPointRequest?: CreateMultiRegionAccessPointInput;
  DeleteMultiRegionAccessPointRequest?: DeleteMultiRegionAccessPointInput;
  PutMultiRegionAccessPointPolicyRequest?: PutMultiRegionAccessPointPolicyInput;
}
export const AsyncRequestParameters = S.suspend(() =>
  S.Struct({
    CreateMultiRegionAccessPointRequest: S.optional(
      CreateMultiRegionAccessPointInput,
    ),
    DeleteMultiRegionAccessPointRequest: S.optional(
      DeleteMultiRegionAccessPointInput,
    ),
    PutMultiRegionAccessPointPolicyRequest: S.optional(
      PutMultiRegionAccessPointPolicyInput,
    ),
  }),
).annotations({
  identifier: "AsyncRequestParameters",
}) as any as S.Schema<AsyncRequestParameters>;
export interface EstablishedMultiRegionAccessPointPolicy {
  Policy?: string;
}
export const EstablishedMultiRegionAccessPointPolicy = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "EstablishedMultiRegionAccessPointPolicy",
}) as any as S.Schema<EstablishedMultiRegionAccessPointPolicy>;
export interface ProposedMultiRegionAccessPointPolicy {
  Policy?: string;
}
export const ProposedMultiRegionAccessPointPolicy = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "ProposedMultiRegionAccessPointPolicy",
}) as any as S.Schema<ProposedMultiRegionAccessPointPolicy>;
export interface S3Grantee {
  TypeIdentifier?: S3GranteeTypeIdentifier;
  Identifier?: string;
  DisplayName?: string;
}
export const S3Grantee = S.suspend(() =>
  S.Struct({
    TypeIdentifier: S.optional(S3GranteeTypeIdentifier),
    Identifier: S.optional(S.String),
    DisplayName: S.optional(S.String),
  }),
).annotations({ identifier: "S3Grantee" }) as any as S.Schema<S3Grantee>;
export type S3UserMetadata = { [key: string]: string };
export const S3UserMetadata = S.Record({ key: S.String, value: S.String });
export interface KeyNameConstraint {
  MatchAnyPrefix?: string[];
  MatchAnySuffix?: string[];
  MatchAnySubstring?: string[];
}
export const KeyNameConstraint = S.suspend(() =>
  S.Struct({
    MatchAnyPrefix: S.optional(NonEmptyMaxLength1024StringList),
    MatchAnySuffix: S.optional(NonEmptyMaxLength1024StringList),
    MatchAnySubstring: S.optional(NonEmptyMaxLength1024StringList),
  }),
).annotations({
  identifier: "KeyNameConstraint",
}) as any as S.Schema<KeyNameConstraint>;
export interface MultiRegionAccessPointPolicyDocument {
  Established?: EstablishedMultiRegionAccessPointPolicy;
  Proposed?: ProposedMultiRegionAccessPointPolicy;
}
export const MultiRegionAccessPointPolicyDocument = S.suspend(() =>
  S.Struct({
    Established: S.optional(EstablishedMultiRegionAccessPointPolicy),
    Proposed: S.optional(ProposedMultiRegionAccessPointPolicy),
  }),
).annotations({
  identifier: "MultiRegionAccessPointPolicyDocument",
}) as any as S.Schema<MultiRegionAccessPointPolicyDocument>;
export interface S3Grant {
  Grantee?: S3Grantee;
  Permission?: S3Permission;
}
export const S3Grant = S.suspend(() =>
  S.Struct({
    Grantee: S.optional(S3Grantee),
    Permission: S.optional(S3Permission),
  }),
).annotations({ identifier: "S3Grant" }) as any as S.Schema<S3Grant>;
export type S3GrantList = S3Grant[];
export const S3GrantList = S.Array(S3Grant);
export interface S3ObjectMetadata {
  CacheControl?: string;
  ContentDisposition?: string;
  ContentEncoding?: string;
  ContentLanguage?: string;
  UserMetadata?: { [key: string]: string };
  ContentLength?: number;
  ContentMD5?: string;
  ContentType?: string;
  HttpExpiresDate?: Date;
  RequesterCharged?: boolean;
  SSEAlgorithm?: S3SSEAlgorithm;
}
export const S3ObjectMetadata = S.suspend(() =>
  S.Struct({
    CacheControl: S.optional(S.String),
    ContentDisposition: S.optional(S.String),
    ContentEncoding: S.optional(S.String),
    ContentLanguage: S.optional(S.String),
    UserMetadata: S.optional(S3UserMetadata),
    ContentLength: S.optional(S.Number),
    ContentMD5: S.optional(S.String),
    ContentType: S.optional(S.String),
    HttpExpiresDate: S.optional(S.Date),
    RequesterCharged: S.optional(S.Boolean),
    SSEAlgorithm: S.optional(S3SSEAlgorithm),
  }),
).annotations({
  identifier: "S3ObjectMetadata",
}) as any as S.Schema<S3ObjectMetadata>;
export interface AsyncErrorDetails {
  Code?: string;
  Message?: string;
  Resource?: string;
  RequestId?: string;
}
export const AsyncErrorDetails = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Resource: S.optional(S.String),
    RequestId: S.optional(S.String),
  }),
).annotations({
  identifier: "AsyncErrorDetails",
}) as any as S.Schema<AsyncErrorDetails>;
export interface S3ObjectOwner {
  ID?: string;
  DisplayName?: string;
}
export const S3ObjectOwner = S.suspend(() =>
  S.Struct({ ID: S.optional(S.String), DisplayName: S.optional(S.String) }),
).annotations({
  identifier: "S3ObjectOwner",
}) as any as S.Schema<S3ObjectOwner>;
export interface SSEKMSEncryption {
  KeyId: string;
}
export const SSEKMSEncryption = S.suspend(() =>
  S.Struct({ KeyId: S.String }).pipe(T.XmlName("SSE-KMS")),
).annotations({
  identifier: "SSEKMSEncryption",
}) as any as S.Schema<SSEKMSEncryption>;
export interface SSEKMSFilter {
  KmsKeyArn?: string;
  BucketKeyEnabled?: boolean;
}
export const SSEKMSFilter = S.suspend(() =>
  S.Struct({
    KmsKeyArn: S.optional(S.String),
    BucketKeyEnabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "SSEKMSFilter" }) as any as S.Schema<SSEKMSFilter>;
export interface DSSEKMSFilter {
  KmsKeyArn?: string;
}
export const DSSEKMSFilter = S.suspend(() =>
  S.Struct({ KmsKeyArn: S.optional(S.String) }),
).annotations({
  identifier: "DSSEKMSFilter",
}) as any as S.Schema<DSSEKMSFilter>;
export interface CreateMultiRegionAccessPointResult {
  RequestTokenARN?: string;
}
export const CreateMultiRegionAccessPointResult = S.suspend(() =>
  S.Struct({ RequestTokenARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateMultiRegionAccessPointResult",
}) as any as S.Schema<CreateMultiRegionAccessPointResult>;
export interface CreateStorageLensGroupRequest {
  AccountId: string;
  StorageLensGroup: StorageLensGroup;
  Tags?: Tag[];
}
export const CreateStorageLensGroupRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    StorageLensGroup: StorageLensGroup,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/storagelensgroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateStorageLensGroupRequest",
}) as any as S.Schema<CreateStorageLensGroupRequest>;
export interface CreateStorageLensGroupResponse {}
export const CreateStorageLensGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateStorageLensGroupResponse",
}) as any as S.Schema<CreateStorageLensGroupResponse>;
export interface GetMultiRegionAccessPointResult {
  AccessPoint?: MultiRegionAccessPointReport;
}
export const GetMultiRegionAccessPointResult = S.suspend(() =>
  S.Struct({ AccessPoint: S.optional(MultiRegionAccessPointReport) }).pipe(ns),
).annotations({
  identifier: "GetMultiRegionAccessPointResult",
}) as any as S.Schema<GetMultiRegionAccessPointResult>;
export interface GetMultiRegionAccessPointPolicyResult {
  Policy?: MultiRegionAccessPointPolicyDocument;
}
export const GetMultiRegionAccessPointPolicyResult = S.suspend(() =>
  S.Struct({ Policy: S.optional(MultiRegionAccessPointPolicyDocument) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetMultiRegionAccessPointPolicyResult",
}) as any as S.Schema<GetMultiRegionAccessPointPolicyResult>;
export interface S3CopyObjectOperation {
  TargetResource?: string;
  CannedAccessControlList?: S3CannedAccessControlList;
  AccessControlGrants?: S3Grant[];
  MetadataDirective?: S3MetadataDirective;
  ModifiedSinceConstraint?: Date;
  NewObjectMetadata?: S3ObjectMetadata;
  NewObjectTagging?: S3Tag[];
  RedirectLocation?: string;
  RequesterPays?: boolean;
  StorageClass?: S3StorageClass;
  UnModifiedSinceConstraint?: Date;
  SSEAwsKmsKeyId?: string;
  TargetKeyPrefix?: string;
  ObjectLockLegalHoldStatus?: S3ObjectLockLegalHoldStatus;
  ObjectLockMode?: S3ObjectLockMode;
  ObjectLockRetainUntilDate?: Date;
  BucketKeyEnabled?: boolean;
  ChecksumAlgorithm?: S3ChecksumAlgorithm;
}
export const S3CopyObjectOperation = S.suspend(() =>
  S.Struct({
    TargetResource: S.optional(S.String),
    CannedAccessControlList: S.optional(S3CannedAccessControlList),
    AccessControlGrants: S.optional(S3GrantList),
    MetadataDirective: S.optional(S3MetadataDirective),
    ModifiedSinceConstraint: S.optional(S.Date),
    NewObjectMetadata: S.optional(S3ObjectMetadata),
    NewObjectTagging: S.optional(S3TagSet),
    RedirectLocation: S.optional(S.String),
    RequesterPays: S.optional(S.Boolean),
    StorageClass: S.optional(S3StorageClass),
    UnModifiedSinceConstraint: S.optional(S.Date),
    SSEAwsKmsKeyId: S.optional(S.String),
    TargetKeyPrefix: S.optional(S.String),
    ObjectLockLegalHoldStatus: S.optional(S3ObjectLockLegalHoldStatus),
    ObjectLockMode: S.optional(S3ObjectLockMode),
    ObjectLockRetainUntilDate: S.optional(S.Date),
    BucketKeyEnabled: S.optional(S.Boolean),
    ChecksumAlgorithm: S.optional(S3ChecksumAlgorithm),
  }),
).annotations({
  identifier: "S3CopyObjectOperation",
}) as any as S.Schema<S3CopyObjectOperation>;
export interface S3AccessControlList {
  Owner: S3ObjectOwner;
  Grants?: S3Grant[];
}
export const S3AccessControlList = S.suspend(() =>
  S.Struct({ Owner: S3ObjectOwner, Grants: S.optional(S3GrantList) }),
).annotations({
  identifier: "S3AccessControlList",
}) as any as S.Schema<S3AccessControlList>;
export interface GeneratedManifestEncryption {
  SSES3?: SSES3Encryption;
  SSEKMS?: SSEKMSEncryption;
}
export const GeneratedManifestEncryption = S.suspend(() =>
  S.Struct({
    SSES3: S.optional(SSES3Encryption)
      .pipe(T.XmlName("SSE-S3"))
      .annotations({ identifier: "SSES3Encryption" }),
    SSEKMS: S.optional(SSEKMSEncryption)
      .pipe(T.XmlName("SSE-KMS"))
      .annotations({ identifier: "SSEKMSEncryption" }),
  }),
).annotations({
  identifier: "GeneratedManifestEncryption",
}) as any as S.Schema<GeneratedManifestEncryption>;
export type ObjectEncryptionFilter =
  | { SSES3: SSES3Filter }
  | { SSEKMS: SSEKMSFilter }
  | { DSSEKMS: DSSEKMSFilter }
  | { SSEC: SSECFilter }
  | { NOTSSE: NotSSEFilter };
export const ObjectEncryptionFilter = S.Union(
  S.Struct({
    SSES3: SSES3Filter.pipe(T.XmlName("SSE-S3")).annotations({
      identifier: "SSES3Filter",
    }),
  }),
  S.Struct({
    SSEKMS: SSEKMSFilter.pipe(T.XmlName("SSE-KMS")).annotations({
      identifier: "SSEKMSFilter",
    }),
  }),
  S.Struct({
    DSSEKMS: DSSEKMSFilter.pipe(T.XmlName("DSSE-KMS")).annotations({
      identifier: "DSSEKMSFilter",
    }),
  }),
  S.Struct({
    SSEC: SSECFilter.pipe(T.XmlName("SSE-C")).annotations({
      identifier: "SSECFilter",
    }),
  }),
  S.Struct({
    NOTSSE: NotSSEFilter.pipe(T.XmlName("NOT-SSE")).annotations({
      identifier: "NotSSEFilter",
    }),
  }),
);
export type ObjectEncryptionFilterList = ObjectEncryptionFilter[];
export const ObjectEncryptionFilterList = S.Array(
  ObjectEncryptionFilter.pipe(T.XmlName("ObjectEncryption")),
);
export interface MultiRegionAccessPointRegionalResponse {
  Name?: string;
  RequestStatus?: string;
}
export const MultiRegionAccessPointRegionalResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), RequestStatus: S.optional(S.String) }),
).annotations({
  identifier: "MultiRegionAccessPointRegionalResponse",
}) as any as S.Schema<MultiRegionAccessPointRegionalResponse>;
export type MultiRegionAccessPointRegionalResponseList =
  MultiRegionAccessPointRegionalResponse[];
export const MultiRegionAccessPointRegionalResponseList = S.Array(
  MultiRegionAccessPointRegionalResponse.pipe(T.XmlName("Region")).annotations({
    identifier: "MultiRegionAccessPointRegionalResponse",
  }),
);
export interface S3AccessControlPolicy {
  AccessControlList?: S3AccessControlList;
  CannedAccessControlList?: S3CannedAccessControlList;
}
export const S3AccessControlPolicy = S.suspend(() =>
  S.Struct({
    AccessControlList: S.optional(S3AccessControlList),
    CannedAccessControlList: S.optional(S3CannedAccessControlList),
  }),
).annotations({
  identifier: "S3AccessControlPolicy",
}) as any as S.Schema<S3AccessControlPolicy>;
export interface S3SetObjectAclOperation {
  AccessControlPolicy?: S3AccessControlPolicy;
}
export const S3SetObjectAclOperation = S.suspend(() =>
  S.Struct({ AccessControlPolicy: S.optional(S3AccessControlPolicy) }),
).annotations({
  identifier: "S3SetObjectAclOperation",
}) as any as S.Schema<S3SetObjectAclOperation>;
export interface JobOperation {
  LambdaInvoke?: LambdaInvokeOperation;
  S3PutObjectCopy?: S3CopyObjectOperation;
  S3PutObjectAcl?: S3SetObjectAclOperation;
  S3PutObjectTagging?: S3SetObjectTaggingOperation;
  S3DeleteObjectTagging?: S3DeleteObjectTaggingOperation;
  S3InitiateRestoreObject?: S3InitiateRestoreObjectOperation;
  S3PutObjectLegalHold?: S3SetObjectLegalHoldOperation;
  S3PutObjectRetention?: S3SetObjectRetentionOperation;
  S3ReplicateObject?: S3ReplicateObjectOperation;
  S3ComputeObjectChecksum?: S3ComputeObjectChecksumOperation;
}
export const JobOperation = S.suspend(() =>
  S.Struct({
    LambdaInvoke: S.optional(LambdaInvokeOperation),
    S3PutObjectCopy: S.optional(S3CopyObjectOperation),
    S3PutObjectAcl: S.optional(S3SetObjectAclOperation),
    S3PutObjectTagging: S.optional(S3SetObjectTaggingOperation),
    S3DeleteObjectTagging: S.optional(S3DeleteObjectTaggingOperation),
    S3InitiateRestoreObject: S.optional(S3InitiateRestoreObjectOperation),
    S3PutObjectLegalHold: S.optional(S3SetObjectLegalHoldOperation),
    S3PutObjectRetention: S.optional(S3SetObjectRetentionOperation),
    S3ReplicateObject: S.optional(S3ReplicateObjectOperation),
    S3ComputeObjectChecksum: S.optional(S3ComputeObjectChecksumOperation),
  }),
).annotations({ identifier: "JobOperation" }) as any as S.Schema<JobOperation>;
export interface S3ManifestOutputLocation {
  ExpectedManifestBucketOwner?: string;
  Bucket: string;
  ManifestPrefix?: string;
  ManifestEncryption?: GeneratedManifestEncryption;
  ManifestFormat: GeneratedManifestFormat;
}
export const S3ManifestOutputLocation = S.suspend(() =>
  S.Struct({
    ExpectedManifestBucketOwner: S.optional(S.String),
    Bucket: S.String,
    ManifestPrefix: S.optional(S.String),
    ManifestEncryption: S.optional(GeneratedManifestEncryption),
    ManifestFormat: GeneratedManifestFormat,
  }),
).annotations({
  identifier: "S3ManifestOutputLocation",
}) as any as S.Schema<S3ManifestOutputLocation>;
export interface JobManifestGeneratorFilter {
  EligibleForReplication?: boolean;
  CreatedAfter?: Date;
  CreatedBefore?: Date;
  ObjectReplicationStatuses?: ReplicationStatus[];
  KeyNameConstraint?: KeyNameConstraint;
  ObjectSizeGreaterThanBytes?: number;
  ObjectSizeLessThanBytes?: number;
  MatchAnyStorageClass?: S3StorageClass[];
  MatchAnyObjectEncryption?: ObjectEncryptionFilter[];
}
export const JobManifestGeneratorFilter = S.suspend(() =>
  S.Struct({
    EligibleForReplication: S.optional(S.Boolean),
    CreatedAfter: S.optional(S.Date),
    CreatedBefore: S.optional(S.Date),
    ObjectReplicationStatuses: S.optional(ReplicationStatusFilterList),
    KeyNameConstraint: S.optional(KeyNameConstraint),
    ObjectSizeGreaterThanBytes: S.optional(S.Number),
    ObjectSizeLessThanBytes: S.optional(S.Number),
    MatchAnyStorageClass: S.optional(StorageClassList),
    MatchAnyObjectEncryption: S.optional(ObjectEncryptionFilterList),
  }),
).annotations({
  identifier: "JobManifestGeneratorFilter",
}) as any as S.Schema<JobManifestGeneratorFilter>;
export interface S3JobManifestGenerator {
  ExpectedBucketOwner?: string;
  SourceBucket: string;
  ManifestOutputLocation?: S3ManifestOutputLocation;
  Filter?: JobManifestGeneratorFilter;
  EnableManifestOutput: boolean;
}
export const S3JobManifestGenerator = S.suspend(() =>
  S.Struct({
    ExpectedBucketOwner: S.optional(S.String),
    SourceBucket: S.String,
    ManifestOutputLocation: S.optional(S3ManifestOutputLocation),
    Filter: S.optional(JobManifestGeneratorFilter),
    EnableManifestOutput: S.Boolean,
  }),
).annotations({
  identifier: "S3JobManifestGenerator",
}) as any as S.Schema<S3JobManifestGenerator>;
export type JobManifestGenerator = {
  S3JobManifestGenerator: S3JobManifestGenerator;
};
export const JobManifestGenerator = S.Union(
  S.Struct({ S3JobManifestGenerator: S3JobManifestGenerator }),
);
export interface JobDescriptor {
  JobId?: string;
  ConfirmationRequired?: boolean;
  Description?: string;
  JobArn?: string;
  Status?: JobStatus;
  Manifest?: JobManifest;
  Operation?: JobOperation;
  Priority?: number;
  ProgressSummary?: JobProgressSummary;
  StatusUpdateReason?: string;
  FailureReasons?: JobFailure[];
  Report?: JobReport;
  CreationTime?: Date;
  TerminationDate?: Date;
  RoleArn?: string;
  SuspendedDate?: Date;
  SuspendedCause?: string;
  ManifestGenerator?: JobManifestGenerator;
  GeneratedManifestDescriptor?: S3GeneratedManifestDescriptor;
}
export const JobDescriptor = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    ConfirmationRequired: S.optional(S.Boolean),
    Description: S.optional(S.String),
    JobArn: S.optional(S.String),
    Status: S.optional(JobStatus),
    Manifest: S.optional(JobManifest),
    Operation: S.optional(JobOperation),
    Priority: S.optional(S.Number),
    ProgressSummary: S.optional(JobProgressSummary),
    StatusUpdateReason: S.optional(S.String),
    FailureReasons: S.optional(JobFailureList),
    Report: S.optional(JobReport),
    CreationTime: S.optional(S.Date),
    TerminationDate: S.optional(S.Date),
    RoleArn: S.optional(S.String),
    SuspendedDate: S.optional(S.Date),
    SuspendedCause: S.optional(S.String),
    ManifestGenerator: S.optional(JobManifestGenerator),
    GeneratedManifestDescriptor: S.optional(S3GeneratedManifestDescriptor),
  }),
).annotations({
  identifier: "JobDescriptor",
}) as any as S.Schema<JobDescriptor>;
export interface LifecycleConfiguration {
  Rules?: LifecycleRule[];
}
export const LifecycleConfiguration = S.suspend(() =>
  S.Struct({ Rules: S.optional(LifecycleRules) }),
).annotations({
  identifier: "LifecycleConfiguration",
}) as any as S.Schema<LifecycleConfiguration>;
export interface MultiRegionAccessPointsAsyncResponse {
  Regions?: MultiRegionAccessPointRegionalResponse[];
}
export const MultiRegionAccessPointsAsyncResponse = S.suspend(() =>
  S.Struct({ Regions: S.optional(MultiRegionAccessPointRegionalResponseList) }),
).annotations({
  identifier: "MultiRegionAccessPointsAsyncResponse",
}) as any as S.Schema<MultiRegionAccessPointsAsyncResponse>;
export interface CreateAccessPointForObjectLambdaRequest {
  AccountId: string;
  Name: string;
  Configuration: ObjectLambdaConfiguration;
}
export const CreateAccessPointForObjectLambdaRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Name: S.String.pipe(T.HttpLabel("Name")),
    Configuration: ObjectLambdaConfiguration,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/v20180820/accesspointforobjectlambda/{Name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateAccessPointForObjectLambdaRequest",
}) as any as S.Schema<CreateAccessPointForObjectLambdaRequest>;
export interface DescribeJobResult {
  Job?: JobDescriptor;
}
export const DescribeJobResult = S.suspend(() =>
  S.Struct({ Job: S.optional(JobDescriptor) }).pipe(ns),
).annotations({
  identifier: "DescribeJobResult",
}) as any as S.Schema<DescribeJobResult>;
export interface PutBucketLifecycleConfigurationRequest {
  AccountId: string;
  Bucket: string;
  LifecycleConfiguration?: LifecycleConfiguration;
}
export const PutBucketLifecycleConfigurationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    LifecycleConfiguration: S.optional(LifecycleConfiguration)
      .pipe(T.HttpPayload(), T.XmlName("LifecycleConfiguration"))
      .annotations({ identifier: "LifecycleConfiguration" }),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "PUT",
        uri: "/v20180820/bucket/{Bucket}/lifecycleconfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketLifecycleConfigurationRequest",
}) as any as S.Schema<PutBucketLifecycleConfigurationRequest>;
export interface PutBucketLifecycleConfigurationResponse {}
export const PutBucketLifecycleConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketLifecycleConfigurationResponse",
}) as any as S.Schema<PutBucketLifecycleConfigurationResponse>;
export interface AsyncResponseDetails {
  MultiRegionAccessPointDetails?: MultiRegionAccessPointsAsyncResponse;
  ErrorDetails?: AsyncErrorDetails;
}
export const AsyncResponseDetails = S.suspend(() =>
  S.Struct({
    MultiRegionAccessPointDetails: S.optional(
      MultiRegionAccessPointsAsyncResponse,
    ),
    ErrorDetails: S.optional(AsyncErrorDetails),
  }),
).annotations({
  identifier: "AsyncResponseDetails",
}) as any as S.Schema<AsyncResponseDetails>;
export interface AsyncOperation {
  CreationTime?: Date;
  Operation?: AsyncOperationName;
  RequestTokenARN?: string;
  RequestParameters?: AsyncRequestParameters;
  RequestStatus?: string;
  ResponseDetails?: AsyncResponseDetails;
}
export const AsyncOperation = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.Date),
    Operation: S.optional(AsyncOperationName),
    RequestTokenARN: S.optional(S.String),
    RequestParameters: S.optional(AsyncRequestParameters),
    RequestStatus: S.optional(S.String),
    ResponseDetails: S.optional(AsyncResponseDetails),
  }),
).annotations({
  identifier: "AsyncOperation",
}) as any as S.Schema<AsyncOperation>;
export interface CreateAccessPointForObjectLambdaResult {
  ObjectLambdaAccessPointArn?: string;
  Alias?: ObjectLambdaAccessPointAlias;
}
export const CreateAccessPointForObjectLambdaResult = S.suspend(() =>
  S.Struct({
    ObjectLambdaAccessPointArn: S.optional(S.String),
    Alias: S.optional(ObjectLambdaAccessPointAlias),
  }).pipe(ns),
).annotations({
  identifier: "CreateAccessPointForObjectLambdaResult",
}) as any as S.Schema<CreateAccessPointForObjectLambdaResult>;
export interface CreateJobRequest {
  AccountId: string;
  ConfirmationRequired?: boolean;
  Operation: JobOperation;
  Report: JobReport;
  ClientRequestToken: string;
  Manifest?: JobManifest;
  Description?: string;
  Priority: number;
  RoleArn: string;
  Tags?: S3Tag[];
  ManifestGenerator?: JobManifestGenerator;
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    ConfirmationRequired: S.optional(S.Boolean),
    Operation: JobOperation,
    Report: JobReport,
    ClientRequestToken: S.String.pipe(T.IdempotencyToken()),
    Manifest: S.optional(JobManifest),
    Description: S.optional(S.String),
    Priority: S.Number,
    RoleArn: S.String,
    Tags: S.optional(S3TagSet),
    ManifestGenerator: S.optional(JobManifestGenerator),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v20180820/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateJobRequest",
}) as any as S.Schema<CreateJobRequest>;
export interface DescribeMultiRegionAccessPointOperationResult {
  AsyncOperation?: AsyncOperation;
}
export const DescribeMultiRegionAccessPointOperationResult = S.suspend(() =>
  S.Struct({ AsyncOperation: S.optional(AsyncOperation) }).pipe(ns),
).annotations({
  identifier: "DescribeMultiRegionAccessPointOperationResult",
}) as any as S.Schema<DescribeMultiRegionAccessPointOperationResult>;
export interface PutBucketReplicationRequest {
  AccountId: string;
  Bucket: string;
  ReplicationConfiguration: ReplicationConfiguration;
}
export const PutBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ReplicationConfiguration: ReplicationConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("ReplicationConfiguration"),
    ).annotations({ identifier: "ReplicationConfiguration" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/bucket/{Bucket}/replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketReplicationRequest",
}) as any as S.Schema<PutBucketReplicationRequest>;
export interface PutBucketReplicationResponse {}
export const PutBucketReplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketReplicationResponse",
}) as any as S.Schema<PutBucketReplicationResponse>;
export interface CreateJobResult {
  JobId?: string;
}
export const CreateJobResult = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateJobResult",
}) as any as S.Schema<CreateJobResult>;
export interface PutStorageLensConfigurationRequest {
  ConfigId: string;
  AccountId: string;
  StorageLensConfiguration: StorageLensConfiguration;
  Tags?: StorageLensTag[];
}
export const PutStorageLensConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigId: S.String.pipe(T.HttpLabel("ConfigId")),
    AccountId: S.String.pipe(
      T.HttpHeader("x-amz-account-id"),
      T.ContextParam("AccountId"),
      T.HostLabel(),
    ),
    StorageLensConfiguration: StorageLensConfiguration,
    Tags: S.optional(StorageLensTags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v20180820/storagelens/{ConfigId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ RequiresAccountId: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutStorageLensConfigurationRequest",
}) as any as S.Schema<PutStorageLensConfigurationRequest>;
export interface PutStorageLensConfigurationResponse {}
export const PutStorageLensConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutStorageLensConfigurationResponse",
}) as any as S.Schema<PutStorageLensConfigurationResponse>;

//# Errors
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
) {}
export class BucketAlreadyExists extends S.TaggedError<BucketAlreadyExists>()(
  "BucketAlreadyExists",
  {},
) {}
export class BucketAlreadyOwnedByYou extends S.TaggedError<BucketAlreadyOwnedByYou>()(
  "BucketAlreadyOwnedByYou",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
) {}
export class NoSuchPublicAccessBlockConfiguration extends S.TaggedError<NoSuchPublicAccessBlockConfiguration>()(
  "NoSuchPublicAccessBlockConfiguration",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class JobStatusException extends S.TaggedError<JobStatusException>()(
  "JobStatusException",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
) {}
export class IdempotencyException extends S.TaggedError<IdempotencyException>()(
  "IdempotencyException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Associate your S3 Access Grants instance with an Amazon Web Services IAM Identity Center instance. Use this action if you want to create access grants for users or groups from your corporate identity directory. First, you must add your corporate identity directory to Amazon Web Services IAM Identity Center. Then, you can associate this IAM Identity Center instance with your S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:AssociateAccessGrantsIdentityCenter` permission to use this operation.
 *
 * ### Additional Permissions
 *
 * You must also have the following permissions: `sso:CreateApplication`, `sso:PutApplicationGrant`, and `sso:PutApplicationAuthenticationMethod`.
 */
export const associateAccessGrantsIdentityCenter: (
  input: AssociateAccessGrantsIdentityCenterRequest,
) => effect.Effect<
  AssociateAccessGrantsIdentityCenterResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAccessGrantsIdentityCenterRequest,
  output: AssociateAccessGrantsIdentityCenterResponse,
  errors: [],
}));
/**
 * Deletes the access grant from the S3 Access Grants instance. You cannot undo an access grant deletion and the grantee will no longer have access to the S3 data.
 *
 * ### Permissions
 *
 * You must have the `s3:DeleteAccessGrant` permission to use this operation.
 */
export const deleteAccessGrant: (
  input: DeleteAccessGrantRequest,
) => effect.Effect<
  DeleteAccessGrantResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessGrantRequest,
  output: DeleteAccessGrantResponse,
  errors: [],
}));
/**
 * Deletes your S3 Access Grants instance. You must first delete the access grants and locations before S3 Access Grants can delete the instance. See DeleteAccessGrant and DeleteAccessGrantsLocation. If you have associated an IAM Identity Center instance with your S3 Access Grants instance, you must first dissassociate the Identity Center instance from the S3 Access Grants instance before you can delete the S3 Access Grants instance. See AssociateAccessGrantsIdentityCenter and DissociateAccessGrantsIdentityCenter.
 *
 * ### Permissions
 *
 * You must have the `s3:DeleteAccessGrantsInstance` permission to use this operation.
 */
export const deleteAccessGrantsInstance: (
  input: DeleteAccessGrantsInstanceRequest,
) => effect.Effect<
  DeleteAccessGrantsInstanceResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessGrantsInstanceRequest,
  output: DeleteAccessGrantsInstanceResponse,
  errors: [],
}));
/**
 * Deletes the resource policy of the S3 Access Grants instance. The resource policy is used to manage cross-account access to your S3 Access Grants instance. By deleting the resource policy, you delete any cross-account permissions to your S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:DeleteAccessGrantsInstanceResourcePolicy` permission to use this operation.
 */
export const deleteAccessGrantsInstanceResourcePolicy: (
  input: DeleteAccessGrantsInstanceResourcePolicyRequest,
) => effect.Effect<
  DeleteAccessGrantsInstanceResourcePolicyResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessGrantsInstanceResourcePolicyRequest,
  output: DeleteAccessGrantsInstanceResourcePolicyResponse,
  errors: [],
}));
/**
 * Deregisters a location from your S3 Access Grants instance. You can only delete a location registration from an S3 Access Grants instance if there are no grants associated with this location. See Delete a grant for information on how to delete grants. You need to have at least one registered location in your S3 Access Grants instance in order to create access grants.
 *
 * ### Permissions
 *
 * You must have the `s3:DeleteAccessGrantsLocation` permission to use this operation.
 */
export const deleteAccessGrantsLocation: (
  input: DeleteAccessGrantsLocationRequest,
) => effect.Effect<
  DeleteAccessGrantsLocationResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessGrantsLocationRequest,
  output: DeleteAccessGrantsLocationResponse,
  errors: [],
}));
/**
 * Deletes the specified access point.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `DeleteAccessPoint`:
 *
 * - CreateAccessPoint
 *
 * - GetAccessPoint
 *
 * - ListAccessPoints
 */
export const deleteAccessPoint: (
  input: DeleteAccessPointRequest,
) => effect.Effect<
  DeleteAccessPointResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointRequest,
  output: DeleteAccessPointResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Deletes the specified Object Lambda Access Point.
 *
 * The following actions are related to
 * `DeleteAccessPointForObjectLambda`:
 *
 * - CreateAccessPointForObjectLambda
 *
 * - GetAccessPointForObjectLambda
 *
 * - ListAccessPointsForObjectLambda
 */
export const deleteAccessPointForObjectLambda: (
  input: DeleteAccessPointForObjectLambdaRequest,
) => effect.Effect<
  DeleteAccessPointForObjectLambdaResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointForObjectLambdaRequest,
  output: DeleteAccessPointForObjectLambdaResponse,
  errors: [],
}));
/**
 * Deletes the access point policy for the specified access point.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `DeleteAccessPointPolicy`:
 *
 * - PutAccessPointPolicy
 *
 * - GetAccessPointPolicy
 */
export const deleteAccessPointPolicy: (
  input: DeleteAccessPointPolicyRequest,
) => effect.Effect<
  DeleteAccessPointPolicyResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointPolicyRequest,
  output: DeleteAccessPointPolicyResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Removes the resource policy for an Object Lambda Access Point.
 *
 * The following actions are related to
 * `DeleteAccessPointPolicyForObjectLambda`:
 *
 * - GetAccessPointPolicyForObjectLambda
 *
 * - PutAccessPointPolicyForObjectLambda
 */
export const deleteAccessPointPolicyForObjectLambda: (
  input: DeleteAccessPointPolicyForObjectLambdaRequest,
) => effect.Effect<
  DeleteAccessPointPolicyForObjectLambdaResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointPolicyForObjectLambdaRequest,
  output: DeleteAccessPointPolicyForObjectLambdaResponse,
  errors: [],
}));
/**
 * Deletes an existing access point scope for a directory bucket.
 *
 * When you delete the scope of an access point, all prefixes and permissions are deleted.
 *
 * To use this operation, you must have the permission to perform the
 * `s3express:DeleteAccessPointScope` action.
 *
 * For information about REST API errors, see REST error responses.
 */
export const deleteAccessPointScope: (
  input: DeleteAccessPointScopeRequest,
) => effect.Effect<
  DeleteAccessPointScopeResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointScopeRequest,
  output: DeleteAccessPointScopeResponse,
  errors: [],
}));
/**
 * This action deletes an Amazon S3 on Outposts bucket. To delete an S3 bucket, see DeleteBucket in the *Amazon S3 API Reference*.
 *
 * Deletes the Amazon S3 on Outposts bucket. All objects (including all object versions and
 * delete markers) in the bucket must be deleted before the bucket itself can be deleted. For
 * more information, see Using Amazon S3 on Outposts in
 * *Amazon S3 User Guide*.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * **Related Resources**
 *
 * - CreateBucket
 *
 * - GetBucket
 *
 * - DeleteObject
 */
export const deleteBucket: (
  input: DeleteBucketRequest,
) => effect.Effect<
  DeleteBucketResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketRequest,
  output: DeleteBucketResponse,
  errors: [],
}));
/**
 * This action deletes an Amazon S3 on Outposts bucket's lifecycle configuration. To delete
 * an S3 bucket's lifecycle configuration, see DeleteBucketLifecycle in the *Amazon S3 API Reference*.
 *
 * Deletes the lifecycle configuration from the specified Outposts bucket.
 * Amazon S3 on Outposts removes all the lifecycle configuration rules in the lifecycle subresource
 * associated with the bucket. Your objects never expire, and Amazon S3 on Outposts no longer
 * automatically deletes any objects on the basis of rules contained in the deleted lifecycle
 * configuration. For more information, see Using Amazon S3 on Outposts in
 * *Amazon S3 User Guide*.
 *
 * To use this operation, you must have permission to perform the
 * `s3-outposts:PutLifecycleConfiguration` action. By default, the bucket owner
 * has this permission and the Outposts bucket owner can grant this permission to
 * others.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * For more information about object expiration, see Elements to Describe Lifecycle Actions.
 *
 * Related actions include:
 *
 * - PutBucketLifecycleConfiguration
 *
 * - GetBucketLifecycleConfiguration
 */
export const deleteBucketLifecycleConfiguration: (
  input: DeleteBucketLifecycleConfigurationRequest,
) => effect.Effect<
  DeleteBucketLifecycleConfigurationResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketLifecycleConfigurationRequest,
  output: DeleteBucketLifecycleConfigurationResponse,
  errors: [],
}));
/**
 * This action deletes an Amazon S3 on Outposts bucket policy. To delete an S3 bucket policy,
 * see DeleteBucketPolicy in the *Amazon S3 API Reference*.
 *
 * This implementation of the DELETE action uses the policy subresource to delete the
 * policy of a specified Amazon S3 on Outposts bucket. If you are using an identity other than the
 * root user of the Amazon Web Services account that owns the bucket, the calling identity must have the
 * `s3-outposts:DeleteBucketPolicy` permissions on the specified Outposts bucket
 * and belong to the bucket owner's account to use this action. For more information, see
 * Using
 * Amazon S3 on Outposts in *Amazon S3 User Guide*.
 *
 * If you don't have `DeleteBucketPolicy` permissions, Amazon S3 returns a 403
 * Access Denied error. If you have the correct permissions, but you're not using an
 * identity that belongs to the bucket owner's account, Amazon S3 returns a 405 Method Not
 * Allowed error.
 *
 * As a security precaution, the root user of the Amazon Web Services account that owns a bucket can
 * always use this action, even if the policy explicitly denies the root user the ability
 * to perform this action.
 *
 * For more information about bucket policies, see Using Bucket Policies and User
 * Policies.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `DeleteBucketPolicy`:
 *
 * - GetBucketPolicy
 *
 * - PutBucketPolicy
 */
export const deleteBucketPolicy: (
  input: DeleteBucketPolicyRequest,
) => effect.Effect<
  DeleteBucketPolicyResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketPolicyRequest,
  output: DeleteBucketPolicyResponse,
  errors: [],
}));
/**
 * This operation deletes an Amazon S3 on Outposts bucket's replication configuration. To
 * delete an S3 bucket's replication configuration, see DeleteBucketReplication in the *Amazon S3 API Reference*.
 *
 * Deletes the replication configuration from the specified S3 on Outposts bucket.
 *
 * To use this operation, you must have permissions to perform the
 * `s3-outposts:PutReplicationConfiguration` action. The Outposts bucket owner
 * has this permission by default and can grant it to others. For more information about
 * permissions, see Setting up IAM with
 * S3 on Outposts and Managing access to
 * S3 on Outposts buckets in the *Amazon S3 User Guide*.
 *
 * It can take a while to propagate `PUT` or `DELETE` requests for
 * a replication configuration to all S3 on Outposts systems. Therefore, the replication
 * configuration that's returned by a `GET` request soon after a
 * `PUT` or `DELETE` request might return a more recent result
 * than what's on the Outpost. If an Outpost is offline, the delay in updating the
 * replication configuration on that Outpost can be significant.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * For information about S3 replication on Outposts configuration, see Replicating objects for S3 on Outposts in the
 * *Amazon S3 User Guide*.
 *
 * The following operations are related to `DeleteBucketReplication`:
 *
 * - PutBucketReplication
 *
 * - GetBucketReplication
 */
export const deleteBucketReplication: (
  input: DeleteBucketReplicationRequest,
) => effect.Effect<
  DeleteBucketReplicationResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketReplicationRequest,
  output: DeleteBucketReplicationResponse,
  errors: [],
}));
/**
 * This action deletes an Amazon S3 on Outposts bucket's tags. To delete an S3 bucket tags,
 * see DeleteBucketTagging in the *Amazon S3 API Reference*.
 *
 * Deletes the tags from the Outposts bucket. For more information, see Using
 * Amazon S3 on Outposts in *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `PutBucketTagging` action. By default, the bucket owner has this permission
 * and can grant this permission to others.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `DeleteBucketTagging`:
 *
 * - GetBucketTagging
 *
 * - PutBucketTagging
 */
export const deleteBucketTagging: (
  input: DeleteBucketTaggingRequest,
) => effect.Effect<
  DeleteBucketTaggingResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketTaggingRequest,
  output: DeleteBucketTaggingResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Removes the `PublicAccessBlock` configuration for an Amazon Web Services account. This
 * operation might be restricted when the account is managed by organization-level Block
 * Public Access policies. You’ll get an Access Denied (403) error when the account is managed
 * by organization-level Block Public Access policies. Organization-level policies override
 * account-level settings, preventing direct account-level modifications. For more
 * information, see Using Amazon S3 block
 * public access.
 *
 * Related actions include:
 *
 * - GetPublicAccessBlock
 *
 * - PutPublicAccessBlock
 */
export const deletePublicAccessBlock: (
  input: DeletePublicAccessBlockRequest,
) => effect.Effect<
  DeletePublicAccessBlockResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePublicAccessBlockRequest,
  output: DeletePublicAccessBlockResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Deletes the Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Assessing your storage
 * activity and usage with Amazon S3 Storage Lens in the
 * *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `s3:DeleteStorageLensConfiguration` action. For more information, see
 * Setting permissions to
 * use Amazon S3 Storage Lens in the *Amazon S3 User Guide*.
 */
export const deleteStorageLensConfiguration: (
  input: DeleteStorageLensConfigurationRequest,
) => effect.Effect<
  DeleteStorageLensConfigurationResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStorageLensConfigurationRequest,
  output: DeleteStorageLensConfigurationResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Deletes the Amazon S3 Storage Lens configuration tags. For more information about S3 Storage Lens, see
 * Assessing your
 * storage activity and usage with Amazon S3 Storage Lens in the
 * *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `s3:DeleteStorageLensConfigurationTagging` action. For more information,
 * see Setting permissions to
 * use Amazon S3 Storage Lens in the *Amazon S3 User Guide*.
 */
export const deleteStorageLensConfigurationTagging: (
  input: DeleteStorageLensConfigurationTaggingRequest,
) => effect.Effect<
  DeleteStorageLensConfigurationTaggingResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStorageLensConfigurationTaggingRequest,
  output: DeleteStorageLensConfigurationTaggingResult,
  errors: [],
}));
/**
 * Deletes an existing S3 Storage Lens group.
 *
 * To use this operation, you must have the permission to perform the
 * `s3:DeleteStorageLensGroup` action. For more information about the required Storage Lens
 * Groups permissions, see Setting account permissions to use S3 Storage Lens groups.
 *
 * For information about Storage Lens groups errors, see List of Amazon S3 Storage
 * Lens error codes.
 */
export const deleteStorageLensGroup: (
  input: DeleteStorageLensGroupRequest,
) => effect.Effect<
  DeleteStorageLensGroupResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStorageLensGroupRequest,
  output: DeleteStorageLensGroupResponse,
  errors: [],
}));
/**
 * Dissociates the Amazon Web Services IAM Identity Center instance from the S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:DissociateAccessGrantsIdentityCenter` permission to use this operation.
 *
 * ### Additional Permissions
 *
 * You must have the `sso:DeleteApplication` permission to use this operation.
 */
export const dissociateAccessGrantsIdentityCenter: (
  input: DissociateAccessGrantsIdentityCenterRequest,
) => effect.Effect<
  DissociateAccessGrantsIdentityCenterResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DissociateAccessGrantsIdentityCenterRequest,
  output: DissociateAccessGrantsIdentityCenterResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Replaces configuration for an Object Lambda Access Point.
 *
 * The following actions are related to
 * `PutAccessPointConfigurationForObjectLambda`:
 *
 * - GetAccessPointConfigurationForObjectLambda
 */
export const putAccessPointConfigurationForObjectLambda: (
  input: PutAccessPointConfigurationForObjectLambdaRequest,
) => effect.Effect<
  PutAccessPointConfigurationForObjectLambdaResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccessPointConfigurationForObjectLambdaRequest,
  output: PutAccessPointConfigurationForObjectLambdaResponse,
  errors: [],
}));
/**
 * Associates an access policy with the specified access point. Each access point can have only one policy,
 * so a request made to this API replaces any existing policy associated with the specified
 * access point.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `PutAccessPointPolicy`:
 *
 * - GetAccessPointPolicy
 *
 * - DeleteAccessPointPolicy
 */
export const putAccessPointPolicy: (
  input: PutAccessPointPolicyRequest,
) => effect.Effect<
  PutAccessPointPolicyResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccessPointPolicyRequest,
  output: PutAccessPointPolicyResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Creates or replaces resource policy for an Object Lambda Access Point. For an example policy, see Creating Object Lambda Access Points in the *Amazon S3 User Guide*.
 *
 * The following actions are related to
 * `PutAccessPointPolicyForObjectLambda`:
 *
 * - DeleteAccessPointPolicyForObjectLambda
 *
 * - GetAccessPointPolicyForObjectLambda
 */
export const putAccessPointPolicyForObjectLambda: (
  input: PutAccessPointPolicyForObjectLambdaRequest,
) => effect.Effect<
  PutAccessPointPolicyForObjectLambdaResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccessPointPolicyForObjectLambdaRequest,
  output: PutAccessPointPolicyForObjectLambdaResponse,
  errors: [],
}));
/**
 * Creates or replaces the access point scope for a directory bucket. You can use the access point scope to restrict access to specific prefixes, API operations, or a combination of both.
 *
 * You can specify any amount of prefixes, but the total length of characters of all prefixes must be less than 256 bytes in size.
 *
 * To use this operation, you must have the permission to perform the
 * `s3express:PutAccessPointScope` action.
 *
 * For information about REST API errors, see REST error responses.
 */
export const putAccessPointScope: (
  input: PutAccessPointScopeRequest,
) => effect.Effect<
  PutAccessPointScopeResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccessPointScopeRequest,
  output: PutAccessPointScopeResponse,
  errors: [],
}));
/**
 * This action puts a bucket policy to an Amazon S3 on Outposts bucket. To put a policy on an
 * S3 bucket, see PutBucketPolicy in the
 * *Amazon S3 API Reference*.
 *
 * Applies an Amazon S3 bucket policy to an Outposts bucket. For more information, see Using
 * Amazon S3 on Outposts in the *Amazon S3 User Guide*.
 *
 * If you are using an identity other than the root user of the Amazon Web Services account that owns the
 * Outposts bucket, the calling identity must have the `PutBucketPolicy`
 * permissions on the specified Outposts bucket and belong to the bucket owner's account in
 * order to use this action.
 *
 * If you don't have `PutBucketPolicy` permissions, Amazon S3 returns a 403
 * Access Denied error. If you have the correct permissions, but you're not using an
 * identity that belongs to the bucket owner's account, Amazon S3 returns a 405 Method Not
 * Allowed error.
 *
 * As a security precaution, the root user of the Amazon Web Services account that owns a bucket can
 * always use this action, even if the policy explicitly denies the root user the ability
 * to perform this action.
 *
 * For more information about bucket policies, see Using Bucket Policies and User
 * Policies.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `PutBucketPolicy`:
 *
 * - GetBucketPolicy
 *
 * - DeleteBucketPolicy
 */
export const putBucketPolicy: (
  input: PutBucketPolicyRequest,
) => effect.Effect<
  PutBucketPolicyResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketPolicyRequest,
  output: PutBucketPolicyResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Creates or modifies the `PublicAccessBlock` configuration for an
 * Amazon Web Services account. This operation may be restricted when the account is managed by
 * organization-level Block Public Access policies. You might get an Access Denied (403) error
 * when the account is managed by organization-level Block Public Access policies.
 * Organization-level policies override account-level settings, preventing direct
 * account-level modifications. For this operation, users must have the
 * `s3:PutAccountPublicAccessBlock` permission. For more information, see
 * Using Amazon S3 block public access.
 *
 * Related actions include:
 *
 * - GetPublicAccessBlock
 *
 * - DeletePublicAccessBlock
 */
export const putPublicAccessBlock: (
  input: PutPublicAccessBlockRequest,
) => effect.Effect<
  PutPublicAccessBlockResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPublicAccessBlockRequest,
  output: PutPublicAccessBlockResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Put or replace tags on an existing Amazon S3 Storage Lens configuration. For more information
 * about S3 Storage Lens, see Assessing your storage activity and usage with Amazon S3 Storage Lens in the
 * *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `s3:PutStorageLensConfigurationTagging` action. For more information, see
 * Setting permissions to
 * use Amazon S3 Storage Lens in the *Amazon S3 User Guide*.
 */
export const putStorageLensConfigurationTagging: (
  input: PutStorageLensConfigurationTaggingRequest,
) => effect.Effect<
  PutStorageLensConfigurationTaggingResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutStorageLensConfigurationTaggingRequest,
  output: PutStorageLensConfigurationTaggingResult,
  errors: [],
}));
/**
 * Creates a new user-defined tag or updates an existing tag. Each tag is a label consisting of a key and value that is applied to your resource. Tags can help you organize, track costs for, and control access to your resources. You can add up to 50 Amazon Web Services resource tags for each S3 resource.
 *
 * This operation is only supported for the following Amazon S3 resource:
 *
 * - General purpose buckets
 *
 * - Access Points for directory buckets
 *
 * - Access Points for general purpose buckets
 *
 * - Directory buckets
 *
 * - S3 Storage Lens groups
 *
 * - S3 Access Grants instances, registered locations, or grants.
 *
 * ### Permissions
 *
 * For general purpose buckets, access points for general purpose buckets, Storage Lens groups, and S3 Access Grants, you must have the `s3:TagResource` permission to use this operation.
 *
 * ### Directory bucket permissions
 *
 * For directory buckets, you must have the `s3express:TagResource` permission to use this operation. For more information about directory buckets policies and permissions, see Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region*.amazonaws.com`.
 *
 * For information about S3 Tagging errors, see List of Amazon S3 Tagging error codes.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [],
}));
/**
 * This operation removes the specified user-defined tags from an S3 resource. You can pass one or more tag keys.
 *
 * This operation is only supported for the following Amazon S3 resources:
 *
 * - General purpose buckets
 *
 * - Access Points for directory buckets
 *
 * - Access Points for general purpose buckets
 *
 * - Directory buckets
 *
 * - S3 Storage Lens groups
 *
 * - S3 Access Grants instances, registered locations, and grants.
 *
 * ### Permissions
 *
 * For general purpose buckets, access points for general purpose buckets, Storage Lens groups, and S3 Access Grants, you must have the `s3:UntagResource` permission to use this operation.
 *
 * ### Directory bucket permissions
 *
 * For directory buckets, you must have the `s3express:UntagResource` permission to use this operation. For more information about directory buckets policies and permissions, see Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region*.amazonaws.com`.
 *
 * For information about S3 Tagging errors, see List of Amazon S3
 * Tagging error codes.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [],
}));
/**
 * Updates the existing Storage Lens group.
 *
 * To use this operation, you must have the permission to perform the
 * `s3:UpdateStorageLensGroup` action. For more information about the required Storage Lens
 * Groups permissions, see Setting account permissions to use S3 Storage Lens groups.
 *
 * For information about Storage Lens groups errors, see List of Amazon S3 Storage
 * Lens error codes.
 */
export const updateStorageLensGroup: (
  input: UpdateStorageLensGroupRequest,
) => effect.Effect<
  UpdateStorageLensGroupResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStorageLensGroupRequest,
  output: UpdateStorageLensGroupResponse,
  errors: [],
}));
/**
 * Creates an S3 Access Grants instance, which serves as a logical grouping for access grants. You can create one S3 Access Grants instance per Region per account.
 *
 * ### Permissions
 *
 * You must have the `s3:CreateAccessGrantsInstance` permission to use this operation.
 *
 * ### Additional Permissions
 *
 * To associate an IAM Identity Center instance with your S3 Access Grants instance, you must also have the `sso:DescribeInstance`, `sso:CreateApplication`, `sso:PutApplicationGrant`, and `sso:PutApplicationAuthenticationMethod` permissions.
 */
export const createAccessGrantsInstance: (
  input: CreateAccessGrantsInstanceRequest,
) => effect.Effect<
  CreateAccessGrantsInstanceResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessGrantsInstanceRequest,
  output: CreateAccessGrantsInstanceResult,
  errors: [],
}));
/**
 * The S3 data location that you would like to register in your S3 Access Grants instance. Your S3 data must be in the same Region as your S3 Access Grants instance. The location can be one of the following:
 *
 * - The default S3 location `s3://`
 *
 * - A bucket - `S3://`
 *
 * - A bucket and prefix - `S3:///`
 *
 * When you register a location, you must include the IAM role that has permission to manage the S3 location that you are registering. Give S3 Access Grants permission to assume this role using a policy. S3 Access Grants assumes this role to manage access to the location and to vend temporary credentials to grantees or client applications.
 *
 * ### Permissions
 *
 * You must have the `s3:CreateAccessGrantsLocation` permission to use this operation.
 *
 * ### Additional Permissions
 *
 * You must also have the following permission for the specified IAM role: `iam:PassRole`
 */
export const createAccessGrantsLocation: (
  input: CreateAccessGrantsLocationRequest,
) => effect.Effect<
  CreateAccessGrantsLocationResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessGrantsLocationRequest,
  output: CreateAccessGrantsLocationResult,
  errors: [],
}));
/**
 * Get the details of an access grant from your S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:GetAccessGrant` permission to use this operation.
 */
export const getAccessGrant: (
  input: GetAccessGrantRequest,
) => effect.Effect<
  GetAccessGrantResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessGrantRequest,
  output: GetAccessGrantResult,
  errors: [],
}));
/**
 * Retrieves the S3 Access Grants instance for a Region in your account.
 *
 * ### Permissions
 *
 * You must have the `s3:GetAccessGrantsInstance` permission to use this operation.
 *
 * `GetAccessGrantsInstance` is not supported for cross-account access. You can only call the API from the account that owns the S3 Access Grants instance.
 */
export const getAccessGrantsInstance: (
  input: GetAccessGrantsInstanceRequest,
) => effect.Effect<
  GetAccessGrantsInstanceResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessGrantsInstanceRequest,
  output: GetAccessGrantsInstanceResult,
  errors: [],
}));
/**
 * Retrieve the S3 Access Grants instance that contains a particular prefix.
 *
 * ### Permissions
 *
 * You must have the `s3:GetAccessGrantsInstanceForPrefix` permission for the caller account to use this operation.
 *
 * ### Additional Permissions
 *
 * The prefix owner account must grant you the following permissions to their S3 Access Grants instance: `s3:GetAccessGrantsInstanceForPrefix`.
 */
export const getAccessGrantsInstanceForPrefix: (
  input: GetAccessGrantsInstanceForPrefixRequest,
) => effect.Effect<
  GetAccessGrantsInstanceForPrefixResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessGrantsInstanceForPrefixRequest,
  output: GetAccessGrantsInstanceForPrefixResult,
  errors: [],
}));
/**
 * Returns the resource policy of the S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:GetAccessGrantsInstanceResourcePolicy` permission to use this operation.
 */
export const getAccessGrantsInstanceResourcePolicy: (
  input: GetAccessGrantsInstanceResourcePolicyRequest,
) => effect.Effect<
  GetAccessGrantsInstanceResourcePolicyResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessGrantsInstanceResourcePolicyRequest,
  output: GetAccessGrantsInstanceResourcePolicyResult,
  errors: [],
}));
/**
 * Retrieves the details of a particular location registered in your S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:GetAccessGrantsLocation` permission to use this operation.
 */
export const getAccessGrantsLocation: (
  input: GetAccessGrantsLocationRequest,
) => effect.Effect<
  GetAccessGrantsLocationResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessGrantsLocationRequest,
  output: GetAccessGrantsLocationResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns configuration for an Object Lambda Access Point.
 *
 * The following actions are related to
 * `GetAccessPointConfigurationForObjectLambda`:
 *
 * - PutAccessPointConfigurationForObjectLambda
 */
export const getAccessPointConfigurationForObjectLambda: (
  input: GetAccessPointConfigurationForObjectLambdaRequest,
) => effect.Effect<
  GetAccessPointConfigurationForObjectLambdaResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPointConfigurationForObjectLambdaRequest,
  output: GetAccessPointConfigurationForObjectLambdaResult,
  errors: [],
}));
/**
 * Returns the access point policy associated with the specified access point.
 *
 * The following actions are related to `GetAccessPointPolicy`:
 *
 * - PutAccessPointPolicy
 *
 * - DeleteAccessPointPolicy
 */
export const getAccessPointPolicy: (
  input: GetAccessPointPolicyRequest,
) => effect.Effect<
  GetAccessPointPolicyResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPointPolicyRequest,
  output: GetAccessPointPolicyResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns the resource policy for an Object Lambda Access Point.
 *
 * The following actions are related to
 * `GetAccessPointPolicyForObjectLambda`:
 *
 * - DeleteAccessPointPolicyForObjectLambda
 *
 * - PutAccessPointPolicyForObjectLambda
 */
export const getAccessPointPolicyForObjectLambda: (
  input: GetAccessPointPolicyForObjectLambdaRequest,
) => effect.Effect<
  GetAccessPointPolicyForObjectLambdaResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPointPolicyForObjectLambdaRequest,
  output: GetAccessPointPolicyForObjectLambdaResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns the status of the resource policy associated with an Object Lambda Access Point.
 */
export const getAccessPointPolicyStatusForObjectLambda: (
  input: GetAccessPointPolicyStatusForObjectLambdaRequest,
) => effect.Effect<
  GetAccessPointPolicyStatusForObjectLambdaResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPointPolicyStatusForObjectLambdaRequest,
  output: GetAccessPointPolicyStatusForObjectLambdaResult,
  errors: [],
}));
/**
 * Returns the access point scope for a directory bucket.
 *
 * To use this operation, you must have the permission to perform the
 * `s3express:GetAccessPointScope` action.
 *
 * For information about REST API errors, see REST error responses.
 */
export const getAccessPointScope: (
  input: GetAccessPointScopeRequest,
) => effect.Effect<
  GetAccessPointScopeResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPointScopeRequest,
  output: GetAccessPointScopeResult,
  errors: [],
}));
/**
 * Gets an Amazon S3 on Outposts bucket. For more information, see Using Amazon S3 on Outposts in the
 * *Amazon S3 User Guide*.
 *
 * If you are using an identity other than the root user of the Amazon Web Services account that owns the
 * Outposts bucket, the calling identity must have the `s3-outposts:GetBucket`
 * permissions on the specified Outposts bucket and belong to the Outposts bucket owner's
 * account in order to use this action. Only users from Outposts bucket owner account with
 * the right permissions can perform actions on an Outposts bucket.
 *
 * If you don't have `s3-outposts:GetBucket` permissions or you're not using an
 * identity that belongs to the bucket owner's account, Amazon S3 returns a 403 Access
 * Denied error.
 *
 * The following actions are related to `GetBucket` for Amazon S3 on Outposts:
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * - PutObject
 *
 * - CreateBucket
 *
 * - DeleteBucket
 */
export const getBucket: (
  input: GetBucketRequest,
) => effect.Effect<
  GetBucketResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketRequest,
  output: GetBucketResult,
  errors: [],
}));
/**
 * This action gets an Amazon S3 on Outposts bucket's lifecycle configuration. To get an S3
 * bucket's lifecycle configuration, see GetBucketLifecycleConfiguration in the *Amazon S3 API Reference*.
 *
 * Returns the lifecycle configuration information set on the Outposts bucket. For more
 * information, see Using Amazon S3 on Outposts and for
 * information about lifecycle configuration, see Object Lifecycle
 * Management in *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `s3-outposts:GetLifecycleConfiguration` action. The Outposts bucket owner
 * has this permission, by default. The bucket owner can grant this permission to others. For
 * more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing
 * Access Permissions to Your Amazon S3 Resources.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * `GetBucketLifecycleConfiguration` has the following special error:
 *
 * - Error code: `NoSuchLifecycleConfiguration`
 *
 * - Description: The lifecycle configuration does not exist.
 *
 * - HTTP Status Code: 404 Not Found
 *
 * - SOAP Fault Code Prefix: Client
 *
 * The following actions are related to
 * `GetBucketLifecycleConfiguration`:
 *
 * - PutBucketLifecycleConfiguration
 *
 * - DeleteBucketLifecycleConfiguration
 */
export const getBucketLifecycleConfiguration: (
  input: GetBucketLifecycleConfigurationRequest,
) => effect.Effect<
  GetBucketLifecycleConfigurationResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketLifecycleConfigurationRequest,
  output: GetBucketLifecycleConfigurationResult,
  errors: [],
}));
/**
 * This action gets a bucket policy for an Amazon S3 on Outposts bucket. To get a policy for
 * an S3 bucket, see GetBucketPolicy in the
 * *Amazon S3 API Reference*.
 *
 * Returns the policy of a specified Outposts bucket. For more information, see Using
 * Amazon S3 on Outposts in the *Amazon S3 User Guide*.
 *
 * If you are using an identity other than the root user of the Amazon Web Services account that owns the
 * bucket, the calling identity must have the `GetBucketPolicy` permissions on the
 * specified bucket and belong to the bucket owner's account in order to use this
 * action.
 *
 * Only users from Outposts bucket owner account with the right permissions can perform
 * actions on an Outposts bucket. If you don't have `s3-outposts:GetBucketPolicy`
 * permissions or you're not using an identity that belongs to the bucket owner's account,
 * Amazon S3 returns a `403 Access Denied` error.
 *
 * As a security precaution, the root user of the Amazon Web Services account that owns a bucket can
 * always use this action, even if the policy explicitly denies the root user the ability
 * to perform this action.
 *
 * For more information about bucket policies, see Using Bucket Policies and User
 * Policies.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `GetBucketPolicy`:
 *
 * - GetObject
 *
 * - PutBucketPolicy
 *
 * - DeleteBucketPolicy
 */
export const getBucketPolicy: (
  input: GetBucketPolicyRequest,
) => effect.Effect<
  GetBucketPolicyResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketPolicyRequest,
  output: GetBucketPolicyResult,
  errors: [],
}));
/**
 * This operation gets an Amazon S3 on Outposts bucket's replication configuration. To get an
 * S3 bucket's replication configuration, see GetBucketReplication
 * in the *Amazon S3 API Reference*.
 *
 * Returns the replication configuration of an S3 on Outposts bucket. For more information
 * about S3 on Outposts, see Using Amazon S3 on Outposts in the
 * *Amazon S3 User Guide*. For information about S3 replication on Outposts
 * configuration, see Replicating objects for
 * S3 on Outposts in the *Amazon S3 User Guide*.
 *
 * It can take a while to propagate `PUT` or `DELETE` requests for
 * a replication configuration to all S3 on Outposts systems. Therefore, the replication
 * configuration that's returned by a `GET` request soon after a
 * `PUT` or `DELETE` request might return a more recent result
 * than what's on the Outpost. If an Outpost is offline, the delay in updating the
 * replication configuration on that Outpost can be significant.
 *
 * This action requires permissions for the
 * `s3-outposts:GetReplicationConfiguration` action. The Outposts bucket owner
 * has this permission by default and can grant it to others. For more information about
 * permissions, see Setting up IAM with
 * S3 on Outposts and Managing access to
 * S3 on Outposts bucket in the *Amazon S3 User Guide*.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * If you include the `Filter` element in a replication configuration, you must
 * also include the `DeleteMarkerReplication`, `Status`, and
 * `Priority` elements. The response also returns those elements.
 *
 * For information about S3 on Outposts replication failure reasons, see Replication failure reasons in the *Amazon S3 User Guide*.
 *
 * The following operations are related to `GetBucketReplication`:
 *
 * - PutBucketReplication
 *
 * - DeleteBucketReplication
 */
export const getBucketReplication: (
  input: GetBucketReplicationRequest,
) => effect.Effect<
  GetBucketReplicationResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketReplicationRequest,
  output: GetBucketReplicationResult,
  errors: [],
}));
/**
 * This action gets an Amazon S3 on Outposts bucket's tags. To get an S3 bucket tags, see
 * GetBucketTagging in the *Amazon S3 API Reference*.
 *
 * Returns the tag set associated with the Outposts bucket. For more information, see
 * Using
 * Amazon S3 on Outposts in the *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `GetBucketTagging` action. By default, the bucket owner has this permission
 * and can grant this permission to others.
 *
 * `GetBucketTagging` has the following special error:
 *
 * - Error code: `NoSuchTagSetError`
 *
 * - Description: There is no tag set associated with the bucket.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `GetBucketTagging`:
 *
 * - PutBucketTagging
 *
 * - DeleteBucketTagging
 */
export const getBucketTagging: (
  input: GetBucketTaggingRequest,
) => effect.Effect<
  GetBucketTaggingResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketTaggingRequest,
  output: GetBucketTaggingResult,
  errors: [],
}));
/**
 * This operation returns the versioning state
 * for
 * S3 on Outposts
 * buckets
 * only. To return the versioning state for an S3 bucket, see GetBucketVersioning in the *Amazon S3 API Reference*.
 *
 * Returns the versioning state for an S3 on Outposts bucket. With
 * S3
 * Versioning,
 * you can save multiple distinct copies of your
 * objects
 * and recover from unintended user actions and application failures.
 *
 * If you've never set versioning on your bucket, it has no versioning state. In that case,
 * the `GetBucketVersioning` request does not return a versioning state
 * value.
 *
 * For more information about versioning, see Versioning in the Amazon S3
 * User Guide.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following operations are related to `GetBucketVersioning` for
 * S3 on Outposts.
 *
 * - PutBucketVersioning
 *
 * - PutBucketLifecycleConfiguration
 *
 * - GetBucketLifecycleConfiguration
 */
export const getBucketVersioning: (
  input: GetBucketVersioningRequest,
) => effect.Effect<
  GetBucketVersioningResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketVersioningRequest,
  output: GetBucketVersioningResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Indicates whether the specified Multi-Region Access Point has an access control policy that allows public
 * access.
 *
 * This action will always be routed to the US West (Oregon) Region. For more information
 * about the restrictions around working with Multi-Region Access Points, see Multi-Region Access Point
 * restrictions and limitations in the *Amazon S3 User Guide*.
 *
 * The following actions are related to
 * `GetMultiRegionAccessPointPolicyStatus`:
 *
 * - GetMultiRegionAccessPointPolicy
 *
 * - PutMultiRegionAccessPointPolicy
 */
export const getMultiRegionAccessPointPolicyStatus: (
  input: GetMultiRegionAccessPointPolicyStatusRequest,
) => effect.Effect<
  GetMultiRegionAccessPointPolicyStatusResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMultiRegionAccessPointPolicyStatusRequest,
  output: GetMultiRegionAccessPointPolicyStatusResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns the routing configuration for a Multi-Region Access Point, indicating which Regions are active or
 * passive.
 *
 * To obtain routing control changes and failover requests, use the Amazon S3 failover control
 * infrastructure endpoints in these five Amazon Web Services Regions:
 *
 * - `us-east-1`
 *
 * - `us-west-2`
 *
 * - `ap-southeast-2`
 *
 * - `ap-northeast-1`
 *
 * - `eu-west-1`
 */
export const getMultiRegionAccessPointRoutes: (
  input: GetMultiRegionAccessPointRoutesRequest,
) => effect.Effect<
  GetMultiRegionAccessPointRoutesResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMultiRegionAccessPointRoutesRequest,
  output: GetMultiRegionAccessPointRoutesResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Gets the Amazon S3 Storage Lens configuration. For more information, see Assessing your storage
 * activity and usage with Amazon S3 Storage Lens in the
 * *Amazon S3 User Guide*. For a complete list of S3 Storage Lens metrics, see S3 Storage Lens metrics glossary in the *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `s3:GetStorageLensConfiguration` action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the
 * *Amazon S3 User Guide*.
 */
export const getStorageLensConfiguration: (
  input: GetStorageLensConfigurationRequest,
) => effect.Effect<
  GetStorageLensConfigurationResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStorageLensConfigurationRequest,
  output: GetStorageLensConfigurationResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Gets the tags of Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see
 * Assessing your
 * storage activity and usage with Amazon S3 Storage Lens in the
 * *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `s3:GetStorageLensConfigurationTagging` action. For more information, see
 * Setting permissions to
 * use Amazon S3 Storage Lens in the *Amazon S3 User Guide*.
 */
export const getStorageLensConfigurationTagging: (
  input: GetStorageLensConfigurationTaggingRequest,
) => effect.Effect<
  GetStorageLensConfigurationTaggingResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStorageLensConfigurationTaggingRequest,
  output: GetStorageLensConfigurationTaggingResult,
  errors: [],
}));
/**
 * Retrieves the Storage Lens group configuration details.
 *
 * To use this operation, you must have the permission to perform the
 * `s3:GetStorageLensGroup` action. For more information about the required Storage Lens
 * Groups permissions, see Setting account permissions to use S3 Storage Lens groups.
 *
 * For information about Storage Lens groups errors, see List of Amazon S3 Storage
 * Lens error codes.
 */
export const getStorageLensGroup: (
  input: GetStorageLensGroupRequest,
) => effect.Effect<
  GetStorageLensGroupResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStorageLensGroupRequest,
  output: GetStorageLensGroupResult,
  errors: [],
}));
/**
 * Returns a list of the access points that are owned by the Amazon Web Services account and that are associated with the specified directory bucket.
 *
 * To list access points for general purpose buckets, see ListAccesspoints.
 *
 * To use this operation, you must have the permission to perform the
 * `s3express:ListAccessPointsForDirectoryBuckets` action.
 *
 * For information about REST API errors, see REST error responses.
 */
export const listAccessPointsForDirectoryBuckets: {
  (
    input: ListAccessPointsForDirectoryBucketsRequest,
  ): effect.Effect<
    ListAccessPointsForDirectoryBucketsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessPointsForDirectoryBucketsRequest,
  ) => stream.Stream<
    ListAccessPointsForDirectoryBucketsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessPointsForDirectoryBucketsRequest,
  ) => stream.Stream<
    AccessPoint,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessPointsForDirectoryBucketsRequest,
  output: ListAccessPointsForDirectoryBucketsResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AccessPointList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns a list of the Multi-Region Access Points currently associated with the specified Amazon Web Services account.
 * Each call can return up to 100 Multi-Region Access Points, the maximum number of Multi-Region Access Points that can be
 * associated with a single account.
 *
 * This action will always be routed to the US West (Oregon) Region. For more information
 * about the restrictions around working with Multi-Region Access Points, see Multi-Region Access Point
 * restrictions and limitations in the *Amazon S3 User Guide*.
 *
 * The following actions are related to `ListMultiRegionAccessPoint`:
 *
 * - CreateMultiRegionAccessPoint
 *
 * - DeleteMultiRegionAccessPoint
 *
 * - DescribeMultiRegionAccessPointOperation
 *
 * - GetMultiRegionAccessPoint
 */
export const listMultiRegionAccessPoints: {
  (
    input: ListMultiRegionAccessPointsRequest,
  ): effect.Effect<
    ListMultiRegionAccessPointsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListMultiRegionAccessPointsRequest,
  ) => stream.Stream<
    ListMultiRegionAccessPointsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListMultiRegionAccessPointsRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMultiRegionAccessPointsRequest,
  output: ListMultiRegionAccessPointsResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation allows you to list all of the tags for a specified resource. Each tag is a label consisting of a key and value. Tags can help you organize, track costs for, and control access to resources.
 *
 * This operation is only supported for the following Amazon S3 resources:
 *
 * - General purpose buckets
 *
 * - Access Points for directory buckets
 *
 * - Access Points for general purpose buckets
 *
 * - Directory buckets
 *
 * - S3 Storage Lens groups
 *
 * - S3 Access Grants instances, registered locations, and grants.
 *
 * ### Permissions
 *
 * For general purpose buckets, access points for general purpose buckets, Storage Lens groups, and S3 Access Grants, you must have the `s3:ListTagsForResource` permission to use this operation.
 *
 * ### Directory bucket permissions
 *
 * For directory buckets, you must have the `s3express:ListTagsForResource` permission to use this operation. For more information about directory buckets policies and permissions, see Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region*.amazonaws.com`.
 *
 * For information about S3 Tagging errors, see List of Amazon S3 Tagging error codes.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [],
}));
/**
 * Updates the resource policy of the S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:PutAccessGrantsInstanceResourcePolicy` permission to use this operation.
 */
export const putAccessGrantsInstanceResourcePolicy: (
  input: PutAccessGrantsInstanceResourcePolicyRequest,
) => effect.Effect<
  PutAccessGrantsInstanceResourcePolicyResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccessGrantsInstanceResourcePolicyRequest,
  output: PutAccessGrantsInstanceResourcePolicyResult,
  errors: [],
}));
/**
 * This action puts tags on an Amazon S3 on Outposts bucket. To put tags on an S3 bucket, see
 * PutBucketTagging in the *Amazon S3 API Reference*.
 *
 * Sets the tags for an S3 on Outposts bucket. For more information, see Using
 * Amazon S3 on Outposts in the *Amazon S3 User Guide*.
 *
 * Use tags to organize your Amazon Web Services bill to reflect your own cost structure. To do this,
 * sign up to get your Amazon Web Services account bill with tag key values included. Then, to see the cost
 * of combined resources, organize your billing information according to resources with the
 * same tag key values. For example, you can tag several resources with a specific application
 * name, and then organize your billing information to see the total cost of that application
 * across several services. For more information, see Cost allocation and
 * tagging.
 *
 * Within a bucket, if you add a tag that has the same key as an existing tag, the new
 * value overwrites the old value. For more information, see Using cost allocation in Amazon S3
 * bucket tags.
 *
 * To use this action, you must have permissions to perform the
 * `s3-outposts:PutBucketTagging` action. The Outposts bucket owner has this
 * permission by default and can grant this permission to others. For more information about
 * permissions, see Permissions Related to Bucket Subresource Operations and Managing
 * access permissions to your Amazon S3 resources.
 *
 * `PutBucketTagging` has the following special errors:
 *
 * - Error code: `InvalidTagError`
 *
 * - Description: The tag provided was not a valid tag. This error can occur if
 * the tag did not pass input validation. For information about tag restrictions,
 * see
 * User-Defined Tag Restrictions and
 * Amazon Web Services-Generated Cost Allocation Tag Restrictions.
 *
 * - Error code: `MalformedXMLError`
 *
 * - Description: The XML provided does not match the schema.
 *
 * - Error code: `OperationAbortedError `
 *
 * - Description: A conflicting conditional action is currently in progress
 * against this resource. Try again.
 *
 * - Error code: `InternalError`
 *
 * - Description: The service was unable to apply the provided tag to the
 * bucket.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `PutBucketTagging`:
 *
 * - GetBucketTagging
 *
 * - DeleteBucketTagging
 */
export const putBucketTagging: (
  input: PutBucketTaggingRequest,
) => effect.Effect<
  PutBucketTaggingResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketTaggingRequest,
  output: PutBucketTaggingResponse,
  errors: [],
}));
/**
 * This operation sets the versioning state
 * for
 * S3 on Outposts
 * buckets
 * only. To set the versioning state for an S3 bucket, see PutBucketVersioning in the *Amazon S3 API Reference*.
 *
 * Sets the versioning state for an S3 on Outposts bucket. With
 * S3
 * Versioning,
 * you can save multiple distinct copies of your
 * objects
 * and recover from unintended user actions and application failures.
 *
 * You can set the versioning state to one of the following:
 *
 * - **Enabled** - Enables versioning for the objects in
 * the bucket. All objects added to the bucket receive a unique version ID.
 *
 * - **Suspended** - Suspends versioning for the objects
 * in the bucket. All objects added to the bucket receive the version ID
 * `null`.
 *
 * If you've never set versioning on your bucket, it has no versioning state. In that case,
 * a
 * GetBucketVersioning request does not return a versioning state value.
 *
 * When you enable S3 Versioning, for each object in your bucket, you have a current
 * version and zero or more noncurrent versions. You can configure your bucket S3 Lifecycle
 * rules to expire noncurrent versions after a specified time period. For more information,
 * see Creating and managing
 * a lifecycle configuration for your S3 on Outposts bucket in the Amazon S3
 * User Guide.
 *
 * If you have an object expiration lifecycle configuration in your non-versioned bucket
 * and you want to maintain the same permanent delete behavior when you enable versioning, you
 * must add a noncurrent expiration policy. The noncurrent expiration lifecycle configuration
 * will manage the deletes of the noncurrent object versions in the version-enabled bucket.
 * For more information, see Versioning in the Amazon S3
 * User Guide.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following operations are related to `PutBucketVersioning` for
 * S3 on Outposts.
 *
 * - GetBucketVersioning
 *
 * - PutBucketLifecycleConfiguration
 *
 * - GetBucketLifecycleConfiguration
 */
export const putBucketVersioning: (
  input: PutBucketVersioningRequest,
) => effect.Effect<
  PutBucketVersioningResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketVersioningRequest,
  output: PutBucketVersioningResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Submits an updated route configuration for a Multi-Region Access Point. This API operation updates the
 * routing status for the specified Regions from active to passive, or from passive to active.
 * A value of `0` indicates a passive status, which means that traffic won't be
 * routed to the specified Region. A value of `100` indicates an active status,
 * which means that traffic will be routed to the specified Region. At least one Region must
 * be active at all times.
 *
 * When the routing configuration is changed, any in-progress operations (uploads, copies,
 * deletes, and so on) to formerly active Regions will continue to run to their final
 * completion state (success or failure). The routing configurations of any Regions that
 * aren’t specified remain unchanged.
 *
 * Updated routing configurations might not be immediately applied. It can take up to 2
 * minutes for your changes to take effect.
 *
 * To submit routing control changes and failover requests, use the Amazon S3 failover control
 * infrastructure endpoints in these five Amazon Web Services Regions:
 *
 * - `us-east-1`
 *
 * - `us-west-2`
 *
 * - `ap-southeast-2`
 *
 * - `ap-northeast-1`
 *
 * - `eu-west-1`
 */
export const submitMultiRegionAccessPointRoutes: (
  input: SubmitMultiRegionAccessPointRoutesRequest,
) => effect.Effect<
  SubmitMultiRegionAccessPointRoutesResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitMultiRegionAccessPointRoutesRequest,
  output: SubmitMultiRegionAccessPointRoutesResult,
  errors: [],
}));
/**
 * Updates the IAM role of a registered location in your S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:UpdateAccessGrantsLocation` permission to use this operation.
 *
 * ### Additional Permissions
 *
 * You must also have the following permission: `iam:PassRole`
 */
export const updateAccessGrantsLocation: (
  input: UpdateAccessGrantsLocationRequest,
) => effect.Effect<
  UpdateAccessGrantsLocationResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessGrantsLocationRequest,
  output: UpdateAccessGrantsLocationResult,
  errors: [],
}));
/**
 * Creates an access grant that gives a grantee access to your S3 data. The grantee can be an IAM user or role or a directory user, or group. Before you can create a grant, you must have an S3 Access Grants instance in the same Region as the S3 data. You can create an S3 Access Grants instance using the CreateAccessGrantsInstance. You must also have registered at least one S3 data location in your S3 Access Grants instance using CreateAccessGrantsLocation.
 *
 * ### Permissions
 *
 * You must have the `s3:CreateAccessGrant` permission to use this operation.
 *
 * ### Additional Permissions
 *
 * For any directory identity - `sso:DescribeInstance` and `sso:DescribeApplication`
 *
 * For directory users - `identitystore:DescribeUser`
 *
 * For directory groups - `identitystore:DescribeGroup`
 */
export const createAccessGrant: (
  input: CreateAccessGrantRequest,
) => effect.Effect<
  CreateAccessGrantResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessGrantRequest,
  output: CreateAccessGrantResult,
  errors: [],
}));
/**
 * Creates an access point and associates it to a specified bucket. For more information, see
 * Managing
 * access to shared datasets with access points or Managing access to
 * shared datasets in directory buckets with access points in the
 * *Amazon S3 User Guide*.
 *
 * To create an access point and attach it to a volume on an Amazon FSx file system, see CreateAndAttachS3AccessPoint in the Amazon FSx API
 * Reference.
 *
 * S3 on Outposts only supports VPC-style access points.
 *
 * For more information, see Accessing Amazon S3 on Outposts using
 * virtual private cloud (VPC) only access points in the
 * *Amazon S3 User Guide*.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `CreateAccessPoint`:
 *
 * - GetAccessPoint
 *
 * - DeleteAccessPoint
 *
 * - ListAccessPoints
 *
 * - ListAccessPointsForDirectoryBuckets
 */
export const createAccessPoint: (
  input: CreateAccessPointRequest,
) => effect.Effect<
  CreateAccessPointResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPointRequest,
  output: CreateAccessPointResult,
  errors: [],
}));
/**
 * This action creates an Amazon S3 on Outposts bucket. To create an S3 bucket, see Create
 * Bucket in the *Amazon S3 API Reference*.
 *
 * Creates a new Outposts bucket. By creating the bucket, you become the bucket owner. To
 * create an Outposts bucket, you must have S3 on Outposts. For more information, see Using
 * Amazon S3 on Outposts in *Amazon S3 User Guide*.
 *
 * Not every string is an acceptable bucket name. For information on bucket naming
 * restrictions, see Working with
 * Amazon S3 Buckets.
 *
 * S3 on Outposts buckets support:
 *
 * - Tags
 *
 * - LifecycleConfigurations for deleting expired objects
 *
 * For a complete list of restrictions and Amazon S3 feature limitations on S3 on Outposts, see
 *
 * Amazon S3 on Outposts Restrictions and Limitations.
 *
 * For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts
 * endpoint hostname prefix and `x-amz-outpost-id` in your API request, see the
 * Examples section.
 *
 * The following actions are related to `CreateBucket` for
 * Amazon S3 on Outposts:
 *
 * - PutObject
 *
 * - GetBucket
 *
 * - DeleteBucket
 *
 * - CreateAccessPoint
 *
 * - PutAccessPointPolicy
 */
export const createBucket: (
  input: CreateBucketRequest,
) => effect.Effect<
  CreateBucketResult,
  BucketAlreadyExists | BucketAlreadyOwnedByYou | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBucketRequest,
  output: CreateBucketResult,
  errors: [BucketAlreadyExists, BucketAlreadyOwnedByYou],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Deletes a Multi-Region Access Point. This action does not delete the buckets associated with the Multi-Region Access Point,
 * only the Multi-Region Access Point itself.
 *
 * This action will always be routed to the US West (Oregon) Region. For more information
 * about the restrictions around working with Multi-Region Access Points, see Multi-Region Access Point
 * restrictions and limitations in the *Amazon S3 User Guide*.
 *
 * This request is asynchronous, meaning that you might receive a response before the
 * command has completed. When this request provides a response, it provides a token that you
 * can use to monitor the status of the request with
 * `DescribeMultiRegionAccessPointOperation`.
 *
 * The following actions are related to `DeleteMultiRegionAccessPoint`:
 *
 * - CreateMultiRegionAccessPoint
 *
 * - DescribeMultiRegionAccessPointOperation
 *
 * - GetMultiRegionAccessPoint
 *
 * - ListMultiRegionAccessPoints
 */
export const deleteMultiRegionAccessPoint: (
  input: DeleteMultiRegionAccessPointRequest,
) => effect.Effect<
  DeleteMultiRegionAccessPointResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMultiRegionAccessPointRequest,
  output: DeleteMultiRegionAccessPointResult,
  errors: [],
}));
/**
 * Returns configuration information about the specified access point.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `GetAccessPoint`:
 *
 * - CreateAccessPoint
 *
 * - DeleteAccessPoint
 *
 * - ListAccessPoints
 */
export const getAccessPoint: (
  input: GetAccessPointRequest,
) => effect.Effect<
  GetAccessPointResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPointRequest,
  output: GetAccessPointResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns configuration information about the specified Object Lambda Access Point
 *
 * The following actions are related to `GetAccessPointForObjectLambda`:
 *
 * - CreateAccessPointForObjectLambda
 *
 * - DeleteAccessPointForObjectLambda
 *
 * - ListAccessPointsForObjectLambda
 */
export const getAccessPointForObjectLambda: (
  input: GetAccessPointForObjectLambdaRequest,
) => effect.Effect<
  GetAccessPointForObjectLambdaResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPointForObjectLambdaRequest,
  output: GetAccessPointForObjectLambdaResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Indicates whether the specified access point currently has a policy that allows public access.
 * For more information about public access through access points, see Managing Data Access with Amazon S3
 * access points in the *Amazon S3 User Guide*.
 */
export const getAccessPointPolicyStatus: (
  input: GetAccessPointPolicyStatusRequest,
) => effect.Effect<
  GetAccessPointPolicyStatusResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPointPolicyStatusRequest,
  output: GetAccessPointPolicyStatusResult,
  errors: [],
}));
/**
 * Returns a temporary access credential from S3 Access Grants to the grantee or client application. The temporary credential is an Amazon Web Services STS token that grants them access to the S3 data.
 *
 * ### Permissions
 *
 * You must have the `s3:GetDataAccess` permission to use this operation.
 *
 * ### Additional Permissions
 *
 * The IAM role that S3 Access Grants assumes must have the following permissions specified in the trust policy when registering the location: `sts:AssumeRole`, for directory users or groups `sts:SetContext`, and for IAM users or roles `sts:SetSourceIdentity`.
 */
export const getDataAccess: (
  input: GetDataAccessRequest,
) => effect.Effect<
  GetDataAccessResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataAccessRequest,
  output: GetDataAccessResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Retrieves the `PublicAccessBlock` configuration for an Amazon Web Services account. This
 * operation returns the effective account-level configuration, which may inherit from
 * organization-level policies. For more information, see Using Amazon S3 block
 * public access.
 *
 * Related actions include:
 *
 * - DeletePublicAccessBlock
 *
 * - PutPublicAccessBlock
 */
export const getPublicAccessBlock: (
  input: GetPublicAccessBlockRequest,
) => effect.Effect<
  GetPublicAccessBlockOutput,
  NoSuchPublicAccessBlockConfiguration | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPublicAccessBlockRequest,
  output: GetPublicAccessBlockOutput,
  errors: [NoSuchPublicAccessBlockConfiguration],
}));
/**
 * Returns the list of access grants in your S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:ListAccessGrants` permission to use this operation.
 */
export const listAccessGrants: {
  (
    input: ListAccessGrantsRequest,
  ): effect.Effect<
    ListAccessGrantsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessGrantsRequest,
  ) => stream.Stream<
    ListAccessGrantsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessGrantsRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessGrantsRequest,
  output: ListAccessGrantsResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of S3 Access Grants instances. An S3 Access Grants instance serves as a logical grouping for your individual access grants. You can only have one S3 Access Grants instance per Region per account.
 *
 * ### Permissions
 *
 * You must have the `s3:ListAccessGrantsInstances` permission to use this operation.
 */
export const listAccessGrantsInstances: {
  (
    input: ListAccessGrantsInstancesRequest,
  ): effect.Effect<
    ListAccessGrantsInstancesResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessGrantsInstancesRequest,
  ) => stream.Stream<
    ListAccessGrantsInstancesResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessGrantsInstancesRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessGrantsInstancesRequest,
  output: ListAccessGrantsInstancesResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of the locations registered in your S3 Access Grants instance.
 *
 * ### Permissions
 *
 * You must have the `s3:ListAccessGrantsLocations` permission to use this operation.
 */
export const listAccessGrantsLocations: {
  (
    input: ListAccessGrantsLocationsRequest,
  ): effect.Effect<
    ListAccessGrantsLocationsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessGrantsLocationsRequest,
  ) => stream.Stream<
    ListAccessGrantsLocationsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessGrantsLocationsRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessGrantsLocationsRequest,
  output: ListAccessGrantsLocationsResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns a list of the access points. You can retrieve up to 1,000 access points per call. If the call
 * returns more than 1,000 access points (or the number specified in `maxResults`,
 * whichever is less), the response will include a continuation token that you can use to list
 * the additional access points.
 *
 * Returns only access points attached to S3 buckets by default. To return all access points specify
 * `DataSourceType` as `ALL`.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to `ListAccessPoints`:
 *
 * - CreateAccessPoint
 *
 * - DeleteAccessPoint
 *
 * - GetAccessPoint
 */
export const listAccessPoints: {
  (
    input: ListAccessPointsRequest,
  ): effect.Effect<
    ListAccessPointsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessPointsRequest,
  ) => stream.Stream<
    ListAccessPointsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessPointsRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessPointsRequest,
  output: ListAccessPointsResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns some or all (up to 1,000) access points associated with the Object Lambda Access Point per call. If there
 * are more access points than what can be returned in one call, the response will include a
 * continuation token that you can use to list the additional access points.
 *
 * The following actions are related to
 * `ListAccessPointsForObjectLambda`:
 *
 * - CreateAccessPointForObjectLambda
 *
 * - DeleteAccessPointForObjectLambda
 *
 * - GetAccessPointForObjectLambda
 */
export const listAccessPointsForObjectLambda: {
  (
    input: ListAccessPointsForObjectLambdaRequest,
  ): effect.Effect<
    ListAccessPointsForObjectLambdaResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessPointsForObjectLambdaRequest,
  ) => stream.Stream<
    ListAccessPointsForObjectLambdaResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessPointsForObjectLambdaRequest,
  ) => stream.Stream<
    ObjectLambdaAccessPoint,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessPointsForObjectLambdaRequest,
  output: ListAccessPointsForObjectLambdaResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ObjectLambdaAccessPointList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Use this API to list the access grants that grant the caller access to Amazon S3 data through S3 Access Grants. The caller (grantee) can be an Identity and Access Management (IAM) identity or Amazon Web Services Identity Center corporate directory identity. You must pass the Amazon Web Services account of the S3 data owner (grantor) in the request. You can, optionally, narrow the results by `GrantScope`, using a fragment of the data's S3 path, and S3 Access Grants will return only the grants with a path that contains the path fragment. You can also pass the `AllowedByApplication` filter in the request, which returns only the grants authorized for applications, whether the application is the caller's Identity Center application or any other application (`ALL`). For more information, see List the caller's access grants in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3:ListCallerAccessGrants` permission to use this operation.
 */
export const listCallerAccessGrants: {
  (
    input: ListCallerAccessGrantsRequest,
  ): effect.Effect<
    ListCallerAccessGrantsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListCallerAccessGrantsRequest,
  ) => stream.Stream<
    ListCallerAccessGrantsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListCallerAccessGrantsRequest,
  ) => stream.Stream<
    ListCallerAccessGrantsEntry,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCallerAccessGrantsRequest,
  output: ListCallerAccessGrantsResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CallerAccessGrantsList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns a list of all Outposts buckets in an Outpost that are owned by the authenticated
 * sender of the request. For more information, see Using Amazon S3 on Outposts in the
 * *Amazon S3 User Guide*.
 *
 * For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts
 * endpoint hostname prefix and `x-amz-outpost-id` in your request, see the Examples section.
 */
export const listRegionalBuckets: {
  (
    input: ListRegionalBucketsRequest,
  ): effect.Effect<
    ListRegionalBucketsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListRegionalBucketsRequest,
  ) => stream.Stream<
    ListRegionalBucketsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListRegionalBucketsRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRegionalBucketsRequest,
  output: ListRegionalBucketsResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Gets a list of Amazon S3 Storage Lens configurations. For more information about S3 Storage Lens, see
 * Assessing your
 * storage activity and usage with Amazon S3 Storage Lens in the
 * *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `s3:ListStorageLensConfigurations` action. For more information, see
 * Setting permissions to
 * use Amazon S3 Storage Lens in the *Amazon S3 User Guide*.
 */
export const listStorageLensConfigurations: {
  (
    input: ListStorageLensConfigurationsRequest,
  ): effect.Effect<
    ListStorageLensConfigurationsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStorageLensConfigurationsRequest,
  ) => stream.Stream<
    ListStorageLensConfigurationsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStorageLensConfigurationsRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStorageLensConfigurationsRequest,
  output: ListStorageLensConfigurationsResult,
  errors: [],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));
/**
 * Lists all the Storage Lens groups in the specified home Region.
 *
 * To use this operation, you must have the permission to perform the
 * `s3:ListStorageLensGroups` action. For more information about the required Storage Lens
 * Groups permissions, see Setting account permissions to use S3 Storage Lens groups.
 *
 * For information about Storage Lens groups errors, see List of Amazon S3 Storage
 * Lens error codes.
 */
export const listStorageLensGroups: {
  (
    input: ListStorageLensGroupsRequest,
  ): effect.Effect<
    ListStorageLensGroupsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStorageLensGroupsRequest,
  ) => stream.Stream<
    ListStorageLensGroupsResult,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStorageLensGroupsRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStorageLensGroupsRequest,
  output: ListStorageLensGroupsResult,
  errors: [],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Associates an access control policy with the specified Multi-Region Access Point. Each Multi-Region Access Point can have only
 * one policy, so a request made to this action replaces any existing policy that is
 * associated with the specified Multi-Region Access Point.
 *
 * This action will always be routed to the US West (Oregon) Region. For more information
 * about the restrictions around working with Multi-Region Access Points, see Multi-Region Access Point
 * restrictions and limitations in the *Amazon S3 User Guide*.
 *
 * The following actions are related to
 * `PutMultiRegionAccessPointPolicy`:
 *
 * - GetMultiRegionAccessPointPolicy
 *
 * - GetMultiRegionAccessPointPolicyStatus
 */
export const putMultiRegionAccessPointPolicy: (
  input: PutMultiRegionAccessPointPolicyRequest,
) => effect.Effect<
  PutMultiRegionAccessPointPolicyResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMultiRegionAccessPointPolicyRequest,
  output: PutMultiRegionAccessPointPolicyResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Creates a Multi-Region Access Point and associates it with the specified buckets. For more information
 * about creating Multi-Region Access Points, see Creating Multi-Region Access Points in the *Amazon S3 User Guide*.
 *
 * This action will always be routed to the US West (Oregon) Region. For more information
 * about the restrictions around working with Multi-Region Access Points, see Multi-Region Access Point
 * restrictions and limitations in the *Amazon S3 User Guide*.
 *
 * This request is asynchronous, meaning that you might receive a response before the
 * command has completed. When this request provides a response, it provides a token that you
 * can use to monitor the status of the request with
 * `DescribeMultiRegionAccessPointOperation`.
 *
 * The following actions are related to `CreateMultiRegionAccessPoint`:
 *
 * - DeleteMultiRegionAccessPoint
 *
 * - DescribeMultiRegionAccessPointOperation
 *
 * - GetMultiRegionAccessPoint
 *
 * - ListMultiRegionAccessPoints
 */
export const createMultiRegionAccessPoint: (
  input: CreateMultiRegionAccessPointRequest,
) => effect.Effect<
  CreateMultiRegionAccessPointResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMultiRegionAccessPointRequest,
  output: CreateMultiRegionAccessPointResult,
  errors: [],
}));
/**
 * Creates a new S3 Storage Lens group and associates it with the specified Amazon Web Services account ID. An
 * S3 Storage Lens group is a custom grouping of objects based on prefix, suffix, object tags,
 * object size, object age, or a combination of these filters. For each Storage Lens group
 * that you’ve created, you can also optionally add Amazon Web Services resource tags. For more information
 * about S3 Storage Lens groups, see Working with S3 Storage Lens
 * groups.
 *
 * To use this operation, you must have the permission to perform the
 * `s3:CreateStorageLensGroup` action. If you’re trying to create a Storage Lens
 * group with Amazon Web Services resource tags, you must also have permission to perform the
 * `s3:TagResource` action. For more information about the required Storage Lens
 * Groups permissions, see Setting account permissions to use S3 Storage Lens groups.
 *
 * For information about Storage Lens groups errors, see List of Amazon S3 Storage
 * Lens error codes.
 */
export const createStorageLensGroup: (
  input: CreateStorageLensGroupRequest,
) => effect.Effect<
  CreateStorageLensGroupResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStorageLensGroupRequest,
  output: CreateStorageLensGroupResponse,
  errors: [],
}));
/**
 * Removes the entire tag set from the specified S3 Batch Operations job.
 *
 * ### Permissions
 *
 * To use the
 * `DeleteJobTagging` operation, you must have permission to
 * perform the `s3:DeleteJobTagging` action. For more information, see Controlling
 * access and labeling jobs using tags in the
 * *Amazon S3 User Guide*.
 *
 * Related actions include:
 *
 * - CreateJob
 *
 * - GetJobTagging
 *
 * - PutJobTagging
 */
export const deleteJobTagging: (
  input: DeleteJobTaggingRequest,
) => effect.Effect<
  DeleteJobTaggingResult,
  | InternalServiceException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobTaggingRequest,
  output: DeleteJobTaggingResult,
  errors: [
    InternalServiceException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns configuration information about the specified Multi-Region Access Point.
 *
 * This action will always be routed to the US West (Oregon) Region. For more information
 * about the restrictions around working with Multi-Region Access Points, see Multi-Region Access Point
 * restrictions and limitations in the *Amazon S3 User Guide*.
 *
 * The following actions are related to `GetMultiRegionAccessPoint`:
 *
 * - CreateMultiRegionAccessPoint
 *
 * - DeleteMultiRegionAccessPoint
 *
 * - DescribeMultiRegionAccessPointOperation
 *
 * - ListMultiRegionAccessPoints
 */
export const getMultiRegionAccessPoint: (
  input: GetMultiRegionAccessPointRequest,
) => effect.Effect<
  GetMultiRegionAccessPointResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMultiRegionAccessPointRequest,
  output: GetMultiRegionAccessPointResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Returns the access control policy of the specified Multi-Region Access Point.
 *
 * This action will always be routed to the US West (Oregon) Region. For more information
 * about the restrictions around working with Multi-Region Access Points, see Multi-Region Access Point
 * restrictions and limitations in the *Amazon S3 User Guide*.
 *
 * The following actions are related to
 * `GetMultiRegionAccessPointPolicy`:
 *
 * - GetMultiRegionAccessPointPolicyStatus
 *
 * - PutMultiRegionAccessPointPolicy
 */
export const getMultiRegionAccessPointPolicy: (
  input: GetMultiRegionAccessPointPolicyRequest,
) => effect.Effect<
  GetMultiRegionAccessPointPolicyResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMultiRegionAccessPointPolicyRequest,
  output: GetMultiRegionAccessPointPolicyResult,
  errors: [],
}));
/**
 * Updates an existing S3 Batch Operations job's priority. For more information, see S3 Batch Operations in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * To use the
 * `UpdateJobPriority` operation, you must have permission to
 * perform the `s3:UpdateJobPriority` action.
 *
 * Related actions include:
 *
 * - CreateJob
 *
 * - ListJobs
 *
 * - DescribeJob
 *
 * - UpdateJobStatus
 */
export const updateJobPriority: (
  input: UpdateJobPriorityRequest,
) => effect.Effect<
  UpdateJobPriorityResult,
  | BadRequestException
  | InternalServiceException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobPriorityRequest,
  output: UpdateJobPriorityResult,
  errors: [
    BadRequestException,
    InternalServiceException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns the tags on an S3 Batch Operations job.
 *
 * ### Permissions
 *
 * To use the
 * `GetJobTagging` operation, you must have permission to
 * perform the `s3:GetJobTagging` action. For more information, see Controlling
 * access and labeling jobs using tags in the
 * *Amazon S3 User Guide*.
 *
 * Related actions include:
 *
 * - CreateJob
 *
 * - PutJobTagging
 *
 * - DeleteJobTagging
 */
export const getJobTagging: (
  input: GetJobTaggingRequest,
) => effect.Effect<
  GetJobTaggingResult,
  | InternalServiceException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobTaggingRequest,
  output: GetJobTaggingResult,
  errors: [
    InternalServiceException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the status for the specified job. Use this operation to confirm that you want to
 * run a job or to cancel an existing job. For more information, see S3 Batch Operations in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * To use the
 * `UpdateJobStatus` operation, you must have permission to
 * perform the `s3:UpdateJobStatus` action.
 *
 * Related actions include:
 *
 * - CreateJob
 *
 * - ListJobs
 *
 * - DescribeJob
 *
 * - UpdateJobStatus
 */
export const updateJobStatus: (
  input: UpdateJobStatusRequest,
) => effect.Effect<
  UpdateJobStatusResult,
  | BadRequestException
  | InternalServiceException
  | JobStatusException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobStatusRequest,
  output: UpdateJobStatusResult,
  errors: [
    BadRequestException,
    InternalServiceException,
    JobStatusException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the configuration parameters and status for a Batch Operations job. For more
 * information, see S3 Batch Operations in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * To use the `DescribeJob` operation, you must have permission to perform the `s3:DescribeJob` action.
 *
 * Related actions include:
 *
 * - CreateJob
 *
 * - ListJobs
 *
 * - UpdateJobPriority
 *
 * - UpdateJobStatus
 */
export const describeJob: (
  input: DescribeJobRequest,
) => effect.Effect<
  DescribeJobResult,
  | BadRequestException
  | InternalServiceException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRequest,
  output: DescribeJobResult,
  errors: [
    BadRequestException,
    InternalServiceException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists current S3 Batch Operations jobs as well as the jobs that have ended within the last 90
 * days for the Amazon Web Services account making the request. For more information, see S3 Batch Operations in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * To use the
 * `ListJobs` operation, you must have permission to
 * perform the `s3:ListJobs` action.
 *
 * Related actions include:
 *
 * - CreateJob
 *
 * - DescribeJob
 *
 * - UpdateJobPriority
 *
 * - UpdateJobStatus
 */
export const listJobs: {
  (
    input: ListJobsRequest,
  ): effect.Effect<
    ListJobsResult,
    | InternalServiceException
    | InvalidNextTokenException
    | InvalidRequestException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => stream.Stream<
    ListJobsResult,
    | InternalServiceException
    | InvalidNextTokenException
    | InvalidRequestException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidNextTokenException
    | InvalidRequestException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResult,
  errors: [
    InternalServiceException,
    InvalidNextTokenException,
    InvalidRequestException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This action puts a lifecycle configuration to an Amazon S3 on Outposts bucket. To put a
 * lifecycle configuration to an S3 bucket, see PutBucketLifecycleConfiguration in the *Amazon S3 API Reference*.
 *
 * Creates a new lifecycle configuration for the S3 on Outposts bucket or replaces an
 * existing lifecycle configuration. Outposts buckets only support lifecycle configurations
 * that delete/expire objects after a certain period of time and abort incomplete multipart
 * uploads.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following actions are related to
 * `PutBucketLifecycleConfiguration`:
 *
 * - GetBucketLifecycleConfiguration
 *
 * - DeleteBucketLifecycleConfiguration
 */
export const putBucketLifecycleConfiguration: (
  input: PutBucketLifecycleConfigurationRequest,
) => effect.Effect<
  PutBucketLifecycleConfigurationResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketLifecycleConfigurationRequest,
  output: PutBucketLifecycleConfigurationResponse,
  errors: [],
}));
/**
 * Sets the supplied tag-set on an S3 Batch Operations job.
 *
 * A tag is a key-value pair. You can associate S3 Batch Operations tags with any job by sending
 * a PUT request against the tagging subresource that is associated with the job. To modify
 * the existing tag set, you can either replace the existing tag set entirely, or make changes
 * within the existing tag set by retrieving the existing tag set using GetJobTagging, modify that tag set, and use this operation to replace the tag set
 * with the one you modified. For more information, see Controlling
 * access and labeling jobs using tags in the *Amazon S3 User Guide*.
 *
 * - If you send this request with an empty tag set, Amazon S3 deletes the existing
 * tag set on the Batch Operations job. If you use this method, you are charged for a Tier
 * 1 Request (PUT). For more information, see Amazon S3 pricing.
 *
 * - For deleting existing tags for your Batch Operations job, a DeleteJobTagging request is preferred because it achieves the same
 * result without incurring charges.
 *
 * - A few things to consider about using tags:
 *
 * - Amazon S3 limits the maximum number of tags to 50 tags per job.
 *
 * - You can associate up to 50 tags with a job as long as they have unique
 * tag keys.
 *
 * - A tag key can be up to 128 Unicode characters in length, and tag values
 * can be up to 256 Unicode characters in length.
 *
 * - The key and values are case sensitive.
 *
 * - For tagging-related restrictions related to characters and encodings, see
 * User-Defined Tag Restrictions in the *Billing and Cost Management User Guide*.
 *
 * ### Permissions
 *
 * To use the
 * `PutJobTagging` operation, you must have permission to
 * perform the `s3:PutJobTagging` action.
 *
 * Related actions include:
 *
 * - CreateJob
 *
 * - GetJobTagging
 *
 * - DeleteJobTagging
 */
export const putJobTagging: (
  input: PutJobTaggingRequest,
) => effect.Effect<
  PutJobTaggingResult,
  | InternalServiceException
  | NotFoundException
  | TooManyRequestsException
  | TooManyTagsException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutJobTaggingRequest,
  output: PutJobTaggingResult,
  errors: [
    InternalServiceException,
    NotFoundException,
    TooManyRequestsException,
    TooManyTagsException,
  ],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Creates an Object Lambda Access Point. For more information, see Transforming objects with
 * Object Lambda Access Points in the *Amazon S3 User Guide*.
 *
 * The following actions are related to
 * `CreateAccessPointForObjectLambda`:
 *
 * - DeleteAccessPointForObjectLambda
 *
 * - GetAccessPointForObjectLambda
 *
 * - ListAccessPointsForObjectLambda
 */
export const createAccessPointForObjectLambda: (
  input: CreateAccessPointForObjectLambdaRequest,
) => effect.Effect<
  CreateAccessPointForObjectLambdaResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPointForObjectLambdaRequest,
  output: CreateAccessPointForObjectLambdaResult,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Retrieves the status of an asynchronous request to manage a Multi-Region Access Point. For more information
 * about managing Multi-Region Access Points and how asynchronous requests work, see Using Multi-Region Access Points in the *Amazon S3 User Guide*.
 *
 * The following actions are related to `GetMultiRegionAccessPoint`:
 *
 * - CreateMultiRegionAccessPoint
 *
 * - DeleteMultiRegionAccessPoint
 *
 * - GetMultiRegionAccessPoint
 *
 * - ListMultiRegionAccessPoints
 */
export const describeMultiRegionAccessPointOperation: (
  input: DescribeMultiRegionAccessPointOperationRequest,
) => effect.Effect<
  DescribeMultiRegionAccessPointOperationResult,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMultiRegionAccessPointOperationRequest,
  output: DescribeMultiRegionAccessPointOperationResult,
  errors: [],
}));
/**
 * This action creates an Amazon S3 on Outposts bucket's replication configuration. To create
 * an S3 bucket's replication configuration, see PutBucketReplication
 * in the *Amazon S3 API Reference*.
 *
 * Creates a replication configuration or replaces an existing one. For information about
 * S3 replication on Outposts configuration, see Replicating objects for
 * S3 on Outposts in the *Amazon S3 User Guide*.
 *
 * It can take a while to propagate `PUT` or `DELETE` requests for
 * a replication configuration to all S3 on Outposts systems. Therefore, the replication
 * configuration that's returned by a `GET` request soon after a
 * `PUT` or `DELETE` request might return a more recent result
 * than what's on the Outpost. If an Outpost is offline, the delay in updating the
 * replication configuration on that Outpost can be significant.
 *
 * Specify the replication configuration in the request body. In the replication
 * configuration, you provide the following information:
 *
 * - The name of the destination bucket or buckets where you want S3 on Outposts to
 * replicate objects
 *
 * - The Identity and Access Management (IAM) role that S3 on Outposts can assume to replicate objects on
 * your behalf
 *
 * - Other relevant information, such as replication rules
 *
 * A replication configuration must include at least one rule and can contain a maximum of
 * 100. Each rule identifies a subset of objects to replicate by filtering the objects in the
 * source Outposts bucket. To choose additional subsets of objects to replicate, add a rule
 * for each subset.
 *
 * To specify a subset of the objects in the source Outposts bucket to apply a replication
 * rule to, add the `Filter` element as a child of the `Rule` element.
 * You can filter objects based on an object key prefix, one or more object tags, or both.
 * When you add the `Filter` element in the configuration, you must also add the
 * following elements: `DeleteMarkerReplication`, `Status`, and
 * `Priority`.
 *
 * Using `PutBucketReplication` on Outposts requires that both the source and
 * destination buckets must have versioning enabled. For information about enabling versioning
 * on a bucket, see Managing S3 Versioning
 * for your S3 on Outposts bucket.
 *
 * For information about S3 on Outposts replication failure reasons, see Replication failure reasons in the *Amazon S3 User Guide*.
 *
 * **Handling Replication of Encrypted Objects**
 *
 * Outposts buckets are encrypted at all times. All the objects in the source Outposts
 * bucket are encrypted and can be replicated. Also, all the replicas in the destination
 * Outposts bucket are encrypted with the same encryption key as the objects in the source
 * Outposts bucket.
 *
 * **Permissions**
 *
 * To create a `PutBucketReplication` request, you must have
 * `s3-outposts:PutReplicationConfiguration` permissions for the bucket. The
 * Outposts bucket owner has this permission by default and can grant it to others. For more
 * information about permissions, see Setting up IAM with
 * S3 on Outposts and Managing access to
 * S3 on Outposts buckets.
 *
 * To perform this operation, the user or role must also have the
 * `iam:CreateRole` and `iam:PassRole` permissions. For more
 * information, see Granting a user permissions to
 * pass a role to an Amazon Web Services service.
 *
 * All Amazon S3 on Outposts REST API requests for this action require an additional parameter of `x-amz-outpost-id` to be passed with the request. In addition, you must use an S3 on Outposts endpoint hostname prefix instead of `s3-control`. For an example of the request syntax for Amazon S3 on Outposts that uses the S3 on Outposts endpoint hostname prefix and the `x-amz-outpost-id` derived by using the access point ARN, see the Examples section.
 *
 * The following operations are related to `PutBucketReplication`:
 *
 * - GetBucketReplication
 *
 * - DeleteBucketReplication
 */
export const putBucketReplication: (
  input: PutBucketReplicationRequest,
) => effect.Effect<
  PutBucketReplicationResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketReplicationRequest,
  output: PutBucketReplicationResponse,
  errors: [],
}));
/**
 * This operation is not supported by directory buckets.
 *
 * Puts an Amazon S3 Storage Lens configuration. For more information about S3 Storage Lens, see Working with
 * Amazon S3 Storage Lens in the *Amazon S3 User Guide*. For a complete list of S3 Storage Lens metrics, see S3 Storage Lens metrics glossary in the *Amazon S3 User Guide*.
 *
 * To use this action, you must have permission to perform the
 * `s3:PutStorageLensConfiguration` action. For more information, see Setting permissions to use Amazon S3 Storage Lens in the
 * *Amazon S3 User Guide*.
 */
export const putStorageLensConfiguration: (
  input: PutStorageLensConfigurationRequest,
) => effect.Effect<
  PutStorageLensConfigurationResponse,
  CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutStorageLensConfigurationRequest,
  output: PutStorageLensConfigurationResponse,
  errors: [],
}));
/**
 * This operation creates an S3 Batch Operations job.
 *
 * You can use S3 Batch Operations to perform large-scale batch actions on Amazon S3 objects.
 * Batch Operations can run a single action on lists of Amazon S3 objects that you specify. For more
 * information, see S3 Batch Operations in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * For information about permissions required to use the Batch Operations, see Granting permissions for S3 Batch Operations in the Amazon S3
 * User Guide.
 *
 * Related actions include:
 *
 * - DescribeJob
 *
 * - ListJobs
 *
 * - UpdateJobPriority
 *
 * - UpdateJobStatus
 *
 * - JobOperation
 */
export const createJob: (
  input: CreateJobRequest,
) => effect.Effect<
  CreateJobResult,
  | BadRequestException
  | IdempotencyException
  | InternalServiceException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResult,
  errors: [
    BadRequestException,
    IdempotencyException,
    InternalServiceException,
    TooManyRequestsException,
  ],
}));
