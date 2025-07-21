import { CreateDisciplineDTO } from "@infra/controllers/discipline/dtos/create-discipline";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiProperty } from "@nestjs/swagger";

class BodyWithCreateDisciplineCoverFileDTO extends CreateDisciplineDTO {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Image of discipline"
  })
  file: Express.Multer.File[];
}

export const CreateDisciplineMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for creating the discipline",
    type: BodyWithCreateDisciplineCoverFileDTO
  })
);
