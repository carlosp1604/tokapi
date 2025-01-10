import { describe, expect, it } from '@jest/globals'
import { EmailValidator } from '~/modules/Shared/Domain/Validator/EmailValidator.ts'

describe('EmailValidator', () => {
  it('should return true if emails is valid', () => {
    const validEmail = 'valid_email@email.com'
    const validation = new EmailValidator().validate(validEmail)

    expect(validation).toBe(true)
  })

  it('should return false if email is not valid due to invalid domain', () => {
    const invalidEmail = 'invalid_email@invalid-domain.d'
    const validation = new EmailValidator().validate(invalidEmail)

    expect(validation).toBe(false)
  })

  it('should return false if email is not valid due to invalid username', () => {
    const invalidEmail = 'a a@email.com'
    const validation = new EmailValidator().validate(invalidEmail)

    expect(validation).toBe(false)
  })
})
