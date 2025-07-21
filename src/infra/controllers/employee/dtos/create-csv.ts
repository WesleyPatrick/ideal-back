import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateEmployeeWithCsvDTO {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "CSV file containing employee data"
  })
  @IsNotEmpty()
  file: string;
}
