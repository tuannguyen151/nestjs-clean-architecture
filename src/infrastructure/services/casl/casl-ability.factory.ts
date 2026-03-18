import { Injectable } from '@nestjs/common'

import {
  AbilityBuilder,
  type MongoAbility,
  createMongoAbility,
} from '@casl/ability'

import { RoleEnum, UserEntity } from '@domain/entities/user.entity'
import {
  IAbilityFactory,
  IPolicyHandler,
  TAction,
  TSubject,
} from '@domain/services/ability.interface'

export type TAppAbility = MongoAbility<[TAction, TSubject]>

@Injectable()
export class CaslAbilityFactory implements IAbilityFactory<TAppAbility> {
  createForUser(user: UserEntity): TAppAbility {
    const { can, build } = new AbilityBuilder<TAppAbility>(createMongoAbility)

    if (user.role === RoleEnum.Admin) {
      can('manage', 'all')
    } else {
      // Regular user can read/create/update Tasks.
      // Ownership (userId filtering) is enforced at the use-case/repository layer.
      can('read', 'Task')
      can(['create', 'update'], 'Task')
    }

    return build()
  }

  can(
    ability: TAppAbility,
    { action, subject, field }: IPolicyHandler,
  ): boolean {
    return ability.can(action, subject, field)
  }
}
