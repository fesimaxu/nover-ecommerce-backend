import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions, LoggerOptions } from 'typeorm';
import * as Entities from '../dal/index';

const dotenv_path = path.resolve(process.cwd(), `.env`);
dotenv.config({ path: dotenv_path });

const sslOptions =
  process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: process.env.TYPEORM_LOGGING as LoggerOptions,
  ssl: sslOptions,
  entities: Object.values(Entities),
  synchronize: process.env.NODE_ENV !== 'production',
  migrations: [path.join(__dirname, '../migrations/**/*.ts')],
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
