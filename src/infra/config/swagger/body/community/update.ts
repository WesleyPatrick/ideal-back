import { UpdateCommunityDto } from "@infra/controllers/community/dtos/update";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class UpdateCommunityBodyWithNewCoverImageDTO extends UpdateCommunityDto {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "New cover of Community"
  })
  file?: Express.Multer.File[];
}

export const UpdateCommunityMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for update the community",
    type: UpdateCommunityBodyWithNewCoverImageDTO
  })
);
