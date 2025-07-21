import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty } from "class-validator";

export class UpdateUserByUserDto {
  @ApiPropertyOptional({
    description: "Full name of the user",
    example: "Maria da Silva"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
