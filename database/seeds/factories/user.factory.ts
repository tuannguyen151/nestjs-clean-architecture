import { setSeederFactory } from 'typeorm-extension'

import { RoleEnum } from '@domain/entities/user.entity'

import { User } from '@infrastructure/databases/postgressql/entities/user.entity'

export default setSeederFactory(User, (faker) => {
  const user = new User()

  user.username = faker.internet.username().toLowerCase().slice(0, 50)
  user.role = RoleEnum.User

  return user
})
