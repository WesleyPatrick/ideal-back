import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommunityDto {
  @ApiProperty({
    example: "Mathematics Community",
    description: "Name of the community"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "John Doe",
    description: "Author of the community"
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    example: "A community focused on discussing advanced mathematics topics.",
    description: "Brief description of the community"
  })
  @IsString()
  @IsNotEmpty()
  resume: string;

  @ApiProperty({
    example: "ckxtz4f930001p7r3fzi9c8z0",
    description: "CUID of the operator to which this community belongs"
  })
  @IsString()
  @IsNotEmpty()
  operatorId: string;

  @ApiProperty({
    example: "cmclrmvhm0000b4jg3p32czli",
    description: "CUID of the profile to which this community belongs"
  })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}
