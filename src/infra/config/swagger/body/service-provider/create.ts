import { CreateServiceProviderDTO } from "@infra/controllers/service-provider/dtos/create";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiPropertyOptional } from "@nestjs/swagger";

class BodyWithCreateServiceProviderAvatarFileDTO extends CreateServiceProviderDTO {
  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Image of Service Provider"
  })
  file?: Express.Multer.File[];
}

export const CreateServiceProviderMultiPartBody = applyDecorators(
  ApiConsumes("multipart/form-data"),
  ApiBody({
    description: "Parameters for creating the service provider",
    type: BodyWithCreateServiceProviderAvatarFileDTO
  })
);
