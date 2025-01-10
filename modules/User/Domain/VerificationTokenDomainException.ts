import { DomainException } from '~/modules/Exception/Domain/DomainException.ts'

export class VerificationTokenDomainException extends DomainException {
  public static invalidTokenTypeId = 'verification_token_invalid_token_type'

  // eslint-disable-next-line no-useless-constructor
  private constructor (message: string, id: string) {
    super(message, id)
  }

  public static invalidTokenType (type: string): VerificationTokenDomainException {
    return new VerificationTokenDomainException(
      `Token type ${type} is not a valid token type`,
      this.invalidTokenTypeId
    )
  }
}
