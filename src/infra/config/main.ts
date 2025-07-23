import { NestFactory } from "@nestjs/core";
import { AppModule } from "@infra/modules/app";
import { SwaggerConfig } from "./swagger";
import { ValidationPipeConfig } from "@infra/config/validation-pipe";
import { env } from "node:process";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(ValidationPipeConfig.config());

  app.use((req, res, next) => {
    if (req.url.includes("//")) {
      req.url = req.url.replace(/\/+/g, "/");
    }
    next();
  });

  SwaggerConfig.config(app);

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Accept-Language",
      "Cache-Control",
      "Connection",
      "Origin",
      "Referer",
      "Sec-Fetch-Dest",
      "Sec-Fetch-Mode",
      "Sec-Fetch-Site",
      "Sec-GPC",
      "User-Agent",
      "sec-ch-ua",
      "sec-ch-ua-mobile",
      "sec-ch-ua-platform"
    ]
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log("SOLUS API RUNNING 🚀");

  console.info(`Documentation: http://localhost:${env.PORT || 3000}/api-docs`);
}
bootstrap();
