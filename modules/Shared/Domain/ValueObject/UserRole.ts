import { ValueObjectDomainException } from '~/modules/Shared/Domain/ValueObject/ValueObjectDomainException.ts'

export enum UserRoles {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  VERIFIED = 'verified',
}

export class UserRole {
  public readonly role: string

  private constructor (role: string) {
    this.role = role
  }

  public static from (role: string): UserRole {
    if (!Object.values(UserRoles).find(value => role === value)) {
      throw ValueObjectDomainException.invalidUserRole(role)
    }

    return new UserRole(role)
  }
}
