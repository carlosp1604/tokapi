import { DomainException } from '~/modules/Exception/Domain/DomainException.ts'

export class UserDomainException extends DomainException {
  public static invalidUsernameAndEmailId = 'user_invalid_username_and_email'
  public static invalidUsernameId = 'user_invalid_username'
  public static invalidEmailId = 'user_invalid_email'
  public static invalidUserRoleId = 'user_invalid_role'

  // eslint-disable-next-line no-useless-constructor
  private constructor (message: string, id: string) {
    super(message, id)
  }

  public static invalidUsernameAndEmail (username: string, email: string): UserDomainException {
    return new UserDomainException(
      `Username ${username} and Email ${email} are not valid`,
      this.invalidUsernameAndEmailId
    )
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

  public static invalidRole (userRole: string): UserDomainException {
    return new UserDomainException(
      `Role ${userRole} is not valid`,
      this.invalidUserRoleId
    )
  }
}
