import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export class GetUserByUsernameApplicationError extends ApplicationError {
  public static userNotFoundId = 'get_user_by_username_user_not_found'
  public static invalidUsernameId = 'get_user_by_username_invalid_username'

  // eslint-disable-next-line no-useless-constructor
  private constructor (id: string, message: string) {
    super(id, message)
  }

  public static userNotFound (username: string): GetUserByUsernameApplicationError {
    return new GetUserByUsernameApplicationError(
      `User with username ${username} not found`,
      this.userNotFoundId
    )
  }

  public static invalidUsername (username: string): GetUserByUsernameApplicationError {
    return new GetUserByUsernameApplicationError(
      `Username ${username} is not valid`,
      this.invalidUsernameId
    )
  }
}
