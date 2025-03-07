import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Company } from './src/companies/entities/company.entity';
import { Subsidiary } from './src/subsidiary/entities/subsidiary.entity';
import { Listing } from './src/listings/entities/listing.entity';
import { Country } from './src/common/entities';
import { PlatformListings } from './src/platform-listing/entities/platform-listings.entity';
import { Step } from './src/step/entities/step.entity';
import { Permission } from './src/roles/entities';
import { Role } from './src/roles/entities/role.entity';
import { User } from './src/users/entities/user.entity';

config();

const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [Country, Company, Subsidiary, Listing, PlatformListings, Step, Permission, Role, User],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
});