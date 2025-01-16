import { DomainError } from '~/modules/Error/Domain/DomainError.ts'

export class VerificationTokenDomainError extends DomainError {
  public static tokenNotValidForOperationId = 'verification_token_token_not_valid_for_operation'
  public static tokenAlreadyUsedId = 'verification_token_token_already_used'
  public static tokenExpiredId = 'verification_token_token_expired'
  public static tokenDoesNotMatchId = 'verification_token_does_not_match'

  // eslint-disable-next-line no-useless-constructor
  private constructor (message: string, id: string) {
    super(message, id)
  }

  public static tokenNotValidForOperation (type: string): VerificationTokenDomainError {
    return new VerificationTokenDomainError(
      `Token type ${type} is not a valid for the current operation`,
      this.tokenNotValidForOperationId
    )
  }

  public static tokenAlreadyUsed (): VerificationTokenDomainError {
    return new VerificationTokenDomainError(
      'Token was already used',
      this.tokenAlreadyUsedId
    )
  }

  public static tokenHasExpired (): VerificationTokenDomainError {
    return new VerificationTokenDomainError(
      'Token has already expired',
      this.tokenExpiredId
    )
  }

  public static tokenDoesNotMatch (token: string): VerificationTokenDomainError {
    return new VerificationTokenDomainError(
      `Token ${token} does not match. Invalid token`,
      this.tokenDoesNotMatchId
    )
  }
}
