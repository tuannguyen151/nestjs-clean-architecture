import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter'
import { LoggingInterceptor } from './infrastructure/common/interceptors/logger.interceptor'
import {
  ResponseFormat,
  ResponseInterceptor,
} from './infrastructure/common/interceptors/response.interceptor'
import { LoggerService } from './infrastructure/logger/logger.service'
import { ValidationPipe } from '@nestjs/common'
import { ValidationPipe as CustomValidationPipe } from './infrastructure/common/pipes/validation.pipe'

async function bootstrap() {
  const env = process.env.NODE_ENV
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()))

  // pipes
  app.useGlobalPipes(new CustomValidationPipe())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()))
  app.useGlobalInterceptors(new ResponseInterceptor())

  // base routing
  app.setGlobalPrefix('api/v1')

  // swagger config
  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true,
    })
    SwaggerModule.setup('api', app, document)
  }

  await app.listen(3000)
}

bootstrap()
