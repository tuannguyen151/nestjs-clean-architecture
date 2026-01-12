import { Module } from '@nestjs/common'
import {
  JwtModule as JwtBaseModule,
  JwtService as JwtBaseService,
} from '@nestjs/jwt'

import { IJwtService } from '@domain/services/jwt.interface'

import { EnvironmentConfigModule } from '@infrastructure/config/environment/environment-config.module'

import { JwtService } from './jwt.service'

@Module({
  imports: [JwtBaseModule.register({}), EnvironmentConfigModule],
  providers: [
    JwtBaseService,
    {
      provide: IJwtService,
      useClass: JwtService,
    },
  ],
  exports: [IJwtService],
})
export class JwtModule {}
