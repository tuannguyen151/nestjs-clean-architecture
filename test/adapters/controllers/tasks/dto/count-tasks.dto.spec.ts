import { validate } from 'class-validator'
import { TaskStatusEnum } from 'src/domain/entities/task.entity'
import { CountTasksDto } from 'src/adapters/controllers/tasks/dto/count-tasks.dto'
import { plainToClass } from 'class-transformer'

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
  })
})
