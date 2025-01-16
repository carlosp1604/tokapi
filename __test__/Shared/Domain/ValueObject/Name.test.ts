import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockReset } from 'jest-mock-extended'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'
import { NameValidator } from '~/modules/Shared/Domain/Validator/NameValidator.ts'
import { Name } from '~/modules/Shared/Domain/ValueObject/Name.ts'

jest.mock('~/modules/Shared/Domain/Validator/NameValidator.ts')

describe('Name', () => {
  const mockedNameValidator = jest.mocked(NameValidator)

  beforeEach(() => {
    mockReset(mockedNameValidator)
  })

  it('not throw error if name value object is built correctly', () => {
    mockedNameValidator.prototype.validate.mockReturnValue(true)

    expect(() => Name.from('valid name')).not.toThrow()
  })

  it('throw error if name value is not valid', async () => {
    mockedNameValidator.prototype.validate.mockReturnValue(false)

    const action = async () => {
      Name.from('invalid name')
    }

    await expect(action)
      .rejects
      .toMatchObject({
        id: ValueObjectDomainException.invalidName('invalid name').id,
        message: ValueObjectDomainException.invalidName('invalid name').message,
      })
  })
})
