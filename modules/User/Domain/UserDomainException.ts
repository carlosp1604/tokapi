import { DomainException } from '~/modules/Exception/Domain/DomainException.ts'

export class UserDomainException extends DomainException {
  public static invalidUsernameId = 'user_invalid_username'
  public static invalidEmailId = 'user_invalid_id'

  // eslint-disable-next-line no-useless-constructor
  private constructor (message: string, id: string) {
    super(message, id)
  }

  public static invalidUsername (username: string): UserDomainException {
    return new UserDomainException(
      `Username ${username} is not valid`,
      this.invalidUsernameId
    )
  }

  public static invalidEmail (email: string): UserDomainException {
    return new UserDomainException(
      `Email ${email} is not valid`,
      this.invalidEmailId
    )
  }
}
