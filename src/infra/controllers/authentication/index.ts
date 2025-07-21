import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  LoginUseCase,
  LoginUseCaseReturn
} from "@use-cases/authentication/login";
import { ApiTags } from "@nestjs/swagger";
import { LoginResponses } from "@infra/config/swagger/responses/authentication/login";
import { LoginDto } from "./dtos/login";

@ApiTags("Authentication")
@Controller("auth")
export class AuthenticationController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @LoginResponses
  login(@Body() body: LoginDto): LoginUseCaseReturn {
    return this.loginUseCase.login(body);
  }
}
