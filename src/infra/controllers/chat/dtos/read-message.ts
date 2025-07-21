import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, ArrayUnique, IsArray, IsString } from "class-validator";

export class ReadMessageDTO {
  @ApiProperty({
    description: "Messages IDs",
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  messageIds: string[];

  @ApiProperty({
    description: "Id of the user who will be notified about the read messages",
    example: "cm51jrero0000kzbimiwiijva"
  })
  @IsString()
  toUserId: string;
}
