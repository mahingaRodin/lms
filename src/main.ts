import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { typeOrmConfig } from './config/data-source';
import { DataSource } from "typeorm";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

    try {
      const dataSource = new DataSource(typeOrmConfig as any);
      await dataSource.initialize();
      console.log('✅ Database connection successful!');
      await dataSource.destroy();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
}
bootstrap();
