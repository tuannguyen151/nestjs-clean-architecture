import { RoleEnum } from './role.entity'

export class UserEntity {
  public readonly id!: number
  public username!: string
  password!: string
  public role!: RoleEnum
  public lastLogin?: Date
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
