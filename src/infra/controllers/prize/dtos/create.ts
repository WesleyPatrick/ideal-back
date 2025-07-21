import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsNumber,
  IsDate,
  IsOptional,
  IsHexColor
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePrizeDTO {
  @ApiProperty({
    description: "Name of the prize",
    example: "Gift Card"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Number of solecas required to redeem the prize",
    example: 100
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  solecasValue: number;

  @ApiProperty({
    description: "Monetary value of the prize",
    example: 50.0
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  moneyValue: number;

  @ApiProperty({
    description: "Detailed description of the prize",
    example: "A $50 gift card for online shopping."
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: "Color of the prize card in HEX format",
    example: "#00DE73"
  })
  @IsOptional()
  @IsString()
  @IsHexColor()
  @IsNotEmpty()
  color?: string;

  @ApiProperty({
    description: "Expiration date of the prize",
    example: "2025-12-31T23:59:59.000Z"
  })
  @IsDate()
  @Type(() => Date)
  expiryDate: Date;
}
