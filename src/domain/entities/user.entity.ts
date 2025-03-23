export class UserEntity {
  public readonly id!: number
  public username!: string
  password!: string
  public lastLogin?: Date
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}
