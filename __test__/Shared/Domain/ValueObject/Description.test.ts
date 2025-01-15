import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mockReset } from 'jest-mock-extended'
import { DescriptionValidator } from '~/modules/Shared/Domain/Validator/DescriptionValidator.ts'
import { Description } from '~/modules/Shared/Domain/ValueObject/Description.ts'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'

jest.mock('~/modules/Shared/Domain/Validator/DescriptionValidator.ts')

describe('Description', () => {
  const mockedDescriptionValidator = jest.mocked(DescriptionValidator)

  beforeEach(() => {
    mockReset(mockedDescriptionValidator)
  })

  it('not throw error if description value object is built correctly', () => {
    mockedDescriptionValidator.prototype.validate.mockReturnValue(true)

    expect(() => Description.from('valid description')).not.toThrow()
  })

  it('throw error if description value is not valid', async () => {
    mockedDescriptionValidator.prototype.validate.mockReturnValue(false)

    const action = async () => {
      Description.from('invalid description')
    }

    await expect(action)
      .rejects
      .toMatchObject({
        id: ValueObjectDomainException.invalidDescription('invalid description').id,
        message: ValueObjectDomainException.invalidDescription('invalid description').message,
      })
  })
})
