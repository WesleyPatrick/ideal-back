import { UpdateUserByUserDto } from "@infra/controllers/user/dto/update-by-user";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class UpdateByUserWithNewAvatarFileDTO extends UpdateUserByUserDto {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "New image of employee"
  })
  file?: Express.Multer.File[];
}

export const UpdateByUserMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for update the user by user",
    type: UpdateByUserWithNewAvatarFileDTO
  })
);
