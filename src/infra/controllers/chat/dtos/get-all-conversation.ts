import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginatedDTO } from "@infra/utils/paginated-dto";

export class GetAllConversationsDTO extends PaginatedDTO {
  @ApiPropertyOptional({
    description: "Name of the user to find conversations",
    example: "João"
  })
  @IsString()
  @IsOptional()
  name: string;
}
