import { User } from '~/modules/User/Domain/User.ts'
import { Result } from '~/modules/Shared/Domain/Result.ts'
import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { CreateUserApplicationRequestDto } from '~/modules/User/Application/CreateUser/CreateUserApplicationRequestDto.ts'
import {
  CreateUserApplicationError,
  CreateUserError,
  ErrorType
} from '~/modules/User/Application/CreateUser/CreateUserApplicationError.ts'
import { UserDomainError } from '~/modules/User/Domain/UserDomainError.ts'
import { VerificationTokenTypes } from '~/modules/Shared/Domain/ValueObject/VerificationTokenType.ts'

export class CreateUser {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public readonly userRepository: UserRepositoryInterface,
    public readonly cryptoService: CryptoServiceInterface
  ) {}

  public async create (
    createUserApplicationRequestDto: CreateUserApplicationRequestDto
  ): Promise<Result<void, CreateUserApplicationError>> {
    const [existsEmail, existsUsername] = await Promise.all([
      this.userRepository.existsByEmail(createUserApplicationRequestDto.email),
      this.userRepository.existsByUsername(createUserApplicationRequestDto.username),
    ])

    if (existsEmail || existsUsername) {
      return { success: false, error: this.handleDuplicated(createUserApplicationRequestDto, existsEmail, existsUsername) }
    }

    const verificationToken = await this.userRepository.findCreateAccountToken(createUserApplicationRequestDto.email)

    if (!verificationToken) {
      return { success: false, error: new CreateUserApplicationError(ErrorType.NOT_FOUND, [CreateUserError.invalidToken()]) }
    }

    const useTokenResult = verificationToken.useTokenFor(
      createUserApplicationRequestDto.token,
      VerificationTokenTypes.CREATE_ACCOUNT
    )

    if (!useTokenResult.success) {
      // Error obfuscating
      return { success: false, error: new CreateUserApplicationError(ErrorType.NOT_FOUND, [CreateUserError.invalidToken()]) }
    }

    const buildUserResult = await User.initializeUser(
      createUserApplicationRequestDto.name,
      createUserApplicationRequestDto.email,
      createUserApplicationRequestDto.username,
      createUserApplicationRequestDto.password,
      this.cryptoService
    )

    if (!buildUserResult.success) {
      // FIXME: Workaround to test this use-case (property error does not exists on type)
      let errors: UserDomainError[] = []

      if ('error' in buildUserResult) {
        errors = buildUserResult.error
      }

      const buildUserErrors =
        this.handleUserBuildingErrors(createUserApplicationRequestDto, errors)

      return { success: false, error: buildUserErrors }
    }

    try {
      await this.userRepository.createUser(buildUserResult.value, verificationToken)

      return { success: true, value: undefined }
    } catch (exception: unknown) {
      console.log(exception)

      return {
        success: false,
        error: new CreateUserApplicationError(ErrorType.UNEXPECTED_ERROR, [CreateUserError.cannotCreateUser()]),
      }
    }
  }

  private handleDuplicated (
    createUserApplicationRequestDto: CreateUserApplicationRequestDto,
    existsEmail: boolean,
    existsUsername: boolean
  ): CreateUserApplicationError {
    const errors: CreateUserError[] = []

    if (existsUsername) {
      errors.push(CreateUserError.usernameAlreadyRegistered(createUserApplicationRequestDto.username))
    }

    if (existsEmail) {
      errors.push(CreateUserError.emailAlreadyRegistered(createUserApplicationRequestDto.email))
    }

    return new CreateUserApplicationError(ErrorType.DUPLICATED, errors)
  }

  private handleUserBuildingErrors (
    createUserApplicationRequestDto: CreateUserApplicationRequestDto,
    errors: UserDomainError[]
  ): CreateUserApplicationError {
    const createUserErrors: CreateUserError[] = []

    for (const error of errors) {
      switch (error.id) {
        case UserDomainError.invalidPasswordId:
          createUserErrors.push(CreateUserError.invalidPassword(createUserApplicationRequestDto.password))
          break

        case UserDomainError.invalidEmailId:
          createUserErrors.push(CreateUserError.invalidEmail(createUserApplicationRequestDto.email))
          break

        case UserDomainError.invalidNameId:
          createUserErrors.push(CreateUserError.invalidName(createUserApplicationRequestDto.name))
          break

        case UserDomainError.invalidUsernameId:
          createUserErrors.push(CreateUserError.invalidUsername(createUserApplicationRequestDto.username))
          break
      }
    }

    return new CreateUserApplicationError(ErrorType.VALIDATION, createUserErrors)
  }
}
