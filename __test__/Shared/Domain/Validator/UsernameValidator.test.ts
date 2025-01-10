import { describe, expect, it } from '@jest/globals'
import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'

describe('UsernameValidator', () => {
  it('should return true if username is valid', () => {
    const validUsername = 'valid_username'
    const validation = new UsernameValidator().validate(validUsername)

    expect(validation).toBe(true)
  })

  it('should return false if username is not valid due to length', () => {
    const invalidUsername = 'abc'
    const validation = new UsernameValidator().validate(invalidUsername)

    expect(validation).toBe(false)
  })

  it('should return false if username is not valid due to invalid character', () => {
    const invalidUsername = 'abc/'
    const validation = new UsernameValidator().validate(invalidUsername)

    expect(validation).toBe(false)
  })
})
