import { plainToInstance } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  validateSync
} from "class-validator";

enum EnvTypes {
  development = "development",
  production = "production",
  staging = "staging"
}

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsEnum(EnvTypes, {
    message: "NODE_ENV must be one of 'development', 'production', or 'staging'"
  })
  NODE_ENV: EnvTypes;

  @IsNumber()
  PGPORT: number;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  REDIS_HOST: string;

  @IsInt()
  REDIS_PORT: number;

  @IsInt()
  REDIS_DB: number;

  @IsString()
  AWS_S3_BUCKET_NAME: string;

  @IsString()
  AWS_S3_BUCKET_REGION: string;

  @IsString()
  AWS_S3_BUCKET_ACCESS_KEY: string;

  @IsString()
  AWS_S3_BUCKET_SECRET_KEY: string;

  @IsString()
  API_URL: string;
}

export function validate(
  config: Record<string, unknown>
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
