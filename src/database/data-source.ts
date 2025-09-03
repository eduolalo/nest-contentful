import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseResolver } from '@config/database.config';

dotenv.config();

const config = DatabaseResolver();
export default new DataSource(config as DataSourceOptions);
