import { describe, expect, it } from '@jest/globals'
import { NameValidator } from '~/modules/Shared/Domain/Validator/NameValidator.ts'

describe('NameValidator', () => {
  it('should return true if name is valid', () => {
    const validName = 'Valid Name'
    const validation = new NameValidator().validate(validName)

    expect(validation).toBe(true)
  })

  it('should return false if name is not valid due to insufficient length', () => {
    const invalidName = 'Nam'
    const validation = new NameValidator().validate(invalidName)

    expect(validation).toBe(false)
  })

  it('should return false if name is not valid due to excessive length', () => {
    const invalidName = 'This Name Should Make This Test To Fail Due To Excessive Length!!'
    const validation = new NameValidator().validate(invalidName)

    expect(validation).toBe(false)
  })
})
