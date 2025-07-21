import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { IsOptional, IsString } from "class-validator";

export class FindAllCommunitiesDTO extends PaginatedDTO {
  @IsOptional()
  @IsString()
  name?: string;
}
