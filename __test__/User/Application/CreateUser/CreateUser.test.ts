import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { mock, mockReset } from 'jest-mock-extended'
import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import { CreateUser } from '~/modules/User/Application/CreateUser/CreateUser.ts'
import { CreateUserApplicationRequestDto } from '~/modules/User/Application/CreateUser/CreateUserApplicationRequestDto.ts'
import { UserTestBuilder } from '~/__test__/User/Domain/UserTestBuilder.ts'
import { User } from '~/modules/User/Domain/User.ts'
import { VerificationToken } from '~/modules/User/Domain/VerificationToken.ts'
import { VerificationTokenTypes } from '~/modules/Shared/Domain/ValueObject/VerificationTokenType.ts'
import {
  CreateUserApplicationError, CreateUserError,
  ErrorType
} from '~/modules/User/Application/CreateUser/CreateUserApplicationError.ts'
import { VerificationTokenDomainError } from '~/modules/User/Domain/VerificationTokenDomainError.ts'
import { UserDomainError } from '~/modules/User/Domain/UserDomainError.ts'

describe('CreateUser', () => {
  const mockedUserRepository = mock<UserRepositoryInterface>()
  const mockedCryptoService = mock<CryptoServiceInterface>()
  const nowDate = new Date()
  const mockedVerificationToken = mock<VerificationToken>()

  const request: CreateUserApplicationRequestDto = {
    username: 'test_username',
    email: 'example@email.com',
    token: 'test-token',
    name: 'Test Name',
    password: 'test_password',
  }

  const user = new UserTestBuilder()
    .withCreatedAt(nowDate)
    .withUpdatedAt(nowDate)
    .build()

  const buildUseCase = () => {
    return new CreateUser(mockedUserRepository, mockedCryptoService)
  }

  describe('happy path', () => {
    beforeAll(() => {
      mockedUserRepository.existsByEmail.mockImplementation(() => { return Promise.resolve(false) })
      mockedUserRepository.existsByUsername.mockImplementation(() => { return Promise.resolve(false) })
      mockedUserRepository.findCreateAccountToken
        .mockImplementation(() => { return Promise.resolve(mockedVerificationToken) })
      mockedVerificationToken.useTokenFor.mockReturnValue({ success: true, value: undefined })
    })

    it('should call repositories and services correctly', async () => {
      const spyUser = jest.spyOn(User, 'initializeUser')

      spyUser.mockResolvedValue({ success: true, value: user })

      const useCase = buildUseCase()

      await useCase.create(request)

      expect(mockedUserRepository.existsByEmail).toBeCalledWith('example@email.com')
      expect(mockedUserRepository.existsByUsername).toBeCalledWith('test_username')
      expect(mockedUserRepository.findCreateAccountToken).toBeCalledWith('example@email.com')
      expect(mockedVerificationToken.useTokenFor).toBeCalledWith('test-token', VerificationTokenTypes.CREATE_ACCOUNT)
      expect(spyUser).toBeCalledWith(
        'Test Name',
        'example@email.com',
        'test_username',
        'test_password',
        mockedCryptoService
      )
      expect(mockedUserRepository.createUser).toBeCalledWith(user, mockedVerificationToken)
    })

    it('should return correct result', async () => {
      const spyUser = jest.spyOn(User, 'initializeUser')

      spyUser.mockResolvedValue({ success: true, value: user })

      const useCase = buildUseCase()

      const result = await useCase.create(request)

      expect(result).toEqual({ success: true, value: undefined })
    })
  })

  describe('when there are errors', () => {
    beforeEach(() => {
      mockReset(mockedUserRepository)
      mockReset(mockedCryptoService)
      mockReset(mockedVerificationToken)
    })

    it('should return error if user email already exists', async () => {
      mockedUserRepository.existsByUsername.mockImplementation(() => {
        return Promise.resolve(false)
      })
      mockedUserRepository.existsByEmail.mockImplementation(() => {
        return Promise.resolve(true)
      })

      const useCase = buildUseCase()

      const result = await useCase.create(request)

      expect(result).toEqual({
        success: false,
        error: new CreateUserApplicationError(
          ErrorType.DUPLICATED,
          [CreateUserError.emailAlreadyRegistered('example@email.com')]),
      })
    })

    it('should return error if username already exists', async () => {
      mockedUserRepository.existsByUsername.mockImplementation(() => {
        return Promise.resolve(true)
      })
      mockedUserRepository.existsByEmail.mockImplementation(() => {
        return Promise.resolve(false)
      })

      const useCase = buildUseCase()

      const result = await useCase.create(request)

      expect(result).toEqual({
        success: false,
        error: new CreateUserApplicationError(
          ErrorType.DUPLICATED,
          [CreateUserError.usernameAlreadyRegistered('test_username')]),
      })
    })

    it('should return error if email and username already exists', async () => {
      mockedUserRepository.existsByUsername.mockImplementation(() => {
        return Promise.resolve(true)
      })
      mockedUserRepository.existsByEmail.mockImplementation(() => {
        return Promise.resolve(true)
      })

      const useCase = buildUseCase()

      const result = await useCase.create(request)

      expect(result).toEqual({
        success: false,
        error: new CreateUserApplicationError(
          ErrorType.DUPLICATED,
          [
            CreateUserError.usernameAlreadyRegistered('test_username'),
            CreateUserError.emailAlreadyRegistered('example@email.com')]),
      })
    })

    it('should return error if verification token does not exist', async () => {
      mockedUserRepository.existsByUsername.mockImplementation(() => {
        return Promise.resolve(false)
      })
      mockedUserRepository.existsByEmail.mockImplementation(() => {
        return Promise.resolve(false)
      })
      mockedUserRepository.findCreateAccountToken.mockResolvedValue(null)

      const useCase = buildUseCase()

      const result = await useCase.create(request)

      expect(result).toEqual({
        success: false,
        error: new CreateUserApplicationError(
          ErrorType.NOT_FOUND,
          [CreateUserError.invalidToken()]),
      })
    })

    // TODO: If we decide to not obfuscate error then we should test all cases
    it('should return error if verification token does exist but is not valid', async () => {
      mockedUserRepository.existsByUsername.mockImplementation(() => {
        return Promise.resolve(false)
      })
      mockedUserRepository.existsByEmail.mockImplementation(() => {
        return Promise.resolve(false)
      })
      mockedUserRepository.findCreateAccountToken.mockResolvedValue(mockedVerificationToken)
      mockedVerificationToken.useTokenFor
        .mockReturnValue({ success: false, error: VerificationTokenDomainError.tokenAlreadyUsed() })

      const useCase = buildUseCase()

      const result = await useCase.create(request)

      expect(result).toEqual({
        success: false,
        error: new CreateUserApplicationError(
          ErrorType.NOT_FOUND,
          [CreateUserError.invalidToken()]),
      })
    })

    describe('Validation', () => {
      beforeEach(() => {
        mockedUserRepository.existsByUsername.mockImplementation(() => {
          return Promise.resolve(false)
        })
        mockedUserRepository.existsByEmail.mockImplementation(() => {
          return Promise.resolve(false)
        })
        mockedUserRepository.findCreateAccountToken.mockResolvedValue(mockedVerificationToken)
        mockedVerificationToken.useTokenFor.mockReturnValue({ success: true, value: undefined })
      })

      it('should return error if cannot build user due to invalid name', async () => {
        const mockedFunction = jest.spyOn(User, 'initializeUser')

        mockedFunction.mockResolvedValue({
          success: false,
          error: [UserDomainError.invalidName('Test Name')],
        })

        const useCase = buildUseCase()

        const result = await useCase.create(request)

        expect(result).toEqual({
          success: false,
          error: new CreateUserApplicationError(
            ErrorType.VALIDATION,
            [CreateUserError.invalidName('Test Name')]),
        })
      })

      it('should return error if cannot build user due to invalid username', async () => {
        const mockedFunction = jest.spyOn(User, 'initializeUser')

        mockedFunction.mockResolvedValue({
          success: false,
          error: [UserDomainError.invalidUsername('test_username')],
        })

        const useCase = buildUseCase()

        const result = await useCase.create(request)

        expect(result).toEqual({
          success: false,
          error: new CreateUserApplicationError(
            ErrorType.VALIDATION,
            [CreateUserError.invalidUsername('test_username')]),
        })
      })

      it('should return error if cannot build user due to invalid email', async () => {
        const mockedFunction = jest.spyOn(User, 'initializeUser')

        mockedFunction.mockResolvedValue({
          success: false,
          error: [UserDomainError.invalidEmail('example@email.com')],
        })

        const useCase = buildUseCase()

        const result = await useCase.create(request)

        expect(result).toEqual({
          success: false,
          error: new CreateUserApplicationError(
            ErrorType.VALIDATION,
            [CreateUserError.invalidEmail('example@email.com')]),
        })
      })

      it('should return error if cannot build user due to invalid password', async () => {
        const mockedFunction = jest.spyOn(User, 'initializeUser')

        mockedFunction.mockResolvedValue({
          success: false,
          error: [UserDomainError.invalidPassword('test_password')],
        })

        const useCase = buildUseCase()

        const result = await useCase.create(request)

        expect(result).toEqual({
          success: false,
          error: new CreateUserApplicationError(
            ErrorType.VALIDATION,
            [CreateUserError.invalidPassword('test_password')]),
        })
      })
    })

    it('should return error if cannot create user', async () => {
      mockedUserRepository.existsByUsername.mockImplementation(() => {
        return Promise.resolve(false)
      })
      mockedUserRepository.existsByEmail.mockImplementation(() => {
        return Promise.resolve(false)
      })
      mockedUserRepository.findCreateAccountToken.mockResolvedValue(mockedVerificationToken)
      mockedVerificationToken.useTokenFor
        .mockReturnValue({ success: true, value: undefined })
      mockedUserRepository.createUser.mockRejectedValue(new Error('Unexpected error'))

      const mockedFunction = jest.spyOn(User, 'initializeUser')

      mockedFunction.mockResolvedValue({ success: true, value: user })

      const useCase = buildUseCase()

      const result = await useCase.create(request)

      expect(result).toEqual({
        success: false,
        error: new CreateUserApplicationError(
          ErrorType.UNEXPECTED_ERROR,
          [CreateUserError.cannotCreateUser()]),
      })
    })
  })
})
