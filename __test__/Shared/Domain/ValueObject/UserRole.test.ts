import { describe, it, expect } from '@jest/globals'
import { UserRole } from '~/modules/Shared/Domain/ValueObject/UserRole.ts'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'

describe('UserRole', () => {
  const validInput: string[] = [
    'admin',
    'user',
    'moderator',
    'verified',
  ]

  const invalidInput: string[] = [
    'supreme admin',
    'mid user',
    'moderator2',
    'user verified',
  ]

  it.each([validInput])('not throw when user role is a valid role', (role) => {
    expect(() => UserRole.from(role)).not.toThrow()
  })

  it.each([invalidInput])('throw when user role is not a valid role', async (role) => {
    const action = async () => {
      UserRole.from(role)
    }

    await expect(action)
      .rejects
      .toMatchObject({
        id: ValueObjectDomainException.invalidUserRole(role).id,
        message: ValueObjectDomainException.invalidUserRole(role).message,
      })
  })
})
