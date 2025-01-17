import { beforeEach, describe, expect, it } from '@jest/globals'
import { mock } from 'jest-mock-extended'
import { AuthenticationTokenService } from '~/modules/User/Domain/AuthenticationTokenService.ts'
import {
  CreateAuthenticationToken
} from '~/modules/User/Application/CreateAuthenticationToken/CreateAuthenticationToken.ts'
import { UserApplicationDto } from '~/modules/User/Application/Dtos/UserApplicationDto.ts'
import {
  CreateAuthenticationTokenApplicationError
} from '~/modules/User/Application/CreateAuthenticationToken/CreateAuthenticationTokenApplicationError.ts'

describe('CreateAuthenticationToken', () => {
  const mockedAuthenticationTokenService = mock<AuthenticationTokenService>()
  const expireSeconds = 6000
  const nowDate = new Date()

  const payload = {
    name: 'Test Name',
    id: 'test-id',
    role: 'test-role',
    username: 'test_username',
  }

  const userApplicationDto: UserApplicationDto = {
    id: 'test-id',
    username: 'test_username',
    name: 'Test Name',
    description: null,
    email: 'example@email.com',
    imageUrl: null,
    following: 0,
    followers: 0,
    viewsCount: 0,
    publicLikes: true,
    publicSaved: true,
    publicShared: true,
    publicProfile: true,
    role: 'test-role',
    createdAt: nowDate.toISOString(),
    updatedAt: nowDate.toISOString(),
  }

  const buildUseCase = () => {
    return new CreateAuthenticationToken(mockedAuthenticationTokenService, expireSeconds)
  }

  describe('happy path', () => {
    beforeEach(() => {
      mockedAuthenticationTokenService.generate.mockResolvedValue('expected-token')
    })

    it('should call services correctly', async () => {
      const useCase = buildUseCase()

      await useCase.create(userApplicationDto)

      expect(mockedAuthenticationTokenService.generate).toHaveBeenCalledWith(
        payload
      )
    })

    it('should return correct result', async () => {
      const useCase = buildUseCase()

      const result = await useCase.create(userApplicationDto)

      expect(result).toStrictEqual({
        success: true,
        value: {
          token: 'expected-token',
          type: 'JWT',
          expiresIn: expireSeconds,
        },
      })
    })
  })

  describe('when there are errors', () => {
    it('should return error if cannot generate token', async () => {
      mockedAuthenticationTokenService.generate.mockRejectedValue(new Error('Unexpected error'))

      const useCase = buildUseCase()

      const result = await useCase.create(userApplicationDto)

      expect(result).toStrictEqual({
        success: false,
        error: CreateAuthenticationTokenApplicationError.cannotGenerateToken('test-id'),
      })
    })
  })
})
