import { DomainException } from '~/modules/Exception/Domain/DomainException.ts'

export class ValueObjectDomainException extends DomainException {
  public static invalidDescriptionId = 'value_object_invalid_description'
  public static invalidNameId = 'value_object_invalid_name'
  public static invalidEmailId = 'value_object_invalid_email'
  public static invalidUsernameId = 'value_object_invalid_username'
  public static invalidUserRoleId = 'value_object_invalid_user_role'
  public static invalidVerificationTokenTypeId = 'value_object_invalid_verification_token_type'

  // eslint-disable-next-line no-useless-constructor
  private constructor (message: string, id: string) {
    super(message, id)
  }

  public static invalidDescription (description: string): ValueObjectDomainException {
    return new ValueObjectDomainException(`Description ${description} is not valid`, this.invalidDescriptionId)
  }

  public static invalidName (name: string): ValueObjectDomainException {
    return new ValueObjectDomainException(`Name ${name} is not valid`, this.invalidNameId)
  }

  public static invalidEmail (email: string): ValueObjectDomainException {
    return new ValueObjectDomainException(`Email ${email} is not valid`, this.invalidEmailId)
  }

  public static invalidUsername (username: string): ValueObjectDomainException {
    return new ValueObjectDomainException(`Username ${username} is not valid`, this.invalidUsernameId)
  }

  public static invalidUserRole (userRole: string): ValueObjectDomainException {
    return new ValueObjectDomainException(`User role ${userRole} is not valid`, this.invalidUserRoleId)
  }

  public static invalidVerificationTokenType (type: string): ValueObjectDomainException {
    return new ValueObjectDomainException(`Verification token type ${type} is not valid`, this.invalidVerificationTokenTypeId)
  }
}
