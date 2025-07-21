import { CreateEmployeeDTO } from "@infra/controllers/employee/dtos/create";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class BodyWithCreateEmployeeAvatarFileDTO extends CreateEmployeeDTO {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Image of employee"
  })
  file?: Express.Multer.File[];
}

export const CreateEmployeeMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for creating the employee",
    type: BodyWithCreateEmployeeAvatarFileDTO
  })
);
