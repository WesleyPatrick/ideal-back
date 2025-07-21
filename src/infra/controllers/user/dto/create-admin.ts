import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  Matches,
  IsPhoneNumber,
  IsUrl,
  IsOptional
} from "class-validator";

export class CreateAdminDTO {
  @ApiProperty({
    description: "Full name of the admin",
    example: "Admin User"
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Admin email address",
    example: "admin-email@example.com.br"
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Admin Password",
    example: "SecurePass123!"
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: "Password must be between 8 and 20 characters" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must contain: 1 uppercase letter, 1 lowercase letter, 1 number or special character"
  })
  password: string;

  @ApiProperty({
    description: "Admin CPF",
    example: "32162491700"
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.replace(/\D/g, ""))
  @Matches(/^\d{11}$/, { message: "CPF must have exactly 11 digits" })
  cpf: string;

  @ApiProperty({
    description: "Admin phone number",
    example: "+5511988588888"
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: "Admin state",
    example: "SP"
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: "Admin city",
    example: "São Paulo"
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: "Admin address",
    example: "Rua Augusta, 500"
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: "Admin avatar",
    example: "https://randomuser.me/api/portraits/men/1.jpg"
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string;
}
