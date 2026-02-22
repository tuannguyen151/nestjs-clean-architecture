import { setSeederFactory } from 'typeorm-extension'

import { TaskPriorityEnum, TaskStatusEnum } from '@domain/entities/task.entity'

import { Task } from '@infrastructure/databases/postgressql/entities/task.entity'

export default setSeederFactory(Task, (faker) => {
  const task = new Task()

  task.title = faker.lorem.sentence({ min: 3, max: 8 }).slice(0, 255)
  task.description = faker.lorem.paragraph({ min: 1, max: 3 })
  task.status = faker.helpers.enumValue(TaskStatusEnum)
  task.priority = faker.helpers.enumValue(TaskPriorityEnum)
  task.dueDate = faker.date.future()

  return task
})
