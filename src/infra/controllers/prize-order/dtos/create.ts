import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePrizeOrderDTO {
  @ApiProperty({
    description: "Id of the prize you want to redeem",
    example: "ckxyz1234567890abcdefghi"
  })
  @IsNotEmpty()
  @IsString()
  prizeId: string;

  @ApiProperty({
    description: "Id of the employee who wants to redeem a prize",
    example: "ckxyz1234567890abcdefghi"
  })
  @IsNotEmpty()
  @IsString()
  employeeId: string;
}
