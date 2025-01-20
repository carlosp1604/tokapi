import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export class ValidateAuthenticationTokenApplicationError extends ApplicationError {
  public static invalidTokenTypeId = 'validate_authentication_token_invalid_token_type'
  public static invalidTokenId = 'validate_authentication_token_invalid_token'

  // eslint-disable-next-line no-useless-constructor
  private constructor (id: string, message: string) {
    super(id, message)
  }

  public static invalidTokenType (): ValidateAuthenticationTokenApplicationError {
    return new ValidateAuthenticationTokenApplicationError(
      'Invalid Token Type',
      this.invalidTokenTypeId
    )
  }

  public static invalidToken (): ValidateAuthenticationTokenApplicationError {
    return new ValidateAuthenticationTokenApplicationError(
      'Token is not valid',
      this.invalidTokenId
    )
  }
}
