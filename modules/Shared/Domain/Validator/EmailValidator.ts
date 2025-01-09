import { Validator } from '~/modules/Shared/Domain/Validator/Validator.ts'

export class EmailValidator implements Validator<string> {
  private emailFormat = /^[^@\s]+@[^@\s]+\.[^@\s]{2,63}$/

  public validate (email: string): boolean {
    return email.match(this.emailFormat) !== null
  }
}
