import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class AddSolecasDTO {
  @ApiProperty({
    description: "Solecas value to add",
    example: 1000
  })
  @IsInt()
  @IsPositive()
  solecasValueToAdd: number;
}
