// env的类型需要经过zod验证
import process from 'node:process';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
dotenv.config({ path: '.env', override: true });
const envSchema = z.object({
    DB_FILE_NAME: z.string(),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error('[ERROR] Invalid environment variables:', JSON.stringify(envParse.error.format(), null, 4));
  process.exit(1);
}
export const env = envParse.data;