import { Module } from "@nestjs/common";

import { BcryptIntegration } from "@infra/integrations/cryptography/bcrypt";
import { CryptographyAdapter } from "@domain/adapters/cryptography";

@Module({
  providers: [{ provide: CryptographyAdapter, useClass: BcryptIntegration }],
  exports: [{ provide: CryptographyAdapter, useClass: BcryptIntegration }]
})
export class CryptographyModule {}
