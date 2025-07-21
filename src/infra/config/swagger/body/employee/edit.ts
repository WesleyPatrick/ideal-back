import { UpdateEmployeeDto } from "@infra/controllers/employee/dtos/update";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class UpdateEmployeeBodyWithNewAvatarFileDTO extends UpdateEmployeeDto {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "New image of employee"
  })
  file?: Express.Multer.File[];
}

export const UpdateEmployeeMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for update the employee",
    type: UpdateEmployeeBodyWithNewAvatarFileDTO
  })
);
