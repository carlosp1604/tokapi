import { VerificationTokenDomainException } from '~/modules/User/Domain/VerificationTokenDomainException.ts'
import { Result } from '~/modules/Shared/Domain/Result.ts'
import { VerificationTokenDomainError } from '~/modules/User/Domain/VerificationTokenDomainError.ts'

export enum VerificationTokenType {
  CREATE_ACCOUNT = 'create_account',
  CHANGE_PASSWORD = 'change_password',
}

export class VerificationToken {
  public readonly id: string
  public readonly token: string
  public readonly email: string
  public readonly type: VerificationTokenType
  public readonly expiresAt: Date
  public readonly createdAt: Date
  private _updatedAt: Date
  private _usedAt: Date | null

  public constructor (
    id: string,
    token: string,
    email: string,
    type: string,
    expiresAt: Date,
    createdAt: Date,
    updatedAt: Date,
    usedAt: Date | null
  ) {
    this.id = id
    this.token = token
    this.email = email
    this.type = this.validateTokenType(type)
    this.expiresAt = expiresAt
    this.createdAt = createdAt
    this._updatedAt = updatedAt
    this._usedAt = usedAt
  }

  get updatedAt (): Date {
    return this._updatedAt
  }

  get usedAt (): Date | null {
    return this._usedAt
  }

  public markAsUsed (): void {
    const nowDate = new Date()

    this._usedAt = nowDate
    this._updatedAt = nowDate
  }

  private validateTokenType (tokenType: string): VerificationTokenType {
    if (!Object.values(VerificationTokenType).find(value => tokenType === value)) {
      throw VerificationTokenDomainException.invalidTokenType(tokenType)
    }

    return tokenType as VerificationTokenType
  }

  public static validateVerificationTokenForCreateAccount (
    verificationToken: VerificationToken,
    token: string
  ): Result<VerificationToken, VerificationTokenDomainError> {
    if (verificationToken.type !== VerificationTokenType.CREATE_ACCOUNT) {
      return {
        success: false,
        error: VerificationTokenDomainError.tokenNotValidForOperation(VerificationTokenType.CREATE_ACCOUNT),
      }
    }

    if (verificationToken._usedAt !== null) {
      return { success: false, error: VerificationTokenDomainError.tokenAlreadyUsed() }
    }

    const nowDate = new Date()

    if (verificationToken.expiresAt <= nowDate) {
      return { success: false, error: VerificationTokenDomainError.tokenHasExpired() }
    }

    if (verificationToken.token !== token) {
      return { success: false, error: VerificationTokenDomainError.tokenDoesNotMatch(token) }
    }

    return { success: true, value: verificationToken }
  }
}
