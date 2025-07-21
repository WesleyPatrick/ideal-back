import { CreatePrizeDTO } from "@infra/controllers/prize/dtos/create";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiProperty } from "@nestjs/swagger";

class CreatePrizeBodyWithImageFileDTO extends CreatePrizeDTO {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Image of prize"
  })
  file: Express.Multer.File[];
}

export const CreatePrizeMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for creating the prize",
    type: CreatePrizeBodyWithImageFileDTO
  })
);
