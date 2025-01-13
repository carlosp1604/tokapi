import { User } from '~/modules/User/Domain/User.ts'
import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export class CreateUserApplicationError extends ApplicationError {
  public static usernameAndEmailAlreadyRegisteredId = 'create_user_username_and_email_already_registered'
  public static usernameAlreadyRegisteredId = 'create_user_username_already_registered'
  public static emailAlreadyRegisteredId = 'create_user_email_already_registered'
  public static invalidTokenId = 'create_user_invalid_token'
  public static invalidUsernameAndEmailId = 'create_user_invalid_username_and_email'
  public static invalidUsernameId = 'create_user_invalid_username'
  public static invalidEmailId = 'create_user_invalid_email'
  public static invalidPasswordId = 'create_user_invalid_password'
  public static cannotCreateUserId = 'create_user_cannot_create_user'

  // eslint-disable-next-line no-useless-constructor
  private constructor (id: string, message: string) {
    super(id, message)
  }

  public static usernameAndEmailAlreadyRegistered (
    username: User['username'],
    email: User['email']
  ): CreateUserApplicationError {
    return new CreateUserApplicationError(
      `Username ${username} and email ${email} are already in use`,
      this.usernameAndEmailAlreadyRegisteredId
    )
  }

  public static usernameAlreadyRegistered (username: User['username']): CreateUserApplicationError {
    return new CreateUserApplicationError(
      `Username ${username} is already in use`,
      this.usernameAlreadyRegisteredId
    )
  }

  public static emailAlreadyRegistered (email: User['email']): CreateUserApplicationError {
    return new CreateUserApplicationError(
      `Email ${email} is already in use`,
      this.emailAlreadyRegisteredId
    )
  }

  public static invalidToken (): CreateUserApplicationError {
    return new CreateUserApplicationError(
      'Token is not valid',
      this.invalidTokenId
    )
  }

  public static invalidUsernameAndEmail (
    username: User['username'],
    email: User['email']
  ): CreateUserApplicationError {
    return new CreateUserApplicationError(
      `Username ${username} and email ${email} are not valid`,
      this.invalidUsernameAndEmailId
    )
  }

  public static invalidUsername (username: User['username']): CreateUserApplicationError {
    return new CreateUserApplicationError(
      `Username ${username} is not valid`,
      this.invalidUsernameId
    )
  }

  public static invalidEmail (email: User['email']): CreateUserApplicationError {
    return new CreateUserApplicationError(
      `Email ${email} is not valid`,
      this.invalidEmailId
    )
  }

  public static invalidPassword (password: User['password']): CreateUserApplicationError {
    return new CreateUserApplicationError(
      `Password ${password} is not valid`,
      this.invalidPasswordId
    )
  }

  public static cannotCreateUser (): CreateUserApplicationError {
    return new CreateUserApplicationError(
      'Cannot create user',
      this.cannotCreateUserId
    )
  }
}
