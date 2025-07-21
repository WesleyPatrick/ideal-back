import { EditMissionDto } from "@infra/controllers/mission/dtos/edit";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiProperty } from "@nestjs/swagger";

class BodyWithEditMissionArticleFileDTO extends EditMissionDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Article File"
  })
  articleFile: Express.Multer.File[];

  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Activity images file"
  })
  imagesFiles: Express.Multer.File[];
}

export const EditMissionMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for edit mission",
    type: BodyWithEditMissionArticleFileDTO
  })
);
