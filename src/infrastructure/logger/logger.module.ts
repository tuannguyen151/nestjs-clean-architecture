import { Module } from '@nestjs/common'

import { ILogger } from '@domain/logger/logger.interface'

import { LoggerService } from './logger.service'

@Module({
  providers: [
    LoggerService,
    {
      provide: ILogger,
      useExisting: LoggerService,
    },
  ],
  exports: [LoggerService, ILogger],
})
export class LoggerModule {}
