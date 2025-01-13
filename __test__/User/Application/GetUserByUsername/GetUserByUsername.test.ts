import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { mock, mockReset } from 'jest-mock-extended'
import { GetUserByUsername } from '~/modules/User/Application/GetUserByUsername/GetUserByUsername.ts'
import { User } from '~/modules/User/Domain/User.ts'
import {
  GetUserByUsernameApplicationError
} from '~/modules/User/Application/GetUserByUsername/GetUserByUsernameApplicationError.ts'
import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'
import { EmailValidator } from '~/modules/Shared/Domain/Validator/EmailValidator.ts'

jest.mock('~/modules/Shared/Domain/Validator/UsernameValidator.ts')
jest.mock('~/modules/Shared/Domain/Validator/EmailValidator.ts')

describe('GetUserByUsername', () => {
  const mockedUserRepository = mock<UserRepositoryInterface>()
  const mockedUsernameValidator = jest.mocked(UsernameValidator)
  const mockedEmailValidator = jest.mocked(EmailValidator)

  const nowDate = new Date()

  const buildUseCase = () => {
    return new GetUserByUsername(mockedUserRepository)
  }

  const buildUser = () => {
    return new User(
      'test-id',
      'Test Name',
      'Test Description',
      'test_username',
      'test@email.com',
      null,
      'user',
      0,
      0,
      0,
      true,
      true,
      true,
      true,
      'someHashedPassword',
      nowDate,
      nowDate,
      null
    )
  }

  beforeAll(() => {
    mockedEmailValidator.prototype.validate.mockReturnValue(true)
  })

  describe('happy path', () => {
    beforeEach(() => {
      mockReset(mockedUserRepository)
      mockedUsernameValidator.prototype.validate.mockReturnValue(true)
    })

    it('should call validator and repository correctly', async () => {
      mockedUserRepository.findByUsername.mockImplementationOnce(() => {
        return Promise.resolve(buildUser())
      })

      const useCase = buildUseCase()

      await useCase.get('test_username')

      expect(mockedUserRepository.findByUsername).toBeCalledTimes(1)
      expect(mockedUserRepository.findByUsername).toBeCalledWith('test_username')
    })

    it('should return correct data', async () => {
      mockedUserRepository.findByUsername.mockImplementationOnce(() => {
        return Promise.resolve(buildUser())
      })

      const useCase = buildUseCase()

      const response = await useCase.get('test_username')

      expect(response).toEqual({
        success: true,
        value: {
          id: 'test-id',
          username: 'test_username',
          name: 'Test Name',
          description: 'Test Description',
          email: 'test@email.com',
          imageUrl: null,
          following: 0,
          followers: 0,
          viewsCount: 0,
          publicLikes: true,
          publicSaved: true,
          publicShared: true,
          publicProfile: true,
          role: 'user',
          createdAt: nowDate.toISOString(),
          updatedAt: nowDate.toISOString(),
        },
      })
    })
  })

  describe('when errors', () => {
    beforeEach(() => {
      mockReset(mockedUserRepository)
      mockReset(mockedUsernameValidator)
    })

    it('should return error result if invalid username is provided', async () => {
      mockedUsernameValidator.prototype.validate.mockReturnValue(false)
      const useCase = buildUseCase()

      const response = await useCase.get('invalid-username')

      expect(response).toStrictEqual({
        success: false,
        error: GetUserByUsernameApplicationError.invalidUsername('invalid-username'),
      })
    })

    it('should return error result if user is not found', async () => {
      mockedUsernameValidator.prototype.validate.mockReturnValue(true)
      mockedUserRepository.findByUsername.mockImplementationOnce(() => {
        return Promise.resolve(null)
      })

      const useCase = buildUseCase()

      const response = await useCase.get('valid_username')

      expect(response).toStrictEqual({
        success: false,
        error: GetUserByUsernameApplicationError.userNotFound('valid_username'),
      })
    })
  })
})
