import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString
} from "class-validator";

export class SendMessageToManyDTO {
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

  @ApiProperty({
    description: "List of users you want to send the message to",
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  toUserIds: string[];
}
