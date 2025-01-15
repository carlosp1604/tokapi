import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export enum ErrorType {
  VALIDATION = 'validation',
  NOT_FOUND = 'not-found',
  DUPLICATED = 'duplicated',
  UNEXPECTED_ERROR = 'unexpected-error'
}

export class CreateUserApplicationError {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public readonly type: ErrorType,
    public readonly errors: CreateUserError[]
  ) {}
}

export class CreateUserError extends ApplicationError {
  public static usernameAlreadyRegisteredId = 'create_user_username_already_registered'
  public static emailAlreadyRegisteredId = 'create_user_email_already_registered'
  public static invalidTokenId = 'create_user_invalid_token'
  public static invalidUsernameId = 'create_user_invalid_username'
  public static invalidNameId = 'create_user_invalid_name'
  public static invalidEmailId = 'create_user_invalid_email'
  public static invalidPasswordId = 'create_user_invalid_password'
  public static cannotCreateUserId = 'create_user_cannot_create_user'

  // eslint-disable-next-line no-useless-constructor
  private constructor (id: string, message: string) {
    super(id, message)
  }

  public static usernameAlreadyRegistered (username: string): CreateUserError {
    return new CreateUserError(
      `Username ${username} is already in use`,
      this.usernameAlreadyRegisteredId
    )
  }

  public static emailAlreadyRegistered (email: string): CreateUserError {
    return new CreateUserError(
      `Email ${email} is already in use`,
      this.emailAlreadyRegisteredId
    )
  }

  public static invalidToken (): CreateUserError {
    return new CreateUserError(
      'Token is not valid',
      this.invalidTokenId
    )
  }

  public static invalidUsername (username: string): CreateUserError {
    return new CreateUserError(
      `Username ${username} is not valid`,
      this.invalidUsernameId
    )
  }

  public static invalidEmail (email: string): CreateUserError {
    return new CreateUserError(
      `Email ${email} is not valid`,
      this.invalidEmailId
    )
  }

  public static invalidPassword (password: string): CreateUserError {
    return new CreateUserError(
      `Password ${password} is not valid`,
      this.invalidPasswordId
    )
  }

  public static invalidName (name: string): CreateUserError {
    return new CreateUserError(
      `Name ${name} is not valid`,
      this.invalidNameId
    )
  }

  public static cannotCreateUser (): CreateUserError {
    return new CreateUserError(
      'Cannot create user',
      this.cannotCreateUserId
    )
  }
}
