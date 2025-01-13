import { EmailValidator } from '~/modules/Shared/Domain/Validator/EmailValidator.ts'
import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'
import { UserDomainException } from '~/modules/User/Domain/UserDomainException.ts'
import { randomUUID } from 'node:crypto'
import { PasswordValidator } from '~/modules/Shared/Domain/Validator/PasswordValidator.ts'
import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import { Result } from '~/modules/Shared/Domain/Result.ts'
import { UserDomainError } from '~/modules/User/Domain/UserDomainError.ts'

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  VERIFIED = 'verified',
}

export class User {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public readonly username: string
  public readonly email: string
  public readonly imageUrl: string | null
  public readonly role: UserRole
  public readonly viewsCount: number
  public readonly following: number
  public readonly followers: number
  public readonly publicLikes: boolean
  public readonly publicSaved: boolean
  public readonly publicShared: boolean
  public readonly publicProfile: boolean
  public readonly password: string
  public readonly createdAt: Date
  public readonly updatedAt: Date
  public readonly deletedAt: Date | null

  public constructor (
    id: string,
    name: string,
    description: string,
    username: string,
    email: string,
    imageUrl: string | null,
    role: string,
    viewsCount: number,
    following: number,
    followers: number,
    publicLikes: boolean,
    publicSaved: boolean,
    publicShared: boolean,
    publicProfile: boolean,
    hashedPassword: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ) {
    const isEmailValid = (new EmailValidator()).validate(email)
    const isUsernameValid = (new UsernameValidator()).validate(username)

    if (!isEmailValid && !isUsernameValid) {
      throw UserDomainException.invalidUsernameAndEmail(username, email)
    }

    if (!isEmailValid) {
      throw UserDomainException.invalidEmail(email)
    }

    if (!isUsernameValid) {
      throw UserDomainException.invalidUsername(username)
    }

    this.id = id
    this.name = name
    this.description = description
    this.email = email
    this.username = username
    this.imageUrl = imageUrl
    this.password = hashedPassword
    this.role = this.validateUserRole(role)
    this.viewsCount = viewsCount
    this.following = following
    this.followers = followers
    this.publicLikes = publicLikes
    this.publicSaved = publicSaved
    this.publicShared = publicShared
    this.publicProfile = publicProfile
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  private validateUserRole (userRole: string): UserRole {
    if (!Object.values(UserRole).find(value => userRole === value)) {
      throw UserDomainException.invalidRole(userRole)
    }

    return userRole as UserRole
  }

  public static async initializeUser (
    name: string,
    email: string,
    username: string,
    password: string,
    cryptoService: CryptoServiceInterface
  ): Promise<Result<User, UserDomainError>> {
    const isPasswordValid = (new PasswordValidator().validate(password))

    if (!isPasswordValid) {
      return { success: false, error: UserDomainError.invalidPassword(password) }
    }

    const hashedPassword = await cryptoService.hash(password)
    const userUuid = randomUUID()
    const nowDate = new Date()

    try {
      const user = new User(
        userUuid,
        name,
        '',
        username,
        email,
        null,
        UserRole.USER,
        0,
        0,
        0,
        false,
        false,
        false,
        true,
        hashedPassword,
        nowDate,
        nowDate,
        nowDate
      )

      return { success: true, value: user }
    } catch (exception: unknown) {
      if (!(exception instanceof UserDomainException)) {
        throw exception
      }

      return { success: false, error: exception }
    }
  }
}
