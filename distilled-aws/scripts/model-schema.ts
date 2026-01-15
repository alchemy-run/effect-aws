import { Schema as S } from "effect";

// Trait definition
export const Trait = S.Record({
  key: S.String,
  value: S.Unknown,
});

// Member definition
export const Member = S.Struct({
  target: S.String,
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const ServiceShape = S.Struct({
  type: S.Literal("service"),
  version: S.String,
  operations: S.optional(S.Array(S.Struct({ target: S.String }))),
  resources: S.optional(
    S.Array(
      S.Struct({
        target: S.String,
      }),
    ),
  ),
  traits: S.extend(
    //* dynamic record must be first so schema doesn't remove the values when decoding
    S.Record({ key: S.String, value: S.Unknown }),
    S.Struct({
      "aws.api#service": S.Struct({
        sdkId: S.String,
      }),
      "aws.auth#sigv4": S.optional(S.Struct({ name: S.String })),
    }),
  ),
});

export const TimestampShape = S.Struct({
  type: S.Literal("timestamp"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});
export const IntegerShape = S.Struct({
  type: S.Literal("integer"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});
export const BooleanShape = S.Struct({
  type: S.Literal("boolean"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});
export const StringShape = S.Struct({
  type: S.Literal("string"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});
export const LongShape = S.Struct({
  type: S.Literal("long"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});
export const DoubleShape = S.Struct({
  type: S.Literal("double"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});
export const FloatShape = S.Struct({
  type: S.Literal("float"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});
export const BlobShape = S.Struct({
  type: S.Literal("blob"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const ListShape = S.Struct({
  type: S.Literal("list"),
  member: S.Struct({
    target: S.String,
    traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  }),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const MapShape = S.Struct({
  type: S.Literal("map"),
  key: S.Struct({
    target: S.String,
    traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  }),
  value: S.Struct({
    target: S.String,
    traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  }),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const UnionShape = S.Struct({
  type: S.Literal("union"),
  members: S.Record({
    key: S.String,
    value: S.Struct({
      target: S.String,
      traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
    }),
  }),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const EnumShape = S.Struct({
  //todo(pear): intEnum should probably parse to a number
  type: S.Literal("enum"),
  members: S.Record({
    key: S.String,
    value: S.Struct({
      target: S.Literal("smithy.api#Unit"),
      traits: S.Struct({
        "smithy.api#enumValue": S.String,
      }),
    }),
  }),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const IntEnumShape = S.Struct({
  //todo(pear): intEnum should probably parse to a number
  type: S.Literal("intEnum"),
  members: S.Record({
    key: S.String,
    value: S.Struct({
      target: S.Literal("smithy.api#Unit"),
      traits: S.Struct({
        "smithy.api#enumValue": S.Number,
      }),
    }),
  }),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const StructureShape = S.Struct({
  type: S.Literal("structure"),
  members: S.Record({ key: S.String, value: Member }),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const DocumentShape = S.Struct({
  type: S.Literal("document"),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const OperationShape = S.Struct({
  type: S.Literal("operation"),
  input: S.Struct({ target: S.String }),
  output: S.Struct({ target: S.String }),
  errors: S.optional(S.Array(S.Struct({ target: S.String }))),
  traits: S.extend(
    //* dynamic record must be first so schema doesn't remove the values when decoding
    S.Record({ key: S.String, value: S.Unknown }),
    S.Struct({
      "smithy.api#documentation": S.optional(S.String),
      "smithy.api#http": S.optional(
        S.Struct({ method: S.String, uri: S.String }),
      ),
    }),
  ),
});

export const ResourceShape = S.Struct({
  type: S.Literal("resource"),
  identifiers: S.optional(
    S.Record({
      key: S.String,
      value: S.Struct({
        target: S.String,
      }),
    }),
  ),
  create: S.optional(S.Struct({ target: S.String })),
  put: S.optional(S.Struct({ target: S.String })),
  read: S.optional(S.Struct({ target: S.String })),
  update: S.optional(S.Struct({ target: S.String })),
  delete: S.optional(S.Struct({ target: S.String })),
  list: S.optional(S.Struct({ target: S.String })),
  operations: S.optional(S.Array(S.Struct({ target: S.String }))),
  collectionOperations: S.optional(S.Array(S.Struct({ target: S.String }))),
  resources: S.optional(
    S.Array(
      S.Struct({
        target: S.String,
      }),
    ),
  ),
  traits: S.optional(S.Record({ key: S.String, value: S.Unknown })),
});

export const GenericShape = S.Union(
  ServiceShape,
  TimestampShape,
  IntegerShape,
  BooleanShape,
  StringShape,
  LongShape,
  DoubleShape,
  FloatShape,
  BlobShape,
  ListShape,
  MapShape,
  UnionShape,
  EnumShape,
  IntEnumShape,
  StructureShape,
  DocumentShape,
  OperationShape,
  ResourceShape,
);

// Smithy model
export const SmithyModel = S.Struct({
  smithy: S.String,
  metadata: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  shapes: S.Record({
    key: S.String,
    value: GenericShape,
  }),
});

// Type exports
export type Member = typeof Member.Type;
export type GenericShape = typeof GenericShape.Type;
export type TimestampShape = typeof TimestampShape.Type;
export type ServiceShape = typeof ServiceShape.Type;
export type IntegerShape = typeof IntegerShape.Type;
export type BooleanShape = typeof BooleanShape.Type;
export type StringShape = typeof StringShape.Type;
export type LongShape = typeof LongShape.Type;
export type DoubleShape = typeof DoubleShape.Type;
export type FloatShape = typeof FloatShape.Type;
export type BlobShape = typeof BlobShape.Type;
export type ListShape = typeof ListShape.Type;
export type MapShape = typeof MapShape.Type;
export type UnionShape = typeof UnionShape.Type;
export type EnumShape = typeof EnumShape.Type;
export type IntEnumShape = typeof IntEnumShape.Type;
export type StructureShape = typeof StructureShape.Type;
export type DocumentShape = typeof DocumentShape.Type;
export type OperationShape = typeof OperationShape.Type;
export type ResourceShape = typeof ResourceShape.Type;
export type SmithyModel = typeof SmithyModel.Type;

export type ShapeTypeMap = {
  service: ServiceShape;
  timestamp: TimestampShape;
  integer: IntegerShape;
  boolean: BooleanShape;
  string: StringShape;
  long: LongShape;
  double: DoubleShape;
  float: FloatShape;
  blob: BlobShape;
  list: ListShape;
  map: MapShape;
  union: UnionShape;
  enum: EnumShape;
  intEnum: IntEnumShape;
  structure: StructureShape;
  document: DocumentShape;
  operation: OperationShape;
  resource: ResourceShape;
};
