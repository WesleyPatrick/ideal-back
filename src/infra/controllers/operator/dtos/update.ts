import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail } from "class-validator";

export class UpdateOperatorDTO {
  @ApiProperty({ example: "John Doe", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: "john.doe@email.com", required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: "+5511998765432", required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: "Rua das Flores, 123", required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: "SP", required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: "São Paulo", required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: "12.345.678/0001-99", required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ example: "Maria Silva", required: false })
  @IsOptional()
  @IsString()
  responsible?: string;
}
