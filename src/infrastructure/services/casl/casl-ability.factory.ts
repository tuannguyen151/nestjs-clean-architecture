import { Injectable } from '@nestjs/common'

import { AbilityBuilder, PureAbility } from '@casl/ability'

import { RoleEnum, UserEntity } from '@domain/entities/user.entity'
import {
  IAbilityFactory,
  IPolicyHandler,
} from '@domain/services/ability.interface'

type TAppAbility = PureAbility<
  [IPolicyHandler['action'], IPolicyHandler['subject']]
>

@Injectable()
export class CaslAbilityFactory implements IAbilityFactory<TAppAbility> {
  createForUser(user: UserEntity) {
    const { can, build } = new AbilityBuilder<TAppAbility>(PureAbility)

    if (user.role === RoleEnum.Admin) {
      // Admin can manage all resources
      can('manage', 'all')
    } else {
      // Regular user permissions
      can('read', 'Task', ['id'], {
        userId: user.id,
      })
      can(['create', 'update'], 'Task', {
        userId: user.id,
      })
    }

    return build({
      // TODO: handle conditions by https://casl.js.org/v6/en/advanced/ability-to-database-query
      conditionsMatcher: (conditions) => {
        // console.log(
        //   '🚀 ~ CaslAbilityFactory ~ createForUser ~ conditions:',
        //   conditions,
        // )

        return (object) => false
      },
      // TODO: handle fields by https://casl.js.org/v6/en/guide/restricting-fields. May be used DB query
      fieldMatcher: (fields) => {
        return (accessibleField) => fields.includes(accessibleField)
      },
    })
  }

  can(
    ability: TAppAbility,
    { action, subject, field }: IPolicyHandler,
  ): boolean {
    return ability.can(action, subject, field)
  }
}
