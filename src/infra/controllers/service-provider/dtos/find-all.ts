import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class FindServiceProvidersDTO {
  @ApiProperty({
    description: "Operator ID to filter service providers",
    example: "clm5r44opb10008l46l1f88sc"
  })
  @IsNotEmpty()
  @IsString()
  operatorId: string;

  @ApiProperty({
    description: "Name to filter service providers",
    example: "Pedrao"
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Page number",
    example: 1
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @ApiProperty({
    description: "Number of results per page",
    example: 10
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  pageSize: number;
}
