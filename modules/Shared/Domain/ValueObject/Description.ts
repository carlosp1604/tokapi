import { DescriptionValidator } from '~/modules/Shared/Domain/Validator/DescriptionValidator.ts'
import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'

export class Description {
  public readonly description: string

  private constructor (description: string) {
    this.description = description
  }

  public static from (description: string): Description {
    const isValidDescription = new DescriptionValidator().validate(description)

    if (!isValidDescription) {
      throw ValueObjectDomainException.invalidDescription(description)
    }

    return new Description(description)
  }
}
