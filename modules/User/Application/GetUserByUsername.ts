import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { User } from '~/modules/User/Domain/User.ts'
import { UserApplicationDto } from '~/modules/User/Application/Dtos/UserApplicationDto.ts'
import { GetUserByUsernameApplicationException } from '~/modules/User/Application/GetUserByUsernameApplicationException.ts'
import { Result } from '~/modules/Shared/Domain/Result.ts'
import { UserApplicationDtoTranslator } from '~/modules/User/Application/Translators/UserApplicationDtoTranslator.ts'

export class GetUserByUsername {
  // eslint-disable-next-line no-useless-constructor
  public constructor (private userRepository: UserRepositoryInterface) {}

  public async get (username: User['username']): Promise<Result<UserApplicationDto, GetUserByUsernameApplicationException>> {
    const user = await this.userRepository.findByUsername(username)

    if (!user) {
      return { success: false, error: GetUserByUsernameApplicationException.userNotFound(username) }
    }

    return { success: true, value: UserApplicationDtoTranslator.fromDomain(user) }
  }
}
