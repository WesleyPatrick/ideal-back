import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiProperty
} from "@nestjs/swagger";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { RoleValue } from "@domain/entities/roles";
import { applyDecorators } from "@nestjs/common";
import { ExceptionResponseDto } from "../error/exception";

export class MessageResponseDto {
  @ApiProperty({
    example: "clv8w59mu0000u8abcdfghijk",
    description: "Unique message ID"
  })
  @IsString()
  id: string;

  @ApiProperty({ example: "Olá, tudo bem?", description: "Message content" })
  @IsString()
  content: string;

  @ApiProperty({
    example: "2024-05-27T10:30:00.000Z",
    description: "Date when message was read",
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readAt?: Date;

  @ApiProperty({ example: "user123", description: "Receiver user ID" })
  @IsString()
  toUserId: string;

  @ApiProperty({ example: "user456", description: "Sender user ID" })
  @IsString()
  fromUserId: string;

  @ApiProperty({
    example: "2024-05-27T10:00:00.000Z",
    description: "Message creation date"
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: "https://cdn.com/avatar1.png",
    description: "Sender avatar URL"
  })
  @IsString()
  fromUserAvatar: string;

  @ApiProperty({ example: "Maria Oliveira", description: "Sender name" })
  @IsString()
  fromUserName: string;

  @ApiProperty({
    enum: RoleValue,
    example: RoleValue.EMPLOYEE,
    description: "Sender role"
  })
  @IsEnum(RoleValue)
  fromUserRole: RoleValue;

  @ApiProperty({
    example: "https://cdn.com/avatar2.png",
    description: "Receiver avatar URL"
  })
  @IsString()
  toUserAvatar: string;

  @ApiProperty({ example: "João Silva", description: "Receiver name" })
  @IsString()
  toUserName: string;

  @ApiProperty({
    enum: RoleValue,
    example: RoleValue.EMPLOYEE,
    description: "Receiver role"
  })
  @IsEnum(RoleValue)
  toUserRole: RoleValue;
}

export const SendMessageToOneResponses = applyDecorators(
  ApiCreatedResponse({
    description: "Message sent successfully",
    type: MessageResponseDto
  }),
  ApiBadRequestResponse({
    description: "Invalid Request",
    type: ExceptionResponseDto
  }),
  ApiNotFoundResponse({
    description: "Not found a user"
  }),
  ApiForbiddenResponse({
    description: "User has no permission"
  }),
  ApiInternalServerErrorResponse({
    description: "Internal Server Erro"
  })
);
