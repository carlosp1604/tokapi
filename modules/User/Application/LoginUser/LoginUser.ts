import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { UserApplicationDto } from '~/modules/User/Application/Dtos/UserApplicationDto.ts'
import { Result } from '~/modules/Shared/Domain/Result.ts'
import { LoginUserRequestApplicationDto } from '~/modules/User/Application/LoginUser/LoginUserRequestApplicationDto.ts'
import { User } from '~/modules/User/Domain/User.ts'
import { EmailValidator } from '~/modules/Shared/Domain/Validator/EmailValidator.ts'
import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'
import { UserApplicationDtoTranslator } from '~/modules/User/Application/Translators/UserApplicationDtoTranslator.ts'
import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import { LoginUserApplicationError } from '~/modules/User/Application/LoginUser/LoginUserApplicationError.ts'

export class LoginUser {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly cryptoService: CryptoServiceInterface
  ) {}

  public async login (
    loginUserRequest: LoginUserRequestApplicationDto
  ): Promise<Result<UserApplicationDto, LoginUserApplicationError>> {
    let user: User | null = null

    const isValidEmail = new EmailValidator().validate(loginUserRequest.identifier)

    if (isValidEmail) {
      user = await this.userRepository.findByEmail(loginUserRequest.identifier)
    }

    const isValidUsername = new UsernameValidator().validate(loginUserRequest.identifier)

    if (isValidUsername) {
      user = await this.userRepository.findByUsername(loginUserRequest.identifier)
    }

    if (!isValidEmail && !isValidUsername) {
      return { success: false, error: LoginUserApplicationError.invalidIdentifier(loginUserRequest.identifier) }
    }

    if (!user) {
      return { success: false, error: LoginUserApplicationError.userNotFound(loginUserRequest.identifier) }
    }

    const passwordMatch = await user.passwordMatch(loginUserRequest.password, this.cryptoService)

    if (passwordMatch) {
      return { success: true, value: UserApplicationDtoTranslator.fromDomain(user) }
    }

    return { success: false, error: LoginUserApplicationError.userPasswordDoesNotMatch() }
  }
}
