import { describe, it, expect } from '@jest/globals'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'
import { VerificationTokenType } from '~/modules/Shared/Domain/ValueObject/VerificationTokenType.ts'

describe('VerificationTokenType', () => {
  const validInput: string[] = [
    'create-account',
    'change-password',
  ]

  const invalidInput: string[] = [
    'change-profile',
    'create-media',
  ]

  it.each([validInput])('not throw when verification token type is a valid type', (type) => {
    expect(() => VerificationTokenType.from(type)).not.toThrow()
  })

  it.each([invalidInput])('throw when verification token type is not a valid type', async (type) => {
    const action = async () => {
      VerificationTokenType.from(type)
    }

    await expect(action)
      .rejects
      .toMatchObject({
        id: ValueObjectDomainException.invalidVerificationTokenType(type).id,
        message: ValueObjectDomainException.invalidVerificationTokenType(type).message,
      })
  })
})
