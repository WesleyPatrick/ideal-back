import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateServiceProviderWithCsvDTO {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "CSV file containing service provider's data"
  })
  @IsNotEmpty()
  file: string;
}
