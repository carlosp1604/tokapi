import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export class LoginUserApplicationError extends ApplicationError {
  public static userNotFoundId = 'login_user_user_not_found'
  public static invalidIdentifierId = 'login_invalid_identifier'
  public static userPasswordDoesNotMatchId = 'login_invalid_user_password_does_not_match'

  // eslint-disable-next-line no-useless-constructor
  private constructor (id: string, message: string) {
    super(id, message)
  }

  public static userNotFound (identifier: string): LoginUserApplicationError {
    return new LoginUserApplicationError(
      `User with username/email ${identifier} not found`,
      this.userNotFoundId
    )
  }

  public static invalidIdentifier (identifier: string): LoginUserApplicationError {
    return new LoginUserApplicationError(
      `Identifier ${identifier} is not an username or email`,
      this.invalidIdentifierId
    )
  }

  public static userPasswordDoesNotMatch (): LoginUserApplicationError {
    return new LoginUserApplicationError(
      'Combination username/email and password does not match',
      this.userPasswordDoesNotMatchId
    )
  }
}
