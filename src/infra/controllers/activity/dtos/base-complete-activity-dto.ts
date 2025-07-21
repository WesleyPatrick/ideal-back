import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ActivityTypeEnum } from "@domain/entities/activity-type-enum";

export class BaseCompleteActivityDTO {
  @ApiProperty({
    description: "Unique identifier of the user completing the activity.",
    example: "ckxj9uq1l0000xqz4hl5c7d8r"
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Indicates whether the user answered the activity correctly.",
    example: true
  })
  @IsBoolean()
  @Type(() => Boolean)
  isCorrect: boolean;

  @ApiProperty({
    description:
      "Type of the activity being completed. Must match one of the values in ActivityTypeEnum.",
    example: ActivityTypeEnum.DIALOG,
    enum: ActivityTypeEnum
  })
  @IsEnum(ActivityTypeEnum)
  activityType: ActivityTypeEnum;

  @ApiPropertyOptional({
    description: "The activity is a daily mission",
    example: true
  })
  @IsBoolean()
  @IsOptional()
  isDailyMission?: boolean;
}
