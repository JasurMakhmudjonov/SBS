

import { registerAs } from '@nestjs/config';

interface R2ConfigOptions {
  bucket: string;
  accessKey: string;
  secretAccessKey: string;
  endpoint: string;
}

export const r2Config = registerAs<R2ConfigOptions>(
  'r2',
  (): R2ConfigOptions => ({
    bucket: process.env.R2_BUCKET,
    accessKey: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
    endpoint: process.env.R2_ENDPOINT,
  }),
);
