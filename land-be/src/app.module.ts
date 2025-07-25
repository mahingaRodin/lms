import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LandRegistrationModule } from './land-registration/land-registration.module';
import { LandTransferModule } from './land-transfer/land-transfer.module';
import { TaxesModule } from './taxes/taxes.module';
import { ConflictResolutionModule } from './conflict-resolution/conflict-resolution.module';
import { ConstructionModule } from './construction/construction.module';
import { SettingsModule } from './settings/settings.module';
import { RedisModule } from './redis/redis.module';
import { NotificationService } from './notification/notification.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      extra: {
        installExtensions: true,
      },
    }),
    AuthModule,
    LandRegistrationModule,
    LandTransferModule,
    TaxesModule,
    ConflictResolutionModule,
    ConstructionModule,
    SettingsModule,
    RedisModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationService],
})
export class AppModule {}
