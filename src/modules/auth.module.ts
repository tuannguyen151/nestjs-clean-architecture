import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { USER_REPOSITORY } from '@domain/repositories/user.repository.interface'

import { LoginUseCase } from '@use-cases/auth/login.use-case'
import { RefreshUseCase } from '@use-cases/auth/refresh.use-case'

import { AuthController } from '@adapters/controllers/auth/auth.controller'

import { EnvironmentConfigModule } from '@infrastructure/config/environment/environment-config.module'
import { User } from '@infrastructure/databases/postgressql/entities/user.entity'
import { UserRepository } from '@infrastructure/databases/postgressql/repositories/user.repository'
import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module'
import { BcryptModule } from '@infrastructure/services/bcrypt/bcrypt.module'
import { JwtModule } from '@infrastructure/services/jwt/jwt.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EnvironmentConfigModule,
    JwtModule,
    BcryptModule,
    ExceptionsModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },

    LoginUseCase,
    RefreshUseCase,
  ],
})
export class AuthModule {}
