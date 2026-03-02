import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IUserRepository } from '@domain/repositories/user.repository.interface'

import { LoginUseCase } from '@use-cases/auth/login.use-case'
import { RefreshUseCase } from '@use-cases/auth/refresh.use-case'

import { AuthController } from '@adapters/controllers/auth/auth.controller'

import { JwtRefreshStrategy } from '@infrastructure/common/strategies/jwt-refresh.strategy'
import { JwtStrategy } from '@infrastructure/common/strategies/jwt.strategy'
import { EnvironmentConfigModule } from '@infrastructure/config/environment/environment-config.module'
import { User } from '@infrastructure/databases/postgresql/entities/user.entity'
import { UserRepository } from '@infrastructure/databases/postgresql/repositories/user.repository'
import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module'
import { LoggerModule } from '@infrastructure/logger/logger.module'
import { BcryptModule } from '@infrastructure/services/bcrypt/bcrypt.module'
import { JwtModule } from '@infrastructure/services/jwt/jwt.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    EnvironmentConfigModule,
    LoggerModule,
    JwtModule,
    BcryptModule,
    ExceptionsModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },

    JwtStrategy,
    JwtRefreshStrategy,
    LoginUseCase,
    RefreshUseCase,
  ],
})
export class AuthModule {}
