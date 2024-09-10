import { registerAs } from '@nestjs/config';

interface IDbConfig {
  url: string;
}

export const databaseConfig = registerAs<IDbConfig>(
  'database',
  (): IDbConfig => ({
    url: process.env.DATABASE_URL,
  }),
);
