import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // OpenAPI 文档
  const config = new DocumentBuilder()
    .setTitle('智能药品柜服务')
    .setDescription('服务开发技术智能药品柜接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8080);
  console.log('OpenAPI doc: http://127.0.0.1:8080/api');
}

bootstrap();
