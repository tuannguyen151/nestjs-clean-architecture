import { type UserEntity } from '@domain/entities/user.entity'

/**
 * Available actions that can be performed on resources
 */
export type TAction = 'manage' | 'create' | 'read' | 'update' | 'delete'

/**
 * Available subjects (resources) in the system
 */
export type TSubject = 'all' | 'Task'

export interface IPolicyHandler {
  action: TAction
  subject: TSubject
  field?: string
}

export const IAbilityFactory = Symbol('IAbilityFactory')
export interface IAbilityFactory<TAbility = unknown> {
  createForUser(user: UserEntity): TAbility
  can(ability: TAbility, policyHandler: IPolicyHandler): boolean
}
