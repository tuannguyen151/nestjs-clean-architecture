import { UserEntity } from '@domain/entities/user.entity'

export const USER_REPOSITORY = 'USER_REPOSITORY_INTERFACE'
export interface IUserRepository {
  getUserByUsername(username: string): Promise<UserEntity | null>
  getUserById(id: number): Promise<UserEntity | null>
  updateLastLogin(id: number): Promise<void>
}
