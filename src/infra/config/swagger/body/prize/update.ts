import { UpdatePrizeDTO } from "@infra/controllers/prize/dtos/update";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class UpdatePrizeBodyWithImageFileDTO extends UpdatePrizeDTO {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "New image of prize"
  })
  file?: Express.Multer.File[];
}

export const UpdatePrizeMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for update the prize",
    type: UpdatePrizeBodyWithImageFileDTO
  })
);
