import { EditDisciplineDTO } from "@infra/controllers/discipline/dtos/edit-discipline";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class UpdateDisciplineBodyWithNewCoverImageFileDTO extends EditDisciplineDTO {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Image of discipline"
  })
  file?: Express.Multer.File[];
}

export const UpdateDisciplineMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for update the discipline",
    type: UpdateDisciplineBodyWithNewCoverImageFileDTO
  })
);
