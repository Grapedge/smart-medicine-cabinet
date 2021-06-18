import {
  BadRequestException,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import type { Configuration } from './config/configuration';
import type { ServerConfig } from './config/server.config';

function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('智能药品柜服务')
    .setDescription(
      '服务开发技术智能药品柜接口文档，默认管理员账号: 13300001111，密码: admin',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .addTag('身份认证')
    .addTag('用户')
    .addTag('药品')
    .addTag('传感器')
    .addTag('药品柜')
    .build();
  return SwaggerModule.createDocument(app, config);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new BadRequestException(
          errors.map((error) => `${error.property} 字段输入不合法`).join('; '),
          '请求非法',
        ),
    }),
  );

  const configService = app.get<ConfigService<Configuration>>(ConfigService);
  const { port, openApiPath } = configService.get<ServerConfig>('server');

  const openApiDoc = createOpenApiDocument(app);
  SwaggerModule.setup(openApiPath, app, openApiDoc);
  await app.listen(port);
  Logger.log(`App is running at ${await app.getUrl()}`);
  Logger.log(
    `OpenAPI Document is running at ${await app.getUrl()}${openApiPath}`,
  );
}

bootstrap();
