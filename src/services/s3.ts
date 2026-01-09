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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://s3.amazonaws.com/doc/2006-03-01/");
const svc = T.AwsApiService({ sdkId: "S3", serviceShapeName: "AmazonS3" });
const auth = T.AwsAuthSigv4({ name: "s3" });
const ver = T.ServiceVersion("2006-03-01");
const proto = T.AwsProtocolsRestXml();
const rules = T.EndpointResolver((p, _) => {
  const {
    Bucket,
    Region,
    UseFIPS = false,
    UseDualStack = false,
    Endpoint,
    ForcePathStyle = false,
    Accelerate = false,
    UseGlobalEndpoint = false,
    UseObjectLambdaEndpoint,
    Key,
    Prefix,
    CopySource,
    DisableAccessPoints,
    DisableMultiRegionAccessPoints = false,
    UseArnRegion,
    UseS3ExpressControlEndpoint,
    DisableS3ExpressSessionAuth,
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
    backend: "S3Express",
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3express",
        signingRegion: `${_0}`,
      },
    ],
  });
  const _p1 = (_0: unknown) => ({
    backend: "S3Express",
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4-s3express",
        signingName: "s3express",
        signingRegion: `${_0}`,
      },
    ],
  });
  const _p2 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4a",
        signingName: "s3-outposts",
        signingRegionSet: ["*"],
      },
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3-outposts",
        signingRegion: `${_0}`,
      },
    ],
  });
  const _p3 = () => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3",
        signingRegion: "us-east-1",
      },
    ],
  });
  const _p4 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3",
        signingRegion: `${_0}`,
      },
    ],
  });
  const _p5 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3-object-lambda",
        signingRegion: `${_.getAttr(_0, "region")}`,
      },
    ],
  });
  const _p6 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3",
        signingRegion: `${_.getAttr(_0, "region")}`,
      },
    ],
  });
  const _p7 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4a",
        signingName: "s3-outposts",
        signingRegionSet: ["*"],
      },
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3-outposts",
        signingRegion: `${_.getAttr(_0, "region")}`,
      },
    ],
  });
  const _p8 = (_0: unknown) => ({
    authSchemes: [
      {
        disableDoubleEncoding: true,
        name: "sigv4",
        signingName: "s3-object-lambda",
        signingRegion: `${_0}`,
      },
    ],
  });
  if (Region != null) {
    if (Accelerate === true && UseFIPS === true) {
      return err("Accelerate cannot be used with FIPS");
    }
    if (UseDualStack === true && Endpoint != null) {
      return err(
        "Cannot set dual-stack in combination with a custom endpoint.",
      );
    }
    if (Endpoint != null && UseFIPS === true) {
      return err("A custom endpoint cannot be combined with FIPS");
    }
    if (Endpoint != null && Accelerate === true) {
      return err("A custom endpoint cannot be combined with S3 Accelerate");
    }
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
    {
      const bucketSuffix = _.substring(Bucket, 0, 6, true);
      if (
        Bucket != null &&
        bucketSuffix != null &&
        bucketSuffix !== false &&
        bucketSuffix === "--x-s3"
      ) {
        if (Accelerate === true) {
          return err("S3Express does not support S3 Accelerate.");
        }
        {
          const url = _.parseURL(Endpoint);
          if (Endpoint != null && url != null && url !== false) {
            if (
              DisableS3ExpressSessionAuth != null &&
              DisableS3ExpressSessionAuth === true
            ) {
              if (_.getAttr(url, "isIp") === true) {
                {
                  const uri_encoded_bucket = _.uriEncode(Bucket);
                  if (
                    uri_encoded_bucket != null &&
                    uri_encoded_bucket !== false
                  ) {
                    return e(
                      `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}/${uri_encoded_bucket}${_.getAttr(url, "path")}`,
                      _p0(Region),
                      {},
                    );
                  }
                }
              }
              if (_.isVirtualHostableS3Bucket(Bucket, false)) {
                return e(
                  `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p0(Region),
                  {},
                );
              }
              return err(
                "S3Express bucket name is not a valid virtual hostable name.",
              );
            }
            if (_.getAttr(url, "isIp") === true) {
              {
                const uri_encoded_bucket = _.uriEncode(Bucket);
                if (
                  uri_encoded_bucket != null &&
                  uri_encoded_bucket !== false
                ) {
                  return e(
                    `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}/${uri_encoded_bucket}${_.getAttr(url, "path")}`,
                    _p1(Region),
                    {},
                  );
                }
              }
            }
            if (_.isVirtualHostableS3Bucket(Bucket, false)) {
              return e(
                `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                _p1(Region),
                {},
              );
            }
            return err(
              "S3Express bucket name is not a valid virtual hostable name.",
            );
          }
        }
        if (
          UseS3ExpressControlEndpoint != null &&
          UseS3ExpressControlEndpoint === true
        ) {
          {
            const partitionResult = _.partition(Region);
            if (partitionResult != null && partitionResult !== false) {
              {
                const uri_encoded_bucket = _.uriEncode(Bucket);
                if (
                  uri_encoded_bucket != null &&
                  uri_encoded_bucket !== false &&
                  !(Endpoint != null)
                ) {
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://s3express-control-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                      _p0(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                      _p0(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://s3express-control.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                      _p0(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                      _p0(Region),
                      {},
                    );
                  }
                }
              }
            }
          }
        }
        if (_.isVirtualHostableS3Bucket(Bucket, false)) {
          {
            const partitionResult = _.partition(Region);
            if (partitionResult != null && partitionResult !== false) {
              if (
                DisableS3ExpressSessionAuth != null &&
                DisableS3ExpressSessionAuth === true
              ) {
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    6,
                    14,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
                    14,
                    16,
                    true,
                  );
                  if (
                    s3expressAvailabilityZoneId != null &&
                    s3expressAvailabilityZoneId !== false &&
                    s3expressAvailabilityZoneDelim != null &&
                    s3expressAvailabilityZoneDelim !== false &&
                    s3expressAvailabilityZoneDelim === "--"
                  ) {
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    6,
                    15,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
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
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    6,
                    19,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
                    19,
                    21,
                    true,
                  );
                  if (
                    s3expressAvailabilityZoneId != null &&
                    s3expressAvailabilityZoneId !== false &&
                    s3expressAvailabilityZoneDelim != null &&
                    s3expressAvailabilityZoneDelim !== false &&
                    s3expressAvailabilityZoneDelim === "--"
                  ) {
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    6,
                    20,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
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
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    6,
                    26,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
                    26,
                    28,
                    true,
                  );
                  if (
                    s3expressAvailabilityZoneId != null &&
                    s3expressAvailabilityZoneId !== false &&
                    s3expressAvailabilityZoneDelim != null &&
                    s3expressAvailabilityZoneDelim !== false &&
                    s3expressAvailabilityZoneDelim === "--"
                  ) {
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                return err("Unrecognized S3Express bucket name format.");
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  6,
                  14,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
                  14,
                  16,
                  true,
                );
                if (
                  s3expressAvailabilityZoneId != null &&
                  s3expressAvailabilityZoneId !== false &&
                  s3expressAvailabilityZoneDelim != null &&
                  s3expressAvailabilityZoneDelim !== false &&
                  s3expressAvailabilityZoneDelim === "--"
                ) {
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  6,
                  15,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
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
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  6,
                  19,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
                  19,
                  21,
                  true,
                );
                if (
                  s3expressAvailabilityZoneId != null &&
                  s3expressAvailabilityZoneId !== false &&
                  s3expressAvailabilityZoneDelim != null &&
                  s3expressAvailabilityZoneDelim !== false &&
                  s3expressAvailabilityZoneDelim === "--"
                ) {
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  6,
                  20,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
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
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  6,
                  26,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
                  26,
                  28,
                  true,
                );
                if (
                  s3expressAvailabilityZoneId != null &&
                  s3expressAvailabilityZoneId !== false &&
                  s3expressAvailabilityZoneDelim != null &&
                  s3expressAvailabilityZoneDelim !== false &&
                  s3expressAvailabilityZoneDelim === "--"
                ) {
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              return err("Unrecognized S3Express bucket name format.");
            }
          }
        }
        return err(
          "S3Express bucket name is not a valid virtual hostable name.",
        );
      }
    }
    {
      const accessPointSuffix = _.substring(Bucket, 0, 7, true);
      if (
        Bucket != null &&
        accessPointSuffix != null &&
        accessPointSuffix !== false &&
        accessPointSuffix === "--xa-s3"
      ) {
        if (Accelerate === true) {
          return err("S3Express does not support S3 Accelerate.");
        }
        {
          const url = _.parseURL(Endpoint);
          if (Endpoint != null && url != null && url !== false) {
            if (
              DisableS3ExpressSessionAuth != null &&
              DisableS3ExpressSessionAuth === true
            ) {
              if (_.getAttr(url, "isIp") === true) {
                {
                  const uri_encoded_bucket = _.uriEncode(Bucket);
                  if (
                    uri_encoded_bucket != null &&
                    uri_encoded_bucket !== false
                  ) {
                    return e(
                      `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}/${uri_encoded_bucket}${_.getAttr(url, "path")}`,
                      _p0(Region),
                      {},
                    );
                  }
                }
              }
              if (_.isVirtualHostableS3Bucket(Bucket, false)) {
                return e(
                  `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p0(Region),
                  {},
                );
              }
              return err(
                "S3Express bucket name is not a valid virtual hostable name.",
              );
            }
            if (_.getAttr(url, "isIp") === true) {
              {
                const uri_encoded_bucket = _.uriEncode(Bucket);
                if (
                  uri_encoded_bucket != null &&
                  uri_encoded_bucket !== false
                ) {
                  return e(
                    `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}/${uri_encoded_bucket}${_.getAttr(url, "path")}`,
                    _p1(Region),
                    {},
                  );
                }
              }
            }
            if (_.isVirtualHostableS3Bucket(Bucket, false)) {
              return e(
                `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                _p1(Region),
                {},
              );
            }
            return err(
              "S3Express bucket name is not a valid virtual hostable name.",
            );
          }
        }
        if (_.isVirtualHostableS3Bucket(Bucket, false)) {
          {
            const partitionResult = _.partition(Region);
            if (partitionResult != null && partitionResult !== false) {
              if (
                DisableS3ExpressSessionAuth != null &&
                DisableS3ExpressSessionAuth === true
              ) {
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    7,
                    15,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
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
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    7,
                    16,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
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
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    7,
                    20,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
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
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    7,
                    21,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
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
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                {
                  const s3expressAvailabilityZoneId = _.substring(
                    Bucket,
                    7,
                    27,
                    true,
                  );
                  const s3expressAvailabilityZoneDelim = _.substring(
                    Bucket,
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
                    if (UseFIPS === true && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === true && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === true) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                    if (UseFIPS === false && UseDualStack === false) {
                      return e(
                        `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                        _p0(Region),
                        {},
                      );
                    }
                  }
                }
                return err("Unrecognized S3Express bucket name format.");
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  7,
                  15,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
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
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  7,
                  16,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
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
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  7,
                  20,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
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
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  7,
                  21,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
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
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              {
                const s3expressAvailabilityZoneId = _.substring(
                  Bucket,
                  7,
                  27,
                  true,
                );
                const s3expressAvailabilityZoneDelim = _.substring(
                  Bucket,
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
                  if (UseFIPS === true && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === true && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-fips-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === true) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                  if (UseFIPS === false && UseDualStack === false) {
                    return e(
                      `https://${Bucket}.s3express-${s3expressAvailabilityZoneId}.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                      _p1(Region),
                      {},
                    );
                  }
                }
              }
              return err("Unrecognized S3Express bucket name format.");
            }
          }
        }
        return err(
          "S3Express bucket name is not a valid virtual hostable name.",
        );
      }
    }
    if (
      !(Bucket != null) &&
      UseS3ExpressControlEndpoint != null &&
      UseS3ExpressControlEndpoint === true
    ) {
      {
        const partitionResult = _.partition(Region);
        if (partitionResult != null && partitionResult !== false) {
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
              `https://s3express-control-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p0(Region),
              {},
            );
          }
          if (UseFIPS === true && UseDualStack === false) {
            return e(
              `https://s3express-control-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p0(Region),
              {},
            );
          }
          if (UseFIPS === false && UseDualStack === true) {
            return e(
              `https://s3express-control.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p0(Region),
              {},
            );
          }
          if (UseFIPS === false && UseDualStack === false) {
            return e(
              `https://s3express-control.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p0(Region),
              {},
            );
          }
        }
      }
    }
    {
      const hardwareType = _.substring(Bucket, 49, 50, true);
      const regionPrefix = _.substring(Bucket, 8, 12, true);
      const bucketAliasSuffix = _.substring(Bucket, 0, 7, true);
      const outpostId = _.substring(Bucket, 32, 49, true);
      const regionPartition = _.partition(Region);
      if (
        Bucket != null &&
        hardwareType != null &&
        hardwareType !== false &&
        regionPrefix != null &&
        regionPrefix !== false &&
        bucketAliasSuffix != null &&
        bucketAliasSuffix !== false &&
        outpostId != null &&
        outpostId !== false &&
        regionPartition != null &&
        regionPartition !== false &&
        bucketAliasSuffix === "--op-s3"
      ) {
        if (_.isValidHostLabel(outpostId, false)) {
          if (_.isVirtualHostableS3Bucket(Bucket, false)) {
            if (hardwareType === "e") {
              if (regionPrefix === "beta") {
                if (!(Endpoint != null)) {
                  return err(
                    "Expected a endpoint to be specified but no endpoint was found",
                  );
                }
                {
                  const url = _.parseURL(Endpoint);
                  if (Endpoint != null && url != null && url !== false) {
                    return e(
                      `https://${Bucket}.ec2.${_.getAttr(url, "authority")}`,
                      _p2(Region),
                      {},
                    );
                  }
                }
              }
              return e(
                `https://${Bucket}.ec2.s3-outposts.${Region}.${_.getAttr(regionPartition, "dnsSuffix")}`,
                _p2(Region),
                {},
              );
            }
            if (hardwareType === "o") {
              if (regionPrefix === "beta") {
                if (!(Endpoint != null)) {
                  return err(
                    "Expected a endpoint to be specified but no endpoint was found",
                  );
                }
                {
                  const url = _.parseURL(Endpoint);
                  if (Endpoint != null && url != null && url !== false) {
                    return e(
                      `https://${Bucket}.op-${outpostId}.${_.getAttr(url, "authority")}`,
                      _p2(Region),
                      {},
                    );
                  }
                }
              }
              return e(
                `https://${Bucket}.op-${outpostId}.s3-outposts.${Region}.${_.getAttr(regionPartition, "dnsSuffix")}`,
                _p2(Region),
                {},
              );
            }
            return err(
              `Unrecognized hardware type: "Expected hardware type o or e but got ${hardwareType}"`,
            );
          }
          return err(
            "Invalid Outposts Bucket alias - it must be a valid bucket name.",
          );
        }
        return err(
          "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`.",
        );
      }
    }
    if (Bucket != null) {
      if (Endpoint != null && !(_.parseURL(Endpoint) != null)) {
        return err(`Custom endpoint \`${Endpoint}\` was not a valid URI`);
      }
      if (
        ForcePathStyle === false &&
        _.isVirtualHostableS3Bucket(Bucket, false)
      ) {
        {
          const partitionResult = _.partition(Region);
          if (partitionResult != null && partitionResult !== false) {
            if (_.isValidHostLabel(Region, false)) {
              if (
                Accelerate === true &&
                _.getAttr(partitionResult, "name") === "aws-cn"
              ) {
                return err("S3 Accelerate cannot be used in this region");
              }
              if (
                UseDualStack === true &&
                UseFIPS === true &&
                Accelerate === false &&
                !(Endpoint != null) &&
                Region === "aws-global"
              ) {
                return e(
                  `https://${Bucket}.s3-fips.dualstack.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p3(),
                  {},
                );
              }
              if (
                UseDualStack === true &&
                UseFIPS === true &&
                Accelerate === false &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === true
              ) {
                return e(
                  `https://${Bucket}.s3-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === true &&
                UseFIPS === true &&
                Accelerate === false &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === false
              ) {
                return e(
                  `https://${Bucket}.s3-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === false &&
                UseFIPS === true &&
                Accelerate === false &&
                !(Endpoint != null) &&
                Region === "aws-global"
              ) {
                return e(
                  `https://${Bucket}.s3-fips.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p3(),
                  {},
                );
              }
              if (
                UseDualStack === false &&
                UseFIPS === true &&
                Accelerate === false &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === true
              ) {
                return e(
                  `https://${Bucket}.s3-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === false &&
                UseFIPS === true &&
                Accelerate === false &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === false
              ) {
                return e(
                  `https://${Bucket}.s3-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === true &&
                UseFIPS === false &&
                Accelerate === true &&
                !(Endpoint != null) &&
                Region === "aws-global"
              ) {
                return e(
                  `https://${Bucket}.s3-accelerate.dualstack.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p3(),
                  {},
                );
              }
              if (
                UseDualStack === true &&
                UseFIPS === false &&
                Accelerate === true &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === true
              ) {
                return e(
                  `https://${Bucket}.s3-accelerate.dualstack.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === true &&
                UseFIPS === false &&
                Accelerate === true &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === false
              ) {
                return e(
                  `https://${Bucket}.s3-accelerate.dualstack.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === true &&
                UseFIPS === false &&
                Accelerate === false &&
                !(Endpoint != null) &&
                Region === "aws-global"
              ) {
                return e(
                  `https://${Bucket}.s3.dualstack.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p3(),
                  {},
                );
              }
              if (
                UseDualStack === true &&
                UseFIPS === false &&
                Accelerate === false &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === true
              ) {
                return e(
                  `https://${Bucket}.s3.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === true &&
                UseFIPS === false &&
                Accelerate === false &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === false
              ) {
                return e(
                  `https://${Bucket}.s3.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              {
                const url = _.parseURL(Endpoint);
                if (
                  UseDualStack === false &&
                  UseFIPS === false &&
                  Accelerate === false &&
                  Endpoint != null &&
                  url != null &&
                  url !== false &&
                  _.getAttr(url, "isIp") === true &&
                  Region === "aws-global"
                ) {
                  return e(
                    `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "normalizedPath")}${Bucket}`,
                    _p3(),
                    {},
                  );
                }
              }
              {
                const url = _.parseURL(Endpoint);
                if (
                  UseDualStack === false &&
                  UseFIPS === false &&
                  Accelerate === false &&
                  Endpoint != null &&
                  url != null &&
                  url !== false &&
                  _.getAttr(url, "isIp") === false &&
                  Region === "aws-global"
                ) {
                  return e(
                    `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                    _p3(),
                    {},
                  );
                }
              }
              {
                const url = _.parseURL(Endpoint);
                if (
                  UseDualStack === false &&
                  UseFIPS === false &&
                  Accelerate === false &&
                  Endpoint != null &&
                  url != null &&
                  url !== false &&
                  _.getAttr(url, "isIp") === true &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === true
                ) {
                  if (Region === "us-east-1") {
                    return e(
                      `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "normalizedPath")}${Bucket}`,
                      _p4(Region),
                      {},
                    );
                  }
                  return e(
                    `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "normalizedPath")}${Bucket}`,
                    _p4(Region),
                    {},
                  );
                }
              }
              {
                const url = _.parseURL(Endpoint);
                if (
                  UseDualStack === false &&
                  UseFIPS === false &&
                  Accelerate === false &&
                  Endpoint != null &&
                  url != null &&
                  url !== false &&
                  _.getAttr(url, "isIp") === false &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === true
                ) {
                  if (Region === "us-east-1") {
                    return e(
                      `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                      _p4(Region),
                      {},
                    );
                  }
                  return e(
                    `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                    _p4(Region),
                    {},
                  );
                }
              }
              {
                const url = _.parseURL(Endpoint);
                if (
                  UseDualStack === false &&
                  UseFIPS === false &&
                  Accelerate === false &&
                  Endpoint != null &&
                  url != null &&
                  url !== false &&
                  _.getAttr(url, "isIp") === true &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === false
                ) {
                  return e(
                    `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "normalizedPath")}${Bucket}`,
                    _p4(Region),
                    {},
                  );
                }
              }
              {
                const url = _.parseURL(Endpoint);
                if (
                  UseDualStack === false &&
                  UseFIPS === false &&
                  Accelerate === false &&
                  Endpoint != null &&
                  url != null &&
                  url !== false &&
                  _.getAttr(url, "isIp") === false &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === false
                ) {
                  return e(
                    `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                    _p4(Region),
                    {},
                  );
                }
              }
              if (
                UseDualStack === false &&
                UseFIPS === false &&
                Accelerate === true &&
                !(Endpoint != null) &&
                Region === "aws-global"
              ) {
                return e(
                  `https://${Bucket}.s3-accelerate.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p3(),
                  {},
                );
              }
              if (
                UseDualStack === false &&
                UseFIPS === false &&
                Accelerate === true &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === true
              ) {
                if (Region === "us-east-1") {
                  return e(
                    `https://${Bucket}.s3-accelerate.${_.getAttr(partitionResult, "dnsSuffix")}`,
                    _p4(Region),
                    {},
                  );
                }
                return e(
                  `https://${Bucket}.s3-accelerate.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === false &&
                UseFIPS === false &&
                Accelerate === true &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === false
              ) {
                return e(
                  `https://${Bucket}.s3-accelerate.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === false &&
                UseFIPS === false &&
                Accelerate === false &&
                !(Endpoint != null) &&
                Region === "aws-global"
              ) {
                return e(
                  `https://${Bucket}.s3.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p3(),
                  {},
                );
              }
              if (
                UseDualStack === false &&
                UseFIPS === false &&
                Accelerate === false &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === true
              ) {
                if (Region === "us-east-1") {
                  return e(
                    `https://${Bucket}.s3.${_.getAttr(partitionResult, "dnsSuffix")}`,
                    _p4(Region),
                    {},
                  );
                }
                return e(
                  `https://${Bucket}.s3.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              if (
                UseDualStack === false &&
                UseFIPS === false &&
                Accelerate === false &&
                !(Endpoint != null) &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === false
              ) {
                return e(
                  `https://${Bucket}.s3.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
            }
            return err("Invalid region: region was not a valid DNS name.");
          }
        }
      }
      {
        const url = _.parseURL(Endpoint);
        if (
          Endpoint != null &&
          url != null &&
          url !== false &&
          _.getAttr(url, "scheme") === "http" &&
          _.isVirtualHostableS3Bucket(Bucket, true) &&
          ForcePathStyle === false &&
          UseFIPS === false &&
          UseDualStack === false &&
          Accelerate === false
        ) {
          {
            const partitionResult = _.partition(Region);
            if (partitionResult != null && partitionResult !== false) {
              if (_.isValidHostLabel(Region, false)) {
                return e(
                  `${_.getAttr(url, "scheme")}://${Bucket}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p4(Region),
                  {},
                );
              }
              return err("Invalid region: region was not a valid DNS name.");
            }
          }
        }
      }
      {
        const bucketArn = _.parseArn(Bucket);
        if (
          ForcePathStyle === false &&
          bucketArn != null &&
          bucketArn !== false
        ) {
          {
            const arnType = _.getAttr(bucketArn, "resourceId[0]");
            if (arnType != null && arnType !== false && !(arnType === "")) {
              if (_.getAttr(bucketArn, "service") === "s3-object-lambda") {
                if (arnType === "accesspoint") {
                  {
                    const accessPointName = _.getAttr(
                      bucketArn,
                      "resourceId[1]",
                    );
                    if (
                      accessPointName != null &&
                      accessPointName !== false &&
                      !(accessPointName === "")
                    ) {
                      if (UseDualStack === true) {
                        return err(
                          "S3 Object Lambda does not support Dual-stack",
                        );
                      }
                      if (Accelerate === true) {
                        return err(
                          "S3 Object Lambda does not support S3 Accelerate",
                        );
                      }
                      if (!(_.getAttr(bucketArn, "region") === "")) {
                        if (
                          DisableAccessPoints != null &&
                          DisableAccessPoints === true
                        ) {
                          return err(
                            "Access points are not supported for this operation",
                          );
                        }
                        if (!(_.getAttr(bucketArn, "resourceId[2]") != null)) {
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
                            const bucketPartition = _.partition(
                              _.getAttr(bucketArn, "region"),
                            );
                            if (
                              bucketPartition != null &&
                              bucketPartition !== false
                            ) {
                              {
                                const partitionResult = _.partition(Region);
                                if (
                                  partitionResult != null &&
                                  partitionResult !== false
                                ) {
                                  if (
                                    _.getAttr(bucketPartition, "name") ===
                                    _.getAttr(partitionResult, "name")
                                  ) {
                                    if (
                                      _.isValidHostLabel(
                                        _.getAttr(bucketArn, "region"),
                                        true,
                                      )
                                    ) {
                                      if (
                                        _.getAttr(bucketArn, "accountId") === ""
                                      ) {
                                        return err(
                                          "Invalid ARN: Missing account id",
                                        );
                                      }
                                      if (
                                        _.isValidHostLabel(
                                          _.getAttr(bucketArn, "accountId"),
                                          false,
                                        )
                                      ) {
                                        if (
                                          _.isValidHostLabel(
                                            accessPointName,
                                            false,
                                          )
                                        ) {
                                          {
                                            const url = _.parseURL(Endpoint);
                                            if (
                                              Endpoint != null &&
                                              url != null &&
                                              url !== false
                                            ) {
                                              return e(
                                                `${_.getAttr(url, "scheme")}://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                                                _p5(bucketArn),
                                                {},
                                              );
                                            }
                                          }
                                          if (UseFIPS === true) {
                                            return e(
                                              `https://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.s3-object-lambda-fips.${_.getAttr(bucketArn, "region")}.${_.getAttr(bucketPartition, "dnsSuffix")}`,
                                              _p5(bucketArn),
                                              {},
                                            );
                                          }
                                          return e(
                                            `https://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.s3-object-lambda.${_.getAttr(bucketArn, "region")}.${_.getAttr(bucketPartition, "dnsSuffix")}`,
                                            _p5(bucketArn),
                                            {},
                                          );
                                        }
                                        return err(
                                          `Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and \`-\`. Found: \`${accessPointName}\``,
                                        );
                                      }
                                      return err(
                                        `Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and \`-\`. Found: \`${_.getAttr(bucketArn, "accountId")}\``,
                                      );
                                    }
                                    return err(
                                      `Invalid region in ARN: \`${_.getAttr(bucketArn, "region")}\` (invalid DNS name)`,
                                    );
                                  }
                                  return err(
                                    `Client was configured for partition \`${_.getAttr(partitionResult, "name")}\` but ARN (\`${Bucket}\`) has \`${_.getAttr(bucketPartition, "name")}\``,
                                  );
                                }
                              }
                            }
                          }
                        }
                        return err(
                          "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`.",
                        );
                      }
                      return err("Invalid ARN: bucket ARN is missing a region");
                    }
                  }
                  return err(
                    "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided",
                  );
                }
                return err(
                  `Invalid ARN: Object Lambda ARNs only support \`accesspoint\` arn types, but found: \`${arnType}\``,
                );
              }
              if (arnType === "accesspoint") {
                {
                  const accessPointName = _.getAttr(bucketArn, "resourceId[1]");
                  if (
                    accessPointName != null &&
                    accessPointName !== false &&
                    !(accessPointName === "")
                  ) {
                    if (!(_.getAttr(bucketArn, "region") === "")) {
                      if (arnType === "accesspoint") {
                        if (!(_.getAttr(bucketArn, "region") === "")) {
                          if (
                            DisableAccessPoints != null &&
                            DisableAccessPoints === true
                          ) {
                            return err(
                              "Access points are not supported for this operation",
                            );
                          }
                          if (
                            !(_.getAttr(bucketArn, "resourceId[2]") != null)
                          ) {
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
                              const bucketPartition = _.partition(
                                _.getAttr(bucketArn, "region"),
                              );
                              if (
                                bucketPartition != null &&
                                bucketPartition !== false
                              ) {
                                {
                                  const partitionResult = _.partition(Region);
                                  if (
                                    partitionResult != null &&
                                    partitionResult !== false
                                  ) {
                                    if (
                                      _.getAttr(bucketPartition, "name") ===
                                      `${_.getAttr(partitionResult, "name")}`
                                    ) {
                                      if (
                                        _.isValidHostLabel(
                                          _.getAttr(bucketArn, "region"),
                                          true,
                                        )
                                      ) {
                                        if (
                                          _.getAttr(bucketArn, "service") ===
                                          "s3"
                                        ) {
                                          if (
                                            _.isValidHostLabel(
                                              _.getAttr(bucketArn, "accountId"),
                                              false,
                                            )
                                          ) {
                                            if (
                                              _.isValidHostLabel(
                                                accessPointName,
                                                false,
                                              )
                                            ) {
                                              if (Accelerate === true) {
                                                return err(
                                                  "Access Points do not support S3 Accelerate",
                                                );
                                              }
                                              if (
                                                UseFIPS === true &&
                                                UseDualStack === true
                                              ) {
                                                return e(
                                                  `https://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.s3-accesspoint-fips.dualstack.${_.getAttr(bucketArn, "region")}.${_.getAttr(bucketPartition, "dnsSuffix")}`,
                                                  _p6(bucketArn),
                                                  {},
                                                );
                                              }
                                              if (
                                                UseFIPS === true &&
                                                UseDualStack === false
                                              ) {
                                                return e(
                                                  `https://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.s3-accesspoint-fips.${_.getAttr(bucketArn, "region")}.${_.getAttr(bucketPartition, "dnsSuffix")}`,
                                                  _p6(bucketArn),
                                                  {},
                                                );
                                              }
                                              if (
                                                UseFIPS === false &&
                                                UseDualStack === true
                                              ) {
                                                return e(
                                                  `https://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.s3-accesspoint.dualstack.${_.getAttr(bucketArn, "region")}.${_.getAttr(bucketPartition, "dnsSuffix")}`,
                                                  _p6(bucketArn),
                                                  {},
                                                );
                                              }
                                              {
                                                const url =
                                                  _.parseURL(Endpoint);
                                                if (
                                                  UseFIPS === false &&
                                                  UseDualStack === false &&
                                                  Endpoint != null &&
                                                  url != null &&
                                                  url !== false
                                                ) {
                                                  return e(
                                                    `${_.getAttr(url, "scheme")}://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                                                    _p6(bucketArn),
                                                    {},
                                                  );
                                                }
                                              }
                                              if (
                                                UseFIPS === false &&
                                                UseDualStack === false
                                              ) {
                                                return e(
                                                  `https://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.s3-accesspoint.${_.getAttr(bucketArn, "region")}.${_.getAttr(bucketPartition, "dnsSuffix")}`,
                                                  _p6(bucketArn),
                                                  {},
                                                );
                                              }
                                            }
                                            return err(
                                              `Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and \`-\`. Found: \`${accessPointName}\``,
                                            );
                                          }
                                          return err(
                                            `Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and \`-\`. Found: \`${_.getAttr(bucketArn, "accountId")}\``,
                                          );
                                        }
                                        return err(
                                          `Invalid ARN: The ARN was not for the S3 service, found: ${_.getAttr(bucketArn, "service")}`,
                                        );
                                      }
                                      return err(
                                        `Invalid region in ARN: \`${_.getAttr(bucketArn, "region")}\` (invalid DNS name)`,
                                      );
                                    }
                                    return err(
                                      `Client was configured for partition \`${_.getAttr(partitionResult, "name")}\` but ARN (\`${Bucket}\`) has \`${_.getAttr(bucketPartition, "name")}\``,
                                    );
                                  }
                                }
                              }
                            }
                          }
                          return err(
                            "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`.",
                          );
                        }
                      }
                    }
                    if (_.isValidHostLabel(accessPointName, true)) {
                      if (UseDualStack === true) {
                        return err("S3 MRAP does not support dual-stack");
                      }
                      if (UseFIPS === true) {
                        return err("S3 MRAP does not support FIPS");
                      }
                      if (Accelerate === true) {
                        return err("S3 MRAP does not support S3 Accelerate");
                      }
                      if (DisableMultiRegionAccessPoints === true) {
                        return err(
                          "Invalid configuration: Multi-Region Access Point ARNs are disabled.",
                        );
                      }
                      {
                        const mrapPartition = _.partition(Region);
                        if (mrapPartition != null && mrapPartition !== false) {
                          if (
                            _.getAttr(mrapPartition, "name") ===
                            _.getAttr(bucketArn, "partition")
                          ) {
                            return e(
                              `https://${accessPointName}.accesspoint.s3-global.${_.getAttr(mrapPartition, "dnsSuffix")}`,
                              {
                                authSchemes: [
                                  {
                                    disableDoubleEncoding: true,
                                    name: "sigv4a",
                                    signingName: "s3",
                                    signingRegionSet: ["*"],
                                  },
                                ],
                              },
                              {},
                            );
                          }
                          return err(
                            `Client was configured for partition \`${_.getAttr(mrapPartition, "name")}\` but bucket referred to partition \`${_.getAttr(bucketArn, "partition")}\``,
                          );
                        }
                      }
                    }
                    return err("Invalid Access Point Name");
                  }
                }
                return err(
                  "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided",
                );
              }
              if (_.getAttr(bucketArn, "service") === "s3-outposts") {
                if (UseDualStack === true) {
                  return err("S3 Outposts does not support Dual-stack");
                }
                if (UseFIPS === true) {
                  return err("S3 Outposts does not support FIPS");
                }
                if (Accelerate === true) {
                  return err("S3 Outposts does not support S3 Accelerate");
                }
                if (_.getAttr(bucketArn, "resourceId[4]") != null) {
                  return err(
                    "Invalid Arn: Outpost Access Point ARN contains sub resources",
                  );
                }
                {
                  const outpostId = _.getAttr(bucketArn, "resourceId[1]");
                  if (outpostId != null && outpostId !== false) {
                    if (_.isValidHostLabel(outpostId, false)) {
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
                        const bucketPartition = _.partition(
                          _.getAttr(bucketArn, "region"),
                        );
                        if (
                          bucketPartition != null &&
                          bucketPartition !== false
                        ) {
                          {
                            const partitionResult = _.partition(Region);
                            if (
                              partitionResult != null &&
                              partitionResult !== false
                            ) {
                              if (
                                _.getAttr(bucketPartition, "name") ===
                                _.getAttr(partitionResult, "name")
                              ) {
                                if (
                                  _.isValidHostLabel(
                                    _.getAttr(bucketArn, "region"),
                                    true,
                                  )
                                ) {
                                  if (
                                    _.isValidHostLabel(
                                      _.getAttr(bucketArn, "accountId"),
                                      false,
                                    )
                                  ) {
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
                                          const accessPointName = _.getAttr(
                                            bucketArn,
                                            "resourceId[3]",
                                          );
                                          if (
                                            accessPointName != null &&
                                            accessPointName !== false
                                          ) {
                                            if (outpostType === "accesspoint") {
                                              {
                                                const url =
                                                  _.parseURL(Endpoint);
                                                if (
                                                  Endpoint != null &&
                                                  url != null &&
                                                  url !== false
                                                ) {
                                                  return e(
                                                    `https://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.${outpostId}.${_.getAttr(url, "authority")}`,
                                                    _p7(bucketArn),
                                                    {},
                                                  );
                                                }
                                              }
                                              return e(
                                                `https://${accessPointName}-${_.getAttr(bucketArn, "accountId")}.${outpostId}.s3-outposts.${_.getAttr(bucketArn, "region")}.${_.getAttr(bucketPartition, "dnsSuffix")}`,
                                                _p7(bucketArn),
                                                {},
                                              );
                                            }
                                            return err(
                                              `Expected an outpost type \`accesspoint\`, found ${outpostType}`,
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
                                    `Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and \`-\`. Found: \`${_.getAttr(bucketArn, "accountId")}\``,
                                  );
                                }
                                return err(
                                  `Invalid region in ARN: \`${_.getAttr(bucketArn, "region")}\` (invalid DNS name)`,
                                );
                              }
                              return err(
                                `Client was configured for partition \`${_.getAttr(partitionResult, "name")}\` but ARN (\`${Bucket}\`) has \`${_.getAttr(bucketPartition, "name")}\``,
                              );
                            }
                          }
                        }
                      }
                    }
                    return err(
                      `Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and \`-\`. Found: \`${outpostId}\``,
                    );
                  }
                }
                return err("Invalid ARN: The Outpost Id was not set");
              }
              return err(
                `Invalid ARN: Unrecognized format: ${Bucket} (type: ${arnType})`,
              );
            }
          }
          return err("Invalid ARN: No ARN type specified");
        }
      }
      {
        const arnPrefix = _.substring(Bucket, 0, 4, false);
        if (
          arnPrefix != null &&
          arnPrefix !== false &&
          arnPrefix === "arn:" &&
          !(_.parseArn(Bucket) != null)
        ) {
          return err(`Invalid ARN: \`${Bucket}\` was not a valid ARN`);
        }
      }
      if (ForcePathStyle === true && _.parseArn(Bucket)) {
        return err("Path-style addressing cannot be used with ARN buckets");
      }
      {
        const uri_encoded_bucket = _.uriEncode(Bucket);
        if (uri_encoded_bucket != null && uri_encoded_bucket !== false) {
          {
            const partitionResult = _.partition(Region);
            if (partitionResult != null && partitionResult !== false) {
              if (Accelerate === false) {
                if (
                  UseDualStack === true &&
                  !(Endpoint != null) &&
                  UseFIPS === true &&
                  Region === "aws-global"
                ) {
                  return e(
                    `https://s3-fips.dualstack.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p3(),
                    {},
                  );
                }
                if (
                  UseDualStack === true &&
                  !(Endpoint != null) &&
                  UseFIPS === true &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === true
                ) {
                  return e(
                    `https://s3-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p4(Region),
                    {},
                  );
                }
                if (
                  UseDualStack === true &&
                  !(Endpoint != null) &&
                  UseFIPS === true &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === false
                ) {
                  return e(
                    `https://s3-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p4(Region),
                    {},
                  );
                }
                if (
                  UseDualStack === false &&
                  !(Endpoint != null) &&
                  UseFIPS === true &&
                  Region === "aws-global"
                ) {
                  return e(
                    `https://s3-fips.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p3(),
                    {},
                  );
                }
                if (
                  UseDualStack === false &&
                  !(Endpoint != null) &&
                  UseFIPS === true &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === true
                ) {
                  return e(
                    `https://s3-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p4(Region),
                    {},
                  );
                }
                if (
                  UseDualStack === false &&
                  !(Endpoint != null) &&
                  UseFIPS === true &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === false
                ) {
                  return e(
                    `https://s3-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p4(Region),
                    {},
                  );
                }
                if (
                  UseDualStack === true &&
                  !(Endpoint != null) &&
                  UseFIPS === false &&
                  Region === "aws-global"
                ) {
                  return e(
                    `https://s3.dualstack.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p3(),
                    {},
                  );
                }
                if (
                  UseDualStack === true &&
                  !(Endpoint != null) &&
                  UseFIPS === false &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === true
                ) {
                  return e(
                    `https://s3.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p4(Region),
                    {},
                  );
                }
                if (
                  UseDualStack === true &&
                  !(Endpoint != null) &&
                  UseFIPS === false &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === false
                ) {
                  return e(
                    `https://s3.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p4(Region),
                    {},
                  );
                }
                {
                  const url = _.parseURL(Endpoint);
                  if (
                    UseDualStack === false &&
                    Endpoint != null &&
                    url != null &&
                    url !== false &&
                    UseFIPS === false &&
                    Region === "aws-global"
                  ) {
                    return e(
                      `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "normalizedPath")}${uri_encoded_bucket}`,
                      _p3(),
                      {},
                    );
                  }
                }
                {
                  const url = _.parseURL(Endpoint);
                  if (
                    UseDualStack === false &&
                    Endpoint != null &&
                    url != null &&
                    url !== false &&
                    UseFIPS === false &&
                    !(Region === "aws-global") &&
                    UseGlobalEndpoint === true
                  ) {
                    if (Region === "us-east-1") {
                      return e(
                        `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "normalizedPath")}${uri_encoded_bucket}`,
                        _p4(Region),
                        {},
                      );
                    }
                    return e(
                      `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "normalizedPath")}${uri_encoded_bucket}`,
                      _p4(Region),
                      {},
                    );
                  }
                }
                {
                  const url = _.parseURL(Endpoint);
                  if (
                    UseDualStack === false &&
                    Endpoint != null &&
                    url != null &&
                    url !== false &&
                    UseFIPS === false &&
                    !(Region === "aws-global") &&
                    UseGlobalEndpoint === false
                  ) {
                    return e(
                      `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "normalizedPath")}${uri_encoded_bucket}`,
                      _p4(Region),
                      {},
                    );
                  }
                }
                if (
                  UseDualStack === false &&
                  !(Endpoint != null) &&
                  UseFIPS === false &&
                  Region === "aws-global"
                ) {
                  return e(
                    `https://s3.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p3(),
                    {},
                  );
                }
                if (
                  UseDualStack === false &&
                  !(Endpoint != null) &&
                  UseFIPS === false &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === true
                ) {
                  if (Region === "us-east-1") {
                    return e(
                      `https://s3.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                      _p4(Region),
                      {},
                    );
                  }
                  return e(
                    `https://s3.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p4(Region),
                    {},
                  );
                }
                if (
                  UseDualStack === false &&
                  !(Endpoint != null) &&
                  UseFIPS === false &&
                  !(Region === "aws-global") &&
                  UseGlobalEndpoint === false
                ) {
                  return e(
                    `https://s3.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}/${uri_encoded_bucket}`,
                    _p4(Region),
                    {},
                  );
                }
              }
              return err(
                "Path-style addressing cannot be used with S3 Accelerate",
              );
            }
          }
        }
      }
    }
    if (UseObjectLambdaEndpoint != null && UseObjectLambdaEndpoint === true) {
      {
        const partitionResult = _.partition(Region);
        if (partitionResult != null && partitionResult !== false) {
          if (_.isValidHostLabel(Region, true)) {
            if (UseDualStack === true) {
              return err("S3 Object Lambda does not support Dual-stack");
            }
            if (Accelerate === true) {
              return err("S3 Object Lambda does not support S3 Accelerate");
            }
            {
              const url = _.parseURL(Endpoint);
              if (Endpoint != null && url != null && url !== false) {
                return e(
                  `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p8(Region),
                  {},
                );
              }
            }
            if (UseFIPS === true) {
              return e(
                `https://s3-object-lambda-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p8(Region),
                {},
              );
            }
            return e(
              `https://s3-object-lambda.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
              _p8(Region),
              {},
            );
          }
          return err("Invalid region: region was not a valid DNS name.");
        }
      }
    }
    if (!(Bucket != null)) {
      {
        const partitionResult = _.partition(Region);
        if (partitionResult != null && partitionResult !== false) {
          if (_.isValidHostLabel(Region, true)) {
            if (
              UseFIPS === true &&
              UseDualStack === true &&
              !(Endpoint != null) &&
              Region === "aws-global"
            ) {
              return e(
                `https://s3-fips.dualstack.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p3(),
                {},
              );
            }
            if (
              UseFIPS === true &&
              UseDualStack === true &&
              !(Endpoint != null) &&
              !(Region === "aws-global") &&
              UseGlobalEndpoint === true
            ) {
              return e(
                `https://s3-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p4(Region),
                {},
              );
            }
            if (
              UseFIPS === true &&
              UseDualStack === true &&
              !(Endpoint != null) &&
              !(Region === "aws-global") &&
              UseGlobalEndpoint === false
            ) {
              return e(
                `https://s3-fips.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p4(Region),
                {},
              );
            }
            if (
              UseFIPS === true &&
              UseDualStack === false &&
              !(Endpoint != null) &&
              Region === "aws-global"
            ) {
              return e(
                `https://s3-fips.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p3(),
                {},
              );
            }
            if (
              UseFIPS === true &&
              UseDualStack === false &&
              !(Endpoint != null) &&
              !(Region === "aws-global") &&
              UseGlobalEndpoint === true
            ) {
              return e(
                `https://s3-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p4(Region),
                {},
              );
            }
            if (
              UseFIPS === true &&
              UseDualStack === false &&
              !(Endpoint != null) &&
              !(Region === "aws-global") &&
              UseGlobalEndpoint === false
            ) {
              return e(
                `https://s3-fips.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p4(Region),
                {},
              );
            }
            if (
              UseFIPS === false &&
              UseDualStack === true &&
              !(Endpoint != null) &&
              Region === "aws-global"
            ) {
              return e(
                `https://s3.dualstack.us-east-1.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p3(),
                {},
              );
            }
            if (
              UseFIPS === false &&
              UseDualStack === true &&
              !(Endpoint != null) &&
              !(Region === "aws-global") &&
              UseGlobalEndpoint === true
            ) {
              return e(
                `https://s3.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p4(Region),
                {},
              );
            }
            if (
              UseFIPS === false &&
              UseDualStack === true &&
              !(Endpoint != null) &&
              !(Region === "aws-global") &&
              UseGlobalEndpoint === false
            ) {
              return e(
                `https://s3.dualstack.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p4(Region),
                {},
              );
            }
            {
              const url = _.parseURL(Endpoint);
              if (
                UseFIPS === false &&
                UseDualStack === false &&
                Endpoint != null &&
                url != null &&
                url !== false &&
                Region === "aws-global"
              ) {
                return e(
                  `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p3(),
                  {},
                );
              }
            }
            {
              const url = _.parseURL(Endpoint);
              if (
                UseFIPS === false &&
                UseDualStack === false &&
                Endpoint != null &&
                url != null &&
                url !== false &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === true
              ) {
                if (Region === "us-east-1") {
                  return e(
                    `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                    _p4(Region),
                    {},
                  );
                }
                return e(
                  `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p4(Region),
                  {},
                );
              }
            }
            {
              const url = _.parseURL(Endpoint);
              if (
                UseFIPS === false &&
                UseDualStack === false &&
                Endpoint != null &&
                url != null &&
                url !== false &&
                !(Region === "aws-global") &&
                UseGlobalEndpoint === false
              ) {
                return e(
                  `${_.getAttr(url, "scheme")}://${_.getAttr(url, "authority")}${_.getAttr(url, "path")}`,
                  _p4(Region),
                  {},
                );
              }
            }
            if (
              UseFIPS === false &&
              UseDualStack === false &&
              !(Endpoint != null) &&
              Region === "aws-global"
            ) {
              return e(
                `https://s3.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p3(),
                {},
              );
            }
            if (
              UseFIPS === false &&
              UseDualStack === false &&
              !(Endpoint != null) &&
              !(Region === "aws-global") &&
              UseGlobalEndpoint === true
            ) {
              if (Region === "us-east-1") {
                return e(
                  `https://s3.${_.getAttr(partitionResult, "dnsSuffix")}`,
                  _p4(Region),
                  {},
                );
              }
              return e(
                `https://s3.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p4(Region),
                {},
              );
            }
            if (
              UseFIPS === false &&
              UseDualStack === false &&
              !(Endpoint != null) &&
              !(Region === "aws-global") &&
              UseGlobalEndpoint === false
            ) {
              return e(
                `https://s3.${Region}.${_.getAttr(partitionResult, "dnsSuffix")}`,
                _p4(Region),
                {},
              );
            }
          }
          return err("Invalid region: region was not a valid DNS name.");
        }
      }
    }
  }
  return err("A region must be set when sending requests to S3.");
});

//# Newtypes
export type BucketName = string;
export type ObjectKey = string;
export type MultipartUploadId = string;
export type AccountId = string;
export type IfMatchInitiatedTime = Date;
export type ChecksumCRC32 = string;
export type ChecksumCRC32C = string;
export type ChecksumCRC64NVME = string;
export type ChecksumSHA1 = string;
export type ChecksumSHA256 = string;
export type MpuObjectSize = number;
export type IfMatch = string;
export type IfNoneMatch = string;
export type SSECustomerAlgorithm = string;
export type SSECustomerKey = string | redacted.Redacted<string>;
export type SSECustomerKeyMD5 = string;
export type CacheControl = string;
export type ContentDisposition = string;
export type ContentEncoding = string;
export type ContentLanguage = string;
export type ContentType = string;
export type CopySource = string;
export type CopySourceIfMatch = string;
export type CopySourceIfModifiedSince = Date;
export type CopySourceIfNoneMatch = string;
export type CopySourceIfUnmodifiedSince = Date;
export type Expires = string;
export type GrantFullControl = string;
export type GrantRead = string;
export type GrantReadACP = string;
export type GrantWriteACP = string;
export type WebsiteRedirectLocation = string;
export type SSEKMSKeyId = string | redacted.Redacted<string>;
export type SSEKMSEncryptionContext = string | redacted.Redacted<string>;
export type BucketKeyEnabled = boolean;
export type CopySourceSSECustomerAlgorithm = string;
export type CopySourceSSECustomerKey = string | redacted.Redacted<string>;
export type CopySourceSSECustomerKeyMD5 = string;
export type TaggingHeader = string;
export type ObjectLockRetainUntilDate = Date;
export type GrantWrite = string;
export type ObjectLockEnabledForBucket = boolean;
export type ContentMD5 = string;
export type AnalyticsId = string;
export type IntelligentTieringId = string;
export type InventoryId = string;
export type MetricsId = string;
export type MFA = string;
export type ObjectVersionId = string;
export type BypassGovernanceRetention = boolean;
export type IfMatchLastModifiedTime = Date;
export type IfMatchSize = number;
export type IfModifiedSince = Date;
export type IfUnmodifiedSince = Date;
export type Range = string;
export type ResponseCacheControl = string;
export type ResponseContentDisposition = string;
export type ResponseContentEncoding = string;
export type ResponseContentLanguage = string;
export type ResponseContentType = string;
export type ResponseExpires = Date;
export type PartNumber = number;
export type MaxParts = number;
export type PartNumberMarker = string;
export type Token = string;
export type MaxBuckets = number;
export type Prefix = string;
export type BucketRegion = string;
export type DirectoryBucketToken = string;
export type MaxDirectoryBuckets = number;
export type Delimiter = string;
export type KeyMarker = string;
export type MaxUploads = number;
export type UploadIdMarker = string;
export type Marker = string;
export type MaxKeys = number;
export type FetchOwner = boolean;
export type StartAfter = string;
export type VersionIdMarker = string;
export type SkipValidation = boolean;
export type ConfirmRemoveSelfBucketAccess = boolean;
export type Policy = string;
export type ObjectLockToken = string;
export type ContentLength = number;
export type WriteOffsetBytes = number;
export type RenameSource = string;
export type RenameSourceIfMatch = string;
export type RenameSourceIfNoneMatch = string;
export type RenameSourceIfModifiedSince = Date;
export type RenameSourceIfUnmodifiedSince = Date;
export type ClientToken = string;
export type Expression = string;
export type CopySourceRange = string;
export type RequestRoute = string;
export type RequestToken = string;
export type GetObjectResponseStatusCode = number;
export type ErrorCode = string;
export type ErrorMessage = string;
export type AcceptRanges = string;
export type ContentRange = string;
export type DeleteMarker = boolean;
export type ETag = string;
export type Expiration = string;
export type LastModified = Date;
export type MissingMeta = number;
export type PartsCount = number;
export type Restore = string;
export type TagCount = number;
export type MetadataKey = string;
export type MetadataValue = string;
export type Quiet = boolean;
export type IsEnabled = boolean;
export type Role = string;
export type Setting = boolean;
export type Days = number;
export type Description = string;
export type EnableRequestProgress = boolean;
export type Start = number;
export type End = number;
export type AbortDate = Date;
export type AbortRuleId = string;
export type ObjectSize = number;
export type S3RegionalOrS3ExpressBucketArnString = string;
export type BucketLocationName = string;
export type Region = string;
export type AccessPointAlias = boolean;
export type IsTruncated = boolean;
export type NextToken = string;
export type NextKeyMarker = string;
export type NextUploadIdMarker = string;
export type NextMarker = string;
export type KeyCount = number;
export type NextVersionIdMarker = string;
export type NextPartNumberMarker = string;
export type Size = number;
export type CopySourceVersionId = string;
export type LocationNameAsString = string;
export type Value = string;
export type S3TablesBucketArn = string;
export type S3TablesName = string;
export type LastModifiedTime = Date;
export type DisplayName = string;
export type ID = string;
export type AllowedHeader = string;
export type AllowedMethod = string;
export type AllowedOrigin = string;
export type ExposeHeader = string;
export type MaxAgeSeconds = number;
export type IntelligentTieringDays = number;
export type TargetBucket = string;
export type TargetPrefix = string;
export type AccessPointArn = string;
export type NotificationId = string;
export type TopicArn = string;
export type QueueArn = string;
export type LambdaFunctionArn = string;
export type Priority = number;
export type Suffix = string;
export type HostName = string;
export type Comments = string;
export type QuoteEscapeCharacter = string;
export type RecordDelimiter = string;
export type FieldDelimiter = string;
export type QuoteCharacter = string;
export type AllowQuotedRecordDelimiter = boolean;
export type KmsKeyArn = string;
export type RecordExpirationDays = number;
export type AccessKeyIdValue = string;
export type SessionCredentialValue = string | redacted.Redacted<string>;
export type SessionExpiration = Date;
export type MetadataTableStatus = string;
export type IsPublic = boolean;
export type CreationDate = Date;
export type Initiated = Date;
export type IsLatest = boolean;
export type EmailAddress = string;
export type URI = string;
export type ExpiredObjectDeleteMarker = boolean;
export type ObjectSizeGreaterThanBytes = number;
export type ObjectSizeLessThanBytes = number;
export type VersionCount = number;
export type DaysAfterInitiation = number;
export type HttpErrorCodeReturnedEquals = string;
export type KeyPrefixEquals = string;
export type HttpRedirectCode = string;
export type ReplaceKeyPrefixWith = string;
export type ReplaceKeyWith = string;
export type Years = number;
export type LocationPrefix = string;
export type IsRestoreInProgress = boolean;
export type RestoreExpiryDate = Date;
export type ReplicaKmsKeyID = string;
export type KMSContext = string;
export type S3TablesNamespace = string;
export type S3TablesArn = string;
export type Location = string;
export type FilterRuleValue = string;
export type Minutes = number;
export type DeleteMarkerVersionId = string;
export type Code = string;
export type Message = string;
export type Body = Uint8Array;
export type BytesScanned = number;
export type BytesProcessed = number;
export type BytesReturned = number;
export type RestoreOutputPath = string;

//# Schemas
export type RequestPayer = "requester" | (string & {});
export const RequestPayer = S.String;
export type ChecksumType = "COMPOSITE" | "FULL_OBJECT" | (string & {});
export const ChecksumType = S.String;
export type ObjectCannedACL =
  | "private"
  | "public-read"
  | "public-read-write"
  | "authenticated-read"
  | "aws-exec-read"
  | "bucket-owner-read"
  | "bucket-owner-full-control"
  | (string & {});
export const ObjectCannedACL = S.String;
export type ChecksumAlgorithm =
  | "CRC32"
  | "CRC32C"
  | "SHA1"
  | "SHA256"
  | "CRC64NVME"
  | (string & {});
export const ChecksumAlgorithm = S.String;
export type MetadataDirective = "COPY" | "REPLACE" | (string & {});
export const MetadataDirective = S.String;
export type TaggingDirective = "COPY" | "REPLACE" | (string & {});
export const TaggingDirective = S.String;
export type ServerSideEncryption =
  | "AES256"
  | "aws:fsx"
  | "aws:kms"
  | "aws:kms:dsse"
  | (string & {});
export const ServerSideEncryption = S.String;
export type StorageClass =
  | "STANDARD"
  | "REDUCED_REDUNDANCY"
  | "STANDARD_IA"
  | "ONEZONE_IA"
  | "INTELLIGENT_TIERING"
  | "GLACIER"
  | "DEEP_ARCHIVE"
  | "OUTPOSTS"
  | "GLACIER_IR"
  | "SNOW"
  | "EXPRESS_ONEZONE"
  | "FSX_OPENZFS"
  | "FSX_ONTAP"
  | (string & {});
export const StorageClass = S.String;
export type ObjectLockMode = "GOVERNANCE" | "COMPLIANCE" | (string & {});
export const ObjectLockMode = S.String;
export type ObjectLockLegalHoldStatus = "ON" | "OFF" | (string & {});
export const ObjectLockLegalHoldStatus = S.String;
export type BucketCannedACL =
  | "private"
  | "public-read"
  | "public-read-write"
  | "authenticated-read"
  | (string & {});
export const BucketCannedACL = S.String;
export type ObjectOwnership =
  | "BucketOwnerPreferred"
  | "ObjectWriter"
  | "BucketOwnerEnforced"
  | (string & {});
export const ObjectOwnership = S.String;
export type SessionMode = "ReadOnly" | "ReadWrite" | (string & {});
export const SessionMode = S.String;
export type ChecksumMode = "ENABLED" | (string & {});
export const ChecksumMode = S.String;
export type ObjectAttributes =
  | "ETag"
  | "Checksum"
  | "ObjectParts"
  | "StorageClass"
  | "ObjectSize"
  | (string & {});
export const ObjectAttributes = S.String;
export type ObjectAttributesList = ObjectAttributes[];
export const ObjectAttributesList = S.Array(ObjectAttributes);
export type EncodingType = "url" | (string & {});
export const EncodingType = S.String;
export type OptionalObjectAttributes = "RestoreStatus" | (string & {});
export const OptionalObjectAttributes = S.String;
export type OptionalObjectAttributesList = OptionalObjectAttributes[];
export const OptionalObjectAttributesList = S.Array(OptionalObjectAttributes);
export type TransitionDefaultMinimumObjectSize =
  | "varies_by_storage_class"
  | "all_storage_classes_128K"
  | (string & {});
export const TransitionDefaultMinimumObjectSize = S.String;
export type ExpressionType = "SQL" | (string & {});
export const ExpressionType = S.String;
export type ReplicationStatus =
  | "COMPLETE"
  | "PENDING"
  | "FAILED"
  | "REPLICA"
  | "COMPLETED"
  | (string & {});
export const ReplicationStatus = S.String;
export type RequestCharged = "requester" | (string & {});
export const RequestCharged = S.String;
export interface AbortMultipartUploadRequest {
  Bucket: string;
  Key: string;
  UploadId: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
  IfMatchInitiatedTime?: Date;
}
export const AbortMultipartUploadRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    UploadId: S.String.pipe(T.HttpQuery("uploadId")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    IfMatchInitiatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-if-match-initiated-time")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "DELETE",
        uri: "/{Bucket}/{Key+}?x-id=AbortMultipartUpload",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AbortMultipartUploadRequest",
}) as any as S.Schema<AbortMultipartUploadRequest>;
export type Metadata = { [key: string]: string | undefined };
export const Metadata = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateMultipartUploadRequest {
  ACL?: ObjectCannedACL;
  Bucket: string;
  CacheControl?: string;
  ContentDisposition?: string;
  ContentEncoding?: string;
  ContentLanguage?: string;
  ContentType?: string;
  Expires?: string;
  GrantFullControl?: string;
  GrantRead?: string;
  GrantReadACP?: string;
  GrantWriteACP?: string;
  Key: string;
  Metadata?: { [key: string]: string | undefined };
  ServerSideEncryption?: ServerSideEncryption;
  StorageClass?: StorageClass;
  WebsiteRedirectLocation?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSEKMSEncryptionContext?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  RequestPayer?: RequestPayer;
  Tagging?: string;
  ObjectLockMode?: ObjectLockMode;
  ObjectLockRetainUntilDate?: Date;
  ObjectLockLegalHoldStatus?: ObjectLockLegalHoldStatus;
  ExpectedBucketOwner?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ChecksumType?: ChecksumType;
}
export const CreateMultipartUploadRequest = S.suspend(() =>
  S.Struct({
    ACL: S.optional(ObjectCannedACL).pipe(T.HttpHeader("x-amz-acl")),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ContentDisposition: S.optional(S.String).pipe(
      T.HttpHeader("Content-Disposition"),
    ),
    ContentEncoding: S.optional(S.String).pipe(
      T.HttpHeader("Content-Encoding"),
    ),
    ContentLanguage: S.optional(S.String).pipe(
      T.HttpHeader("Content-Language"),
    ),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Expires: S.optional(S.String).pipe(T.HttpHeader("Expires")),
    GrantFullControl: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-full-control"),
    ),
    GrantRead: S.optional(S.String).pipe(T.HttpHeader("x-amz-grant-read")),
    GrantReadACP: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-read-acp"),
    ),
    GrantWriteACP: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-write-acp"),
    ),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    Metadata: S.optional(Metadata).pipe(T.HttpPrefixHeaders("x-amz-meta-")),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    StorageClass: S.optional(StorageClass).pipe(
      T.HttpHeader("x-amz-storage-class"),
    ),
    WebsiteRedirectLocation: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-website-redirect-location"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    SSEKMSEncryptionContext: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-context"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    Tagging: S.optional(S.String).pipe(T.HttpHeader("x-amz-tagging")),
    ObjectLockMode: S.optional(ObjectLockMode).pipe(
      T.HttpHeader("x-amz-object-lock-mode"),
    ),
    ObjectLockRetainUntilDate: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-object-lock-retain-until-date")),
    ObjectLockLegalHoldStatus: S.optional(ObjectLockLegalHoldStatus).pipe(
      T.HttpHeader("x-amz-object-lock-legal-hold"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-checksum-algorithm"),
    ),
    ChecksumType: S.optional(ChecksumType).pipe(
      T.HttpHeader("x-amz-checksum-type"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{Bucket}/{Key+}?uploads" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMultipartUploadRequest",
}) as any as S.Schema<CreateMultipartUploadRequest>;
export interface CreateSessionRequest {
  SessionMode?: SessionMode;
  Bucket: string;
  ServerSideEncryption?: ServerSideEncryption;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSEKMSEncryptionContext?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
}
export const CreateSessionRequest = S.suspend(() =>
  S.Struct({
    SessionMode: S.optional(SessionMode).pipe(
      T.HttpHeader("x-amz-create-session-mode"),
    ),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    SSEKMSEncryptionContext: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-context"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?session" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ DisableS3ExpressSessionAuth: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateSessionRequest",
}) as any as S.Schema<CreateSessionRequest>;
export interface DeleteBucketRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
export interface DeleteBucketAnalyticsConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketAnalyticsConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?analytics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketAnalyticsConfigurationRequest",
}) as any as S.Schema<DeleteBucketAnalyticsConfigurationRequest>;
export interface DeleteBucketAnalyticsConfigurationResponse {}
export const DeleteBucketAnalyticsConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketAnalyticsConfigurationResponse",
}) as any as S.Schema<DeleteBucketAnalyticsConfigurationResponse>;
export interface DeleteBucketCorsRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketCorsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?cors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketCorsRequest",
}) as any as S.Schema<DeleteBucketCorsRequest>;
export interface DeleteBucketCorsResponse {}
export const DeleteBucketCorsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketCorsResponse",
}) as any as S.Schema<DeleteBucketCorsResponse>;
export interface DeleteBucketEncryptionRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketEncryptionRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketEncryptionRequest",
}) as any as S.Schema<DeleteBucketEncryptionRequest>;
export interface DeleteBucketEncryptionResponse {}
export const DeleteBucketEncryptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketEncryptionResponse",
}) as any as S.Schema<DeleteBucketEncryptionResponse>;
export interface DeleteBucketIntelligentTieringConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketIntelligentTieringConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
      Id: S.String.pipe(T.HttpQuery("id")),
      ExpectedBucketOwner: S.optional(S.String).pipe(
        T.HttpHeader("x-amz-expected-bucket-owner"),
      ),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "DELETE", uri: "/{Bucket}?intelligent-tiering" }),
        svc,
        auth,
        proto,
        ver,
        rules,
        T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
      ),
    ),
).annotations({
  identifier: "DeleteBucketIntelligentTieringConfigurationRequest",
}) as any as S.Schema<DeleteBucketIntelligentTieringConfigurationRequest>;
export interface DeleteBucketIntelligentTieringConfigurationResponse {}
export const DeleteBucketIntelligentTieringConfigurationResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketIntelligentTieringConfigurationResponse",
}) as any as S.Schema<DeleteBucketIntelligentTieringConfigurationResponse>;
export interface DeleteBucketInventoryConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketInventoryConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?inventory" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketInventoryConfigurationRequest",
}) as any as S.Schema<DeleteBucketInventoryConfigurationRequest>;
export interface DeleteBucketInventoryConfigurationResponse {}
export const DeleteBucketInventoryConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketInventoryConfigurationResponse",
}) as any as S.Schema<DeleteBucketInventoryConfigurationResponse>;
export interface DeleteBucketLifecycleRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketLifecycleRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?lifecycle" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketLifecycleRequest",
}) as any as S.Schema<DeleteBucketLifecycleRequest>;
export interface DeleteBucketLifecycleResponse {}
export const DeleteBucketLifecycleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketLifecycleResponse",
}) as any as S.Schema<DeleteBucketLifecycleResponse>;
export interface DeleteBucketMetadataConfigurationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketMetadataConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?metadataConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketMetadataConfigurationRequest",
}) as any as S.Schema<DeleteBucketMetadataConfigurationRequest>;
export interface DeleteBucketMetadataConfigurationResponse {}
export const DeleteBucketMetadataConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketMetadataConfigurationResponse",
}) as any as S.Schema<DeleteBucketMetadataConfigurationResponse>;
export interface DeleteBucketMetadataTableConfigurationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketMetadataTableConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?metadataTable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketMetadataTableConfigurationRequest",
}) as any as S.Schema<DeleteBucketMetadataTableConfigurationRequest>;
export interface DeleteBucketMetadataTableConfigurationResponse {}
export const DeleteBucketMetadataTableConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketMetadataTableConfigurationResponse",
}) as any as S.Schema<DeleteBucketMetadataTableConfigurationResponse>;
export interface DeleteBucketMetricsConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketMetricsConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketMetricsConfigurationRequest",
}) as any as S.Schema<DeleteBucketMetricsConfigurationRequest>;
export interface DeleteBucketMetricsConfigurationResponse {}
export const DeleteBucketMetricsConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketMetricsConfigurationResponse",
}) as any as S.Schema<DeleteBucketMetricsConfigurationResponse>;
export interface DeleteBucketOwnershipControlsRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketOwnershipControlsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?ownershipControls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketOwnershipControlsRequest",
}) as any as S.Schema<DeleteBucketOwnershipControlsRequest>;
export interface DeleteBucketOwnershipControlsResponse {}
export const DeleteBucketOwnershipControlsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketOwnershipControlsResponse",
}) as any as S.Schema<DeleteBucketOwnershipControlsResponse>;
export interface DeleteBucketPolicyRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketTaggingRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
export interface DeleteBucketWebsiteRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeleteBucketWebsiteRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?website" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeleteBucketWebsiteRequest",
}) as any as S.Schema<DeleteBucketWebsiteRequest>;
export interface DeleteBucketWebsiteResponse {}
export const DeleteBucketWebsiteResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBucketWebsiteResponse",
}) as any as S.Schema<DeleteBucketWebsiteResponse>;
export interface DeleteObjectRequest {
  Bucket: string;
  Key: string;
  MFA?: string;
  VersionId?: string;
  RequestPayer?: RequestPayer;
  BypassGovernanceRetention?: boolean;
  ExpectedBucketOwner?: string;
  IfMatch?: string;
  IfMatchLastModifiedTime?: Date;
  IfMatchSize?: number;
}
export const DeleteObjectRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    MFA: S.optional(S.String).pipe(T.HttpHeader("x-amz-mfa")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    BypassGovernanceRetention: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-bypass-governance-retention"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    IfMatchLastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-if-match-last-modified-time")),
    IfMatchSize: S.optional(S.Number).pipe(T.HttpHeader("x-amz-if-match-size")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}/{Key+}?x-id=DeleteObject" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteObjectRequest",
}) as any as S.Schema<DeleteObjectRequest>;
export interface DeleteObjectTaggingRequest {
  Bucket: string;
  Key: string;
  VersionId?: string;
  ExpectedBucketOwner?: string;
}
export const DeleteObjectTaggingRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}/{Key+}?tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteObjectTaggingRequest",
}) as any as S.Schema<DeleteObjectTaggingRequest>;
export interface DeletePublicAccessBlockRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const DeletePublicAccessBlockRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Bucket}?publicAccessBlock" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
export interface GetBucketAbacRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketAbacRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?abac" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBucketAbacRequest",
}) as any as S.Schema<GetBucketAbacRequest>;
export interface GetBucketAccelerateConfigurationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
  RequestPayer?: RequestPayer;
}
export const GetBucketAccelerateConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?accelerate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketAccelerateConfigurationRequest",
}) as any as S.Schema<GetBucketAccelerateConfigurationRequest>;
export interface GetBucketAclRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketAclRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?acl" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketAclRequest",
}) as any as S.Schema<GetBucketAclRequest>;
export interface GetBucketAnalyticsConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketAnalyticsConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{Bucket}?analytics&x-id=GetBucketAnalyticsConfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketAnalyticsConfigurationRequest",
}) as any as S.Schema<GetBucketAnalyticsConfigurationRequest>;
export interface GetBucketCorsRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketCorsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?cors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketCorsRequest",
}) as any as S.Schema<GetBucketCorsRequest>;
export interface GetBucketEncryptionRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketEncryptionRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketEncryptionRequest",
}) as any as S.Schema<GetBucketEncryptionRequest>;
export interface GetBucketIntelligentTieringConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketIntelligentTieringConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{Bucket}?intelligent-tiering&x-id=GetBucketIntelligentTieringConfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketIntelligentTieringConfigurationRequest",
}) as any as S.Schema<GetBucketIntelligentTieringConfigurationRequest>;
export interface GetBucketInventoryConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketInventoryConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{Bucket}?inventory&x-id=GetBucketInventoryConfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketInventoryConfigurationRequest",
}) as any as S.Schema<GetBucketInventoryConfigurationRequest>;
export interface GetBucketLifecycleConfigurationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketLifecycleConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?lifecycle" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketLifecycleConfigurationRequest",
}) as any as S.Schema<GetBucketLifecycleConfigurationRequest>;
export interface GetBucketLocationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketLocationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?location" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketLocationRequest",
}) as any as S.Schema<GetBucketLocationRequest>;
export interface GetBucketLoggingRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketLoggingRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?logging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketLoggingRequest",
}) as any as S.Schema<GetBucketLoggingRequest>;
export interface GetBucketMetadataConfigurationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketMetadataConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?metadataConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketMetadataConfigurationRequest",
}) as any as S.Schema<GetBucketMetadataConfigurationRequest>;
export interface GetBucketMetadataTableConfigurationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketMetadataTableConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?metadataTable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketMetadataTableConfigurationRequest",
}) as any as S.Schema<GetBucketMetadataTableConfigurationRequest>;
export interface GetBucketMetricsConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketMetricsConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{Bucket}?metrics&x-id=GetBucketMetricsConfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketMetricsConfigurationRequest",
}) as any as S.Schema<GetBucketMetricsConfigurationRequest>;
export interface GetBucketNotificationConfigurationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketNotificationConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?notification" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketNotificationConfigurationRequest",
}) as any as S.Schema<GetBucketNotificationConfigurationRequest>;
export interface GetBucketOwnershipControlsRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketOwnershipControlsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?ownershipControls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketOwnershipControlsRequest",
}) as any as S.Schema<GetBucketOwnershipControlsRequest>;
export interface GetBucketPolicyRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketPolicyRequest",
}) as any as S.Schema<GetBucketPolicyRequest>;
export interface GetBucketPolicyStatusRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketPolicyStatusRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?policyStatus" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketPolicyStatusRequest",
}) as any as S.Schema<GetBucketPolicyStatusRequest>;
export interface GetBucketReplicationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketReplicationRequest",
}) as any as S.Schema<GetBucketReplicationRequest>;
export interface GetBucketRequestPaymentRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketRequestPaymentRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?requestPayment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketRequestPaymentRequest",
}) as any as S.Schema<GetBucketRequestPaymentRequest>;
export interface GetBucketTaggingRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketTaggingRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketTaggingRequest",
}) as any as S.Schema<GetBucketTaggingRequest>;
export interface GetBucketVersioningRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketVersioningRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?versioning" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketVersioningRequest",
}) as any as S.Schema<GetBucketVersioningRequest>;
export interface GetBucketWebsiteRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetBucketWebsiteRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?website" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetBucketWebsiteRequest",
}) as any as S.Schema<GetBucketWebsiteRequest>;
export interface GetObjectRequest {
  Bucket: string;
  IfMatch?: string;
  IfModifiedSince?: Date;
  IfNoneMatch?: string;
  IfUnmodifiedSince?: Date;
  Key: string;
  Range?: string;
  ResponseCacheControl?: string;
  ResponseContentDisposition?: string;
  ResponseContentEncoding?: string;
  ResponseContentLanguage?: string;
  ResponseContentType?: string;
  ResponseExpires?: Date;
  VersionId?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  RequestPayer?: RequestPayer;
  PartNumber?: number;
  ExpectedBucketOwner?: string;
  ChecksumMode?: ChecksumMode;
}
export const GetObjectRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    IfModifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("If-Modified-Since")),
    IfNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    IfUnmodifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("If-Unmodified-Since")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    Range: S.optional(S.String).pipe(T.HttpHeader("Range")),
    ResponseCacheControl: S.optional(S.String).pipe(
      T.HttpQuery("response-cache-control"),
    ),
    ResponseContentDisposition: S.optional(S.String).pipe(
      T.HttpQuery("response-content-disposition"),
    ),
    ResponseContentEncoding: S.optional(S.String).pipe(
      T.HttpQuery("response-content-encoding"),
    ),
    ResponseContentLanguage: S.optional(S.String).pipe(
      T.HttpQuery("response-content-language"),
    ),
    ResponseContentType: S.optional(S.String).pipe(
      T.HttpQuery("response-content-type"),
    ),
    ResponseExpires: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpQuery("response-expires")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    PartNumber: S.optional(S.Number).pipe(T.HttpQuery("partNumber")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    ChecksumMode: S.optional(ChecksumMode).pipe(
      T.HttpHeader("x-amz-checksum-mode"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?x-id=GetObject" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        responseAlgorithms: ["CRC64NVME", "CRC32", "CRC32C", "SHA256", "SHA1"],
      }),
    ),
  ),
).annotations({
  identifier: "GetObjectRequest",
}) as any as S.Schema<GetObjectRequest>;
export interface GetObjectAclRequest {
  Bucket: string;
  Key: string;
  VersionId?: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
}
export const GetObjectAclRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?acl" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectAclRequest",
}) as any as S.Schema<GetObjectAclRequest>;
export interface GetObjectAttributesRequest {
  Bucket: string;
  Key: string;
  VersionId?: string;
  MaxParts?: number;
  PartNumberMarker?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
  ObjectAttributes: ObjectAttributes[];
}
export const GetObjectAttributesRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    MaxParts: S.optional(S.Number).pipe(T.HttpHeader("x-amz-max-parts")),
    PartNumberMarker: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-part-number-marker"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    ObjectAttributes: ObjectAttributesList.pipe(
      T.HttpHeader("x-amz-object-attributes"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?attributes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectAttributesRequest",
}) as any as S.Schema<GetObjectAttributesRequest>;
export interface GetObjectLegalHoldRequest {
  Bucket: string;
  Key: string;
  VersionId?: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
}
export const GetObjectLegalHoldRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?legal-hold" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectLegalHoldRequest",
}) as any as S.Schema<GetObjectLegalHoldRequest>;
export interface GetObjectLockConfigurationRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetObjectLockConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?object-lock" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectLockConfigurationRequest",
}) as any as S.Schema<GetObjectLockConfigurationRequest>;
export interface GetObjectRetentionRequest {
  Bucket: string;
  Key: string;
  VersionId?: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
}
export const GetObjectRetentionRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?retention" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectRetentionRequest",
}) as any as S.Schema<GetObjectRetentionRequest>;
export interface GetObjectTaggingRequest {
  Bucket: string;
  Key: string;
  VersionId?: string;
  ExpectedBucketOwner?: string;
  RequestPayer?: RequestPayer;
}
export const GetObjectTaggingRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectTaggingRequest",
}) as any as S.Schema<GetObjectTaggingRequest>;
export interface GetObjectTorrentRequest {
  Bucket: string;
  Key: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
}
export const GetObjectTorrentRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?torrent" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectTorrentRequest",
}) as any as S.Schema<GetObjectTorrentRequest>;
export interface GetPublicAccessBlockRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const GetPublicAccessBlockRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?publicAccessBlock" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetPublicAccessBlockRequest",
}) as any as S.Schema<GetPublicAccessBlockRequest>;
export interface HeadBucketRequest {
  Bucket: string;
  ExpectedBucketOwner?: string;
}
export const HeadBucketRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "HEAD", uri: "/{Bucket}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "HeadBucketRequest",
}) as any as S.Schema<HeadBucketRequest>;
export interface HeadObjectRequest {
  Bucket: string;
  IfMatch?: string;
  IfModifiedSince?: Date;
  IfNoneMatch?: string;
  IfUnmodifiedSince?: Date;
  Key: string;
  Range?: string;
  ResponseCacheControl?: string;
  ResponseContentDisposition?: string;
  ResponseContentEncoding?: string;
  ResponseContentLanguage?: string;
  ResponseContentType?: string;
  ResponseExpires?: Date;
  VersionId?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  RequestPayer?: RequestPayer;
  PartNumber?: number;
  ExpectedBucketOwner?: string;
  ChecksumMode?: ChecksumMode;
}
export const HeadObjectRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    IfModifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("If-Modified-Since")),
    IfNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    IfUnmodifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("If-Unmodified-Since")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    Range: S.optional(S.String).pipe(T.HttpHeader("Range")),
    ResponseCacheControl: S.optional(S.String).pipe(
      T.HttpQuery("response-cache-control"),
    ),
    ResponseContentDisposition: S.optional(S.String).pipe(
      T.HttpQuery("response-content-disposition"),
    ),
    ResponseContentEncoding: S.optional(S.String).pipe(
      T.HttpQuery("response-content-encoding"),
    ),
    ResponseContentLanguage: S.optional(S.String).pipe(
      T.HttpQuery("response-content-language"),
    ),
    ResponseContentType: S.optional(S.String).pipe(
      T.HttpQuery("response-content-type"),
    ),
    ResponseExpires: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpQuery("response-expires")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    PartNumber: S.optional(S.Number).pipe(T.HttpQuery("partNumber")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    ChecksumMode: S.optional(ChecksumMode).pipe(
      T.HttpHeader("x-amz-checksum-mode"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "HEAD", uri: "/{Bucket}/{Key+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "HeadObjectRequest",
}) as any as S.Schema<HeadObjectRequest>;
export interface ListBucketAnalyticsConfigurationsRequest {
  Bucket: string;
  ContinuationToken?: string;
  ExpectedBucketOwner?: string;
}
export const ListBucketAnalyticsConfigurationsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContinuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuation-token"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{Bucket}?analytics&x-id=ListBucketAnalyticsConfigurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListBucketAnalyticsConfigurationsRequest",
}) as any as S.Schema<ListBucketAnalyticsConfigurationsRequest>;
export interface ListBucketIntelligentTieringConfigurationsRequest {
  Bucket: string;
  ContinuationToken?: string;
  ExpectedBucketOwner?: string;
}
export const ListBucketIntelligentTieringConfigurationsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContinuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuation-token"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{Bucket}?intelligent-tiering&x-id=ListBucketIntelligentTieringConfigurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListBucketIntelligentTieringConfigurationsRequest",
}) as any as S.Schema<ListBucketIntelligentTieringConfigurationsRequest>;
export interface ListBucketInventoryConfigurationsRequest {
  Bucket: string;
  ContinuationToken?: string;
  ExpectedBucketOwner?: string;
}
export const ListBucketInventoryConfigurationsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContinuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuation-token"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{Bucket}?inventory&x-id=ListBucketInventoryConfigurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListBucketInventoryConfigurationsRequest",
}) as any as S.Schema<ListBucketInventoryConfigurationsRequest>;
export interface ListBucketMetricsConfigurationsRequest {
  Bucket: string;
  ContinuationToken?: string;
  ExpectedBucketOwner?: string;
}
export const ListBucketMetricsConfigurationsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContinuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuation-token"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/{Bucket}?metrics&x-id=ListBucketMetricsConfigurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBucketMetricsConfigurationsRequest",
}) as any as S.Schema<ListBucketMetricsConfigurationsRequest>;
export interface ListBucketsRequest {
  MaxBuckets?: number;
  ContinuationToken?: string;
  Prefix?: string;
  BucketRegion?: string;
}
export const ListBucketsRequest = S.suspend(() =>
  S.Struct({
    MaxBuckets: S.optional(S.Number).pipe(T.HttpQuery("max-buckets")),
    ContinuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuation-token"),
    ),
    Prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    BucketRegion: S.optional(S.String).pipe(T.HttpQuery("bucket-region")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/?x-id=ListBuckets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBucketsRequest",
}) as any as S.Schema<ListBucketsRequest>;
export interface ListDirectoryBucketsRequest {
  ContinuationToken?: string;
  MaxDirectoryBuckets?: number;
}
export const ListDirectoryBucketsRequest = S.suspend(() =>
  S.Struct({
    ContinuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuation-token"),
    ),
    MaxDirectoryBuckets: S.optional(S.Number).pipe(
      T.HttpQuery("max-directory-buckets"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/?x-id=ListDirectoryBuckets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListDirectoryBucketsRequest",
}) as any as S.Schema<ListDirectoryBucketsRequest>;
export interface ListMultipartUploadsRequest {
  Bucket: string;
  Delimiter?: string;
  EncodingType?: EncodingType;
  KeyMarker?: string;
  MaxUploads?: number;
  Prefix?: string;
  UploadIdMarker?: string;
  ExpectedBucketOwner?: string;
  RequestPayer?: RequestPayer;
}
export const ListMultipartUploadsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Delimiter: S.optional(S.String).pipe(T.HttpQuery("delimiter")),
    EncodingType: S.optional(EncodingType).pipe(T.HttpQuery("encoding-type")),
    KeyMarker: S.optional(S.String).pipe(T.HttpQuery("key-marker")),
    MaxUploads: S.optional(S.Number).pipe(T.HttpQuery("max-uploads")),
    Prefix: S.optional(S.String).pipe(
      T.HttpQuery("prefix"),
      T.ContextParam("Prefix"),
    ),
    UploadIdMarker: S.optional(S.String).pipe(T.HttpQuery("upload-id-marker")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?uploads" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMultipartUploadsRequest",
}) as any as S.Schema<ListMultipartUploadsRequest>;
export interface ListObjectsRequest {
  Bucket: string;
  Delimiter?: string;
  EncodingType?: EncodingType;
  Marker?: string;
  MaxKeys?: number;
  Prefix?: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
  OptionalObjectAttributes?: OptionalObjectAttributes[];
}
export const ListObjectsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Delimiter: S.optional(S.String).pipe(T.HttpQuery("delimiter")),
    EncodingType: S.optional(EncodingType).pipe(T.HttpQuery("encoding-type")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("marker")),
    MaxKeys: S.optional(S.Number).pipe(T.HttpQuery("max-keys")),
    Prefix: S.optional(S.String).pipe(
      T.HttpQuery("prefix"),
      T.ContextParam("Prefix"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    OptionalObjectAttributes: S.optional(OptionalObjectAttributesList).pipe(
      T.HttpHeader("x-amz-optional-object-attributes"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListObjectsRequest",
}) as any as S.Schema<ListObjectsRequest>;
export interface ListObjectsV2Request {
  Bucket: string;
  Delimiter?: string;
  EncodingType?: EncodingType;
  MaxKeys?: number;
  Prefix?: string;
  ContinuationToken?: string;
  FetchOwner?: boolean;
  StartAfter?: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
  OptionalObjectAttributes?: OptionalObjectAttributes[];
}
export const ListObjectsV2Request = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Delimiter: S.optional(S.String).pipe(T.HttpQuery("delimiter")),
    EncodingType: S.optional(EncodingType).pipe(T.HttpQuery("encoding-type")),
    MaxKeys: S.optional(S.Number).pipe(T.HttpQuery("max-keys")),
    Prefix: S.optional(S.String).pipe(
      T.HttpQuery("prefix"),
      T.ContextParam("Prefix"),
    ),
    ContinuationToken: S.optional(S.String).pipe(
      T.HttpQuery("continuation-token"),
    ),
    FetchOwner: S.optional(S.Boolean).pipe(T.HttpQuery("fetch-owner")),
    StartAfter: S.optional(S.String).pipe(T.HttpQuery("start-after")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    OptionalObjectAttributes: S.optional(OptionalObjectAttributesList).pipe(
      T.HttpHeader("x-amz-optional-object-attributes"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?list-type=2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListObjectsV2Request",
}) as any as S.Schema<ListObjectsV2Request>;
export interface ListObjectVersionsRequest {
  Bucket: string;
  Delimiter?: string;
  EncodingType?: EncodingType;
  KeyMarker?: string;
  MaxKeys?: number;
  Prefix?: string;
  VersionIdMarker?: string;
  ExpectedBucketOwner?: string;
  RequestPayer?: RequestPayer;
  OptionalObjectAttributes?: OptionalObjectAttributes[];
}
export const ListObjectVersionsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Delimiter: S.optional(S.String).pipe(T.HttpQuery("delimiter")),
    EncodingType: S.optional(EncodingType).pipe(T.HttpQuery("encoding-type")),
    KeyMarker: S.optional(S.String).pipe(T.HttpQuery("key-marker")),
    MaxKeys: S.optional(S.Number).pipe(T.HttpQuery("max-keys")),
    Prefix: S.optional(S.String).pipe(
      T.HttpQuery("prefix"),
      T.ContextParam("Prefix"),
    ),
    VersionIdMarker: S.optional(S.String).pipe(
      T.HttpQuery("version-id-marker"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    OptionalObjectAttributes: S.optional(OptionalObjectAttributesList).pipe(
      T.HttpHeader("x-amz-optional-object-attributes"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}?versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListObjectVersionsRequest",
}) as any as S.Schema<ListObjectVersionsRequest>;
export interface ListPartsRequest {
  Bucket: string;
  Key: string;
  MaxParts?: number;
  PartNumberMarker?: string;
  UploadId: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
}
export const ListPartsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    MaxParts: S.optional(S.Number).pipe(T.HttpQuery("max-parts")),
    PartNumberMarker: S.optional(S.String).pipe(
      T.HttpQuery("part-number-marker"),
    ),
    UploadId: S.String.pipe(T.HttpQuery("uploadId")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?x-id=ListParts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPartsRequest",
}) as any as S.Schema<ListPartsRequest>;
export interface PutBucketPolicyRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ConfirmRemoveSelfBucketAccess?: boolean;
  Policy: string;
  ExpectedBucketOwner?: string;
}
export const PutBucketPolicyRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ConfirmRemoveSelfBucketAccess: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-confirm-remove-self-bucket-access"),
    ),
    Policy: S.String.pipe(T.HttpPayload()),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
export interface PutObjectRequest {
  ACL?: ObjectCannedACL;
  Body?: T.StreamingInputBody;
  Bucket: string;
  CacheControl?: string;
  ContentDisposition?: string;
  ContentEncoding?: string;
  ContentLanguage?: string;
  ContentLength?: number;
  ContentMD5?: string;
  ContentType?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  Expires?: string;
  IfMatch?: string;
  IfNoneMatch?: string;
  GrantFullControl?: string;
  GrantRead?: string;
  GrantReadACP?: string;
  GrantWriteACP?: string;
  Key: string;
  WriteOffsetBytes?: number;
  Metadata?: { [key: string]: string | undefined };
  ServerSideEncryption?: ServerSideEncryption;
  StorageClass?: StorageClass;
  WebsiteRedirectLocation?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSEKMSEncryptionContext?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  RequestPayer?: RequestPayer;
  Tagging?: string;
  ObjectLockMode?: ObjectLockMode;
  ObjectLockRetainUntilDate?: Date;
  ObjectLockLegalHoldStatus?: ObjectLockLegalHoldStatus;
  ExpectedBucketOwner?: string;
}
export const PutObjectRequest = S.suspend(() =>
  S.Struct({
    ACL: S.optional(ObjectCannedACL).pipe(T.HttpHeader("x-amz-acl")),
    Body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ContentDisposition: S.optional(S.String).pipe(
      T.HttpHeader("Content-Disposition"),
    ),
    ContentEncoding: S.optional(S.String).pipe(
      T.HttpHeader("Content-Encoding"),
    ),
    ContentLanguage: S.optional(S.String).pipe(
      T.HttpHeader("Content-Language"),
    ),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ChecksumCRC32: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32"),
    ),
    ChecksumCRC32C: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32c"),
    ),
    ChecksumCRC64NVME: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc64nvme"),
    ),
    ChecksumSHA1: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha1"),
    ),
    ChecksumSHA256: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha256"),
    ),
    Expires: S.optional(S.String).pipe(T.HttpHeader("Expires")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    IfNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    GrantFullControl: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-full-control"),
    ),
    GrantRead: S.optional(S.String).pipe(T.HttpHeader("x-amz-grant-read")),
    GrantReadACP: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-read-acp"),
    ),
    GrantWriteACP: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-write-acp"),
    ),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    WriteOffsetBytes: S.optional(S.Number).pipe(
      T.HttpHeader("x-amz-write-offset-bytes"),
    ),
    Metadata: S.optional(Metadata).pipe(T.HttpPrefixHeaders("x-amz-meta-")),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    StorageClass: S.optional(StorageClass).pipe(
      T.HttpHeader("x-amz-storage-class"),
    ),
    WebsiteRedirectLocation: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-website-redirect-location"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    SSEKMSEncryptionContext: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-context"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    Tagging: S.optional(S.String).pipe(T.HttpHeader("x-amz-tagging")),
    ObjectLockMode: S.optional(ObjectLockMode).pipe(
      T.HttpHeader("x-amz-object-lock-mode"),
    ),
    ObjectLockRetainUntilDate: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-object-lock-retain-until-date")),
    ObjectLockLegalHoldStatus: S.optional(ObjectLockLegalHoldStatus).pipe(
      T.HttpHeader("x-amz-object-lock-legal-hold"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?x-id=PutObject" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
      }),
    ),
  ),
).annotations({
  identifier: "PutObjectRequest",
}) as any as S.Schema<PutObjectRequest>;
export type Type =
  | "CanonicalUser"
  | "AmazonCustomerByEmail"
  | "Group"
  | (string & {});
export const Type = S.String;
export interface Grantee {
  DisplayName?: string;
  EmailAddress?: string;
  ID?: string;
  URI?: string;
  Type: Type;
}
export const Grantee = S.suspend(() =>
  S.Struct({
    DisplayName: S.optional(S.String),
    EmailAddress: S.optional(S.String),
    ID: S.optional(S.String),
    URI: S.optional(S.String),
    Type: Type.pipe(T.XmlName("xsi:type"), T.XmlAttribute()),
  }),
).annotations({ identifier: "Grantee" }) as any as S.Schema<Grantee>;
export type Permission =
  | "FULL_CONTROL"
  | "WRITE"
  | "WRITE_ACP"
  | "READ"
  | "READ_ACP"
  | (string & {});
export const Permission = S.String;
export interface Grant {
  Grantee?: Grantee;
  Permission?: Permission;
}
export const Grant = S.suspend(() =>
  S.Struct({
    Grantee: S.optional(Grantee),
    Permission: S.optional(Permission),
  }),
).annotations({ identifier: "Grant" }) as any as S.Schema<Grant>;
export type Grants = Grant[];
export const Grants = S.Array(
  Grant.pipe(T.XmlName("Grant")).annotations({ identifier: "Grant" }),
);
export interface Owner {
  DisplayName?: string;
  ID?: string;
}
export const Owner = S.suspend(() =>
  S.Struct({ DisplayName: S.optional(S.String), ID: S.optional(S.String) }),
).annotations({ identifier: "Owner" }) as any as S.Schema<Owner>;
export interface AccessControlPolicy {
  Grants?: Grant[];
  Owner?: Owner;
}
export const AccessControlPolicy = S.suspend(() =>
  S.Struct({
    Grants: S.optional(Grants).pipe(T.XmlName("AccessControlList")),
    Owner: S.optional(Owner),
  }),
).annotations({
  identifier: "AccessControlPolicy",
}) as any as S.Schema<AccessControlPolicy>;
export interface PutObjectAclRequest {
  ACL?: ObjectCannedACL;
  AccessControlPolicy?: AccessControlPolicy;
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  GrantFullControl?: string;
  GrantRead?: string;
  GrantReadACP?: string;
  GrantWrite?: string;
  GrantWriteACP?: string;
  Key: string;
  RequestPayer?: RequestPayer;
  VersionId?: string;
  ExpectedBucketOwner?: string;
}
export const PutObjectAclRequest = S.suspend(() =>
  S.Struct({
    ACL: S.optional(ObjectCannedACL).pipe(T.HttpHeader("x-amz-acl")),
    AccessControlPolicy: S.optional(AccessControlPolicy)
      .pipe(T.HttpPayload(), T.XmlName("AccessControlPolicy"))
      .annotations({ identifier: "AccessControlPolicy" }),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
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
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?acl" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
    ),
  ),
).annotations({
  identifier: "PutObjectAclRequest",
}) as any as S.Schema<PutObjectAclRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagSet = Tag[];
export const TagSet = S.Array(
  Tag.pipe(T.XmlName("Tag")).annotations({ identifier: "Tag" }),
);
export interface Tagging {
  TagSet: Tag[];
}
export const Tagging = S.suspend(() =>
  S.Struct({ TagSet: TagSet }),
).annotations({ identifier: "Tagging" }) as any as S.Schema<Tagging>;
export interface PutObjectTaggingRequest {
  Bucket: string;
  Key: string;
  VersionId?: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  Tagging: Tagging;
  ExpectedBucketOwner?: string;
  RequestPayer?: RequestPayer;
}
export const PutObjectTaggingRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    Tagging: Tagging.pipe(T.HttpPayload(), T.XmlName("Tagging")).annotations({
      identifier: "Tagging",
    }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
    ),
  ),
).annotations({
  identifier: "PutObjectTaggingRequest",
}) as any as S.Schema<PutObjectTaggingRequest>;
export interface RenameObjectRequest {
  Bucket: string;
  Key: string;
  RenameSource: string;
  DestinationIfMatch?: string;
  DestinationIfNoneMatch?: string;
  DestinationIfModifiedSince?: Date;
  DestinationIfUnmodifiedSince?: Date;
  SourceIfMatch?: string;
  SourceIfNoneMatch?: string;
  SourceIfModifiedSince?: Date;
  SourceIfUnmodifiedSince?: Date;
  ClientToken?: string;
}
export const RenameObjectRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    RenameSource: S.String.pipe(T.HttpHeader("x-amz-rename-source")),
    DestinationIfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    DestinationIfNoneMatch: S.optional(S.String).pipe(
      T.HttpHeader("If-None-Match"),
    ),
    DestinationIfModifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("If-Modified-Since")),
    DestinationIfUnmodifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("If-Unmodified-Since")),
    SourceIfMatch: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-rename-source-if-match"),
    ),
    SourceIfNoneMatch: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-rename-source-if-none-match"),
    ),
    SourceIfModifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-rename-source-if-modified-since")),
    SourceIfUnmodifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-rename-source-if-unmodified-since")),
    ClientToken: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-client-token"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?renameObject" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RenameObjectRequest",
}) as any as S.Schema<RenameObjectRequest>;
export interface RenameObjectOutput {}
export const RenameObjectOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RenameObjectOutput",
}) as any as S.Schema<RenameObjectOutput>;
export interface UploadPartRequest {
  Body?: T.StreamingInputBody;
  Bucket: string;
  ContentLength?: number;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  Key: string;
  PartNumber: number;
  UploadId: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
}
export const UploadPartRequest = S.suspend(() =>
  S.Struct({
    Body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ChecksumCRC32: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32"),
    ),
    ChecksumCRC32C: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32c"),
    ),
    ChecksumCRC64NVME: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc64nvme"),
    ),
    ChecksumSHA1: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha1"),
    ),
    ChecksumSHA256: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha256"),
    ),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    PartNumber: S.Number.pipe(T.HttpQuery("partNumber")),
    UploadId: S.String.pipe(T.HttpQuery("uploadId")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?x-id=UploadPart" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
      }),
    ),
  ),
).annotations({
  identifier: "UploadPartRequest",
}) as any as S.Schema<UploadPartRequest>;
export interface UploadPartCopyRequest {
  Bucket: string;
  CopySource: string;
  CopySourceIfMatch?: string;
  CopySourceIfModifiedSince?: Date;
  CopySourceIfNoneMatch?: string;
  CopySourceIfUnmodifiedSince?: Date;
  CopySourceRange?: string;
  Key: string;
  PartNumber: number;
  UploadId: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  CopySourceSSECustomerAlgorithm?: string;
  CopySourceSSECustomerKey?: string | redacted.Redacted<string>;
  CopySourceSSECustomerKeyMD5?: string;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
  ExpectedSourceBucketOwner?: string;
}
export const UploadPartCopyRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    CopySource: S.String.pipe(T.HttpHeader("x-amz-copy-source")),
    CopySourceIfMatch: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-if-match"),
    ),
    CopySourceIfModifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-copy-source-if-modified-since")),
    CopySourceIfNoneMatch: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-if-none-match"),
    ),
    CopySourceIfUnmodifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-copy-source-if-unmodified-since")),
    CopySourceRange: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-range"),
    ),
    Key: S.String.pipe(T.HttpLabel("Key")),
    PartNumber: S.Number.pipe(T.HttpQuery("partNumber")),
    UploadId: S.String.pipe(T.HttpQuery("uploadId")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    CopySourceSSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader(
        "x-amz-copy-source-server-side-encryption-customer-algorithm",
      ),
    ),
    CopySourceSSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-copy-source-server-side-encryption-customer-key"),
    ),
    CopySourceSSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-server-side-encryption-customer-key-MD5"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    ExpectedSourceBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-source-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?x-id=UploadPartCopy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ DisableS3ExpressSessionAuth: { value: true } }),
    ),
  ),
).annotations({
  identifier: "UploadPartCopyRequest",
}) as any as S.Schema<UploadPartCopyRequest>;
export interface WriteGetObjectResponseRequest {
  RequestRoute: string;
  RequestToken: string;
  Body?: T.StreamingInputBody;
  StatusCode?: number;
  ErrorCode?: string;
  ErrorMessage?: string;
  AcceptRanges?: string;
  CacheControl?: string;
  ContentDisposition?: string;
  ContentEncoding?: string;
  ContentLanguage?: string;
  ContentLength?: number;
  ContentRange?: string;
  ContentType?: string;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  DeleteMarker?: boolean;
  ETag?: string;
  Expires?: string;
  Expiration?: string;
  LastModified?: Date;
  MissingMeta?: number;
  Metadata?: { [key: string]: string | undefined };
  ObjectLockMode?: ObjectLockMode;
  ObjectLockLegalHoldStatus?: ObjectLockLegalHoldStatus;
  ObjectLockRetainUntilDate?: Date;
  PartsCount?: number;
  ReplicationStatus?: ReplicationStatus;
  RequestCharged?: RequestCharged;
  Restore?: string;
  ServerSideEncryption?: ServerSideEncryption;
  SSECustomerAlgorithm?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  StorageClass?: StorageClass;
  TagCount?: number;
  VersionId?: string;
  BucketKeyEnabled?: boolean;
}
export const WriteGetObjectResponseRequest = S.suspend(() =>
  S.Struct({
    RequestRoute: S.String.pipe(
      T.HttpHeader("x-amz-request-route"),
      T.HostLabel(),
    ),
    RequestToken: S.String.pipe(T.HttpHeader("x-amz-request-token")),
    Body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    StatusCode: S.optional(S.Number).pipe(T.HttpHeader("x-amz-fwd-status")),
    ErrorCode: S.optional(S.String).pipe(T.HttpHeader("x-amz-fwd-error-code")),
    ErrorMessage: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-error-message"),
    ),
    AcceptRanges: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-accept-ranges"),
    ),
    CacheControl: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-Cache-Control"),
    ),
    ContentDisposition: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-Content-Disposition"),
    ),
    ContentEncoding: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-Content-Encoding"),
    ),
    ContentLanguage: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-Content-Language"),
    ),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ContentRange: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-Content-Range"),
    ),
    ContentType: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-Content-Type"),
    ),
    ChecksumCRC32: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-checksum-crc32"),
    ),
    ChecksumCRC32C: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-checksum-crc32c"),
    ),
    ChecksumCRC64NVME: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-checksum-crc64nvme"),
    ),
    ChecksumSHA1: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-checksum-sha1"),
    ),
    ChecksumSHA256: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-checksum-sha256"),
    ),
    DeleteMarker: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-delete-marker"),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("x-amz-fwd-header-ETag")),
    Expires: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-Expires"),
    ),
    Expiration: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-expiration"),
    ),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("x-amz-fwd-header-Last-Modified"),
    ),
    MissingMeta: S.optional(S.Number).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-missing-meta"),
    ),
    Metadata: S.optional(Metadata).pipe(T.HttpPrefixHeaders("x-amz-meta-")),
    ObjectLockMode: S.optional(ObjectLockMode).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-object-lock-mode"),
    ),
    ObjectLockLegalHoldStatus: S.optional(ObjectLockLegalHoldStatus).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-object-lock-legal-hold"),
    ),
    ObjectLockRetainUntilDate: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-object-lock-retain-until-date"),
    ),
    PartsCount: S.optional(S.Number).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-mp-parts-count"),
    ),
    ReplicationStatus: S.optional(ReplicationStatus).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-replication-status"),
    ),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-request-charged"),
    ),
    Restore: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-restore"),
    ),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-server-side-encryption"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader(
        "x-amz-fwd-header-x-amz-server-side-encryption-customer-algorithm",
      ),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader(
        "x-amz-fwd-header-x-amz-server-side-encryption-aws-kms-key-id",
      ),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader(
        "x-amz-fwd-header-x-amz-server-side-encryption-customer-key-MD5",
      ),
    ),
    StorageClass: S.optional(StorageClass).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-storage-class"),
    ),
    TagCount: S.optional(S.Number).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-tagging-count"),
    ),
    VersionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-fwd-header-x-amz-version-id"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader(
        "x-amz-fwd-header-x-amz-server-side-encryption-bucket-key-enabled",
      ),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/WriteGetObjectResponse" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseObjectLambdaEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "WriteGetObjectResponseRequest",
}) as any as S.Schema<WriteGetObjectResponseRequest>;
export interface WriteGetObjectResponseResponse {}
export const WriteGetObjectResponseResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "WriteGetObjectResponseResponse",
}) as any as S.Schema<WriteGetObjectResponseResponse>;
export type BucketLocationConstraint =
  | "af-south-1"
  | "ap-east-1"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "ap-northeast-3"
  | "ap-south-1"
  | "ap-south-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-southeast-3"
  | "ap-southeast-4"
  | "ap-southeast-5"
  | "ca-central-1"
  | "cn-north-1"
  | "cn-northwest-1"
  | "EU"
  | "eu-central-1"
  | "eu-central-2"
  | "eu-north-1"
  | "eu-south-1"
  | "eu-south-2"
  | "eu-west-1"
  | "eu-west-2"
  | "eu-west-3"
  | "il-central-1"
  | "me-central-1"
  | "me-south-1"
  | "sa-east-1"
  | "us-east-2"
  | "us-gov-east-1"
  | "us-gov-west-1"
  | "us-west-1"
  | "us-west-2"
  | (string & {});
export const BucketLocationConstraint = S.String;
export type BucketAbacStatus = "Enabled" | "Disabled" | (string & {});
export const BucketAbacStatus = S.String;
export type BucketAccelerateStatus = "Enabled" | "Suspended" | (string & {});
export const BucketAccelerateStatus = S.String;
export type IntelligentTieringStatus = "Enabled" | "Disabled" | (string & {});
export const IntelligentTieringStatus = S.String;
export type InventoryIncludedObjectVersions = "All" | "Current" | (string & {});
export const InventoryIncludedObjectVersions = S.String;
export type InventoryOptionalField =
  | "Size"
  | "LastModifiedDate"
  | "StorageClass"
  | "ETag"
  | "IsMultipartUploaded"
  | "ReplicationStatus"
  | "EncryptionStatus"
  | "ObjectLockRetainUntilDate"
  | "ObjectLockMode"
  | "ObjectLockLegalHoldStatus"
  | "IntelligentTieringAccessTier"
  | "BucketKeyStatus"
  | "ChecksumAlgorithm"
  | "ObjectAccessControlList"
  | "ObjectOwner"
  | "LifecycleExpirationDate"
  | (string & {});
export const InventoryOptionalField = S.String;
export type InventoryOptionalFields = InventoryOptionalField[];
export const InventoryOptionalFields = S.Array(
  InventoryOptionalField.pipe(T.XmlName("Field")),
);
export interface EventBridgeConfiguration {}
export const EventBridgeConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EventBridgeConfiguration",
}) as any as S.Schema<EventBridgeConfiguration>;
export type Payer = "Requester" | "BucketOwner" | (string & {});
export const Payer = S.String;
export type MFADelete = "Enabled" | "Disabled" | (string & {});
export const MFADelete = S.String;
export type BucketVersioningStatus = "Enabled" | "Suspended" | (string & {});
export const BucketVersioningStatus = S.String;
export type ObjectLockEnabled = "Enabled" | (string & {});
export const ObjectLockEnabled = S.String;
export type ObjectLockRetentionMode =
  | "GOVERNANCE"
  | "COMPLIANCE"
  | (string & {});
export const ObjectLockRetentionMode = S.String;
export type RestoreRequestType = "SELECT" | (string & {});
export const RestoreRequestType = S.String;
export type Tier = "Standard" | "Bulk" | "Expedited" | (string & {});
export const Tier = S.String;
export type CompressionType = "NONE" | "GZIP" | "BZIP2" | (string & {});
export const CompressionType = S.String;
export interface ParquetInput {}
export const ParquetInput = S.suspend(() => S.Struct({})).annotations({
  identifier: "ParquetInput",
}) as any as S.Schema<ParquetInput>;
export type InventoryConfigurationState =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const InventoryConfigurationState = S.String;
export type MFADeleteStatus = "Enabled" | "Disabled" | (string & {});
export const MFADeleteStatus = S.String;
export type LocationType = "AvailabilityZone" | "LocalZone" | (string & {});
export const LocationType = S.String;
export type ArchiveStatus =
  | "ARCHIVE_ACCESS"
  | "DEEP_ARCHIVE_ACCESS"
  | (string & {});
export const ArchiveStatus = S.String;
export interface AnalyticsAndOperator {
  Prefix?: string;
  Tags?: Tag[];
}
export const AnalyticsAndOperator = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tags: S.optional(TagSet).pipe(T.XmlName("Tag"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "AnalyticsAndOperator",
}) as any as S.Schema<AnalyticsAndOperator>;
export type AnalyticsFilter =
  | { Prefix: string; Tag?: never; And?: never }
  | { Prefix?: never; Tag: Tag; And?: never }
  | { Prefix?: never; Tag?: never; And: AnalyticsAndOperator };
export const AnalyticsFilter = S.Union(
  S.Struct({ Prefix: S.String }),
  S.Struct({ Tag: Tag }),
  S.Struct({ And: AnalyticsAndOperator }),
);
export type StorageClassAnalysisSchemaVersion = "V_1" | (string & {});
export const StorageClassAnalysisSchemaVersion = S.String;
export type AnalyticsS3ExportFileFormat = "CSV" | (string & {});
export const AnalyticsS3ExportFileFormat = S.String;
export interface AnalyticsS3BucketDestination {
  Format: AnalyticsS3ExportFileFormat;
  BucketAccountId?: string;
  Bucket: string;
  Prefix?: string;
}
export const AnalyticsS3BucketDestination = S.suspend(() =>
  S.Struct({
    Format: AnalyticsS3ExportFileFormat,
    BucketAccountId: S.optional(S.String),
    Bucket: S.String,
    Prefix: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyticsS3BucketDestination",
}) as any as S.Schema<AnalyticsS3BucketDestination>;
export interface AnalyticsExportDestination {
  S3BucketDestination: AnalyticsS3BucketDestination;
}
export const AnalyticsExportDestination = S.suspend(() =>
  S.Struct({ S3BucketDestination: AnalyticsS3BucketDestination }),
).annotations({
  identifier: "AnalyticsExportDestination",
}) as any as S.Schema<AnalyticsExportDestination>;
export interface StorageClassAnalysisDataExport {
  OutputSchemaVersion: StorageClassAnalysisSchemaVersion;
  Destination: AnalyticsExportDestination;
}
export const StorageClassAnalysisDataExport = S.suspend(() =>
  S.Struct({
    OutputSchemaVersion: StorageClassAnalysisSchemaVersion,
    Destination: AnalyticsExportDestination,
  }),
).annotations({
  identifier: "StorageClassAnalysisDataExport",
}) as any as S.Schema<StorageClassAnalysisDataExport>;
export interface StorageClassAnalysis {
  DataExport?: StorageClassAnalysisDataExport;
}
export const StorageClassAnalysis = S.suspend(() =>
  S.Struct({ DataExport: S.optional(StorageClassAnalysisDataExport) }),
).annotations({
  identifier: "StorageClassAnalysis",
}) as any as S.Schema<StorageClassAnalysis>;
export interface AnalyticsConfiguration {
  Id: string;
  Filter?: AnalyticsFilter;
  StorageClassAnalysis: StorageClassAnalysis;
}
export const AnalyticsConfiguration = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Filter: S.optional(AnalyticsFilter),
    StorageClassAnalysis: StorageClassAnalysis,
  }),
).annotations({
  identifier: "AnalyticsConfiguration",
}) as any as S.Schema<AnalyticsConfiguration>;
export type AnalyticsConfigurationList = AnalyticsConfiguration[];
export const AnalyticsConfigurationList = S.Array(AnalyticsConfiguration);
export interface IntelligentTieringAndOperator {
  Prefix?: string;
  Tags?: Tag[];
}
export const IntelligentTieringAndOperator = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tags: S.optional(TagSet).pipe(T.XmlName("Tag"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "IntelligentTieringAndOperator",
}) as any as S.Schema<IntelligentTieringAndOperator>;
export interface IntelligentTieringFilter {
  Prefix?: string;
  Tag?: Tag;
  And?: IntelligentTieringAndOperator;
}
export const IntelligentTieringFilter = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tag: S.optional(Tag),
    And: S.optional(IntelligentTieringAndOperator),
  }),
).annotations({
  identifier: "IntelligentTieringFilter",
}) as any as S.Schema<IntelligentTieringFilter>;
export type IntelligentTieringAccessTier =
  | "ARCHIVE_ACCESS"
  | "DEEP_ARCHIVE_ACCESS"
  | (string & {});
export const IntelligentTieringAccessTier = S.String;
export interface Tiering {
  Days: number;
  AccessTier: IntelligentTieringAccessTier;
}
export const Tiering = S.suspend(() =>
  S.Struct({ Days: S.Number, AccessTier: IntelligentTieringAccessTier }),
).annotations({ identifier: "Tiering" }) as any as S.Schema<Tiering>;
export type TieringList = Tiering[];
export const TieringList = S.Array(Tiering);
export interface IntelligentTieringConfiguration {
  Id: string;
  Filter?: IntelligentTieringFilter;
  Status: IntelligentTieringStatus;
  Tierings: Tiering[];
}
export const IntelligentTieringConfiguration = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Filter: S.optional(IntelligentTieringFilter),
    Status: IntelligentTieringStatus,
    Tierings: TieringList.pipe(T.XmlName("Tiering"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "IntelligentTieringConfiguration",
}) as any as S.Schema<IntelligentTieringConfiguration>;
export type IntelligentTieringConfigurationList =
  IntelligentTieringConfiguration[];
export const IntelligentTieringConfigurationList = S.Array(
  IntelligentTieringConfiguration,
);
export type InventoryFormat = "CSV" | "ORC" | "Parquet" | (string & {});
export const InventoryFormat = S.String;
export interface SSES3 {}
export const SSES3 = S.suspend(() =>
  S.Struct({}).pipe(T.XmlName("SSE-S3")),
).annotations({ identifier: "SSES3" }) as any as S.Schema<SSES3>;
export interface SSEKMS {
  KeyId: string | redacted.Redacted<string>;
}
export const SSEKMS = S.suspend(() =>
  S.Struct({ KeyId: SensitiveString }).pipe(T.XmlName("SSE-KMS")),
).annotations({ identifier: "SSEKMS" }) as any as S.Schema<SSEKMS>;
export interface InventoryEncryption {
  SSES3?: SSES3;
  SSEKMS?: SSEKMS;
}
export const InventoryEncryption = S.suspend(() =>
  S.Struct({
    SSES3: S.optional(SSES3)
      .pipe(T.XmlName("SSE-S3"))
      .annotations({ identifier: "SSES3" }),
    SSEKMS: S.optional(SSEKMS)
      .pipe(T.XmlName("SSE-KMS"))
      .annotations({ identifier: "SSEKMS" }),
  }),
).annotations({
  identifier: "InventoryEncryption",
}) as any as S.Schema<InventoryEncryption>;
export interface InventoryS3BucketDestination {
  AccountId?: string;
  Bucket: string;
  Format: InventoryFormat;
  Prefix?: string;
  Encryption?: InventoryEncryption;
}
export const InventoryS3BucketDestination = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    Bucket: S.String,
    Format: InventoryFormat,
    Prefix: S.optional(S.String),
    Encryption: S.optional(InventoryEncryption),
  }),
).annotations({
  identifier: "InventoryS3BucketDestination",
}) as any as S.Schema<InventoryS3BucketDestination>;
export interface InventoryDestination {
  S3BucketDestination: InventoryS3BucketDestination;
}
export const InventoryDestination = S.suspend(() =>
  S.Struct({ S3BucketDestination: InventoryS3BucketDestination }),
).annotations({
  identifier: "InventoryDestination",
}) as any as S.Schema<InventoryDestination>;
export interface InventoryFilter {
  Prefix: string;
}
export const InventoryFilter = S.suspend(() =>
  S.Struct({ Prefix: S.String }),
).annotations({
  identifier: "InventoryFilter",
}) as any as S.Schema<InventoryFilter>;
export type InventoryFrequency = "Daily" | "Weekly" | (string & {});
export const InventoryFrequency = S.String;
export interface InventorySchedule {
  Frequency: InventoryFrequency;
}
export const InventorySchedule = S.suspend(() =>
  S.Struct({ Frequency: InventoryFrequency }),
).annotations({
  identifier: "InventorySchedule",
}) as any as S.Schema<InventorySchedule>;
export interface InventoryConfiguration {
  Destination: InventoryDestination;
  IsEnabled: boolean;
  Filter?: InventoryFilter;
  Id: string;
  IncludedObjectVersions: InventoryIncludedObjectVersions;
  OptionalFields?: InventoryOptionalField[];
  Schedule: InventorySchedule;
}
export const InventoryConfiguration = S.suspend(() =>
  S.Struct({
    Destination: InventoryDestination,
    IsEnabled: S.Boolean,
    Filter: S.optional(InventoryFilter),
    Id: S.String,
    IncludedObjectVersions: InventoryIncludedObjectVersions,
    OptionalFields: S.optional(InventoryOptionalFields),
    Schedule: InventorySchedule,
  }),
).annotations({
  identifier: "InventoryConfiguration",
}) as any as S.Schema<InventoryConfiguration>;
export type InventoryConfigurationList = InventoryConfiguration[];
export const InventoryConfigurationList = S.Array(InventoryConfiguration);
export interface MetricsAndOperator {
  Prefix?: string;
  Tags?: Tag[];
  AccessPointArn?: string;
}
export const MetricsAndOperator = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tags: S.optional(TagSet).pipe(T.XmlName("Tag"), T.XmlFlattened()),
    AccessPointArn: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricsAndOperator",
}) as any as S.Schema<MetricsAndOperator>;
export type MetricsFilter =
  | { Prefix: string; Tag?: never; AccessPointArn?: never; And?: never }
  | { Prefix?: never; Tag: Tag; AccessPointArn?: never; And?: never }
  | { Prefix?: never; Tag?: never; AccessPointArn: string; And?: never }
  | {
      Prefix?: never;
      Tag?: never;
      AccessPointArn?: never;
      And: MetricsAndOperator;
    };
export const MetricsFilter = S.Union(
  S.Struct({ Prefix: S.String }),
  S.Struct({ Tag: Tag }),
  S.Struct({ AccessPointArn: S.String }),
  S.Struct({ And: MetricsAndOperator }),
);
export interface MetricsConfiguration {
  Id: string;
  Filter?: MetricsFilter;
}
export const MetricsConfiguration = S.suspend(() =>
  S.Struct({ Id: S.String, Filter: S.optional(MetricsFilter) }),
).annotations({
  identifier: "MetricsConfiguration",
}) as any as S.Schema<MetricsConfiguration>;
export type MetricsConfigurationList = MetricsConfiguration[];
export const MetricsConfigurationList = S.Array(MetricsConfiguration);
export interface AbacStatus {
  Status?: BucketAbacStatus;
}
export const AbacStatus = S.suspend(() =>
  S.Struct({ Status: S.optional(BucketAbacStatus) }),
).annotations({ identifier: "AbacStatus" }) as any as S.Schema<AbacStatus>;
export interface AccelerateConfiguration {
  Status?: BucketAccelerateStatus;
}
export const AccelerateConfiguration = S.suspend(() =>
  S.Struct({ Status: S.optional(BucketAccelerateStatus) }),
).annotations({
  identifier: "AccelerateConfiguration",
}) as any as S.Schema<AccelerateConfiguration>;
export interface RequestPaymentConfiguration {
  Payer: Payer;
}
export const RequestPaymentConfiguration = S.suspend(() =>
  S.Struct({ Payer: Payer }),
).annotations({
  identifier: "RequestPaymentConfiguration",
}) as any as S.Schema<RequestPaymentConfiguration>;
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
export interface ObjectLockLegalHold {
  Status?: ObjectLockLegalHoldStatus;
}
export const ObjectLockLegalHold = S.suspend(() =>
  S.Struct({ Status: S.optional(ObjectLockLegalHoldStatus) }),
).annotations({
  identifier: "ObjectLockLegalHold",
}) as any as S.Schema<ObjectLockLegalHold>;
export interface ObjectLockRetention {
  Mode?: ObjectLockRetentionMode;
  RetainUntilDate?: Date;
}
export const ObjectLockRetention = S.suspend(() =>
  S.Struct({
    Mode: S.optional(ObjectLockRetentionMode),
    RetainUntilDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ObjectLockRetention",
}) as any as S.Schema<ObjectLockRetention>;
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
export interface RequestProgress {
  Enabled?: boolean;
}
export const RequestProgress = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "RequestProgress",
}) as any as S.Schema<RequestProgress>;
export interface ScanRange {
  Start?: number;
  End?: number;
}
export const ScanRange = S.suspend(() =>
  S.Struct({ Start: S.optional(S.Number), End: S.optional(S.Number) }),
).annotations({ identifier: "ScanRange" }) as any as S.Schema<ScanRange>;
export type DataRedundancy =
  | "SingleAvailabilityZone"
  | "SingleLocalZone"
  | (string & {});
export const DataRedundancy = S.String;
export type BucketType = "Directory" | (string & {});
export const BucketType = S.String;
export type AllowedHeaders = string[];
export const AllowedHeaders = S.Array(S.String);
export type AllowedMethods = string[];
export const AllowedMethods = S.Array(S.String);
export type AllowedOrigins = string[];
export const AllowedOrigins = S.Array(S.String);
export type ExposeHeaders = string[];
export const ExposeHeaders = S.Array(S.String);
export type ExpirationStatus = "Enabled" | "Disabled" | (string & {});
export const ExpirationStatus = S.String;
export type Event =
  | "s3:ReducedRedundancyLostObject"
  | "s3:ObjectCreated:*"
  | "s3:ObjectCreated:Put"
  | "s3:ObjectCreated:Post"
  | "s3:ObjectCreated:Copy"
  | "s3:ObjectCreated:CompleteMultipartUpload"
  | "s3:ObjectRemoved:*"
  | "s3:ObjectRemoved:Delete"
  | "s3:ObjectRemoved:DeleteMarkerCreated"
  | "s3:ObjectRestore:*"
  | "s3:ObjectRestore:Post"
  | "s3:ObjectRestore:Completed"
  | "s3:Replication:*"
  | "s3:Replication:OperationFailedReplication"
  | "s3:Replication:OperationNotTracked"
  | "s3:Replication:OperationMissedThreshold"
  | "s3:Replication:OperationReplicatedAfterThreshold"
  | "s3:ObjectRestore:Delete"
  | "s3:LifecycleTransition"
  | "s3:IntelligentTiering"
  | "s3:ObjectAcl:Put"
  | "s3:LifecycleExpiration:*"
  | "s3:LifecycleExpiration:Delete"
  | "s3:LifecycleExpiration:DeleteMarkerCreated"
  | "s3:ObjectTagging:*"
  | "s3:ObjectTagging:Put"
  | "s3:ObjectTagging:Delete"
  | (string & {});
export const Event = S.String;
export type EventList = Event[];
export const EventList = S.Array(Event);
export type ReplicationRuleStatus = "Enabled" | "Disabled" | (string & {});
export const ReplicationRuleStatus = S.String;
export type Protocol = "http" | "https" | (string & {});
export const Protocol = S.String;
export type FileHeaderInfo = "USE" | "IGNORE" | "NONE" | (string & {});
export const FileHeaderInfo = S.String;
export type JSONType = "DOCUMENT" | "LINES" | (string & {});
export const JSONType = S.String;
export type QuoteFields = "ALWAYS" | "ASNEEDED" | (string & {});
export const QuoteFields = S.String;
export type TableSseAlgorithm = "aws:kms" | "AES256" | (string & {});
export const TableSseAlgorithm = S.String;
export type ExpirationState = "ENABLED" | "DISABLED" | (string & {});
export const ExpirationState = S.String;
export interface AbortMultipartUploadOutput {
  RequestCharged?: RequestCharged;
}
export const AbortMultipartUploadOutput = S.suspend(() =>
  S.Struct({
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "AbortMultipartUploadOutput",
}) as any as S.Schema<AbortMultipartUploadOutput>;
export interface CopyObjectRequest {
  ACL?: ObjectCannedACL;
  Bucket: string;
  CacheControl?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ContentDisposition?: string;
  ContentEncoding?: string;
  ContentLanguage?: string;
  ContentType?: string;
  CopySource: string;
  CopySourceIfMatch?: string;
  CopySourceIfModifiedSince?: Date;
  CopySourceIfNoneMatch?: string;
  CopySourceIfUnmodifiedSince?: Date;
  Expires?: string;
  GrantFullControl?: string;
  GrantRead?: string;
  GrantReadACP?: string;
  GrantWriteACP?: string;
  IfMatch?: string;
  IfNoneMatch?: string;
  Key: string;
  Metadata?: { [key: string]: string | undefined };
  MetadataDirective?: MetadataDirective;
  TaggingDirective?: TaggingDirective;
  ServerSideEncryption?: ServerSideEncryption;
  StorageClass?: StorageClass;
  WebsiteRedirectLocation?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSEKMSEncryptionContext?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  CopySourceSSECustomerAlgorithm?: string;
  CopySourceSSECustomerKey?: string | redacted.Redacted<string>;
  CopySourceSSECustomerKeyMD5?: string;
  RequestPayer?: RequestPayer;
  Tagging?: string;
  ObjectLockMode?: ObjectLockMode;
  ObjectLockRetainUntilDate?: Date;
  ObjectLockLegalHoldStatus?: ObjectLockLegalHoldStatus;
  ExpectedBucketOwner?: string;
  ExpectedSourceBucketOwner?: string;
}
export const CopyObjectRequest = S.suspend(() =>
  S.Struct({
    ACL: S.optional(ObjectCannedACL).pipe(T.HttpHeader("x-amz-acl")),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-checksum-algorithm"),
    ),
    ContentDisposition: S.optional(S.String).pipe(
      T.HttpHeader("Content-Disposition"),
    ),
    ContentEncoding: S.optional(S.String).pipe(
      T.HttpHeader("Content-Encoding"),
    ),
    ContentLanguage: S.optional(S.String).pipe(
      T.HttpHeader("Content-Language"),
    ),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CopySource: S.String.pipe(
      T.HttpHeader("x-amz-copy-source"),
      T.ContextParam("CopySource"),
    ),
    CopySourceIfMatch: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-if-match"),
    ),
    CopySourceIfModifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-copy-source-if-modified-since")),
    CopySourceIfNoneMatch: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-if-none-match"),
    ),
    CopySourceIfUnmodifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-copy-source-if-unmodified-since")),
    Expires: S.optional(S.String).pipe(T.HttpHeader("Expires")),
    GrantFullControl: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-full-control"),
    ),
    GrantRead: S.optional(S.String).pipe(T.HttpHeader("x-amz-grant-read")),
    GrantReadACP: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-read-acp"),
    ),
    GrantWriteACP: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-grant-write-acp"),
    ),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    IfNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    Metadata: S.optional(Metadata).pipe(T.HttpPrefixHeaders("x-amz-meta-")),
    MetadataDirective: S.optional(MetadataDirective).pipe(
      T.HttpHeader("x-amz-metadata-directive"),
    ),
    TaggingDirective: S.optional(TaggingDirective).pipe(
      T.HttpHeader("x-amz-tagging-directive"),
    ),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    StorageClass: S.optional(StorageClass).pipe(
      T.HttpHeader("x-amz-storage-class"),
    ),
    WebsiteRedirectLocation: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-website-redirect-location"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    SSEKMSEncryptionContext: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-context"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    CopySourceSSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader(
        "x-amz-copy-source-server-side-encryption-customer-algorithm",
      ),
    ),
    CopySourceSSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-copy-source-server-side-encryption-customer-key"),
    ),
    CopySourceSSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-server-side-encryption-customer-key-MD5"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    Tagging: S.optional(S.String).pipe(T.HttpHeader("x-amz-tagging")),
    ObjectLockMode: S.optional(ObjectLockMode).pipe(
      T.HttpHeader("x-amz-object-lock-mode"),
    ),
    ObjectLockRetainUntilDate: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-object-lock-retain-until-date")),
    ObjectLockLegalHoldStatus: S.optional(ObjectLockLegalHoldStatus).pipe(
      T.HttpHeader("x-amz-object-lock-legal-hold"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    ExpectedSourceBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-source-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?x-id=CopyObject" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ DisableS3ExpressSessionAuth: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CopyObjectRequest",
}) as any as S.Schema<CopyObjectRequest>;
export interface CreateMultipartUploadOutput {
  AbortDate?: Date;
  AbortRuleId?: string;
  Bucket?: string;
  Key?: string;
  UploadId?: string;
  ServerSideEncryption?: ServerSideEncryption;
  SSECustomerAlgorithm?: string;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSEKMSEncryptionContext?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  RequestCharged?: RequestCharged;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ChecksumType?: ChecksumType;
}
export const CreateMultipartUploadOutput = S.suspend(() =>
  S.Struct({
    AbortDate: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("x-amz-abort-date"),
    ),
    AbortRuleId: S.optional(S.String).pipe(T.HttpHeader("x-amz-abort-rule-id")),
    Bucket: S.optional(S.String).pipe(T.XmlName("Bucket")),
    Key: S.optional(S.String),
    UploadId: S.optional(S.String),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    SSEKMSEncryptionContext: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-context"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-checksum-algorithm"),
    ),
    ChecksumType: S.optional(ChecksumType).pipe(
      T.HttpHeader("x-amz-checksum-type"),
    ),
  }).pipe(T.all(T.XmlName("InitiateMultipartUploadResult"), ns)),
).annotations({
  identifier: "CreateMultipartUploadOutput",
}) as any as S.Schema<CreateMultipartUploadOutput>;
export interface DeleteObjectOutput {
  DeleteMarker?: boolean;
  VersionId?: string;
  RequestCharged?: RequestCharged;
}
export const DeleteObjectOutput = S.suspend(() =>
  S.Struct({
    DeleteMarker: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-delete-marker"),
    ),
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DeleteObjectOutput",
}) as any as S.Schema<DeleteObjectOutput>;
export interface DeleteObjectTaggingOutput {
  VersionId?: string;
}
export const DeleteObjectTaggingOutput = S.suspend(() =>
  S.Struct({
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
  }).pipe(ns),
).annotations({
  identifier: "DeleteObjectTaggingOutput",
}) as any as S.Schema<DeleteObjectTaggingOutput>;
export interface GetBucketAbacOutput {
  AbacStatus?: AbacStatus;
}
export const GetBucketAbacOutput = S.suspend(() =>
  S.Struct({
    AbacStatus: S.optional(AbacStatus)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "AbacStatus" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketAbacOutput",
}) as any as S.Schema<GetBucketAbacOutput>;
export interface GetBucketAccelerateConfigurationOutput {
  Status?: BucketAccelerateStatus;
  RequestCharged?: RequestCharged;
}
export const GetBucketAccelerateConfigurationOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(BucketAccelerateStatus),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(T.all(T.XmlName("AccelerateConfiguration"), ns)),
).annotations({
  identifier: "GetBucketAccelerateConfigurationOutput",
}) as any as S.Schema<GetBucketAccelerateConfigurationOutput>;
export interface GetBucketAclOutput {
  Owner?: Owner;
  Grants?: Grant[];
}
export const GetBucketAclOutput = S.suspend(() =>
  S.Struct({
    Owner: S.optional(Owner),
    Grants: S.optional(Grants).pipe(T.XmlName("AccessControlList")),
  }).pipe(T.all(T.XmlName("AccessControlPolicy"), ns)),
).annotations({
  identifier: "GetBucketAclOutput",
}) as any as S.Schema<GetBucketAclOutput>;
export interface GetBucketAnalyticsConfigurationOutput {
  AnalyticsConfiguration?: AnalyticsConfiguration;
}
export const GetBucketAnalyticsConfigurationOutput = S.suspend(() =>
  S.Struct({
    AnalyticsConfiguration: S.optional(AnalyticsConfiguration)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "AnalyticsConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketAnalyticsConfigurationOutput",
}) as any as S.Schema<GetBucketAnalyticsConfigurationOutput>;
export interface CORSRule {
  ID?: string;
  AllowedHeaders?: string[];
  AllowedMethods: string[];
  AllowedOrigins: string[];
  ExposeHeaders?: string[];
  MaxAgeSeconds?: number;
}
export const CORSRule = S.suspend(() =>
  S.Struct({
    ID: S.optional(S.String),
    AllowedHeaders: S.optional(AllowedHeaders).pipe(
      T.XmlName("AllowedHeader"),
      T.XmlFlattened(),
    ),
    AllowedMethods: AllowedMethods.pipe(
      T.XmlName("AllowedMethod"),
      T.XmlFlattened(),
    ),
    AllowedOrigins: AllowedOrigins.pipe(
      T.XmlName("AllowedOrigin"),
      T.XmlFlattened(),
    ),
    ExposeHeaders: S.optional(ExposeHeaders).pipe(
      T.XmlName("ExposeHeader"),
      T.XmlFlattened(),
    ),
    MaxAgeSeconds: S.optional(S.Number),
  }),
).annotations({ identifier: "CORSRule" }) as any as S.Schema<CORSRule>;
export type CORSRules = CORSRule[];
export const CORSRules = S.Array(CORSRule);
export interface GetBucketCorsOutput {
  CORSRules?: CORSRule[];
}
export const GetBucketCorsOutput = S.suspend(() =>
  S.Struct({
    CORSRules: S.optional(CORSRules).pipe(
      T.XmlName("CORSRule"),
      T.XmlFlattened(),
    ),
  }).pipe(T.all(T.XmlName("CORSConfiguration"), ns)),
).annotations({
  identifier: "GetBucketCorsOutput",
}) as any as S.Schema<GetBucketCorsOutput>;
export interface ServerSideEncryptionByDefault {
  SSEAlgorithm: ServerSideEncryption;
  KMSMasterKeyID?: string | redacted.Redacted<string>;
}
export const ServerSideEncryptionByDefault = S.suspend(() =>
  S.Struct({
    SSEAlgorithm: ServerSideEncryption,
    KMSMasterKeyID: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ServerSideEncryptionByDefault",
}) as any as S.Schema<ServerSideEncryptionByDefault>;
export type EncryptionType = "NONE" | "SSE-C" | (string & {});
export const EncryptionType = S.String;
export type EncryptionTypeList = EncryptionType[];
export const EncryptionTypeList = S.Array(
  EncryptionType.pipe(T.XmlName("EncryptionType")),
);
export interface BlockedEncryptionTypes {
  EncryptionType?: EncryptionType[];
}
export const BlockedEncryptionTypes = S.suspend(() =>
  S.Struct({
    EncryptionType: S.optional(EncryptionTypeList).pipe(T.XmlFlattened()),
  }),
).annotations({
  identifier: "BlockedEncryptionTypes",
}) as any as S.Schema<BlockedEncryptionTypes>;
export interface ServerSideEncryptionRule {
  ApplyServerSideEncryptionByDefault?: ServerSideEncryptionByDefault;
  BucketKeyEnabled?: boolean;
  BlockedEncryptionTypes?: BlockedEncryptionTypes;
}
export const ServerSideEncryptionRule = S.suspend(() =>
  S.Struct({
    ApplyServerSideEncryptionByDefault: S.optional(
      ServerSideEncryptionByDefault,
    ),
    BucketKeyEnabled: S.optional(S.Boolean),
    BlockedEncryptionTypes: S.optional(BlockedEncryptionTypes),
  }),
).annotations({
  identifier: "ServerSideEncryptionRule",
}) as any as S.Schema<ServerSideEncryptionRule>;
export type ServerSideEncryptionRules = ServerSideEncryptionRule[];
export const ServerSideEncryptionRules = S.Array(ServerSideEncryptionRule);
export interface ServerSideEncryptionConfiguration {
  Rules: ServerSideEncryptionRule[];
}
export const ServerSideEncryptionConfiguration = S.suspend(() =>
  S.Struct({
    Rules: ServerSideEncryptionRules.pipe(T.XmlName("Rule"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "ServerSideEncryptionConfiguration",
}) as any as S.Schema<ServerSideEncryptionConfiguration>;
export interface GetBucketEncryptionOutput {
  ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
}
export const GetBucketEncryptionOutput = S.suspend(() =>
  S.Struct({
    ServerSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ServerSideEncryptionConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketEncryptionOutput",
}) as any as S.Schema<GetBucketEncryptionOutput>;
export interface GetBucketIntelligentTieringConfigurationOutput {
  IntelligentTieringConfiguration?: IntelligentTieringConfiguration;
}
export const GetBucketIntelligentTieringConfigurationOutput = S.suspend(() =>
  S.Struct({
    IntelligentTieringConfiguration: S.optional(IntelligentTieringConfiguration)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "IntelligentTieringConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketIntelligentTieringConfigurationOutput",
}) as any as S.Schema<GetBucketIntelligentTieringConfigurationOutput>;
export interface GetBucketInventoryConfigurationOutput {
  InventoryConfiguration?: InventoryConfiguration;
}
export const GetBucketInventoryConfigurationOutput = S.suspend(() =>
  S.Struct({
    InventoryConfiguration: S.optional(InventoryConfiguration)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "InventoryConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketInventoryConfigurationOutput",
}) as any as S.Schema<GetBucketInventoryConfigurationOutput>;
export interface LifecycleExpiration {
  Date?: Date;
  Days?: number;
  ExpiredObjectDeleteMarker?: boolean;
}
export const LifecycleExpiration = S.suspend(() =>
  S.Struct({
    Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Days: S.optional(S.Number),
    ExpiredObjectDeleteMarker: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LifecycleExpiration",
}) as any as S.Schema<LifecycleExpiration>;
export interface LifecycleRuleAndOperator {
  Prefix?: string;
  Tags?: Tag[];
  ObjectSizeGreaterThan?: number;
  ObjectSizeLessThan?: number;
}
export const LifecycleRuleAndOperator = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tags: S.optional(TagSet).pipe(T.XmlName("Tag"), T.XmlFlattened()),
    ObjectSizeGreaterThan: S.optional(S.Number),
    ObjectSizeLessThan: S.optional(S.Number),
  }),
).annotations({
  identifier: "LifecycleRuleAndOperator",
}) as any as S.Schema<LifecycleRuleAndOperator>;
export interface LifecycleRuleFilter {
  Prefix?: string;
  Tag?: Tag;
  ObjectSizeGreaterThan?: number;
  ObjectSizeLessThan?: number;
  And?: LifecycleRuleAndOperator;
}
export const LifecycleRuleFilter = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tag: S.optional(Tag),
    ObjectSizeGreaterThan: S.optional(S.Number),
    ObjectSizeLessThan: S.optional(S.Number),
    And: S.optional(LifecycleRuleAndOperator),
  }),
).annotations({
  identifier: "LifecycleRuleFilter",
}) as any as S.Schema<LifecycleRuleFilter>;
export type TransitionStorageClass =
  | "GLACIER"
  | "STANDARD_IA"
  | "ONEZONE_IA"
  | "INTELLIGENT_TIERING"
  | "DEEP_ARCHIVE"
  | "GLACIER_IR"
  | (string & {});
export const TransitionStorageClass = S.String;
export interface Transition {
  Date?: Date;
  Days?: number;
  StorageClass?: TransitionStorageClass;
}
export const Transition = S.suspend(() =>
  S.Struct({
    Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Days: S.optional(S.Number),
    StorageClass: S.optional(TransitionStorageClass),
  }),
).annotations({ identifier: "Transition" }) as any as S.Schema<Transition>;
export type TransitionList = Transition[];
export const TransitionList = S.Array(Transition);
export interface NoncurrentVersionTransition {
  NoncurrentDays?: number;
  StorageClass?: TransitionStorageClass;
  NewerNoncurrentVersions?: number;
}
export const NoncurrentVersionTransition = S.suspend(() =>
  S.Struct({
    NoncurrentDays: S.optional(S.Number),
    StorageClass: S.optional(TransitionStorageClass),
    NewerNoncurrentVersions: S.optional(S.Number),
  }),
).annotations({
  identifier: "NoncurrentVersionTransition",
}) as any as S.Schema<NoncurrentVersionTransition>;
export type NoncurrentVersionTransitionList = NoncurrentVersionTransition[];
export const NoncurrentVersionTransitionList = S.Array(
  NoncurrentVersionTransition,
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
  Prefix?: string;
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
    Prefix: S.optional(S.String),
    Filter: S.optional(LifecycleRuleFilter),
    Status: ExpirationStatus,
    Transitions: S.optional(TransitionList).pipe(
      T.XmlName("Transition"),
      T.XmlFlattened(),
    ),
    NoncurrentVersionTransitions: S.optional(
      NoncurrentVersionTransitionList,
    ).pipe(T.XmlName("NoncurrentVersionTransition"), T.XmlFlattened()),
    NoncurrentVersionExpiration: S.optional(NoncurrentVersionExpiration),
    AbortIncompleteMultipartUpload: S.optional(AbortIncompleteMultipartUpload),
  }),
).annotations({
  identifier: "LifecycleRule",
}) as any as S.Schema<LifecycleRule>;
export type LifecycleRules = LifecycleRule[];
export const LifecycleRules = S.Array(LifecycleRule);
export interface GetBucketLifecycleConfigurationOutput {
  Rules?: LifecycleRule[];
  TransitionDefaultMinimumObjectSize?: TransitionDefaultMinimumObjectSize;
}
export const GetBucketLifecycleConfigurationOutput = S.suspend(() =>
  S.Struct({
    Rules: S.optional(LifecycleRules).pipe(T.XmlName("Rule"), T.XmlFlattened()),
    TransitionDefaultMinimumObjectSize: S.optional(
      TransitionDefaultMinimumObjectSize,
    ).pipe(T.HttpHeader("x-amz-transition-default-minimum-object-size")),
  }).pipe(T.all(T.XmlName("LifecycleConfiguration"), ns)),
).annotations({
  identifier: "GetBucketLifecycleConfigurationOutput",
}) as any as S.Schema<GetBucketLifecycleConfigurationOutput>;
export interface GetBucketLocationOutput {
  LocationConstraint?: BucketLocationConstraint;
}
export const GetBucketLocationOutput = S.suspend(() =>
  S.Struct({ LocationConstraint: S.optional(BucketLocationConstraint) }).pipe(
    T.all(T.XmlName("LocationConstraint"), ns, T.S3UnwrappedXmlOutput()),
  ),
).annotations({
  identifier: "GetBucketLocationOutput",
}) as any as S.Schema<GetBucketLocationOutput>;
export type BucketLogsPermission =
  | "FULL_CONTROL"
  | "READ"
  | "WRITE"
  | (string & {});
export const BucketLogsPermission = S.String;
export interface TargetGrant {
  Grantee?: Grantee;
  Permission?: BucketLogsPermission;
}
export const TargetGrant = S.suspend(() =>
  S.Struct({
    Grantee: S.optional(Grantee),
    Permission: S.optional(BucketLogsPermission),
  }),
).annotations({ identifier: "TargetGrant" }) as any as S.Schema<TargetGrant>;
export type TargetGrants = TargetGrant[];
export const TargetGrants = S.Array(
  TargetGrant.pipe(T.XmlName("Grant")).annotations({
    identifier: "TargetGrant",
  }),
);
export interface SimplePrefix {}
export const SimplePrefix = S.suspend(() =>
  S.Struct({}).pipe(T.XmlName("SimplePrefix")),
).annotations({ identifier: "SimplePrefix" }) as any as S.Schema<SimplePrefix>;
export type PartitionDateSource = "EventTime" | "DeliveryTime" | (string & {});
export const PartitionDateSource = S.String;
export interface PartitionedPrefix {
  PartitionDateSource?: PartitionDateSource;
}
export const PartitionedPrefix = S.suspend(() =>
  S.Struct({ PartitionDateSource: S.optional(PartitionDateSource) }).pipe(
    T.XmlName("PartitionedPrefix"),
  ),
).annotations({
  identifier: "PartitionedPrefix",
}) as any as S.Schema<PartitionedPrefix>;
export interface TargetObjectKeyFormat {
  SimplePrefix?: SimplePrefix;
  PartitionedPrefix?: PartitionedPrefix;
}
export const TargetObjectKeyFormat = S.suspend(() =>
  S.Struct({
    SimplePrefix: S.optional(SimplePrefix)
      .pipe(T.XmlName("SimplePrefix"))
      .annotations({ identifier: "SimplePrefix" }),
    PartitionedPrefix: S.optional(PartitionedPrefix)
      .pipe(T.XmlName("PartitionedPrefix"))
      .annotations({ identifier: "PartitionedPrefix" }),
  }),
).annotations({
  identifier: "TargetObjectKeyFormat",
}) as any as S.Schema<TargetObjectKeyFormat>;
export interface LoggingEnabled {
  TargetBucket: string;
  TargetGrants?: TargetGrant[];
  TargetPrefix: string;
  TargetObjectKeyFormat?: TargetObjectKeyFormat;
}
export const LoggingEnabled = S.suspend(() =>
  S.Struct({
    TargetBucket: S.String,
    TargetGrants: S.optional(TargetGrants),
    TargetPrefix: S.String,
    TargetObjectKeyFormat: S.optional(TargetObjectKeyFormat),
  }),
).annotations({
  identifier: "LoggingEnabled",
}) as any as S.Schema<LoggingEnabled>;
export interface GetBucketLoggingOutput {
  LoggingEnabled?: LoggingEnabled;
}
export const GetBucketLoggingOutput = S.suspend(() =>
  S.Struct({ LoggingEnabled: S.optional(LoggingEnabled) }).pipe(
    T.all(T.XmlName("BucketLoggingStatus"), ns),
  ),
).annotations({
  identifier: "GetBucketLoggingOutput",
}) as any as S.Schema<GetBucketLoggingOutput>;
export interface GetBucketMetricsConfigurationOutput {
  MetricsConfiguration?: MetricsConfiguration;
}
export const GetBucketMetricsConfigurationOutput = S.suspend(() =>
  S.Struct({
    MetricsConfiguration: S.optional(MetricsConfiguration)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MetricsConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketMetricsConfigurationOutput",
}) as any as S.Schema<GetBucketMetricsConfigurationOutput>;
export interface OwnershipControlsRule {
  ObjectOwnership: ObjectOwnership;
}
export const OwnershipControlsRule = S.suspend(() =>
  S.Struct({ ObjectOwnership: ObjectOwnership }),
).annotations({
  identifier: "OwnershipControlsRule",
}) as any as S.Schema<OwnershipControlsRule>;
export type OwnershipControlsRules = OwnershipControlsRule[];
export const OwnershipControlsRules = S.Array(OwnershipControlsRule);
export interface OwnershipControls {
  Rules: OwnershipControlsRule[];
}
export const OwnershipControls = S.suspend(() =>
  S.Struct({
    Rules: OwnershipControlsRules.pipe(T.XmlName("Rule"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "OwnershipControls",
}) as any as S.Schema<OwnershipControls>;
export interface GetBucketOwnershipControlsOutput {
  OwnershipControls?: OwnershipControls;
}
export const GetBucketOwnershipControlsOutput = S.suspend(() =>
  S.Struct({
    OwnershipControls: S.optional(OwnershipControls)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "OwnershipControls" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketOwnershipControlsOutput",
}) as any as S.Schema<GetBucketOwnershipControlsOutput>;
export interface GetBucketPolicyOutput {
  Policy?: string;
}
export const GetBucketPolicyOutput = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String).pipe(T.HttpPayload()) }).pipe(ns),
).annotations({
  identifier: "GetBucketPolicyOutput",
}) as any as S.Schema<GetBucketPolicyOutput>;
export interface ReplicationRuleAndOperator {
  Prefix?: string;
  Tags?: Tag[];
}
export const ReplicationRuleAndOperator = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tags: S.optional(TagSet).pipe(T.XmlName("Tag"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "ReplicationRuleAndOperator",
}) as any as S.Schema<ReplicationRuleAndOperator>;
export interface ReplicationRuleFilter {
  Prefix?: string;
  Tag?: Tag;
  And?: ReplicationRuleAndOperator;
}
export const ReplicationRuleFilter = S.suspend(() =>
  S.Struct({
    Prefix: S.optional(S.String),
    Tag: S.optional(Tag),
    And: S.optional(ReplicationRuleAndOperator),
  }),
).annotations({
  identifier: "ReplicationRuleFilter",
}) as any as S.Schema<ReplicationRuleFilter>;
export type SseKmsEncryptedObjectsStatus =
  | "Enabled"
  | "Disabled"
  | (string & {});
export const SseKmsEncryptedObjectsStatus = S.String;
export interface SseKmsEncryptedObjects {
  Status: SseKmsEncryptedObjectsStatus;
}
export const SseKmsEncryptedObjects = S.suspend(() =>
  S.Struct({ Status: SseKmsEncryptedObjectsStatus }),
).annotations({
  identifier: "SseKmsEncryptedObjects",
}) as any as S.Schema<SseKmsEncryptedObjects>;
export type ReplicaModificationsStatus = "Enabled" | "Disabled" | (string & {});
export const ReplicaModificationsStatus = S.String;
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
export type ExistingObjectReplicationStatus =
  | "Enabled"
  | "Disabled"
  | (string & {});
export const ExistingObjectReplicationStatus = S.String;
export interface ExistingObjectReplication {
  Status: ExistingObjectReplicationStatus;
}
export const ExistingObjectReplication = S.suspend(() =>
  S.Struct({ Status: ExistingObjectReplicationStatus }),
).annotations({
  identifier: "ExistingObjectReplication",
}) as any as S.Schema<ExistingObjectReplication>;
export type OwnerOverride = "Destination" | (string & {});
export const OwnerOverride = S.String;
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
export type ReplicationTimeStatus = "Enabled" | "Disabled" | (string & {});
export const ReplicationTimeStatus = S.String;
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
export type MetricsStatus = "Enabled" | "Disabled" | (string & {});
export const MetricsStatus = S.String;
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
export interface Destination {
  Bucket: string;
  Account?: string;
  StorageClass?: StorageClass;
  AccessControlTranslation?: AccessControlTranslation;
  EncryptionConfiguration?: EncryptionConfiguration;
  ReplicationTime?: ReplicationTime;
  Metrics?: Metrics;
}
export const Destination = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    Account: S.optional(S.String),
    StorageClass: S.optional(StorageClass),
    AccessControlTranslation: S.optional(AccessControlTranslation),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    ReplicationTime: S.optional(ReplicationTime),
    Metrics: S.optional(Metrics),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export type DeleteMarkerReplicationStatus =
  | "Enabled"
  | "Disabled"
  | (string & {});
export const DeleteMarkerReplicationStatus = S.String;
export interface DeleteMarkerReplication {
  Status?: DeleteMarkerReplicationStatus;
}
export const DeleteMarkerReplication = S.suspend(() =>
  S.Struct({ Status: S.optional(DeleteMarkerReplicationStatus) }),
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
  }),
).annotations({
  identifier: "ReplicationRule",
}) as any as S.Schema<ReplicationRule>;
export type ReplicationRules = ReplicationRule[];
export const ReplicationRules = S.Array(ReplicationRule);
export interface ReplicationConfiguration {
  Role: string;
  Rules: ReplicationRule[];
}
export const ReplicationConfiguration = S.suspend(() =>
  S.Struct({
    Role: S.String,
    Rules: ReplicationRules.pipe(T.XmlName("Rule"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "ReplicationConfiguration",
}) as any as S.Schema<ReplicationConfiguration>;
export interface GetBucketReplicationOutput {
  ReplicationConfiguration?: ReplicationConfiguration;
}
export const GetBucketReplicationOutput = S.suspend(() =>
  S.Struct({
    ReplicationConfiguration: S.optional(ReplicationConfiguration)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ReplicationConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketReplicationOutput",
}) as any as S.Schema<GetBucketReplicationOutput>;
export interface GetBucketRequestPaymentOutput {
  Payer?: Payer;
}
export const GetBucketRequestPaymentOutput = S.suspend(() =>
  S.Struct({ Payer: S.optional(Payer) }).pipe(
    T.all(T.XmlName("RequestPaymentConfiguration"), ns),
  ),
).annotations({
  identifier: "GetBucketRequestPaymentOutput",
}) as any as S.Schema<GetBucketRequestPaymentOutput>;
export interface GetBucketTaggingOutput {
  TagSet: Tag[];
}
export const GetBucketTaggingOutput = S.suspend(() =>
  S.Struct({ TagSet: TagSet }).pipe(T.all(T.XmlName("Tagging"), ns)),
).annotations({
  identifier: "GetBucketTaggingOutput",
}) as any as S.Schema<GetBucketTaggingOutput>;
export interface GetBucketVersioningOutput {
  Status?: BucketVersioningStatus;
  MFADelete?: MFADeleteStatus;
}
export const GetBucketVersioningOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(BucketVersioningStatus),
    MFADelete: S.optional(MFADeleteStatus).pipe(T.XmlName("MfaDelete")),
  }).pipe(T.all(T.XmlName("VersioningConfiguration"), ns)),
).annotations({
  identifier: "GetBucketVersioningOutput",
}) as any as S.Schema<GetBucketVersioningOutput>;
export interface RedirectAllRequestsTo {
  HostName: string;
  Protocol?: Protocol;
}
export const RedirectAllRequestsTo = S.suspend(() =>
  S.Struct({ HostName: S.String, Protocol: S.optional(Protocol) }),
).annotations({
  identifier: "RedirectAllRequestsTo",
}) as any as S.Schema<RedirectAllRequestsTo>;
export interface IndexDocument {
  Suffix: string;
}
export const IndexDocument = S.suspend(() =>
  S.Struct({ Suffix: S.String }),
).annotations({
  identifier: "IndexDocument",
}) as any as S.Schema<IndexDocument>;
export interface ErrorDocument {
  Key: string;
}
export const ErrorDocument = S.suspend(() =>
  S.Struct({ Key: S.String }),
).annotations({
  identifier: "ErrorDocument",
}) as any as S.Schema<ErrorDocument>;
export interface Condition {
  HttpErrorCodeReturnedEquals?: string;
  KeyPrefixEquals?: string;
}
export const Condition = S.suspend(() =>
  S.Struct({
    HttpErrorCodeReturnedEquals: S.optional(S.String),
    KeyPrefixEquals: S.optional(S.String),
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export interface Redirect {
  HostName?: string;
  HttpRedirectCode?: string;
  Protocol?: Protocol;
  ReplaceKeyPrefixWith?: string;
  ReplaceKeyWith?: string;
}
export const Redirect = S.suspend(() =>
  S.Struct({
    HostName: S.optional(S.String),
    HttpRedirectCode: S.optional(S.String),
    Protocol: S.optional(Protocol),
    ReplaceKeyPrefixWith: S.optional(S.String),
    ReplaceKeyWith: S.optional(S.String),
  }),
).annotations({ identifier: "Redirect" }) as any as S.Schema<Redirect>;
export interface RoutingRule {
  Condition?: Condition;
  Redirect: Redirect;
}
export const RoutingRule = S.suspend(() =>
  S.Struct({ Condition: S.optional(Condition), Redirect: Redirect }),
).annotations({ identifier: "RoutingRule" }) as any as S.Schema<RoutingRule>;
export type RoutingRules = RoutingRule[];
export const RoutingRules = S.Array(
  RoutingRule.pipe(T.XmlName("RoutingRule")).annotations({
    identifier: "RoutingRule",
  }),
);
export interface GetBucketWebsiteOutput {
  RedirectAllRequestsTo?: RedirectAllRequestsTo;
  IndexDocument?: IndexDocument;
  ErrorDocument?: ErrorDocument;
  RoutingRules?: RoutingRule[];
}
export const GetBucketWebsiteOutput = S.suspend(() =>
  S.Struct({
    RedirectAllRequestsTo: S.optional(RedirectAllRequestsTo),
    IndexDocument: S.optional(IndexDocument),
    ErrorDocument: S.optional(ErrorDocument),
    RoutingRules: S.optional(RoutingRules),
  }).pipe(T.all(T.XmlName("WebsiteConfiguration"), ns)),
).annotations({
  identifier: "GetBucketWebsiteOutput",
}) as any as S.Schema<GetBucketWebsiteOutput>;
export interface GetObjectOutput {
  Body?: T.StreamingOutputBody;
  DeleteMarker?: boolean;
  AcceptRanges?: string;
  Expiration?: string;
  Restore?: string;
  LastModified?: Date;
  ContentLength?: number;
  ETag?: string;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  ChecksumType?: ChecksumType;
  MissingMeta?: number;
  VersionId?: string;
  CacheControl?: string;
  ContentDisposition?: string;
  ContentEncoding?: string;
  ContentLanguage?: string;
  ContentRange?: string;
  ContentType?: string;
  Expires?: string;
  WebsiteRedirectLocation?: string;
  ServerSideEncryption?: ServerSideEncryption;
  Metadata?: { [key: string]: string | undefined };
  SSECustomerAlgorithm?: string;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  StorageClass?: StorageClass;
  RequestCharged?: RequestCharged;
  ReplicationStatus?: ReplicationStatus;
  PartsCount?: number;
  TagCount?: number;
  ObjectLockMode?: ObjectLockMode;
  ObjectLockRetainUntilDate?: Date;
  ObjectLockLegalHoldStatus?: ObjectLockLegalHoldStatus;
}
export const GetObjectOutput = S.suspend(() =>
  S.Struct({
    Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    DeleteMarker: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-delete-marker"),
    ),
    AcceptRanges: S.optional(S.String).pipe(T.HttpHeader("accept-ranges")),
    Expiration: S.optional(S.String).pipe(T.HttpHeader("x-amz-expiration")),
    Restore: S.optional(S.String).pipe(T.HttpHeader("x-amz-restore")),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Last-Modified"),
    ),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ChecksumCRC32: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32"),
    ),
    ChecksumCRC32C: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32c"),
    ),
    ChecksumCRC64NVME: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc64nvme"),
    ),
    ChecksumSHA1: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha1"),
    ),
    ChecksumSHA256: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha256"),
    ),
    ChecksumType: S.optional(ChecksumType).pipe(
      T.HttpHeader("x-amz-checksum-type"),
    ),
    MissingMeta: S.optional(S.Number).pipe(T.HttpHeader("x-amz-missing-meta")),
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ContentDisposition: S.optional(S.String).pipe(
      T.HttpHeader("Content-Disposition"),
    ),
    ContentEncoding: S.optional(S.String).pipe(
      T.HttpHeader("Content-Encoding"),
    ),
    ContentLanguage: S.optional(S.String).pipe(
      T.HttpHeader("Content-Language"),
    ),
    ContentRange: S.optional(S.String).pipe(T.HttpHeader("Content-Range")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Expires: S.optional(S.String).pipe(T.HttpHeader("Expires")),
    WebsiteRedirectLocation: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-website-redirect-location"),
    ),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    Metadata: S.optional(Metadata).pipe(T.HttpPrefixHeaders("x-amz-meta-")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    StorageClass: S.optional(StorageClass).pipe(
      T.HttpHeader("x-amz-storage-class"),
    ),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
    ReplicationStatus: S.optional(ReplicationStatus).pipe(
      T.HttpHeader("x-amz-replication-status"),
    ),
    PartsCount: S.optional(S.Number).pipe(T.HttpHeader("x-amz-mp-parts-count")),
    TagCount: S.optional(S.Number).pipe(T.HttpHeader("x-amz-tagging-count")),
    ObjectLockMode: S.optional(ObjectLockMode).pipe(
      T.HttpHeader("x-amz-object-lock-mode"),
    ),
    ObjectLockRetainUntilDate: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-object-lock-retain-until-date")),
    ObjectLockLegalHoldStatus: S.optional(ObjectLockLegalHoldStatus).pipe(
      T.HttpHeader("x-amz-object-lock-legal-hold"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetObjectOutput",
}) as any as S.Schema<GetObjectOutput>;
export interface GetObjectAclOutput {
  Owner?: Owner;
  Grants?: Grant[];
  RequestCharged?: RequestCharged;
}
export const GetObjectAclOutput = S.suspend(() =>
  S.Struct({
    Owner: S.optional(Owner),
    Grants: S.optional(Grants).pipe(T.XmlName("AccessControlList")),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(T.all(T.XmlName("AccessControlPolicy"), ns)),
).annotations({
  identifier: "GetObjectAclOutput",
}) as any as S.Schema<GetObjectAclOutput>;
export interface GetObjectLegalHoldOutput {
  LegalHold?: ObjectLockLegalHold;
}
export const GetObjectLegalHoldOutput = S.suspend(() =>
  S.Struct({
    LegalHold: S.optional(ObjectLockLegalHold)
      .pipe(T.HttpPayload(), T.XmlName("LegalHold"))
      .annotations({ identifier: "ObjectLockLegalHold" }),
  }).pipe(ns),
).annotations({
  identifier: "GetObjectLegalHoldOutput",
}) as any as S.Schema<GetObjectLegalHoldOutput>;
export interface DefaultRetention {
  Mode?: ObjectLockRetentionMode;
  Days?: number;
  Years?: number;
}
export const DefaultRetention = S.suspend(() =>
  S.Struct({
    Mode: S.optional(ObjectLockRetentionMode),
    Days: S.optional(S.Number),
    Years: S.optional(S.Number),
  }),
).annotations({
  identifier: "DefaultRetention",
}) as any as S.Schema<DefaultRetention>;
export interface ObjectLockRule {
  DefaultRetention?: DefaultRetention;
}
export const ObjectLockRule = S.suspend(() =>
  S.Struct({ DefaultRetention: S.optional(DefaultRetention) }),
).annotations({
  identifier: "ObjectLockRule",
}) as any as S.Schema<ObjectLockRule>;
export interface ObjectLockConfiguration {
  ObjectLockEnabled?: ObjectLockEnabled;
  Rule?: ObjectLockRule;
}
export const ObjectLockConfiguration = S.suspend(() =>
  S.Struct({
    ObjectLockEnabled: S.optional(ObjectLockEnabled),
    Rule: S.optional(ObjectLockRule),
  }),
).annotations({
  identifier: "ObjectLockConfiguration",
}) as any as S.Schema<ObjectLockConfiguration>;
export interface GetObjectLockConfigurationOutput {
  ObjectLockConfiguration?: ObjectLockConfiguration;
}
export const GetObjectLockConfigurationOutput = S.suspend(() =>
  S.Struct({
    ObjectLockConfiguration: S.optional(ObjectLockConfiguration)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ObjectLockConfiguration" }),
  }).pipe(ns),
).annotations({
  identifier: "GetObjectLockConfigurationOutput",
}) as any as S.Schema<GetObjectLockConfigurationOutput>;
export interface GetObjectRetentionOutput {
  Retention?: ObjectLockRetention;
}
export const GetObjectRetentionOutput = S.suspend(() =>
  S.Struct({
    Retention: S.optional(ObjectLockRetention)
      .pipe(T.HttpPayload(), T.XmlName("Retention"))
      .annotations({ identifier: "ObjectLockRetention" }),
  }).pipe(ns),
).annotations({
  identifier: "GetObjectRetentionOutput",
}) as any as S.Schema<GetObjectRetentionOutput>;
export interface GetObjectTaggingOutput {
  VersionId?: string;
  TagSet: Tag[];
}
export const GetObjectTaggingOutput = S.suspend(() =>
  S.Struct({
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    TagSet: TagSet,
  }).pipe(T.all(T.XmlName("Tagging"), ns)),
).annotations({
  identifier: "GetObjectTaggingOutput",
}) as any as S.Schema<GetObjectTaggingOutput>;
export interface GetObjectTorrentOutput {
  Body?: T.StreamingOutputBody;
  RequestCharged?: RequestCharged;
}
export const GetObjectTorrentOutput = S.suspend(() =>
  S.Struct({
    Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetObjectTorrentOutput",
}) as any as S.Schema<GetObjectTorrentOutput>;
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
export interface HeadBucketOutput {
  BucketArn?: string;
  BucketLocationType?: LocationType;
  BucketLocationName?: string;
  BucketRegion?: string;
  AccessPointAlias?: boolean;
}
export const HeadBucketOutput = S.suspend(() =>
  S.Struct({
    BucketArn: S.optional(S.String).pipe(T.HttpHeader("x-amz-bucket-arn")),
    BucketLocationType: S.optional(LocationType).pipe(
      T.HttpHeader("x-amz-bucket-location-type"),
    ),
    BucketLocationName: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-bucket-location-name"),
    ),
    BucketRegion: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-bucket-region"),
    ),
    AccessPointAlias: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-access-point-alias"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "HeadBucketOutput",
}) as any as S.Schema<HeadBucketOutput>;
export interface HeadObjectOutput {
  DeleteMarker?: boolean;
  AcceptRanges?: string;
  Expiration?: string;
  Restore?: string;
  ArchiveStatus?: ArchiveStatus;
  LastModified?: Date;
  ContentLength?: number;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  ChecksumType?: ChecksumType;
  ETag?: string;
  MissingMeta?: number;
  VersionId?: string;
  CacheControl?: string;
  ContentDisposition?: string;
  ContentEncoding?: string;
  ContentLanguage?: string;
  ContentType?: string;
  ContentRange?: string;
  Expires?: string;
  WebsiteRedirectLocation?: string;
  ServerSideEncryption?: ServerSideEncryption;
  Metadata?: { [key: string]: string | undefined };
  SSECustomerAlgorithm?: string;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  StorageClass?: StorageClass;
  RequestCharged?: RequestCharged;
  ReplicationStatus?: ReplicationStatus;
  PartsCount?: number;
  TagCount?: number;
  ObjectLockMode?: ObjectLockMode;
  ObjectLockRetainUntilDate?: Date;
  ObjectLockLegalHoldStatus?: ObjectLockLegalHoldStatus;
}
export const HeadObjectOutput = S.suspend(() =>
  S.Struct({
    DeleteMarker: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-delete-marker"),
    ),
    AcceptRanges: S.optional(S.String).pipe(T.HttpHeader("accept-ranges")),
    Expiration: S.optional(S.String).pipe(T.HttpHeader("x-amz-expiration")),
    Restore: S.optional(S.String).pipe(T.HttpHeader("x-amz-restore")),
    ArchiveStatus: S.optional(ArchiveStatus).pipe(
      T.HttpHeader("x-amz-archive-status"),
    ),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Last-Modified"),
    ),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ChecksumCRC32: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32"),
    ),
    ChecksumCRC32C: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32c"),
    ),
    ChecksumCRC64NVME: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc64nvme"),
    ),
    ChecksumSHA1: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha1"),
    ),
    ChecksumSHA256: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha256"),
    ),
    ChecksumType: S.optional(ChecksumType).pipe(
      T.HttpHeader("x-amz-checksum-type"),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    MissingMeta: S.optional(S.Number).pipe(T.HttpHeader("x-amz-missing-meta")),
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ContentDisposition: S.optional(S.String).pipe(
      T.HttpHeader("Content-Disposition"),
    ),
    ContentEncoding: S.optional(S.String).pipe(
      T.HttpHeader("Content-Encoding"),
    ),
    ContentLanguage: S.optional(S.String).pipe(
      T.HttpHeader("Content-Language"),
    ),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    ContentRange: S.optional(S.String).pipe(T.HttpHeader("Content-Range")),
    Expires: S.optional(S.String).pipe(T.HttpHeader("Expires")),
    WebsiteRedirectLocation: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-website-redirect-location"),
    ),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    Metadata: S.optional(Metadata).pipe(T.HttpPrefixHeaders("x-amz-meta-")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    StorageClass: S.optional(StorageClass).pipe(
      T.HttpHeader("x-amz-storage-class"),
    ),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
    ReplicationStatus: S.optional(ReplicationStatus).pipe(
      T.HttpHeader("x-amz-replication-status"),
    ),
    PartsCount: S.optional(S.Number).pipe(T.HttpHeader("x-amz-mp-parts-count")),
    TagCount: S.optional(S.Number).pipe(T.HttpHeader("x-amz-tagging-count")),
    ObjectLockMode: S.optional(ObjectLockMode).pipe(
      T.HttpHeader("x-amz-object-lock-mode"),
    ),
    ObjectLockRetainUntilDate: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("x-amz-object-lock-retain-until-date")),
    ObjectLockLegalHoldStatus: S.optional(ObjectLockLegalHoldStatus).pipe(
      T.HttpHeader("x-amz-object-lock-legal-hold"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "HeadObjectOutput",
}) as any as S.Schema<HeadObjectOutput>;
export interface ListBucketAnalyticsConfigurationsOutput {
  IsTruncated?: boolean;
  ContinuationToken?: string;
  NextContinuationToken?: string;
  AnalyticsConfigurationList?: AnalyticsConfiguration[];
}
export const ListBucketAnalyticsConfigurationsOutput = S.suspend(() =>
  S.Struct({
    IsTruncated: S.optional(S.Boolean),
    ContinuationToken: S.optional(S.String),
    NextContinuationToken: S.optional(S.String),
    AnalyticsConfigurationList: S.optional(AnalyticsConfigurationList).pipe(
      T.XmlName("AnalyticsConfiguration"),
      T.XmlFlattened(),
    ),
  }).pipe(T.all(T.XmlName("ListBucketAnalyticsConfigurationResult"), ns)),
).annotations({
  identifier: "ListBucketAnalyticsConfigurationsOutput",
}) as any as S.Schema<ListBucketAnalyticsConfigurationsOutput>;
export interface ListBucketIntelligentTieringConfigurationsOutput {
  IsTruncated?: boolean;
  ContinuationToken?: string;
  NextContinuationToken?: string;
  IntelligentTieringConfigurationList?: IntelligentTieringConfiguration[];
}
export const ListBucketIntelligentTieringConfigurationsOutput = S.suspend(() =>
  S.Struct({
    IsTruncated: S.optional(S.Boolean),
    ContinuationToken: S.optional(S.String),
    NextContinuationToken: S.optional(S.String),
    IntelligentTieringConfigurationList: S.optional(
      IntelligentTieringConfigurationList,
    ).pipe(T.XmlName("IntelligentTieringConfiguration"), T.XmlFlattened()),
  }).pipe(ns),
).annotations({
  identifier: "ListBucketIntelligentTieringConfigurationsOutput",
}) as any as S.Schema<ListBucketIntelligentTieringConfigurationsOutput>;
export interface ListBucketInventoryConfigurationsOutput {
  ContinuationToken?: string;
  InventoryConfigurationList?: InventoryConfiguration[];
  IsTruncated?: boolean;
  NextContinuationToken?: string;
}
export const ListBucketInventoryConfigurationsOutput = S.suspend(() =>
  S.Struct({
    ContinuationToken: S.optional(S.String),
    InventoryConfigurationList: S.optional(InventoryConfigurationList).pipe(
      T.XmlName("InventoryConfiguration"),
      T.XmlFlattened(),
    ),
    IsTruncated: S.optional(S.Boolean),
    NextContinuationToken: S.optional(S.String),
  }).pipe(T.all(T.XmlName("ListInventoryConfigurationsResult"), ns)),
).annotations({
  identifier: "ListBucketInventoryConfigurationsOutput",
}) as any as S.Schema<ListBucketInventoryConfigurationsOutput>;
export interface ListBucketMetricsConfigurationsOutput {
  IsTruncated?: boolean;
  ContinuationToken?: string;
  NextContinuationToken?: string;
  MetricsConfigurationList?: MetricsConfiguration[];
}
export const ListBucketMetricsConfigurationsOutput = S.suspend(() =>
  S.Struct({
    IsTruncated: S.optional(S.Boolean),
    ContinuationToken: S.optional(S.String),
    NextContinuationToken: S.optional(S.String),
    MetricsConfigurationList: S.optional(MetricsConfigurationList).pipe(
      T.XmlName("MetricsConfiguration"),
      T.XmlFlattened(),
    ),
  }).pipe(T.all(T.XmlName("ListMetricsConfigurationsResult"), ns)),
).annotations({
  identifier: "ListBucketMetricsConfigurationsOutput",
}) as any as S.Schema<ListBucketMetricsConfigurationsOutput>;
export interface Bucket {
  Name?: string;
  CreationDate?: Date;
  BucketRegion?: string;
  BucketArn?: string;
}
export const Bucket = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CreationDate: S.optional(S.Date),
    BucketRegion: S.optional(S.String),
    BucketArn: S.optional(S.String),
  }),
).annotations({ identifier: "Bucket" }) as any as S.Schema<Bucket>;
export type Buckets = Bucket[];
export const Buckets = S.Array(
  Bucket.pipe(T.XmlName("Bucket")).annotations({ identifier: "Bucket" }),
);
export interface ListDirectoryBucketsOutput {
  Buckets?: Bucket[];
  ContinuationToken?: string;
}
export const ListDirectoryBucketsOutput = S.suspend(() =>
  S.Struct({
    Buckets: S.optional(Buckets),
    ContinuationToken: S.optional(S.String),
  }).pipe(T.all(T.XmlName("ListAllMyDirectoryBucketsResult"), ns)),
).annotations({
  identifier: "ListDirectoryBucketsOutput",
}) as any as S.Schema<ListDirectoryBucketsOutput>;
export type ChecksumAlgorithmList = ChecksumAlgorithm[];
export const ChecksumAlgorithmList = S.Array(ChecksumAlgorithm);
export type ObjectStorageClass =
  | "STANDARD"
  | "REDUCED_REDUNDANCY"
  | "GLACIER"
  | "STANDARD_IA"
  | "ONEZONE_IA"
  | "INTELLIGENT_TIERING"
  | "DEEP_ARCHIVE"
  | "OUTPOSTS"
  | "GLACIER_IR"
  | "SNOW"
  | "EXPRESS_ONEZONE"
  | "FSX_OPENZFS"
  | "FSX_ONTAP"
  | (string & {});
export const ObjectStorageClass = S.String;
export interface RestoreStatus {
  IsRestoreInProgress?: boolean;
  RestoreExpiryDate?: Date;
}
export const RestoreStatus = S.suspend(() =>
  S.Struct({
    IsRestoreInProgress: S.optional(S.Boolean),
    RestoreExpiryDate: S.optional(S.Date),
  }),
).annotations({
  identifier: "RestoreStatus",
}) as any as S.Schema<RestoreStatus>;
export interface Object {
  Key?: string;
  LastModified?: Date;
  ETag?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm[];
  ChecksumType?: ChecksumType;
  Size?: number;
  StorageClass?: ObjectStorageClass;
  Owner?: Owner;
  RestoreStatus?: RestoreStatus;
}
export const Object = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    LastModified: S.optional(S.Date),
    ETag: S.optional(S.String),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithmList).pipe(T.XmlFlattened()),
    ChecksumType: S.optional(ChecksumType),
    Size: S.optional(S.Number),
    StorageClass: S.optional(ObjectStorageClass),
    Owner: S.optional(Owner),
    RestoreStatus: S.optional(RestoreStatus),
  }),
).annotations({ identifier: "Object" }) as any as S.Schema<Object>;
export type ObjectList = Object[];
export const ObjectList = S.Array(Object);
export interface CommonPrefix {
  Prefix?: string;
}
export const CommonPrefix = S.suspend(() =>
  S.Struct({ Prefix: S.optional(S.String) }),
).annotations({ identifier: "CommonPrefix" }) as any as S.Schema<CommonPrefix>;
export type CommonPrefixList = CommonPrefix[];
export const CommonPrefixList = S.Array(CommonPrefix);
export interface ListObjectsV2Output {
  IsTruncated?: boolean;
  Contents?: Object[];
  Name?: string;
  Prefix?: string;
  Delimiter?: string;
  MaxKeys?: number;
  CommonPrefixes?: CommonPrefix[];
  EncodingType?: EncodingType;
  KeyCount?: number;
  ContinuationToken?: string;
  NextContinuationToken?: string;
  StartAfter?: string;
  RequestCharged?: RequestCharged;
}
export const ListObjectsV2Output = S.suspend(() =>
  S.Struct({
    IsTruncated: S.optional(S.Boolean),
    Contents: S.optional(ObjectList).pipe(T.XmlFlattened()),
    Name: S.optional(S.String),
    Prefix: S.optional(S.String),
    Delimiter: S.optional(S.String),
    MaxKeys: S.optional(S.Number),
    CommonPrefixes: S.optional(CommonPrefixList).pipe(T.XmlFlattened()),
    EncodingType: S.optional(EncodingType),
    KeyCount: S.optional(S.Number),
    ContinuationToken: S.optional(S.String),
    NextContinuationToken: S.optional(S.String),
    StartAfter: S.optional(S.String),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(T.all(T.XmlName("ListBucketResult"), ns)),
).annotations({
  identifier: "ListObjectsV2Output",
}) as any as S.Schema<ListObjectsV2Output>;
export interface PutBucketAbacRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ExpectedBucketOwner?: string;
  AbacStatus: AbacStatus;
}
export const PutBucketAbacRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    AbacStatus: AbacStatus.pipe(
      T.HttpPayload(),
      T.XmlName("AbacStatus"),
    ).annotations({ identifier: "AbacStatus" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?abac" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
      }),
    ),
  ),
).annotations({
  identifier: "PutBucketAbacRequest",
}) as any as S.Schema<PutBucketAbacRequest>;
export interface PutBucketAbacResponse {}
export const PutBucketAbacResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketAbacResponse",
}) as any as S.Schema<PutBucketAbacResponse>;
export interface PutBucketAccelerateConfigurationRequest {
  Bucket: string;
  AccelerateConfiguration: AccelerateConfiguration;
  ExpectedBucketOwner?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
}
export const PutBucketAccelerateConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    AccelerateConfiguration: AccelerateConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("AccelerateConfiguration"),
    ).annotations({ identifier: "AccelerateConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?accelerate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketAccelerateConfigurationRequest",
}) as any as S.Schema<PutBucketAccelerateConfigurationRequest>;
export interface PutBucketAccelerateConfigurationResponse {}
export const PutBucketAccelerateConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketAccelerateConfigurationResponse",
}) as any as S.Schema<PutBucketAccelerateConfigurationResponse>;
export interface PutBucketRequestPaymentRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  RequestPaymentConfiguration: RequestPaymentConfiguration;
  ExpectedBucketOwner?: string;
}
export const PutBucketRequestPaymentRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    RequestPaymentConfiguration: RequestPaymentConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("RequestPaymentConfiguration"),
    ).annotations({ identifier: "RequestPaymentConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?requestPayment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketRequestPaymentRequest",
}) as any as S.Schema<PutBucketRequestPaymentRequest>;
export interface PutBucketRequestPaymentResponse {}
export const PutBucketRequestPaymentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketRequestPaymentResponse",
}) as any as S.Schema<PutBucketRequestPaymentResponse>;
export interface PutBucketTaggingRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  Tagging: Tagging;
  ExpectedBucketOwner?: string;
}
export const PutBucketTaggingRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    Tagging: Tagging.pipe(T.HttpPayload(), T.XmlName("Tagging")).annotations({
      identifier: "Tagging",
    }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?tagging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  MFA?: string;
  VersioningConfiguration: VersioningConfiguration;
  ExpectedBucketOwner?: string;
}
export const PutBucketVersioningRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    MFA: S.optional(S.String).pipe(T.HttpHeader("x-amz-mfa")),
    VersioningConfiguration: VersioningConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("VersioningConfiguration"),
    ).annotations({ identifier: "VersioningConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?versioning" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
export interface PutObjectOutput {
  Expiration?: string;
  ETag?: string;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  ChecksumType?: ChecksumType;
  ServerSideEncryption?: ServerSideEncryption;
  VersionId?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSEKMSEncryptionContext?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  Size?: number;
  RequestCharged?: RequestCharged;
}
export const PutObjectOutput = S.suspend(() =>
  S.Struct({
    Expiration: S.optional(S.String).pipe(T.HttpHeader("x-amz-expiration")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ChecksumCRC32: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32"),
    ),
    ChecksumCRC32C: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32c"),
    ),
    ChecksumCRC64NVME: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc64nvme"),
    ),
    ChecksumSHA1: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha1"),
    ),
    ChecksumSHA256: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha256"),
    ),
    ChecksumType: S.optional(ChecksumType).pipe(
      T.HttpHeader("x-amz-checksum-type"),
    ),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    SSEKMSEncryptionContext: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-context"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    Size: S.optional(S.Number).pipe(T.HttpHeader("x-amz-object-size")),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "PutObjectOutput",
}) as any as S.Schema<PutObjectOutput>;
export interface PutObjectAclOutput {
  RequestCharged?: RequestCharged;
}
export const PutObjectAclOutput = S.suspend(() =>
  S.Struct({
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "PutObjectAclOutput",
}) as any as S.Schema<PutObjectAclOutput>;
export interface PutObjectLegalHoldRequest {
  Bucket: string;
  Key: string;
  LegalHold?: ObjectLockLegalHold;
  RequestPayer?: RequestPayer;
  VersionId?: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ExpectedBucketOwner?: string;
}
export const PutObjectLegalHoldRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    LegalHold: S.optional(ObjectLockLegalHold)
      .pipe(T.HttpPayload(), T.XmlName("LegalHold"))
      .annotations({ identifier: "ObjectLockLegalHold" }),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?legal-hold" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
    ),
  ),
).annotations({
  identifier: "PutObjectLegalHoldRequest",
}) as any as S.Schema<PutObjectLegalHoldRequest>;
export interface PutObjectRetentionRequest {
  Bucket: string;
  Key: string;
  Retention?: ObjectLockRetention;
  RequestPayer?: RequestPayer;
  VersionId?: string;
  BypassGovernanceRetention?: boolean;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ExpectedBucketOwner?: string;
}
export const PutObjectRetentionRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    Retention: S.optional(ObjectLockRetention)
      .pipe(T.HttpPayload(), T.XmlName("Retention"))
      .annotations({ identifier: "ObjectLockRetention" }),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    BypassGovernanceRetention: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-bypass-governance-retention"),
    ),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}/{Key+}?retention" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
    ),
  ),
).annotations({
  identifier: "PutObjectRetentionRequest",
}) as any as S.Schema<PutObjectRetentionRequest>;
export interface PutObjectTaggingOutput {
  VersionId?: string;
}
export const PutObjectTaggingOutput = S.suspend(() =>
  S.Struct({
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
  }).pipe(ns),
).annotations({
  identifier: "PutObjectTaggingOutput",
}) as any as S.Schema<PutObjectTaggingOutput>;
export interface PutPublicAccessBlockRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  PublicAccessBlockConfiguration: PublicAccessBlockConfiguration;
  ExpectedBucketOwner?: string;
}
export const PutPublicAccessBlockRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    PublicAccessBlockConfiguration: PublicAccessBlockConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("PublicAccessBlockConfiguration"),
    ).annotations({ identifier: "PublicAccessBlockConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?publicAccessBlock" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
export interface UploadPartOutput {
  ServerSideEncryption?: ServerSideEncryption;
  ETag?: string;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  RequestCharged?: RequestCharged;
}
export const UploadPartOutput = S.suspend(() =>
  S.Struct({
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ChecksumCRC32: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32"),
    ),
    ChecksumCRC32C: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32c"),
    ),
    ChecksumCRC64NVME: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc64nvme"),
    ),
    ChecksumSHA1: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha1"),
    ),
    ChecksumSHA256: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha256"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "UploadPartOutput",
}) as any as S.Schema<UploadPartOutput>;
export interface CompletedPart {
  ETag?: string;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  PartNumber?: number;
}
export const CompletedPart = S.suspend(() =>
  S.Struct({
    ETag: S.optional(S.String),
    ChecksumCRC32: S.optional(S.String),
    ChecksumCRC32C: S.optional(S.String),
    ChecksumCRC64NVME: S.optional(S.String),
    ChecksumSHA1: S.optional(S.String),
    ChecksumSHA256: S.optional(S.String),
    PartNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "CompletedPart",
}) as any as S.Schema<CompletedPart>;
export type CompletedPartList = CompletedPart[];
export const CompletedPartList = S.Array(CompletedPart);
export interface LocationInfo {
  Type?: LocationType;
  Name?: string;
}
export const LocationInfo = S.suspend(() =>
  S.Struct({ Type: S.optional(LocationType), Name: S.optional(S.String) }),
).annotations({ identifier: "LocationInfo" }) as any as S.Schema<LocationInfo>;
export interface BucketInfo {
  DataRedundancy?: DataRedundancy;
  Type?: BucketType;
}
export const BucketInfo = S.suspend(() =>
  S.Struct({
    DataRedundancy: S.optional(DataRedundancy),
    Type: S.optional(BucketType),
  }),
).annotations({ identifier: "BucketInfo" }) as any as S.Schema<BucketInfo>;
export interface RecordExpiration {
  Expiration: ExpirationState;
  Days?: number;
}
export const RecordExpiration = S.suspend(() =>
  S.Struct({ Expiration: ExpirationState, Days: S.optional(S.Number) }),
).annotations({
  identifier: "RecordExpiration",
}) as any as S.Schema<RecordExpiration>;
export interface MetadataTableEncryptionConfiguration {
  SseAlgorithm: TableSseAlgorithm;
  KmsKeyArn?: string;
}
export const MetadataTableEncryptionConfiguration = S.suspend(() =>
  S.Struct({
    SseAlgorithm: TableSseAlgorithm,
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "MetadataTableEncryptionConfiguration",
}) as any as S.Schema<MetadataTableEncryptionConfiguration>;
export interface JournalTableConfiguration {
  RecordExpiration: RecordExpiration;
  EncryptionConfiguration?: MetadataTableEncryptionConfiguration;
}
export const JournalTableConfiguration = S.suspend(() =>
  S.Struct({
    RecordExpiration: RecordExpiration,
    EncryptionConfiguration: S.optional(MetadataTableEncryptionConfiguration),
  }),
).annotations({
  identifier: "JournalTableConfiguration",
}) as any as S.Schema<JournalTableConfiguration>;
export interface InventoryTableConfiguration {
  ConfigurationState: InventoryConfigurationState;
  EncryptionConfiguration?: MetadataTableEncryptionConfiguration;
}
export const InventoryTableConfiguration = S.suspend(() =>
  S.Struct({
    ConfigurationState: InventoryConfigurationState,
    EncryptionConfiguration: S.optional(MetadataTableEncryptionConfiguration),
  }),
).annotations({
  identifier: "InventoryTableConfiguration",
}) as any as S.Schema<InventoryTableConfiguration>;
export interface S3TablesDestination {
  TableBucketArn: string;
  TableName: string;
}
export const S3TablesDestination = S.suspend(() =>
  S.Struct({ TableBucketArn: S.String, TableName: S.String }),
).annotations({
  identifier: "S3TablesDestination",
}) as any as S.Schema<S3TablesDestination>;
export interface ObjectIdentifier {
  Key: string;
  VersionId?: string;
  ETag?: string;
  LastModifiedTime?: Date;
  Size?: number;
}
export const ObjectIdentifier = S.suspend(() =>
  S.Struct({
    Key: S.String,
    VersionId: S.optional(S.String),
    ETag: S.optional(S.String),
    LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))),
    Size: S.optional(S.Number),
  }),
).annotations({
  identifier: "ObjectIdentifier",
}) as any as S.Schema<ObjectIdentifier>;
export type ObjectIdentifierList = ObjectIdentifier[];
export const ObjectIdentifierList = S.Array(ObjectIdentifier);
export type ObjectVersionStorageClass = "STANDARD" | (string & {});
export const ObjectVersionStorageClass = S.String;
export type FilterRuleName = "prefix" | "suffix" | (string & {});
export const FilterRuleName = S.String;
export interface FilterRule {
  Name?: FilterRuleName;
  Value?: string;
}
export const FilterRule = S.suspend(() =>
  S.Struct({ Name: S.optional(FilterRuleName), Value: S.optional(S.String) }),
).annotations({ identifier: "FilterRule" }) as any as S.Schema<FilterRule>;
export type FilterRuleList = FilterRule[];
export const FilterRuleList = S.Array(FilterRule);
export interface S3KeyFilter {
  FilterRules?: FilterRule[];
}
export const S3KeyFilter = S.suspend(() =>
  S.Struct({
    FilterRules: S.optional(FilterRuleList).pipe(
      T.XmlName("FilterRule"),
      T.XmlFlattened(),
    ),
  }),
).annotations({ identifier: "S3KeyFilter" }) as any as S.Schema<S3KeyFilter>;
export interface NotificationConfigurationFilter {
  Key?: S3KeyFilter;
}
export const NotificationConfigurationFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S3KeyFilter)
      .pipe(T.XmlName("S3Key"))
      .annotations({ identifier: "S3KeyFilter" }),
  }),
).annotations({
  identifier: "NotificationConfigurationFilter",
}) as any as S.Schema<NotificationConfigurationFilter>;
export interface QueueConfiguration {
  Id?: string;
  QueueArn: string;
  Events: Event[];
  Filter?: NotificationConfigurationFilter;
}
export const QueueConfiguration = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    QueueArn: S.String.pipe(T.XmlName("Queue")),
    Events: EventList.pipe(T.XmlName("Event"), T.XmlFlattened()),
    Filter: S.optional(NotificationConfigurationFilter),
  }),
).annotations({
  identifier: "QueueConfiguration",
}) as any as S.Schema<QueueConfiguration>;
export type QueueConfigurationList = QueueConfiguration[];
export const QueueConfigurationList = S.Array(QueueConfiguration);
export interface LambdaFunctionConfiguration {
  Id?: string;
  LambdaFunctionArn: string;
  Events: Event[];
  Filter?: NotificationConfigurationFilter;
}
export const LambdaFunctionConfiguration = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    LambdaFunctionArn: S.String.pipe(T.XmlName("CloudFunction")),
    Events: EventList.pipe(T.XmlName("Event"), T.XmlFlattened()),
    Filter: S.optional(NotificationConfigurationFilter),
  }),
).annotations({
  identifier: "LambdaFunctionConfiguration",
}) as any as S.Schema<LambdaFunctionConfiguration>;
export type LambdaFunctionConfigurationList = LambdaFunctionConfiguration[];
export const LambdaFunctionConfigurationList = S.Array(
  LambdaFunctionConfiguration,
);
export interface GlacierJobParameters {
  Tier: Tier;
}
export const GlacierJobParameters = S.suspend(() =>
  S.Struct({ Tier: Tier }),
).annotations({
  identifier: "GlacierJobParameters",
}) as any as S.Schema<GlacierJobParameters>;
export interface CSVInput {
  FileHeaderInfo?: FileHeaderInfo;
  Comments?: string;
  QuoteEscapeCharacter?: string;
  RecordDelimiter?: string;
  FieldDelimiter?: string;
  QuoteCharacter?: string;
  AllowQuotedRecordDelimiter?: boolean;
}
export const CSVInput = S.suspend(() =>
  S.Struct({
    FileHeaderInfo: S.optional(FileHeaderInfo),
    Comments: S.optional(S.String),
    QuoteEscapeCharacter: S.optional(S.String),
    RecordDelimiter: S.optional(S.String),
    FieldDelimiter: S.optional(S.String),
    QuoteCharacter: S.optional(S.String),
    AllowQuotedRecordDelimiter: S.optional(S.Boolean),
  }),
).annotations({ identifier: "CSVInput" }) as any as S.Schema<CSVInput>;
export interface JSONInput {
  Type?: JSONType;
}
export const JSONInput = S.suspend(() =>
  S.Struct({ Type: S.optional(JSONType) }),
).annotations({ identifier: "JSONInput" }) as any as S.Schema<JSONInput>;
export interface InputSerialization {
  CSV?: CSVInput;
  CompressionType?: CompressionType;
  JSON?: JSONInput;
  Parquet?: ParquetInput;
}
export const InputSerialization = S.suspend(() =>
  S.Struct({
    CSV: S.optional(CSVInput),
    CompressionType: S.optional(CompressionType),
    JSON: S.optional(JSONInput),
    Parquet: S.optional(ParquetInput),
  }),
).annotations({
  identifier: "InputSerialization",
}) as any as S.Schema<InputSerialization>;
export interface CSVOutput {
  QuoteFields?: QuoteFields;
  QuoteEscapeCharacter?: string;
  RecordDelimiter?: string;
  FieldDelimiter?: string;
  QuoteCharacter?: string;
}
export const CSVOutput = S.suspend(() =>
  S.Struct({
    QuoteFields: S.optional(QuoteFields),
    QuoteEscapeCharacter: S.optional(S.String),
    RecordDelimiter: S.optional(S.String),
    FieldDelimiter: S.optional(S.String),
    QuoteCharacter: S.optional(S.String),
  }),
).annotations({ identifier: "CSVOutput" }) as any as S.Schema<CSVOutput>;
export interface JSONOutput {
  RecordDelimiter?: string;
}
export const JSONOutput = S.suspend(() =>
  S.Struct({ RecordDelimiter: S.optional(S.String) }),
).annotations({ identifier: "JSONOutput" }) as any as S.Schema<JSONOutput>;
export interface OutputSerialization {
  CSV?: CSVOutput;
  JSON?: JSONOutput;
}
export const OutputSerialization = S.suspend(() =>
  S.Struct({ CSV: S.optional(CSVOutput), JSON: S.optional(JSONOutput) }),
).annotations({
  identifier: "OutputSerialization",
}) as any as S.Schema<OutputSerialization>;
export interface SelectParameters {
  InputSerialization: InputSerialization;
  ExpressionType: ExpressionType;
  Expression: string;
  OutputSerialization: OutputSerialization;
}
export const SelectParameters = S.suspend(() =>
  S.Struct({
    InputSerialization: InputSerialization,
    ExpressionType: ExpressionType,
    Expression: S.String,
    OutputSerialization: OutputSerialization,
  }),
).annotations({
  identifier: "SelectParameters",
}) as any as S.Schema<SelectParameters>;
export interface CompletedMultipartUpload {
  Parts?: CompletedPart[];
}
export const CompletedMultipartUpload = S.suspend(() =>
  S.Struct({
    Parts: S.optional(CompletedPartList).pipe(
      T.XmlName("Part"),
      T.XmlFlattened(),
    ),
  }),
).annotations({
  identifier: "CompletedMultipartUpload",
}) as any as S.Schema<CompletedMultipartUpload>;
export interface CreateBucketConfiguration {
  LocationConstraint?: BucketLocationConstraint;
  Location?: LocationInfo;
  Bucket?: BucketInfo;
  Tags?: Tag[];
}
export const CreateBucketConfiguration = S.suspend(() =>
  S.Struct({
    LocationConstraint: S.optional(BucketLocationConstraint),
    Location: S.optional(LocationInfo),
    Bucket: S.optional(BucketInfo),
    Tags: S.optional(TagSet),
  }),
).annotations({
  identifier: "CreateBucketConfiguration",
}) as any as S.Schema<CreateBucketConfiguration>;
export interface MetadataConfiguration {
  JournalTableConfiguration: JournalTableConfiguration;
  InventoryTableConfiguration?: InventoryTableConfiguration;
}
export const MetadataConfiguration = S.suspend(() =>
  S.Struct({
    JournalTableConfiguration: JournalTableConfiguration,
    InventoryTableConfiguration: S.optional(InventoryTableConfiguration),
  }),
).annotations({
  identifier: "MetadataConfiguration",
}) as any as S.Schema<MetadataConfiguration>;
export interface MetadataTableConfiguration {
  S3TablesDestination: S3TablesDestination;
}
export const MetadataTableConfiguration = S.suspend(() =>
  S.Struct({ S3TablesDestination: S3TablesDestination }),
).annotations({
  identifier: "MetadataTableConfiguration",
}) as any as S.Schema<MetadataTableConfiguration>;
export interface SessionCredentials {
  AccessKeyId: string;
  SecretAccessKey: string | redacted.Redacted<string>;
  SessionToken: string | redacted.Redacted<string>;
  Expiration: Date;
}
export const SessionCredentials = S.suspend(() =>
  S.Struct({
    AccessKeyId: S.String.pipe(T.XmlName("AccessKeyId")),
    SecretAccessKey: SensitiveString.pipe(T.XmlName("SecretAccessKey")),
    SessionToken: SensitiveString.pipe(T.XmlName("SessionToken")),
    Expiration: S.Date.pipe(T.XmlName("Expiration")),
  }),
).annotations({
  identifier: "SessionCredentials",
}) as any as S.Schema<SessionCredentials>;
export interface Delete {
  Objects: ObjectIdentifier[];
  Quiet?: boolean;
}
export const Delete = S.suspend(() =>
  S.Struct({
    Objects: ObjectIdentifierList.pipe(T.XmlName("Object"), T.XmlFlattened()),
    Quiet: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Delete" }) as any as S.Schema<Delete>;
export interface PolicyStatus {
  IsPublic?: boolean;
}
export const PolicyStatus = S.suspend(() =>
  S.Struct({ IsPublic: S.optional(S.Boolean).pipe(T.XmlName("IsPublic")) }),
).annotations({ identifier: "PolicyStatus" }) as any as S.Schema<PolicyStatus>;
export interface Checksum {
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  ChecksumType?: ChecksumType;
}
export const Checksum = S.suspend(() =>
  S.Struct({
    ChecksumCRC32: S.optional(S.String),
    ChecksumCRC32C: S.optional(S.String),
    ChecksumCRC64NVME: S.optional(S.String),
    ChecksumSHA1: S.optional(S.String),
    ChecksumSHA256: S.optional(S.String),
    ChecksumType: S.optional(ChecksumType),
  }),
).annotations({ identifier: "Checksum" }) as any as S.Schema<Checksum>;
export interface Initiator {
  ID?: string;
  DisplayName?: string;
}
export const Initiator = S.suspend(() =>
  S.Struct({ ID: S.optional(S.String), DisplayName: S.optional(S.String) }),
).annotations({ identifier: "Initiator" }) as any as S.Schema<Initiator>;
export interface MultipartUpload {
  UploadId?: string;
  Key?: string;
  Initiated?: Date;
  StorageClass?: StorageClass;
  Owner?: Owner;
  Initiator?: Initiator;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ChecksumType?: ChecksumType;
}
export const MultipartUpload = S.suspend(() =>
  S.Struct({
    UploadId: S.optional(S.String),
    Key: S.optional(S.String),
    Initiated: S.optional(S.Date),
    StorageClass: S.optional(StorageClass),
    Owner: S.optional(Owner),
    Initiator: S.optional(Initiator),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm),
    ChecksumType: S.optional(ChecksumType),
  }),
).annotations({
  identifier: "MultipartUpload",
}) as any as S.Schema<MultipartUpload>;
export type MultipartUploadList = MultipartUpload[];
export const MultipartUploadList = S.Array(MultipartUpload);
export interface ObjectVersion {
  ETag?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm[];
  ChecksumType?: ChecksumType;
  Size?: number;
  StorageClass?: ObjectVersionStorageClass;
  Key?: string;
  VersionId?: string;
  IsLatest?: boolean;
  LastModified?: Date;
  Owner?: Owner;
  RestoreStatus?: RestoreStatus;
}
export const ObjectVersion = S.suspend(() =>
  S.Struct({
    ETag: S.optional(S.String),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithmList).pipe(T.XmlFlattened()),
    ChecksumType: S.optional(ChecksumType),
    Size: S.optional(S.Number),
    StorageClass: S.optional(ObjectVersionStorageClass),
    Key: S.optional(S.String),
    VersionId: S.optional(S.String),
    IsLatest: S.optional(S.Boolean),
    LastModified: S.optional(S.Date),
    Owner: S.optional(Owner),
    RestoreStatus: S.optional(RestoreStatus),
  }),
).annotations({
  identifier: "ObjectVersion",
}) as any as S.Schema<ObjectVersion>;
export type ObjectVersionList = ObjectVersion[];
export const ObjectVersionList = S.Array(ObjectVersion);
export interface DeleteMarkerEntry {
  Owner?: Owner;
  Key?: string;
  VersionId?: string;
  IsLatest?: boolean;
  LastModified?: Date;
}
export const DeleteMarkerEntry = S.suspend(() =>
  S.Struct({
    Owner: S.optional(Owner),
    Key: S.optional(S.String),
    VersionId: S.optional(S.String),
    IsLatest: S.optional(S.Boolean),
    LastModified: S.optional(S.Date),
  }),
).annotations({
  identifier: "DeleteMarkerEntry",
}) as any as S.Schema<DeleteMarkerEntry>;
export type DeleteMarkers = DeleteMarkerEntry[];
export const DeleteMarkers = S.Array(DeleteMarkerEntry);
export interface Part {
  PartNumber?: number;
  LastModified?: Date;
  ETag?: string;
  Size?: number;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
}
export const Part = S.suspend(() =>
  S.Struct({
    PartNumber: S.optional(S.Number),
    LastModified: S.optional(S.Date),
    ETag: S.optional(S.String),
    Size: S.optional(S.Number),
    ChecksumCRC32: S.optional(S.String),
    ChecksumCRC32C: S.optional(S.String),
    ChecksumCRC64NVME: S.optional(S.String),
    ChecksumSHA1: S.optional(S.String),
    ChecksumSHA256: S.optional(S.String),
  }),
).annotations({ identifier: "Part" }) as any as S.Schema<Part>;
export type Parts = Part[];
export const Parts = S.Array(Part);
export interface CORSConfiguration {
  CORSRules: CORSRule[];
}
export const CORSConfiguration = S.suspend(() =>
  S.Struct({
    CORSRules: CORSRules.pipe(T.XmlName("CORSRule"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "CORSConfiguration",
}) as any as S.Schema<CORSConfiguration>;
export interface InventoryTableConfigurationUpdates {
  ConfigurationState: InventoryConfigurationState;
  EncryptionConfiguration?: MetadataTableEncryptionConfiguration;
}
export const InventoryTableConfigurationUpdates = S.suspend(() =>
  S.Struct({
    ConfigurationState: InventoryConfigurationState,
    EncryptionConfiguration: S.optional(MetadataTableEncryptionConfiguration),
  }),
).annotations({
  identifier: "InventoryTableConfigurationUpdates",
}) as any as S.Schema<InventoryTableConfigurationUpdates>;
export interface JournalTableConfigurationUpdates {
  RecordExpiration: RecordExpiration;
}
export const JournalTableConfigurationUpdates = S.suspend(() =>
  S.Struct({ RecordExpiration: RecordExpiration }),
).annotations({
  identifier: "JournalTableConfigurationUpdates",
}) as any as S.Schema<JournalTableConfigurationUpdates>;
export interface CopyPartResult {
  ETag?: string;
  LastModified?: Date;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
}
export const CopyPartResult = S.suspend(() =>
  S.Struct({
    ETag: S.optional(S.String),
    LastModified: S.optional(S.Date),
    ChecksumCRC32: S.optional(S.String),
    ChecksumCRC32C: S.optional(S.String),
    ChecksumCRC64NVME: S.optional(S.String),
    ChecksumSHA1: S.optional(S.String),
    ChecksumSHA256: S.optional(S.String),
  }),
).annotations({
  identifier: "CopyPartResult",
}) as any as S.Schema<CopyPartResult>;
export interface CompleteMultipartUploadRequest {
  Bucket: string;
  Key: string;
  MultipartUpload?: CompletedMultipartUpload;
  UploadId: string;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  ChecksumType?: ChecksumType;
  MpuObjectSize?: number;
  RequestPayer?: RequestPayer;
  ExpectedBucketOwner?: string;
  IfMatch?: string;
  IfNoneMatch?: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
}
export const CompleteMultipartUploadRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key"), T.ContextParam("Key")),
    MultipartUpload: S.optional(CompletedMultipartUpload)
      .pipe(T.HttpPayload(), T.XmlName("CompleteMultipartUpload"))
      .annotations({ identifier: "CompletedMultipartUpload" }),
    UploadId: S.String.pipe(T.HttpQuery("uploadId")),
    ChecksumCRC32: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32"),
    ),
    ChecksumCRC32C: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc32c"),
    ),
    ChecksumCRC64NVME: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-crc64nvme"),
    ),
    ChecksumSHA1: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha1"),
    ),
    ChecksumSHA256: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-checksum-sha256"),
    ),
    ChecksumType: S.optional(ChecksumType).pipe(
      T.HttpHeader("x-amz-checksum-type"),
    ),
    MpuObjectSize: S.optional(S.Number).pipe(
      T.HttpHeader("x-amz-mp-object-size"),
    ),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    IfNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{Bucket}/{Key+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteMultipartUploadRequest",
}) as any as S.Schema<CompleteMultipartUploadRequest>;
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
  ObjectOwnership?: ObjectOwnership;
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
    ObjectOwnership: S.optional(ObjectOwnership).pipe(
      T.HttpHeader("x-amz-object-ownership"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({
        UseS3ExpressControlEndpoint: { value: true },
        DisableAccessPoints: { value: true },
      }),
    ),
  ),
).annotations({
  identifier: "CreateBucketRequest",
}) as any as S.Schema<CreateBucketRequest>;
export interface CreateBucketMetadataConfigurationRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  MetadataConfiguration: MetadataConfiguration;
  ExpectedBucketOwner?: string;
}
export const CreateBucketMetadataConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    MetadataConfiguration: MetadataConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("MetadataConfiguration"),
    ).annotations({ identifier: "MetadataConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{Bucket}?metadataConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateBucketMetadataConfigurationRequest",
}) as any as S.Schema<CreateBucketMetadataConfigurationRequest>;
export interface CreateBucketMetadataConfigurationResponse {}
export const CreateBucketMetadataConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateBucketMetadataConfigurationResponse",
}) as any as S.Schema<CreateBucketMetadataConfigurationResponse>;
export interface CreateBucketMetadataTableConfigurationRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  MetadataTableConfiguration: MetadataTableConfiguration;
  ExpectedBucketOwner?: string;
}
export const CreateBucketMetadataTableConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    MetadataTableConfiguration: MetadataTableConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("MetadataTableConfiguration"),
    ).annotations({ identifier: "MetadataTableConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{Bucket}?metadataTable" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreateBucketMetadataTableConfigurationRequest",
}) as any as S.Schema<CreateBucketMetadataTableConfigurationRequest>;
export interface CreateBucketMetadataTableConfigurationResponse {}
export const CreateBucketMetadataTableConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateBucketMetadataTableConfigurationResponse",
}) as any as S.Schema<CreateBucketMetadataTableConfigurationResponse>;
export interface CreateSessionOutput {
  ServerSideEncryption?: ServerSideEncryption;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSEKMSEncryptionContext?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  Credentials: SessionCredentials;
}
export const CreateSessionOutput = S.suspend(() =>
  S.Struct({
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    SSEKMSEncryptionContext: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-context"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    Credentials: SessionCredentials.pipe(T.XmlName("Credentials")).annotations({
      identifier: "SessionCredentials",
    }),
  }).pipe(T.all(T.XmlName("CreateSessionResult"), ns)),
).annotations({
  identifier: "CreateSessionOutput",
}) as any as S.Schema<CreateSessionOutput>;
export interface DeleteObjectsRequest {
  Bucket: string;
  Delete: Delete;
  MFA?: string;
  RequestPayer?: RequestPayer;
  BypassGovernanceRetention?: boolean;
  ExpectedBucketOwner?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
}
export const DeleteObjectsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Delete: Delete.pipe(T.HttpPayload(), T.XmlName("Delete")).annotations({
      identifier: "Delete",
    }),
    MFA: S.optional(S.String).pipe(T.HttpHeader("x-amz-mfa")),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    BypassGovernanceRetention: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-bypass-governance-retention"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{Bucket}?delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
    ),
  ),
).annotations({
  identifier: "DeleteObjectsRequest",
}) as any as S.Schema<DeleteObjectsRequest>;
export interface GetBucketPolicyStatusOutput {
  PolicyStatus?: PolicyStatus;
}
export const GetBucketPolicyStatusOutput = S.suspend(() =>
  S.Struct({
    PolicyStatus: S.optional(PolicyStatus)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PolicyStatus" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketPolicyStatusOutput",
}) as any as S.Schema<GetBucketPolicyStatusOutput>;
export interface ListBucketsOutput {
  Buckets?: Bucket[];
  Owner?: Owner;
  ContinuationToken?: string;
  Prefix?: string;
}
export const ListBucketsOutput = S.suspend(() =>
  S.Struct({
    Buckets: S.optional(Buckets),
    Owner: S.optional(Owner),
    ContinuationToken: S.optional(S.String),
    Prefix: S.optional(S.String),
  }).pipe(T.all(T.XmlName("ListAllMyBucketsResult"), ns)),
).annotations({
  identifier: "ListBucketsOutput",
}) as any as S.Schema<ListBucketsOutput>;
export interface ListMultipartUploadsOutput {
  Bucket?: string;
  KeyMarker?: string;
  UploadIdMarker?: string;
  NextKeyMarker?: string;
  Prefix?: string;
  Delimiter?: string;
  NextUploadIdMarker?: string;
  MaxUploads?: number;
  IsTruncated?: boolean;
  Uploads?: MultipartUpload[];
  CommonPrefixes?: CommonPrefix[];
  EncodingType?: EncodingType;
  RequestCharged?: RequestCharged;
}
export const ListMultipartUploadsOutput = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String),
    KeyMarker: S.optional(S.String),
    UploadIdMarker: S.optional(S.String),
    NextKeyMarker: S.optional(S.String),
    Prefix: S.optional(S.String),
    Delimiter: S.optional(S.String),
    NextUploadIdMarker: S.optional(S.String),
    MaxUploads: S.optional(S.Number),
    IsTruncated: S.optional(S.Boolean),
    Uploads: S.optional(MultipartUploadList).pipe(
      T.XmlName("Upload"),
      T.XmlFlattened(),
    ),
    CommonPrefixes: S.optional(CommonPrefixList).pipe(T.XmlFlattened()),
    EncodingType: S.optional(EncodingType),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(T.all(T.XmlName("ListMultipartUploadsResult"), ns)),
).annotations({
  identifier: "ListMultipartUploadsOutput",
}) as any as S.Schema<ListMultipartUploadsOutput>;
export interface ListObjectVersionsOutput {
  IsTruncated?: boolean;
  KeyMarker?: string;
  VersionIdMarker?: string;
  NextKeyMarker?: string;
  NextVersionIdMarker?: string;
  Versions?: ObjectVersion[];
  DeleteMarkers?: DeleteMarkerEntry[];
  Name?: string;
  Prefix?: string;
  Delimiter?: string;
  MaxKeys?: number;
  CommonPrefixes?: CommonPrefix[];
  EncodingType?: EncodingType;
  RequestCharged?: RequestCharged;
}
export const ListObjectVersionsOutput = S.suspend(() =>
  S.Struct({
    IsTruncated: S.optional(S.Boolean),
    KeyMarker: S.optional(S.String),
    VersionIdMarker: S.optional(S.String),
    NextKeyMarker: S.optional(S.String),
    NextVersionIdMarker: S.optional(S.String),
    Versions: S.optional(ObjectVersionList).pipe(
      T.XmlName("Version"),
      T.XmlFlattened(),
    ),
    DeleteMarkers: S.optional(DeleteMarkers).pipe(
      T.XmlName("DeleteMarker"),
      T.XmlFlattened(),
    ),
    Name: S.optional(S.String),
    Prefix: S.optional(S.String),
    Delimiter: S.optional(S.String),
    MaxKeys: S.optional(S.Number),
    CommonPrefixes: S.optional(CommonPrefixList).pipe(T.XmlFlattened()),
    EncodingType: S.optional(EncodingType),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(T.all(T.XmlName("ListVersionsResult"), ns)),
).annotations({
  identifier: "ListObjectVersionsOutput",
}) as any as S.Schema<ListObjectVersionsOutput>;
export interface ListPartsOutput {
  AbortDate?: Date;
  AbortRuleId?: string;
  Bucket?: string;
  Key?: string;
  UploadId?: string;
  PartNumberMarker?: string;
  NextPartNumberMarker?: string;
  MaxParts?: number;
  IsTruncated?: boolean;
  Parts?: Part[];
  Initiator?: Initiator;
  Owner?: Owner;
  StorageClass?: StorageClass;
  RequestCharged?: RequestCharged;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ChecksumType?: ChecksumType;
}
export const ListPartsOutput = S.suspend(() =>
  S.Struct({
    AbortDate: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("x-amz-abort-date"),
    ),
    AbortRuleId: S.optional(S.String).pipe(T.HttpHeader("x-amz-abort-rule-id")),
    Bucket: S.optional(S.String),
    Key: S.optional(S.String),
    UploadId: S.optional(S.String),
    PartNumberMarker: S.optional(S.String),
    NextPartNumberMarker: S.optional(S.String),
    MaxParts: S.optional(S.Number),
    IsTruncated: S.optional(S.Boolean),
    Parts: S.optional(Parts).pipe(T.XmlName("Part"), T.XmlFlattened()),
    Initiator: S.optional(Initiator),
    Owner: S.optional(Owner),
    StorageClass: S.optional(StorageClass),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm),
    ChecksumType: S.optional(ChecksumType),
  }).pipe(T.all(T.XmlName("ListPartsResult"), ns)),
).annotations({
  identifier: "ListPartsOutput",
}) as any as S.Schema<ListPartsOutput>;
export interface PutBucketCorsRequest {
  Bucket: string;
  CORSConfiguration: CORSConfiguration;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ExpectedBucketOwner?: string;
}
export const PutBucketCorsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    CORSConfiguration: CORSConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("CORSConfiguration"),
    ).annotations({ identifier: "CORSConfiguration" }),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?cors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketCorsRequest",
}) as any as S.Schema<PutBucketCorsRequest>;
export interface PutBucketCorsResponse {}
export const PutBucketCorsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketCorsResponse",
}) as any as S.Schema<PutBucketCorsResponse>;
export interface PutBucketOwnershipControlsRequest {
  Bucket: string;
  ContentMD5?: string;
  ExpectedBucketOwner?: string;
  OwnershipControls: OwnershipControls;
  ChecksumAlgorithm?: ChecksumAlgorithm;
}
export const PutBucketOwnershipControlsRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    OwnershipControls: OwnershipControls.pipe(
      T.HttpPayload(),
      T.XmlName("OwnershipControls"),
    ).annotations({ identifier: "OwnershipControls" }),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?ownershipControls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketOwnershipControlsRequest",
}) as any as S.Schema<PutBucketOwnershipControlsRequest>;
export interface PutBucketOwnershipControlsResponse {}
export const PutBucketOwnershipControlsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketOwnershipControlsResponse",
}) as any as S.Schema<PutBucketOwnershipControlsResponse>;
export interface PutObjectLegalHoldOutput {
  RequestCharged?: RequestCharged;
}
export const PutObjectLegalHoldOutput = S.suspend(() =>
  S.Struct({
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "PutObjectLegalHoldOutput",
}) as any as S.Schema<PutObjectLegalHoldOutput>;
export interface PutObjectRetentionOutput {
  RequestCharged?: RequestCharged;
}
export const PutObjectRetentionOutput = S.suspend(() =>
  S.Struct({
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "PutObjectRetentionOutput",
}) as any as S.Schema<PutObjectRetentionOutput>;
export interface SelectObjectContentRequest {
  Bucket: string;
  Key: string;
  SSECustomerAlgorithm?: string;
  SSECustomerKey?: string | redacted.Redacted<string>;
  SSECustomerKeyMD5?: string;
  Expression: string;
  ExpressionType: ExpressionType;
  RequestProgress?: RequestProgress;
  InputSerialization: InputSerialization;
  OutputSerialization: OutputSerialization;
  ScanRange?: ScanRange;
  ExpectedBucketOwner?: string;
}
export const SelectObjectContentRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKey: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    Expression: S.String,
    ExpressionType: ExpressionType,
    RequestProgress: S.optional(RequestProgress),
    InputSerialization: InputSerialization,
    OutputSerialization: OutputSerialization,
    ScanRange: S.optional(ScanRange),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{Bucket}/{Key+}?select&select-type=2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SelectObjectContentRequest",
}) as any as S.Schema<SelectObjectContentRequest>;
export interface UpdateBucketMetadataInventoryTableConfigurationRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  InventoryTableConfiguration: InventoryTableConfigurationUpdates;
  ExpectedBucketOwner?: string;
}
export const UpdateBucketMetadataInventoryTableConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
      ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
      ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
        T.HttpHeader("x-amz-sdk-checksum-algorithm"),
      ),
      InventoryTableConfiguration: InventoryTableConfigurationUpdates.pipe(
        T.HttpPayload(),
        T.XmlName("InventoryTableConfiguration"),
      ).annotations({ identifier: "InventoryTableConfigurationUpdates" }),
      ExpectedBucketOwner: S.optional(S.String).pipe(
        T.HttpHeader("x-amz-expected-bucket-owner"),
      ),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "PUT", uri: "/{Bucket}?metadataInventoryTable" }),
        svc,
        auth,
        proto,
        ver,
        rules,
        T.AwsProtocolsHttpChecksum({
          requestAlgorithmMember: "ChecksumAlgorithm",
          requestChecksumRequired: true,
        }),
        T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
      ),
    ),
).annotations({
  identifier: "UpdateBucketMetadataInventoryTableConfigurationRequest",
}) as any as S.Schema<UpdateBucketMetadataInventoryTableConfigurationRequest>;
export interface UpdateBucketMetadataInventoryTableConfigurationResponse {}
export const UpdateBucketMetadataInventoryTableConfigurationResponse =
  S.suspend(() => S.Struct({}).pipe(ns)).annotations({
    identifier: "UpdateBucketMetadataInventoryTableConfigurationResponse",
  }) as any as S.Schema<UpdateBucketMetadataInventoryTableConfigurationResponse>;
export interface UpdateBucketMetadataJournalTableConfigurationRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  JournalTableConfiguration: JournalTableConfigurationUpdates;
  ExpectedBucketOwner?: string;
}
export const UpdateBucketMetadataJournalTableConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
      ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
      ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
        T.HttpHeader("x-amz-sdk-checksum-algorithm"),
      ),
      JournalTableConfiguration: JournalTableConfigurationUpdates.pipe(
        T.HttpPayload(),
        T.XmlName("JournalTableConfiguration"),
      ).annotations({ identifier: "JournalTableConfigurationUpdates" }),
      ExpectedBucketOwner: S.optional(S.String).pipe(
        T.HttpHeader("x-amz-expected-bucket-owner"),
      ),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "PUT", uri: "/{Bucket}?metadataJournalTable" }),
        svc,
        auth,
        proto,
        ver,
        rules,
        T.AwsProtocolsHttpChecksum({
          requestAlgorithmMember: "ChecksumAlgorithm",
          requestChecksumRequired: true,
        }),
        T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
      ),
    ),
).annotations({
  identifier: "UpdateBucketMetadataJournalTableConfigurationRequest",
}) as any as S.Schema<UpdateBucketMetadataJournalTableConfigurationRequest>;
export interface UpdateBucketMetadataJournalTableConfigurationResponse {}
export const UpdateBucketMetadataJournalTableConfigurationResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateBucketMetadataJournalTableConfigurationResponse",
}) as any as S.Schema<UpdateBucketMetadataJournalTableConfigurationResponse>;
export interface UploadPartCopyOutput {
  CopySourceVersionId?: string;
  CopyPartResult?: CopyPartResult;
  ServerSideEncryption?: ServerSideEncryption;
  SSECustomerAlgorithm?: string;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  RequestCharged?: RequestCharged;
}
export const UploadPartCopyOutput = S.suspend(() =>
  S.Struct({
    CopySourceVersionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-version-id"),
    ),
    CopyPartResult: S.optional(CopyPartResult)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CopyPartResult" }),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "UploadPartCopyOutput",
}) as any as S.Schema<UploadPartCopyOutput>;
export interface ErrorDetails {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface ObjectPart {
  PartNumber?: number;
  Size?: number;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
}
export const ObjectPart = S.suspend(() =>
  S.Struct({
    PartNumber: S.optional(S.Number),
    Size: S.optional(S.Number),
    ChecksumCRC32: S.optional(S.String),
    ChecksumCRC32C: S.optional(S.String),
    ChecksumCRC64NVME: S.optional(S.String),
    ChecksumSHA1: S.optional(S.String),
    ChecksumSHA256: S.optional(S.String),
  }),
).annotations({ identifier: "ObjectPart" }) as any as S.Schema<ObjectPart>;
export type PartsList = ObjectPart[];
export const PartsList = S.Array(ObjectPart);
export type S3TablesBucketType = "aws" | "customer" | (string & {});
export const S3TablesBucketType = S.String;
export interface Encryption {
  EncryptionType: ServerSideEncryption;
  KMSKeyId?: string | redacted.Redacted<string>;
  KMSContext?: string;
}
export const Encryption = S.suspend(() =>
  S.Struct({
    EncryptionType: ServerSideEncryption,
    KMSKeyId: S.optional(SensitiveString),
    KMSContext: S.optional(S.String),
  }),
).annotations({ identifier: "Encryption" }) as any as S.Schema<Encryption>;
export interface MetadataEntry {
  Name?: string;
  Value?: string;
}
export const MetadataEntry = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "MetadataEntry",
}) as any as S.Schema<MetadataEntry>;
export type UserMetadata = MetadataEntry[];
export const UserMetadata = S.Array(
  MetadataEntry.pipe(T.XmlName("MetadataEntry")).annotations({
    identifier: "MetadataEntry",
  }),
);
export interface CopyObjectResult {
  ETag?: string;
  LastModified?: Date;
  ChecksumType?: ChecksumType;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
}
export const CopyObjectResult = S.suspend(() =>
  S.Struct({
    ETag: S.optional(S.String),
    LastModified: S.optional(S.Date),
    ChecksumType: S.optional(ChecksumType),
    ChecksumCRC32: S.optional(S.String),
    ChecksumCRC32C: S.optional(S.String),
    ChecksumCRC64NVME: S.optional(S.String),
    ChecksumSHA1: S.optional(S.String),
    ChecksumSHA256: S.optional(S.String),
  }),
).annotations({
  identifier: "CopyObjectResult",
}) as any as S.Schema<CopyObjectResult>;
export interface GetObjectAttributesParts {
  TotalPartsCount?: number;
  PartNumberMarker?: string;
  NextPartNumberMarker?: string;
  MaxParts?: number;
  IsTruncated?: boolean;
  Parts?: ObjectPart[];
}
export const GetObjectAttributesParts = S.suspend(() =>
  S.Struct({
    TotalPartsCount: S.optional(S.Number).pipe(T.XmlName("PartsCount")),
    PartNumberMarker: S.optional(S.String),
    NextPartNumberMarker: S.optional(S.String),
    MaxParts: S.optional(S.Number),
    IsTruncated: S.optional(S.Boolean),
    Parts: S.optional(PartsList).pipe(T.XmlName("Part"), T.XmlFlattened()),
  }),
).annotations({
  identifier: "GetObjectAttributesParts",
}) as any as S.Schema<GetObjectAttributesParts>;
export interface WebsiteConfiguration {
  ErrorDocument?: ErrorDocument;
  IndexDocument?: IndexDocument;
  RedirectAllRequestsTo?: RedirectAllRequestsTo;
  RoutingRules?: RoutingRule[];
}
export const WebsiteConfiguration = S.suspend(() =>
  S.Struct({
    ErrorDocument: S.optional(ErrorDocument),
    IndexDocument: S.optional(IndexDocument),
    RedirectAllRequestsTo: S.optional(RedirectAllRequestsTo),
    RoutingRules: S.optional(RoutingRules),
  }),
).annotations({
  identifier: "WebsiteConfiguration",
}) as any as S.Schema<WebsiteConfiguration>;
export interface DestinationResult {
  TableBucketType?: S3TablesBucketType;
  TableBucketArn?: string;
  TableNamespace?: string;
}
export const DestinationResult = S.suspend(() =>
  S.Struct({
    TableBucketType: S.optional(S3TablesBucketType),
    TableBucketArn: S.optional(S.String),
    TableNamespace: S.optional(S.String),
  }),
).annotations({
  identifier: "DestinationResult",
}) as any as S.Schema<DestinationResult>;
export interface JournalTableConfigurationResult {
  TableStatus: string;
  Error?: ErrorDetails;
  TableName: string;
  TableArn?: string;
  RecordExpiration: RecordExpiration;
}
export const JournalTableConfigurationResult = S.suspend(() =>
  S.Struct({
    TableStatus: S.String,
    Error: S.optional(ErrorDetails),
    TableName: S.String,
    TableArn: S.optional(S.String),
    RecordExpiration: RecordExpiration,
  }),
).annotations({
  identifier: "JournalTableConfigurationResult",
}) as any as S.Schema<JournalTableConfigurationResult>;
export interface InventoryTableConfigurationResult {
  ConfigurationState: InventoryConfigurationState;
  TableStatus?: string;
  Error?: ErrorDetails;
  TableName?: string;
  TableArn?: string;
}
export const InventoryTableConfigurationResult = S.suspend(() =>
  S.Struct({
    ConfigurationState: InventoryConfigurationState,
    TableStatus: S.optional(S.String),
    Error: S.optional(ErrorDetails),
    TableName: S.optional(S.String),
    TableArn: S.optional(S.String),
  }),
).annotations({
  identifier: "InventoryTableConfigurationResult",
}) as any as S.Schema<InventoryTableConfigurationResult>;
export interface S3TablesDestinationResult {
  TableBucketArn: string;
  TableName: string;
  TableArn: string;
  TableNamespace: string;
}
export const S3TablesDestinationResult = S.suspend(() =>
  S.Struct({
    TableBucketArn: S.String,
    TableName: S.String,
    TableArn: S.String,
    TableNamespace: S.String,
  }),
).annotations({
  identifier: "S3TablesDestinationResult",
}) as any as S.Schema<S3TablesDestinationResult>;
export interface S3Location {
  BucketName: string;
  Prefix: string;
  Encryption?: Encryption;
  CannedACL?: ObjectCannedACL;
  AccessControlList?: Grant[];
  Tagging?: Tagging;
  UserMetadata?: MetadataEntry[];
  StorageClass?: StorageClass;
}
export const S3Location = S.suspend(() =>
  S.Struct({
    BucketName: S.String,
    Prefix: S.String,
    Encryption: S.optional(Encryption),
    CannedACL: S.optional(ObjectCannedACL),
    AccessControlList: S.optional(Grants),
    Tagging: S.optional(Tagging),
    UserMetadata: S.optional(UserMetadata),
    StorageClass: S.optional(StorageClass),
  }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface CompleteMultipartUploadOutput {
  Location?: string;
  Bucket?: string;
  Key?: string;
  Expiration?: string;
  ETag?: string;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumCRC64NVME?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  ChecksumType?: ChecksumType;
  ServerSideEncryption?: ServerSideEncryption;
  VersionId?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  RequestCharged?: RequestCharged;
}
export const CompleteMultipartUploadOutput = S.suspend(() =>
  S.Struct({
    Location: S.optional(S.String),
    Bucket: S.optional(S.String),
    Key: S.optional(S.String),
    Expiration: S.optional(S.String).pipe(T.HttpHeader("x-amz-expiration")),
    ETag: S.optional(S.String),
    ChecksumCRC32: S.optional(S.String),
    ChecksumCRC32C: S.optional(S.String),
    ChecksumCRC64NVME: S.optional(S.String),
    ChecksumSHA1: S.optional(S.String),
    ChecksumSHA256: S.optional(S.String),
    ChecksumType: S.optional(ChecksumType),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(T.all(T.XmlName("CompleteMultipartUploadResult"), ns)),
).annotations({
  identifier: "CompleteMultipartUploadOutput",
}) as any as S.Schema<CompleteMultipartUploadOutput>;
export interface CopyObjectOutput {
  CopyObjectResult?: CopyObjectResult;
  Expiration?: string;
  CopySourceVersionId?: string;
  VersionId?: string;
  ServerSideEncryption?: ServerSideEncryption;
  SSECustomerAlgorithm?: string;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string | redacted.Redacted<string>;
  SSEKMSEncryptionContext?: string | redacted.Redacted<string>;
  BucketKeyEnabled?: boolean;
  RequestCharged?: RequestCharged;
}
export const CopyObjectOutput = S.suspend(() =>
  S.Struct({
    CopyObjectResult: S.optional(CopyObjectResult)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CopyObjectResult" }),
    Expiration: S.optional(S.String).pipe(T.HttpHeader("x-amz-expiration")),
    CopySourceVersionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-copy-source-version-id"),
    ),
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    ServerSideEncryption: S.optional(ServerSideEncryption).pipe(
      T.HttpHeader("x-amz-server-side-encryption"),
    ),
    SSECustomerAlgorithm: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-algorithm"),
    ),
    SSECustomerKeyMD5: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-server-side-encryption-customer-key-MD5"),
    ),
    SSEKMSKeyId: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-aws-kms-key-id"),
    ),
    SSEKMSEncryptionContext: S.optional(SensitiveString).pipe(
      T.HttpHeader("x-amz-server-side-encryption-context"),
    ),
    BucketKeyEnabled: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-server-side-encryption-bucket-key-enabled"),
    ),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "CopyObjectOutput",
}) as any as S.Schema<CopyObjectOutput>;
export interface CreateBucketOutput {
  Location?: string;
  BucketArn?: string;
}
export const CreateBucketOutput = S.suspend(() =>
  S.Struct({
    Location: S.optional(S.String).pipe(T.HttpHeader("Location")),
    BucketArn: S.optional(S.String).pipe(T.HttpHeader("x-amz-bucket-arn")),
  }).pipe(ns),
).annotations({
  identifier: "CreateBucketOutput",
}) as any as S.Schema<CreateBucketOutput>;
export interface GetObjectAttributesOutput {
  DeleteMarker?: boolean;
  LastModified?: Date;
  VersionId?: string;
  RequestCharged?: RequestCharged;
  ETag?: string;
  Checksum?: Checksum;
  ObjectParts?: GetObjectAttributesParts;
  StorageClass?: StorageClass;
  ObjectSize?: number;
}
export const GetObjectAttributesOutput = S.suspend(() =>
  S.Struct({
    DeleteMarker: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-delete-marker"),
    ),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Last-Modified"),
    ),
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
    ETag: S.optional(S.String),
    Checksum: S.optional(Checksum),
    ObjectParts: S.optional(GetObjectAttributesParts),
    StorageClass: S.optional(StorageClass),
    ObjectSize: S.optional(S.Number),
  }).pipe(T.all(T.XmlName("GetObjectAttributesResponse"), ns)),
).annotations({
  identifier: "GetObjectAttributesOutput",
}) as any as S.Schema<GetObjectAttributesOutput>;
export interface ListObjectsOutput {
  IsTruncated?: boolean;
  Marker?: string;
  NextMarker?: string;
  Contents?: Object[];
  Name?: string;
  Prefix?: string;
  Delimiter?: string;
  MaxKeys?: number;
  CommonPrefixes?: CommonPrefix[];
  EncodingType?: EncodingType;
  RequestCharged?: RequestCharged;
}
export const ListObjectsOutput = S.suspend(() =>
  S.Struct({
    IsTruncated: S.optional(S.Boolean),
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    Contents: S.optional(ObjectList).pipe(T.XmlFlattened()),
    Name: S.optional(S.String),
    Prefix: S.optional(S.String),
    Delimiter: S.optional(S.String),
    MaxKeys: S.optional(S.Number),
    CommonPrefixes: S.optional(CommonPrefixList).pipe(T.XmlFlattened()),
    EncodingType: S.optional(EncodingType),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(T.all(T.XmlName("ListBucketResult"), ns)),
).annotations({
  identifier: "ListObjectsOutput",
}) as any as S.Schema<ListObjectsOutput>;
export interface PutBucketAclRequest {
  ACL?: BucketCannedACL;
  AccessControlPolicy?: AccessControlPolicy;
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  GrantFullControl?: string;
  GrantRead?: string;
  GrantReadACP?: string;
  GrantWrite?: string;
  GrantWriteACP?: string;
  ExpectedBucketOwner?: string;
}
export const PutBucketAclRequest = S.suspend(() =>
  S.Struct({
    ACL: S.optional(BucketCannedACL).pipe(T.HttpHeader("x-amz-acl")),
    AccessControlPolicy: S.optional(AccessControlPolicy)
      .pipe(T.HttpPayload(), T.XmlName("AccessControlPolicy"))
      .annotations({ identifier: "AccessControlPolicy" }),
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
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
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?acl" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketAclRequest",
}) as any as S.Schema<PutBucketAclRequest>;
export interface PutBucketAclResponse {}
export const PutBucketAclResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketAclResponse",
}) as any as S.Schema<PutBucketAclResponse>;
export interface PutBucketEncryptionRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration;
  ExpectedBucketOwner?: string;
}
export const PutBucketEncryptionRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("ServerSideEncryptionConfiguration"),
    ).annotations({ identifier: "ServerSideEncryptionConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketEncryptionRequest",
}) as any as S.Schema<PutBucketEncryptionRequest>;
export interface PutBucketEncryptionResponse {}
export const PutBucketEncryptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketEncryptionResponse",
}) as any as S.Schema<PutBucketEncryptionResponse>;
export interface PutBucketIntelligentTieringConfigurationRequest {
  Bucket: string;
  Id: string;
  ExpectedBucketOwner?: string;
  IntelligentTieringConfiguration: IntelligentTieringConfiguration;
}
export const PutBucketIntelligentTieringConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    IntelligentTieringConfiguration: IntelligentTieringConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("IntelligentTieringConfiguration"),
    ).annotations({ identifier: "IntelligentTieringConfiguration" }),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?intelligent-tiering" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketIntelligentTieringConfigurationRequest",
}) as any as S.Schema<PutBucketIntelligentTieringConfigurationRequest>;
export interface PutBucketIntelligentTieringConfigurationResponse {}
export const PutBucketIntelligentTieringConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketIntelligentTieringConfigurationResponse",
}) as any as S.Schema<PutBucketIntelligentTieringConfigurationResponse>;
export interface PutBucketMetricsConfigurationRequest {
  Bucket: string;
  Id: string;
  MetricsConfiguration: MetricsConfiguration;
  ExpectedBucketOwner?: string;
}
export const PutBucketMetricsConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    MetricsConfiguration: MetricsConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("MetricsConfiguration"),
    ).annotations({ identifier: "MetricsConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketMetricsConfigurationRequest",
}) as any as S.Schema<PutBucketMetricsConfigurationRequest>;
export interface PutBucketMetricsConfigurationResponse {}
export const PutBucketMetricsConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketMetricsConfigurationResponse",
}) as any as S.Schema<PutBucketMetricsConfigurationResponse>;
export interface PutBucketWebsiteRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  WebsiteConfiguration: WebsiteConfiguration;
  ExpectedBucketOwner?: string;
}
export const PutBucketWebsiteRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    WebsiteConfiguration: WebsiteConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("WebsiteConfiguration"),
    ).annotations({ identifier: "WebsiteConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?website" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketWebsiteRequest",
}) as any as S.Schema<PutBucketWebsiteRequest>;
export interface PutBucketWebsiteResponse {}
export const PutBucketWebsiteResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketWebsiteResponse",
}) as any as S.Schema<PutBucketWebsiteResponse>;
export interface PutObjectLockConfigurationRequest {
  Bucket: string;
  ObjectLockConfiguration?: ObjectLockConfiguration;
  RequestPayer?: RequestPayer;
  Token?: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ExpectedBucketOwner?: string;
}
export const PutObjectLockConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ObjectLockConfiguration: S.optional(ObjectLockConfiguration)
      .pipe(T.HttpPayload(), T.XmlName("ObjectLockConfiguration"))
      .annotations({ identifier: "ObjectLockConfiguration" }),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    Token: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-bucket-object-lock-token"),
    ),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?object-lock" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
    ),
  ),
).annotations({
  identifier: "PutObjectLockConfigurationRequest",
}) as any as S.Schema<PutObjectLockConfigurationRequest>;
export interface MetadataConfigurationResult {
  DestinationResult: DestinationResult;
  JournalTableConfigurationResult?: JournalTableConfigurationResult;
  InventoryTableConfigurationResult?: InventoryTableConfigurationResult;
}
export const MetadataConfigurationResult = S.suspend(() =>
  S.Struct({
    DestinationResult: DestinationResult,
    JournalTableConfigurationResult: S.optional(
      JournalTableConfigurationResult,
    ),
    InventoryTableConfigurationResult: S.optional(
      InventoryTableConfigurationResult,
    ),
  }),
).annotations({
  identifier: "MetadataConfigurationResult",
}) as any as S.Schema<MetadataConfigurationResult>;
export interface MetadataTableConfigurationResult {
  S3TablesDestinationResult: S3TablesDestinationResult;
}
export const MetadataTableConfigurationResult = S.suspend(() =>
  S.Struct({ S3TablesDestinationResult: S3TablesDestinationResult }),
).annotations({
  identifier: "MetadataTableConfigurationResult",
}) as any as S.Schema<MetadataTableConfigurationResult>;
export interface OutputLocation {
  S3?: S3Location;
}
export const OutputLocation = S.suspend(() =>
  S.Struct({ S3: S.optional(S3Location) }),
).annotations({
  identifier: "OutputLocation",
}) as any as S.Schema<OutputLocation>;
export interface ContinuationEvent {}
export const ContinuationEvent = S.suspend(() => S.Struct({})).annotations({
  identifier: "ContinuationEvent",
}) as any as S.Schema<ContinuationEvent>;
export interface EndEvent {}
export const EndEvent = S.suspend(() => S.Struct({})).annotations({
  identifier: "EndEvent",
}) as any as S.Schema<EndEvent>;
export interface DeletedObject {
  Key?: string;
  VersionId?: string;
  DeleteMarker?: boolean;
  DeleteMarkerVersionId?: string;
}
export const DeletedObject = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    VersionId: S.optional(S.String),
    DeleteMarker: S.optional(S.Boolean),
    DeleteMarkerVersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeletedObject",
}) as any as S.Schema<DeletedObject>;
export type DeletedObjects = DeletedObject[];
export const DeletedObjects = S.Array(DeletedObject);
export interface Error {
  Key?: string;
  VersionId?: string;
  Code?: string;
  Message?: string;
}
export const Error = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    VersionId: S.optional(S.String),
    Code: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({ identifier: "Error" }) as any as S.Schema<Error>;
export type Errors = Error[];
export const Errors = S.Array(Error);
export interface GetBucketMetadataConfigurationResult {
  MetadataConfigurationResult: MetadataConfigurationResult;
}
export const GetBucketMetadataConfigurationResult = S.suspend(() =>
  S.Struct({ MetadataConfigurationResult: MetadataConfigurationResult }),
).annotations({
  identifier: "GetBucketMetadataConfigurationResult",
}) as any as S.Schema<GetBucketMetadataConfigurationResult>;
export interface GetBucketMetadataTableConfigurationResult {
  MetadataTableConfigurationResult: MetadataTableConfigurationResult;
  Status: string;
  Error?: ErrorDetails;
}
export const GetBucketMetadataTableConfigurationResult = S.suspend(() =>
  S.Struct({
    MetadataTableConfigurationResult: MetadataTableConfigurationResult,
    Status: S.String,
    Error: S.optional(ErrorDetails),
  }),
).annotations({
  identifier: "GetBucketMetadataTableConfigurationResult",
}) as any as S.Schema<GetBucketMetadataTableConfigurationResult>;
export interface BucketLifecycleConfiguration {
  Rules: LifecycleRule[];
}
export const BucketLifecycleConfiguration = S.suspend(() =>
  S.Struct({ Rules: LifecycleRules.pipe(T.XmlName("Rule"), T.XmlFlattened()) }),
).annotations({
  identifier: "BucketLifecycleConfiguration",
}) as any as S.Schema<BucketLifecycleConfiguration>;
export interface BucketLoggingStatus {
  LoggingEnabled?: LoggingEnabled;
}
export const BucketLoggingStatus = S.suspend(() =>
  S.Struct({ LoggingEnabled: S.optional(LoggingEnabled) }),
).annotations({
  identifier: "BucketLoggingStatus",
}) as any as S.Schema<BucketLoggingStatus>;
export interface RestoreRequest {
  Days?: number;
  GlacierJobParameters?: GlacierJobParameters;
  Type?: RestoreRequestType;
  Tier?: Tier;
  Description?: string;
  SelectParameters?: SelectParameters;
  OutputLocation?: OutputLocation;
}
export const RestoreRequest = S.suspend(() =>
  S.Struct({
    Days: S.optional(S.Number),
    GlacierJobParameters: S.optional(GlacierJobParameters),
    Type: S.optional(RestoreRequestType),
    Tier: S.optional(Tier),
    Description: S.optional(S.String),
    SelectParameters: S.optional(SelectParameters),
    OutputLocation: S.optional(OutputLocation),
  }),
).annotations({
  identifier: "RestoreRequest",
}) as any as S.Schema<RestoreRequest>;
export interface DeleteObjectsOutput {
  Deleted?: DeletedObject[];
  RequestCharged?: RequestCharged;
  Errors?: Error[];
}
export const DeleteObjectsOutput = S.suspend(() =>
  S.Struct({
    Deleted: S.optional(DeletedObjects).pipe(T.XmlFlattened()),
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
    Errors: S.optional(Errors).pipe(T.XmlName("Error"), T.XmlFlattened()),
  }).pipe(T.all(T.XmlName("DeleteResult"), ns)),
).annotations({
  identifier: "DeleteObjectsOutput",
}) as any as S.Schema<DeleteObjectsOutput>;
export interface GetBucketMetadataConfigurationOutput {
  GetBucketMetadataConfigurationResult?: GetBucketMetadataConfigurationResult;
}
export const GetBucketMetadataConfigurationOutput = S.suspend(() =>
  S.Struct({
    GetBucketMetadataConfigurationResult: S.optional(
      GetBucketMetadataConfigurationResult,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "GetBucketMetadataConfigurationResult" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketMetadataConfigurationOutput",
}) as any as S.Schema<GetBucketMetadataConfigurationOutput>;
export interface GetBucketMetadataTableConfigurationOutput {
  GetBucketMetadataTableConfigurationResult?: GetBucketMetadataTableConfigurationResult;
}
export const GetBucketMetadataTableConfigurationOutput = S.suspend(() =>
  S.Struct({
    GetBucketMetadataTableConfigurationResult: S.optional(
      GetBucketMetadataTableConfigurationResult,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "GetBucketMetadataTableConfigurationResult" }),
  }).pipe(ns),
).annotations({
  identifier: "GetBucketMetadataTableConfigurationOutput",
}) as any as S.Schema<GetBucketMetadataTableConfigurationOutput>;
export interface PutBucketLifecycleConfigurationRequest {
  Bucket: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  LifecycleConfiguration?: BucketLifecycleConfiguration;
  ExpectedBucketOwner?: string;
  TransitionDefaultMinimumObjectSize?: TransitionDefaultMinimumObjectSize;
}
export const PutBucketLifecycleConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    LifecycleConfiguration: S.optional(BucketLifecycleConfiguration)
      .pipe(T.HttpPayload(), T.XmlName("LifecycleConfiguration"))
      .annotations({ identifier: "BucketLifecycleConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    TransitionDefaultMinimumObjectSize: S.optional(
      TransitionDefaultMinimumObjectSize,
    ).pipe(T.HttpHeader("x-amz-transition-default-minimum-object-size")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?lifecycle" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketLifecycleConfigurationRequest",
}) as any as S.Schema<PutBucketLifecycleConfigurationRequest>;
export interface PutBucketLoggingRequest {
  Bucket: string;
  BucketLoggingStatus: BucketLoggingStatus;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ExpectedBucketOwner?: string;
}
export const PutBucketLoggingRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    BucketLoggingStatus: BucketLoggingStatus.pipe(
      T.HttpPayload(),
      T.XmlName("BucketLoggingStatus"),
    ).annotations({ identifier: "BucketLoggingStatus" }),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?logging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketLoggingRequest",
}) as any as S.Schema<PutBucketLoggingRequest>;
export interface PutBucketLoggingResponse {}
export const PutBucketLoggingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketLoggingResponse",
}) as any as S.Schema<PutBucketLoggingResponse>;
export interface PutObjectLockConfigurationOutput {
  RequestCharged?: RequestCharged;
}
export const PutObjectLockConfigurationOutput = S.suspend(() =>
  S.Struct({
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "PutObjectLockConfigurationOutput",
}) as any as S.Schema<PutObjectLockConfigurationOutput>;
export interface RestoreObjectRequest {
  Bucket: string;
  Key: string;
  VersionId?: string;
  RestoreRequest?: RestoreRequest;
  RequestPayer?: RequestPayer;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ExpectedBucketOwner?: string;
}
export const RestoreObjectRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel("Key")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    RestoreRequest: S.optional(RestoreRequest)
      .pipe(T.HttpPayload(), T.XmlName("RestoreRequest"))
      .annotations({ identifier: "RestoreRequest" }),
    RequestPayer: S.optional(RequestPayer).pipe(
      T.HttpHeader("x-amz-request-payer"),
    ),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/{Bucket}/{Key+}?restore" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
      }),
    ),
  ),
).annotations({
  identifier: "RestoreObjectRequest",
}) as any as S.Schema<RestoreObjectRequest>;
export interface TopicConfiguration {
  Id?: string;
  TopicArn: string;
  Events: Event[];
  Filter?: NotificationConfigurationFilter;
}
export const TopicConfiguration = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    TopicArn: S.String.pipe(T.XmlName("Topic")),
    Events: EventList.pipe(T.XmlName("Event"), T.XmlFlattened()),
    Filter: S.optional(NotificationConfigurationFilter),
  }),
).annotations({
  identifier: "TopicConfiguration",
}) as any as S.Schema<TopicConfiguration>;
export type TopicConfigurationList = TopicConfiguration[];
export const TopicConfigurationList = S.Array(TopicConfiguration);
export interface RecordsEvent {
  Payload?: Uint8Array;
}
export const RecordsEvent = S.suspend(() =>
  S.Struct({ Payload: S.optional(T.Blob).pipe(T.EventPayload()) }),
).annotations({ identifier: "RecordsEvent" }) as any as S.Schema<RecordsEvent>;
export interface NotificationConfiguration {
  TopicConfigurations?: TopicConfiguration[];
  QueueConfigurations?: QueueConfiguration[];
  LambdaFunctionConfigurations?: LambdaFunctionConfiguration[];
  EventBridgeConfiguration?: EventBridgeConfiguration;
}
export const NotificationConfiguration = S.suspend(() =>
  S.Struct({
    TopicConfigurations: S.optional(TopicConfigurationList).pipe(
      T.XmlName("TopicConfiguration"),
      T.XmlFlattened(),
    ),
    QueueConfigurations: S.optional(QueueConfigurationList).pipe(
      T.XmlName("QueueConfiguration"),
      T.XmlFlattened(),
    ),
    LambdaFunctionConfigurations: S.optional(
      LambdaFunctionConfigurationList,
    ).pipe(T.XmlName("CloudFunctionConfiguration"), T.XmlFlattened()),
    EventBridgeConfiguration: S.optional(EventBridgeConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "NotificationConfiguration",
}) as any as S.Schema<NotificationConfiguration>;
export interface Stats {
  BytesScanned?: number;
  BytesProcessed?: number;
  BytesReturned?: number;
}
export const Stats = S.suspend(() =>
  S.Struct({
    BytesScanned: S.optional(S.Number),
    BytesProcessed: S.optional(S.Number),
    BytesReturned: S.optional(S.Number),
  }),
).annotations({ identifier: "Stats" }) as any as S.Schema<Stats>;
export interface Progress {
  BytesScanned?: number;
  BytesProcessed?: number;
  BytesReturned?: number;
}
export const Progress = S.suspend(() =>
  S.Struct({
    BytesScanned: S.optional(S.Number),
    BytesProcessed: S.optional(S.Number),
    BytesReturned: S.optional(S.Number),
  }),
).annotations({ identifier: "Progress" }) as any as S.Schema<Progress>;
export interface PutBucketAnalyticsConfigurationRequest {
  Bucket: string;
  Id: string;
  AnalyticsConfiguration: AnalyticsConfiguration;
  ExpectedBucketOwner?: string;
}
export const PutBucketAnalyticsConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    AnalyticsConfiguration: AnalyticsConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("AnalyticsConfiguration"),
    ).annotations({ identifier: "AnalyticsConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?analytics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketAnalyticsConfigurationRequest",
}) as any as S.Schema<PutBucketAnalyticsConfigurationRequest>;
export interface PutBucketAnalyticsConfigurationResponse {}
export const PutBucketAnalyticsConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketAnalyticsConfigurationResponse",
}) as any as S.Schema<PutBucketAnalyticsConfigurationResponse>;
export interface PutBucketInventoryConfigurationRequest {
  Bucket: string;
  Id: string;
  InventoryConfiguration: InventoryConfiguration;
  ExpectedBucketOwner?: string;
}
export const PutBucketInventoryConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    Id: S.String.pipe(T.HttpQuery("id")),
    InventoryConfiguration: InventoryConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("InventoryConfiguration"),
    ).annotations({ identifier: "InventoryConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?inventory" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketInventoryConfigurationRequest",
}) as any as S.Schema<PutBucketInventoryConfigurationRequest>;
export interface PutBucketInventoryConfigurationResponse {}
export const PutBucketInventoryConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketInventoryConfigurationResponse",
}) as any as S.Schema<PutBucketInventoryConfigurationResponse>;
export interface PutBucketLifecycleConfigurationOutput {
  TransitionDefaultMinimumObjectSize?: TransitionDefaultMinimumObjectSize;
}
export const PutBucketLifecycleConfigurationOutput = S.suspend(() =>
  S.Struct({
    TransitionDefaultMinimumObjectSize: S.optional(
      TransitionDefaultMinimumObjectSize,
    ).pipe(T.HttpHeader("x-amz-transition-default-minimum-object-size")),
  }).pipe(ns),
).annotations({
  identifier: "PutBucketLifecycleConfigurationOutput",
}) as any as S.Schema<PutBucketLifecycleConfigurationOutput>;
export interface PutBucketNotificationConfigurationRequest {
  Bucket: string;
  NotificationConfiguration: NotificationConfiguration;
  ExpectedBucketOwner?: string;
  SkipDestinationValidation?: boolean;
}
export const PutBucketNotificationConfigurationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    NotificationConfiguration: NotificationConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("NotificationConfiguration"),
    ).annotations({ identifier: "NotificationConfiguration" }),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
    SkipDestinationValidation: S.optional(S.Boolean).pipe(
      T.HttpHeader("x-amz-skip-destination-validation"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?notification" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "PutBucketNotificationConfigurationRequest",
}) as any as S.Schema<PutBucketNotificationConfigurationRequest>;
export interface PutBucketNotificationConfigurationResponse {}
export const PutBucketNotificationConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBucketNotificationConfigurationResponse",
}) as any as S.Schema<PutBucketNotificationConfigurationResponse>;
export interface PutBucketReplicationRequest {
  Bucket: string;
  ContentMD5?: string;
  ChecksumAlgorithm?: ChecksumAlgorithm;
  ReplicationConfiguration: ReplicationConfiguration;
  Token?: string;
  ExpectedBucketOwner?: string;
}
export const PutBucketReplicationRequest = S.suspend(() =>
  S.Struct({
    Bucket: S.String.pipe(T.HttpLabel("Bucket"), T.ContextParam("Bucket")),
    ContentMD5: S.optional(S.String).pipe(T.HttpHeader("Content-MD5")),
    ChecksumAlgorithm: S.optional(ChecksumAlgorithm).pipe(
      T.HttpHeader("x-amz-sdk-checksum-algorithm"),
    ),
    ReplicationConfiguration: ReplicationConfiguration.pipe(
      T.HttpPayload(),
      T.XmlName("ReplicationConfiguration"),
    ).annotations({ identifier: "ReplicationConfiguration" }),
    Token: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-bucket-object-lock-token"),
    ),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-expected-bucket-owner"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Bucket}?replication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.AwsProtocolsHttpChecksum({
        requestAlgorithmMember: "ChecksumAlgorithm",
        requestChecksumRequired: true,
      }),
      T.StaticContextParams({ UseS3ExpressControlEndpoint: { value: true } }),
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
export interface RestoreObjectOutput {
  RequestCharged?: RequestCharged;
  RestoreOutputPath?: string;
}
export const RestoreObjectOutput = S.suspend(() =>
  S.Struct({
    RequestCharged: S.optional(RequestCharged).pipe(
      T.HttpHeader("x-amz-request-charged"),
    ),
    RestoreOutputPath: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-restore-output-path"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "RestoreObjectOutput",
}) as any as S.Schema<RestoreObjectOutput>;
export interface StatsEvent {
  Details?: Stats;
}
export const StatsEvent = S.suspend(() =>
  S.Struct({
    Details: S.optional(Stats)
      .pipe(T.EventPayload())
      .annotations({ identifier: "Stats" }),
  }),
).annotations({ identifier: "StatsEvent" }) as any as S.Schema<StatsEvent>;
export interface ProgressEvent {
  Details?: Progress;
}
export const ProgressEvent = S.suspend(() =>
  S.Struct({
    Details: S.optional(Progress)
      .pipe(T.EventPayload())
      .annotations({ identifier: "Progress" }),
  }),
).annotations({
  identifier: "ProgressEvent",
}) as any as S.Schema<ProgressEvent>;
export type SelectObjectContentEventStream =
  | {
      Records: RecordsEvent;
      Stats?: never;
      Progress?: never;
      Cont?: never;
      End?: never;
    }
  | {
      Records?: never;
      Stats: StatsEvent;
      Progress?: never;
      Cont?: never;
      End?: never;
    }
  | {
      Records?: never;
      Stats?: never;
      Progress: ProgressEvent;
      Cont?: never;
      End?: never;
    }
  | {
      Records?: never;
      Stats?: never;
      Progress?: never;
      Cont: ContinuationEvent;
      End?: never;
    }
  | {
      Records?: never;
      Stats?: never;
      Progress?: never;
      Cont?: never;
      End: EndEvent;
    };
export const SelectObjectContentEventStream = T.EventStream(
  S.Union(
    S.Struct({ Records: RecordsEvent }),
    S.Struct({ Stats: StatsEvent }),
    S.Struct({ Progress: ProgressEvent }),
    S.Struct({ Cont: ContinuationEvent }),
    S.Struct({ End: EndEvent }),
  ),
) as any as S.Schema<
  stream.Stream<SelectObjectContentEventStream, Error, never>
>;
export interface SelectObjectContentOutput {
  Payload?: stream.Stream<SelectObjectContentEventStream, Error, never>;
}
export const SelectObjectContentOutput = S.suspend(() =>
  S.Struct({
    Payload: S.optional(SelectObjectContentEventStream).pipe(T.HttpPayload()),
  }).pipe(ns),
).annotations({
  identifier: "SelectObjectContentOutput",
}) as any as S.Schema<SelectObjectContentOutput>;

//# Errors
export class BucketNotEmpty extends S.TaggedError<BucketNotEmpty>()(
  "BucketNotEmpty",
  {},
) {}
export class NoSuchBucket extends S.TaggedError<NoSuchBucket>()(
  "NoSuchBucket",
  {},
) {}
export class SignatureDoesNotMatch extends S.TaggedError<SignatureDoesNotMatch>()(
  "SignatureDoesNotMatch",
  {},
) {}
export class AccessDenied extends S.TaggedError<AccessDenied>()(
  "AccessDenied",
  {},
) {}
export class InvalidBucketName extends S.TaggedError<InvalidBucketName>()(
  "InvalidBucketName",
  {},
) {}
export class InvalidDigest extends S.TaggedError<InvalidDigest>()(
  "InvalidDigest",
  {},
) {}
export class InvalidRequest extends S.TaggedError<InvalidRequest>()(
  "InvalidRequest",
  {},
) {}
export class MalformedPolicy extends S.TaggedError<MalformedPolicy>()(
  "MalformedPolicy",
  {},
) {}
export class PermanentRedirect extends S.TaggedError<PermanentRedirect>()(
  "PermanentRedirect",
  {},
) {}
export class IdempotencyParameterMismatch extends S.TaggedError<IdempotencyParameterMismatch>()(
  "IdempotencyParameterMismatch",
  {},
).pipe(C.withBadRequestError) {}
export class NoSuchUpload extends S.TaggedError<NoSuchUpload>()(
  "NoSuchUpload",
  {},
).pipe(C.withBadRequestError) {}
export class NoSuchKey extends S.TaggedError<NoSuchKey>()("NoSuchKey", {}) {}
export class NoSuchConfiguration extends S.TaggedError<NoSuchConfiguration>()(
  "NoSuchConfiguration",
  {},
) {}
export class NoSuchCORSConfiguration extends S.TaggedError<NoSuchCORSConfiguration>()(
  "NoSuchCORSConfiguration",
  {},
) {}
export class ParseError extends S.TaggedError<ParseError>()("ParseError", {}) {}
export class NoSuchLifecycleConfiguration extends S.TaggedError<NoSuchLifecycleConfiguration>()(
  "NoSuchLifecycleConfiguration",
  {},
) {}
export class NoSuchBucketPolicy extends S.TaggedError<NoSuchBucketPolicy>()(
  "NoSuchBucketPolicy",
  {},
) {}
export class ReplicationConfigurationNotFoundError extends S.TaggedError<ReplicationConfigurationNotFoundError>()(
  "ReplicationConfigurationNotFoundError",
  {},
) {}
export class NoSuchTagSet extends S.TaggedError<NoSuchTagSet>()(
  "NoSuchTagSet",
  {},
) {}
export class NoSuchWebsiteConfiguration extends S.TaggedError<NoSuchWebsiteConfiguration>()(
  "NoSuchWebsiteConfiguration",
  {},
) {}
export class ObjectLockConfigurationNotFoundError extends S.TaggedError<ObjectLockConfigurationNotFoundError>()(
  "ObjectLockConfigurationNotFoundError",
  {},
) {}
export class NotFound extends S.TaggedError<NotFound>()("NotFound", {}) {}
export class EncryptionTypeMismatch extends S.TaggedError<EncryptionTypeMismatch>()(
  "EncryptionTypeMismatch",
  {},
).pipe(C.withBadRequestError) {}
export class InvalidWriteOffset extends S.TaggedError<InvalidWriteOffset>()(
  "InvalidWriteOffset",
  {},
).pipe(C.withBadRequestError) {}
export class TooManyParts extends S.TaggedError<TooManyParts>()(
  "TooManyParts",
  {},
).pipe(C.withBadRequestError) {}
export class InvalidObjectState extends S.TaggedError<InvalidObjectState>()(
  "InvalidObjectState",
  {
    StorageClass: S.optional(StorageClass),
    AccessTier: S.optional(IntelligentTieringAccessTier),
  },
).pipe(C.withAuthError) {}
export class RequestError extends S.TaggedError<RequestError>()(
  "RequestError",
  {},
) {}
export class MalformedXML extends S.TaggedError<MalformedXML>()(
  "MalformedXML",
  {},
) {}
export class ObjectNotInActiveTierError extends S.TaggedError<ObjectNotInActiveTierError>()(
  "ObjectNotInActiveTierError",
  {},
).pipe(C.withAuthError) {}
export class BucketAlreadyExists extends S.TaggedError<BucketAlreadyExists>()(
  "BucketAlreadyExists",
  {},
).pipe(C.withConflictError) {}
export class BucketAlreadyOwnedByYou extends S.TaggedError<BucketAlreadyOwnedByYou>()(
  "BucketAlreadyOwnedByYou",
  {},
).pipe(C.withConflictError) {}
export class IllegalLocationConstraintException extends S.TaggedError<IllegalLocationConstraintException>()(
  "IllegalLocationConstraintException",
  {},
) {}
export class InvalidArgument extends S.TaggedError<InvalidArgument>()(
  "InvalidArgument",
  {},
) {}
export class InvalidLocationConstraint extends S.TaggedError<InvalidLocationConstraint>()(
  "InvalidLocationConstraint",
  {},
) {}
export class InvalidBucketState extends S.TaggedError<InvalidBucketState>()(
  "InvalidBucketState",
  {},
) {}
export class ObjectAlreadyInActiveTierError extends S.TaggedError<ObjectAlreadyInActiveTierError>()(
  "ObjectAlreadyInActiveTierError",
  {},
).pipe(C.withAuthError) {}

//# Operations
/**
 * Deletes the S3 bucket. All objects (including all object versions and delete markers) in the bucket
 * must be deleted before the bucket itself can be deleted.
 *
 * - **Directory buckets** - If multipart uploads in a
 * directory bucket are in progress, you can't delete the bucket until all the in-progress multipart
 * uploads are aborted or completed.
 *
 * - **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - You must have the
 * `s3:DeleteBucket` permission on the specified bucket in a policy.
 *
 * - **Directory bucket permissions** - You must have the
 * `s3express:DeleteBucket` permission in an IAM identity-based policy instead of a bucket policy.
 * Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource. For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region-code*.amazonaws.com`.
 *
 * The following operations are related to `DeleteBucket`:
 *
 * - CreateBucket
 *
 * - DeleteObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucket: (
  input: DeleteBucketRequest,
) => effect.Effect<
  DeleteBucketResponse,
  BucketNotEmpty | NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketRequest,
  output: DeleteBucketResponse,
  errors: [BucketNotEmpty, NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Deletes an analytics configuration for the bucket (specified by the analytics configuration
 * ID).
 *
 * To use this operation, you must have permissions to perform the
 * `s3:PutAnalyticsConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For information about the Amazon S3 analytics feature, see Amazon S3 Analytics – Storage Class
 * Analysis.
 *
 * The following operations are related to `DeleteBucketAnalyticsConfiguration`:
 *
 * - GetBucketAnalyticsConfiguration
 *
 * - ListBucketAnalyticsConfigurations
 *
 * - PutBucketAnalyticsConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketAnalyticsConfiguration: (
  input: DeleteBucketAnalyticsConfigurationRequest,
) => effect.Effect<
  DeleteBucketAnalyticsConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketAnalyticsConfigurationRequest,
  output: DeleteBucketAnalyticsConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Deletes the `cors` configuration information set for the bucket.
 *
 * To use this operation, you must have permission to perform the `s3:PutBucketCORS` action.
 * The bucket owner has this permission by default and can grant this permission to others.
 *
 * For information about `cors`, see Enabling Cross-Origin Resource Sharing in the
 * *Amazon S3 User Guide*.
 *
 * **Related Resources**
 *
 * - PutBucketCors
 *
 * - RESTOPTIONSobject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketCors: (
  input: DeleteBucketCorsRequest,
) => effect.Effect<
  DeleteBucketCorsResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketCorsRequest,
  output: DeleteBucketCorsResponse,
  errors: [NoSuchBucket],
}));
/**
 * This implementation of the DELETE action resets the default encryption for the bucket as server-side
 * encryption with Amazon S3 managed keys (SSE-S3).
 *
 * - **General purpose buckets** - For information about the bucket
 * default encryption feature, see Amazon S3 Bucket Default Encryption in the
 * *Amazon S3 User Guide*.
 *
 * - **Directory buckets** -
 * For directory buckets, there are only two supported options for server-side encryption: SSE-S3 and SSE-KMS. For information about the default encryption configuration in
 * directory buckets, see Setting default server-side
 * encryption behavior for directory buckets.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - The
 * `s3:PutEncryptionConfiguration` permission is required in a policy. The bucket
 * owner has this permission by default. The bucket owner can grant this permission to others.
 * For more information about permissions, see Permissions Related to Bucket Operations and Managing Access Permissions to Your
 * Amazon S3 Resources.
 *
 * - **Directory bucket permissions** - To grant access to
 * this API operation, you must have the `s3express:PutEncryptionConfiguration`
 * permission in an IAM identity-based policy instead of a bucket policy. Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource.
 * For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region-code*.amazonaws.com`.
 *
 * The following operations are related to `DeleteBucketEncryption`:
 *
 * - PutBucketEncryption
 *
 * - GetBucketEncryption
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketEncryption: (
  input: DeleteBucketEncryptionRequest,
) => effect.Effect<
  DeleteBucketEncryptionResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketEncryptionRequest,
  output: DeleteBucketEncryptionResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Deletes the S3 Intelligent-Tiering configuration from the specified bucket.
 *
 * The S3 Intelligent-Tiering storage class is designed to optimize storage costs by automatically moving data to the most cost-effective storage access tier, without performance impact or operational overhead. S3 Intelligent-Tiering delivers automatic cost savings in three low latency and high throughput access tiers. To get the lowest storage cost on data that can be accessed in minutes to hours, you can choose to activate additional archiving capabilities.
 *
 * The S3 Intelligent-Tiering storage class is the ideal storage class for data with unknown, changing, or unpredictable access patterns, independent of object size or retention period. If the size of an object is less than 128 KB, it is not monitored and not eligible for auto-tiering. Smaller objects can be stored, but they are always charged at the Frequent Access tier rates in the S3 Intelligent-Tiering storage class.
 *
 * For more information, see Storage class for automatically optimizing frequently and infrequently accessed objects.
 *
 * Operations related to `DeleteBucketIntelligentTieringConfiguration` include:
 *
 * - GetBucketIntelligentTieringConfiguration
 *
 * - PutBucketIntelligentTieringConfiguration
 *
 * - ListBucketIntelligentTieringConfigurations
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketIntelligentTieringConfiguration: (
  input: DeleteBucketIntelligentTieringConfigurationRequest,
) => effect.Effect<
  DeleteBucketIntelligentTieringConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketIntelligentTieringConfigurationRequest,
  output: DeleteBucketIntelligentTieringConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Deletes an S3 Inventory configuration (identified by the inventory ID) from the bucket.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:PutInventoryConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For information about the Amazon S3 inventory feature, see Amazon S3 Inventory.
 *
 * Operations related to `DeleteBucketInventoryConfiguration` include:
 *
 * - GetBucketInventoryConfiguration
 *
 * - PutBucketInventoryConfiguration
 *
 * - ListBucketInventoryConfigurations
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketInventoryConfiguration: (
  input: DeleteBucketInventoryConfigurationRequest,
) => effect.Effect<
  DeleteBucketInventoryConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketInventoryConfigurationRequest,
  output: DeleteBucketInventoryConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * Deletes the lifecycle configuration from the specified bucket. Amazon S3 removes all the lifecycle
 * configuration rules in the lifecycle subresource associated with the bucket. Your objects never expire,
 * and Amazon S3 no longer automatically deletes any objects on the basis of rules contained in the deleted
 * lifecycle configuration.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - By default, all Amazon S3
 * resources are private, including buckets, objects, and related subresources (for example,
 * lifecycle configuration and website configuration). Only the resource owner (that is, the
 * Amazon Web Services account that created it) can access the resource. The resource owner can optionally
 * grant access permissions to others by writing an access policy. For this operation, a user
 * must have the `s3:PutLifecycleConfiguration` permission.
 *
 * For more information about permissions, see Managing Access Permissions to Your
 * Amazon S3 Resources.
 *
 * - **Directory bucket permissions** - You must have the
 * `s3express:PutLifecycleConfiguration` permission in an IAM identity-based policy
 * to use this operation. Cross-account access to this API operation isn't supported. The
 * resource owner can optionally grant access permissions to others by creating a role or user
 * for them as long as they are within the same account as the owner and resource.
 *
 * For more information about directory bucket policies and permissions, see Authorizing Regional endpoint APIs with IAM in the Amazon S3 User
 * Guide.
 *
 * **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * `s3express-control.*region*.amazonaws.com`.
 *
 * For more information about the object expiration, see Elements to
 * Describe Lifecycle Actions.
 *
 * Related actions include:
 *
 * - PutBucketLifecycleConfiguration
 *
 * - GetBucketLifecycleConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketLifecycle: (
  input: DeleteBucketLifecycleRequest,
) => effect.Effect<
  DeleteBucketLifecycleResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketLifecycleRequest,
  output: DeleteBucketLifecycleResponse,
  errors: [],
}));
/**
 * Deletes an S3 Metadata configuration from a general purpose bucket. For more information, see
 * Accelerating
 * data discovery with S3 Metadata in the *Amazon S3 User Guide*.
 *
 * You can use the V2 `DeleteBucketMetadataConfiguration` API operation with V1 or V2
 * metadata configurations. However, if you try to use the V1
 * `DeleteBucketMetadataTableConfiguration` API operation with V2 configurations, you
 * will receive an HTTP `405 Method Not Allowed` error.
 *
 * ### Permissions
 *
 * To use this operation, you must have the
 * `s3:DeleteBucketMetadataTableConfiguration` permission. For more information, see
 * Setting up permissions for configuring metadata tables in the
 * *Amazon S3 User Guide*.
 *
 * The IAM policy action name is the same for the V1 and V2 API operations.
 *
 * The following operations are related to `DeleteBucketMetadataConfiguration`:
 *
 * - CreateBucketMetadataConfiguration
 *
 * - GetBucketMetadataConfiguration
 *
 * - UpdateBucketMetadataInventoryTableConfiguration
 *
 * - UpdateBucketMetadataJournalTableConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketMetadataConfiguration: (
  input: DeleteBucketMetadataConfigurationRequest,
) => effect.Effect<
  DeleteBucketMetadataConfigurationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketMetadataConfigurationRequest,
  output: DeleteBucketMetadataConfigurationResponse,
  errors: [],
}));
/**
 * We recommend that you delete your S3 Metadata configurations by using the V2
 * DeleteBucketMetadataTableConfiguration API operation. We no longer recommend using
 * the V1 `DeleteBucketMetadataTableConfiguration` API operation.
 *
 * If you created your S3 Metadata configuration before July 15, 2025, we recommend that you delete
 * and re-create your configuration by using CreateBucketMetadataConfiguration so that you can expire journal table records and create
 * a live inventory table.
 *
 * Deletes a V1 S3 Metadata configuration from a general purpose bucket. For more information, see
 * Accelerating
 * data discovery with S3 Metadata in the *Amazon S3 User Guide*.
 *
 * You can use the V2 `DeleteBucketMetadataConfiguration` API operation with V1 or V2
 * metadata table configurations. However, if you try to use the V1
 * `DeleteBucketMetadataTableConfiguration` API operation with V2 configurations, you
 * will receive an HTTP `405 Method Not Allowed` error.
 *
 * Make sure that you update your processes to use the new V2 API operations
 * (`CreateBucketMetadataConfiguration`, `GetBucketMetadataConfiguration`, and
 * `DeleteBucketMetadataConfiguration`) instead of the V1 API operations.
 *
 * ### Permissions
 *
 * To use this operation, you must have the
 * `s3:DeleteBucketMetadataTableConfiguration` permission. For more information, see
 * Setting up permissions for configuring metadata tables in the
 * *Amazon S3 User Guide*.
 *
 * The following operations are related to `DeleteBucketMetadataTableConfiguration`:
 *
 * - CreateBucketMetadataTableConfiguration
 *
 * - GetBucketMetadataTableConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketMetadataTableConfiguration: (
  input: DeleteBucketMetadataTableConfigurationRequest,
) => effect.Effect<
  DeleteBucketMetadataTableConfigurationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketMetadataTableConfigurationRequest,
  output: DeleteBucketMetadataTableConfigurationResponse,
  errors: [],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Deletes a metrics configuration for the Amazon CloudWatch request metrics (specified by the metrics
 * configuration ID) from the bucket. Note that this doesn't include the daily storage metrics.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:PutMetricsConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For information about CloudWatch request metrics for Amazon S3, see Monitoring Metrics with Amazon CloudWatch.
 *
 * The following operations are related to `DeleteBucketMetricsConfiguration`:
 *
 * - GetBucketMetricsConfiguration
 *
 * - PutBucketMetricsConfiguration
 *
 * - ListBucketMetricsConfigurations
 *
 * - Monitoring
 * Metrics with Amazon CloudWatch
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketMetricsConfiguration: (
  input: DeleteBucketMetricsConfigurationRequest,
) => effect.Effect<
  DeleteBucketMetricsConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketMetricsConfigurationRequest,
  output: DeleteBucketMetricsConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Removes `OwnershipControls` for an Amazon S3 bucket. To use this operation, you must have the
 * `s3:PutBucketOwnershipControls` permission. For more information about Amazon S3 permissions,
 * see Specifying
 * Permissions in a Policy.
 *
 * For information about Amazon S3 Object Ownership, see Using Object Ownership.
 *
 * The following operations are related to `DeleteBucketOwnershipControls`:
 *
 * - GetBucketOwnershipControls
 *
 * - PutBucketOwnershipControls
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketOwnershipControls: (
  input: DeleteBucketOwnershipControlsRequest,
) => effect.Effect<
  DeleteBucketOwnershipControlsResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketOwnershipControlsRequest,
  output: DeleteBucketOwnershipControlsResponse,
  errors: [NoSuchBucket],
}));
/**
 * Deletes the policy of a specified bucket.
 *
 * **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * If you are using an identity other than the root user of the Amazon Web Services account that owns the
 * bucket, the calling identity must both have the `DeleteBucketPolicy` permissions on the
 * specified bucket and belong to the bucket owner's account in order to use this operation.
 *
 * If you don't have `DeleteBucketPolicy` permissions, Amazon S3 returns a 403 Access
 * Denied error. If you have the correct permissions, but you're not using an identity that
 * belongs to the bucket owner's account, Amazon S3 returns a `405 Method Not Allowed`
 * error.
 *
 * To ensure that bucket owners don't inadvertently lock themselves out of their own buckets,
 * the root principal in a bucket owner's Amazon Web Services account can perform the
 * `GetBucketPolicy`, `PutBucketPolicy`, and
 * `DeleteBucketPolicy` API actions, even if their bucket policy explicitly denies the
 * root principal's access. Bucket owner root principals can only be blocked from performing these
 * API actions by VPC endpoint policies and Amazon Web Services Organizations policies.
 *
 * - **General purpose bucket permissions** - The
 * `s3:DeleteBucketPolicy` permission is required in a policy. For more information
 * about general purpose buckets bucket policies, see Using Bucket Policies and User
 * Policies in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to
 * this API operation, you must have the `s3express:DeleteBucketPolicy` permission in
 * an IAM identity-based policy instead of a bucket policy. Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource.
 * For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region-code*.amazonaws.com`.
 *
 * The following operations are related to `DeleteBucketPolicy`
 *
 * - CreateBucket
 *
 * - DeleteObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketPolicy: (
  input: DeleteBucketPolicyRequest,
) => effect.Effect<
  DeleteBucketPolicyResponse,
  NoSuchBucket | SignatureDoesNotMatch | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketPolicyRequest,
  output: DeleteBucketPolicyResponse,
  errors: [NoSuchBucket, SignatureDoesNotMatch],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Deletes the replication configuration from the bucket.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:PutReplicationConfiguration` action. The bucket owner has these permissions by default
 * and can grant it to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * It can take a while for the deletion of a replication configuration to fully propagate.
 *
 * For information about replication configuration, see Replication in the
 * *Amazon S3 User Guide*.
 *
 * The following operations are related to `DeleteBucketReplication`:
 *
 * - PutBucketReplication
 *
 * - GetBucketReplication
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketReplication: (
  input: DeleteBucketReplicationRequest,
) => effect.Effect<
  DeleteBucketReplicationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketReplicationRequest,
  output: DeleteBucketReplicationResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Deletes tags from the general purpose bucket if attribute based access control (ABAC) is not enabled for the bucket. When you enable ABAC for a general purpose bucket, you can no longer use this operation for that bucket and must use UntagResource instead.
 *
 * if ABAC is not enabled for the bucket. When you enable ABAC for a general purpose bucket, you can no longer use this operation for that bucket and must use UntagResource instead.
 *
 * To use this operation, you must have permission to perform the `s3:PutBucketTagging`
 * action. By default, the bucket owner has this permission and can grant this permission to others.
 *
 * The following operations are related to `DeleteBucketTagging`:
 *
 * - GetBucketTagging
 *
 * - PutBucketTagging
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketTagging: (
  input: DeleteBucketTaggingRequest,
) => effect.Effect<
  DeleteBucketTaggingResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketTaggingRequest,
  output: DeleteBucketTaggingResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * This action removes the website configuration for a bucket. Amazon S3 returns a `200 OK`
 * response upon successfully deleting a website configuration on the specified bucket. You will get a
 * `200 OK` response if the website configuration you are trying to delete does not exist on
 * the bucket. Amazon S3 returns a `404` response if the bucket specified in the request does not
 * exist.
 *
 * This DELETE action requires the `S3:DeleteBucketWebsite` permission. By default, only the
 * bucket owner can delete the website configuration attached to a bucket. However, bucket owners can grant
 * other users permission to delete the website configuration by writing a bucket policy granting them the
 * `S3:DeleteBucketWebsite` permission.
 *
 * For more information about hosting websites, see Hosting Websites on Amazon S3.
 *
 * The following operations are related to `DeleteBucketWebsite`:
 *
 * - GetBucketWebsite
 *
 * - PutBucketWebsite
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteBucketWebsite: (
  input: DeleteBucketWebsiteRequest,
) => effect.Effect<
  DeleteBucketWebsiteResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBucketWebsiteRequest,
  output: DeleteBucketWebsiteResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Removes the `PublicAccessBlock` configuration for an Amazon S3 bucket. This
 * operation removes the bucket-level configuration only. The effective public access behavior
 * will still be governed by account-level settings (which may inherit from organization-level
 * policies). To use this operation, you must have the `s3:PutBucketPublicAccessBlock`
 * permission. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access
 * Permissions to Your Amazon S3 Resources.
 *
 * The following operations are related to `DeletePublicAccessBlock`:
 *
 * - Using
 * Amazon S3 Block Public Access
 *
 * - GetPublicAccessBlock
 *
 * - PutPublicAccessBlock
 *
 * - GetBucketPolicyStatus
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deletePublicAccessBlock: (
  input: DeletePublicAccessBlockRequest,
) => effect.Effect<
  DeletePublicAccessBlockResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePublicAccessBlockRequest,
  output: DeletePublicAccessBlockResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the notification configuration of a bucket.
 *
 * If notifications are not enabled on the bucket, the action returns an empty
 * `NotificationConfiguration` element.
 *
 * By default, you must be the bucket owner to read the notification configuration of a bucket.
 * However, the bucket owner can use a bucket policy to grant permission to other users to read this
 * configuration with the `s3:GetBucketNotification` permission.
 *
 * When you use this API operation with an access point, provide the alias of the access point in place of the bucket name.
 *
 * When you use this API operation with an Object Lambda access point, provide the alias of the Object Lambda access point in place of the bucket name.
 * If the Object Lambda access point alias in a request is not valid, the error code `InvalidAccessPointAliasError` is returned.
 * For more information about `InvalidAccessPointAliasError`, see List of
 * Error Codes.
 *
 * For more information about setting and reading the notification configuration on a bucket, see
 * Setting Up Notification
 * of Bucket Events. For more information about bucket policies, see Using Bucket Policies.
 *
 * The following action is related to `GetBucketNotification`:
 *
 * - PutBucketNotification
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketNotificationConfiguration: (
  input: GetBucketNotificationConfigurationRequest,
) => effect.Effect<
  NotificationConfiguration,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketNotificationConfigurationRequest,
  output: NotificationConfiguration,
  errors: [NoSuchBucket],
}));
/**
 * Applies an Amazon S3 bucket policy to an Amazon S3 bucket.
 *
 * **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * If you are using an identity other than the root user of the Amazon Web Services account that owns the
 * bucket, the calling identity must both have the `PutBucketPolicy` permissions on the
 * specified bucket and belong to the bucket owner's account in order to use this operation.
 *
 * If you don't have `PutBucketPolicy` permissions, Amazon S3 returns a 403 Access
 * Denied error. If you have the correct permissions, but you're not using an identity that
 * belongs to the bucket owner's account, Amazon S3 returns a `405 Method Not Allowed`
 * error.
 *
 * To ensure that bucket owners don't inadvertently lock themselves out of their own buckets,
 * the root principal in a bucket owner's Amazon Web Services account can perform the
 * `GetBucketPolicy`, `PutBucketPolicy`, and
 * `DeleteBucketPolicy` API actions, even if their bucket policy explicitly denies the
 * root principal's access. Bucket owner root principals can only be blocked from performing these
 * API actions by VPC endpoint policies and Amazon Web Services Organizations policies.
 *
 * - **General purpose bucket permissions** - The
 * `s3:PutBucketPolicy` permission is required in a policy. For more information
 * about general purpose buckets bucket policies, see Using Bucket Policies and User
 * Policies in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to
 * this API operation, you must have the `s3express:PutBucketPolicy` permission in
 * an IAM identity-based policy instead of a bucket policy. Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource.
 * For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### Example bucket policies
 *
 * **General purpose buckets example bucket policies** - See Bucket policy
 * examples in the *Amazon S3 User Guide*.
 *
 * **Directory bucket example bucket policies** - See Example
 * bucket policies for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region-code*.amazonaws.com`.
 *
 * The following operations are related to `PutBucketPolicy`:
 *
 * - CreateBucket
 *
 * - DeleteBucket
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketPolicy: (
  input: PutBucketPolicyRequest,
) => effect.Effect<
  PutBucketPolicyResponse,
  | AccessDenied
  | InvalidBucketName
  | InvalidDigest
  | InvalidRequest
  | MalformedPolicy
  | NoSuchBucket
  | PermanentRedirect
  | SignatureDoesNotMatch
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketPolicyRequest,
  output: PutBucketPolicyResponse,
  errors: [
    AccessDenied,
    InvalidBucketName,
    InvalidDigest,
    InvalidRequest,
    MalformedPolicy,
    NoSuchBucket,
    PermanentRedirect,
    SignatureDoesNotMatch,
  ],
}));
/**
 * Renames an existing object in a directory bucket that uses the S3 Express One Zone storage class.
 * You can use `RenameObject` by specifying an existing object’s name as the source and the new
 * name of the object as the destination within the same directory bucket.
 *
 * `RenameObject` is only supported for objects stored in the S3 Express One Zone storage
 * class.
 *
 * To prevent overwriting an object, you can use the `If-None-Match` conditional
 * header.
 *
 * - **If-None-Match** - Renames the object only if an object
 * with the specified name does not already exist in the directory bucket. If you don't want to
 * overwrite an existing object, you can add the `If-None-Match` conditional header with the
 * value `‘*’` in the `RenameObject` request. Amazon S3 then returns a 412
 * Precondition Failed error if the object with the specified name already exists. For more
 * information, see RFC 7232.
 *
 * ### Permissions
 *
 * To grant access to the `RenameObject` operation on a directory bucket, we
 * recommend that you use the `CreateSession` operation for session-based authorization.
 * Specifically, you grant the `s3express:CreateSession` permission to the directory
 * bucket in a bucket policy or an IAM identity-based policy. Then, you make the
 * `CreateSession` API call on the directory bucket to obtain a session token. With the
 * session token in your request header, you can make API requests to this operation. After the
 * session token expires, you make another `CreateSession` API call to generate a new
 * session token for use. The Amazon Web Services CLI and SDKs will create and manage your session including
 * refreshing the session token automatically to avoid service interruptions when a session expires.
 * In your bucket policy, you can specify the `s3express:SessionMode` condition key to
 * control who can create a `ReadWrite` or `ReadOnly` session. A
 * `ReadWrite` session is required for executing all the Zonal endpoint API operations,
 * including `RenameObject`. For more information about authorization, see
 * `CreateSession`
 * . To learn more about Zonal endpoint API operations, see
 * Authorizing Zonal endpoint API operations with CreateSession in the Amazon S3 User
 * Guide.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const renameObject: (
  input: RenameObjectRequest,
) => effect.Effect<
  RenameObjectOutput,
  IdempotencyParameterMismatch | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RenameObjectRequest,
  output: RenameObjectOutput,
  errors: [IdempotencyParameterMismatch],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Passes transformed objects to a `GetObject` operation when using Object Lambda access points. For information
 * about Object Lambda access points, see Transforming objects with Object Lambda access points in the *Amazon S3 User Guide*.
 *
 * This operation supports metadata that can be returned by GetObject, in addition to
 * `RequestRoute`, `RequestToken`, `StatusCode`, `ErrorCode`,
 * and `ErrorMessage`. The `GetObject` response metadata is supported so that the
 * `WriteGetObjectResponse` caller, typically an Lambda function, can provide the same
 * metadata when it internally invokes `GetObject`. When `WriteGetObjectResponse` is
 * called by a customer-owned Lambda function, the metadata returned to the end user `GetObject`
 * call might differ from what Amazon S3 would normally return.
 *
 * You can include any number of metadata headers. When including a metadata header, it should be
 * prefaced with `x-amz-meta`. For example, x-amz-meta-my-custom-header:
 * MyCustomValue. The primary use case for this is to forward `GetObject`
 * metadata.
 *
 * Amazon Web Services provides some prebuilt Lambda functions that you can use with S3 Object Lambda to detect and
 * redact personally identifiable information (PII) and decompress S3 objects. These Lambda functions are
 * available in the Amazon Web Services Serverless Application Repository, and can be selected through the Amazon Web Services
 * Management Console when you create your Object Lambda access point.
 *
 * Example 1: PII Access Control - This Lambda function uses Amazon Comprehend, a natural
 * language processing (NLP) service using machine learning to find insights and relationships in text. It
 * automatically detects personally identifiable information (PII) such as names, addresses, dates, credit
 * card numbers, and social security numbers from documents in your Amazon S3 bucket.
 *
 * Example 2: PII Redaction - This Lambda function uses Amazon Comprehend, a natural language
 * processing (NLP) service using machine learning to find insights and relationships in text. It
 * automatically redacts personally identifiable information (PII) such as names, addresses, dates, credit
 * card numbers, and social security numbers from documents in your Amazon S3 bucket.
 *
 * Example 3: Decompression - The Lambda function S3ObjectLambdaDecompression, is equipped to
 * decompress objects stored in S3 in one of six compressed file formats including bzip2, gzip, snappy,
 * zlib, zstandard and ZIP.
 *
 * For information on how to view and use these functions, see Using Amazon Web Services built Lambda functions in the
 * *Amazon S3 User Guide*.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const writeGetObjectResponse: (
  input: WriteGetObjectResponseRequest,
) => effect.Effect<
  WriteGetObjectResponseResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: WriteGetObjectResponseRequest,
  output: WriteGetObjectResponseResponse,
  errors: [],
}));
/**
 * This operation aborts a multipart upload. After a multipart upload is aborted, no additional parts
 * can be uploaded using that upload ID. The storage consumed by any previously uploaded parts will be
 * freed. However, if any part uploads are currently in progress, those part uploads might or might not
 * succeed. As a result, it might be necessary to abort a given multipart upload multiple times in order to
 * completely free all storage consumed by all parts.
 *
 * To verify that all parts have been removed and prevent getting charged for the part storage, you
 * should call the ListParts API operation and ensure that the parts list is empty.
 *
 * - **Directory buckets** - If multipart uploads in a
 * directory bucket are in progress, you can't delete the bucket until all the in-progress multipart
 * uploads are aborted or completed. To delete these in-progress multipart uploads, use the
 * `ListMultipartUploads` operation to list the in-progress multipart uploads in the
 * bucket and use the `AbortMultipartUpload` operation to abort all the in-progress
 * multipart uploads.
 *
 * - **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - For information
 * about permissions required to use the multipart upload, see Multipart Upload and Permissions in
 * the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `AbortMultipartUpload`:
 *
 * - CreateMultipartUpload
 *
 * - UploadPart
 *
 * - CompleteMultipartUpload
 *
 * - ListParts
 *
 * - ListMultipartUploads
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const abortMultipartUpload: (
  input: AbortMultipartUploadRequest,
) => effect.Effect<
  AbortMultipartUploadOutput,
  NoSuchUpload | NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AbortMultipartUploadRequest,
  output: AbortMultipartUploadOutput,
  errors: [NoSuchUpload, NoSuchBucket],
}));
/**
 * End of support notice: As of October 1, 2025, Amazon S3 has discontinued support for Email Grantee Access Control Lists (ACLs). If you attempt to use an Email Grantee ACL in a request after October 1, 2025,
 * the request will receive an `HTTP 405` (Method Not Allowed) error.
 *
 * This change affects the following Amazon Web Services Regions: US East (N. Virginia), US West (N. California), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Europe (Ireland), and South America (São Paulo).
 *
 * This action initiates a multipart upload and returns an upload ID. This upload ID is used to
 * associate all of the parts in the specific multipart upload. You specify this upload ID in each of your
 * subsequent upload part requests (see UploadPart). You also include this upload ID in
 * the final request to either complete or abort the multipart upload request. For more information about
 * multipart uploads, see Multipart
 * Upload Overview in the *Amazon S3 User Guide*.
 *
 * After you initiate a multipart upload and upload one or more parts, to stop being charged for
 * storing the uploaded parts, you must either complete or abort the multipart upload. Amazon S3 frees up the
 * space used to store the parts and stops charging you for storing them only after you either complete
 * or abort a multipart upload.
 *
 * If you have configured a lifecycle rule to abort incomplete multipart uploads, the created multipart
 * upload must be completed within the number of days specified in the bucket lifecycle configuration.
 * Otherwise, the incomplete multipart upload becomes eligible for an abort action and Amazon S3 aborts the
 * multipart upload. For more information, see Aborting
 * Incomplete Multipart Uploads Using a Bucket Lifecycle Configuration.
 *
 * - **Directory buckets ** -
 * S3 Lifecycle is not supported by directory buckets.
 *
 * - **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Request signing
 *
 * For request signing, multipart upload is just a series of regular requests. You initiate a
 * multipart upload, send one or more requests to upload parts, and then complete the multipart
 * upload process. You sign each request individually. There is nothing special about signing
 * multipart upload requests. For more information about signing, see Authenticating Requests (Amazon Web Services
 * Signature Version 4) in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - To perform a
 * multipart upload with encryption using an Key Management Service (KMS) KMS key, the requester must have
 * permission to the `kms:Decrypt` and `kms:GenerateDataKey` actions on the
 * key. The requester must also have permissions for the `kms:GenerateDataKey` action
 * for the `CreateMultipartUpload` API. Then, the requester needs permissions for the
 * `kms:Decrypt` action on the `UploadPart` and
 * `UploadPartCopy` APIs. These permissions are required because Amazon S3 must decrypt
 * and read data from the encrypted file parts before it completes the multipart upload. For more
 * information, see Multipart upload API and
 * permissions and Protecting data using server-side
 * encryption with Amazon Web Services KMS in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * ### Encryption
 *
 * - **General purpose buckets** - Server-side encryption is for
 * data encryption at rest. Amazon S3 encrypts your data as it writes it to disks in its data centers
 * and decrypts it when you access it. Amazon S3 automatically encrypts all new objects that are
 * uploaded to an S3 bucket. When doing a multipart upload, if you don't specify encryption
 * information in your request, the encryption setting of the uploaded parts is set to the
 * default encryption configuration of the destination bucket. By default, all buckets have a
 * base level of encryption configuration that uses server-side encryption with Amazon S3 managed keys
 * (SSE-S3). If the destination bucket has a default encryption configuration that uses
 * server-side encryption with an Key Management Service (KMS) key (SSE-KMS), or a customer-provided
 * encryption key (SSE-C), Amazon S3 uses the corresponding KMS key, or a customer-provided key to
 * encrypt the uploaded parts. When you perform a CreateMultipartUpload operation, if you want to
 * use a different type of encryption setting for the uploaded parts, you can request that Amazon S3
 * encrypts the object with a different encryption key (such as an Amazon S3 managed key, a KMS key,
 * or a customer-provided key). When the encryption setting in your request is different from the
 * default encryption configuration of the destination bucket, the encryption setting in your
 * request takes precedence. If you choose to provide your own encryption key, the request
 * headers you provide in UploadPart and UploadPartCopy requests must match the headers you used in the
 * `CreateMultipartUpload` request.
 *
 * - Use KMS keys (SSE-KMS) that include the Amazon Web Services managed key (`aws/s3`) and
 * KMS customer managed keys stored in Key Management Service (KMS) – If you want Amazon Web Services to manage the keys used
 * to encrypt data, specify the following headers in the request.
 *
 * - `x-amz-server-side-encryption`
 *
 * - `x-amz-server-side-encryption-aws-kms-key-id`
 *
 * - `x-amz-server-side-encryption-context`
 *
 * - If you specify `x-amz-server-side-encryption:aws:kms`, but don't
 * provide `x-amz-server-side-encryption-aws-kms-key-id`, Amazon S3 uses the
 * Amazon Web Services managed key (`aws/s3` key) in KMS to protect the data.
 *
 * - To perform a multipart upload with encryption by using an Amazon Web Services KMS key, the
 * requester must have permission to the `kms:Decrypt` and
 * `kms:GenerateDataKey*` actions on the key. These permissions are
 * required because Amazon S3 must decrypt and read data from the encrypted file parts
 * before it completes the multipart upload. For more information, see Multipart
 * upload API and permissions and Protecting data using
 * server-side encryption with Amazon Web Services KMS in the
 * *Amazon S3 User Guide*.
 *
 * - If your Identity and Access Management (IAM) user or role is in the same Amazon Web Services account as the
 * KMS key, then you must have these permissions on the key policy. If your IAM
 * user or role is in a different account from the key, then you must have the
 * permissions on both the key policy and your IAM user or role.
 *
 * - All `GET` and `PUT` requests for an object protected by
 * KMS fail if you don't make them by using Secure Sockets Layer (SSL), Transport
 * Layer Security (TLS), or Signature Version 4. For information about configuring any
 * of the officially supported Amazon Web Services SDKs and Amazon Web Services CLI, see Specifying the Signature Version in Request
 * Authentication in the *Amazon S3 User Guide*.
 *
 * For more information about server-side encryption with KMS keys (SSE-KMS), see
 * Protecting Data Using Server-Side Encryption with KMS keys in the
 * *Amazon S3 User Guide*.
 *
 * - Use customer-provided encryption keys (SSE-C) – If you want to manage your own
 * encryption keys, provide all the following headers in the request.
 *
 * - `x-amz-server-side-encryption-customer-algorithm`
 *
 * - `x-amz-server-side-encryption-customer-key`
 *
 * - `x-amz-server-side-encryption-customer-key-MD5`
 *
 * For more information about server-side encryption with customer-provided encryption
 * keys (SSE-C), see Protecting data
 * using server-side encryption with customer-provided encryption keys (SSE-C) in
 * the *Amazon S3 User Guide*.
 *
 * - **Directory buckets** -
 * For directory buckets, there are only two supported options for server-side encryption: server-side encryption with Amazon S3 managed keys (SSE-S3) (`AES256`) and server-side encryption with KMS keys (SSE-KMS) (`aws:kms`). We recommend that the bucket's default encryption uses the desired encryption configuration and you don't override the bucket default encryption in your
 * `CreateSession` requests or `PUT` object requests. Then, new objects
 * are automatically encrypted with the desired encryption settings. For more
 * information, see Protecting data with server-side encryption in the *Amazon S3 User Guide*. For more information about the encryption overriding behaviors in directory buckets, see Specifying server-side encryption with KMS for new object uploads.
 *
 * In the Zonal endpoint API calls (except CopyObject and UploadPartCopy) using the REST API, the encryption request headers must match the encryption settings that are specified in the `CreateSession` request.
 * You can't override the values of the encryption settings (`x-amz-server-side-encryption`, `x-amz-server-side-encryption-aws-kms-key-id`, `x-amz-server-side-encryption-context`, and `x-amz-server-side-encryption-bucket-key-enabled`) that are specified in the `CreateSession` request.
 * You don't need to explicitly specify these encryption settings values in Zonal endpoint API calls, and
 * Amazon S3 will use the encryption settings values from the `CreateSession` request to protect new objects in the directory bucket.
 *
 * When you use the CLI or the Amazon Web Services SDKs, for `CreateSession`, the session token refreshes automatically to avoid service interruptions when a session expires. The CLI or the Amazon Web Services SDKs use the bucket's default encryption configuration for the
 * `CreateSession` request. It's not supported to override the encryption settings values in the `CreateSession` request.
 * So in the Zonal endpoint API calls (except CopyObject and UploadPartCopy),
 * the encryption request headers must match the default encryption configuration of the directory bucket.
 *
 * For directory buckets, when you perform a `CreateMultipartUpload` operation
 * and an `UploadPartCopy` operation, the request headers you provide in the
 * `CreateMultipartUpload` request must match the default encryption configuration
 * of the destination bucket.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `CreateMultipartUpload`:
 *
 * - UploadPart
 *
 * - CompleteMultipartUpload
 *
 * - AbortMultipartUpload
 *
 * - ListParts
 *
 * - ListMultipartUploads
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const createMultipartUpload: (
  input: CreateMultipartUploadRequest,
) => effect.Effect<
  CreateMultipartUploadOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMultipartUploadRequest,
  output: CreateMultipartUploadOutput,
  errors: [NoSuchBucket],
}));
/**
 * Removes an object from a bucket. The behavior depends on the bucket's versioning state:
 *
 * - If bucket versioning is not enabled, the operation permanently deletes the object.
 *
 * - If bucket versioning is enabled, the operation inserts a delete marker, which becomes the
 * current version of the object. To permanently delete an object in a versioned bucket, you must
 * include the object’s `versionId` in the request. For more information about
 * versioning-enabled buckets, see Deleting object versions from a
 * versioning-enabled bucket.
 *
 * - If bucket versioning is suspended, the operation removes the object that has a null
 * `versionId`, if there is one, and inserts a delete marker that becomes the current
 * version of the object. If there isn't an object with a null `versionId`, and all versions
 * of the object have a `versionId`, Amazon S3 does not remove the object and only inserts a
 * delete marker. To permanently delete an object that has a `versionId`, you must include
 * the object’s `versionId` in the request. For more information about versioning-suspended
 * buckets, see Deleting
 * objects from versioning-suspended buckets.
 *
 * - **Directory buckets** - S3 Versioning isn't enabled and supported for directory buckets. For this API operation, only the `null` value of the version ID is supported by directory buckets.
 * You can only specify `null` to the `versionId` query parameter in the
 * request.
 *
 * - **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * To remove a specific version, you must use the `versionId` query parameter. Using this
 * query parameter permanently deletes the version. If the object deleted is a delete marker, Amazon S3 sets the
 * response header `x-amz-delete-marker` to true.
 *
 * If the object you want to delete is in a bucket where the bucket versioning configuration is MFA
 * Delete enabled, you must include the `x-amz-mfa` request header in the DELETE
 * `versionId` request. Requests that include `x-amz-mfa` must use HTTPS. For more
 * information about MFA Delete, see Using MFA Delete in the Amazon S3 User
 * Guide. To see sample requests that use versioning, see Sample Request.
 *
 * **Directory buckets** - MFA delete is not supported by directory buckets.
 *
 * You can delete objects by explicitly calling DELETE Object or calling (PutBucketLifecycle) to enable Amazon S3 to
 * remove them for you. If you want to block users or accounts from removing or deleting objects from your
 * bucket, you must deny them the `s3:DeleteObject`, `s3:DeleteObjectVersion`, and
 * `s3:PutLifeCycleConfiguration` actions.
 *
 * **Directory buckets** -
 * S3 Lifecycle is not supported by directory buckets.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - The following
 * permissions are required in your policies when your `DeleteObjects` request
 * includes specific headers.
 *
 * -
 * `s3:DeleteObject`
 * - To
 * delete an object from a bucket, you must always have the
 * `s3:DeleteObject` permission.
 *
 * -
 * `s3:DeleteObjectVersion`
 * - To delete a specific version of an object from a versioning-enabled
 * bucket, you must have the `s3:DeleteObjectVersion` permission.
 *
 * If the `s3:DeleteObject` or `s3:DeleteObjectVersion` permissions are explicitly
 * denied in your bucket policy, attempts to delete any unversioned objects
 * result in a `403 Access Denied` error.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following action is related to `DeleteObject`:
 *
 * - PutObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 *
 * The `If-Match` header is supported for both general purpose and directory buckets. `IfMatchLastModifiedTime` and `IfMatchSize` is only supported for directory buckets.
 */
export const deleteObject: (
  input: DeleteObjectRequest,
) => effect.Effect<
  DeleteObjectOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteObjectRequest,
  output: DeleteObjectOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Removes the entire tag set from the specified object. For more information about managing object
 * tags, see Object
 * Tagging.
 *
 * To use this operation, you must have permission to perform the `s3:DeleteObjectTagging`
 * action.
 *
 * To delete tags of a specific object version, add the `versionId` query parameter in the
 * request. You will need permission for the `s3:DeleteObjectVersionTagging` action.
 *
 * The following operations are related to `DeleteObjectTagging`:
 *
 * - PutObjectTagging
 *
 * - GetObjectTagging
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteObjectTagging: (
  input: DeleteObjectTaggingRequest,
) => effect.Effect<
  DeleteObjectTaggingOutput,
  NoSuchKey | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteObjectTaggingRequest,
  output: DeleteObjectTaggingOutput,
  errors: [NoSuchKey],
}));
/**
 * Returns the attribute-based access control (ABAC) property of the general purpose bucket. If ABAC is enabled on your bucket, you can use tags on the bucket for access control. For more information, see Enabling ABAC in general purpose buckets.
 */
export const getBucketAbac: (
  input: GetBucketAbacRequest,
) => effect.Effect<
  GetBucketAbacOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketAbacRequest,
  output: GetBucketAbacOutput,
  errors: [],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * This implementation of the GET action uses the `accelerate` subresource to return the
 * Transfer Acceleration state of a bucket, which is either `Enabled` or `Suspended`.
 * Amazon S3 Transfer Acceleration is a bucket-level feature that enables you to perform faster data transfers
 * to and from Amazon S3.
 *
 * To use this operation, you must have permission to perform the
 * `s3:GetAccelerateConfiguration` action. The bucket owner has this permission by default.
 * The bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to your Amazon S3
 * Resources in the *Amazon S3 User Guide*.
 *
 * You set the Transfer Acceleration state of an existing bucket to `Enabled` or
 * `Suspended` by using the PutBucketAccelerateConfiguration operation.
 *
 * A GET `accelerate` request does not return a state value for a bucket that has no
 * transfer acceleration state. A bucket has no Transfer Acceleration state if a state has never been set
 * on the bucket.
 *
 * For more information about transfer acceleration, see Transfer Acceleration in the
 * Amazon S3 User Guide.
 *
 * The following operations are related to `GetBucketAccelerateConfiguration`:
 *
 * - PutBucketAccelerateConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketAccelerateConfiguration: (
  input: GetBucketAccelerateConfigurationRequest,
) => effect.Effect<
  GetBucketAccelerateConfigurationOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketAccelerateConfigurationRequest,
  output: GetBucketAccelerateConfigurationOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * This implementation of the `GET` action uses the `acl` subresource to return
 * the access control list (ACL) of a bucket. To use `GET` to return the ACL of the bucket, you
 * must have the `READ_ACP` access to the bucket. If `READ_ACP` permission is granted
 * to the anonymous user, you can return the ACL of the bucket without using an authorization
 * header.
 *
 * When you use this API operation with an access point, provide the alias of the access point in place of the bucket name.
 *
 * When you use this API operation with an Object Lambda access point, provide the alias of the Object Lambda access point in place of the bucket name.
 * If the Object Lambda access point alias in a request is not valid, the error code `InvalidAccessPointAliasError` is returned.
 * For more information about `InvalidAccessPointAliasError`, see List of
 * Error Codes.
 *
 * If your bucket uses the bucket owner enforced setting for S3 Object Ownership, requests to read
 * ACLs are still supported and return the `bucket-owner-full-control` ACL with the owner
 * being the account that created the bucket. For more information, see Controlling object ownership and
 * disabling ACLs in the *Amazon S3 User Guide*.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 *
 * The following operations are related to `GetBucketAcl`:
 *
 * - ListObjects
 */
export const getBucketAcl: (
  input: GetBucketAclRequest,
) => effect.Effect<
  GetBucketAclOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketAclRequest,
  output: GetBucketAclOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * This implementation of the GET action returns an analytics configuration (identified by the
 * analytics configuration ID) from the bucket.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:GetAnalyticsConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources in the *Amazon S3 User Guide*.
 *
 * For information about Amazon S3 analytics feature, see Amazon S3 Analytics – Storage Class Analysis
 * in the *Amazon S3 User Guide*.
 *
 * The following operations are related to `GetBucketAnalyticsConfiguration`:
 *
 * - DeleteBucketAnalyticsConfiguration
 *
 * - ListBucketAnalyticsConfigurations
 *
 * - PutBucketAnalyticsConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketAnalyticsConfiguration: (
  input: GetBucketAnalyticsConfigurationRequest,
) => effect.Effect<
  GetBucketAnalyticsConfigurationOutput,
  NoSuchBucket | NoSuchConfiguration | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketAnalyticsConfigurationRequest,
  output: GetBucketAnalyticsConfigurationOutput,
  errors: [NoSuchBucket, NoSuchConfiguration],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the Cross-Origin Resource Sharing (CORS) configuration information set for the
 * bucket.
 *
 * To use this operation, you must have permission to perform the `s3:GetBucketCORS`
 * action. By default, the bucket owner has this permission and can grant it to others.
 *
 * When you use this API operation with an access point, provide the alias of the access point in place of the bucket name.
 *
 * When you use this API operation with an Object Lambda access point, provide the alias of the Object Lambda access point in place of the bucket name.
 * If the Object Lambda access point alias in a request is not valid, the error code `InvalidAccessPointAliasError` is returned.
 * For more information about `InvalidAccessPointAliasError`, see List of
 * Error Codes.
 *
 * For more information about CORS, see Enabling Cross-Origin Resource Sharing.
 *
 * The following operations are related to `GetBucketCors`:
 *
 * - PutBucketCors
 *
 * - DeleteBucketCors
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketCors: (
  input: GetBucketCorsRequest,
) => effect.Effect<
  GetBucketCorsOutput,
  NoSuchBucket | NoSuchCORSConfiguration | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketCorsRequest,
  output: GetBucketCorsOutput,
  errors: [NoSuchBucket, NoSuchCORSConfiguration],
}));
/**
 * Returns the default encryption configuration for an Amazon S3 bucket. By default, all buckets have a
 * default encryption configuration that uses server-side encryption with Amazon S3 managed keys (SSE-S3). This operation also returns the BucketKeyEnabled and BlockedEncryptionTypes statuses.
 *
 * - **General purpose buckets** - For information about the bucket
 * default encryption feature, see Amazon S3 Bucket Default Encryption in the
 * *Amazon S3 User Guide*.
 *
 * - **Directory buckets** -
 * For directory buckets, there are only two supported options for server-side encryption: SSE-S3 and SSE-KMS. For information about the default encryption configuration in
 * directory buckets, see Setting default server-side
 * encryption behavior for directory buckets.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - The
 * `s3:GetEncryptionConfiguration` permission is required in a policy. The bucket
 * owner has this permission by default. The bucket owner can grant this permission to others.
 * For more information about permissions, see Permissions Related to Bucket Operations and Managing Access Permissions to Your
 * Amazon S3 Resources.
 *
 * - **Directory bucket permissions** - To grant access to
 * this API operation, you must have the `s3express:GetEncryptionConfiguration`
 * permission in an IAM identity-based policy instead of a bucket policy. Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource.
 * For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region-code*.amazonaws.com`.
 *
 * The following operations are related to `GetBucketEncryption`:
 *
 * - PutBucketEncryption
 *
 * - DeleteBucketEncryption
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketEncryption: (
  input: GetBucketEncryptionRequest,
) => effect.Effect<
  GetBucketEncryptionOutput,
  NoSuchBucket | ParseError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketEncryptionRequest,
  output: GetBucketEncryptionOutput,
  errors: [NoSuchBucket, ParseError],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Gets the S3 Intelligent-Tiering configuration from the specified bucket.
 *
 * The S3 Intelligent-Tiering storage class is designed to optimize storage costs by automatically moving data to the most cost-effective storage access tier, without performance impact or operational overhead. S3 Intelligent-Tiering delivers automatic cost savings in three low latency and high throughput access tiers. To get the lowest storage cost on data that can be accessed in minutes to hours, you can choose to activate additional archiving capabilities.
 *
 * The S3 Intelligent-Tiering storage class is the ideal storage class for data with unknown, changing, or unpredictable access patterns, independent of object size or retention period. If the size of an object is less than 128 KB, it is not monitored and not eligible for auto-tiering. Smaller objects can be stored, but they are always charged at the Frequent Access tier rates in the S3 Intelligent-Tiering storage class.
 *
 * For more information, see Storage class for automatically optimizing frequently and infrequently accessed objects.
 *
 * Operations related to `GetBucketIntelligentTieringConfiguration` include:
 *
 * - DeleteBucketIntelligentTieringConfiguration
 *
 * - PutBucketIntelligentTieringConfiguration
 *
 * - ListBucketIntelligentTieringConfigurations
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketIntelligentTieringConfiguration: (
  input: GetBucketIntelligentTieringConfigurationRequest,
) => effect.Effect<
  GetBucketIntelligentTieringConfigurationOutput,
  NoSuchBucket | NoSuchConfiguration | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketIntelligentTieringConfigurationRequest,
  output: GetBucketIntelligentTieringConfigurationOutput,
  errors: [NoSuchBucket, NoSuchConfiguration],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns an S3 Inventory configuration (identified by the inventory configuration ID) from the
 * bucket.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:GetInventoryConfiguration` action. The bucket owner has this permission by default and
 * can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For information about the Amazon S3 inventory feature, see Amazon S3 Inventory.
 *
 * The following operations are related to `GetBucketInventoryConfiguration`:
 *
 * - DeleteBucketInventoryConfiguration
 *
 * - ListBucketInventoryConfigurations
 *
 * - PutBucketInventoryConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketInventoryConfiguration: (
  input: GetBucketInventoryConfigurationRequest,
) => effect.Effect<
  GetBucketInventoryConfigurationOutput,
  NoSuchBucket | NoSuchConfiguration | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketInventoryConfigurationRequest,
  output: GetBucketInventoryConfigurationOutput,
  errors: [NoSuchBucket, NoSuchConfiguration],
}));
/**
 * Returns the lifecycle configuration information set on the bucket. For information about lifecycle
 * configuration, see Object Lifecycle Management.
 *
 * Bucket lifecycle configuration now supports specifying a lifecycle rule using an object key name
 * prefix, one or more object tags, object size, or any combination of these. Accordingly, this section
 * describes the latest API, which is compatible with the new functionality. The previous version of the
 * API supported filtering based only on an object key name prefix, which is supported for general purpose
 * buckets for backward compatibility. For the related API description, see GetBucketLifecycle.
 *
 * Lifecyle configurations for directory buckets only support expiring objects and cancelling
 * multipart uploads. Expiring of versioned objects, transitions and tag filters are not
 * supported.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - By default, all Amazon S3
 * resources are private, including buckets, objects, and related subresources (for example,
 * lifecycle configuration and website configuration). Only the resource owner (that is, the
 * Amazon Web Services account that created it) can access the resource. The resource owner can optionally
 * grant access permissions to others by writing an access policy. For this operation, a user
 * must have the `s3:GetLifecycleConfiguration` permission.
 *
 * For more information about permissions, see Managing Access Permissions to Your
 * Amazon S3 Resources.
 *
 * - **Directory bucket permissions** - You must have the
 * `s3express:GetLifecycleConfiguration` permission in an IAM identity-based policy
 * to use this operation. Cross-account access to this API operation isn't supported. The
 * resource owner can optionally grant access permissions to others by creating a role or user
 * for them as long as they are within the same account as the owner and resource.
 *
 * For more information about directory bucket policies and permissions, see Authorizing Regional endpoint APIs with IAM in the Amazon S3 User
 * Guide.
 *
 * **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * `s3express-control.*region*.amazonaws.com`.
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
 * The following operations are related to `GetBucketLifecycleConfiguration`:
 *
 * - GetBucketLifecycle
 *
 * - PutBucketLifecycle
 *
 * - DeleteBucketLifecycle
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketLifecycleConfiguration: (
  input: GetBucketLifecycleConfigurationRequest,
) => effect.Effect<
  GetBucketLifecycleConfigurationOutput,
  NoSuchBucket | NoSuchLifecycleConfiguration | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketLifecycleConfigurationRequest,
  output: GetBucketLifecycleConfigurationOutput,
  errors: [NoSuchBucket, NoSuchLifecycleConfiguration],
}));
/**
 * Using the `GetBucketLocation` operation is no longer a best practice. To return the
 * Region that a bucket resides in, we recommend that you use the
 * HeadBucket
 * operation instead. For backward compatibility, Amazon S3 continues to support the
 * `GetBucketLocation` operation.
 *
 * Returns the Region the bucket resides in. You set the bucket's Region using the
 * `LocationConstraint` request parameter in a `CreateBucket` request. For more
 * information, see CreateBucket.
 *
 * In a bucket's home Region, calls to the `GetBucketLocation` operation are governed
 * by the bucket's policy. In other Regions, the bucket policy doesn't apply, which means that
 * cross-account access won't be authorized. However, calls to the `HeadBucket` operation
 * always return the bucket’s location through an HTTP response header, whether access to the bucket
 * is authorized or not. Therefore, we recommend using the `HeadBucket` operation for
 * bucket Region discovery and to avoid using the `GetBucketLocation` operation.
 *
 * When you use this API operation with an access point, provide the alias of the access point in place of the bucket name.
 *
 * When you use this API operation with an Object Lambda access point, provide the alias of the Object Lambda access point in place of the bucket name.
 * If the Object Lambda access point alias in a request is not valid, the error code `InvalidAccessPointAliasError` is returned.
 * For more information about `InvalidAccessPointAliasError`, see List of
 * Error Codes.
 *
 * This operation is not supported for directory buckets.
 *
 * The following operations are related to `GetBucketLocation`:
 *
 * - GetObject
 *
 * - CreateBucket
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketLocation: (
  input: GetBucketLocationRequest,
) => effect.Effect<
  GetBucketLocationOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketLocationRequest,
  output: GetBucketLocationOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the logging status of a bucket and the permissions users have to view and modify that
 * status.
 *
 * The following operations are related to `GetBucketLogging`:
 *
 * - CreateBucket
 *
 * - PutBucketLogging
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketLogging: (
  input: GetBucketLoggingRequest,
) => effect.Effect<
  GetBucketLoggingOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketLoggingRequest,
  output: GetBucketLoggingOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Gets a metrics configuration (specified by the metrics configuration ID) from the bucket. Note that
 * this doesn't include the daily storage metrics.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:GetMetricsConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For information about CloudWatch request metrics for Amazon S3, see Monitoring Metrics with Amazon
 * CloudWatch.
 *
 * The following operations are related to `GetBucketMetricsConfiguration`:
 *
 * - PutBucketMetricsConfiguration
 *
 * - DeleteBucketMetricsConfiguration
 *
 * - ListBucketMetricsConfigurations
 *
 * - Monitoring
 * Metrics with Amazon CloudWatch
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketMetricsConfiguration: (
  input: GetBucketMetricsConfigurationRequest,
) => effect.Effect<
  GetBucketMetricsConfigurationOutput,
  NoSuchBucket | NoSuchConfiguration | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketMetricsConfigurationRequest,
  output: GetBucketMetricsConfigurationOutput,
  errors: [NoSuchBucket, NoSuchConfiguration],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Retrieves `OwnershipControls` for an Amazon S3 bucket. To use this operation, you must have
 * the `s3:GetBucketOwnershipControls` permission. For more information about Amazon S3 permissions,
 * see Specifying
 * permissions in a policy.
 *
 * A bucket doesn't have `OwnershipControls` settings in the following cases:
 *
 * - The bucket was created before the `BucketOwnerEnforced` ownership setting was
 * introduced and you've never explicitly applied this value
 *
 * - You've manually deleted the bucket ownership control value using the
 * `DeleteBucketOwnershipControls` API operation.
 *
 * By default, Amazon S3 sets `OwnershipControls` for all newly created buckets.
 *
 * For information about Amazon S3 Object Ownership, see Using Object Ownership.
 *
 * The following operations are related to `GetBucketOwnershipControls`:
 *
 * - PutBucketOwnershipControls
 *
 * - DeleteBucketOwnershipControls
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketOwnershipControls: (
  input: GetBucketOwnershipControlsRequest,
) => effect.Effect<
  GetBucketOwnershipControlsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketOwnershipControlsRequest,
  output: GetBucketOwnershipControlsOutput,
  errors: [NoSuchBucket],
}));
/**
 * Returns the policy of a specified bucket.
 *
 * **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * If you are using an identity other than the root user of the Amazon Web Services account that owns the
 * bucket, the calling identity must both have the `GetBucketPolicy` permissions on the
 * specified bucket and belong to the bucket owner's account in order to use this operation.
 *
 * If you don't have `GetBucketPolicy` permissions, Amazon S3 returns a 403 Access
 * Denied error. If you have the correct permissions, but you're not using an identity that
 * belongs to the bucket owner's account, Amazon S3 returns a `405 Method Not Allowed`
 * error.
 *
 * To ensure that bucket owners don't inadvertently lock themselves out of their own buckets,
 * the root principal in a bucket owner's Amazon Web Services account can perform the
 * `GetBucketPolicy`, `PutBucketPolicy`, and
 * `DeleteBucketPolicy` API actions, even if their bucket policy explicitly denies the
 * root principal's access. Bucket owner root principals can only be blocked from performing these
 * API actions by VPC endpoint policies and Amazon Web Services Organizations policies.
 *
 * - **General purpose bucket permissions** - The
 * `s3:GetBucketPolicy` permission is required in a policy. For more information
 * about general purpose buckets bucket policies, see Using Bucket Policies and User
 * Policies in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to
 * this API operation, you must have the `s3express:GetBucketPolicy` permission in
 * an IAM identity-based policy instead of a bucket policy. Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource.
 * For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### Example bucket policies
 *
 * **General purpose buckets example bucket policies** - See Bucket policy
 * examples in the *Amazon S3 User Guide*.
 *
 * **Directory bucket example bucket policies** - See Example
 * bucket policies for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region-code*.amazonaws.com`.
 *
 * The following action is related to `GetBucketPolicy`:
 *
 * - GetObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketPolicy: (
  input: GetBucketPolicyRequest,
) => effect.Effect<
  GetBucketPolicyOutput,
  NoSuchBucket | NoSuchBucketPolicy | SignatureDoesNotMatch | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketPolicyRequest,
  output: GetBucketPolicyOutput,
  errors: [NoSuchBucket, NoSuchBucketPolicy, SignatureDoesNotMatch],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the replication configuration of a bucket.
 *
 * It can take a while to propagate the put or delete a replication configuration to all Amazon S3
 * systems. Therefore, a get request soon after put or delete can return a wrong result.
 *
 * For information about replication configuration, see Replication in the
 * *Amazon S3 User Guide*.
 *
 * This action requires permissions for the `s3:GetReplicationConfiguration` action. For
 * more information about permissions, see Using Bucket Policies and User
 * Policies.
 *
 * If you include the `Filter` element in a replication configuration, you must also include
 * the `DeleteMarkerReplication` and `Priority` elements. The response also returns
 * those elements.
 *
 * For information about `GetBucketReplication` errors, see List of replication-related
 * error codes
 *
 * The following operations are related to `GetBucketReplication`:
 *
 * - PutBucketReplication
 *
 * - DeleteBucketReplication
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketReplication: (
  input: GetBucketReplicationRequest,
) => effect.Effect<
  GetBucketReplicationOutput,
  NoSuchBucket | ReplicationConfigurationNotFoundError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketReplicationRequest,
  output: GetBucketReplicationOutput,
  errors: [NoSuchBucket, ReplicationConfigurationNotFoundError],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the request payment configuration of a bucket. To use this version of the operation, you
 * must be the bucket owner. For more information, see Requester Pays Buckets.
 *
 * The following operations are related to `GetBucketRequestPayment`:
 *
 * - ListObjects
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketRequestPayment: (
  input: GetBucketRequestPaymentRequest,
) => effect.Effect<
  GetBucketRequestPaymentOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketRequestPaymentRequest,
  output: GetBucketRequestPaymentOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the tag set associated with the general purpose bucket.
 *
 * if ABAC is not enabled for the bucket. When you enable ABAC for a general purpose bucket, you can no longer use this operation for that bucket and must use ListTagsForResource instead.
 *
 * To use this operation, you must have permission to perform the `s3:GetBucketTagging`
 * action. By default, the bucket owner has this permission and can grant this permission to others.
 *
 * `GetBucketTagging` has the following special error:
 *
 * - Error code: `NoSuchTagSet`
 *
 * - Description: There is no tag set associated with the bucket.
 *
 * The following operations are related to `GetBucketTagging`:
 *
 * - PutBucketTagging
 *
 * - DeleteBucketTagging
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketTagging: (
  input: GetBucketTaggingRequest,
) => effect.Effect<
  GetBucketTaggingOutput,
  NoSuchBucket | NoSuchTagSet | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketTaggingRequest,
  output: GetBucketTaggingOutput,
  errors: [NoSuchBucket, NoSuchTagSet],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the versioning state of a bucket.
 *
 * To retrieve the versioning state of a bucket, you must be the bucket owner.
 *
 * This implementation also returns the MFA Delete status of the versioning state. If the MFA Delete
 * status is `enabled`, the bucket owner must use an authentication device to change the
 * versioning state of the bucket.
 *
 * The following operations are related to `GetBucketVersioning`:
 *
 * - GetObject
 *
 * - PutObject
 *
 * - DeleteObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketVersioning: (
  input: GetBucketVersioningRequest,
) => effect.Effect<
  GetBucketVersioningOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketVersioningRequest,
  output: GetBucketVersioningOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the website configuration for a bucket. To host website on Amazon S3, you can configure a bucket
 * as website by adding a website configuration. For more information about hosting websites, see Hosting Websites on Amazon S3.
 *
 * This GET action requires the `S3:GetBucketWebsite` permission. By default, only the
 * bucket owner can read the bucket website configuration. However, bucket owners can allow other users to
 * read the website configuration by writing a bucket policy granting them the
 * `S3:GetBucketWebsite` permission.
 *
 * The following operations are related to `GetBucketWebsite`:
 *
 * - DeleteBucketWebsite
 *
 * - PutBucketWebsite
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketWebsite: (
  input: GetBucketWebsiteRequest,
) => effect.Effect<
  GetBucketWebsiteOutput,
  NoSuchBucket | NoSuchWebsiteConfiguration | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketWebsiteRequest,
  output: GetBucketWebsiteOutput,
  errors: [NoSuchBucket, NoSuchWebsiteConfiguration],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the access control list (ACL) of an object. To use this operation, you must have
 * `s3:GetObjectAcl` permissions or `READ_ACP` access to the object. For more
 * information, see Mapping of ACL
 * permissions and access policy permissions in the *Amazon S3 User Guide*
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * By default, GET returns ACL information about the current version of an object. To return ACL
 * information about a different version, use the versionId subresource.
 *
 * If your bucket uses the bucket owner enforced setting for S3 Object Ownership, requests to read
 * ACLs are still supported and return the `bucket-owner-full-control` ACL with the owner
 * being the account that created the bucket. For more information, see Controlling object ownership and
 * disabling ACLs in the *Amazon S3 User Guide*.
 *
 * The following operations are related to `GetObjectAcl`:
 *
 * - GetObject
 *
 * - GetObjectAttributes
 *
 * - DeleteObject
 *
 * - PutObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getObjectAcl: (
  input: GetObjectAclRequest,
) => effect.Effect<
  GetObjectAclOutput,
  NoSuchKey | NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectAclRequest,
  output: GetObjectAclOutput,
  errors: [NoSuchKey, NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Gets an object's current legal hold status. For more information, see Locking Objects.
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * The following action is related to `GetObjectLegalHold`:
 *
 * - GetObjectAttributes
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getObjectLegalHold: (
  input: GetObjectLegalHoldRequest,
) => effect.Effect<
  GetObjectLegalHoldOutput,
  InvalidRequest | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectLegalHoldRequest,
  output: GetObjectLegalHoldOutput,
  errors: [InvalidRequest],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Gets the Object Lock configuration for a bucket. The rule specified in the Object Lock configuration
 * will be applied by default to every new object placed in the specified bucket. For more information, see
 * Locking Objects.
 *
 * The following action is related to `GetObjectLockConfiguration`:
 *
 * - GetObjectAttributes
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getObjectLockConfiguration: (
  input: GetObjectLockConfigurationRequest,
) => effect.Effect<
  GetObjectLockConfigurationOutput,
  NoSuchBucket | ObjectLockConfigurationNotFoundError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectLockConfigurationRequest,
  output: GetObjectLockConfigurationOutput,
  errors: [NoSuchBucket, ObjectLockConfigurationNotFoundError],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Retrieves an object's retention settings. For more information, see Locking Objects.
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * The following action is related to `GetObjectRetention`:
 *
 * - GetObjectAttributes
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getObjectRetention: (
  input: GetObjectRetentionRequest,
) => effect.Effect<
  GetObjectRetentionOutput,
  InvalidRequest | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectRetentionRequest,
  output: GetObjectRetentionOutput,
  errors: [InvalidRequest],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns the tag-set of an object. You send the GET request against the tagging subresource
 * associated with the object.
 *
 * To use this operation, you must have permission to perform the `s3:GetObjectTagging`
 * action. By default, the GET action returns information about current version of an object. For a
 * versioned bucket, you can have multiple versions of an object in your bucket. To retrieve tags of any
 * other version, use the versionId query parameter. You also need permission for the
 * `s3:GetObjectVersionTagging` action.
 *
 * By default, the bucket owner has this permission and can grant this permission to others.
 *
 * For information about the Amazon S3 object tagging feature, see Object Tagging.
 *
 * The following actions are related to `GetObjectTagging`:
 *
 * - DeleteObjectTagging
 *
 * - GetObjectAttributes
 *
 * - PutObjectTagging
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getObjectTagging: (
  input: GetObjectTaggingRequest,
) => effect.Effect<
  GetObjectTaggingOutput,
  NoSuchBucket | NoSuchKey | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectTaggingRequest,
  output: GetObjectTaggingOutput,
  errors: [NoSuchBucket, NoSuchKey],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns torrent files from a bucket. BitTorrent can save you bandwidth when you're distributing
 * large files.
 *
 * You can get torrent only for objects that are less than 5 GB in size, and that are not encrypted
 * using server-side encryption with a customer-provided encryption key.
 *
 * To use GET, you must have READ access to the object.
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * The following action is related to `GetObjectTorrent`:
 *
 * - GetObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getObjectTorrent: (
  input: GetObjectTorrentRequest,
) => effect.Effect<
  GetObjectTorrentOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectTorrentRequest,
  output: GetObjectTorrentOutput,
  errors: [],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Retrieves the `PublicAccessBlock` configuration for an Amazon S3 bucket. This
 * operation returns the bucket-level configuration only. To understand the effective public
 * access behavior, you must also consider account-level settings (which may inherit from
 * organization-level policies). To use this operation, you must have the
 * `s3:GetBucketPublicAccessBlock` permission. For more information about Amazon S3
 * permissions, see Specifying Permissions in a
 * Policy.
 *
 * When Amazon S3 evaluates the `PublicAccessBlock` configuration for a bucket or an
 * object, it checks the `PublicAccessBlock` configuration for both the bucket (or
 * the bucket that contains the object) and the bucket owner's account. Account-level settings
 * automatically inherit from organization-level policies when present. If the
 * `PublicAccessBlock` settings are different between the bucket and the account,
 * Amazon S3 uses the most restrictive combination of the bucket-level and account-level
 * settings.
 *
 * For more information about when Amazon S3 considers a bucket or an object public, see The Meaning of "Public".
 *
 * The following operations are related to `GetPublicAccessBlock`:
 *
 * - Using Amazon S3 Block Public Access
 *
 * - PutPublicAccessBlock
 *
 * - GetPublicAccessBlock
 *
 * - DeletePublicAccessBlock
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getPublicAccessBlock: (
  input: GetPublicAccessBlockRequest,
) => effect.Effect<
  GetPublicAccessBlockOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPublicAccessBlockRequest,
  output: GetPublicAccessBlockOutput,
  errors: [NoSuchBucket],
}));
/**
 * You can use this operation to determine if a bucket exists and if you have permission to access it.
 * The action returns a `200 OK` HTTP status code if the bucket exists and you have
 * permission to access it. You can make a `HeadBucket` call on any bucket name to any
 * Region in the partition, and regardless of the permissions on the bucket, you will receive a
 * response header with the correct bucket location so that you can then make a proper, signed request
 * to the appropriate Regional endpoint.
 *
 * If the bucket doesn't exist or you don't have permission to access it, the `HEAD`
 * request returns a generic `400 Bad Request`, `403 Forbidden`, or
 * `404 Not Found` HTTP status code. A message body isn't included, so you can't determine
 * the exception beyond these HTTP response codes.
 *
 * ### Authentication and authorization
 *
 * **General purpose buckets** - Request to public buckets that
 * grant the s3:ListBucket permission publicly do not need to be signed. All other
 * `HeadBucket` requests must be authenticated and signed by using IAM credentials
 * (access key ID and secret access key for the IAM identities). All headers with the
 * `x-amz-` prefix, including `x-amz-copy-source`, must be signed. For more
 * information, see REST Authentication.
 *
 * **Directory buckets** - You must use IAM credentials to
 * authenticate and authorize your access to the `HeadBucket` API operation, instead of
 * using the temporary security credentials through the `CreateSession` API
 * operation.
 *
 * Amazon Web Services CLI or SDKs handles authentication and authorization on your behalf.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - To use this
 * operation, you must have permissions to perform the `s3:ListBucket` action. The
 * bucket owner has this permission by default and can grant this permission to others. For more
 * information about permissions, see Managing access permissions to your
 * Amazon S3 resources in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - You must have the
 *
 * `s3express:CreateSession`
 * permission in the
 * `Action` element of a policy. By default, the session is in the
 * `ReadWrite` mode. If you want to restrict the access, you can explicitly set the
 * `s3express:SessionMode` condition key to `ReadOnly` on the
 * bucket.
 *
 * For more information about example bucket policies, see Example
 * bucket policies for S3 Express One Zone and Amazon Web Services
 * Identity and Access Management (IAM) identity-based policies for S3 Express One Zone in the
 * *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * You must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format `https://*bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com`. Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const headBucket: (
  input: HeadBucketRequest,
) => effect.Effect<
  HeadBucketOutput,
  NotFound | ParseError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: HeadBucketRequest,
  output: HeadBucketOutput,
  errors: [NotFound, ParseError],
}));
/**
 * The `HEAD` operation retrieves metadata from an object without returning the object
 * itself. This operation is useful if you're interested only in an object's metadata.
 *
 * A `HEAD` request has the same options as a `GET` operation on an object. The
 * response is identical to the `GET` response except that there is no response body. Because
 * of this, if the `HEAD` request generates an error, it returns a generic code, such as
 * `400 Bad Request`, `403 Forbidden`, `404 Not Found`, 405
 * Method Not Allowed, `412 Precondition Failed`, or `304 Not Modified`.
 * It's not possible to retrieve the exact exception of these error codes.
 *
 * Request headers are limited to 8 KB in size. For more information, see Common Request Headers.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - To use
 * `HEAD`, you must have the `s3:GetObject` permission. You need the
 * relevant read object (or version) permission for this operation. For more information, see
 * Actions, resources,
 * and condition keys for Amazon S3 in the *Amazon S3 User Guide*. For more
 * information about the permissions to S3 API operations by S3 resource types, see Required permissions for
 * Amazon S3 API operations in the *Amazon S3 User Guide*.
 *
 * If the object you request doesn't exist, the error that Amazon S3 returns depends on whether
 * you also have the `s3:ListBucket` permission.
 *
 * - If you have the `s3:ListBucket` permission on the bucket, Amazon S3 returns an
 * HTTP status code `404 Not Found` error.
 *
 * - If you don’t have the `s3:ListBucket` permission, Amazon S3 returns an HTTP
 * status code `403 Forbidden` error.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * If you enable `x-amz-checksum-mode` in the request and the object is encrypted
 * with Amazon Web Services Key Management Service (Amazon Web Services KMS), you must also have the
 * `kms:GenerateDataKey` and `kms:Decrypt` permissions in IAM
 * identity-based policies and KMS key policies for the KMS key to retrieve the checksum of
 * the object.
 *
 * ### Encryption
 *
 * Encryption request headers, like `x-amz-server-side-encryption`, should not be
 * sent for `HEAD` requests if your object uses server-side encryption with Key Management Service
 * (KMS) keys (SSE-KMS), dual-layer server-side encryption with Amazon Web Services KMS keys (DSSE-KMS), or
 * server-side encryption with Amazon S3 managed encryption keys (SSE-S3). The
 * `x-amz-server-side-encryption` header is used when you `PUT` an object
 * to S3 and want to specify the encryption method. If you include this header in a
 * `HEAD` request for an object that uses these types of keys, you’ll get an HTTP
 * `400 Bad Request` error. It's because the encryption method can't be changed when
 * you retrieve the object.
 *
 * If you encrypt an object by using server-side encryption with customer-provided encryption
 * keys (SSE-C) when you store the object in Amazon S3, then when you retrieve the metadata from the
 * object, you must use the following headers to provide the encryption key for the server to be able
 * to retrieve the object's metadata. The headers are:
 *
 * - `x-amz-server-side-encryption-customer-algorithm`
 *
 * - `x-amz-server-side-encryption-customer-key`
 *
 * - `x-amz-server-side-encryption-customer-key-MD5`
 *
 * For more information about SSE-C, see Server-Side Encryption (Using
 * Customer-Provided Encryption Keys) in the *Amazon S3 User Guide*.
 *
 * **Directory bucket ** -
 * For directory buckets, there are only two supported options for server-side encryption: SSE-S3 and SSE-KMS. SSE-C isn't supported. For more
 * information, see Protecting data with server-side encryption in the *Amazon S3 User Guide*.
 *
 * ### Versioning
 *
 * - If the current version of the object is a delete marker, Amazon S3 behaves as if the object was
 * deleted and includes `x-amz-delete-marker: true` in the response.
 *
 * - If the specified version is a delete marker, the response returns a 405 Method Not
 * Allowed error and the `Last-Modified: timestamp` response header.
 *
 * - **Directory buckets** -
 * Delete marker is not supported for directory buckets.
 *
 * - **Directory buckets** -
 * S3 Versioning isn't enabled and supported for directory buckets. For this API operation, only the `null` value of the version ID is supported by directory buckets. You can only specify `null` to the
 * `versionId` query parameter in the request.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * The following actions are related to `HeadObject`:
 *
 * - GetObject
 *
 * - GetObjectAttributes
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const headObject: (
  input: HeadObjectRequest,
) => effect.Effect<
  HeadObjectOutput,
  NotFound | ParseError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: HeadObjectRequest,
  output: HeadObjectOutput,
  errors: [NotFound, ParseError],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Lists the analytics configurations for the bucket. You can have up to 1,000 analytics configurations
 * per bucket.
 *
 * This action supports list pagination and does not return more than 100 configurations at a time. You
 * should always check the `IsTruncated` element in the response. If there are no more
 * configurations to list, `IsTruncated` is set to false. If there are more configurations to
 * list, `IsTruncated` is set to true, and there will be a value in
 * `NextContinuationToken`. You use the `NextContinuationToken` value to continue
 * the pagination of the list by passing the value in continuation-token in the request to `GET`
 * the next page.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:GetAnalyticsConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For information about Amazon S3 analytics feature, see Amazon S3 Analytics – Storage Class
 * Analysis.
 *
 * The following operations are related to `ListBucketAnalyticsConfigurations`:
 *
 * - GetBucketAnalyticsConfiguration
 *
 * - DeleteBucketAnalyticsConfiguration
 *
 * - PutBucketAnalyticsConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listBucketAnalyticsConfigurations: (
  input: ListBucketAnalyticsConfigurationsRequest,
) => effect.Effect<
  ListBucketAnalyticsConfigurationsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBucketAnalyticsConfigurationsRequest,
  output: ListBucketAnalyticsConfigurationsOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Lists the S3 Intelligent-Tiering configuration from the specified bucket.
 *
 * The S3 Intelligent-Tiering storage class is designed to optimize storage costs by automatically moving data to the most cost-effective storage access tier, without performance impact or operational overhead. S3 Intelligent-Tiering delivers automatic cost savings in three low latency and high throughput access tiers. To get the lowest storage cost on data that can be accessed in minutes to hours, you can choose to activate additional archiving capabilities.
 *
 * The S3 Intelligent-Tiering storage class is the ideal storage class for data with unknown, changing, or unpredictable access patterns, independent of object size or retention period. If the size of an object is less than 128 KB, it is not monitored and not eligible for auto-tiering. Smaller objects can be stored, but they are always charged at the Frequent Access tier rates in the S3 Intelligent-Tiering storage class.
 *
 * For more information, see Storage class for automatically optimizing frequently and infrequently accessed objects.
 *
 * Operations related to `ListBucketIntelligentTieringConfigurations` include:
 *
 * - DeleteBucketIntelligentTieringConfiguration
 *
 * - PutBucketIntelligentTieringConfiguration
 *
 * - GetBucketIntelligentTieringConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listBucketIntelligentTieringConfigurations: (
  input: ListBucketIntelligentTieringConfigurationsRequest,
) => effect.Effect<
  ListBucketIntelligentTieringConfigurationsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBucketIntelligentTieringConfigurationsRequest,
  output: ListBucketIntelligentTieringConfigurationsOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns a list of S3 Inventory configurations for the bucket. You can have up to 1,000 inventory
 * configurations per bucket.
 *
 * This action supports list pagination and does not return more than 100 configurations at a time.
 * Always check the `IsTruncated` element in the response. If there are no more configurations
 * to list, `IsTruncated` is set to false. If there are more configurations to list,
 * `IsTruncated` is set to true, and there is a value in `NextContinuationToken`.
 * You use the `NextContinuationToken` value to continue the pagination of the list by passing
 * the value in continuation-token in the request to `GET` the next page.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:GetInventoryConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For information about the Amazon S3 inventory feature, see Amazon S3 Inventory
 *
 * The following operations are related to `ListBucketInventoryConfigurations`:
 *
 * - GetBucketInventoryConfiguration
 *
 * - DeleteBucketInventoryConfiguration
 *
 * - PutBucketInventoryConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listBucketInventoryConfigurations: (
  input: ListBucketInventoryConfigurationsRequest,
) => effect.Effect<
  ListBucketInventoryConfigurationsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBucketInventoryConfigurationsRequest,
  output: ListBucketInventoryConfigurationsOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Lists the metrics configurations for the bucket. The metrics configurations are only for the request
 * metrics of the bucket and do not provide information on daily storage metrics. You can have up to 1,000
 * configurations per bucket.
 *
 * This action supports list pagination and does not return more than 100 configurations at a time.
 * Always check the `IsTruncated` element in the response. If there are no more configurations
 * to list, `IsTruncated` is set to false. If there are more configurations to list,
 * `IsTruncated` is set to true, and there is a value in `NextContinuationToken`.
 * You use the `NextContinuationToken` value to continue the pagination of the list by passing
 * the value in `continuation-token` in the request to `GET` the next page.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:GetMetricsConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For more information about metrics configurations and CloudWatch request metrics, see Monitoring Metrics with
 * Amazon CloudWatch.
 *
 * The following operations are related to `ListBucketMetricsConfigurations`:
 *
 * - PutBucketMetricsConfiguration
 *
 * - GetBucketMetricsConfiguration
 *
 * - DeleteBucketMetricsConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listBucketMetricsConfigurations: (
  input: ListBucketMetricsConfigurationsRequest,
) => effect.Effect<
  ListBucketMetricsConfigurationsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBucketMetricsConfigurationsRequest,
  output: ListBucketMetricsConfigurationsOutput,
  errors: [NoSuchBucket],
}));
/**
 * Returns a list of all Amazon S3 directory buckets owned by the authenticated sender of the request. For
 * more information about directory buckets, see Directory buckets in the
 * *Amazon S3 User Guide*.
 *
 * **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3express:ListAllMyDirectoryBuckets` permission in
 * an IAM identity-based policy instead of a bucket policy. Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource.
 * For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * `s3express-control.*region*.amazonaws.com`.
 *
 * The `BucketRegion` response element is not part of the
 * `ListDirectoryBuckets` Response Syntax.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listDirectoryBuckets: {
  (
    input: ListDirectoryBucketsRequest,
  ): effect.Effect<
    ListDirectoryBucketsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDirectoryBucketsRequest,
  ) => stream.Stream<
    ListDirectoryBucketsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDirectoryBucketsRequest,
  ) => stream.Stream<
    Bucket,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDirectoryBucketsRequest,
  output: ListDirectoryBucketsOutput,
  errors: [],
  pagination: {
    inputToken: "ContinuationToken",
    outputToken: "ContinuationToken",
    items: "Buckets",
    pageSize: "MaxDirectoryBuckets",
  } as const,
}));
/**
 * Returns some or all (up to 1,000) of the objects in a bucket with each request. You can use the
 * request parameters as selection criteria to return a subset of the objects in a bucket. A 200
 * OK response can contain valid or invalid XML. Make sure to design your application to parse the
 * contents of the response and handle it appropriately. For more information about listing objects, see
 * Listing object
 * keys programmatically in the *Amazon S3 User Guide*. To get a list of your
 * buckets, see ListBuckets.
 *
 * - **General purpose bucket** - For general purpose buckets,
 * `ListObjectsV2` doesn't return prefixes that are related only to in-progress
 * multipart uploads.
 *
 * - **Directory buckets** - For directory buckets,
 * `ListObjectsV2` response includes the prefixes that are related only to in-progress
 * multipart uploads.
 *
 * - **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - To use this
 * operation, you must have READ access to the bucket. You must have permission to perform the
 * `s3:ListBucket` action. The bucket owner has this permission by default and can
 * grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access
 * Permissions to Your Amazon S3 Resources in the
 * *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * ### Sorting order of returned objects
 *
 * - **General purpose bucket** - For general purpose buckets,
 * `ListObjectsV2` returns objects in lexicographical order based on their key
 * names.
 *
 * - **Directory bucket** - For directory buckets,
 * `ListObjectsV2` does not return objects in lexicographical order.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * This section describes the latest revision of this action. We recommend that you use this revised
 * API operation for application development. For backward compatibility, Amazon S3 continues to support the
 * prior version of this API operation, ListObjects.
 *
 * The following operations are related to `ListObjectsV2`:
 *
 * - GetObject
 *
 * - PutObject
 *
 * - CreateBucket
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listObjectsV2: {
  (
    input: ListObjectsV2Request,
  ): effect.Effect<
    ListObjectsV2Output,
    NoSuchBucket | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListObjectsV2Request,
  ) => stream.Stream<
    ListObjectsV2Output,
    NoSuchBucket | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListObjectsV2Request,
  ) => stream.Stream<
    unknown,
    NoSuchBucket | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListObjectsV2Request,
  output: ListObjectsV2Output,
  errors: [NoSuchBucket],
  pagination: {
    inputToken: "ContinuationToken",
    outputToken: "NextContinuationToken",
    pageSize: "MaxKeys",
  } as const,
}));
/**
 * Sets the attribute-based access control (ABAC) property of the general purpose bucket. You must have `s3:PutBucketABAC` permission to perform this action. When you enable ABAC, you can use tags for access control on your buckets. Additionally, when ABAC is enabled, you must use the TagResource and UntagResource actions to manage tags on your buckets. You can nolonger use the PutBucketTagging and DeleteBucketTagging actions to tag your bucket. For more information, see Enabling ABAC in general purpose buckets.
 */
export const putBucketAbac: (
  input: PutBucketAbacRequest,
) => effect.Effect<
  PutBucketAbacResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketAbacRequest,
  output: PutBucketAbacResponse,
  errors: [],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Sets the accelerate configuration of an existing bucket. Amazon S3 Transfer Acceleration is a
 * bucket-level feature that enables you to perform faster data transfers to Amazon S3.
 *
 * To use this operation, you must have permission to perform the
 * `s3:PutAccelerateConfiguration` action. The bucket owner has this permission by default.
 * The bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * The Transfer Acceleration state of a bucket can be set to one of the following two values:
 *
 * - Enabled – Enables accelerated data transfers to the bucket.
 *
 * - Suspended – Disables accelerated data transfers to the bucket.
 *
 * The GetBucketAccelerateConfiguration action returns the transfer acceleration state of a
 * bucket.
 *
 * After setting the Transfer Acceleration state of a bucket to Enabled, it might take up to thirty
 * minutes before the data transfer rates to the bucket increase.
 *
 * The name of the bucket used for Transfer Acceleration must be DNS-compliant and must not contain
 * periods (".").
 *
 * For more information about transfer acceleration, see Transfer Acceleration.
 *
 * The following operations are related to `PutBucketAccelerateConfiguration`:
 *
 * - GetBucketAccelerateConfiguration
 *
 * - CreateBucket
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketAccelerateConfiguration: (
  input: PutBucketAccelerateConfigurationRequest,
) => effect.Effect<
  PutBucketAccelerateConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketAccelerateConfigurationRequest,
  output: PutBucketAccelerateConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Sets the request payment configuration for a bucket. By default, the bucket owner pays for downloads
 * from the bucket. This configuration parameter enables the bucket owner (only) to specify that the person
 * requesting the download will be charged for the download. For more information, see Requester Pays
 * Buckets.
 *
 * The following operations are related to `PutBucketRequestPayment`:
 *
 * - CreateBucket
 *
 * - GetBucketRequestPayment
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketRequestPayment: (
  input: PutBucketRequestPaymentRequest,
) => effect.Effect<
  PutBucketRequestPaymentResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketRequestPaymentRequest,
  output: PutBucketRequestPaymentResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Sets the tags for a general purpose bucket if attribute based access control (ABAC) is not enabled for the bucket. When you enable ABAC for a general purpose bucket, you can no longer use this operation for that bucket and must use the TagResource or UntagResource operations instead.
 *
 * Use tags to organize your Amazon Web Services bill to reflect your own cost structure. To do this, sign up to get
 * your Amazon Web Services account bill with tag key values included. Then, to see the cost of combined resources,
 * organize your billing information according to resources with the same tag key values. For example, you
 * can tag several resources with a specific application name, and then organize your billing information
 * to see the total cost of that application across several services. For more information, see Cost Allocation and
 * Tagging and Using Cost Allocation in Amazon S3 Bucket Tags.
 *
 * When this operation sets the tags for a bucket, it will overwrite any current tags the bucket
 * already has. You cannot use this operation to add tags to an existing list of tags.
 *
 * To use this operation, you must have permissions to perform the `s3:PutBucketTagging`
 * action. The bucket owner has this permission by default and can grant this permission to others. For
 * more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * `PutBucketTagging` has the following special errors. For more Amazon S3 errors see, Error Responses.
 *
 * - `InvalidTag` - The tag provided was not a valid tag. This error can occur if
 * the tag did not pass input validation. For more information, see Using Cost Allocation in Amazon S3 Bucket
 * Tags.
 *
 * - `MalformedXML` - The XML provided does not match the schema.
 *
 * - `OperationAborted` - A conflicting conditional action is currently in progress
 * against this resource. Please try again.
 *
 * - `InternalError` - The service was unable to apply the provided tag to the
 * bucket.
 *
 * The following operations are related to `PutBucketTagging`:
 *
 * - GetBucketTagging
 *
 * - DeleteBucketTagging
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketTagging: (
  input: PutBucketTaggingRequest,
) => effect.Effect<
  PutBucketTaggingResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketTaggingRequest,
  output: PutBucketTaggingResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * When you enable versioning on a bucket for the first time, it might take a short amount of time
 * for the change to be fully propagated. While this change is propagating, you might encounter
 * intermittent `HTTP 404 NoSuchKey` errors for requests to objects created or updated after
 * enabling versioning. We recommend that you wait for 15 minutes after enabling versioning before
 * issuing write operations (`PUT` or `DELETE`) on objects in the bucket.
 *
 * Sets the versioning state of an existing bucket.
 *
 * You can set the versioning state with one of the following values:
 *
 * **Enabled**—Enables versioning for the objects in the bucket. All
 * objects added to the bucket receive a unique version ID.
 *
 * **Suspended**—Disables versioning for the objects in the bucket. All
 * objects added to the bucket receive the version ID null.
 *
 * If the versioning state has never been set on a bucket, it has no versioning state; a GetBucketVersioning request does not return a versioning state value.
 *
 * In order to enable MFA Delete, you must be the bucket owner. If you are the bucket owner and want to
 * enable MFA Delete in the bucket versioning configuration, you must include the x-amz-mfa
 * request header and the `Status` and the `MfaDelete` request elements in a
 * request to set the versioning state of the bucket.
 *
 * If you have an object expiration lifecycle configuration in your non-versioned bucket and you want
 * to maintain the same permanent delete behavior when you enable versioning, you must add a noncurrent
 * expiration policy. The noncurrent expiration lifecycle configuration will manage the deletes of the
 * noncurrent object versions in the version-enabled bucket. (A version-enabled bucket maintains one
 * current and zero or more noncurrent object versions.) For more information, see Lifecycle and
 * Versioning.
 *
 * The following operations are related to `PutBucketVersioning`:
 *
 * - CreateBucket
 *
 * - DeleteBucket
 *
 * - GetBucketVersioning
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketVersioning: (
  input: PutBucketVersioningRequest,
) => effect.Effect<
  PutBucketVersioningResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketVersioningRequest,
  output: PutBucketVersioningResponse,
  errors: [NoSuchBucket],
}));
/**
 * End of support notice: As of October 1, 2025, Amazon S3 has discontinued support for Email Grantee Access Control Lists (ACLs). If you attempt to use an Email Grantee ACL in a request after October 1, 2025,
 * the request will receive an `HTTP 405` (Method Not Allowed) error.
 *
 * This change affects the following Amazon Web Services Regions: US East (N. Virginia), US West (N. California), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Europe (Ireland), and South America (São Paulo).
 *
 * Adds an object to a bucket.
 *
 * - Amazon S3 never adds partial objects; if you receive a success response, Amazon S3 added the entire
 * object to the bucket. You cannot use `PutObject` to only update a single piece of
 * metadata for an existing object. You must put the entire object with updated metadata if you want
 * to update some values.
 *
 * - If your bucket uses the bucket owner enforced setting for Object Ownership, ACLs are disabled
 * and no longer affect permissions. All objects written to the bucket by any account will be owned
 * by the bucket owner.
 *
 * - **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * Amazon S3 is a distributed system. If it receives multiple write requests for the same object
 * simultaneously, it overwrites all but the last object written. However, Amazon S3 provides features that can
 * modify this behavior:
 *
 * - **S3 Object Lock** - To prevent objects from being deleted
 * or overwritten, you can use Amazon S3 Object Lock in the *Amazon S3 User Guide*.
 *
 * This functionality is not supported for directory buckets.
 *
 * - **If-None-Match** - Uploads the object only if the object
 * key name does not already exist in the specified bucket. Otherwise, Amazon S3 returns a 412
 * Precondition Failed error. If a conflicting operation occurs during the upload, S3 returns
 * a `409 ConditionalRequestConflict` response. On a 409 failure, retry the upload.
 *
 * Expects the * character (asterisk).
 *
 * For more information, see Add preconditions to S3 operations with
 * conditional requests in the *Amazon S3 User Guide* or RFC 7232.
 *
 * This functionality is not supported for S3 on Outposts.
 *
 * - **S3 Versioning** - When you enable versioning for a bucket,
 * if Amazon S3 receives multiple write requests for the same object simultaneously, it stores all versions
 * of the objects. For each write request that is made to the same object, Amazon S3 automatically generates
 * a unique version ID of that object being stored in Amazon S3. You can retrieve, replace, or delete any
 * version of the object. For more information about versioning, see Adding Objects to
 * Versioning-Enabled Buckets in the *Amazon S3 User Guide*. For information
 * about returning the versioning state of a bucket, see GetBucketVersioning.
 *
 * This functionality is not supported for directory buckets.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - The following
 * permissions are required in your policies when your `PutObject` request includes
 * specific headers.
 *
 * -
 * `s3:PutObject`
 * - To successfully
 * complete the `PutObject` request, you must always have the
 * `s3:PutObject` permission on a bucket to add an object to it.
 *
 * -
 * `s3:PutObjectAcl`
 * - To successfully change the objects ACL of your `PutObject`
 * request, you must have the `s3:PutObjectAcl`.
 *
 * -
 * `s3:PutObjectTagging`
 * - To successfully set the tag-set with your `PutObject`
 * request, you must have the `s3:PutObjectTagging`.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * If the object is encrypted with SSE-KMS, you must also have the
 * `kms:GenerateDataKey` and `kms:Decrypt` permissions in IAM
 * identity-based policies and KMS key policies for the KMS key.
 *
 * ### Data integrity with Content-MD5
 *
 * - **General purpose bucket** - To ensure that data is not
 * corrupted traversing the network, use the `Content-MD5` header. When you use this
 * header, Amazon S3 checks the object against the provided MD5 value and, if they do not match, Amazon S3
 * returns an error. Alternatively, when the object's ETag is its MD5 digest, you can calculate
 * the MD5 while putting the object to Amazon S3 and compare the returned ETag to the calculated MD5
 * value.
 *
 * - **Directory bucket** -
 * This functionality is not supported for directory buckets.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * For more information about related Amazon S3 APIs, see the following:
 *
 * - CopyObject
 *
 * - DeleteObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putObject: (
  input: PutObjectRequest,
) => effect.Effect<
  PutObjectOutput,
  | EncryptionTypeMismatch
  | InvalidRequest
  | InvalidWriteOffset
  | TooManyParts
  | NoSuchBucket
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutObjectRequest,
  output: PutObjectOutput,
  errors: [
    EncryptionTypeMismatch,
    InvalidRequest,
    InvalidWriteOffset,
    TooManyParts,
    NoSuchBucket,
  ],
}));
/**
 * End of support notice: As of October 1, 2025, Amazon S3 has discontinued support for Email Grantee Access Control Lists (ACLs). If you attempt to use an Email Grantee ACL in a request after October 1, 2025,
 * the request will receive an `HTTP 405` (Method Not Allowed) error.
 *
 * This change affects the following Amazon Web Services Regions: US East (N. Virginia), US West (N. California), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Europe (Ireland), and South America (São Paulo).
 *
 * This operation is not supported for directory buckets.
 *
 * Uses the `acl` subresource to set the access control list (ACL) permissions for a new or
 * existing object in an S3 bucket. You must have the `WRITE_ACP` permission to set the ACL of
 * an object. For more information, see What permissions can I grant? in the
 * *Amazon S3 User Guide*.
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * Depending on your application needs, you can choose to set the ACL on an object using either the
 * request body or the headers. For example, if you have an existing application that updates a bucket ACL
 * using the request body, you can continue to use that approach. For more information, see Access Control List (ACL)
 * Overview in the *Amazon S3 User Guide*.
 *
 * If your bucket uses the bucket owner enforced setting for S3 Object Ownership, ACLs are disabled
 * and no longer affect permissions. You must use policies to grant access to your bucket and the objects
 * in it. Requests to set ACLs or update ACLs fail and return the
 * `AccessControlListNotSupported` error code. Requests to read ACLs are still supported.
 * For more information, see Controlling object ownership in
 * the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * You can set access permissions using one of the following methods:
 *
 * - Specify a canned ACL with the `x-amz-acl` request header. Amazon S3 supports a set
 * of predefined ACLs, known as canned ACLs. Each canned ACL has a predefined set of grantees and
 * permissions. Specify the canned ACL name as the value of `x-amz-ac`l. If you use
 * this header, you cannot use other access control-specific headers in your request. For more
 * information, see Canned ACL.
 *
 * - Specify access permissions explicitly with the `x-amz-grant-read`,
 * `x-amz-grant-read-acp`, `x-amz-grant-write-acp`, and
 * `x-amz-grant-full-control` headers. When using these headers, you specify
 * explicit access permissions and grantees (Amazon Web Services accounts or Amazon S3 groups) who will receive the
 * permission. If you use these ACL-specific headers, you cannot use `x-amz-acl`
 * header to set a canned ACL. These parameters map to the set of permissions that Amazon S3 supports
 * in an ACL. For more information, see Access Control List (ACL)
 * Overview.
 *
 * You specify each grantee as a type=value pair, where the type is one of the
 * following:
 *
 * - `id` – if the value specified is the canonical user ID of an
 * Amazon Web Services account
 *
 * - `uri` – if you are granting permissions to a predefined group
 *
 * - `emailAddress` – if the value specified is the email address of an
 * Amazon Web Services account
 *
 * Using email addresses to specify a grantee is only supported in the following Amazon Web Services Regions:
 *
 * - US East (N. Virginia)
 *
 * - US West (N. California)
 *
 * - US West (Oregon)
 *
 * - Asia Pacific (Singapore)
 *
 * - Asia Pacific (Sydney)
 *
 * - Asia Pacific (Tokyo)
 *
 * - Europe (Ireland)
 *
 * - South America (São Paulo)
 *
 * For a list of all the Amazon S3 supported Regions and endpoints, see Regions and Endpoints in the Amazon Web Services General Reference.
 *
 * For example, the following `x-amz-grant-read` header grants list objects
 * permission to the two Amazon Web Services accounts identified by their email addresses.
 *
 * x-amz-grant-read: emailAddress="xyz@amazon.com", emailAddress="abc@amazon.com"
 *
 * You can use either a canned ACL or specify access permissions explicitly. You cannot do
 * both.
 *
 * ### Grantee Values
 *
 * You can specify the person (grantee) to whom you're assigning access rights (using request
 * elements) in the following ways. For examples of how to specify these grantee values in JSON
 * format, see the Amazon Web Services CLI example in Enabling Amazon S3 server
 * access logging in the *Amazon S3 User Guide*.
 *
 * - By the person's ID:
 *
 * <>ID<><>GranteesEmail<>
 *
 * DisplayName is optional and ignored in the request.
 *
 * - By URI:
 *
 * <>http://acs.amazonaws.com/groups/global/AuthenticatedUsers<>
 *
 * - By Email address:
 *
 * <>Grantees@email.com<>lt;/Grantee>
 *
 * The grantee is resolved to the CanonicalUser and, in a response to a GET Object acl
 * request, appears as the CanonicalUser.
 *
 * Using email addresses to specify a grantee is only supported in the following Amazon Web Services Regions:
 *
 * - US East (N. Virginia)
 *
 * - US West (N. California)
 *
 * - US West (Oregon)
 *
 * - Asia Pacific (Singapore)
 *
 * - Asia Pacific (Sydney)
 *
 * - Asia Pacific (Tokyo)
 *
 * - Europe (Ireland)
 *
 * - South America (São Paulo)
 *
 * For a list of all the Amazon S3 supported Regions and endpoints, see Regions and Endpoints in the Amazon Web Services General Reference.
 *
 * ### Versioning
 *
 * The ACL of an object is set at the object version level. By default, PUT sets the ACL of the
 * current version of an object. To set the ACL of a different version, use the
 * `versionId` subresource.
 *
 * The following operations are related to `PutObjectAcl`:
 *
 * - CopyObject
 *
 * - GetObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putObjectAcl: (
  input: PutObjectAclRequest,
) => effect.Effect<
  PutObjectAclOutput,
  NoSuchKey | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutObjectAclRequest,
  output: PutObjectAclOutput,
  errors: [NoSuchKey],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Sets the supplied tag-set to an object that already exists in a bucket. A tag is a key-value pair.
 * For more information, see Object Tagging.
 *
 * You can associate tags with an object by sending a PUT request against the tagging subresource that
 * is associated with the object. You can retrieve tags by sending a GET request. For more information, see
 * GetObjectTagging.
 *
 * For tagging-related restrictions related to characters and encodings, see Tag
 * Restrictions. Note that Amazon S3 limits the maximum number of tags to 10 tags per object.
 *
 * To use this operation, you must have permission to perform the `s3:PutObjectTagging`
 * action. By default, the bucket owner has this permission and can grant this permission to others.
 *
 * To put tags of any other version, use the `versionId` query parameter. You also need
 * permission for the `s3:PutObjectVersionTagging` action.
 *
 * `PutObjectTagging` has the following special errors. For more Amazon S3 errors see, Error Responses.
 *
 * - `InvalidTag` - The tag provided was not a valid tag. This error can occur if
 * the tag did not pass input validation. For more information, see Object Tagging.
 *
 * - `MalformedXML` - The XML provided does not match the schema.
 *
 * - `OperationAborted` - A conflicting conditional action is currently in progress
 * against this resource. Please try again.
 *
 * - `InternalError` - The service was unable to apply the provided tag to the
 * object.
 *
 * The following operations are related to `PutObjectTagging`:
 *
 * - GetObjectTagging
 *
 * - DeleteObjectTagging
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putObjectTagging: (
  input: PutObjectTaggingRequest,
) => effect.Effect<
  PutObjectTaggingOutput,
  NoSuchKey | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutObjectTaggingRequest,
  output: PutObjectTaggingOutput,
  errors: [NoSuchKey],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Creates or modifies the `PublicAccessBlock` configuration for an Amazon S3 bucket. To use this
 * operation, you must have the `s3:PutBucketPublicAccessBlock` permission. For more information
 * about Amazon S3 permissions, see Specifying Permissions in a
 * Policy.
 *
 * When Amazon S3 evaluates the `PublicAccessBlock` configuration for a bucket or an
 * object, it checks the `PublicAccessBlock` configuration for both the bucket (or
 * the bucket that contains the object) and the bucket owner's account. Account-level settings
 * automatically inherit from organization-level policies when present. If the
 * `PublicAccessBlock` configurations are different between the bucket and the
 * account, Amazon S3 uses the most restrictive combination of the bucket-level and account-level
 * settings.
 *
 * For more information about when Amazon S3 considers a bucket or an object public, see The Meaning of "Public".
 *
 * The following operations are related to `PutPublicAccessBlock`:
 *
 * - GetPublicAccessBlock
 *
 * - DeletePublicAccessBlock
 *
 * - GetBucketPolicyStatus
 *
 * - Using Amazon S3 Block Public Access
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putPublicAccessBlock: (
  input: PutPublicAccessBlockRequest,
) => effect.Effect<
  PutPublicAccessBlockResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPublicAccessBlockRequest,
  output: PutPublicAccessBlockResponse,
  errors: [NoSuchBucket],
}));
/**
 * Uploads a part in a multipart upload.
 *
 * In this operation, you provide new data as a part of an object in your request. However, you have
 * an option to specify your existing Amazon S3 object as a data source for the part you are uploading. To
 * upload a part from an existing object, you use the UploadPartCopy operation.
 *
 * You must initiate a multipart upload (see CreateMultipartUpload) before you can
 * upload any part. In response to your initiate request, Amazon S3 returns an upload ID, a unique identifier
 * that you must include in your upload part request.
 *
 * Part numbers can be any number from 1 to 10,000, inclusive. A part number uniquely identifies a part
 * and also defines its position within the object being created. If you upload a new part using the same
 * part number that was used with a previous part, the previously uploaded part is overwritten.
 *
 * For information about maximum and minimum part sizes and other multipart upload specifications, see
 * Multipart upload
 * limits in the *Amazon S3 User Guide*.
 *
 * After you initiate multipart upload and upload one or more parts, you must either complete or
 * abort multipart upload in order to stop getting charged for storage of the uploaded parts. Only after
 * you either complete or abort multipart upload, Amazon S3 frees up the parts storage and stops charging you
 * for the parts storage.
 *
 * For more information on multipart uploads, go to Multipart Upload Overview in the
 * *Amazon S3 User Guide *.
 *
 * **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - To perform a
 * multipart upload with encryption using an Key Management Service key, the requester must have permission to
 * the `kms:Decrypt` and `kms:GenerateDataKey` actions on the key. The
 * requester must also have permissions for the `kms:GenerateDataKey` action for the
 * `CreateMultipartUpload` API. Then, the requester needs permissions for the
 * `kms:Decrypt` action on the `UploadPart` and
 * `UploadPartCopy` APIs.
 *
 * These permissions are required because Amazon S3 must decrypt and read data from the encrypted
 * file parts before it completes the multipart upload. For more information about KMS
 * permissions, see Protecting data using server-side
 * encryption with KMS in the *Amazon S3 User Guide*. For information
 * about the permissions required to use the multipart upload API, see Multipart upload and
 * permissions and Multipart upload API and
 * permissions in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * If the object is encrypted with SSE-KMS, you must also have the
 * `kms:GenerateDataKey` and `kms:Decrypt` permissions in IAM
 * identity-based policies and KMS key policies for the KMS key.
 *
 * ### Data integrity
 *
 * **General purpose bucket** - To ensure that data is not corrupted
 * traversing the network, specify the `Content-MD5` header in the upload part request.
 * Amazon S3 checks the part data against the provided MD5 value. If they do not match, Amazon S3 returns an
 * error. If the upload request is signed with Signature Version 4, then Amazon Web Services S3 uses the
 * `x-amz-content-sha256` header as a checksum instead of `Content-MD5`. For
 * more information see Authenticating Requests:
 * Using the Authorization Header (Amazon Web Services Signature Version 4).
 *
 * **Directory buckets** - MD5 is not supported by directory buckets. You can use checksum algorithms to check object integrity.
 *
 * ### Encryption
 *
 * - **General purpose bucket** - Server-side encryption is for
 * data encryption at rest. Amazon S3 encrypts your data as it writes it to disks in its data centers
 * and decrypts it when you access it. You have mutually exclusive options to protect data using
 * server-side encryption in Amazon S3, depending on how you choose to manage the encryption keys.
 * Specifically, the encryption key options are Amazon S3 managed keys (SSE-S3), Amazon Web Services KMS keys
 * (SSE-KMS), and Customer-Provided Keys (SSE-C). Amazon S3 encrypts data with server-side encryption
 * using Amazon S3 managed keys (SSE-S3) by default. You can optionally tell Amazon S3 to encrypt data at
 * rest using server-side encryption with other key options. The option you use depends on
 * whether you want to use KMS keys (SSE-KMS) or provide your own encryption key
 * (SSE-C).
 *
 * Server-side encryption is supported by the S3 Multipart Upload operations. Unless you are
 * using a customer-provided encryption key (SSE-C), you don't need to specify the encryption
 * parameters in each UploadPart request. Instead, you only need to specify the server-side
 * encryption parameters in the initial Initiate Multipart request. For more information, see
 * CreateMultipartUpload.
 *
 * If you have server-side encryption with customer-provided keys (SSE-C) blocked for your general purpose bucket, you will get an HTTP 403 Access Denied error when you specify the SSE-C request headers while writing new data to your bucket. For more information, see Blocking or unblocking SSE-C for a general purpose bucket.
 *
 * If you request server-side encryption using a customer-provided encryption key (SSE-C) in
 * your initiate multipart upload request, you must provide identical encryption information in
 * each part upload using the following request headers.
 *
 * - x-amz-server-side-encryption-customer-algorithm
 *
 * - x-amz-server-side-encryption-customer-key
 *
 * - x-amz-server-side-encryption-customer-key-MD5
 *
 * For more information, see Using Server-Side
 * Encryption in the *Amazon S3 User Guide*.
 *
 * - **Directory buckets ** -
 * For directory buckets, there are only two supported options for server-side encryption: server-side encryption with Amazon S3 managed keys (SSE-S3) (`AES256`) and server-side encryption with KMS keys (SSE-KMS) (`aws:kms`).
 *
 * ### Special errors
 *
 * - Error Code: `NoSuchUpload`
 *
 * - Description: The specified multipart upload does not exist. The upload ID might be
 * invalid, or the multipart upload might have been aborted or completed.
 *
 * - HTTP Status Code: 404 Not Found
 *
 * - SOAP Fault Code Prefix: Client
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `UploadPart`:
 *
 * - CreateMultipartUpload
 *
 * - CompleteMultipartUpload
 *
 * - AbortMultipartUpload
 *
 * - ListParts
 *
 * - ListMultipartUploads
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const uploadPart: (
  input: UploadPartRequest,
) => effect.Effect<
  UploadPartOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadPartRequest,
  output: UploadPartOutput,
  errors: [NoSuchBucket],
}));
/**
 * Creates an S3 Metadata V2 metadata configuration for a general purpose bucket. For more information, see
 * Accelerating
 * data discovery with S3 Metadata in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * To use this operation, you must have the following permissions. For more information, see
 * Setting up permissions for configuring metadata tables in the
 * *Amazon S3 User Guide*.
 *
 * If you want to encrypt your metadata tables with server-side encryption with Key Management Service
 * (KMS) keys (SSE-KMS), you need additional permissions in your KMS key policy. For more
 * information, see
 * Setting up permissions for configuring metadata tables in the
 * *Amazon S3 User Guide*.
 *
 * If you also want to integrate your table bucket with Amazon Web Services analytics services so that you can
 * query your metadata table, you need additional permissions. For more information, see Integrating
 * Amazon S3 Tables with Amazon Web Services analytics services in the
 * *Amazon S3 User Guide*.
 *
 * To query your metadata tables, you need additional permissions. For more information, see
 *
 * Permissions for querying metadata tables in the *Amazon S3 User Guide*.
 *
 * - `s3:CreateBucketMetadataTableConfiguration`
 *
 * The IAM policy action name is the same for the V1 and V2 API operations.
 *
 * - `s3tables:CreateTableBucket`
 *
 * - `s3tables:CreateNamespace`
 *
 * - `s3tables:GetTable`
 *
 * - `s3tables:CreateTable`
 *
 * - `s3tables:PutTablePolicy`
 *
 * - `s3tables:PutTableEncryption`
 *
 * - `kms:DescribeKey`
 *
 * The following operations are related to `CreateBucketMetadataConfiguration`:
 *
 * - DeleteBucketMetadataConfiguration
 *
 * - GetBucketMetadataConfiguration
 *
 * - UpdateBucketMetadataInventoryTableConfiguration
 *
 * - UpdateBucketMetadataJournalTableConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const createBucketMetadataConfiguration: (
  input: CreateBucketMetadataConfigurationRequest,
) => effect.Effect<
  CreateBucketMetadataConfigurationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBucketMetadataConfigurationRequest,
  output: CreateBucketMetadataConfigurationResponse,
  errors: [],
}));
/**
 * We recommend that you create your S3 Metadata configurations by using the V2
 * CreateBucketMetadataConfiguration API operation. We no longer recommend using the V1
 * `CreateBucketMetadataTableConfiguration` API operation.
 *
 * If you created your S3 Metadata configuration before July 15, 2025, we recommend that you delete
 * and re-create your configuration by using CreateBucketMetadataConfiguration so that you can expire journal table records and create
 * a live inventory table.
 *
 * Creates a V1 S3 Metadata configuration for a general purpose bucket. For more information, see
 * Accelerating
 * data discovery with S3 Metadata in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * To use this operation, you must have the following permissions. For more information, see
 * Setting up permissions for configuring metadata tables in the
 * *Amazon S3 User Guide*.
 *
 * If you want to encrypt your metadata tables with server-side encryption with Key Management Service
 * (KMS) keys (SSE-KMS), you need additional permissions. For more
 * information, see
 * Setting up permissions for configuring metadata tables in the
 * *Amazon S3 User Guide*.
 *
 * If you also want to integrate your table bucket with Amazon Web Services analytics services so that you can
 * query your metadata table, you need additional permissions. For more information, see Integrating
 * Amazon S3 Tables with Amazon Web Services analytics services in the
 * *Amazon S3 User Guide*.
 *
 * - `s3:CreateBucketMetadataTableConfiguration`
 *
 * - `s3tables:CreateNamespace`
 *
 * - `s3tables:GetTable`
 *
 * - `s3tables:CreateTable`
 *
 * - `s3tables:PutTablePolicy`
 *
 * The following operations are related to `CreateBucketMetadataTableConfiguration`:
 *
 * - DeleteBucketMetadataTableConfiguration
 *
 * - GetBucketMetadataTableConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const createBucketMetadataTableConfiguration: (
  input: CreateBucketMetadataTableConfigurationRequest,
) => effect.Effect<
  CreateBucketMetadataTableConfigurationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBucketMetadataTableConfigurationRequest,
  output: CreateBucketMetadataTableConfigurationResponse,
  errors: [],
}));
/**
 * Creates a session that establishes temporary security credentials to support fast authentication and
 * authorization for the Zonal endpoint API operations on directory buckets. For more information about Zonal endpoint API operations that
 * include the Availability Zone in the request endpoint, see S3 Express One Zone APIs in the
 * *Amazon S3 User Guide*.
 *
 * To make Zonal endpoint API requests on a directory bucket, use the `CreateSession` API
 * operation. Specifically, you grant `s3express:CreateSession` permission to a bucket in
 * a bucket policy or an IAM identity-based policy. Then, you use IAM credentials to make the `CreateSession`
 * API request on the bucket, which returns temporary security credentials that include the access key ID,
 * secret access key, session token, and expiration. These credentials have associated permissions to
 * access the Zonal endpoint API operations. After the session is created, you don’t need to use other policies to grant
 * permissions to each Zonal endpoint API individually. Instead, in your Zonal endpoint API requests, you sign your
 * requests by applying the temporary security credentials of the session to the request headers and
 * following the SigV4 protocol for authentication. You also apply the session token to the
 * `x-amz-s3session-token` request header for authorization. Temporary security credentials
 * are scoped to the bucket and expire after 5 minutes. After the expiration time, any calls that you make
 * with those credentials will fail. You must use IAM credentials again to make a
 * `CreateSession` API request that generates a new set of temporary credentials for use.
 * Temporary credentials cannot be extended or refreshed beyond the original specified interval.
 *
 * If you use Amazon Web Services SDKs, SDKs handle the session token refreshes automatically to avoid service
 * interruptions when a session expires. We recommend that you use the Amazon Web Services SDKs to initiate and manage
 * requests to the CreateSession API. For more information, see Performance guidelines and design patterns in the
 * *Amazon S3 User Guide*.
 *
 * - You must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format `https://*bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com`. Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * -
 * `CopyObject` API operation - Unlike other
 * Zonal endpoint API operations, the `CopyObject` API operation doesn't use the temporary security
 * credentials returned from the `CreateSession` API operation for authentication and
 * authorization. For information about authentication and authorization of the
 * `CopyObject` API operation on directory buckets, see CopyObject.
 *
 * -
 * `HeadBucket` API operation - Unlike other
 * Zonal endpoint API operations, the `HeadBucket` API operation doesn't use the temporary security
 * credentials returned from the `CreateSession` API operation for authentication and
 * authorization. For information about authentication and authorization of the
 * `HeadBucket` API operation on directory buckets, see HeadBucket.
 *
 * ### Permissions
 *
 * To obtain temporary security credentials, you must create a bucket policy or an IAM identity-based policy that
 * grants `s3express:CreateSession` permission to the bucket. In a policy, you can have
 * the `s3express:SessionMode` condition key to control who can create a
 * `ReadWrite` or `ReadOnly` session. For more information about
 * `ReadWrite` or `ReadOnly` sessions, see
 * `x-amz-create-session-mode`
 * . For example policies, see Example
 * bucket policies for S3 Express One Zone and Amazon Web Services Identity
 * and Access Management (IAM) identity-based policies for S3 Express One Zone in the
 * *Amazon S3 User Guide*.
 *
 * To grant cross-account access to Zonal endpoint API operations, the bucket policy should also grant both
 * accounts the `s3express:CreateSession` permission.
 *
 * If you want to encrypt objects with SSE-KMS, you must also have the
 * `kms:GenerateDataKey` and the `kms:Decrypt` permissions in IAM
 * identity-based policies and KMS key policies for the target KMS key.
 *
 * ### Encryption
 *
 * For directory buckets, there are only two supported options for server-side encryption: server-side encryption with Amazon S3 managed keys (SSE-S3) (`AES256`) and server-side encryption with KMS keys (SSE-KMS) (`aws:kms`). We recommend that the bucket's default encryption uses the desired encryption configuration and you don't override the bucket default encryption in your
 * `CreateSession` requests or `PUT` object requests. Then, new objects
 * are automatically encrypted with the desired encryption settings. For more
 * information, see Protecting data with server-side encryption in the *Amazon S3 User Guide*. For more information about the encryption overriding behaviors in directory buckets, see Specifying server-side encryption with KMS for new object uploads.
 *
 * For Zonal endpoint (object-level) API operations except CopyObject and UploadPartCopy,
 * you authenticate and authorize requests through CreateSession for low latency.
 * To encrypt new objects in a directory bucket with SSE-KMS, you must specify SSE-KMS as the directory bucket's default encryption configuration with a KMS key (specifically, a customer managed key). Then, when a session is created for Zonal endpoint API operations, new objects are automatically encrypted and decrypted with SSE-KMS and S3 Bucket Keys during the session.
 *
 * Only 1 customer managed key is supported per directory bucket for the lifetime of the bucket. The Amazon Web Services managed key (`aws/s3`) isn't supported.
 * After you specify SSE-KMS as your bucket's default encryption configuration with a customer managed key, you can't change the customer managed key for the bucket's SSE-KMS configuration.
 *
 * In the Zonal endpoint API calls (except CopyObject and UploadPartCopy) using the REST API,
 * you can't override the values of the encryption settings (`x-amz-server-side-encryption`, `x-amz-server-side-encryption-aws-kms-key-id`, `x-amz-server-side-encryption-context`, and `x-amz-server-side-encryption-bucket-key-enabled`) from the `CreateSession` request.
 * You don't need to explicitly specify these encryption settings values in Zonal endpoint API calls, and
 * Amazon S3 will use the encryption settings values from the `CreateSession` request to protect new objects in the directory bucket.
 *
 * When you use the CLI or the Amazon Web Services SDKs, for `CreateSession`, the session token refreshes automatically to avoid service interruptions when a session expires. The CLI or the Amazon Web Services SDKs use the bucket's default encryption configuration for the
 * `CreateSession` request. It's not supported to override the encryption settings values in the `CreateSession` request.
 * Also, in the Zonal endpoint API calls (except CopyObject and UploadPartCopy),
 * it's not supported to override the values of the encryption settings from the `CreateSession` request.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const createSession: (
  input: CreateSessionRequest,
) => effect.Effect<
  CreateSessionOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSessionRequest,
  output: CreateSessionOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Retrieves the policy status for an Amazon S3 bucket, indicating whether the bucket is public. In order to
 * use this operation, you must have the `s3:GetBucketPolicyStatus` permission. For more
 * information about Amazon S3 permissions, see Specifying Permissions in a
 * Policy.
 *
 * For more information about when Amazon S3 considers a bucket public, see The Meaning of "Public".
 *
 * The following operations are related to `GetBucketPolicyStatus`:
 *
 * - Using Amazon S3 Block Public Access
 *
 * - GetPublicAccessBlock
 *
 * - PutPublicAccessBlock
 *
 * - DeletePublicAccessBlock
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketPolicyStatus: (
  input: GetBucketPolicyStatusRequest,
) => effect.Effect<
  GetBucketPolicyStatusOutput,
  NoSuchBucket | PermanentRedirect | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketPolicyStatusRequest,
  output: GetBucketPolicyStatusOutput,
  errors: [NoSuchBucket, PermanentRedirect],
}));
/**
 * Retrieves an object from Amazon S3.
 *
 * In the `GetObject` request, specify the full key name for the object.
 *
 * **General purpose buckets** - Both the virtual-hosted-style requests
 * and the path-style requests are supported. For a virtual hosted-style request example, if you have the
 * object `photos/2006/February/sample.jpg`, specify the object key name as
 * `/photos/2006/February/sample.jpg`. For a path-style request example, if you have the
 * object `photos/2006/February/sample.jpg` in the bucket named `examplebucket`,
 * specify the object key name as `/examplebucket/photos/2006/February/sample.jpg`. For more
 * information about request types, see HTTP Host Header Bucket
 * Specification in the *Amazon S3 User Guide*.
 *
 * **Directory buckets** -
 * Only virtual-hosted-style requests are supported. For a virtual hosted-style request example, if you have the object `photos/2006/February/sample.jpg` in the bucket named `amzn-s3-demo-bucket--usw2-az1--x-s3`, specify the object key name as `/photos/2006/February/sample.jpg`. Also, when you make requests to this API operation, your requests are sent to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - You must have the
 * required permissions in a policy. To use `GetObject`, you must have the
 * `READ` access to the object (or version). If you grant `READ` access
 * to the anonymous user, the `GetObject` operation returns the object without using
 * an authorization header. For more information, see Specifying permissions in a
 * policy in the *Amazon S3 User Guide*.
 *
 * If you include a `versionId` in your request header, you must have the
 * `s3:GetObjectVersion` permission to access a specific version of an object. The
 * `s3:GetObject` permission is not required in this scenario.
 *
 * If you request the current version of an object without a specific `versionId`
 * in the request header, only the `s3:GetObject` permission is required. The
 * `s3:GetObjectVersion` permission is not required in this scenario.
 *
 * If the object that you request doesn’t exist, the error that Amazon S3 returns depends on
 * whether you also have the `s3:ListBucket` permission.
 *
 * - If you have the `s3:ListBucket` permission on the bucket, Amazon S3 returns an
 * HTTP status code `404 Not Found` error.
 *
 * - If you don’t have the `s3:ListBucket` permission, Amazon S3 returns an HTTP
 * status code `403 Access Denied` error.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * If the object is
 * encrypted using SSE-KMS, you must also have the `kms:GenerateDataKey` and
 * `kms:Decrypt` permissions in IAM identity-based policies and KMS key policies
 * for the KMS key.
 *
 * ### Storage classes
 *
 * If the object you are retrieving is stored in the S3 Glacier Flexible Retrieval storage class,
 * the S3 Glacier Deep Archive storage class, the S3 Intelligent-Tiering Archive Access tier, or the
 * S3 Intelligent-Tiering Deep Archive Access tier, before you can retrieve the object you must first restore a
 * copy using RestoreObject. Otherwise, this operation returns an `InvalidObjectState`
 * error. For information about restoring archived objects, see Restoring Archived Objects in the
 * *Amazon S3 User Guide*.
 *
 * **Directory buckets ** -
 * Directory buckets only support `EXPRESS_ONEZONE` (the S3 Express One Zone storage class) in Availability Zones and `ONEZONE_IA` (the S3 One Zone-Infrequent Access storage class) in Dedicated Local Zones.
 * Unsupported storage class values won't write a destination object and will respond with the HTTP status code `400 Bad Request`.
 *
 * ### Encryption
 *
 * Encryption request headers, like `x-amz-server-side-encryption`, should not be sent
 * for the `GetObject` requests, if your object uses server-side encryption with Amazon S3
 * managed encryption keys (SSE-S3), server-side encryption with Key Management Service (KMS) keys (SSE-KMS), or
 * dual-layer server-side encryption with Amazon Web Services KMS keys (DSSE-KMS). If you include the header in
 * your `GetObject` requests for the object that uses these types of keys, you’ll get an
 * HTTP `400 Bad Request` error.
 *
 * **Directory buckets** -
 * For directory buckets, there are only two supported options for server-side encryption: SSE-S3 and SSE-KMS. SSE-C isn't supported. For more
 * information, see Protecting data with server-side encryption in the *Amazon S3 User Guide*.
 *
 * ### Overriding response header values through the request
 *
 * There are times when you want to override certain response header values of a
 * `GetObject` response. For example, you might override the
 * `Content-Disposition` response header value through your `GetObject`
 * request.
 *
 * You can override values for a set of response headers. These modified response header values
 * are included only in a successful response, that is, when the HTTP status code `200 OK`
 * is returned. The headers you can override using the following query parameters in the request are
 * a subset of the headers that Amazon S3 accepts when you create an object.
 *
 * The response headers that you can override for the `GetObject` response are
 * `Cache-Control`, `Content-Disposition`, `Content-Encoding`,
 * `Content-Language`, `Content-Type`, and `Expires`.
 *
 * To override values for a set of response headers in the `GetObject` response, you
 * can use the following query parameters in the request.
 *
 * - `response-cache-control`
 *
 * - `response-content-disposition`
 *
 * - `response-content-encoding`
 *
 * - `response-content-language`
 *
 * - `response-content-type`
 *
 * - `response-expires`
 *
 * When you use these parameters, you must sign the request by using either an Authorization
 * header or a presigned URL. These parameters cannot be used with an unsigned (anonymous)
 * request.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `GetObject`:
 *
 * - ListBuckets
 *
 * - GetObjectAcl
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getObject: (
  input: GetObjectRequest,
) => effect.Effect<
  GetObjectOutput,
  InvalidObjectState | NoSuchKey | NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectRequest,
  output: GetObjectOutput,
  errors: [InvalidObjectState, NoSuchKey, NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns a list of all buckets owned by the authenticated sender of the request. To grant IAM
 * permission to use this operation, you must add the `s3:ListAllMyBuckets` policy action.
 *
 * For information about Amazon S3 buckets, see Creating, configuring, and working with Amazon S3
 * buckets.
 *
 * We strongly recommend using only paginated `ListBuckets` requests. Unpaginated
 * `ListBuckets` requests are only supported for Amazon Web Services accounts set to the default general
 * purpose bucket quota of 10,000. If you have an approved general purpose bucket quota above 10,000, you
 * must send paginated `ListBuckets` requests to list your account’s buckets. All unpaginated
 * `ListBuckets` requests will be rejected for Amazon Web Services accounts with a general purpose bucket
 * quota greater than 10,000.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listBuckets: {
  (
    input: ListBucketsRequest,
  ): effect.Effect<
    ListBucketsOutput,
    RequestError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListBucketsRequest,
  ) => stream.Stream<
    ListBucketsOutput,
    RequestError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListBucketsRequest,
  ) => stream.Stream<
    Bucket,
    RequestError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBucketsRequest,
  output: ListBucketsOutput,
  errors: [RequestError],
  pagination: {
    inputToken: "ContinuationToken",
    outputToken: "ContinuationToken",
    items: "Buckets",
    pageSize: "MaxBuckets",
  } as const,
}));
/**
 * This operation lists in-progress multipart uploads in a bucket. An in-progress multipart upload is a
 * multipart upload that has been initiated by the `CreateMultipartUpload` request, but has not
 * yet been completed or aborted.
 *
 * **Directory buckets** - If multipart uploads in a
 * directory bucket are in progress, you can't delete the bucket until all the in-progress multipart
 * uploads are aborted or completed. To delete these in-progress multipart uploads, use the
 * `ListMultipartUploads` operation to list the in-progress multipart uploads in the bucket
 * and use the `AbortMultipartUpload` operation to abort all the in-progress multipart
 * uploads.
 *
 * The `ListMultipartUploads` operation returns a maximum of 1,000 multipart uploads in the
 * response. The limit of 1,000 multipart uploads is also the default value. You can further limit the
 * number of uploads in a response by specifying the `max-uploads` request parameter. If there
 * are more than 1,000 multipart uploads that satisfy your `ListMultipartUploads` request, the
 * response returns an `IsTruncated` element with the value of `true`, a
 * `NextKeyMarker` element, and a `NextUploadIdMarker` element. To list the
 * remaining multipart uploads, you need to make subsequent `ListMultipartUploads` requests. In
 * these requests, include two query parameters: `key-marker` and `upload-id-marker`.
 * Set the value of `key-marker` to the `NextKeyMarker` value from the previous
 * response. Similarly, set the value of `upload-id-marker` to the
 * `NextUploadIdMarker` value from the previous response.
 *
 * **Directory buckets** - The `upload-id-marker`
 * element and the `NextUploadIdMarker` element aren't supported by directory buckets. To
 * list the additional multipart uploads, you only need to set the value of `key-marker` to
 * the `NextKeyMarker` value from the previous response.
 *
 * For more information about multipart uploads, see Uploading Objects Using Multipart Upload in
 * the *Amazon S3 User Guide*.
 *
 * **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - For information
 * about permissions required to use the multipart upload API, see Multipart Upload and Permissions in
 * the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * ### Sorting of multipart uploads in response
 *
 * - **General purpose bucket** - In the
 * `ListMultipartUploads` response, the multipart uploads are sorted based on two
 * criteria:
 *
 * - Key-based sorting - Multipart uploads are initially sorted in ascending order
 * based on their object keys.
 *
 * - Time-based sorting - For uploads that share the same object key, they are
 * further sorted in ascending order based on the upload initiation time. Among uploads with
 * the same key, the one that was initiated first will appear before the ones that were
 * initiated later.
 *
 * - **Directory bucket** - In the
 * `ListMultipartUploads` response, the multipart uploads aren't sorted
 * lexicographically based on the object keys.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `ListMultipartUploads`:
 *
 * - CreateMultipartUpload
 *
 * - UploadPart
 *
 * - CompleteMultipartUpload
 *
 * - ListParts
 *
 * - AbortMultipartUpload
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listMultipartUploads: (
  input: ListMultipartUploadsRequest,
) => effect.Effect<
  ListMultipartUploadsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMultipartUploadsRequest,
  output: ListMultipartUploadsOutput,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns metadata about all versions of the objects in a bucket. You can also use request parameters
 * as selection criteria to return metadata about a subset of all the object versions.
 *
 * To use this operation, you must have permission to perform the `s3:ListBucketVersions`
 * action. Be aware of the name difference.
 *
 * A `200 OK` response can contain valid or invalid XML. Make sure to design your
 * application to parse the contents of the response and handle it appropriately.
 *
 * To use this operation, you must have READ access to the bucket.
 *
 * The following operations are related to `ListObjectVersions`:
 *
 * - ListObjectsV2
 *
 * - GetObject
 *
 * - PutObject
 *
 * - DeleteObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listObjectVersions: (
  input: ListObjectVersionsRequest,
) => effect.Effect<
  ListObjectVersionsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListObjectVersionsRequest,
  output: ListObjectVersionsOutput,
  errors: [NoSuchBucket],
}));
/**
 * Lists the parts that have been uploaded for a specific multipart upload.
 *
 * To use this operation, you must provide the `upload ID` in the request. You obtain this
 * uploadID by sending the initiate multipart upload request through CreateMultipartUpload.
 *
 * The `ListParts` request returns a maximum of 1,000 uploaded parts. The limit of 1,000
 * parts is also the default value. You can restrict the number of parts in a response by specifying the
 * `max-parts` request parameter. If your multipart upload consists of more than 1,000 parts,
 * the response returns an `IsTruncated` field with the value of `true`, and a
 * `NextPartNumberMarker` element. To list remaining uploaded parts, in subsequent
 * `ListParts` requests, include the `part-number-marker` query string parameter
 * and set its value to the `NextPartNumberMarker` field value from the previous
 * response.
 *
 * For more information on multipart uploads, see Uploading Objects Using Multipart Upload in
 * the *Amazon S3 User Guide*.
 *
 * **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - For information
 * about permissions required to use the multipart upload API, see Multipart Upload and Permissions in
 * the *Amazon S3 User Guide*.
 *
 * If the upload was created using server-side encryption with Key Management Service (KMS) keys
 * (SSE-KMS) or dual-layer server-side encryption with Amazon Web Services KMS keys (DSSE-KMS), you must have
 * permission to the `kms:Decrypt` action for the `ListParts` request to
 * succeed.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `ListParts`:
 *
 * - CreateMultipartUpload
 *
 * - UploadPart
 *
 * - CompleteMultipartUpload
 *
 * - AbortMultipartUpload
 *
 * - GetObjectAttributes
 *
 * - ListMultipartUploads
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listParts: {
  (
    input: ListPartsRequest,
  ): effect.Effect<
    ListPartsOutput,
    NoSuchBucket | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPartsRequest,
  ) => stream.Stream<
    ListPartsOutput,
    NoSuchBucket | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPartsRequest,
  ) => stream.Stream<
    Part,
    NoSuchBucket | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPartsRequest,
  output: ListPartsOutput,
  errors: [NoSuchBucket],
  pagination: {
    inputToken: "PartNumberMarker",
    outputToken: "NextPartNumberMarker",
    items: "Parts",
    pageSize: "MaxParts",
  } as const,
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Sets the `cors` configuration for your bucket. If the configuration exists, Amazon S3 replaces
 * it.
 *
 * To use this operation, you must be allowed to perform the `s3:PutBucketCORS` action. By
 * default, the bucket owner has this permission and can grant it to others.
 *
 * You set this configuration on a bucket so that the bucket can service cross-origin requests. For
 * example, you might want to enable a request whose origin is `http://www.example.com` to
 * access your Amazon S3 bucket at `my.example.bucket.com` by using the browser's
 * `XMLHttpRequest` capability.
 *
 * To enable cross-origin resource sharing (CORS) on a bucket, you add the `cors`
 * subresource to the bucket. The `cors` subresource is an XML document in which you configure
 * rules that identify origins and the HTTP methods that can be executed on your bucket. The document is
 * limited to 64 KB in size.
 *
 * When Amazon S3 receives a cross-origin request (or a pre-flight OPTIONS request) against a bucket, it
 * evaluates the `cors` configuration on the bucket and uses the first `CORSRule`
 * rule that matches the incoming browser request to enable a cross-origin request. For a rule to match,
 * the following conditions must be met:
 *
 * - The request's `Origin` header must match `AllowedOrigin` elements.
 *
 * - The request method (for example, GET, PUT, HEAD, and so on) or the
 * `Access-Control-Request-Method` header in case of a pre-flight `OPTIONS`
 * request must be one of the `AllowedMethod` elements.
 *
 * - Every header specified in the `Access-Control-Request-Headers` request header of a
 * pre-flight request must match an `AllowedHeader` element.
 *
 * For more information about CORS, go to Enabling Cross-Origin Resource Sharing in the
 * *Amazon S3 User Guide*.
 *
 * The following operations are related to `PutBucketCors`:
 *
 * - GetBucketCors
 *
 * - DeleteBucketCors
 *
 * - RESTOPTIONSobject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketCors: (
  input: PutBucketCorsRequest,
) => effect.Effect<
  PutBucketCorsResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketCorsRequest,
  output: PutBucketCorsResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Creates or modifies `OwnershipControls` for an Amazon S3 bucket. To use this operation, you
 * must have the `s3:PutBucketOwnershipControls` permission. For more information about Amazon S3
 * permissions, see Specifying permissions in a policy.
 *
 * For information about Amazon S3 Object Ownership, see Using object ownership.
 *
 * The following operations are related to `PutBucketOwnershipControls`:
 *
 * - GetBucketOwnershipControls
 *
 * - DeleteBucketOwnershipControls
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketOwnershipControls: (
  input: PutBucketOwnershipControlsRequest,
) => effect.Effect<
  PutBucketOwnershipControlsResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketOwnershipControlsRequest,
  output: PutBucketOwnershipControlsResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Applies a legal hold configuration to the specified object. For more information, see Locking Objects.
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putObjectLegalHold: (
  input: PutObjectLegalHoldRequest,
) => effect.Effect<
  PutObjectLegalHoldOutput,
  MalformedXML | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutObjectLegalHoldRequest,
  output: PutObjectLegalHoldOutput,
  errors: [MalformedXML],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Places an Object Retention configuration on an object. For more information, see Locking Objects. Users or
 * accounts require the `s3:PutObjectRetention` permission in order to place an Object Retention
 * configuration on objects. Bypassing a Governance Retention configuration requires the
 * `s3:BypassGovernanceRetention` permission.
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putObjectRetention: (
  input: PutObjectRetentionRequest,
) => effect.Effect<
  PutObjectRetentionOutput,
  InvalidRequest | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutObjectRetentionRequest,
  output: PutObjectRetentionOutput,
  errors: [InvalidRequest],
}));
/**
 * Enables or disables a live inventory table for an S3 Metadata configuration on a general
 * purpose bucket. For more information, see
 * Accelerating
 * data discovery with S3 Metadata in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * To use this operation, you must have the following permissions. For more information, see
 * Setting up permissions for configuring metadata tables in the
 * *Amazon S3 User Guide*.
 *
 * If you want to encrypt your inventory table with server-side encryption with Key Management Service
 * (KMS) keys (SSE-KMS), you need additional permissions in your KMS key policy. For more
 * information, see
 * Setting up permissions for configuring metadata tables in the
 * *Amazon S3 User Guide*.
 *
 * - `s3:UpdateBucketMetadataInventoryTableConfiguration`
 *
 * - `s3tables:CreateTableBucket`
 *
 * - `s3tables:CreateNamespace`
 *
 * - `s3tables:GetTable`
 *
 * - `s3tables:CreateTable`
 *
 * - `s3tables:PutTablePolicy`
 *
 * - `s3tables:PutTableEncryption`
 *
 * - `kms:DescribeKey`
 *
 * The following operations are related to `UpdateBucketMetadataInventoryTableConfiguration`:
 *
 * - CreateBucketMetadataConfiguration
 *
 * - DeleteBucketMetadataConfiguration
 *
 * - GetBucketMetadataConfiguration
 *
 * - UpdateBucketMetadataJournalTableConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const updateBucketMetadataInventoryTableConfiguration: (
  input: UpdateBucketMetadataInventoryTableConfigurationRequest,
) => effect.Effect<
  UpdateBucketMetadataInventoryTableConfigurationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBucketMetadataInventoryTableConfigurationRequest,
  output: UpdateBucketMetadataInventoryTableConfigurationResponse,
  errors: [],
}));
/**
 * Enables or disables journal table record expiration for an S3 Metadata configuration on a general
 * purpose bucket. For more information, see
 * Accelerating
 * data discovery with S3 Metadata in the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * To use this operation, you must have the `s3:UpdateBucketMetadataJournalTableConfiguration`
 * permission. For more information, see Setting up permissions for
 * configuring metadata tables in the *Amazon S3 User Guide*.
 *
 * The following operations are related to `UpdateBucketMetadataJournalTableConfiguration`:
 *
 * - CreateBucketMetadataConfiguration
 *
 * - DeleteBucketMetadataConfiguration
 *
 * - GetBucketMetadataConfiguration
 *
 * - UpdateBucketMetadataInventoryTableConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const updateBucketMetadataJournalTableConfiguration: (
  input: UpdateBucketMetadataJournalTableConfigurationRequest,
) => effect.Effect<
  UpdateBucketMetadataJournalTableConfigurationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBucketMetadataJournalTableConfigurationRequest,
  output: UpdateBucketMetadataJournalTableConfigurationResponse,
  errors: [],
}));
/**
 * Uploads a part by copying data from an existing object as data source. To specify the data source,
 * you add the request header `x-amz-copy-source` in your request. To specify a byte range, you
 * add the request header `x-amz-copy-source-range` in your request.
 *
 * For information about maximum and minimum part sizes and other multipart upload specifications, see
 * Multipart upload
 * limits in the *Amazon S3 User Guide*.
 *
 * Instead of copying data from an existing object as part data, you might use the UploadPart action to
 * upload new data as a part of an object in your request.
 *
 * You must initiate a multipart upload before you can upload any part. In response to your initiate
 * request, Amazon S3 returns the upload ID, a unique identifier that you must include in your upload part
 * request.
 *
 * For conceptual information about multipart uploads, see Uploading Objects Using Multipart Upload in
 * the *Amazon S3 User Guide*. For information about copying objects using a single atomic
 * action vs. a multipart upload, see Operations on Objects in the
 * *Amazon S3 User Guide*.
 *
 * **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Authentication and authorization
 *
 * All `UploadPartCopy` requests must be authenticated and signed by using IAM
 * credentials (access key ID and secret access key for the IAM identities). All headers with the
 * `x-amz-` prefix, including `x-amz-copy-source`, must be signed. For more
 * information, see REST Authentication.
 *
 * **Directory buckets** - You must use IAM credentials to
 * authenticate and authorize your access to the `UploadPartCopy` API operation, instead
 * of using the temporary security credentials through the `CreateSession` API
 * operation.
 *
 * Amazon Web Services CLI or SDKs handles authentication and authorization on your behalf.
 *
 * ### Permissions
 *
 * You must have `READ` access to the source object and `WRITE` access to
 * the destination bucket.
 *
 * - **General purpose bucket permissions** - You must have the
 * permissions in a policy based on the bucket types of your source bucket and destination bucket
 * in an `UploadPartCopy` operation.
 *
 * - If the source object is in a general purpose bucket, you must have the
 * `s3:GetObject`
 * permission to read the source object that is
 * being copied.
 *
 * - If the destination bucket is a general purpose bucket, you must have the
 * `s3:PutObject`
 * permission to write the object copy to
 * the destination bucket.
 *
 * - To perform a multipart upload with encryption using an Key Management Service key, the requester
 * must have permission to the `kms:Decrypt` and `kms:GenerateDataKey`
 * actions on the key. The requester must also have permissions for the
 * `kms:GenerateDataKey` action for the `CreateMultipartUpload` API.
 * Then, the requester needs permissions for the `kms:Decrypt` action on the
 * `UploadPart` and `UploadPartCopy` APIs. These permissions are
 * required because Amazon S3 must decrypt and read data from the encrypted file parts before it
 * completes the multipart upload. For more information about KMS permissions, see Protecting
 * data using server-side encryption with KMS in the
 * *Amazon S3 User Guide*. For information about the permissions required to
 * use the multipart upload API, see Multipart upload and
 * permissions and Multipart upload API
 * and permissions in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - You must have
 * permissions in a bucket policy or an IAM identity-based policy based on the source and destination bucket types
 * in an `UploadPartCopy` operation.
 *
 * - If the source object that you want to copy is in a directory bucket, you must have
 * the
 * `s3express:CreateSession`
 * permission in
 * the `Action` element of a policy to read the object. By default, the session is
 * in the `ReadWrite` mode. If you want to restrict the access, you can explicitly
 * set the `s3express:SessionMode` condition key to `ReadOnly` on the
 * copy source bucket.
 *
 * - If the copy destination is a directory bucket, you must have the
 * `s3express:CreateSession`
 * permission in the
 * `Action` element of a policy to write the object to the destination. The
 * `s3express:SessionMode` condition key cannot be set to `ReadOnly`
 * on the copy destination.
 *
 * If the object is encrypted with SSE-KMS, you must also have the
 * `kms:GenerateDataKey` and `kms:Decrypt` permissions in IAM
 * identity-based policies and KMS key policies for the KMS key.
 *
 * For example policies, see Example
 * bucket policies for S3 Express One Zone and Amazon Web Services
 * Identity and Access Management (IAM) identity-based policies for S3 Express One Zone in the
 * *Amazon S3 User Guide*.
 *
 * ### Encryption
 *
 * - **General purpose buckets ** -
 * For information about using server-side encryption with
 * customer-provided encryption keys with the `UploadPartCopy` operation, see CopyObject and
 * UploadPart.
 *
 * If you have server-side encryption with customer-provided keys (SSE-C) blocked for your general purpose bucket, you will get an HTTP 403 Access Denied error when you specify the SSE-C request headers while writing new data to your bucket. For more information, see Blocking or unblocking SSE-C for a general purpose bucket.
 *
 * - **Directory buckets ** -
 * For directory buckets, there are only two supported options for server-side encryption: server-side encryption with Amazon S3 managed keys (SSE-S3) (`AES256`) and server-side encryption with KMS keys (SSE-KMS) (`aws:kms`). For more
 * information, see Protecting data with server-side encryption in the *Amazon S3 User Guide*.
 *
 * For directory buckets, when you perform a `CreateMultipartUpload` operation
 * and an `UploadPartCopy` operation, the request headers you provide in the
 * `CreateMultipartUpload` request must match the default encryption configuration
 * of the destination bucket.
 *
 * S3 Bucket Keys aren't supported, when you copy SSE-KMS encrypted objects from general purpose buckets
 * to directory buckets, from directory buckets to general purpose buckets, or between directory buckets, through UploadPartCopy. In this case, Amazon S3 makes a call to KMS every time a copy request is made for a KMS-encrypted object.
 *
 * ### Special errors
 *
 * - Error Code: `NoSuchUpload`
 *
 * - Description: The specified multipart upload does not exist. The upload ID might be
 * invalid, or the multipart upload might have been aborted or completed.
 *
 * - HTTP Status Code: 404 Not Found
 *
 * - Error Code: `InvalidRequest`
 *
 * - Description: The specified copy source is not supported as a byte-range copy
 * source.
 *
 * - HTTP Status Code: 400 Bad Request
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `UploadPartCopy`:
 *
 * - CreateMultipartUpload
 *
 * - UploadPart
 *
 * - CompleteMultipartUpload
 *
 * - AbortMultipartUpload
 *
 * - ListParts
 *
 * - ListMultipartUploads
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const uploadPartCopy: (
  input: UploadPartCopyRequest,
) => effect.Effect<
  UploadPartCopyOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadPartCopyRequest,
  output: UploadPartCopyOutput,
  errors: [NoSuchBucket],
}));
/**
 * Completes a multipart upload by assembling previously uploaded parts.
 *
 * You first initiate the multipart upload and then upload all parts using the UploadPart operation or the
 * UploadPartCopy
 * operation. After successfully uploading all relevant parts of an upload, you call this
 * `CompleteMultipartUpload` operation to complete the upload. Upon receiving this request,
 * Amazon S3 concatenates all the parts in ascending order by part number to create a new object. In the
 * CompleteMultipartUpload request, you must provide the parts list and ensure that the parts list is
 * complete. The CompleteMultipartUpload API operation concatenates the parts that you provide in the list.
 * For each part in the list, you must provide the `PartNumber` value and the `ETag`
 * value that are returned after that part was uploaded.
 *
 * The processing of a CompleteMultipartUpload request could take several minutes to finalize. After
 * Amazon S3 begins processing the request, it sends an HTTP response header that specifies a 200
 * OK response. While processing is in progress, Amazon S3 periodically sends white space characters to
 * keep the connection from timing out. A request could fail after the initial `200 OK` response
 * has been sent. This means that a `200 OK` response can contain either a success or an error.
 * The error response might be embedded in the `200 OK` response. If you call this API operation
 * directly, make sure to design your application to parse the contents of the response and handle it
 * appropriately. If you use Amazon Web Services SDKs, SDKs handle this condition. The SDKs detect the embedded error and
 * apply error handling per your configuration settings (including automatically retrying the request as
 * appropriate). If the condition persists, the SDKs throw an exception (or, for the SDKs that don't use
 * exceptions, they return an error).
 *
 * Note that if `CompleteMultipartUpload` fails, applications should be prepared to retry
 * any failed requests (including 500 error responses). For more information, see Amazon S3 Error Best
 * Practices.
 *
 * You can't use `Content-Type: application/x-www-form-urlencoded` for the
 * CompleteMultipartUpload requests. Also, if you don't provide a `Content-Type` header,
 * `CompleteMultipartUpload` can still return a `200 OK` response.
 *
 * For more information about multipart uploads, see Uploading Objects Using Multipart Upload in
 * the *Amazon S3 User Guide*.
 *
 * **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - For information
 * about permissions required to use the multipart upload API, see Multipart Upload and Permissions in
 * the *Amazon S3 User Guide*.
 *
 * If you provide an additional checksum value in your `MultipartUpload` requests and the
 * object is encrypted with Key Management Service, you must have permission to use the
 * `kms:Decrypt` action for the `CompleteMultipartUpload` request to
 * succeed.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * If the object is encrypted with SSE-KMS, you must also have the
 * `kms:GenerateDataKey` and `kms:Decrypt` permissions in IAM
 * identity-based policies and KMS key policies for the KMS key.
 *
 * ### Special errors
 *
 * - Error Code: `EntityTooSmall`
 *
 * - Description: Your proposed upload is smaller than the minimum allowed object size.
 * Each part must be at least 5 MB in size, except the last part.
 *
 * - HTTP Status Code: 400 Bad Request
 *
 * - Error Code: `InvalidPart`
 *
 * - Description: One or more of the specified parts could not be found. The part might not
 * have been uploaded, or the specified ETag might not have matched the uploaded part's
 * ETag.
 *
 * - HTTP Status Code: 400 Bad Request
 *
 * - Error Code: `InvalidPartOrder`
 *
 * - Description: The list of parts was not in ascending order. The parts list must be
 * specified in order by part number.
 *
 * - HTTP Status Code: 400 Bad Request
 *
 * - Error Code: `NoSuchUpload`
 *
 * - Description: The specified multipart upload does not exist. The upload ID might be
 * invalid, or the multipart upload might have been aborted or completed.
 *
 * - HTTP Status Code: 404 Not Found
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `CompleteMultipartUpload`:
 *
 * - CreateMultipartUpload
 *
 * - UploadPart
 *
 * - AbortMultipartUpload
 *
 * - ListParts
 *
 * - ListMultipartUploads
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const completeMultipartUpload: (
  input: CompleteMultipartUploadRequest,
) => effect.Effect<
  CompleteMultipartUploadOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteMultipartUploadRequest,
  output: CompleteMultipartUploadOutput,
  errors: [],
}));
/**
 * Creates a copy of an object that is already stored in Amazon S3.
 *
 * End of support notice: As of October 1, 2025, Amazon S3 has discontinued support for Email Grantee Access Control Lists (ACLs). If you attempt to use an Email Grantee ACL in a request after October 1, 2025,
 * the request will receive an `HTTP 405` (Method Not Allowed) error.
 *
 * This change affects the following Amazon Web Services Regions: US East (N. Virginia), US West (N. California), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Europe (Ireland), and South America (São Paulo).
 *
 * You can store individual objects of up to 50 TB in Amazon S3. You create a copy of your
 * object up to 5 GB in size in a single atomic action using this API. However, to copy an
 * object greater than 5 GB, you must use the multipart upload Upload Part - Copy
 * (UploadPartCopy) API. For more information, see Copy Object Using the REST
 * Multipart Upload API.
 *
 * You can copy individual objects between general purpose buckets, between directory buckets, and between
 * general purpose buckets and directory buckets.
 *
 * - Amazon S3 supports copy operations using Multi-Region Access Points only as a destination when
 * using the Multi-Region Access Point ARN.
 *
 * - **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * - VPC endpoints don't support cross-Region requests (including copies). If you're using VPC
 * endpoints, your source and destination buckets should be in the same Amazon Web Services Region as your VPC
 * endpoint.
 *
 * Both the Region that you want to copy the object from and the Region that you want to copy the
 * object to must be enabled for your account. For more information about how to enable a Region for your
 * account, see Enable
 * or disable a Region for standalone accounts in the Amazon Web Services Account Management
 * Guide.
 *
 * Amazon S3 transfer acceleration does not support cross-Region copies. If you request a cross-Region
 * copy using a transfer acceleration endpoint, you get a `400 Bad Request` error. For more
 * information, see Transfer Acceleration.
 *
 * ### Authentication and authorization
 *
 * All `CopyObject` requests must be authenticated and signed by using IAM
 * credentials (access key ID and secret access key for the IAM identities). All headers with the
 * `x-amz-` prefix, including `x-amz-copy-source`, must be signed. For more
 * information, see REST Authentication.
 *
 * **Directory buckets** - You must use the IAM
 * credentials to authenticate and authorize your access to the `CopyObject` API
 * operation, instead of using the temporary security credentials through the
 * `CreateSession` API operation.
 *
 * Amazon Web Services CLI or SDKs handles authentication and authorization on your behalf.
 *
 * ### Permissions
 *
 * You must have *read* access to the source object and
 * *write* access to the destination bucket.
 *
 * - **General purpose bucket permissions** - You must have
 * permissions in an IAM policy based on the source and destination bucket types in a
 * `CopyObject` operation.
 *
 * - If the source object is in a general purpose bucket, you must have
 * `s3:GetObject`
 * permission to read the source object that is
 * being copied.
 *
 * - If the destination bucket is a general purpose bucket, you must have
 * `s3:PutObject`
 * permission to write the object copy to the
 * destination bucket.
 *
 * - **Directory bucket permissions** - You must have
 * permissions in a bucket policy or an IAM identity-based policy based on the source and destination bucket types
 * in a `CopyObject` operation.
 *
 * - If the source object that you want to copy is in a directory bucket, you must have
 * the
 * `s3express:CreateSession`
 * permission in
 * the `Action` element of a policy to read the object. By default, the session is
 * in the `ReadWrite` mode. If you want to restrict the access, you can explicitly
 * set the `s3express:SessionMode` condition key to `ReadOnly` on the
 * copy source bucket.
 *
 * - If the copy destination is a directory bucket, you must have the
 * `s3express:CreateSession`
 * permission in the
 * `Action` element of a policy to write the object to the destination. The
 * `s3express:SessionMode` condition key can't be set to `ReadOnly`
 * on the copy destination bucket.
 *
 * If the object is encrypted with SSE-KMS, you must also have the
 * `kms:GenerateDataKey` and `kms:Decrypt` permissions in IAM
 * identity-based policies and KMS key policies for the KMS key.
 *
 * For example policies, see Example
 * bucket policies for S3 Express One Zone and Amazon Web Services
 * Identity and Access Management (IAM) identity-based policies for S3 Express One Zone in the
 * *Amazon S3 User Guide*.
 *
 * ### Response and special errors
 *
 * When the request is an HTTP 1.1 request, the response is chunk encoded. When the request is
 * not an HTTP 1.1 request, the response would not contain the `Content-Length`. You
 * always need to read the entire response body to check if the copy succeeds.
 *
 * - If the copy is successful, you receive a response with information about the copied
 * object.
 *
 * - A copy request might return an error when Amazon S3 receives the copy request or while Amazon S3 is
 * copying the files. A `200 OK` response can contain either a success or an
 * error.
 *
 * - If the error occurs before the copy action starts, you receive a standard Amazon S3
 * error.
 *
 * - If the error occurs during the copy operation, the error response is embedded in the
 * `200 OK` response. For example, in a cross-region copy, you may encounter
 * throttling and receive a `200 OK` response. For more information, see Resolve the Error
 * 200 response when copying objects to Amazon S3. The `200 OK` status code
 * means the copy was accepted, but it doesn't mean the copy is complete. Another example is
 * when you disconnect from Amazon S3 before the copy is complete, Amazon S3 might cancel the copy and
 * you may receive a `200 OK` response. You must stay connected to Amazon S3 until the
 * entire response is successfully received and processed.
 *
 * If you call this API operation directly, make sure to design your application to parse
 * the content of the response and handle it appropriately. If you use Amazon Web Services SDKs, SDKs
 * handle this condition. The SDKs detect the embedded error and apply error handling per
 * your configuration settings (including automatically retrying the request as appropriate).
 * If the condition persists, the SDKs throw an exception (or, for the SDKs that don't use
 * exceptions, they return an error).
 *
 * ### Charge
 *
 * The copy request charge is based on the storage class and Region that you specify for the
 * destination object. The request can also result in a data retrieval charge for the source if the
 * source storage class bills for data retrieval. If the copy source is in a different region, the
 * data transfer is billed to the copy source account. For pricing information, see Amazon S3 pricing.
 *
 * ### HTTP Host header syntax
 *
 * - **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * - **Amazon S3 on Outposts** - When you use this action with
 * S3 on Outposts through the REST API, you must direct requests to the S3 on Outposts hostname. The
 * S3 on Outposts hostname takes the form
 *
 * *AccessPointName*-*AccountId*.*outpostID*.s3-outposts.*Region*.amazonaws.com.
 * The hostname isn't required when you use the Amazon Web Services CLI or SDKs.
 *
 * The following operations are related to `CopyObject`:
 *
 * - PutObject
 *
 * - GetObject
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const copyObject: (
  input: CopyObjectRequest,
) => effect.Effect<
  CopyObjectOutput,
  ObjectNotInActiveTierError | NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyObjectRequest,
  output: CopyObjectOutput,
  errors: [ObjectNotInActiveTierError, NoSuchBucket],
}));
/**
 * This action creates an Amazon S3 bucket. To create an Amazon S3 on Outposts bucket, see
 * `CreateBucket`
 * .
 *
 * Creates a new S3 bucket. To create a bucket, you must set up Amazon S3 and have a valid Amazon Web Services Access Key
 * ID to authenticate requests. Anonymous requests are never allowed to create buckets. By creating the
 * bucket, you become the bucket owner.
 *
 * There are two types of buckets: general purpose buckets and directory buckets. For more information about
 * these bucket types, see Creating, configuring, and working with Amazon S3
 * buckets in the *Amazon S3 User Guide*.
 *
 * - **General purpose buckets** - If you send your
 * `CreateBucket` request to the `s3.amazonaws.com` global endpoint, the
 * request goes to the `us-east-1` Region. So the signature calculations in Signature
 * Version 4 must use `us-east-1` as the Region, even if the location constraint in the
 * request specifies another Region where the bucket is to be created. If you create a bucket in a
 * Region other than US East (N. Virginia), your application must be able to handle 307 redirect. For
 * more information, see Virtual hosting of buckets in the *Amazon S3 User Guide*.
 *
 * - **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - In addition to the
 * `s3:CreateBucket` permission, the following permissions are required in a policy
 * when your `CreateBucket` request includes specific headers:
 *
 * - **Access control lists (ACLs)** - In your
 * `CreateBucket` request, if you specify an access control list (ACL) and set
 * it to `public-read`, `public-read-write`,
 * `authenticated-read`, or if you explicitly specify any other custom ACLs,
 * both `s3:CreateBucket` and `s3:PutBucketAcl` permissions are
 * required. In your `CreateBucket` request, if you set the ACL to
 * `private`, or if you don't specify any ACLs, only the
 * `s3:CreateBucket` permission is required.
 *
 * - **Object Lock** - In your
 * `CreateBucket` request, if you set
 * `x-amz-bucket-object-lock-enabled` to true, the
 * `s3:PutBucketObjectLockConfiguration` and `s3:PutBucketVersioning`
 * permissions are required.
 *
 * - **S3 Object Ownership** - If your
 * `CreateBucket` request includes the `x-amz-object-ownership`
 * header, then the `s3:PutBucketOwnershipControls` permission is required.
 *
 * To set an ACL on a bucket as part of a `CreateBucket` request, you must
 * explicitly set S3 Object Ownership for the bucket to a different value than the default,
 * `BucketOwnerEnforced`. Additionally, if your desired bucket ACL grants
 * public access, you must first create the bucket (without the bucket ACL) and then
 * explicitly disable Block Public Access on the bucket before using
 * `PutBucketAcl` to set the ACL. If you try to create a bucket with a public
 * ACL, the request will fail.
 *
 * For the majority of modern use cases in S3, we recommend that you keep all Block
 * Public Access settings enabled and keep ACLs disabled. If you would like to share data
 * with users outside of your account, you can use bucket policies as needed. For more
 * information, see Controlling ownership of
 * objects and disabling ACLs for your bucket and Blocking
 * public access to your Amazon S3 storage in the
 * *Amazon S3 User Guide*.
 *
 * - **S3 Block Public Access** - If your specific use
 * case requires granting public access to your S3 resources, you can disable Block Public
 * Access. Specifically, you can create a new bucket with Block Public Access enabled, then
 * separately call the
 * `DeletePublicAccessBlock`
 * API. To use this operation, you must have the
 * `s3:PutBucketPublicAccessBlock` permission. For more information about S3
 * Block Public Access, see Blocking public
 * access to your Amazon S3 storage in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - You must have the
 * `s3express:CreateBucket` permission in an IAM identity-based policy instead of a bucket policy.
 * Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource. For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * The permissions for ACLs, Object Lock, S3 Object Ownership, and S3 Block Public Access
 * are not supported for directory buckets. For directory buckets, all Block Public Access
 * settings are enabled at the bucket level and S3 Object Ownership is set to Bucket owner
 * enforced (ACLs disabled). These settings can't be modified.
 *
 * For more information about permissions for creating and working with directory buckets,
 * see Directory buckets
 * in the *Amazon S3 User Guide*. For more information about supported S3
 * features for directory buckets, see Features of
 * S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region-code*.amazonaws.com`.
 *
 * The following operations are related to `CreateBucket`:
 *
 * - PutObject
 *
 * - DeleteBucket
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const createBucket: (
  input: CreateBucketRequest,
) => effect.Effect<
  CreateBucketOutput,
  | BucketAlreadyExists
  | BucketAlreadyOwnedByYou
  | IllegalLocationConstraintException
  | InvalidArgument
  | InvalidBucketName
  | InvalidLocationConstraint
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBucketRequest,
  output: CreateBucketOutput,
  errors: [
    BucketAlreadyExists,
    BucketAlreadyOwnedByYou,
    IllegalLocationConstraintException,
    InvalidArgument,
    InvalidBucketName,
    InvalidLocationConstraint,
  ],
}));
/**
 * Retrieves all of the metadata from an object without returning the object itself. This operation is
 * useful if you're interested only in an object's metadata.
 *
 * `GetObjectAttributes` combines the functionality of `HeadObject` and
 * `ListParts`. All of the data returned with both of those individual calls can be returned
 * with a single call to `GetObjectAttributes`.
 *
 * **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - To use
 * `GetObjectAttributes`, you must have READ access to the object.
 *
 * The other permissions that you need to use this operation depend on whether the bucket is
 * versioned and if a version ID is passed in the `GetObjectAttributes` request.
 *
 * - If you pass a version ID in your request, you need both the
 * `s3:GetObjectVersion` and `s3:GetObjectVersionAttributes`
 * permissions.
 *
 * - If you do not pass a version ID in your request, you need the
 * `s3:GetObject` and `s3:GetObjectAttributes` permissions.
 *
 * For more information, see Specifying Permissions in a
 * Policy in the *Amazon S3 User Guide*.
 *
 * If the object that you request does not exist, the error Amazon S3 returns depends on whether
 * you also have the `s3:ListBucket` permission.
 *
 * - If you have the `s3:ListBucket` permission on the bucket, Amazon S3 returns an
 * HTTP status code `404 Not Found` ("no such key") error.
 *
 * - If you don't have the `s3:ListBucket` permission, Amazon S3 returns an HTTP
 * status code `403 Forbidden` ("access denied") error.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * If
 * the
 * object is encrypted with SSE-KMS, you must also have the `kms:GenerateDataKey` and
 * `kms:Decrypt` permissions in IAM identity-based policies and KMS key policies
 * for the KMS key.
 *
 * ### Encryption
 *
 * Encryption request headers, like `x-amz-server-side-encryption`, should not be
 * sent for `HEAD` requests if your object uses server-side encryption with Key Management Service
 * (KMS) keys (SSE-KMS), dual-layer server-side encryption with Amazon Web Services KMS keys (DSSE-KMS), or
 * server-side encryption with Amazon S3 managed encryption keys (SSE-S3). The
 * `x-amz-server-side-encryption` header is used when you `PUT` an object
 * to S3 and want to specify the encryption method. If you include this header in a
 * `GET` request for an object that uses these types of keys, you’ll get an HTTP
 * `400 Bad Request` error. It's because the encryption method can't be changed when
 * you retrieve the object.
 *
 * If you encrypted an object when you stored the object in Amazon S3 by using server-side encryption
 * with customer-provided encryption keys (SSE-C), then when you retrieve the metadata from the
 * object, you must use the following headers. These headers provide the server with the encryption
 * key required to retrieve the object's metadata. The headers are:
 *
 * - `x-amz-server-side-encryption-customer-algorithm`
 *
 * - `x-amz-server-side-encryption-customer-key`
 *
 * - `x-amz-server-side-encryption-customer-key-MD5`
 *
 * For more information about SSE-C, see Server-Side Encryption (Using
 * Customer-Provided Encryption Keys) in the *Amazon S3 User Guide*.
 *
 * **Directory bucket permissions** -
 * For directory buckets, there are only two supported options for server-side encryption: server-side encryption with Amazon S3 managed keys (SSE-S3) (`AES256`) and server-side encryption with KMS keys (SSE-KMS) (`aws:kms`). We recommend that the bucket's default encryption uses the desired encryption configuration and you don't override the bucket default encryption in your
 * `CreateSession` requests or `PUT` object requests. Then, new objects
 * are automatically encrypted with the desired encryption settings. For more
 * information, see Protecting data with server-side encryption in the *Amazon S3 User Guide*. For more information about the encryption overriding behaviors in directory buckets, see Specifying server-side encryption with KMS for new object uploads.
 *
 * ### Versioning
 *
 * **Directory buckets** - S3 Versioning isn't enabled and supported for directory buckets. For this API operation, only the `null` value of the version ID is supported by directory buckets.
 * You can only specify `null` to the `versionId` query parameter in the
 * request.
 *
 * ### Conditional request headers
 *
 * Consider the following when using request headers:
 *
 * - If both of the `If-Match` and `If-Unmodified-Since` headers are
 * present in the request as follows, then Amazon S3 returns the HTTP status code `200 OK`
 * and the data requested:
 *
 * - `If-Match` condition evaluates to `true`.
 *
 * - `If-Unmodified-Since` condition evaluates to `false`.
 *
 * For more information about conditional requests, see RFC 7232.
 *
 * - If both of the `If-None-Match` and `If-Modified-Since` headers are
 * present in the request as follows, then Amazon S3 returns the HTTP status code 304 Not
 * Modified:
 *
 * - `If-None-Match` condition evaluates to `false`.
 *
 * - `If-Modified-Since` condition evaluates to `true`.
 *
 * For more information about conditional requests, see RFC 7232.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following actions are related to `GetObjectAttributes`:
 *
 * - GetObject
 *
 * - GetObjectAcl
 *
 * - GetObjectLegalHold
 *
 * - GetObjectLockConfiguration
 *
 * - GetObjectRetention
 *
 * - GetObjectTagging
 *
 * - HeadObject
 *
 * - ListParts
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getObjectAttributes: (
  input: GetObjectAttributesRequest,
) => effect.Effect<
  GetObjectAttributesOutput,
  NoSuchKey | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectAttributesRequest,
  output: GetObjectAttributesOutput,
  errors: [NoSuchKey],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Returns some or all (up to 1,000) of the objects in a bucket. You can use the request parameters as
 * selection criteria to return a subset of the objects in a bucket. A 200 OK response can contain valid or
 * invalid XML. Be sure to design your application to parse the contents of the response and handle it
 * appropriately.
 *
 * This action has been revised. We recommend that you use the newer version, ListObjectsV2, when
 * developing applications. For backward compatibility, Amazon S3 continues to support
 * `ListObjects`.
 *
 * The following operations are related to `ListObjects`:
 *
 * - ListObjectsV2
 *
 * - GetObject
 *
 * - PutObject
 *
 * - CreateBucket
 *
 * - ListBuckets
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const listObjects: (
  input: ListObjectsRequest,
) => effect.Effect<
  ListObjectsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListObjectsRequest,
  output: ListObjectsOutput,
  errors: [NoSuchBucket],
}));
/**
 * End of support notice: As of October 1, 2025, Amazon S3 has discontinued support for Email Grantee Access Control Lists (ACLs). If you attempt to use an Email Grantee ACL in a request after October 1, 2025,
 * the request will receive an `HTTP 405` (Method Not Allowed) error.
 *
 * This change affects the following Amazon Web Services Regions: US East (N. Virginia), US West (N. California), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Europe (Ireland), and South America (São Paulo).
 *
 * This operation is not supported for directory buckets.
 *
 * Sets the permissions on an existing bucket using access control lists (ACL). For more information,
 * see Using ACLs. To
 * set the ACL of a bucket, you must have the `WRITE_ACP` permission.
 *
 * You can use one of the following two ways to set a bucket's permissions:
 *
 * - Specify the ACL in the request body
 *
 * - Specify permissions using request headers
 *
 * You cannot specify access permission using both the body and the request headers.
 *
 * Depending on your application needs, you may choose to set the ACL on a bucket using either the
 * request body or the headers. For example, if you have an existing application that updates a bucket ACL
 * using the request body, then you can continue to use that approach.
 *
 * If your bucket uses the bucket owner enforced setting for S3 Object Ownership, ACLs are disabled
 * and no longer affect permissions. You must use policies to grant access to your bucket and the objects
 * in it. Requests to set ACLs or update ACLs fail and return the
 * `AccessControlListNotSupported` error code. Requests to read ACLs are still supported.
 * For more information, see Controlling object ownership in
 * the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * You can set access permissions by using one of the following methods:
 *
 * - Specify a canned ACL with the `x-amz-acl` request header. Amazon S3 supports a set
 * of predefined ACLs, known as *canned ACLs*. Each canned ACL has a
 * predefined set of grantees and permissions. Specify the canned ACL name as the value of
 * `x-amz-acl`. If you use this header, you cannot use other access control-specific
 * headers in your request. For more information, see Canned ACL.
 *
 * - Specify access permissions explicitly with the `x-amz-grant-read`,
 * `x-amz-grant-read-acp`, `x-amz-grant-write-acp`, and
 * `x-amz-grant-full-control` headers. When using these headers, you specify
 * explicit access permissions and grantees (Amazon Web Services accounts or Amazon S3 groups) who will receive the
 * permission. If you use these ACL-specific headers, you cannot use the `x-amz-acl`
 * header to set a canned ACL. These parameters map to the set of permissions that Amazon S3 supports
 * in an ACL. For more information, see Access Control List (ACL)
 * Overview.
 *
 * You specify each grantee as a type=value pair, where the type is one of the
 * following:
 *
 * - `id` – if the value specified is the canonical user ID of an
 * Amazon Web Services account
 *
 * - `uri` – if you are granting permissions to a predefined group
 *
 * - `emailAddress` – if the value specified is the email address of an
 * Amazon Web Services account
 *
 * Using email addresses to specify a grantee is only supported in the following Amazon Web Services Regions:
 *
 * - US East (N. Virginia)
 *
 * - US West (N. California)
 *
 * - US West (Oregon)
 *
 * - Asia Pacific (Singapore)
 *
 * - Asia Pacific (Sydney)
 *
 * - Asia Pacific (Tokyo)
 *
 * - Europe (Ireland)
 *
 * - South America (São Paulo)
 *
 * For a list of all the Amazon S3 supported Regions and endpoints, see Regions and Endpoints in the Amazon Web Services General Reference.
 *
 * For example, the following `x-amz-grant-write` header grants create, overwrite,
 * and delete objects permission to LogDelivery group predefined by Amazon S3 and two Amazon Web Services accounts
 * identified by their email addresses.
 *
 * x-amz-grant-write: uri="http://acs.amazonaws.com/groups/s3/LogDelivery",
 * id="111122223333", id="555566667777"
 *
 * You can use either a canned ACL or specify access permissions explicitly. You cannot do
 * both.
 *
 * ### Grantee Values
 *
 * You can specify the person (grantee) to whom you're assigning access rights (using request
 * elements) in the following ways. For examples of how to specify these grantee values in JSON
 * format, see the Amazon Web Services CLI example in Enabling Amazon S3 server
 * access logging in the *Amazon S3 User Guide*.
 *
 * - By the person's ID:
 *
 * <>ID<><>GranteesEmail<>
 *
 * DisplayName is optional and ignored in the request
 *
 * - By URI:
 *
 * <>http://acs.amazonaws.com/groups/global/AuthenticatedUsers<>
 *
 * - By Email address:
 *
 * <>Grantees@email.com<>&
 *
 * The grantee is resolved to the CanonicalUser and, in a response to a GET Object acl
 * request, appears as the CanonicalUser.
 *
 * Using email addresses to specify a grantee is only supported in the following Amazon Web Services Regions:
 *
 * - US East (N. Virginia)
 *
 * - US West (N. California)
 *
 * - US West (Oregon)
 *
 * - Asia Pacific (Singapore)
 *
 * - Asia Pacific (Sydney)
 *
 * - Asia Pacific (Tokyo)
 *
 * - Europe (Ireland)
 *
 * - South America (São Paulo)
 *
 * For a list of all the Amazon S3 supported Regions and endpoints, see Regions and Endpoints in the Amazon Web Services General Reference.
 *
 * The following operations are related to `PutBucketAcl`:
 *
 * - CreateBucket
 *
 * - DeleteBucket
 *
 * - GetObjectAcl
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketAcl: (
  input: PutBucketAclRequest,
) => effect.Effect<
  PutBucketAclResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketAclRequest,
  output: PutBucketAclResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation configures default encryption and Amazon S3 Bucket Keys for an existing bucket. You can also block encryption types using this operation.
 *
 * **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * By default, all buckets have a default encryption configuration that uses server-side encryption
 * with Amazon S3 managed keys (SSE-S3).
 *
 * - **General purpose buckets**
 *
 * - You can optionally configure default encryption for a bucket by using server-side
 * encryption with Key Management Service (KMS) keys (SSE-KMS) or dual-layer server-side encryption with
 * Amazon Web Services KMS keys (DSSE-KMS). If you specify default encryption by using SSE-KMS, you can also
 * configure Amazon S3 Bucket
 * Keys. For information about the bucket default encryption feature, see Amazon S3 Bucket Default
 * Encryption in the *Amazon S3 User Guide*.
 *
 * - If you use PutBucketEncryption to set your default bucket encryption to
 * SSE-KMS, you should verify that your KMS key ID is correct. Amazon S3 doesn't validate the
 * KMS key ID provided in PutBucketEncryption requests.
 *
 * - **Directory buckets ** - You can optionally configure
 * default encryption for a bucket by using server-side encryption with Key Management Service (KMS) keys
 * (SSE-KMS).
 *
 * - We recommend that the bucket's default encryption uses the desired encryption
 * configuration and you don't override the bucket default encryption in your
 * `CreateSession` requests or `PUT` object requests. Then, new objects
 * are automatically encrypted with the desired encryption settings.
 * For more information about the encryption overriding behaviors in directory buckets, see Specifying server-side encryption with KMS for new object uploads.
 *
 * - Your SSE-KMS configuration can only support 1 customer managed key per directory bucket's lifetime.
 * The Amazon Web Services managed key (`aws/s3`) isn't supported.
 *
 * - S3 Bucket Keys are always enabled for `GET` and `PUT` operations in a directory bucket and can’t be disabled. S3 Bucket Keys aren't supported, when you copy SSE-KMS encrypted objects from general purpose buckets
 * to directory buckets, from directory buckets to general purpose buckets, or between directory buckets, through CopyObject, UploadPartCopy, the Copy operation in Batch Operations, or
 * the import jobs. In this case, Amazon S3 makes a call to KMS every time a copy request is made for a KMS-encrypted object.
 *
 * - When you specify an KMS customer managed key for encryption in your directory bucket, only use the key ID or key ARN. The key alias format of the KMS key isn't supported.
 *
 * - For directory buckets, if you use PutBucketEncryption to set your default bucket
 * encryption to SSE-KMS, Amazon S3 validates the KMS key ID provided in
 * PutBucketEncryption requests.
 *
 * If you're specifying a customer managed KMS key, we recommend using a fully qualified KMS key
 * ARN. If you use a KMS key alias instead, then KMS resolves the key within the requester’s account.
 * This behavior can result in data that's encrypted with a KMS key that belongs to the requester, and
 * not the bucket owner.
 *
 * Also, this action requires Amazon Web Services Signature Version 4. For more information, see Authenticating
 * Requests (Amazon Web Services Signature Version 4).
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - The
 * `s3:PutEncryptionConfiguration` permission is required in a policy. The bucket
 * owner has this permission by default. The bucket owner can grant this permission to others.
 * For more information about permissions, see Permissions Related to Bucket Operations and Managing Access Permissions to Your
 * Amazon S3 Resources in the *Amazon S3 User Guide*.
 *
 * - **Directory bucket permissions** - To grant access to
 * this API operation, you must have the `s3express:PutEncryptionConfiguration`
 * permission in an IAM identity-based policy instead of a bucket policy. Cross-account access to this API operation isn't supported. This operation can only be performed by the Amazon Web Services account that owns the resource.
 * For more information about directory bucket policies and permissions, see Amazon Web Services Identity and Access Management (IAM) for S3 Express One Zone in the *Amazon S3 User Guide*.
 *
 * To set a directory bucket default encryption with SSE-KMS, you must also have the
 * `kms:GenerateDataKey` and the `kms:Decrypt` permissions in IAM
 * identity-based policies and KMS key policies for the target KMS key.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is `s3express-control.*region-code*.amazonaws.com`.
 *
 * The following operations are related to `PutBucketEncryption`:
 *
 * - GetBucketEncryption
 *
 * - DeleteBucketEncryption
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketEncryption: (
  input: PutBucketEncryptionRequest,
) => effect.Effect<
  PutBucketEncryptionResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketEncryptionRequest,
  output: PutBucketEncryptionResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Puts a S3 Intelligent-Tiering configuration to the specified bucket. You can have up to 1,000
 * S3 Intelligent-Tiering configurations per bucket.
 *
 * The S3 Intelligent-Tiering storage class is designed to optimize storage costs by automatically moving data to the most cost-effective storage access tier, without performance impact or operational overhead. S3 Intelligent-Tiering delivers automatic cost savings in three low latency and high throughput access tiers. To get the lowest storage cost on data that can be accessed in minutes to hours, you can choose to activate additional archiving capabilities.
 *
 * The S3 Intelligent-Tiering storage class is the ideal storage class for data with unknown, changing, or unpredictable access patterns, independent of object size or retention period. If the size of an object is less than 128 KB, it is not monitored and not eligible for auto-tiering. Smaller objects can be stored, but they are always charged at the Frequent Access tier rates in the S3 Intelligent-Tiering storage class.
 *
 * For more information, see Storage class for automatically optimizing frequently and infrequently accessed objects.
 *
 * Operations related to `PutBucketIntelligentTieringConfiguration` include:
 *
 * - DeleteBucketIntelligentTieringConfiguration
 *
 * - GetBucketIntelligentTieringConfiguration
 *
 * - ListBucketIntelligentTieringConfigurations
 *
 * You only need S3 Intelligent-Tiering enabled on a bucket if you want to automatically move objects
 * stored in the S3 Intelligent-Tiering storage class to the Archive Access or Deep Archive Access
 * tier.
 *
 * `PutBucketIntelligentTieringConfiguration` has the following special errors:
 *
 * ### HTTP 400 Bad Request Error
 *
 * *Code:* InvalidArgument
 *
 * *Cause:* Invalid Argument
 *
 * ### HTTP 400 Bad Request Error
 *
 * *Code:* TooManyConfigurations
 *
 * *Cause:* You are attempting to create a new configuration but have already
 * reached the 1,000-configuration limit.
 *
 * ### HTTP 403 Forbidden Error
 *
 * *Cause:* You are not the owner of the specified bucket, or you do not have
 * the `s3:PutIntelligentTieringConfiguration` bucket permission to set the configuration
 * on the bucket.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketIntelligentTieringConfiguration: (
  input: PutBucketIntelligentTieringConfigurationRequest,
) => effect.Effect<
  PutBucketIntelligentTieringConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketIntelligentTieringConfigurationRequest,
  output: PutBucketIntelligentTieringConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Sets a metrics configuration (specified by the metrics configuration ID) for the bucket. You can
 * have up to 1,000 metrics configurations per bucket. If you're updating an existing metrics
 * configuration, note that this is a full replacement of the existing metrics configuration. If you don't
 * include the elements you want to keep, they are erased.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:PutMetricsConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * For information about CloudWatch request metrics for Amazon S3, see Monitoring Metrics with Amazon
 * CloudWatch.
 *
 * The following operations are related to `PutBucketMetricsConfiguration`:
 *
 * - DeleteBucketMetricsConfiguration
 *
 * - GetBucketMetricsConfiguration
 *
 * - ListBucketMetricsConfigurations
 *
 * `PutBucketMetricsConfiguration` has the following special error:
 *
 * - Error code: `TooManyConfigurations`
 *
 * - Description: You are attempting to create a new configuration but have already reached the
 * 1,000-configuration limit.
 *
 * - HTTP Status Code: HTTP 400 Bad Request
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketMetricsConfiguration: (
  input: PutBucketMetricsConfigurationRequest,
) => effect.Effect<
  PutBucketMetricsConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketMetricsConfigurationRequest,
  output: PutBucketMetricsConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Sets the configuration of the website that is specified in the `website` subresource. To
 * configure a bucket as a website, you can add this subresource on the bucket with website configuration
 * information such as the file name of the index document and any redirect rules. For more information,
 * see Hosting Websites on
 * Amazon S3.
 *
 * This PUT action requires the `S3:PutBucketWebsite` permission. By default, only the
 * bucket owner can configure the website attached to a bucket; however, bucket owners can allow other
 * users to set the website configuration by writing a bucket policy that grants them the
 * `S3:PutBucketWebsite` permission.
 *
 * To redirect all website requests sent to the bucket's website endpoint, you add a website
 * configuration with the following elements. Because all requests are sent to another website, you don't
 * need to provide index document name for the bucket.
 *
 * - `WebsiteConfiguration`
 *
 * - `RedirectAllRequestsTo`
 *
 * - `HostName`
 *
 * - `Protocol`
 *
 * If you want granular control over redirects, you can use the following elements to add routing rules
 * that describe conditions for redirecting requests and information about the redirect destination. In
 * this case, the website configuration must provide an index document for the bucket, because some
 * requests might not be redirected.
 *
 * - `WebsiteConfiguration`
 *
 * - `IndexDocument`
 *
 * - `Suffix`
 *
 * - `ErrorDocument`
 *
 * - `Key`
 *
 * - `RoutingRules`
 *
 * - `RoutingRule`
 *
 * - `Condition`
 *
 * - `HttpErrorCodeReturnedEquals`
 *
 * - `KeyPrefixEquals`
 *
 * - `Redirect`
 *
 * - `Protocol`
 *
 * - `HostName`
 *
 * - `ReplaceKeyPrefixWith`
 *
 * - `ReplaceKeyWith`
 *
 * - `HttpRedirectCode`
 *
 * Amazon S3 has a limitation of 50 routing rules per website configuration. If you require more than 50
 * routing rules, you can use object redirect. For more information, see Configuring an Object Redirect in the
 * *Amazon S3 User Guide*.
 *
 * The maximum request length is limited to 128 KB.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketWebsite: (
  input: PutBucketWebsiteRequest,
) => effect.Effect<
  PutBucketWebsiteResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketWebsiteRequest,
  output: PutBucketWebsiteResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation enables you to delete multiple objects from a bucket using a single HTTP request. If
 * you know the object keys that you want to delete, then this operation provides a suitable alternative to
 * sending individual delete requests, reducing per-request overhead.
 *
 * The request can contain a list of up to 1,000 keys that you want to delete. In the XML, you provide
 * the object key names, and optionally, version IDs if you want to delete a specific version of the object
 * from a versioning-enabled bucket. For each key, Amazon S3 performs a delete operation and returns the result
 * of that delete, success or failure, in the response. If the object specified in the request isn't found,
 * Amazon S3 confirms the deletion by returning the result as deleted.
 *
 * - **Directory buckets** -
 * S3 Versioning isn't enabled and supported for directory buckets.
 *
 * - **Directory buckets** - For directory buckets, you must make requests for this API operation to the Zonal endpoint. These endpoints support virtual-hosted-style requests in the format https://*amzn-s3-demo-bucket*.s3express-*zone-id*.*region-code*.amazonaws.com/*key-name*
 * . Path-style requests are not supported. For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * The operation supports two modes for the response: verbose and quiet. By default, the operation uses
 * verbose mode in which the response includes the result of deletion of each key in your request. In quiet
 * mode the response includes only keys where the delete operation encountered an error. For a successful
 * deletion in a quiet mode, the operation does not return any information about the delete in the response
 * body.
 *
 * When performing this action on an MFA Delete enabled bucket, that attempts to delete any versioned
 * objects, you must include an MFA token. If you do not provide one, the entire request will fail, even if
 * there are non-versioned objects you are trying to delete. If you provide an invalid token, whether there
 * are versioned keys in the request or not, the entire Multi-Object Delete request will fail. For
 * information about MFA Delete, see MFA Delete in the
 * *Amazon S3 User Guide*.
 *
 * **Directory buckets** - MFA delete is not supported by directory buckets.
 *
 * ### Permissions
 *
 * - **General purpose bucket permissions** - The following
 * permissions are required in your policies when your `DeleteObjects` request
 * includes specific headers.
 *
 * -
 * `s3:DeleteObject`
 * - To delete an
 * object from a bucket, you must always specify the `s3:DeleteObject`
 * permission.
 *
 * -
 * `s3:DeleteObjectVersion`
 * - To delete a specific version of an object from a versioning-enabled
 * bucket, you must specify the `s3:DeleteObjectVersion` permission.
 *
 * If the `s3:DeleteObject` or `s3:DeleteObjectVersion` permissions are explicitly
 * denied in your bucket policy, attempts to delete any unversioned objects
 * result in a `403 Access Denied` error.
 *
 * - **Directory bucket permissions** - To grant access to this API operation on a directory bucket, we recommend that you use the
 * `CreateSession`
 * API operation for session-based authorization. Specifically, you grant the `s3express:CreateSession` permission to the directory bucket in a bucket policy or an IAM identity-based policy. Then, you make the `CreateSession` API call on the bucket to obtain a session token. With the session token in your request header, you can make API requests to this operation. After the session token expires, you make another `CreateSession` API call to generate a new session token for use.
 * Amazon Web Services CLI or SDKs create session and refresh the session token automatically to avoid service interruptions when a session expires. For more information about authorization, see
 * `CreateSession`
 * .
 *
 * ### Content-MD5 request header
 *
 * - **General purpose bucket** - The Content-MD5 request header
 * is required for all Multi-Object Delete requests. Amazon S3 uses the header value to ensure that
 * your request body has not been altered in transit.
 *
 * - **Directory bucket** - The Content-MD5 request header
 * or a additional checksum request header (including `x-amz-checksum-crc32`,
 * `x-amz-checksum-crc32c`, `x-amz-checksum-sha1`, or
 * `x-amz-checksum-sha256`) is required for all Multi-Object Delete requests.
 *
 * ### HTTP Host header syntax
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * *Bucket-name*.s3express-*zone-id*.*region-code*.amazonaws.com.
 *
 * The following operations are related to `DeleteObjects`:
 *
 * - CreateMultipartUpload
 *
 * - UploadPart
 *
 * - CompleteMultipartUpload
 *
 * - ListParts
 *
 * - AbortMultipartUpload
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const deleteObjects: (
  input: DeleteObjectsRequest,
) => effect.Effect<
  DeleteObjectsOutput,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteObjectsRequest,
  output: DeleteObjectsOutput,
  errors: [NoSuchBucket],
}));
/**
 * Retrieves the S3 Metadata configuration for a general purpose bucket. For more information, see
 * Accelerating
 * data discovery with S3 Metadata in the *Amazon S3 User Guide*.
 *
 * You can use the V2 `GetBucketMetadataConfiguration` API operation with V1 or V2
 * metadata configurations. However, if you try to use the V1
 * `GetBucketMetadataTableConfiguration` API operation with V2 configurations, you
 * will receive an HTTP `405 Method Not Allowed` error.
 *
 * ### Permissions
 *
 * To use this operation, you must have the `s3:GetBucketMetadataTableConfiguration`
 * permission. For more information, see Setting up permissions for
 * configuring metadata tables in the *Amazon S3 User Guide*.
 *
 * The IAM policy action name is the same for the V1 and V2 API operations.
 *
 * The following operations are related to `GetBucketMetadataConfiguration`:
 *
 * - CreateBucketMetadataConfiguration
 *
 * - DeleteBucketMetadataConfiguration
 *
 * - UpdateBucketMetadataInventoryTableConfiguration
 *
 * - UpdateBucketMetadataJournalTableConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketMetadataConfiguration: (
  input: GetBucketMetadataConfigurationRequest,
) => effect.Effect<
  GetBucketMetadataConfigurationOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketMetadataConfigurationRequest,
  output: GetBucketMetadataConfigurationOutput,
  errors: [],
}));
/**
 * We recommend that you retrieve your S3 Metadata configurations by using the V2
 * GetBucketMetadataTableConfiguration API operation. We no longer recommend using the V1
 * `GetBucketMetadataTableConfiguration` API operation.
 *
 * If you created your S3 Metadata configuration before July 15, 2025, we recommend that you delete
 * and re-create your configuration by using CreateBucketMetadataConfiguration so that you can expire journal table records and create
 * a live inventory table.
 *
 * Retrieves the V1 S3 Metadata configuration for a general purpose bucket. For more information, see
 * Accelerating
 * data discovery with S3 Metadata in the *Amazon S3 User Guide*.
 *
 * You can use the V2 `GetBucketMetadataConfiguration` API operation with V1 or V2
 * metadata table configurations. However, if you try to use the V1
 * `GetBucketMetadataTableConfiguration` API operation with V2 configurations, you
 * will receive an HTTP `405 Method Not Allowed` error.
 *
 * Make sure that you update your processes to use the new V2 API operations
 * (`CreateBucketMetadataConfiguration`, `GetBucketMetadataConfiguration`, and
 * `DeleteBucketMetadataConfiguration`) instead of the V1 API operations.
 *
 * ### Permissions
 *
 * To use this operation, you must have the `s3:GetBucketMetadataTableConfiguration`
 * permission. For more information, see Setting up permissions for
 * configuring metadata tables in the *Amazon S3 User Guide*.
 *
 * The following operations are related to `GetBucketMetadataTableConfiguration`:
 *
 * - CreateBucketMetadataTableConfiguration
 *
 * - DeleteBucketMetadataTableConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const getBucketMetadataTableConfiguration: (
  input: GetBucketMetadataTableConfigurationRequest,
) => effect.Effect<
  GetBucketMetadataTableConfigurationOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketMetadataTableConfigurationRequest,
  output: GetBucketMetadataTableConfigurationOutput,
  errors: [],
}));
/**
 * End of support notice: As of October 1, 2025, Amazon S3 has discontinued support for Email Grantee Access Control Lists (ACLs). If you attempt to use an Email Grantee ACL in a request after October 1, 2025,
 * the request will receive an `HTTP 405` (Method Not Allowed) error.
 *
 * This change affects the following Amazon Web Services Regions: US East (N. Virginia), US West (N. California), US West (Oregon), Asia Pacific (Singapore), Asia Pacific (Sydney), Asia Pacific (Tokyo), Europe (Ireland), and South America (São Paulo).
 *
 * This operation is not supported for directory buckets.
 *
 * Set the logging parameters for a bucket and to specify permissions for who can view and modify the
 * logging parameters. All logs are saved to buckets in the same Amazon Web Services Region as the source bucket. To set
 * the logging status of a bucket, you must be the bucket owner.
 *
 * The bucket owner is automatically granted FULL_CONTROL to all logs. You use the `Grantee`
 * request element to grant access to other people. The `Permissions` request element specifies
 * the kind of access the grantee has to the logs.
 *
 * If the target bucket for log delivery uses the bucket owner enforced setting for S3 Object
 * Ownership, you can't use the `Grantee` request element to grant access to others.
 * Permissions can only be granted using policies. For more information, see Permissions for server access log delivery in the
 * *Amazon S3 User Guide*.
 *
 * ### Grantee Values
 *
 * You can specify the person (grantee) to whom you're assigning access rights (by using request
 * elements) in the following ways. For examples of how to specify these grantee values in JSON
 * format, see the Amazon Web Services CLI example in Enabling Amazon S3 server
 * access logging in the *Amazon S3 User Guide*.
 *
 * - By the person's ID:
 *
 * <>ID<><>GranteesEmail<>
 *
 * `DisplayName` is optional and ignored in the request.
 *
 * - By Email address:
 *
 * <>Grantees@email.com<>
 *
 * The grantee is resolved to the `CanonicalUser` and, in a response to a
 * `GETObjectAcl` request, appears as the CanonicalUser.
 *
 * - By URI:
 *
 * <>http://acs.amazonaws.com/groups/global/AuthenticatedUsers<>
 *
 * To enable logging, you use `LoggingEnabled` and its children request elements. To disable
 * logging, you use an empty `BucketLoggingStatus` request element:
 *
 * ``
 *
 * For more information about server access logging, see Server Access Logging in the
 * *Amazon S3 User Guide*.
 *
 * For more information about creating a bucket, see CreateBucket. For more information about
 * returning the logging status of a bucket, see GetBucketLogging.
 *
 * The following operations are related to `PutBucketLogging`:
 *
 * - PutObject
 *
 * - DeleteBucket
 *
 * - CreateBucket
 *
 * - GetBucketLogging
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketLogging: (
  input: PutBucketLoggingRequest,
) => effect.Effect<
  PutBucketLoggingResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketLoggingRequest,
  output: PutBucketLoggingResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock
 * configuration will be applied by default to every new object placed in the specified bucket. For more
 * information, see Locking
 * Objects.
 *
 * - The `DefaultRetention` settings require both a mode and a period.
 *
 * - The `DefaultRetention` period can be either `Days` or `Years`
 * but you must select one. You cannot specify `Days` and `Years` at the same
 * time.
 *
 * - You can enable Object Lock for new or existing buckets. For more information, see Configuring
 * Object Lock.
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putObjectLockConfiguration: (
  input: PutObjectLockConfigurationRequest,
) => effect.Effect<
  PutObjectLockConfigurationOutput,
  InvalidBucketState | NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutObjectLockConfigurationRequest,
  output: PutObjectLockConfigurationOutput,
  errors: [InvalidBucketState, NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Sets an analytics configuration for the bucket (specified by the analytics configuration ID). You
 * can have up to 1,000 analytics configurations per bucket.
 *
 * You can choose to have storage class analysis export analysis reports sent to a comma-separated
 * values (CSV) flat file. See the `DataExport` request element. Reports are updated daily and
 * are based on the object filters that you configure. When selecting data export, you specify a
 * destination bucket and an optional destination prefix where the file is written. You can export the data
 * to a destination bucket in a different account. However, the destination bucket must be in the same
 * Region as the bucket that you are making the PUT analytics configuration to. For more information, see
 * Amazon S3 Analytics –
 * Storage Class Analysis.
 *
 * You must create a bucket policy on the destination bucket where the exported file is written to
 * grant permissions to Amazon S3 to write objects to the bucket. For an example policy, see Granting
 * Permissions for Amazon S3 Inventory and Storage Class Analysis.
 *
 * To use this operation, you must have permissions to perform the
 * `s3:PutAnalyticsConfiguration` action. The bucket owner has this permission by default. The
 * bucket owner can grant this permission to others. For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources.
 *
 * `PutBucketAnalyticsConfiguration` has the following special errors:
 *
 * -
 *
 * - *HTTP Error: HTTP 400 Bad Request*
 *
 * - *Code: InvalidArgument*
 *
 * - *Cause: Invalid argument.*
 *
 * -
 *
 * - *HTTP Error: HTTP 400 Bad Request*
 *
 * - *Code: TooManyConfigurations*
 *
 * - Cause: You are attempting to create a new configuration but have already reached
 * the 1,000-configuration limit.
 *
 * -
 *
 * - *HTTP Error: HTTP 403 Forbidden*
 *
 * - *Code: AccessDenied*
 *
 * - Cause: You are not the owner of the specified bucket, or you do not have the
 * s3:PutAnalyticsConfiguration bucket permission to set the configuration on the
 * bucket.
 *
 * The following operations are related to `PutBucketAnalyticsConfiguration`:
 *
 * - GetBucketAnalyticsConfiguration
 *
 * - DeleteBucketAnalyticsConfiguration
 *
 * - ListBucketAnalyticsConfigurations
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketAnalyticsConfiguration: (
  input: PutBucketAnalyticsConfigurationRequest,
) => effect.Effect<
  PutBucketAnalyticsConfigurationResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketAnalyticsConfigurationRequest,
  output: PutBucketAnalyticsConfigurationResponse,
  errors: [],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * This implementation of the `PUT` action adds an S3 Inventory configuration (identified by
 * the inventory ID) to the bucket. You can have up to 1,000 inventory configurations per bucket.
 *
 * Amazon S3 inventory generates inventories of the objects in the bucket on a daily or weekly basis, and
 * the results are published to a flat file. The bucket that is inventoried is called the
 * *source* bucket, and the bucket where the inventory flat file is stored is called
 * the *destination* bucket. The *destination* bucket must be in the
 * same Amazon Web Services Region as the *source* bucket.
 *
 * When you configure an inventory for a *source* bucket, you specify the
 * *destination* bucket where you want the inventory to be stored, and whether to
 * generate the inventory daily or weekly. You can also configure what object metadata to include and
 * whether to inventory all object versions or only current versions. For more information, see Amazon S3 Inventory in the
 * Amazon S3 User Guide.
 *
 * You must create a bucket policy on the *destination* bucket to grant
 * permissions to Amazon S3 to write objects to the bucket in the defined location. For an example policy, see
 * Granting
 * Permissions for Amazon S3 Inventory and Storage Class Analysis.
 *
 * ### Permissions
 *
 * To use this operation, you must have permission to perform the
 * `s3:PutInventoryConfiguration` action. The bucket owner has this permission by
 * default and can grant this permission to others.
 *
 * The `s3:PutInventoryConfiguration` permission allows a user to create an S3 Inventory
 * report that includes all object metadata fields available and to specify the destination bucket to
 * store the inventory. A user with read access to objects in the destination bucket can also access
 * all object metadata fields that are available in the inventory report.
 *
 * To restrict access to an inventory report, see Restricting access to an Amazon S3 Inventory report in the
 * *Amazon S3 User Guide*. For more information about the metadata fields available
 * in S3 Inventory, see Amazon S3 Inventory
 * lists in the *Amazon S3 User Guide*. For more information about
 * permissions, see Permissions related to bucket subresource operations and Identity and access management in
 * Amazon S3 in the *Amazon S3 User Guide*.
 *
 * `PutBucketInventoryConfiguration` has the following special errors:
 *
 * ### HTTP 400 Bad Request Error
 *
 * *Code:* InvalidArgument
 *
 * *Cause:* Invalid Argument
 *
 * ### HTTP 400 Bad Request Error
 *
 * *Code:* TooManyConfigurations
 *
 * *Cause:* You are attempting to create a new configuration but have already
 * reached the 1,000-configuration limit.
 *
 * ### HTTP 403 Forbidden Error
 *
 * *Cause:* You are not the owner of the specified bucket, or you do not have
 * the `s3:PutInventoryConfiguration` bucket permission to set the configuration on the
 * bucket.
 *
 * The following operations are related to `PutBucketInventoryConfiguration`:
 *
 * - GetBucketInventoryConfiguration
 *
 * - DeleteBucketInventoryConfiguration
 *
 * - ListBucketInventoryConfigurations
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketInventoryConfiguration: (
  input: PutBucketInventoryConfigurationRequest,
) => effect.Effect<
  PutBucketInventoryConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketInventoryConfigurationRequest,
  output: PutBucketInventoryConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * Creates a new lifecycle configuration for the bucket or replaces an existing lifecycle
 * configuration. Keep in mind that this will overwrite an existing lifecycle configuration, so if you want
 * to retain any configuration details, they must be included in the new lifecycle configuration. For
 * information about lifecycle configuration, see Managing your storage
 * lifecycle.
 *
 * Bucket lifecycle configuration now supports specifying a lifecycle rule using an object key name
 * prefix, one or more object tags, object size, or any combination of these. Accordingly, this section
 * describes the latest API. The previous version of the API supported filtering based only on an object
 * key name prefix, which is supported for backward compatibility. For the related API description, see
 * PutBucketLifecycle.
 *
 * ### Rules
 *
 * ### Permissions
 *
 * ### HTTP Host header syntax
 *
 * You specify the lifecycle configuration in your request body. The lifecycle configuration is
 * specified as XML consisting of one or more rules. An Amazon S3 Lifecycle configuration can have up to
 * 1,000 rules. This limit is not adjustable.
 *
 * Bucket lifecycle configuration supports specifying a lifecycle rule using an object key name
 * prefix, one or more object tags, object size, or any combination of these. Accordingly, this
 * section describes the latest API. The previous version of the API supported filtering based only
 * on an object key name prefix, which is supported for backward compatibility for general purpose
 * buckets. For the related API description, see PutBucketLifecycle.
 *
 * Lifecyle configurations for directory buckets only support expiring objects and cancelling
 * multipart uploads. Expiring of versioned objects,transitions and tag filters are not
 * supported.
 *
 * A lifecycle rule consists of the following:
 *
 * - A filter identifying a subset of objects to which the rule applies. The filter can be
 * based on a key name prefix, object tags, object size, or any combination of these.
 *
 * - A status indicating whether the rule is in effect.
 *
 * - One or more lifecycle transition and expiration actions that you want Amazon S3 to perform on
 * the objects identified by the filter. If the state of your bucket is versioning-enabled or
 * versioning-suspended, you can have many versions of the same object (one current version and
 * zero or more noncurrent versions). Amazon S3 provides predefined actions that you can specify for
 * current and noncurrent object versions.
 *
 * For more information, see Object Lifecycle Management and
 * Lifecycle
 * Configuration Elements.
 *
 * - **General purpose bucket permissions** - By default, all Amazon S3
 * resources are private, including buckets, objects, and related subresources (for example,
 * lifecycle configuration and website configuration). Only the resource owner (that is, the
 * Amazon Web Services account that created it) can access the resource. The resource owner can optionally
 * grant access permissions to others by writing an access policy. For this operation, a user
 * must have the `s3:PutLifecycleConfiguration` permission.
 *
 * You can also explicitly deny permissions. An explicit deny also supersedes any other
 * permissions. If you want to block users or accounts from removing or deleting objects from
 * your bucket, you must deny them permissions for the following actions:
 *
 * - `s3:DeleteObject`
 *
 * - `s3:DeleteObjectVersion`
 *
 * - `s3:PutLifecycleConfiguration`
 *
 * For more information about permissions, see Managing Access Permissions to
 * Your Amazon S3 Resources.
 *
 * - **Directory bucket permissions** - You must have the
 * `s3express:PutLifecycleConfiguration` permission in an IAM identity-based policy
 * to use this operation. Cross-account access to this API operation isn't supported. The
 * resource owner can optionally grant access permissions to others by creating a role or user
 * for them as long as they are within the same account as the owner and resource.
 *
 * For more information about directory bucket policies and permissions, see Authorizing Regional endpoint APIs with IAM in the Amazon S3 User
 * Guide.
 *
 * **Directory buckets ** - For directory buckets, you must make requests for this API operation to the Regional endpoint. These endpoints support path-style requests in the format https://s3express-control.*region-code*.amazonaws.com/*bucket-name*
 * . Virtual-hosted-style requests aren't supported.
 * For more information about endpoints in Availability Zones, see Regional and Zonal endpoints for directory buckets in Availability Zones in the
 * *Amazon S3 User Guide*. For more information about endpoints in Local Zones, see Concepts for directory buckets in Local Zones in the
 * *Amazon S3 User Guide*.
 *
 * **Directory buckets ** - The HTTP Host header syntax is
 * `s3express-control.*region*.amazonaws.com`.
 *
 * The following operations are related to `PutBucketLifecycleConfiguration`:
 *
 * - GetBucketLifecycleConfiguration
 *
 * - DeleteBucketLifecycle
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketLifecycleConfiguration: (
  input: PutBucketLifecycleConfigurationRequest,
) => effect.Effect<
  PutBucketLifecycleConfigurationOutput,
  InvalidRequest | MalformedXML | NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketLifecycleConfigurationRequest,
  output: PutBucketLifecycleConfigurationOutput,
  errors: [InvalidRequest, MalformedXML, NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Enables notifications of specified events for a bucket. For more information about event
 * notifications, see Configuring Event Notifications.
 *
 * Using this API, you can replace an existing notification configuration. The configuration is an XML
 * file that defines the event types that you want Amazon S3 to publish and the destination where you want Amazon S3
 * to publish an event notification when it detects an event of the specified type.
 *
 * By default, your bucket has no event notifications configured. That is, the notification
 * configuration will be an empty `NotificationConfiguration`.
 *
 * ``
 *
 * ``
 *
 * This action replaces the existing notification configuration with the configuration you include in
 * the request body.
 *
 * After Amazon S3 receives this request, it first verifies that any Amazon Simple Notification Service
 * (Amazon SNS) or Amazon Simple Queue Service (Amazon SQS) destination exists, and that the bucket owner
 * has permission to publish to it by sending a test notification. In the case of Lambda destinations,
 * Amazon S3 verifies that the Lambda function permissions grant Amazon S3 permission to invoke the function from the
 * Amazon S3 bucket. For more information, see Configuring Notifications for Amazon S3
 * Events.
 *
 * You can disable notifications by adding the empty NotificationConfiguration element.
 *
 * For more information about the number of event notification configurations that you can create per
 * bucket, see Amazon S3 service
 * quotas in *Amazon Web Services General Reference*.
 *
 * By default, only the bucket owner can configure notifications on a bucket. However, bucket owners
 * can use a bucket policy to grant permission to other users to set this configuration with the required
 * `s3:PutBucketNotification` permission.
 *
 * The PUT notification is an atomic operation. For example, suppose your notification configuration
 * includes SNS topic, SQS queue, and Lambda function configurations. When you send a PUT request with
 * this configuration, Amazon S3 sends test messages to your SNS topic. If the message fails, the entire PUT
 * action will fail, and Amazon S3 will not add the configuration to your bucket.
 *
 * If the configuration in the request body includes only one `TopicConfiguration`
 * specifying only the `s3:ReducedRedundancyLostObject` event type, the response will also
 * include the `x-amz-sns-test-message-id` header containing the message ID of the test
 * notification sent to the topic.
 *
 * The following action is related to `PutBucketNotificationConfiguration`:
 *
 * - GetBucketNotificationConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketNotificationConfiguration: (
  input: PutBucketNotificationConfigurationRequest,
) => effect.Effect<
  PutBucketNotificationConfigurationResponse,
  NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketNotificationConfigurationRequest,
  output: PutBucketNotificationConfigurationResponse,
  errors: [NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Creates a replication configuration or replaces an existing one. For more information, see Replication in the
 * *Amazon S3 User Guide*.
 *
 * Specify the replication configuration in the request body. In the replication configuration, you
 * provide the name of the destination bucket or buckets where you want Amazon S3 to replicate objects, the
 * IAM role that Amazon S3 can assume to replicate objects on your behalf, and other relevant information. You
 * can invoke this request for a specific Amazon Web Services Region by using the
 * `aws:RequestedRegion`
 * condition key.
 *
 * A replication configuration must include at least one rule, and can contain a maximum of 1,000. Each
 * rule identifies a subset of objects to replicate by filtering the objects in the source bucket. To
 * choose additional subsets of objects to replicate, add a rule for each subset.
 *
 * To specify a subset of the objects in the source bucket to apply a replication rule to, add the
 * Filter element as a child of the Rule element. You can filter objects based on an object key prefix, one
 * or more object tags, or both. When you add the Filter element in the configuration, you must also add
 * the following elements: `DeleteMarkerReplication`, `Status`, and
 * `Priority`.
 *
 * If you are using an earlier version of the replication configuration, Amazon S3 handles replication of
 * delete markers differently. For more information, see Backward Compatibility.
 *
 * For information about enabling versioning on a bucket, see Using Versioning.
 *
 * ### Handling Replication of Encrypted Objects
 *
 * By default, Amazon S3 doesn't replicate objects that are stored at rest using server-side
 * encryption with KMS keys. To replicate Amazon Web Services KMS-encrypted objects, add the following:
 * `SourceSelectionCriteria`, `SseKmsEncryptedObjects`, `Status`,
 * `EncryptionConfiguration`, and `ReplicaKmsKeyID`. For information about
 * replication configuration, see Replicating Objects Created
 * with SSE Using KMS keys.
 *
 * For information on `PutBucketReplication` errors, see List of
 * replication-related error codes
 *
 * ### Permissions
 *
 * To create a `PutBucketReplication` request, you must have
 * `s3:PutReplicationConfiguration` permissions for the bucket.
 *
 * By default, a resource owner, in this case the Amazon Web Services account that created the bucket, can
 * perform this operation. The resource owner can also grant others permissions to perform the
 * operation. For more information about permissions, see Specifying Permissions in a Policy
 * and Managing
 * Access Permissions to Your Amazon S3 Resources.
 *
 * To perform this operation, the user or role performing the action must have the iam:PassRole permission.
 *
 * The following operations are related to `PutBucketReplication`:
 *
 * - GetBucketReplication
 *
 * - DeleteBucketReplication
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const putBucketReplication: (
  input: PutBucketReplicationRequest,
) => effect.Effect<
  PutBucketReplicationResponse,
  InvalidRequest | NoSuchBucket | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBucketReplicationRequest,
  output: PutBucketReplicationResponse,
  errors: [InvalidRequest, NoSuchBucket],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * Restores an archived copy of an object back into Amazon S3
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * This action performs the following types of requests:
 *
 * - `restore an archive` - Restore an archived object
 *
 * For more information about the `S3` structure in the request body, see the
 * following:
 *
 * - PutObject
 *
 * - Managing Access
 * with ACLs in the *Amazon S3 User Guide*
 *
 * - Protecting Data
 * Using Server-Side Encryption in the *Amazon S3 User Guide*
 *
 * ### Permissions
 *
 * To use this operation, you must have permissions to perform the `s3:RestoreObject`
 * action. The bucket owner has this permission by default and can grant this permission to others.
 * For more information about permissions, see Permissions Related to Bucket Subresource Operations and Managing Access Permissions to Your Amazon S3
 * Resources in the *Amazon S3 User Guide*.
 *
 * ### Restoring objects
 *
 * Objects that you archive to the S3 Glacier Flexible Retrieval or S3 Glacier Deep Archive
 * storage class, and S3 Intelligent-Tiering Archive or S3 Intelligent-Tiering Deep Archive tiers, are not accessible in
 * real time. For objects in the S3 Glacier Flexible Retrieval or S3 Glacier Deep Archive
 * storage classes, you must first initiate a restore request, and then wait until a temporary copy
 * of the object is available. If you want a permanent copy of the object, create a copy of it in the
 * Amazon S3 Standard storage class in your S3 bucket. To access an archived object, you must restore the
 * object for the duration (number of days) that you specify. For objects in the Archive Access or
 * Deep Archive Access tiers of S3 Intelligent-Tiering, you must first initiate a restore request, and
 * then wait until the object is moved into the Frequent Access tier.
 *
 * To restore a specific object version, you can provide a version ID. If you don't provide a
 * version ID, Amazon S3 restores the current version.
 *
 * When restoring an archived object, you can specify one of the following data access tier
 * options in the `Tier` element of the request body:
 *
 * - `Expedited` - Expedited retrievals allow you to quickly access your data stored
 * in the S3 Glacier Flexible Retrieval storage class or S3 Intelligent-Tiering Archive tier when occasional
 * urgent requests for restoring archives are required. For all but the largest archived objects
 * (250 MB+), data accessed using Expedited retrievals is typically made available within 1–5
 * minutes. Provisioned capacity ensures that retrieval capacity for Expedited retrievals is
 * available when you need it. Expedited retrievals and provisioned capacity are not available
 * for objects stored in the S3 Glacier Deep Archive storage class or
 * S3 Intelligent-Tiering Deep Archive tier.
 *
 * - `Standard` - Standard retrievals allow you to access any of your archived
 * objects within several hours. This is the default option for retrieval requests that do not
 * specify the retrieval option. Standard retrievals typically finish within 3–5 hours for
 * objects stored in the S3 Glacier Flexible Retrieval storage class or S3 Intelligent-Tiering Archive tier.
 * They typically finish within 12 hours for objects stored in the
 * S3 Glacier Deep Archive storage class or S3 Intelligent-Tiering Deep Archive tier. Standard
 * retrievals are free for objects stored in S3 Intelligent-Tiering.
 *
 * - `Bulk` - Bulk retrievals free for objects stored in the S3 Glacier Flexible
 * Retrieval and S3 Intelligent-Tiering storage classes, enabling you to retrieve large amounts,
 * even petabytes, of data at no cost. Bulk retrievals typically finish within 5–12 hours for
 * objects stored in the S3 Glacier Flexible Retrieval storage class or S3 Intelligent-Tiering Archive tier.
 * Bulk retrievals are also the lowest-cost retrieval option when restoring objects from
 * S3 Glacier Deep Archive. They typically finish within 48 hours for objects stored in
 * the S3 Glacier Deep Archive storage class or S3 Intelligent-Tiering Deep Archive tier.
 *
 * For more information about archive retrieval options and provisioned capacity for
 * `Expedited` data access, see Restoring Archived Objects in the
 * *Amazon S3 User Guide*.
 *
 * You can use Amazon S3 restore speed upgrade to change the restore speed to a faster speed while it
 * is in progress. For more information, see
 * Upgrading the speed of an in-progress restore in the
 * *Amazon S3 User Guide*.
 *
 * To get the status of object restoration, you can send a `HEAD` request. Operations
 * return the `x-amz-restore` header, which provides information about the restoration
 * status, in the response. You can use Amazon S3 event notifications to notify you when a restore is
 * initiated or completed. For more information, see Configuring Amazon S3 Event Notifications in
 * the *Amazon S3 User Guide*.
 *
 * After restoring an archived object, you can update the restoration period by reissuing the
 * request with a new period. Amazon S3 updates the restoration period relative to the current time and
 * charges only for the request-there are no data transfer charges. You cannot update the
 * restoration period when Amazon S3 is actively processing your current restore request for the
 * object.
 *
 * If your bucket has a lifecycle configuration with a rule that includes an expiration action,
 * the object expiration overrides the life span that you specify in a restore request. For example,
 * if you restore an object copy for 10 days, but the object is scheduled to expire in 3 days, Amazon S3
 * deletes the object in 3 days. For more information about lifecycle configuration, see PutBucketLifecycleConfiguration and Object Lifecycle Management in
 * *Amazon S3 User Guide*.
 *
 * ### Responses
 *
 * A successful action returns either the `200 OK` or `202 Accepted` status
 * code.
 *
 * - If the object is not previously restored, then Amazon S3 returns `202 Accepted` in
 * the response.
 *
 * - If the object is previously restored, Amazon S3 returns `200 OK` in the response.
 *
 * - Special errors:
 *
 * - *Code: RestoreAlreadyInProgress*
 *
 * - *Cause: Object restore is already in progress.*
 *
 * - *HTTP Status Code: 409 Conflict*
 *
 * - *SOAP Fault Code Prefix: Client*
 *
 * -
 *
 * - *Code: GlacierExpeditedRetrievalNotAvailable*
 *
 * - Cause: expedited retrievals are currently not available. Try again later.
 * (Returned if there is insufficient capacity to process the Expedited request. This error
 * applies only to Expedited retrievals and not to S3 Standard or Bulk
 * retrievals.)
 *
 * - *HTTP Status Code: 503*
 *
 * - *SOAP Fault Code Prefix: N/A*
 *
 * The following operations are related to `RestoreObject`:
 *
 * - PutBucketLifecycleConfiguration
 *
 * - GetBucketNotificationConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const restoreObject: (
  input: RestoreObjectRequest,
) => effect.Effect<
  RestoreObjectOutput,
  ObjectAlreadyInActiveTierError | NoSuchKey | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreObjectRequest,
  output: RestoreObjectOutput,
  errors: [ObjectAlreadyInActiveTierError, NoSuchKey],
}));
/**
 * This operation is not supported for directory buckets.
 *
 * This action filters the contents of an Amazon S3 object based on a simple structured query language (SQL)
 * statement. In the request, along with the SQL expression, you must also specify a data serialization
 * format (JSON, CSV, or Apache Parquet) of the object. Amazon S3 uses this format to parse object data into
 * records, and returns only records that match the specified SQL expression. You must also specify the
 * data serialization format for the response.
 *
 * This functionality is not supported for Amazon S3 on Outposts.
 *
 * For more information about Amazon S3 Select, see Selecting Content from Objects
 * and SELECT Command in
 * the *Amazon S3 User Guide*.
 *
 * ### Permissions
 *
 * You must have the `s3:GetObject` permission for this operation. Amazon S3 Select does
 * not support anonymous access. For more information about permissions, see Specifying Permissions
 * in a Policy in the *Amazon S3 User Guide*.
 *
 * ### Object Data Formats
 *
 * You can use Amazon S3 Select to query objects that have the following format properties:
 *
 * - *CSV, JSON, and Parquet* - Objects must be in CSV, JSON, or Parquet
 * format.
 *
 * - *UTF-8* - UTF-8 is the only encoding type Amazon S3 Select supports.
 *
 * - *GZIP or BZIP2* - CSV and JSON files can be compressed using GZIP or
 * BZIP2. GZIP and BZIP2 are the only compression formats that Amazon S3 Select supports for CSV and
 * JSON files. Amazon S3 Select supports columnar compression for Parquet using GZIP or Snappy. Amazon S3
 * Select does not support whole-object compression for Parquet objects.
 *
 * - *Server-side encryption* - Amazon S3 Select supports querying objects that
 * are protected with server-side encryption.
 *
 * For objects that are encrypted with customer-provided encryption keys (SSE-C), you must
 * use HTTPS, and you must use the headers that are documented in the GetObject. For more information about
 * SSE-C, see Server-Side Encryption
 * (Using Customer-Provided Encryption Keys) in the
 * *Amazon S3 User Guide*.
 *
 * For objects that are encrypted with Amazon S3 managed keys (SSE-S3) and Amazon Web Services KMS keys
 * (SSE-KMS), server-side encryption is handled transparently, so you don't need to specify
 * anything. For more information about server-side encryption, including SSE-S3 and SSE-KMS, see
 * Protecting
 * Data Using Server-Side Encryption in the
 * *Amazon S3 User Guide*.
 *
 * ### Working with the Response Body
 *
 * Given the response size is unknown, Amazon S3 Select streams the response as a series of messages
 * and includes a `Transfer-Encoding` header with `chunked` as its value in the
 * response. For more information, see Appendix: SelectObjectContent
 * Response.
 *
 * ### GetObject Support
 *
 * The `SelectObjectContent` action does not support the following
 * `GetObject` functionality. For more information, see GetObject.
 *
 * - `Range`: Although you can specify a scan range for an Amazon S3 Select request (see
 * SelectObjectContentRequest - ScanRange in the request parameters), you
 * cannot specify the range of bytes of an object to return.
 *
 * - The `GLACIER`, `DEEP_ARCHIVE`, and `REDUCED_REDUNDANCY`
 * storage classes, or the `ARCHIVE_ACCESS` and `DEEP_ARCHIVE_ACCESS`
 * access tiers of the `INTELLIGENT_TIERING` storage class: You cannot query objects
 * in the `GLACIER`, `DEEP_ARCHIVE`, or `REDUCED_REDUNDANCY`
 * storage classes, nor objects in the `ARCHIVE_ACCESS` or
 * `DEEP_ARCHIVE_ACCESS` access tiers of the `INTELLIGENT_TIERING`
 * storage class. For more information about storage classes, see Using Amazon S3 storage classes
 * in the *Amazon S3 User Guide*.
 *
 * ### Special Errors
 *
 * For a list of special errors for this operation, see List of SELECT
 * Object Content Error Codes
 *
 * The following operations are related to `SelectObjectContent`:
 *
 * - GetObject
 *
 * - GetBucketLifecycleConfiguration
 *
 * - PutBucketLifecycleConfiguration
 *
 * You must URL encode any signed header values that contain spaces. For example, if your header value is `my file.txt`, containing two spaces after `my`, you must URL encode this value to `my%20%20file.txt`.
 */
export const selectObjectContent: (
  input: SelectObjectContentRequest,
) => effect.Effect<
  SelectObjectContentOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SelectObjectContentRequest,
  output: SelectObjectContentOutput,
  errors: [],
}));
