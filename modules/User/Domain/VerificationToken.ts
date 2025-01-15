import { Result } from '~/modules/Shared/Domain/Result.ts'
import { VerificationTokenDomainError } from '~/modules/User/Domain/VerificationTokenDomainError.ts'
import { Email } from '~/modules/Shared/Domain/ValueObject/Email.ts'
import {
  VerificationTokenType,
  VerificationTokenTypes
} from '~/modules/Shared/Domain/ValueObject/VerificationTokenType.ts'

export class VerificationToken {
  public readonly id: string
  public readonly token: string
  public readonly email: Email
  public readonly _type: VerificationTokenType
  public readonly expiresAt: Date
  public readonly createdAt: Date
  private _updatedAt: Date
  private _usedAt: Date | null

  public constructor (
    id: string,
    token: string,
    email: Email,
    type: VerificationTokenType,
    expiresAt: Date,
    createdAt: Date,
    updatedAt: Date,
    usedAt: Date | null
  ) {
    this.id = id
    this.token = token
    this.email = email
    this._type = type
    this.expiresAt = expiresAt
    this.createdAt = createdAt
    this._updatedAt = updatedAt
    this._usedAt = usedAt
  }

  get type (): string {
    return this._type.type
  }

  get updatedAt (): Date {
    return this._updatedAt
  }

  get usedAt (): Date | null {
    return this._usedAt
  }

  private markAsUsed (): void {
    const nowDate = new Date()

    this._usedAt = nowDate
    this._updatedAt = nowDate
  }

  public useTokenFor (token: string, operation: VerificationTokenTypes): Result<void, VerificationTokenDomainError> {
    if (this.type !== operation) {
      return {
        success: false,
        error: VerificationTokenDomainError.tokenNotValidForOperation(operation),
      }
    }

    if (this._usedAt !== null) {
      return { success: false, error: VerificationTokenDomainError.tokenAlreadyUsed() }
    }

    const nowDate = new Date()

    if (this.expiresAt <= nowDate) {
      return { success: false, error: VerificationTokenDomainError.tokenHasExpired() }
    }

    if (this.token !== token) {
      return { success: false, error: VerificationTokenDomainError.tokenDoesNotMatch(token) }
    }

    this.markAsUsed()

    return { success: true, value: undefined }
  }
}
