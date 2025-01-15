import { Validator } from '~/modules/Shared/Domain/Validator/Validator.ts'

export class NameValidator implements Validator<string> {
  private nameMinLength = 4
  private nameMaxLength = 64

  public validate (name: string): boolean {
    return name.length >= this.nameMinLength &&
      name.length <= this.nameMaxLength
  }
}
