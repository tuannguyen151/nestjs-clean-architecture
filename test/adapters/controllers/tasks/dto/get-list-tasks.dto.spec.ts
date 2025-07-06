import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

import { TaskStatusEnum } from '@domain/entities/task.entity'
import { TaskPriorityEnum } from '@domain/enums/task-priority.enum'

import { GetListTasksDto } from '@adapters/controllers/tasks/dto/get-list-tasks.dto'

describe('GetListTasksDto', () => {
  let dto: GetListTasksDto

  beforeEach(() => {
    dto = new GetListTasksDto()
  })

  it('should be valid when no properties are provided', async () => {
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

  it('should be valid when size is a positive number', async () => {
    dto.size = 10
    const validationErrors = await validate(dto)
    expect(validationErrors.length).toEqual(0)
  })

  it('should be invalid when size is a negative number', async () => {
    dto.size = -10
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
      const dtoTransform = plainToClass(GetListTasksDto, {
        ...dto,
        status: TaskStatusEnum.Completed.toString(),
      })
      const validationErrors = await validate(dtoTransform)
      expect(validationErrors.length).toEqual(0)
      expect(typeof dtoTransform.status).toBe('number')
      expect(dtoTransform.status).toEqual(TaskStatusEnum.Completed)
    })

    it('should transform string to number before validation for size', async () => {
      const dtoTransform = plainToClass(GetListTasksDto, {
        ...dto,
        size: '10',
      })
      const validationErrors = await validate(dtoTransform)
      expect(validationErrors.length).toEqual(0)
      expect(typeof dtoTransform.size).toBe('number')
      expect(dtoTransform.size).toEqual(10)
    })

    it('should transform single priority value from string to number', async () => {
      const dtoTransform = plainToClass(GetListTasksDto, {
        ...dto,
        priority: TaskPriorityEnum.Medium.toString(),
      })
      const validationErrors = await validate(dtoTransform)
      expect(validationErrors.length).toEqual(0)
      expect(typeof dtoTransform.priority).toBe('number')
      expect(dtoTransform.priority).toEqual(TaskPriorityEnum.Medium)
    })

    it('should transform comma-separated priority values to array', async () => {
      const dtoTransform = plainToClass(GetListTasksDto, {
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

    it('should handle spaces in comma-separated priority values', async () => {
      const dtoTransform = plainToClass(GetListTasksDto, {
        ...dto,
        priority: `${TaskPriorityEnum.Low}, ${TaskPriorityEnum.High}`,
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
        plainToClass(GetListTasksDto, {
          ...dto,
          priority: '999',
        })
      }).toThrow()
    })

    it('should throw BadRequestException for mixed valid and invalid priority values', () => {
      expect(() => {
        plainToClass(GetListTasksDto, {
          ...dto,
          priority: `${TaskPriorityEnum.Low},999`,
        })
      }).toThrow()
    })

    it('should handle empty string priority as undefined', async () => {
      const dtoTransform = plainToClass(GetListTasksDto, {
        ...dto,
        priority: '',
      })
      const validationErrors = await validate(dtoTransform)
      expect(validationErrors.length).toEqual(0)
      expect(dtoTransform.priority).toBeUndefined()
    })
  })
})
