import { NameValidator } from '~/modules/Shared/Domain/Validator/NameValidator.ts'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'

export class Name {
  public readonly name: string

  private constructor (name: string) {
    this.name = name
  }

  public static from (name: string): Name {
    const isValidName = new NameValidator().validate(name)

    if (!isValidName) {
      throw ValueObjectDomainException.invalidName(name)
    }

    return new Name(name)
  }
}
