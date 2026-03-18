import type {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator'
import { ValidatorConstraint, registerDecorator } from 'class-validator'

import { TaskPriorityEnum } from '@domain/entities/task.entity'

const VALID_PRIORITIES = Object.values(TaskPriorityEnum).filter(
  (v): v is number => typeof v === 'number',
)

@ValidatorConstraint({ name: 'isValidPriorityList', async: false })
class IsValidPriorityListConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === undefined || value === null) return true
    const items = Array.isArray(value) ? value : [value]
    return items.every(
      (v) => typeof v === 'number' && VALID_PRIORITIES.includes(v),
    )
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} contains invalid priority value. Valid values are: ${VALID_PRIORITIES.join(', ')}`
  }
}

export function IsValidPriorityList() {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: IsValidPriorityListConstraint,
    })
  }
}

export function parsePriorityList(
  value?: string,
): TaskPriorityEnum | TaskPriorityEnum[] | undefined {
  if (!value) return undefined
  const values = value
    .toString()
    .split(',')
    .map((v) => Number.parseInt(v.trim(), 10))
  return values.length === 1 ? values[0] : values
}
