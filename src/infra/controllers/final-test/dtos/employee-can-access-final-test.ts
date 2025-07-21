import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EmployeeCanAccessFinalTestDTO {
  @ApiProperty({
    description: "User id of the employee who wants to access the final test",
    example: "cmcniuf6z0000vdjg5ogag6aq"
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Mission Id where the final test is",
    example: "cmcniwh6u0001vdjg3vuh1x5o"
  })
  @IsNotEmpty()
  @IsString()
  missionId: string;
}
