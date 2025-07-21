import { IsInt, IsPositive, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDailyMissionDto {
  @ApiProperty({
    description:
      "Number of days the daily mission will remain active after being created.",
    example: 7
  })
  @IsInt()
  @IsPositive()
  daysUp: number;

  @ApiProperty({
    description:
      "Amount of solecas the user will earn upon completing this daily mission.",
    example: 15
  })
  @IsInt()
  @IsPositive()
  solecasAmount: number;

  @ApiProperty({
    description: "ID of the base mission to be linked to the daily.",
    example: "clxk2abc0001qoe8ez23z0q0w"
  })
  @IsString()
  @IsNotEmpty()
  missionId: string;

  @ApiProperty({
    description: "ID of the user profile that will receive the daily mission.",
    example: "clxk2def0004qoe8ez23z0q0z"
  })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}
