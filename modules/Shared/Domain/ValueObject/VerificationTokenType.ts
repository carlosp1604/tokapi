import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'

export enum VerificationTokenTypes {
  CREATE_ACCOUNT = 'create-account',
  CHANGE_PASSWORD = 'change-password',
}

export class VerificationTokenType {
  public readonly type: string

  private constructor (type: string) {
    this.type = type
  }

  public static from (type: string): VerificationTokenType {
    if (!Object.values(VerificationTokenTypes).find(value => type === value)) {
      throw ValueObjectDomainException.invalidVerificationTokenType(type)
    }

    return new VerificationTokenType(type)
  }
}
