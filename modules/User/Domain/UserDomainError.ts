import { DomainError } from '~/modules/Error/Domain/DomainError.ts'

export class UserDomainError extends DomainError {
  public static invalidUsernameAndEmailId = 'user_invalid_username_and_email'
  public static invalidUsernameId = 'user_invalid_username'
  public static invalidEmailId = 'user_invalid_email'
  public static invalidUserRoleId = 'user_invalid_role'
  public static invalidPasswordId = 'user_invalid_password'

  // eslint-disable-next-line no-useless-constructor
  private constructor (message: string, id: string) {
    super(message, id)
  }

  public static invalidUsernameAndEmail (username: string, email: string): UserDomainError {
    return new UserDomainError(
      `Username ${username} and Email ${email} are not valid`,
      this.invalidUsernameAndEmailId
    )
  }

  public static invalidUsername (username: string): UserDomainError {
    return new UserDomainError(
      `Username ${username} is not valid`,
      this.invalidUsernameId
    )
  }

  public static invalidEmail (email: string): UserDomainError {
    return new UserDomainError(
      `Email ${email} is not valid`,
      this.invalidEmailId
    )
  }

  public static invalidRole (userRole: string): UserDomainError {
    return new UserDomainError(
      `Role ${userRole} is not valid`,
      this.invalidUserRoleId
    )
  }

  public static invalidPassword (password: string): UserDomainError {
    return new UserDomainError(
      `Password ${password} is not valid`,
      this.invalidPasswordId
    )
  }
}
