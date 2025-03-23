import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { IUserRepository } from '@domain/repositories/user.repository.interface'

import { User } from '../entities/user.entity'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}

  async getUserByUsername(username: string) {
    return await this.userEntityRepository.findOne({
      where: {
        username,
      },
    })
  }

  async getUserById(id: number) {
    return await this.userEntityRepository.findOne({
      where: {
        id,
      },
    })
  }

  async updateLastLogin(id: number) {
    await this.userEntityRepository.update(
      {
        id,
      },
      { lastLogin: () => 'CURRENT_TIMESTAMP' },
    )
  }
}
