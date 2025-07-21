import { RoleValue } from "@domain/entities/roles";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import {
  CreateCommunityMessageUseCase,
  CreateCommunityMessageUseCaseResponse
} from "@use-cases/community-message/create";
import { CreateCommunityMessageDTO } from "./dtos/create";
import { CreateCommunityMessageResponses } from "@infra/config/swagger/responses/community-message/create";
import { FindLastCommunityMessageUseCase } from "@use-cases/community-message/find-last-message";
import {
  CommunityMessageResponse,
  FindLastMessageResponse
} from "@domain/repositories/community-message";
import { FindLastCommunityMessageResponses } from "@infra/config/swagger/responses/community-message/find-last-message";
import { FindAllCommunityMessagesUseCase } from "@use-cases/community-message/find-all-messages";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { PaginatedEntity } from "@domain/entities/pagination";
import { FindAllCommunityMessagesResponses } from "@infra/config/swagger/responses/community-message/find-all-messages";

@Controller("community-message")
export class CommunityMessageController {
  constructor(
    private readonly createCommunityMessageUseCase: CreateCommunityMessageUseCase,
    private readonly findLastCommunityMessageUseCase: FindLastCommunityMessageUseCase,
    private readonly findAllCommunityMessagesUseCase: FindAllCommunityMessagesUseCase
  ) {}

  @Post()
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @CreateCommunityMessageResponses
  async create(
    @Body() body: CreateCommunityMessageDTO
  ): Promise<CreateCommunityMessageUseCaseResponse | void> {
    const { communityId, content, fromUserId } = body;

    return await this.createCommunityMessageUseCase.execute({
      communityId,
      content,
      fromUserId
    });
  }

  @Get(":employeeId")
  @AuthWithRoleDecorator([RoleValue.EMPLOYEE])
  @FindLastCommunityMessageResponses
  async findLastMessage(
    @Param("employeeId") employeeId: string,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<FindLastMessageResponse> | void> {
    const { page, pageSize } = query;
    return await this.findLastCommunityMessageUseCase.execute({
      employeeId,
      page,
      pageSize
    });
  }

  @Get("all/:communityId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.EMPLOYEE,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @FindAllCommunityMessagesResponses
  async findAllMessages(
    @Param("communityId") communityId: string,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<CommunityMessageResponse> | void> {
    const { page, pageSize } = query;

    return await this.findAllCommunityMessagesUseCase.execute({
      communityId,
      page,
      pageSize
    });
  }
}
