import { Module } from '@nestjs/common'

import { IBcryptService } from '@domain/services/bcrypt.interface'

import { BcryptService } from './bcrypt.service'

@Module({
  providers: [
    {
      provide: IBcryptService,
      useClass: BcryptService,
    },
  ],
  exports: [IBcryptService],
})
export class BcryptModule {}
