import { describe, expect, it } from '@jest/globals'
import { DescriptionValidator } from '~/modules/Shared/Domain/Validator/DescriptionValidator.ts'

describe('DescriptionValidator', () => {
  it('should return true if description is valid', () => {
    const validDescription = 'Valid Description'
    const validation = new DescriptionValidator().validate(validDescription)

    expect(validation).toBe(true)
  })

  it('should return false if description is not valid due to insufficient length', () => {
    const invalidDescription = ''
    const validation = new DescriptionValidator().validate(invalidDescription)

    expect(validation).toBe(false)
  })

  it('should return false if description is not valid due to excessive length', () => {
    const invalidDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
    ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
    fugiat nulla pariatur.`

    const validation = new DescriptionValidator().validate(invalidDescription)

    expect(validation).toBe(false)
  })
})
