import { DataSource } from "typeorm";
import { config } from 'dotenv';
import { User } from './src/users/entities';
import { ToggleFeature } from './src/toggle-features/entities';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, ToggleFeature],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});