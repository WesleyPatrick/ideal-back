import { applyDecorators } from "@nestjs/common";
import { ApiPropertyOptional, ApiConsumes, ApiBody } from "@nestjs/swagger";

class UpdateServiceProviderBodyWithNewAvatarFileDTO {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "New image of service provider"
  })
  file?: Express.Multer.File[];
}

export const UpdateServiceProviderMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for update the service provider",
    type: UpdateServiceProviderBodyWithNewAvatarFileDTO
  })
);
