import { IsString } from "class-validator";
import { BaseCompleteActivityDTO } from "./base-complete-activity-dto";
import { ApiProperty } from "@nestjs/swagger";

export class CompleteImageActivityDto extends BaseCompleteActivityDTO {
  @ApiProperty({
    description: "Unique identifier of the image activity being completed.",
    example: "ckxja0q1m0001xqz4hl5c7e9t"
  })
  @IsString()
  imageActivityId: string;
}
