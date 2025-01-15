import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'

export class Username {
  public readonly username: string

  private constructor (username: string) {
    this.username = username
  }

  public static from (username: string): Username {
    const isValidUsername = new UsernameValidator().validate(username)

    if (!isValidUsername) {
      throw ValueObjectDomainException.invalidUsername(username)
    }

    return new Username(username)
  }
}
