import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles
} from "@nestjs/common";
import { CreatePrizeUseCase } from "@use-cases/prize/create";
import { CreatePrizeDTO } from "./dtos/create";
import { Prize } from "@domain/entities/prize";
import { CreatePrizeResposes } from "@infra/config/swagger/responses/prize/create";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { PaginatedEntity } from "@domain/entities/pagination";
import { FindAllPrizesUseCase } from "@use-cases/prize/find-all";
import { FindAllPrizesResponses } from "@infra/config/swagger/responses/prize/find-all";
import { UpdatePrizeResposes } from "@infra/config/swagger/responses/prize/update";
import { UpdatePrizeDTO } from "./dtos/update";
import { UpdatePrizeUseCase } from "@use-cases/prize/update";
import { DeletePrizeUseCase } from "@use-cases/prize/delete";
import { DeletePrizeResponses } from "@infra/config/swagger/responses/prize/delete";
import { FindPrizeByIdUseCase } from "@use-cases/prize/find-by-id";
import { FindByPrizeIdResposes } from "@infra/config/swagger/responses/prize/find-by-id";
import { FileUploadDecorator } from "@infra/commons/decorators/file-upload";
import { CreatePrizeMultiPartBody } from "@infra/config/swagger/body/prize/create";
import { FilesValidatorFactory } from "@infra/commons/decorators/file-upload/file-validator/factory";
import { MimeTypes } from "@use-cases/file/validate-type";
import { UpdatePrizeMultiPartBody } from "@infra/config/swagger/body/prize/update";

@Controller("prize")
export class PrizeController {
  constructor(
    private readonly cretePrizeUseCase: CreatePrizeUseCase,
    private readonly findAllPrizesUseCase: FindAllPrizesUseCase,
    private readonly updatePrizeUseCase: UpdatePrizeUseCase,
    private readonly deletePrizeUseCase: DeletePrizeUseCase,
    private readonly findPrizeByIdUseCase: FindPrizeByIdUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @CreatePrizeMultiPartBody
  @CreatePrizeResposes
  async create(
    @Body() body: CreatePrizeDTO,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE]
      })
    )
    file: {
      file?: Express.Multer.File[];
    }
  ): Promise<Prize | void> {
    const image = file?.file?.[0];

    return await this.cretePrizeUseCase.execute(body, image);
  }

  @Get("all")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  @FindAllPrizesResponses
  async findAll(@Query() query: PaginatedDTO): Promise<PaginatedEntity<Prize>> {
    const { page, pageSize } = query;

    return await this.findAllPrizesUseCase.execute({
      page,
      pageSize
    });
  }

  @Get(":prizeId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER,
    RoleValue.EMPLOYEE
  ])
  @FindByPrizeIdResposes
  async findById(@Param("prizeId") prizeId: string): Promise<Prize | void> {
    return await this.findPrizeByIdUseCase.execute(prizeId);
  }

  @Patch(":prizeId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @FileUploadDecorator([{ name: "file", maxCount: 1 }])
  @UpdatePrizeMultiPartBody
  @UpdatePrizeResposes
  async update(
    @Param("prizeId") prizeId: string,
    @Body() body: UpdatePrizeDTO,
    @UploadedFiles(
      FilesValidatorFactory.useFactory({
        mimeTypes: [MimeTypes.IMAGE],
        required: false
      })
    )
    file: {
      file?: Express.Multer.File[];
    }
  ): Promise<Prize | void> {
    const image = file?.file?.[0] || null;

    return await this.updatePrizeUseCase.execute(prizeId, body, image);
  }

  @HttpCode(204)
  @Delete(":prizeId")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @DeletePrizeResponses
  async remove(@Param("prizeId") prizeId: string): Promise<void> {
    return await this.deletePrizeUseCase.execute(prizeId);
  }
}
