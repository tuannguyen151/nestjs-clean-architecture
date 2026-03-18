import { RoleEnum, UserEntity } from '@domain/entities/user.entity'

export const createUserStub = (
  overrides: Partial<{ id: number; role: RoleEnum }> = {},
): UserEntity => {
  const now = new Date()
  return new UserEntity(
    overrides.id ?? 1,
    'user1',
    'hashed_password',
    overrides.role ?? RoleEnum.User,
    now,
    now,
  )
}
