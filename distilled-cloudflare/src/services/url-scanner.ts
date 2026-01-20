/**
 * Cloudflare URL-SCANNER API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service url-scanner
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import {
  type CommonErrors,
  UnknownCloudflareError,
  CloudflareNetworkError,
  CloudflareHttpError,
} from "../errors.ts";

// =============================================================================
// Respon
// =============================================================================

export interface GetResponsRequest {
  responseId: string;
  /** Account ID. */
  accountId: string;
}

export const GetResponsRequest = Schema.Struct({
  responseId: Schema.String.pipe(T.HttpPath("responseId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/urlscanner/v2/responses/{responseId}",
  }),
) as unknown as Schema.Schema<GetResponsRequest>;

export type GetResponsResponse = unknown;

export const GetResponsResponse =
  Schema.Unknown as unknown as Schema.Schema<GetResponsResponse>;

export const getRespons: (
  input: GetResponsRequest,
) => Effect.Effect<
  GetResponsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetResponsRequest,
  output: GetResponsResponse,
  errors: [],
}));

// =============================================================================
// Scan
// =============================================================================

export interface GetScanRequest {
  scanId: string;
  /** Account ID. */
  accountId: string;
}

export const GetScanRequest = Schema.Struct({
  scanId: Schema.String.pipe(T.HttpPath("scanId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/urlscanner/v2/result/{scanId}",
  }),
) as unknown as Schema.Schema<GetScanRequest>;

export interface GetScanResponse {
  data: {
    console: {
      message: { level: string; source: string; text: string; url: string };
    }[];
    cookies: {
      domain: string;
      expires: number;
      httpOnly: boolean;
      name: string;
      path: string;
      priority: string;
      sameParty: boolean;
      secure: boolean;
      session: boolean;
      size: number;
      sourcePort: number;
      sourceScheme: string;
      value: string;
    }[];
    globals: { prop: string; type: string }[];
    links: { href: string; text: string }[];
    performance: {
      duration: number;
      entryType: string;
      name: string;
      startTime: number;
    }[];
    requests: {
      request: {
        initialPriority: string;
        isSameSite: boolean;
        method: string;
        mixedContentType: string;
        referrerPolicy: string;
        url: string;
        headers?: unknown;
      };
      response: {
        asn: {
          asn: string;
          country: string;
          description: string;
          ip: string;
          name: string;
          org: string;
        };
        dataLength: number;
        encodedDataLength: number;
        geoip: {
          city: string;
          country: string;
          countryName: string;
          geonameId: string;
          ll: number[];
          region: string;
        };
        hasExtraInfo: boolean;
        requestId: string;
        response: {
          charset: string;
          mimeType: string;
          protocol: string;
          remoteIPAddress: string;
          remotePort: number;
          securityDetails: {
            certificateId: number;
            certificateTransparencyCompliance: string;
            cipher: string;
            encryptedClientHello: boolean;
            issuer: string;
            keyExchange: string;
            keyExchangeGroup: string;
            protocol: string;
            sanList: string[];
            serverSignatureAlgorithm: number;
            subjectName: string;
            validFrom: number;
            validTo: number;
          };
          securityHeaders: { name: string; value: string }[];
          securityState: string;
          status: number;
          statusText: string;
          url: string;
          headers?: unknown;
        };
        size: number;
        type: string;
        contentAvailable?: boolean;
        hash?: string;
      };
      requests?: {
        documentURL: string;
        frameId: string;
        hasUserGesture: boolean;
        initiator: { type: string };
        loaderId: string;
        redirectHasExtraInfo: boolean;
        request: {
          headers: { name: string };
          initialPriority: string;
          isSameSite: boolean;
          method: string;
          mixedContentType: string;
          referrerPolicy: string;
          url: string;
        };
        requestId: string;
        type: string;
        wallTime: number;
      }[];
    }[];
  };
  lists: {
    asns: string[];
    certificates: {
      issuer: string;
      subjectName: string;
      validFrom: number;
      validTo: number;
    }[];
    continents: string[];
    countries: string[];
    domains: string[];
    hashes: string[];
    ips: string[];
    linkDomains: string[];
    servers: string[];
    urls: string[];
  };
  meta: {
    processors: {
      asn: {
        data: {
          asn: string;
          country: string;
          description: string;
          ip: string;
          name: string;
        }[];
      };
      dns: {
        data: {
          address: string;
          dnssecValid: boolean;
          name: string;
          type: string;
        }[];
      };
      domainCategories: {
        data: { inherited: unknown; isPrimary: boolean; name: string }[];
      };
      geoip: {
        data: {
          geoip: {
            city: string;
            country: string;
            countryName: string;
            ll: number[];
            region: string;
          };
          ip: string;
        }[];
      };
      phishing: { data: string[] };
      radarRank: {
        data: { bucket: string; hostname: string; rank?: number }[];
      };
      wappa: {
        data: {
          app: string;
          categories: { name: string; priority: number }[];
          confidence: {
            confidence: number;
            name: string;
            pattern: string;
            patternType: string;
          }[];
          confidenceTotal: number;
          icon: string;
          website: string;
        }[];
      };
      urlCategories?: {
        data: {
          content: { id: number; name: string; superCategoryId: number }[];
          inherited: {
            content: { id: number; name: string; superCategoryId: number }[];
            from: string;
            risks: { id: number; name: string; superCategoryId: number }[];
          };
          name: string;
          risks: { id: number; name: string; superCategoryId: number }[];
        }[];
      };
    };
  };
  page: {
    apexDomain: string;
    asn: string;
    asnname: string;
    city: string;
    country: string;
    domain: string;
    ip: string;
    mimeType: string;
    server: string;
    status: string;
    title: string;
    tlsAgeDays: number;
    tlsIssuer: string;
    tlsValidDays: number;
    tlsValidFrom: string;
    url: string;
    screenshot?: {
      dhash: string;
      mm3Hash: number;
      name: string;
      phash: string;
    };
  };
  scanner: { colo: string; country: string };
  stats: {
    domainStats: {
      count: number;
      countries: string[];
      domain: string;
      encodedSize: number;
      index: number;
      initiators: string[];
      ips: string[];
      redirects: number;
      size: number;
    }[];
    ipStats: {
      asn: {
        asn: string;
        country: string;
        description: string;
        ip: string;
        name: string;
        org: string;
      };
      countries: string[];
      domains: string[];
      encodedSize: number;
      geoip: {
        city: string;
        country: string;
        countryName: string;
        ll: number[];
        region: string;
      };
      index: number;
      ip: string;
      ipv6: boolean;
      redirects: number;
      requests: number;
      size: number;
      count?: number;
    }[];
    iPv6Percentage: number;
    malicious: number;
    protocolStats: {
      count: number;
      countries: string[];
      encodedSize: number;
      ips: string[];
      protocol: string;
      size: number;
    }[];
    resourceStats: {
      compression: number;
      count: number;
      countries: string[];
      encodedSize: number;
      ips: string[];
      percentage: number;
      size: number;
      type: string;
    }[];
    securePercentage: number;
    secureRequests: number;
    serverStats: {
      count: number;
      countries: string[];
      encodedSize: number;
      ips: string[];
      server: string;
      size: number;
    }[];
    tlsStats: {
      count: number;
      countries: string[];
      encodedSize: number;
      ips: string[];
      protocols: { "TLS 1.3 / AES_128_GCM": number };
      securityState: string;
      size: number;
    }[];
    totalLinks: number;
    uniqASNs: number;
    uniqCountries: number;
  };
  task: {
    apexDomain: string;
    domain: string;
    domURL: string;
    method: string;
    options: { customHeaders?: unknown; screenshotsResolutions?: string[] };
    reportURL: string;
    screenshotURL: string;
    source: string;
    success: boolean;
    time: string;
    url: string;
    uuid: string;
    visibility: string;
  };
  verdicts: {
    overall: {
      categories: string[];
      hasVerdicts: boolean;
      malicious: boolean;
      tags: string[];
    };
  };
}

export const GetScanResponse = Schema.Struct({
  data: Schema.Struct({
    console: Schema.Array(
      Schema.Struct({
        message: Schema.Struct({
          level: Schema.String,
          source: Schema.String,
          text: Schema.String,
          url: Schema.String,
        }),
      }),
    ),
    cookies: Schema.Array(
      Schema.Struct({
        domain: Schema.String,
        expires: Schema.Number,
        httpOnly: Schema.Boolean,
        name: Schema.String,
        path: Schema.String,
        priority: Schema.String,
        sameParty: Schema.Boolean,
        secure: Schema.Boolean,
        session: Schema.Boolean,
        size: Schema.Number,
        sourcePort: Schema.Number,
        sourceScheme: Schema.String,
        value: Schema.String,
      }),
    ),
    globals: Schema.Array(
      Schema.Struct({
        prop: Schema.String,
        type: Schema.String,
      }),
    ),
    links: Schema.Array(
      Schema.Struct({
        href: Schema.String,
        text: Schema.String,
      }),
    ),
    performance: Schema.Array(
      Schema.Struct({
        duration: Schema.Number,
        entryType: Schema.String,
        name: Schema.String,
        startTime: Schema.Number,
      }),
    ),
    requests: Schema.Array(
      Schema.Struct({
        request: Schema.Struct({
          initialPriority: Schema.String,
          isSameSite: Schema.Boolean,
          method: Schema.String,
          mixedContentType: Schema.String,
          referrerPolicy: Schema.String,
          url: Schema.String,
          headers: Schema.optional(Schema.Unknown),
        }),
        response: Schema.Struct({
          asn: Schema.Struct({
            asn: Schema.String,
            country: Schema.String,
            description: Schema.String,
            ip: Schema.String,
            name: Schema.String,
            org: Schema.String,
          }),
          dataLength: Schema.Number,
          encodedDataLength: Schema.Number,
          geoip: Schema.Struct({
            city: Schema.String,
            country: Schema.String,
            countryName: Schema.String.pipe(T.JsonName("country_name")),
            geonameId: Schema.String,
            ll: Schema.Array(Schema.Number),
            region: Schema.String,
          }),
          hasExtraInfo: Schema.Boolean,
          requestId: Schema.String,
          response: Schema.Struct({
            charset: Schema.String,
            mimeType: Schema.String,
            protocol: Schema.String,
            remoteIPAddress: Schema.String,
            remotePort: Schema.Number,
            securityDetails: Schema.Struct({
              certificateId: Schema.Number,
              certificateTransparencyCompliance: Schema.String,
              cipher: Schema.String,
              encryptedClientHello: Schema.Boolean,
              issuer: Schema.String,
              keyExchange: Schema.String,
              keyExchangeGroup: Schema.String,
              protocol: Schema.String,
              sanList: Schema.Array(Schema.String),
              serverSignatureAlgorithm: Schema.Number,
              subjectName: Schema.String,
              validFrom: Schema.Number,
              validTo: Schema.Number,
            }),
            securityHeaders: Schema.Array(
              Schema.Struct({
                name: Schema.String,
                value: Schema.String,
              }),
            ),
            securityState: Schema.String,
            status: Schema.Number,
            statusText: Schema.String,
            url: Schema.String,
            headers: Schema.optional(Schema.Unknown),
          }),
          size: Schema.Number,
          type: Schema.String,
          contentAvailable: Schema.optional(Schema.Boolean),
          hash: Schema.optional(Schema.String),
        }),
        requests: Schema.optional(
          Schema.Array(
            Schema.Struct({
              documentURL: Schema.String,
              frameId: Schema.String,
              hasUserGesture: Schema.Boolean,
              initiator: Schema.Struct({
                type: Schema.String,
              }),
              loaderId: Schema.String,
              redirectHasExtraInfo: Schema.Boolean,
              request: Schema.Struct({
                headers: Schema.Struct({
                  name: Schema.String,
                }),
                initialPriority: Schema.String,
                isSameSite: Schema.Boolean,
                method: Schema.String,
                mixedContentType: Schema.String,
                referrerPolicy: Schema.String,
                url: Schema.String,
              }),
              requestId: Schema.String,
              type: Schema.String,
              wallTime: Schema.Number,
            }),
          ),
        ),
      }),
    ),
  }),
  lists: Schema.Struct({
    asns: Schema.Array(Schema.String),
    certificates: Schema.Array(
      Schema.Struct({
        issuer: Schema.String,
        subjectName: Schema.String,
        validFrom: Schema.Number,
        validTo: Schema.Number,
      }),
    ),
    continents: Schema.Array(Schema.String),
    countries: Schema.Array(Schema.String),
    domains: Schema.Array(Schema.String),
    hashes: Schema.Array(Schema.String),
    ips: Schema.Array(Schema.String),
    linkDomains: Schema.Array(Schema.String),
    servers: Schema.Array(Schema.String),
    urls: Schema.Array(Schema.String),
  }),
  meta: Schema.Struct({
    processors: Schema.Struct({
      asn: Schema.Struct({
        data: Schema.Array(
          Schema.Struct({
            asn: Schema.String,
            country: Schema.String,
            description: Schema.String,
            ip: Schema.String,
            name: Schema.String,
          }),
        ),
      }),
      dns: Schema.Struct({
        data: Schema.Array(
          Schema.Struct({
            address: Schema.String,
            dnssecValid: Schema.Boolean.pipe(T.JsonName("dnssec_valid")),
            name: Schema.String,
            type: Schema.String,
          }),
        ),
      }),
      domainCategories: Schema.Struct({
        data: Schema.Array(
          Schema.Struct({
            inherited: Schema.Unknown,
            isPrimary: Schema.Boolean,
            name: Schema.String,
          }),
        ),
      }),
      geoip: Schema.Struct({
        data: Schema.Array(
          Schema.Struct({
            geoip: Schema.Struct({
              city: Schema.String,
              country: Schema.String,
              countryName: Schema.String.pipe(T.JsonName("country_name")),
              ll: Schema.Array(Schema.Number),
              region: Schema.String,
            }),
            ip: Schema.String,
          }),
        ),
      }),
      phishing: Schema.Struct({
        data: Schema.Array(Schema.String),
      }),
      radarRank: Schema.Struct({
        data: Schema.Array(
          Schema.Struct({
            bucket: Schema.String,
            hostname: Schema.String,
            rank: Schema.optional(Schema.Number),
          }),
        ),
      }),
      wappa: Schema.Struct({
        data: Schema.Array(
          Schema.Struct({
            app: Schema.String,
            categories: Schema.Array(
              Schema.Struct({
                name: Schema.String,
                priority: Schema.Number,
              }),
            ),
            confidence: Schema.Array(
              Schema.Struct({
                confidence: Schema.Number,
                name: Schema.String,
                pattern: Schema.String,
                patternType: Schema.String,
              }),
            ),
            confidenceTotal: Schema.Number,
            icon: Schema.String,
            website: Schema.String,
          }),
        ),
      }),
      urlCategories: Schema.optional(
        Schema.Struct({
          data: Schema.Array(
            Schema.Struct({
              content: Schema.Array(
                Schema.Struct({
                  id: Schema.Number,
                  name: Schema.String,
                  superCategoryId: Schema.Number.pipe(
                    T.JsonName("super_category_id"),
                  ),
                }),
              ),
              inherited: Schema.Struct({
                content: Schema.Array(
                  Schema.Struct({
                    id: Schema.Number,
                    name: Schema.String,
                    superCategoryId: Schema.Number.pipe(
                      T.JsonName("super_category_id"),
                    ),
                  }),
                ),
                from: Schema.String,
                risks: Schema.Array(
                  Schema.Struct({
                    id: Schema.Number,
                    name: Schema.String,
                    superCategoryId: Schema.Number.pipe(
                      T.JsonName("super_category_id"),
                    ),
                  }),
                ),
              }),
              name: Schema.String,
              risks: Schema.Array(
                Schema.Struct({
                  id: Schema.Number,
                  name: Schema.String,
                  superCategoryId: Schema.Number.pipe(
                    T.JsonName("super_category_id"),
                  ),
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  }),
  page: Schema.Struct({
    apexDomain: Schema.String,
    asn: Schema.String,
    asnname: Schema.String,
    city: Schema.String,
    country: Schema.String,
    domain: Schema.String,
    ip: Schema.String,
    mimeType: Schema.String,
    server: Schema.String,
    status: Schema.String,
    title: Schema.String,
    tlsAgeDays: Schema.Number,
    tlsIssuer: Schema.String,
    tlsValidDays: Schema.Number,
    tlsValidFrom: Schema.String,
    url: Schema.String,
    screenshot: Schema.optional(
      Schema.Struct({
        dhash: Schema.String,
        mm3Hash: Schema.Number,
        name: Schema.String,
        phash: Schema.String,
      }),
    ),
  }),
  scanner: Schema.Struct({
    colo: Schema.String,
    country: Schema.String,
  }),
  stats: Schema.Struct({
    domainStats: Schema.Array(
      Schema.Struct({
        count: Schema.Number,
        countries: Schema.Array(Schema.String),
        domain: Schema.String,
        encodedSize: Schema.Number,
        index: Schema.Number,
        initiators: Schema.Array(Schema.String),
        ips: Schema.Array(Schema.String),
        redirects: Schema.Number,
        size: Schema.Number,
      }),
    ),
    ipStats: Schema.Array(
      Schema.Struct({
        asn: Schema.Struct({
          asn: Schema.String,
          country: Schema.String,
          description: Schema.String,
          ip: Schema.String,
          name: Schema.String,
          org: Schema.String,
        }),
        countries: Schema.Array(Schema.String),
        domains: Schema.Array(Schema.String),
        encodedSize: Schema.Number,
        geoip: Schema.Struct({
          city: Schema.String,
          country: Schema.String,
          countryName: Schema.String.pipe(T.JsonName("country_name")),
          ll: Schema.Array(Schema.Number),
          region: Schema.String,
        }),
        index: Schema.Number,
        ip: Schema.String,
        ipv6: Schema.Boolean,
        redirects: Schema.Number,
        requests: Schema.Number,
        size: Schema.Number,
        count: Schema.optional(Schema.Number),
      }),
    ),
    iPv6Percentage: Schema.Number.pipe(T.JsonName("IPv6Percentage")),
    malicious: Schema.Number,
    protocolStats: Schema.Array(
      Schema.Struct({
        count: Schema.Number,
        countries: Schema.Array(Schema.String),
        encodedSize: Schema.Number,
        ips: Schema.Array(Schema.String),
        protocol: Schema.String,
        size: Schema.Number,
      }),
    ),
    resourceStats: Schema.Array(
      Schema.Struct({
        compression: Schema.Number,
        count: Schema.Number,
        countries: Schema.Array(Schema.String),
        encodedSize: Schema.Number,
        ips: Schema.Array(Schema.String),
        percentage: Schema.Number,
        size: Schema.Number,
        type: Schema.String,
      }),
    ),
    securePercentage: Schema.Number,
    secureRequests: Schema.Number,
    serverStats: Schema.Array(
      Schema.Struct({
        count: Schema.Number,
        countries: Schema.Array(Schema.String),
        encodedSize: Schema.Number,
        ips: Schema.Array(Schema.String),
        server: Schema.String,
        size: Schema.Number,
      }),
    ),
    tlsStats: Schema.Array(
      Schema.Struct({
        count: Schema.Number,
        countries: Schema.Array(Schema.String),
        encodedSize: Schema.Number,
        ips: Schema.Array(Schema.String),
        protocols: Schema.Struct({
          "TLS 1.3 / AES_128_GCM": Schema.Number,
        }),
        securityState: Schema.String,
        size: Schema.Number,
      }),
    ),
    totalLinks: Schema.Number,
    uniqASNs: Schema.Number,
    uniqCountries: Schema.Number,
  }),
  task: Schema.Struct({
    apexDomain: Schema.String,
    domain: Schema.String,
    domURL: Schema.String,
    method: Schema.String,
    options: Schema.Struct({
      customHeaders: Schema.optional(Schema.Unknown),
      screenshotsResolutions: Schema.optional(Schema.Array(Schema.String)),
    }),
    reportURL: Schema.String,
    screenshotURL: Schema.String,
    source: Schema.String,
    success: Schema.Boolean,
    time: Schema.String,
    url: Schema.String,
    uuid: Schema.String,
    visibility: Schema.String,
  }),
  verdicts: Schema.Struct({
    overall: Schema.Struct({
      categories: Schema.Array(Schema.String),
      hasVerdicts: Schema.Boolean,
      malicious: Schema.Boolean,
      tags: Schema.Array(Schema.String),
    }),
  }),
}) as unknown as Schema.Schema<GetScanResponse>;

export const getScan: (
  input: GetScanRequest,
) => Effect.Effect<
  GetScanResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScanRequest,
  output: GetScanResponse,
  errors: [],
}));

export interface ListScansRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Filter scans */
  q?: string;
  /** Query param: Limit the number of objects in the response. */
  size?: number;
}

export const ListScansRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  q: Schema.optional(Schema.String).pipe(T.HttpQuery("q")),
  size: Schema.optional(Schema.Number).pipe(T.HttpQuery("size")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/urlscanner/v2/search",
  }),
) as unknown as Schema.Schema<ListScansRequest>;

export interface ListScansResponse {
  results: {
    id: string;
    page: { asn: string; country: string; ip: string; url: string };
    result: string;
    stats: {
      dataLength: number;
      requests: number;
      uniqCountries: number;
      uniqIPs: number;
    };
    task: { time: string; url: string; uuid: string; visibility: string };
    verdicts: { malicious: boolean };
  }[];
}

export const ListScansResponse = Schema.Struct({
  results: Schema.Array(
    Schema.Struct({
      id: Schema.String.pipe(T.JsonName("_id")),
      page: Schema.Struct({
        asn: Schema.String,
        country: Schema.String,
        ip: Schema.String,
        url: Schema.String,
      }),
      result: Schema.String,
      stats: Schema.Struct({
        dataLength: Schema.Number,
        requests: Schema.Number,
        uniqCountries: Schema.Number,
        uniqIPs: Schema.Number,
      }),
      task: Schema.Struct({
        time: Schema.String,
        url: Schema.String,
        uuid: Schema.String,
        visibility: Schema.String,
      }),
      verdicts: Schema.Struct({
        malicious: Schema.Boolean,
      }),
    }),
  ),
}) as unknown as Schema.Schema<ListScansResponse>;

export const listScans: (
  input: ListScansRequest,
) => Effect.Effect<
  ListScansResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListScansRequest,
  output: ListScansResponse,
  errors: [],
}));

export interface CreateScanRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  url: string;
  /** Body param: Country to geo egress from */
  country?:
    | "AF"
    | "AL"
    | "DZ"
    | "AD"
    | "AO"
    | "AG"
    | "AR"
    | "AM"
    | "AU"
    | "AT"
    | "AZ"
    | "BH"
    | "BD"
    | "BB"
    | "BY"
    | "BE"
    | "BZ"
    | "BJ"
    | "BM"
    | "BT"
    | "BO"
    | "BA"
    | "BW"
    | "BR"
    | "BN"
    | "BG"
    | "BF"
    | "BI"
    | "KH"
    | "CM"
    | "CA"
    | "CV"
    | "KY"
    | "CF"
    | "TD"
    | "CL"
    | "CN"
    | "CO"
    | "KM"
    | "CG"
    | "CR"
    | "CI"
    | "HR"
    | "CU"
    | "CY"
    | "CZ"
    | "CD"
    | "DK"
    | "DJ"
    | "DM"
    | "DO"
    | "EC"
    | "EG"
    | "SV"
    | "GQ"
    | "ER"
    | "EE"
    | "SZ"
    | "ET"
    | "FJ"
    | "FI"
    | "FR"
    | "GA"
    | "GE"
    | "DE"
    | "GH"
    | "GR"
    | "GL"
    | "GD"
    | "GT"
    | "GN"
    | "GW"
    | "GY"
    | "HT"
    | "HN"
    | "HU"
    | "IS"
    | "IN"
    | "ID"
    | "IR"
    | "IQ"
    | "IE"
    | "IL"
    | "IT"
    | "JM"
    | "JP"
    | "JO"
    | "KZ"
    | "KE"
    | "KI"
    | "KW"
    | "KG"
    | "LA"
    | "LV"
    | "LB"
    | "LS"
    | "LR"
    | "LY"
    | "LI"
    | "LT"
    | "LU"
    | "MO"
    | "MG"
    | "MW"
    | "MY"
    | "MV"
    | "ML"
    | "MR"
    | "MU"
    | "MX"
    | "FM"
    | "MD"
    | "MC"
    | "MN"
    | "MS"
    | "MA"
    | "MZ"
    | "MM"
    | "NA"
    | "NR"
    | "NP"
    | "NL"
    | "NZ"
    | "NI"
    | "NE"
    | "NG"
    | "KP"
    | "MK"
    | "NO"
    | "OM"
    | "PK"
    | "PS"
    | "PA"
    | "PG"
    | "PY"
    | "PE"
    | "PH"
    | "PL"
    | "PT"
    | "QA"
    | "RO"
    | "RU"
    | "RW"
    | "SH"
    | "KN"
    | "LC"
    | "VC"
    | "WS"
    | "SM"
    | "ST"
    | "SA"
    | "SN"
    | "RS"
    | "SC"
    | "SL"
    | "SK"
    | "SI"
    | "SB"
    | "SO"
    | "ZA"
    | "KR"
    | "SS"
    | "ES"
    | "LK"
    | "SD"
    | "SR"
    | "SE"
    | "CH"
    | "SY"
    | "TW"
    | "TJ"
    | "TZ"
    | "TH"
    | "BS"
    | "GM"
    | "TL"
    | "TG"
    | "TO"
    | "TT"
    | "TN"
    | "TR"
    | "TM"
    | "UG"
    | "UA"
    | "AE"
    | "GB"
    | "US"
    | "UY"
    | "UZ"
    | "VU"
    | "VE"
    | "VN"
    | "YE"
    | "ZM"
    | "ZW";
  /** Body param: */
  customagent?: string;
  /** Body param: Set custom headers. */
  customHeaders?: Record<string, unknown>;
  /** Body param: */
  referer?: string;
  /** Body param: Take multiple screenshots targeting different device types. */
  screenshotsResolutions?: ("desktop" | "mobile" | "tablet")[];
  /** Body param: The option `Public` means it will be included in listings like recent scans and search results. `Unlisted` means it will not be included in the aforementioned listings, users will need to  */
  visibility?: "Public" | "Unlisted";
}

export const CreateScanRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  url: Schema.String,
  country: Schema.optional(
    Schema.Literal(
      "AF",
      "AL",
      "DZ",
      "AD",
      "AO",
      "AG",
      "AR",
      "AM",
      "AU",
      "AT",
      "AZ",
      "BH",
      "BD",
      "BB",
      "BY",
      "BE",
      "BZ",
      "BJ",
      "BM",
      "BT",
      "BO",
      "BA",
      "BW",
      "BR",
      "BN",
      "BG",
      "BF",
      "BI",
      "KH",
      "CM",
      "CA",
      "CV",
      "KY",
      "CF",
      "TD",
      "CL",
      "CN",
      "CO",
      "KM",
      "CG",
      "CR",
      "CI",
      "HR",
      "CU",
      "CY",
      "CZ",
      "CD",
      "DK",
      "DJ",
      "DM",
      "DO",
      "EC",
      "EG",
      "SV",
      "GQ",
      "ER",
      "EE",
      "SZ",
      "ET",
      "FJ",
      "FI",
      "FR",
      "GA",
      "GE",
      "DE",
      "GH",
      "GR",
      "GL",
      "GD",
      "GT",
      "GN",
      "GW",
      "GY",
      "HT",
      "HN",
      "HU",
      "IS",
      "IN",
      "ID",
      "IR",
      "IQ",
      "IE",
      "IL",
      "IT",
      "JM",
      "JP",
      "JO",
      "KZ",
      "KE",
      "KI",
      "KW",
      "KG",
      "LA",
      "LV",
      "LB",
      "LS",
      "LR",
      "LY",
      "LI",
      "LT",
      "LU",
      "MO",
      "MG",
      "MW",
      "MY",
      "MV",
      "ML",
      "MR",
      "MU",
      "MX",
      "FM",
      "MD",
      "MC",
      "MN",
      "MS",
      "MA",
      "MZ",
      "MM",
      "NA",
      "NR",
      "NP",
      "NL",
      "NZ",
      "NI",
      "NE",
      "NG",
      "KP",
      "MK",
      "NO",
      "OM",
      "PK",
      "PS",
      "PA",
      "PG",
      "PY",
      "PE",
      "PH",
      "PL",
      "PT",
      "QA",
      "RO",
      "RU",
      "RW",
      "SH",
      "KN",
      "LC",
      "VC",
      "WS",
      "SM",
      "ST",
      "SA",
      "SN",
      "RS",
      "SC",
      "SL",
      "SK",
      "SI",
      "SB",
      "SO",
      "ZA",
      "KR",
      "SS",
      "ES",
      "LK",
      "SD",
      "SR",
      "SE",
      "CH",
      "SY",
      "TW",
      "TJ",
      "TZ",
      "TH",
      "BS",
      "GM",
      "TL",
      "TG",
      "TO",
      "TT",
      "TN",
      "TR",
      "TM",
      "UG",
      "UA",
      "AE",
      "GB",
      "US",
      "UY",
      "UZ",
      "VU",
      "VE",
      "VN",
      "YE",
      "ZM",
      "ZW",
    ),
  ),
  customagent: Schema.optional(Schema.String),
  customHeaders: Schema.optional(Schema.Struct({})),
  referer: Schema.optional(Schema.String),
  screenshotsResolutions: Schema.optional(
    Schema.Array(Schema.Literal("desktop", "mobile", "tablet")),
  ),
  visibility: Schema.optional(Schema.Literal("Public", "Unlisted")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/urlscanner/v2/scan" }),
) as unknown as Schema.Schema<CreateScanRequest>;

export interface CreateScanResponse {
  /** URL to api report. */
  api: string;
  message: string;
  /** Public URL to report. */
  result: string;
  /** Canonical form of submitted URL. Use this if you want to later search by URL. */
  url: string;
  /** Scan ID. */
  uuid: string;
  /** Submitted visibility status. */
  visibility: "public" | "unlisted";
  options?: { useragent?: string };
}

export const CreateScanResponse = Schema.Struct({
  api: Schema.String,
  message: Schema.String,
  result: Schema.String,
  url: Schema.String,
  uuid: Schema.String,
  visibility: Schema.Literal("public", "unlisted"),
  options: Schema.optional(
    Schema.Struct({
      useragent: Schema.optional(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<CreateScanResponse>;

export const createScan: (
  input: CreateScanRequest,
) => Effect.Effect<
  CreateScanResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateScanRequest,
  output: CreateScanResponse,
  errors: [],
}));

export interface BulkCreateScansRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: List of urls to scan (up to a 100). */
  body?: {
    url: string;
    customagent?: string;
    customHeaders?: Record<string, unknown>;
    referer?: string;
    screenshotsResolutions?: ("desktop" | "mobile" | "tablet")[];
    visibility?: "Public" | "Unlisted";
  }[];
}

export const BulkCreateScansRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.optional(
    Schema.Array(
      Schema.Struct({
        url: Schema.String,
        customagent: Schema.optional(Schema.String),
        customHeaders: Schema.optional(Schema.Struct({})),
        referer: Schema.optional(Schema.String),
        screenshotsResolutions: Schema.optional(
          Schema.Array(Schema.Literal("desktop", "mobile", "tablet")),
        ),
        visibility: Schema.optional(Schema.Literal("Public", "Unlisted")),
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/urlscanner/v2/bulk" }),
) as unknown as Schema.Schema<BulkCreateScansRequest>;

export type BulkCreateScansResponse = {
  api: string;
  result: string;
  url: string;
  uuid: string;
  visibility: "public" | "unlisted";
  options?: { useragent?: string };
}[];

export const BulkCreateScansResponse = Schema.Array(
  Schema.Struct({
    api: Schema.String,
    result: Schema.String,
    url: Schema.String,
    uuid: Schema.String,
    visibility: Schema.Literal("public", "unlisted"),
    options: Schema.optional(
      Schema.Struct({
        useragent: Schema.optional(Schema.String),
      }),
    ),
  }),
) as unknown as Schema.Schema<BulkCreateScansResponse>;

export const bulkCreateScans: (
  input: BulkCreateScansRequest,
) => Effect.Effect<
  BulkCreateScansResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkCreateScansRequest,
  output: BulkCreateScansResponse,
  errors: [],
}));

export interface DomScanRequest {
  scanId: string;
  /** Account ID. */
  accountId: string;
}

export const DomScanRequest = Schema.Struct({
  scanId: Schema.String.pipe(T.HttpPath("scanId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/urlscanner/v2/dom/{scanId}",
  }),
) as unknown as Schema.Schema<DomScanRequest>;

export type DomScanResponse = unknown;

export const DomScanResponse =
  Schema.Unknown as unknown as Schema.Schema<DomScanResponse>;

export const domScan: (
  input: DomScanRequest,
) => Effect.Effect<
  DomScanResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DomScanRequest,
  output: DomScanResponse,
  errors: [],
}));

export interface HarScanRequest {
  scanId: string;
  /** Account ID. */
  accountId: string;
}

export const HarScanRequest = Schema.Struct({
  scanId: Schema.String.pipe(T.HttpPath("scanId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/urlscanner/v2/har/{scanId}",
  }),
) as unknown as Schema.Schema<HarScanRequest>;

export interface HarScanResponse {
  log: {
    creator: { comment: string; name: string; version: string };
    entries: {
      initialPriority: string;
      initiatorType: string;
      priority: string;
      requestId: string;
      requestTime: number;
      resourceType: string;
      cache: unknown;
      connection: string;
      pageref: string;
      request: {
        bodySize: number;
        headers: { name: string; value: string }[];
        headersSize: number;
        httpVersion: string;
        method: string;
        url: string;
      };
      response: {
        transferSize: number;
        bodySize: number;
        content: { mimeType: string; size: number; compression?: number };
        headers: { name: string; value: string }[];
        headersSize: number;
        httpVersion: string;
        redirectURL: string;
        status: number;
        statusText: string;
      };
      serverIPAddress: string;
      startedDateTime: string;
      time: number;
    }[];
    pages: {
      id: string;
      pageTimings: { onContentLoad: number; onLoad: number };
      startedDateTime: string;
      title: string;
    }[];
    version: string;
  };
}

export const HarScanResponse = Schema.Struct({
  log: Schema.Struct({
    creator: Schema.Struct({
      comment: Schema.String,
      name: Schema.String,
      version: Schema.String,
    }),
    entries: Schema.Array(
      Schema.Struct({
        initialPriority: Schema.String.pipe(T.JsonName("_initialPriority")),
        initiatorType: Schema.String.pipe(T.JsonName("_initiator_type")),
        priority: Schema.String.pipe(T.JsonName("_priority")),
        requestId: Schema.String.pipe(T.JsonName("_requestId")),
        requestTime: Schema.Number.pipe(T.JsonName("_requestTime")),
        resourceType: Schema.String.pipe(T.JsonName("_resourceType")),
        cache: Schema.Unknown,
        connection: Schema.String,
        pageref: Schema.String,
        request: Schema.Struct({
          bodySize: Schema.Number,
          headers: Schema.Array(
            Schema.Struct({
              name: Schema.String,
              value: Schema.String,
            }),
          ),
          headersSize: Schema.Number,
          httpVersion: Schema.String,
          method: Schema.String,
          url: Schema.String,
        }),
        response: Schema.Struct({
          transferSize: Schema.Number.pipe(T.JsonName("_transferSize")),
          bodySize: Schema.Number,
          content: Schema.Struct({
            mimeType: Schema.String,
            size: Schema.Number,
            compression: Schema.optional(Schema.Number),
          }),
          headers: Schema.Array(
            Schema.Struct({
              name: Schema.String,
              value: Schema.String,
            }),
          ),
          headersSize: Schema.Number,
          httpVersion: Schema.String,
          redirectURL: Schema.String,
          status: Schema.Number,
          statusText: Schema.String,
        }),
        serverIPAddress: Schema.String,
        startedDateTime: Schema.String,
        time: Schema.Number,
      }),
    ),
    pages: Schema.Array(
      Schema.Struct({
        id: Schema.String,
        pageTimings: Schema.Struct({
          onContentLoad: Schema.Number,
          onLoad: Schema.Number,
        }),
        startedDateTime: Schema.String,
        title: Schema.String,
      }),
    ),
    version: Schema.String,
  }),
}) as unknown as Schema.Schema<HarScanResponse>;

export const harScan: (
  input: HarScanRequest,
) => Effect.Effect<
  HarScanResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: HarScanRequest,
  output: HarScanResponse,
  errors: [],
}));

export interface ScreenshotScanRequest {
  scanId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Target device type. */
  resolution?: "desktop" | "mobile" | "tablet";
}

export const ScreenshotScanRequest = Schema.Struct({
  scanId: Schema.String.pipe(T.HttpPath("scanId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  resolution: Schema.optional(
    Schema.Literal("desktop", "mobile", "tablet"),
  ).pipe(T.HttpQuery("resolution")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/urlscanner/v2/screenshots/{scanId}.png",
  }),
) as unknown as Schema.Schema<ScreenshotScanRequest>;

export type ScreenshotScanResponse = unknown;

export const ScreenshotScanResponse =
  Schema.Unknown as unknown as Schema.Schema<ScreenshotScanResponse>;

export const screenshotScan: (
  input: ScreenshotScanRequest,
) => Effect.Effect<
  ScreenshotScanResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ScreenshotScanRequest,
  output: ScreenshotScanResponse,
  errors: [],
}));
