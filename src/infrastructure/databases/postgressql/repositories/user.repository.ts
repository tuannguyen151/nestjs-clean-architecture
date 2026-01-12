import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { UserEntity } from '@domain/entities/user.entity'
import { IUserRepository } from '@domain/repositories/user.repository.interface'

import { User } from '../entities/user.entity'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    })
    return user ? this.toEntity(user) : null
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    })
    return user ? this.toEntity(user) : null
  }

  async updateLastLogin(id: number) {
    await this.userRepository.update(
      {
        id,
      },
      { lastLogin: () => 'CURRENT_TIMESTAMP' },
    )
  }

  private toEntity(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.password,
      user.role,
      user.createdAt,
      user.updatedAt,
      user.lastLogin,
    )
  }
}
