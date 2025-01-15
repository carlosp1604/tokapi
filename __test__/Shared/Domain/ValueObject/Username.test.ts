import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockReset } from 'jest-mock-extended'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'
import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'
import { Username } from '~/modules/Shared/Domain/ValueObject/Username.ts'

jest.mock('~/modules/Shared/Domain/Validator/UsernameValidator.ts')

describe('Username', () => {
  const mockedUsernameValidator = jest.mocked(UsernameValidator)

  beforeEach(() => {
    mockReset(mockedUsernameValidator)
  })

  it('not throw error if username value object is built correctly', () => {
    mockedUsernameValidator.prototype.validate.mockReturnValue(true)

    expect(() => Username.from('valid_username')).not.toThrow()
  })

  it('throw error if username value is not valid', async () => {
    mockedUsernameValidator.prototype.validate.mockReturnValue(false)

    const action = async () => {
      Username.from('invalid username')
    }

    await expect(action)
      .rejects
      .toMatchObject({
        id: ValueObjectDomainException.invalidUsername('invalid username').id,
        message: ValueObjectDomainException.invalidUsername('invalid username').message,
      })
  })
})
