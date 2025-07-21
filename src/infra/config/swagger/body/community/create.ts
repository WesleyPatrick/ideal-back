import { CreateCommunityDto } from "@infra/controllers/community/dtos/create";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class BodyWithCreateCommunityCoverFileDTO extends CreateCommunityDto {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Cover of Community"
  })
  file?: Express.Multer.File[];
}

export const CreatedCommunityMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for creating the community",
    type: BodyWithCreateCommunityCoverFileDTO
  })
);
