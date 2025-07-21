import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcryptjs";

import { CryptographyAdapter } from "@domain/adapters/cryptography";

@Injectable()
export class BcryptIntegration implements CryptographyAdapter {
  private HASH_SALT_LENGTH = 8;

  generateHash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
