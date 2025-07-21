import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateCommunityDto {
  @ApiPropertyOptional({
    example: "Updated Community Name",
    description: "New name for the community"
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: "Jane Smith",
    description: "New author of the community"
  })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({
    example: "An updated summary of the community purpose and goals.",
    description: "New brief description of the community"
  })
  @IsString()
  @IsOptional()
  resume?: string;
}
