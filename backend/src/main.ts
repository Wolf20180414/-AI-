import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS
  app.enableCors();
  
  // 全局前缀
  app.setGlobalPrefix('api');
  
  // 启动端口
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 服务器运行在: http://localhost:${port}/api`);
}

bootstrap();