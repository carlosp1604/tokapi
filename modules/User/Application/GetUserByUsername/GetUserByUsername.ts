import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { User } from '~/modules/User/Domain/User.ts'
import { UserApplicationDto } from '~/modules/User/Application/Dtos/UserApplicationDto.ts'
import { Result } from '~/modules/Shared/Domain/Result.ts'
import { UserApplicationDtoTranslator } from '~/modules/User/Application/Translators/UserApplicationDtoTranslator.ts'
import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'
import {
  GetUserByUsernameApplicationError
} from '~/modules/User/Application/GetUserByUsername/GetUserByUsernameApplicationError.ts'

export class GetUserByUsername {
  // eslint-disable-next-line no-useless-constructor
  public constructor (private userRepository: UserRepositoryInterface) {}

  public async get (username: User['username']): Promise<Result<UserApplicationDto, GetUserByUsernameApplicationError>> {
    const validUsername = (new UsernameValidator()).validate(username)

    if (!validUsername) {
      return { success: false, error: GetUserByUsernameApplicationError.invalidUsername(username) }
    }

    const user = await this.userRepository.findByUsername(username)

    if (!user) {
      return { success: false, error: GetUserByUsernameApplicationError.userNotFound(username) }
    }

    return { success: true, value: UserApplicationDtoTranslator.fromDomain(user) }
  }
}
