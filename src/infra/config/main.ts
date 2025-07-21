import { NestFactory } from "@nestjs/core";
import { AppModule } from "@infra/modules/app";
import { SwaggerConfig } from "./swagger";
import { ValidationPipeConfig } from "@infra/config/validation-pipe";
import { env } from "node:process";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(ValidationPipeConfig.config());

  SwaggerConfig.config(app);

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log("SOLUS API RUNNING 🚀");

  console.info(`Documentation: http://localhost:${env.PORT || 3000}/api-docs`);
}
bootstrap();
