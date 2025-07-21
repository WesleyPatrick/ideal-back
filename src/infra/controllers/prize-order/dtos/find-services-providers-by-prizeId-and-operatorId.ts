import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FindServicesProviderParamDTO {
  @ApiProperty({
    description: "Prize Id",
    example: "cmalfbehn00020cl5hd8t2l5c"
  })
  @IsNotEmpty()
  @IsString()
  prizeId: string;

  @ApiProperty({
    description: "Operator Id",
    example: "cmalfcgfg00030cl56wpf49g9"
  })
  @IsNotEmpty()
  @IsString()
  operatorId: string;
}
