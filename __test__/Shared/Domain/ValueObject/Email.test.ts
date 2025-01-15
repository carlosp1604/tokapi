import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockReset } from 'jest-mock-extended'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'
import { EmailValidator } from '~/modules/Shared/Domain/Validator/EmailValidator.ts'
import { Email } from '~/modules/Shared/Domain/ValueObject/Email.ts'

jest.mock('~/modules/Shared/Domain/Validator/EmailValidator.ts')

describe('Email', () => {
  const mockedEmailValidator = jest.mocked(EmailValidator)

  beforeEach(() => {
    mockReset(mockedEmailValidator)
  })

  it('not throw error if email value object is built correctly', () => {
    mockedEmailValidator.prototype.validate.mockReturnValue(true)

    expect(() => Email.from('email@validemail.com')).not.toThrow()
  })

  it('throw error if email value is not valid', async () => {
    mockedEmailValidator.prototype.validate.mockReturnValue(false)

    const action = async () => {
      Email.from('invalid email')
    }

    await expect(action)
      .rejects
      .toMatchObject({
        id: ValueObjectDomainException.invalidEmail('invalid email').id,
        message: ValueObjectDomainException.invalidEmail('invalid email').message,
      })
  })
})
