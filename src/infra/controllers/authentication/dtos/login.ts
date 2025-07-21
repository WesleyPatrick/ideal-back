import { ApiProperty } from "@nestjs/swagger";
import { LoginUseCaseParams } from "@use-cases/authentication/login";
import { IsString, IsEmail } from "class-validator";

export class LoginDto implements LoginUseCaseParams {
  @ApiProperty({
    description: "User email address",
    example: "operator@example.com.br"
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User password",
    example: "SecurePass123!"
  })
  @IsString()
  password: string;
}
