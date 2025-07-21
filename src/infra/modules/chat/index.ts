import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { SSEModule } from "../sse";
import { ChatController } from "@infra/controllers/chat";
import { SendMessageToOneUseCase } from "@use-cases/chat/send-to-one";
import { UnreadMessageUseCase } from "@use-cases/chat/unread";
import { ReadMessageUseCase } from "@use-cases/chat/read-message";
import { GetConversationUseCase } from "@use-cases/chat/get-conversation";
import { GetAllConversationsUseCase } from "@use-cases/chat/get-all-conversation";
import { SendManyMessagesJobModule } from "../send-many-messages-job";
import { SendMessageToManyUseCase } from "@use-cases/chat/send-to-many";
import { SendMessageToEveryoneUseCase } from "@use-cases/chat/send-to-everyone";

@Module({
  imports: [
    DatabaseModule,
    ExceptionsModule,
    SSEModule,
    SendManyMessagesJobModule
  ],
  controllers: [ChatController],
  providers: [
    SendMessageToOneUseCase,
    UnreadMessageUseCase,
    ReadMessageUseCase,
    GetConversationUseCase,
    GetAllConversationsUseCase,
    SendMessageToManyUseCase,
    SendMessageToEveryoneUseCase
  ]
})
export class ChatModule {}
