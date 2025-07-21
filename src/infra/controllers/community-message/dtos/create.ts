import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateCommunityMessageDTO {
  @ApiProperty({
    description: "Community ID",
    example: "cmbay4aw500010elcg5i8aelh"
  })
  @IsString()
  @IsNotEmpty()
  communityId: string;

  @ApiProperty({
    description: "ID of the user who wants to send the message",
    example: "cmbay4isz00020elca09i7zoz"
  })
  @IsString()
  @IsNotEmpty()
  fromUserId: string;

  @ApiProperty({
    description: "Message content",
    example: "Message to community example"
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
