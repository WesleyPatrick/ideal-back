import { Module } from "@nestjs/common";

import { CryptographyModule } from "../cryptography";
import { TokenModule } from "../token";
import { LoginUseCase } from "@use-cases/authentication/login";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { AuthenticationController } from "@infra/controllers/authentication";

@Module({
  imports: [TokenModule, CryptographyModule, DatabaseModule, ExceptionsModule],
  controllers: [AuthenticationController],
  providers: [LoginUseCase],
  exports: [LoginUseCase]
})
export class AuthenticationModule {}
