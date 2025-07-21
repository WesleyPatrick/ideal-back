import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  Matches,
  Length
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateEmployeeDTO {
  @ApiProperty({
    description: "Full name of the employee",
    example: "Employee User"
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Email address",
    example: "employee2@example.com.br"
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Password", example: "SecurePass123!" })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: "Password must be between 8 and 20 characters" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must contain: 1 uppercase letter, 1 lowercase letter, 1 number or special character"
  })
  password: string;

  @ApiProperty({ description: "CPF", example: "32162498700" })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.replace(/\D/g, ""))
  @Matches(/^\d{11}$/, { message: "CPF must have exactly 11 digits" })
  cpf: string;

  @ApiProperty({ description: "Phone number", example: "+5511988588888" })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ description: "State", example: "SP" })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ description: "City", example: "São Paulo" })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: "Address", example: "Rua Augusta, 500" })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: "Employee Profile id",
    example: "cmaeatn3m00000clde3is60ol"
  })
  @IsString()
  @IsNotEmpty()
  profileId: string;

  @ApiProperty({
    description: "Service Provider ID",
    example: "clm5r44spb10008l46l1f88sc"
  })
  @IsNotEmpty()
  @IsString()
  serviceProviderId: string;
}
