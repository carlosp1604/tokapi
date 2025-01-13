import { User } from '~/modules/User/Domain/User.ts'
import { Result } from '~/modules/Shared/Domain/Result.ts'
import { VerificationToken } from '~/modules/User/Domain/VerificationToken.ts'
import { UserDomainException } from '~/modules/User/Domain/UserDomainException.ts'
import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import {
  CreateUserApplicationRequestDto
} from '~/modules/User/Application/CreateUser/CreateUserApplicationRequestDto.ts'
import { CreateUserApplicationError } from '~/modules/User/Application/CreateUser/CreateUserApplicationError.ts'
import { UserDomainError } from '~/modules/User/Domain/UserDomainError.ts'

export class CreateUser {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public readonly userRepository: UserRepositoryInterface,
    public readonly cryptoService: CryptoServiceInterface
  ) {}

  public async create (
    createUserApplicationRequestDto: CreateUserApplicationRequestDto
  ): Promise<Result<void, CreateUserApplicationError>> {
    // 2. Check user exists. User cannot exist
    const [existsEmail, existsUsername] = await Promise.all([
      this.userRepository.existsByEmail(createUserApplicationRequestDto.email),
      this.userRepository.existsByUsername(createUserApplicationRequestDto.username),
    ])

    if (existsEmail && existsUsername) {
      return {
        success: false,
        error: CreateUserApplicationError.usernameAndEmailAlreadyRegistered(
          createUserApplicationRequestDto.username,
          createUserApplicationRequestDto.email
        ),
      }
    }

    if (existsEmail) {
      return {
        success: false,
        error: CreateUserApplicationError.emailAlreadyRegistered(createUserApplicationRequestDto.email),
      }
    }

    if (existsUsername) {
      return {
        success: false,
        error: CreateUserApplicationError.usernameAlreadyRegistered(createUserApplicationRequestDto.username),
      }
    }

    // 3. Check token
    const token = await this.userRepository.findCreateAccountToken(createUserApplicationRequestDto.email)

    if (!token) {
      return {
        success: false,
        error: CreateUserApplicationError.invalidToken(),
      }
    }

    // TODO: Return different error
    const validToken =
      VerificationToken.validateVerificationTokenForCreateAccount(token, createUserApplicationRequestDto.token)

    if (!validToken) {
      return {
        success: false,
        error: CreateUserApplicationError.invalidToken(),
      }
    }

    const buildUserResult = await User.initializeUser(
      createUserApplicationRequestDto.name,
      createUserApplicationRequestDto.email,
      createUserApplicationRequestDto.username,
      createUserApplicationRequestDto.password,
      this.cryptoService
    )

    if (!buildUserResult.success) {
      if (buildUserResult.error.id === UserDomainError.invalidPasswordId) {
        return { success: false, error: CreateUserApplicationError.invalidPassword(createUserApplicationRequestDto.password) }
      }

      if (buildUserResult.error.id === UserDomainException.invalidUsernameAndEmailId) {
        return {
          success: false,
          error: CreateUserApplicationError.invalidUsernameAndEmail(
            createUserApplicationRequestDto.username, createUserApplicationRequestDto.email
          ),
        }
      }

      if (buildUserResult.error.id === UserDomainException.invalidEmailId) {
        return {
          success: false,
          error: CreateUserApplicationError.invalidEmail(createUserApplicationRequestDto.email),
        }
      }

      if (buildUserResult.error.id === UserDomainException.invalidUsernameId) {
        return {
          success: false,
          error: CreateUserApplicationError.invalidUsername(createUserApplicationRequestDto.username),
        }
      }

      return { success: false, error: CreateUserApplicationError.cannotCreateUser() }
    }

    try {
      // save user and mark token as used

      token.markAsUsed()
      await this.userRepository.createUser(buildUserResult.value, token)

      return { success: true, value: undefined }
    } catch (exception: unknown) {
      console.log(exception)

      return { success: false, error: CreateUserApplicationError.cannotCreateUser() }
    }
  }
}
