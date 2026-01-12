import { Module } from '@nestjs/common'

import { IException } from '@domain/exceptions/exceptions.interface'

import { ExceptionsService } from './exceptions.service'

@Module({
  providers: [
    ExceptionsService,
    {
      provide: IException,
      useClass: ExceptionsService,
    },
  ],
  exports: [IException, ExceptionsService],
})
export class ExceptionsModule {}
