import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionsModule } from "../exceptions";
import { CommunityMessageController } from "@infra/controllers/community-message";
import { CreateCommunityMessageUseCase } from "@use-cases/community-message/create";
import { FindLastCommunityMessageUseCase } from "@use-cases/community-message/find-last-message";
import { SSEModule } from "../sse";
import { FindAllCommunityMessagesUseCase } from "@use-cases/community-message/find-all-messages";

@Module({
  imports: [DatabaseModule, ExceptionsModule, SSEModule],
  controllers: [CommunityMessageController],
  providers: [
    CreateCommunityMessageUseCase,
    FindLastCommunityMessageUseCase,
    FindAllCommunityMessagesUseCase
  ]
})
export class CommunityMessageModule {}
