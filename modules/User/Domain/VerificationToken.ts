import { VerificationTokenDomainException } from '~/modules/User/Domain/VerificationTokenDomainException.ts'

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
  public readonly updatedAt: Date
  public readonly usedAt: Date | null

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
    this.updatedAt = updatedAt
    this.usedAt = usedAt
  }

  private validateTokenType (tokenType: string): VerificationTokenType {
    if (!Object.values(VerificationTokenType).find(value => tokenType === value)) {
      throw VerificationTokenDomainException.invalidTokenType(tokenType)
    }

    return tokenType as VerificationTokenType
  }
}
