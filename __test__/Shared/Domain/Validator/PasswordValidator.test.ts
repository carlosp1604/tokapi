import { describe, expect, it } from '@jest/globals'
import { PasswordValidator } from '~/modules/Shared/Domain/Validator/PasswordValidator.ts'

describe('PasswordValidator', () => {
  it('should return true if password is valid', () => {
    const validPassword = 'validPassword1*'
    const validation = new PasswordValidator().validate(validPassword)

    expect(validation).toBe(true)
  })

  it('should return false if password is not valid due to insufficient length', () => {
    const invalidPassword = 'pW0d*'
    const validation = new PasswordValidator().validate(invalidPassword)

    expect(validation).toBe(false)
  })

  it('should return false if password is not valid due to excessive length', () => {
    const invalidPassword = 'Passwordwithmorecharactersthanweshouldallowsoitmakestesttofail123*'
    const validation = new PasswordValidator().validate(invalidPassword)

    expect(validation).toBe(false)
  })

  it('should return false if password is not valid due to missing special character', () => {
    const invalidPassword = 'Passw0rd'
    const validation = new PasswordValidator().validate(invalidPassword)

    expect(validation).toBe(false)
  })

  it('should return false if password is not valid due to missing uppercase character', () => {
    const invalidPassword = 'passw0rd*'
    const validation = new PasswordValidator().validate(invalidPassword)

    expect(validation).toBe(false)
  })

  it('should return false if password is not valid due to missing numeric character', () => {
    const invalidPassword = 'Password*'
    const validation = new PasswordValidator().validate(invalidPassword)

    expect(validation).toBe(false)
  })

  it('should return false if password is not valid due to missing lowercase character', () => {
    const invalidPassword = 'P4SSWORD*'
    const validation = new PasswordValidator().validate(invalidPassword)

    expect(validation).toBe(false)
  })
})
