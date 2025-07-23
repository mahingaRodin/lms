require('dotenv/config');
const path = require('path');
const { DataSource } = require('typeorm');

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: false,
  logging: true,
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
});

module.exports = dataSource;
