import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import type { Configuration } from './config/configuration';
import type { ServerConfig } from './config/server.config';

function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('智能药品柜服务')
    .setDescription('服务开发技术智能药品柜接口文档')
    .setVersion('1.0')
    .build();
  return SwaggerModule.createDocument(app, config);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Configuration>>(ConfigService);
  const { host, port, openApiPath } = configService.get<ServerConfig>('server');

  const openApiDoc = createOpenApiDocument(app);
  SwaggerModule.setup(openApiPath, app, openApiDoc);
  await app.listen(port);
  Logger.log(`App is running at http://${host}:${port}`);
  Logger.log(
    `OpenAPI Document is running at http://${host}:${port}${openApiPath}`,
  );
}

bootstrap();
