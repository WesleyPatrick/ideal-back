import { StorageFolderPaths } from "@domain/adapters/file-storage";
import { ApiProperty } from "@nestjs/swagger";
import { GetFileUseCaseParams } from "@use-cases/file/get-file";
import { IsEnum, IsString } from "class-validator";

export class GetFileDTO implements GetFileUseCaseParams {
  @IsString()
  @ApiProperty({
    description: "ID of the file"
  })
  fileId: string;

  @IsEnum(StorageFolderPaths)
  @ApiProperty({
    description: "Folder where the file is stored",
    enum: StorageFolderPaths
  })
  folder: StorageFolderPaths;
}
