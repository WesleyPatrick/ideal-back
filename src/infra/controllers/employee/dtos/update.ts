import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  Matches,
  IsPhoneNumber
} from "class-validator";

export class UpdateEmployeeDto {
  @ApiPropertyOptional({
    description: "ID of the service provider the employee is associated with",
    example: "clw0wz2gf0000x0z123456789"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  serviceProviderId?: string;

  @ApiPropertyOptional({
    description: "Profile ID linked to the employee",
    example: "clw0wz2gf0001x0z987654321"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profileId?: string;

  @ApiPropertyOptional({
    description: "Full name of the employee",
    example: "Maria da Silva"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: "CPF number of the employee",
    example: "12345678900"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\D/g, ""))
  @Matches(/^\d{11}$/, { message: "CPF must have exactly 11 digits" })
  cpf?: string;

  @ApiPropertyOptional({
    description: "Email address of the employee",
    example: "maria.silva@email.com"
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional({
    description: "Phone number",
    example: "+5511988888888"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({
    description: "Password",
    example: "strongPass123"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: "Password must be between 8 and 20 characters" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must contain: 1 uppercase letter, 1 lowercase letter, 1 number or special character"
  })
  password?: string;
}
