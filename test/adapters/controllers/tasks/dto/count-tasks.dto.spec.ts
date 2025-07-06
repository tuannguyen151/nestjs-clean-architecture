import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

import { TaskStatusEnum } from '@domain/entities/task.entity'
import { TaskPriorityEnum } from '@domain/enums/task-priority.enum'

import { CountTasksDto } from '@adapters/controllers/tasks/dto/count-tasks.dto'

describe('CountTasksDto', () => {
  let dto = new CountTasksDto()

  beforeEach(() => {
    dto = new CountTasksDto()
  })

  it('should be valid when status is not provided', async () => {
    const validationErrors = await validate(dto)
    expect(validationErrors.length).toEqual(0)
  })

  it('should be valid when status is a valid TaskStatusEnum value', async () => {
    dto.status = TaskStatusEnum.Completed
    const validationErrors = await validate(dto)
    expect(validationErrors.length).toEqual(0)
  })

  it('should be invalid when status is not a valid TaskStatusEnum value', async () => {
    dto.status = 123 as TaskStatusEnum
    const validationErrors = await validate(dto)
    expect(validationErrors.length).toBeGreaterThan(0)
  })

  // Priority filtering validation tests
  it('should be valid when priority is not provided', async () => {
    dto.priority = undefined
    const validationErrors = await validate(dto)
    expect(validationErrors.length).toEqual(0)
  })

  it('should be valid when priority is a single valid value', async () => {
    dto.priority = TaskPriorityEnum.Medium
    const validationErrors = await validate(dto)
    expect(validationErrors.length).toEqual(0)
  })

  it('should be valid when priority is an array of valid values', async () => {
    dto.priority = [TaskPriorityEnum.Low, TaskPriorityEnum.High]
    const validationErrors = await validate(dto)
    expect(validationErrors.length).toEqual(0)
  })

  describe('Transform', () => {
    it('should transform string to number before validation for status', async () => {
      const dtoTransform = plainToClass(CountTasksDto, {
        ...dto,
        status: TaskStatusEnum.Completed.toString(),
      })
      const validationErrors = await validate(dtoTransform)
      expect(validationErrors.length).toEqual(0)
      expect(typeof dtoTransform.status).toBe('number')
      expect(dtoTransform.status).toEqual(TaskStatusEnum.Completed)
    })

    it('should transform single priority value from string to number', async () => {
      const dtoTransform = plainToClass(CountTasksDto, {
        ...dto,
        priority: TaskPriorityEnum.Medium.toString(),
      })
      const validationErrors = await validate(dtoTransform)
      expect(validationErrors.length).toEqual(0)
      expect(typeof dtoTransform.priority).toBe('number')
      expect(dtoTransform.priority).toEqual(TaskPriorityEnum.Medium)
    })

    it('should transform comma-separated priority values to array', async () => {
      const dtoTransform = plainToClass(CountTasksDto, {
        ...dto,
        priority: `${TaskPriorityEnum.Low},${TaskPriorityEnum.High}`,
      })
      const validationErrors = await validate(dtoTransform)
      expect(validationErrors.length).toEqual(0)
      expect(Array.isArray(dtoTransform.priority)).toBe(true)
      expect(dtoTransform.priority).toEqual([
        TaskPriorityEnum.Low,
        TaskPriorityEnum.High,
      ])
    })

    it('should throw BadRequestException for invalid priority value', () => {
      expect(() => {
        plainToClass(CountTasksDto, {
          ...dto,
          priority: '999',
        })
      }).toThrow()
    })

    it('should handle empty string priority as undefined', async () => {
      const dtoTransform = plainToClass(CountTasksDto, {
        ...dto,
        priority: '',
      })
      const validationErrors = await validate(dtoTransform)
      expect(validationErrors.length).toEqual(0)
      expect(dtoTransform.priority).toBeUndefined()
    })
  })
})
