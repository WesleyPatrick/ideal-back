import { ApiProperty } from "@nestjs/swagger";
import { BaseCompleteActivityDTO } from "./base-complete-activity-dto";
import { IsString } from "class-validator";

export class CompleteTrueOrFalseActivityDto extends BaseCompleteActivityDTO {
  @ApiProperty({
    description:
      "Unique identifier of the true or false activity being completed.",
    example: "ckxja0q1m0001xqz4hl5c7e9t"
  })
  @IsString()
  trueOrFalseActivityId: string;
}
