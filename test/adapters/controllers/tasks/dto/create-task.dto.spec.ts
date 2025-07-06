import { validate } from 'class-validator'

import { TaskPriorityEnum } from '@domain/enums/task-priority.enum'

import { CreateTaskDto } from '@adapters/controllers/tasks/dto/create-task.dto'

describe('CreateTaskDto', () => {
  let dto = new CreateTaskDto()

  beforeEach(() => {
    dto = new CreateTaskDto()

    dto.title = 'Test title'
    dto.description = 'Test description'
    dto.dueDate = new Date().toISOString() as unknown as Date
  })

  it('should be valid when all fields are valid', async () => {
    const errors = await validate(dto)
    expect(errors.length).toEqual(0)
  })

  it('should fail when title is not provided', async () => {
    dto.title = ''
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should fail when title is not a string', async () => {
    dto.title = 123 as unknown as string
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should fail when title exceeds the maximum length', async () => {
    dto.title = 'a'.repeat(256)
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should fail when description is not a string', async () => {
    dto.description = 123 as unknown as string
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should fail when description exceeds the maximum length', async () => {
    dto.description = 'a'.repeat(20001)
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should be valid when description is not provided', async () => {
    dto.description = undefined
    const errors = await validate(dto)
    expect(errors.length).toEqual(0)
  })

  it('should fail when dueDate is not a valid date string', async () => {
    dto.dueDate = 'invalid date' as unknown as Date
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should be valid when dueDate is not provided', async () => {
    dto.dueDate = undefined
    const errors = await validate(dto)
    expect(errors.length).toEqual(0)
  })

  // Priority validation tests
  it('should be valid when priority is not provided', async () => {
    dto.priority = undefined
    const errors = await validate(dto)
    expect(errors.length).toEqual(0)
  })

  it('should be valid when priority is Low', async () => {
    dto.priority = TaskPriorityEnum.Low
    const errors = await validate(dto)
    expect(errors.length).toEqual(0)
  })

  it('should be valid when priority is Medium', async () => {
    dto.priority = TaskPriorityEnum.Medium
    const errors = await validate(dto)
    expect(errors.length).toEqual(0)
  })

  it('should be valid when priority is High', async () => {
    dto.priority = TaskPriorityEnum.High
    const errors = await validate(dto)
    expect(errors.length).toEqual(0)
  })

  it('should be valid when priority is Urgent', async () => {
    dto.priority = TaskPriorityEnum.Urgent
    const errors = await validate(dto)
    expect(errors.length).toEqual(0)
  })

  it('should fail when priority is not a valid enum value', async () => {
    dto.priority = 999 as TaskPriorityEnum
    const errors = await validate(dto)
    expect(errors.length).toBeGreaterThan(0)
  })
})
