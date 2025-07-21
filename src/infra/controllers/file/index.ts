import { GetFileResponses } from "@infra/config/swagger/responses/file/get-file";
import { Controller, Get, Param, Res, StreamableFile } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetFileUseCase } from "@use-cases/file/get-file";
import { GetFileDTO } from "./dto/get-file";
import { GetFilePresignedUrlUseCase } from "@use-cases/file/get-presigned-url";
import { GetFilePresignedUrlResponses } from "@infra/config/swagger/responses/file/get-file-presigned-url";
import { Response } from "express";

@ApiTags("File")
@Controller("file")
export class FileController {
  constructor(
    private readonly getFileUseCase: GetFileUseCase,
    private readonly getFilePresignedUrlUseCase: GetFilePresignedUrlUseCase
  ) {}

  @Get("/:folder/:fileId")
  @GetFileResponses
  async getFile(@Param() params: GetFileDTO): Promise<StreamableFile | void> {
    const result = await this.getFileUseCase.get(params);

    if (!result) return;

    return new StreamableFile(result.data, {
      type: result.contentType,
      disposition: `inline; filename="${params.fileId}"`
    });
  }

  @Get("presigned-url/:folder/:fileId")
  @GetFilePresignedUrlResponses
  async getFilePresignedUrl(
    @Param() params: GetFileDTO
  ): Promise<string | void> {
    const presignedUrl = await this.getFilePresignedUrlUseCase.execute(params);
    if (!presignedUrl) return;
    return presignedUrl;
  }

  @Get("presigned-url-with-redirect/:folder/:fileId")
  @GetFilePresignedUrlResponses
  async getFilePresignedUrlWithRedirect(
    @Param() params: GetFileDTO,
    @Res() res: Response
  ): Promise<string | void> {
    const presignedUrl = await this.getFilePresignedUrlUseCase.execute(params);
    if (!presignedUrl) return;
    return res.redirect(presignedUrl);
  }
}
