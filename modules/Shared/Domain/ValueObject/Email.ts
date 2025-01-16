import { EmailValidator } from '~/modules/Shared/Domain/Validator/EmailValidator.ts'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'

export class Email {
  public readonly email: string

  private constructor (email: string) {
    this.email = email
  }

  public static from (email: string): Email {
    const isValidEmail = new EmailValidator().validate(email)

    if (!isValidEmail) {
      throw ValueObjectDomainException.invalidEmail(email)
    }

    return new Email(email)
  }
}
