import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mock } from 'jest-mock-extended'
import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import { User } from '~/modules/User/Domain/User.ts'
import { LoginUser } from '~/modules/User/Application/LoginUser/LoginUser.ts'
import { EmailValidator } from '~/modules/Shared/Domain/Validator/EmailValidator.ts'
import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'
import { LoginUserApplicationError } from '~/modules/User/Application/LoginUser/LoginUserApplicationError.ts'

describe('LoginUser', () => {
  const mockedUserRepository = mock<UserRepositoryInterface>()
  const mockedCryptoService = mock<CryptoServiceInterface>()
  const nowDate = new Date()

  const mockedUser = mock<User>({
    id: 'test-id',
    email: 'example@email.com',
    username: 'test_username',
    createdAt: nowDate,
    updatedAt: nowDate,
    publicLikes: true,
    publicShared: true,
    publicProfile: true,
    publicSaved: true,
    imageUrl: null,
    description: null,
    name: 'Test Name',
    followers: 0,
    following: 0,
    viewsCount: 0,
    role: 'user',
  })

  const buildUseCase = () => {
    return new LoginUser(mockedUserRepository, mockedCryptoService)
  }

  describe('happy path', () => {
    beforeEach(() => {
      mockedUserRepository.findByUsername.mockResolvedValue(mockedUser)
      mockedUserRepository.findByEmail.mockResolvedValue(mockedUser)
      mockedUser.passwordMatch.mockResolvedValue(true)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should call repositories and services correctly with email', async () => {
      const emailValidatorSpy = jest.spyOn(EmailValidator.prototype, 'validate').mockReturnValue(true)
      const usernameValidatorSpy = jest.spyOn(UsernameValidator.prototype, 'validate').mockReturnValue(false)
      const useCase = buildUseCase()

      await useCase.login({ password: 'user_password', identifier: 'example@email.com' })

      expect(emailValidatorSpy).toBeCalledWith('example@email.com')
      expect(usernameValidatorSpy).toBeCalledWith('example@email.com')
      expect(mockedUserRepository.findByEmail).toBeCalledWith('example@email.com')
      expect(mockedUserRepository.findByUsername).not.toBeCalled()
      expect(mockedUser.passwordMatch).toBeCalledWith('user_password', mockedCryptoService)
    })

    it('should call repositories and services correctly with username', async () => {
      const emailValidatorSpy = jest.spyOn(EmailValidator.prototype, 'validate').mockReturnValue(false)
      const usernameValidatorSpy = jest.spyOn(UsernameValidator.prototype, 'validate').mockReturnValue(true)

      const useCase = buildUseCase()

      await useCase.login({ password: 'user_password', identifier: 'test_username' })

      expect(emailValidatorSpy).toBeCalledWith('test_username')
      expect(usernameValidatorSpy).toBeCalledWith('test_username')
      expect(mockedUserRepository.findByEmail).not.toBeCalled()
      expect(mockedUserRepository.findByUsername).toBeCalledWith('test_username')
      expect(mockedUser.passwordMatch).toBeCalledWith('user_password', mockedCryptoService)
    })

    it('should return correct data with username', async () => {
      jest.spyOn(EmailValidator.prototype, 'validate').mockReturnValue(false)
      jest.spyOn(UsernameValidator.prototype, 'validate').mockReturnValue(true)

      const useCase = buildUseCase()

      const result = await useCase.login({ password: 'user_password', identifier: 'test_username' })

      expect(result).toStrictEqual({
        success: true,
        value: {
          id: 'test-id',
          email: 'example@email.com',
          username: 'test_username',
          createdAt: nowDate.toISOString(),
          updatedAt: nowDate.toISOString(),
          publicLikes: true,
          publicShared: true,
          publicProfile: true,
          publicSaved: true,
          imageUrl: null,
          description: null,
          name: 'Test Name',
          followers: 0,
          following: 0,
          viewsCount: 0,
          role: 'user',
        },
      })
    })
  })

  describe('when there are errors', () => {
    it('should return error if user identifier is not valid', async () => {
      jest.spyOn(EmailValidator.prototype, 'validate').mockReturnValueOnce(false)
      jest.spyOn(UsernameValidator.prototype, 'validate').mockReturnValueOnce(false)

      const useCase = buildUseCase()

      const result = await useCase.login({ password: 'test_password', identifier: 'invalid_identifier' })

      expect(result).toEqual({
        success: false,
        error: LoginUserApplicationError.invalidIdentifier('invalid_identifier'),
      })
    })

    it('should return error if user is not found', async () => {
      jest.spyOn(EmailValidator.prototype, 'validate').mockReturnValueOnce(false)
      jest.spyOn(UsernameValidator.prototype, 'validate').mockReturnValueOnce(true)
      mockedUserRepository.findByUsername.mockResolvedValueOnce(null)

      const useCase = buildUseCase()

      const result = await useCase.login({ password: 'test_password', identifier: 'valid_identifier' })

      expect(result).toEqual({
        success: false,
        error: LoginUserApplicationError.userNotFound('valid_identifier'),
      })
    })

    it('should return error if user password does not match', async () => {
      jest.spyOn(EmailValidator.prototype, 'validate').mockReturnValueOnce(false)
      jest.spyOn(UsernameValidator.prototype, 'validate').mockReturnValueOnce(true)
      mockedUserRepository.findByUsername.mockResolvedValueOnce(mockedUser)
      mockedUser.passwordMatch.mockResolvedValueOnce(false)

      const useCase = buildUseCase()

      const result = await useCase.login({ password: 'test_password', identifier: 'valid_identifier' })

      expect(result).toEqual({
        success: false,
        error: LoginUserApplicationError.userPasswordDoesNotMatch(),
      })
    })
  })
})
