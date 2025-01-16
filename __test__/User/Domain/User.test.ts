import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mock } from 'jest-mock-extended'
import { Name } from '~/modules/Shared/Domain/ValueObject/Name.ts'
import { Email } from '~/modules/Shared/Domain/ValueObject/Email.ts'
import { Username } from '~/modules/Shared/Domain/ValueObject/Username.ts'
import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import { randomUUID } from 'node:crypto'
import { User } from '~/modules/User/Domain/User.ts'
import { PasswordValidator } from '~/modules/Shared/Domain/Validator/PasswordValidator.ts'
import { UserTestBuilder } from '~/__test__/User/Domain/UserTestBuilder.ts'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'
import { UserDomainError } from '~/modules/User/Domain/UserDomainError.ts'

jest.mock('node:crypto')

describe('User', () => {
  const mockedName = mock<Name>()
  const mockedUsername = mock<Username>()
  const mockedEmail = mock<Email>()
  const mockedCryptoService = mock<CryptoServiceInterface>()
  const mockedRandomUUID = jest.mocked(randomUUID)

  const nowDate = new Date()

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(nowDate)
  })

  describe('initializeUser', () => {
    describe('happy path', () => {
      it('should call value objects and services correctly', async () => {
        mockedRandomUUID.mockReturnValue('random-random-random-random-uuid')
        const nameSpy = jest.spyOn(Name, 'from').mockReturnValue(mockedName)
        const usernameSpy = jest.spyOn(Username, 'from').mockReturnValue(mockedUsername)
        const emailSpy = jest.spyOn(Email, 'from').mockReturnValue(mockedEmail)
        const passwordValidatorSpy = jest.spyOn(PasswordValidator.prototype, 'validate')
          .mockReturnValue(true)

        await User.initializeUser(
          'Test Name',
          'example@email.com',
          'test_username',
          'test_password',
          mockedCryptoService
        )

        expect(nameSpy).toBeCalledWith('Test Name')
        expect(usernameSpy).toBeCalledWith('test_username')
        expect(emailSpy).toBeCalledWith('example@email.com')
        expect(passwordValidatorSpy).toBeCalledWith('test_password')
        expect(mockedCryptoService.hash).toBeCalledWith('test_password')
      })

      it('should return built user', async () => {
        const expectedUser = new UserTestBuilder()
          .withId('random-random-random-random-uuid')
          .withPassword('hashed_password')
          .withEmail(Email.from('example@email.com'))
          .withUsername(Username.from('test_username'))
          .withName(Name.from('Test Name'))
          .withCreatedAt(nowDate)
          .withPublicLikes(false)
          .withPublicSaved(false)
          .withPublicShared(false)
          .withUpdatedAt(nowDate)
          .build()

        mockedRandomUUID.mockReturnValue('random-random-random-random-uuid')
        mockedCryptoService.hash.mockResolvedValue('hashed_password')
        jest.spyOn(Name, 'from').mockReturnValue(mockedName)
        jest.spyOn(Username, 'from').mockReturnValue(mockedUsername)
        jest.spyOn(Email, 'from').mockReturnValue(mockedEmail)
        jest.spyOn(PasswordValidator.prototype, 'validate')
          .mockReturnValue(true)

        const result = await User.initializeUser(
          'Test Name',
          'example@email.com',
          'test_username',
          'test_password',
          mockedCryptoService
        )

        expect(result).toStrictEqual({
          success: true,
          value:
          expectedUser,
        })
      })
    })

    describe('when there are errors', () => {
      beforeEach(() => {
        mockedRandomUUID.mockReturnValue('random-random-random-random-uuid')
        mockedCryptoService.hash.mockResolvedValue('hashed_password')
      })

      it('should return error if name is not valid', async () => {
        jest.spyOn(Name, 'from').mockImplementationOnce(() => { throw ValueObjectDomainException.invalidName('Test Name') })
        jest.spyOn(Username, 'from').mockReturnValue(mockedUsername)
        jest.spyOn(Email, 'from').mockReturnValue(mockedEmail)

        const result = await User.initializeUser(
          'Test Name',
          'example@email.com',
          'test_username',
          'test_password',
          mockedCryptoService
        )

        expect(result).toStrictEqual({
          success: false,
          error: [
            UserDomainError.invalidName('Test Name'),
          ],
        })
      })

      it('should return error if username is not valid', async () => {
        jest.spyOn(Name, 'from').mockReturnValue(mockedName)
        jest.spyOn(Username, 'from')
          .mockImplementation(() => { throw ValueObjectDomainException.invalidUsername('test_username') })
        jest.spyOn(Email, 'from').mockReturnValue(mockedEmail)

        const result = await User.initializeUser(
          'Test Name',
          'example@email.com',
          'test_username',
          'test_password',
          mockedCryptoService
        )

        expect(result).toStrictEqual({
          success: false,
          error: [
            UserDomainError.invalidUsername('test_username'),
          ],
        })
      })

      it('should return error if email is not valid', async () => {
        jest.spyOn(Name, 'from').mockReturnValue(mockedName)
        jest.spyOn(Username, 'from').mockReturnValue(mockedUsername)
        jest.spyOn(Email, 'from')
          .mockImplementation(() => { throw ValueObjectDomainException.invalidEmail('example@email.com') })

        const result = await User.initializeUser(
          'Test Name',
          'example@email.com',
          'test_username',
          'test_password',
          mockedCryptoService
        )

        expect(result).toStrictEqual({
          success: false,
          error: [
            UserDomainError.invalidEmail('example@email.com'),
          ],
        })
      })
      it('should return error if password is not valid', async () => {
        jest.spyOn(Name, 'from').mockReturnValue(mockedName)
        jest.spyOn(Username, 'from').mockReturnValue(mockedUsername)
        jest.spyOn(Email, 'from').mockReturnValue(mockedEmail)
        jest.spyOn(PasswordValidator.prototype, 'validate').mockReturnValue(false)

        const result = await User.initializeUser(
          'Test Name',
          'example@email.com',
          'test_username',
          'test_password',
          mockedCryptoService
        )

        expect(result).toStrictEqual({
          success: false,
          error: [
            UserDomainError.invalidPassword('test_password'),
          ],
        })
      })

      it('should return error if some values are not valid', async () => {
        jest.spyOn(Name, 'from').mockImplementationOnce(() => { throw ValueObjectDomainException.invalidName('Test Name') })
        jest.spyOn(Username, 'from').mockReturnValue(mockedUsername)
        jest.spyOn(Email, 'from').mockReturnValue(mockedEmail)
        jest.spyOn(PasswordValidator.prototype, 'validate').mockReturnValue(false)

        const result = await User.initializeUser(
          'Test Name',
          'example@email.com',
          'test_username',
          'test_password',
          mockedCryptoService
        )

        expect(result).toStrictEqual({
          success: false,
          error: [
            UserDomainError.invalidName('Test Name'),
            UserDomainError.invalidPassword('test_password'),
          ],
        })
      })
    })
  })
})
