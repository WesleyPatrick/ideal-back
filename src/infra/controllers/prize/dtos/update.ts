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
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdatePrizeDTO {
  @ApiPropertyOptional({
    description: "Name of the prize",
    example: "Gift Card"
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: "Number of solecas required to redeem the prize",
    example: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  solecasValue?: number;

  @ApiPropertyOptional({
    description: "Monetary value of the prize",
    example: 50.0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  moneyValue?: number;

  @ApiPropertyOptional({
    description: "Detailed description of the prize",
    example: "A $50 gift card for online shopping."
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    description: "Color of the prize card in HEX format",
    example: "#00DE73"
  })
  @IsOptional()
  @IsString()
  @IsHexColor()
  @IsNotEmpty()
  color?: string;

  @ApiPropertyOptional({
    description: "Expiration date of the prize",
    example: "2025-12-31T23:59:59.000Z"
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;
}
