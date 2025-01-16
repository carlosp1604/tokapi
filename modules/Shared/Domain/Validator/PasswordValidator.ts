import { Validator } from '~/modules/Shared/Domain/Validator/Validator.ts'

export class PasswordValidator implements Validator<string> {
  private validPasswordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,64}$/

  public validate (password: string): boolean {
    return !(password.match(this.validPasswordFormat) === null)
  }
}
