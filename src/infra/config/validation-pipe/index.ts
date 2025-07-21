import { ValidationPipe } from "@nestjs/common";

export class ValidationPipeConfig {
  static config(): ValidationPipe {
    return new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    });
  }
}
