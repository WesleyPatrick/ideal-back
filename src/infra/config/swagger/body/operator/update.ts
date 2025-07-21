import { UpdateOperatorDTO } from "@infra/controllers/operator/dtos/update";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class UpdateOperatorWithNewAvatarFileDTO extends UpdateOperatorDTO {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Image of operator"
  })
  file?: Express.Multer.File[];
}

export const UpdateOperatorMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for update the operator",
    type: UpdateOperatorWithNewAvatarFileDTO
  })
);
