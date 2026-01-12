export enum TaskPriorityEnum {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
}

export enum TaskStatusEnum {
  Completed = 2,
  OnGoing = 3,
}

/**
 * Represents a task entity with properties and business rules.
 *
 * @remarks
 * - The `id`, `createdAt`, and `updatedAt` properties are readonly and cannot be changed after instantiation.
 * - The `status` property is private and can only be accessed or modified through methods, enforcing business rules.
 * - The `userId`, `title`, `priority`, `description`, and `dueDate` properties are mutable.
 *
 * @property id - Unique identifier for the task (readonly).
 * @property userId - Identifier of the user who owns the task.
 * @property title - Title of the task.
 * @property status - Current status of the task.
 * @property priority - Priority level of the task.
 * @property createdAt - Date when the task was created (readonly).
 * @property updatedAt - Date when the task was last updated (readonly).
 * @property description - Optional description of the task.
 * @property dueDate - Optional due date for the task.
 *
 * @method getStatus - Returns the current status of the task.
 * @method complete - Marks the task as completed if it is currently ongoing; otherwise, throws an error.
 */
export class TaskEntity {
  constructor(
    public readonly id: number, // Public but readonly - cannot be changed
    public userId: number, // Public and mutable - no business rule
    public title: string,
    private _status: TaskStatusEnum, // Private - has business rule
    public priority: TaskPriorityEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public description?: string,
    public dueDate?: Date,
  ) {}

  get status(): TaskStatusEnum {
    return this._status
  }

  /**
   * Marks the task as completed if its current status is `OnGoing`.
   *
   * @throws {Error} Throws an error if the task is not in the `OnGoing` status.
   */
  complete(): void {
    if (this.status !== TaskStatusEnum.OnGoing) {
      throw new Error('Only ongoing tasks can be marked as completed.')
    }

    this._status = TaskStatusEnum.Completed
  }
}
