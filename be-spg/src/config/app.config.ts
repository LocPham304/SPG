import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  validateSync,
} from 'class-validator';
import { registerAs } from '@nestjs/config';

const DEFAULT_PORT = 3001;
const DEFAULT_BODY_LIMIT = '1mb';

export function parseBooleanEnvironmentValue(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  return typeof value === 'string' && value.toLowerCase() === 'true';
}

class EnvironmentVariables {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV: string = 'development';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  PORT: number = DEFAULT_PORT;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  FRONTEND_URL!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^postgres(?:ql)?:\/\//, {
    message: 'DATABASE_URL must be a PostgreSQL connection URL',
  })
  DATABASE_URL!: string;

  @Transform(({ value }: { value: unknown }) =>
    parseBooleanEnvironmentValue(value),
  )
  @IsBoolean()
  DB_SSL: boolean = false;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  SUPABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_SERVICE_ROLE_KEY!: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_STORAGE_BUCKET!: string;

  @IsOptional()
  @IsString()
  TRANSLATION_PROVIDER?: string;

  @IsOptional()
  @IsString()
  TRANSLATION_API_KEY?: string;
}

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  const validatedEnvironment = plainToInstance(
    EnvironmentVariables,
    {
      ...environment,
      NODE_ENV: environment.NODE_ENV ?? 'development',
      PORT: environment.PORT ?? DEFAULT_PORT,
      DB_SSL: environment.DB_SSL ?? false,
    },
    {
      enableImplicitConversion: false,
    },
  );

  const validationErrors = validateSync(validatedEnvironment, {
    skipMissingProperties: false,
  });

  if (validationErrors.length > 0) {
    const messages = validationErrors.flatMap((validationError) =>
      Object.values(validationError.constraints ?? {}),
    );

    throw new Error(`Environment validation failed: ${messages.join('; ')}`);
  }

  return {
    ...environment,
    ...validatedEnvironment,
  };
}

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  frontendUrl: process.env.FRONTEND_URL,
  bodyLimit: DEFAULT_BODY_LIMIT,
}));
