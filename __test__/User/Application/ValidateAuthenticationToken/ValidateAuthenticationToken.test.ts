import { beforeEach, describe, expect, it } from '@jest/globals'
import { mock } from 'jest-mock-extended'
import { AuthenticationTokenService } from '~/modules/User/Domain/AuthenticationTokenService.ts'
import {
  ValidateAuthenticationToken
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationToken.ts'
import { AuthenticationToken } from '~/modules/User/Domain/AuthenticationToken.ts'
import {
  ValidateAuthenticationTokenApplicationError
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationTokenApplicationError.ts'

describe('ValidateAuthenticationToken', () => {
  const mockedAuthenticationTokenService = mock<AuthenticationTokenService>()

  const buildUseCase = () => {
    return new ValidateAuthenticationToken(mockedAuthenticationTokenService)
  }

  describe('happy path', () => {
    beforeEach(() => {
      mockedAuthenticationTokenService.verify.mockResolvedValue(new AuthenticationToken(
        'test_user_id',
        'Test Name',
        'test_username',
        'test_role',
        16862892,
        16862992,
        'test_issuer',
        'test_token_id'
      ))
    })

    it('should call services correctly', async () => {
      const useCase = buildUseCase()

      await useCase.validate('test_token')

      expect(mockedAuthenticationTokenService.verify).toHaveBeenCalledWith('test_token')
    })

    it('should return correct result', async () => {
      const useCase = buildUseCase()

      const result = await useCase.validate('test_token')

      expect(result).toStrictEqual({
        success: true,
        value: {
          name: 'Test Name',
          id: 'test_user_id',
          username: 'test_username',
          role: 'test_role',
        },
      })
    })
  })

  describe('when there are errors', () => {
    it('should return error if cannot verify token', async () => {
      mockedAuthenticationTokenService.verify.mockRejectedValue(new Error('Unexpected error'))

      const useCase = buildUseCase()

      const result = await useCase.validate('invalid_token')

      expect(result).toStrictEqual({
        success: false,
        error: ValidateAuthenticationTokenApplicationError.invalidToken(),
      })
    })
  })
})
