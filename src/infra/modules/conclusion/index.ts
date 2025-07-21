import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ConclusionAdapterModule } from "../conclusion-adapter";
import { ExceptionsModule } from "../exceptions";
import { ConclusionController } from "@infra/controllers/conclusion";
import { CreateConclusionUseCase } from "@use-cases/conclusion/create-conclusion";
import { FinishedConclusionUseCase } from "@use-cases/conclusion/finished-conclusion";

@Module({
  imports: [DatabaseModule, ConclusionAdapterModule, ExceptionsModule],
  controllers: [ConclusionController],
  providers: [CreateConclusionUseCase, FinishedConclusionUseCase]
})
export class ConclusionModule {}
