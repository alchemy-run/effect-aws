export const toUint8Array = (
  data: string | ArrayBuffer | ArrayBufferView,
): Uint8Array => {
  if (typeof data === "string") {
    return fromUtf8(data);
  }

  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(
      data.buffer,
      data.byteOffset,
      data.byteLength / Uint8Array.BYTES_PER_ELEMENT,
    );
  }

  return new Uint8Array(data);
};

export const fromUtf8 = (input: string): Uint8Array => {
  const buf = fromString(input, "utf8");
  return new Uint8Array(
    buf.buffer,
    buf.byteOffset,
    buf.byteLength / Uint8Array.BYTES_PER_ELEMENT,
  );
};

export const fromArrayBuffer = (
  input: ArrayBuffer,
  offset = 0,
  length: number = input.byteLength - offset,
): Buffer => Buffer.from(input, offset, length);

export type StringEncoding =
  | "ascii"
  | "utf8"
  | "utf16le"
  | "ucs2"
  | "base64"
  | "latin1"
  | "binary"
  | "hex";

export const fromString = (
  input: string,
  encoding?: StringEncoding,
): Buffer => {
  return encoding ? Buffer.from(input, encoding) : Buffer.from(input);
};

export const isArrayBuffer = (arg: any): arg is ArrayBuffer =>
  (typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer) ||
  Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
