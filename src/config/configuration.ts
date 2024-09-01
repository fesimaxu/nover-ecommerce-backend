import * as dotenv from 'dotenv';
import * as path from 'path';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const dotenv_path = path.resolve(process.cwd(), '.env');
dotenv.config({ path: dotenv_path });

export const configuration = () => ({
  core: {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
  },
  logging: {
    format: winston.format.uncolorize(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
    ],
  },
});
