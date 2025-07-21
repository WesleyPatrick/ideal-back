import { ApiProperty } from "@nestjs/swagger";
import { BaseCompleteActivityDTO } from "./base-complete-activity-dto";
import { IsString } from "class-validator";

export class CompleteMultipleResponseActivityDto extends BaseCompleteActivityDTO {
  @ApiProperty({
    description:
      "Unique identifier of the multiple reponse activity being completed.",
    example: "ckxja0q1m0001xqz4hl5c7e9t"
  })
  @IsString()
  multipleResponseActivityId: string;
}
