import { ApplicationException } from '~/modules/Exception/Application/ApplicationException.ts'
import { User } from '../Domain/User.ts'

export class GetUserByUsernameApplicationException extends ApplicationException {
  public static userNotFoundId = 'get_user_by_username_user_not_found'

  // eslint-disable-next-line no-useless-constructor
  private constructor (id: string, message: string) {
    super(id, message)
  }

  public static userNotFound (username: User['username']): GetUserByUsernameApplicationException {
    return new GetUserByUsernameApplicationException(
      `User with username ${username} not found`,
      this.userNotFoundId
    )
  }
}
