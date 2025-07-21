import { CreateOperatorDTO } from "@infra/controllers/operator/dtos/create";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class BodyWithCreateOperatorAvatarFileDTO extends CreateOperatorDTO {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Image of operator"
  })
  file?: Express.Multer.File[];
}

export const CreateOperatorMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for creating the operator",
    type: BodyWithCreateOperatorAvatarFileDTO
  })
);
