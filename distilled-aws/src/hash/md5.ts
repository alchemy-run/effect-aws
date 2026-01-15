import type { Checksum } from "@smithy/types";
import * as crypto from "crypto";

export const getMd5ChecksumAlgorithmFunction = () => {
  return NodeMd5;
};

class NodeMd5 implements Checksum {
  private hash = crypto.createHash("md5");

  update(data: Uint8Array) {
    this.hash.update(data);
  }

  async digest(): Promise<Uint8Array> {
    return new Uint8Array(this.hash.digest());
  }

  reset() {
    this.hash = crypto.createHash("md5");
  }
}
