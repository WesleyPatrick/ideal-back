import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiProperty } from "@nestjs/swagger";

class BodyWithNewAvatarFileDTO {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "New avatar image"
  })
  file?: Express.Multer.File[];
}

export const UpdateUserAvatarMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for update user avatar",
    type: BodyWithNewAvatarFileDTO
  })
);
