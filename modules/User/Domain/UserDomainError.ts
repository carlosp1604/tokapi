import { DomainError } from '~/modules/Error/Domain/DomainError.ts'

export class UserDomainError extends DomainError {
  public static invalidUsernameId = 'user_invalid_username'
  public static invalidNameId = 'user_invalid_name'
  public static invalidEmailId = 'user_invalid_email'
  public static invalidPasswordId = 'user_invalid_password'

  // eslint-disable-next-line no-useless-constructor
  private constructor (message: string, id: string) {
    super(message, id)
  }

  public static invalidUsername (username: string): UserDomainError {
    return new UserDomainError(
      `Username ${username} is not valid`,
      this.invalidUsernameId
    )
  }

  public static invalidName (name: string): UserDomainError {
    return new UserDomainError(
      `Name ${name} is not valid`,
      this.invalidNameId
    )
  }

  public static invalidEmail (email: string): UserDomainError {
    return new UserDomainError(
      `Email ${email} is not valid`,
      this.invalidEmailId
    )
  }

  public static invalidPassword (password: string): UserDomainError {
    return new UserDomainError(
      `Password ${password} is not valid`,
      this.invalidPasswordId
    )
  }
}
