import { ValidationPipe, VersioningType } from '@nestjs/common'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { Test } from '@nestjs/testing'

import cookieParser from 'cookie-parser'

import { AllExceptionFilter } from '@infrastructure/common/filter/exception.filter'
import { LoggingInterceptor } from '@infrastructure/common/interceptors/logger.interceptor'
import { ResponseInterceptor } from '@infrastructure/common/interceptors/response.interceptor'
import { ValidationPipe as CustomValidationPipe } from '@infrastructure/common/pipes/validation.pipe'
import { LoggerService } from '@infrastructure/logger/logger.service'

import { AppModule } from '../../../src/app.module'

export async function createE2EApp(): Promise<NestExpressApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication<NestExpressApplication>()

  app.use(cookieParser())
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()))
  app.useGlobalPipes(new CustomValidationPipe())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()))
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'api/v',
  })

  await app.init()
  return app
}
