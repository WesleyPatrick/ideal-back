import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { GetAllConversationsUseCase } from "@use-cases/chat/get-all-conversation";
import { GetConversationUseCase } from "@use-cases/chat/get-conversation";
import { ReadMessageUseCase } from "@use-cases/chat/read-message";
import { SendMessageToOneUseCase } from "@use-cases/chat/send-to-one";
import { UnreadMessageUseCase } from "@use-cases/chat/unread";
import { SendMessageToOneDTO } from "./dtos/send-message-to-one";
import {
  MessageResponse,
  UnreadMessagesResponse
} from "@domain/repositories/chat";
import { SendMessageToOneResponses } from "@infra/config/swagger/responses/chat/send-to-one";
import { AuthWithRoleDecorator } from "@infra/commons/decorators/role-with-auth";
import { RoleValue } from "@domain/entities/roles";
import { UnreadMessagesesponses } from "@infra/config/swagger/responses/chat/unread";
import { GetConversationDTO } from "./dtos/get-conversation";
import { PaginatedDTO } from "@infra/utils/paginated-dto";
import { GetConversationResponses } from "@infra/config/swagger/responses/chat/get-conversation";
import { PaginatedEntity } from "@domain/entities/pagination";
import { GetAllConversationsDTO } from "./dtos/get-all-conversation";
import { ReadMessageDTO } from "./dtos/read-message";
import { ReadMessageResponses } from "@infra/config/swagger/responses/chat/read";
import { SendMessageToManyResponses } from "@infra/config/swagger/responses/chat/send-to-many";
import { SendMessageToManyDTO } from "./dtos/send-message-to-many";
import { SendMessageToManyUseCase } from "@use-cases/chat/send-to-many";
import { SendToEveryoneDTO } from "./dtos/send-to-everyone";
import { SendMessageToEveryoneUseCase } from "@use-cases/chat/send-to-everyone";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly sendMessageToEveryoneUseCase: SendMessageToEveryoneUseCase,
    private readonly sendMessageToManyUseCase: SendMessageToManyUseCase,
    private readonly sendMessageToOneUseCase: SendMessageToOneUseCase,
    private readonly unreadMessageUseCase: UnreadMessageUseCase,
    private readonly getConversationUseCase: GetConversationUseCase,
    private readonly getAllConversationUseCase: GetAllConversationsUseCase,
    private readonly readMessageUseCase: ReadMessageUseCase
  ) {}

  @HttpCode(204)
  @Post("send-to-everyone")
  @AuthWithRoleDecorator([RoleValue.ADMIN])
  @SendMessageToManyResponses
  async sendToEveryone(@Body() body: SendToEveryoneDTO): Promise<void> {
    const { content, fromUserId } = body;

    return await this.sendMessageToEveryoneUseCase.execute({
      content,
      fromUserId
    });
  }

  @HttpCode(204)
  @Post("send-to-many")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @SendMessageToManyResponses
  async sendMessageToMany(@Body() body: SendMessageToManyDTO): Promise<void> {
    return await this.sendMessageToManyUseCase.execute(body);
  }

  @Post("send-to-one")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.EMPLOYEE,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @SendMessageToOneResponses
  async sendMessageToOne(
    @Body() body: SendMessageToOneDTO
  ): Promise<MessageResponse | void> {
    return await this.sendMessageToOneUseCase.execute(body);
  }

  @Get("unread/:userId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.EMPLOYEE,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @UnreadMessagesesponses
  async unread(
    @Param("userId") userId: string
  ): Promise<UnreadMessagesResponse | void> {
    return await this.unreadMessageUseCase.execute(userId);
  }

  @Get("conversation/from/:fromUserId/to/:toUserId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.EMPLOYEE,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @GetConversationResponses
  async getConversation(
    @Param() params: GetConversationDTO,
    @Query() query: PaginatedDTO
  ): Promise<PaginatedEntity<MessageResponse> | void> {
    const { fromUserId, toUserId } = params;
    const { page, pageSize } = query;

    return await this.getConversationUseCase.execute({
      fromUserId,
      toUserId,
      page,
      pageSize
    });
  }

  @Get("all/conversations/:userId")
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.EMPLOYEE,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @GetConversationResponses
  async getAllConversations(
    @Param("userId") userId: string,
    @Query() query: GetAllConversationsDTO
  ): Promise<PaginatedEntity<MessageResponse> | void> {
    const { page, pageSize, name } = query;

    return await this.getAllConversationUseCase.execute({
      userId,
      name,
      page,
      pageSize
    });
  }

  @HttpCode(204)
  @AuthWithRoleDecorator([
    RoleValue.ADMIN,
    RoleValue.EMPLOYEE,
    RoleValue.OPERATOR,
    RoleValue.SERVICE_PROVIDER
  ])
  @ReadMessageResponses
  @Patch("read")
  async readMessages(@Body() body: ReadMessageDTO): Promise<void> {
    const { messageIds, toUserId } = body;

    return await this.readMessageUseCase.execute(messageIds, toUserId);
  }
}
