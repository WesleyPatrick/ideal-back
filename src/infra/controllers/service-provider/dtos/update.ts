import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  Length,
  IsPhoneNumber,
  Matches
} from "class-validator";

export class UpdateServiceProviderDto {
  @ApiPropertyOptional({
    description: "Service provider name",
    example: "WebPrestadora São Paulo"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: "State where the service provider operates",
    example: "SP"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  state?: string;

  @ApiPropertyOptional({
    description: "City of the service provider",
    example: "São Paulo"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiPropertyOptional({
    description: "Full address of the service provider",
    example: "Av. Paulista, 1000"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiPropertyOptional({
    description: "CNPJ of the service provider",
    example: "12.345.678/0001-90"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\D/g, ""))
  @Matches(/^\d{14}$/, { message: "CNPJ must have exactly 14 digits" })
  cnpj?: string;

  @ApiPropertyOptional({
    description: "Name of the responsible person",
    example: "João da Silva"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  responsible?: string;

  @ApiPropertyOptional({
    description: "Password to access the system",
    example: "securePassword123"
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

  @ApiPropertyOptional({
    description: "CPF of the responsible person",
    example: "123.456.789-00"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\D/g, ""))
  @Matches(/^\d{11}$/, { message: "CPF must have exactly 11 digits" })
  cpf?: string;

  @ApiPropertyOptional({
    description: "Email address of the service provider",
    example: "contato@webprestadora.com"
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional({
    description: "Contact phone number",
    example: "+55 11 91234-5678"
  })
  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone?: string;
}
