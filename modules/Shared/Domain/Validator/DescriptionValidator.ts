import { Validator } from '~/modules/Shared/Domain/Validator/Validator.ts'

export class DescriptionValidator implements Validator<string> {
  private descriptionMinLength = 1
  private descriptionMaxLength = 256

  public validate (description: string): boolean {
    return description.length >= this.descriptionMinLength &&
      description.length <= this.descriptionMaxLength
  }
}
