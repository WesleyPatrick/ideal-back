import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAllDisciplinesDTO extends PaginatedDTO {
  @ApiPropertyOptional({
    description: "Discipline title",
    example: "Formação WebPrestador"
  })
  @IsOptional()
  @IsString()
  title?: string;
}
