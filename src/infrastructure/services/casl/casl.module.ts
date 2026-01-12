import { Module } from '@nestjs/common'

import { IAbilityFactory } from '@domain/services/ability.interface'

import { CaslAbilityFactory } from './casl-ability.factory'

@Module({
  providers: [
    {
      provide: IAbilityFactory,
      useClass: CaslAbilityFactory,
    },
  ],
  exports: [IAbilityFactory],
})
export class CaslModule {}
