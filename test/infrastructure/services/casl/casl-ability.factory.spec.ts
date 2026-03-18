import { Test, TestingModule } from '@nestjs/testing'

import { createUserStub } from 'test/stubs/user.stub'

import { RoleEnum } from '@domain/entities/user.entity'

import { CaslAbilityFactory } from '@infrastructure/services/casl/casl-ability.factory'

describe('CaslAbilityFactory', () => {
  let factory: CaslAbilityFactory

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaslAbilityFactory],
    }).compile()

    factory = module.get<CaslAbilityFactory>(CaslAbilityFactory)
  })

  it('should be defined', () => {
    expect(factory).toBeDefined()
  })

  describe('Admin user', () => {
    it('should allow manage all', () => {
      const ability = factory.createForUser(
        createUserStub({ role: RoleEnum.Admin }),
      )

      expect(factory.can(ability, { action: 'manage', subject: 'all' })).toBe(
        true,
      )
    })

    it('should allow read Task', () => {
      const ability = factory.createForUser(
        createUserStub({ role: RoleEnum.Admin }),
      )

      expect(factory.can(ability, { action: 'read', subject: 'Task' })).toBe(
        true,
      )
    })

    it('should allow create Task', () => {
      const ability = factory.createForUser(
        createUserStub({ role: RoleEnum.Admin }),
      )

      expect(factory.can(ability, { action: 'create', subject: 'Task' })).toBe(
        true,
      )
    })

    it('should allow update Task', () => {
      const ability = factory.createForUser(
        createUserStub({ role: RoleEnum.Admin }),
      )

      expect(factory.can(ability, { action: 'update', subject: 'Task' })).toBe(
        true,
      )
    })

    it('should allow delete Task', () => {
      const ability = factory.createForUser(
        createUserStub({ role: RoleEnum.Admin }),
      )

      expect(factory.can(ability, { action: 'delete', subject: 'Task' })).toBe(
        true,
      )
    })
  })

  describe('Regular user', () => {
    it('should allow read Task', () => {
      const ability = factory.createForUser(createUserStub())

      expect(factory.can(ability, { action: 'read', subject: 'Task' })).toBe(
        true,
      )
    })

    it('should allow create Task', () => {
      const ability = factory.createForUser(createUserStub())

      expect(factory.can(ability, { action: 'create', subject: 'Task' })).toBe(
        true,
      )
    })

    it('should allow update Task', () => {
      const ability = factory.createForUser(createUserStub())

      expect(factory.can(ability, { action: 'update', subject: 'Task' })).toBe(
        true,
      )
    })

    it('should NOT allow delete Task', () => {
      const ability = factory.createForUser(createUserStub())

      expect(factory.can(ability, { action: 'delete', subject: 'Task' })).toBe(
        false,
      )
    })

    it('should NOT allow manage all', () => {
      const ability = factory.createForUser(createUserStub())

      expect(factory.can(ability, { action: 'manage', subject: 'all' })).toBe(
        false,
      )
    })
  })
})
