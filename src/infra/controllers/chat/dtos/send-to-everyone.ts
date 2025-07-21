import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SendToEveryoneDTO {
  @ApiProperty({
    description: "From User Id",
    example: "cmb7yrd2t00010djsb9ylapii"
  })
  @IsString()
  @IsNotEmpty()
  fromUserId: string;

  @ApiProperty({
    description: "Message Content",
    example: "Message example"
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
