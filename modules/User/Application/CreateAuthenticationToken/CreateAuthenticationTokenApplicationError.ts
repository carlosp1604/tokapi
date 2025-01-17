import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export class CreateAuthenticationTokenApplicationError extends ApplicationError {
  public static cannotGenerateTokenId = 'create_authentication_token_cannot_generate_token'

  // eslint-disable-next-line no-useless-constructor
  private constructor (id: string, message: string) {
    super(id, message)
  }

  public static cannotGenerateToken (userId: string): CreateAuthenticationTokenApplicationError {
    return new CreateAuthenticationTokenApplicationError(
      `Cannot generate authentication token for user with ID ${userId}`,
      this.cannotGenerateTokenId
    )
  }
}
