import { Email } from '~/modules/Shared/Domain/ValueObject/Email.ts'
import {
  VerificationTokenType
} from '~/modules/Shared/Domain/ValueObject/VerificationTokenType.ts'
import { VerificationToken } from '~/modules/User/Domain/VerificationToken.ts'

export class VerificationTokenTestBuilder {
  private id = 'test-id'
  private token = 'test-token'
  private email = Email.from('example@email.com')
  private type = VerificationTokenType.from('create-account')
  private expiresAt = new Date()
  private createdAt = new Date()
  private updatedAt = new Date()
  private usedAt : Date | null = null

  public withId (id: string): VerificationTokenTestBuilder {
    this.id = id

    return this
  }

  public withToken (token: string): VerificationTokenTestBuilder {
    this.token = token

    return this
  }

  public withEmail (email: Email): VerificationTokenTestBuilder {
    this.email = email

    return this
  }

  public withType (type: VerificationTokenType): VerificationTokenTestBuilder {
    this.type = type

    return this
  }

  public withExpiresAt (date: Date): VerificationTokenTestBuilder {
    this.expiresAt = date

    return this
  }

  public withCreatedAt (date: Date): VerificationTokenTestBuilder {
    this.createdAt = date

    return this
  }

  public withUpdatedAt (date: Date): VerificationTokenTestBuilder {
    this.updatedAt = date

    return this
  }

  public withUsedAt (date: Date | null): VerificationTokenTestBuilder {
    this.usedAt = date

    return this
  }

  public build (): VerificationToken {
    return new VerificationToken(
      this.id,
      this.token,
      this.email,
      this.type,
      this.expiresAt,
      this.createdAt,
      this.updatedAt,
      this.usedAt
    )
  }
}
