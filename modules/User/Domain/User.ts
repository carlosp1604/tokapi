import { randomUUID } from 'node:crypto'
import { PasswordValidator } from '~/modules/Shared/Domain/Validator/PasswordValidator.ts'
import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import { Result } from '~/modules/Shared/Domain/Result.ts'
import { UserDomainError } from '~/modules/User/Domain/UserDomainError.ts'
import { UserRole, UserRoles } from '~/modules/Shared/Domain/ValueObject/UserRole.ts'
import { Description } from '~/modules/Shared/Domain/ValueObject/Description.ts'
import { Email } from '~/modules/Shared/Domain/ValueObject/Email.ts'
import { Name } from '~/modules/Shared/Domain/ValueObject/Name.ts'
import { Username } from '~/modules/Shared/Domain/ValueObject/Username.ts'

export class User {
  public readonly id: string
  private readonly _name: Name
  private readonly _description: Description | null
  private readonly _username: Username
  private readonly _email: Email
  public readonly imageUrl: string | null
  private readonly _role: UserRole
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
    name: Name,
    description: Description | null,
    username: Username,
    email: Email,
    imageUrl: string | null,
    role: UserRole,
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
    this.id = id
    this._name = name
    this._description = description
    this._email = email
    this._username = username
    this.imageUrl = imageUrl
    this.password = hashedPassword
    this._role = role
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

  get name (): string {
    return this._name.name
  }

  get description (): string | null {
    if (!this._description) {
      return null
    }

    return this._description.description
  }

  get username (): string {
    return this._username.username
  }

  get email (): string {
    return this._email.email
  }

  get role (): string {
    return this._role.role
  }

  public static async initializeUser (
    name: string,
    email: string,
    username: string,
    password: string,
    cryptoService: CryptoServiceInterface
  ): Promise<Result<User, UserDomainError[]>> {
    const errors: UserDomainError[] = []

    let nameValueObject: Name | null = null
    let usernameValueObject: Username | null = null
    let emailValueObject: Email | null = null

    try {
      nameValueObject = Name.from(name)
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_exception: unknown) {
      errors.push(UserDomainError.invalidName(name))
    }

    try {
      usernameValueObject = Username.from(username)
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_exception: unknown) {
      errors.push(UserDomainError.invalidUsername(username))
    }

    try {
      emailValueObject = Email.from(email)
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (_exception: unknown) {
      errors.push(UserDomainError.invalidEmail(email))
    }

    const isPasswordValid = (new PasswordValidator().validate(password))

    if (!isPasswordValid) {
      errors.push(UserDomainError.invalidPassword(password))
    }

    if (!nameValueObject || !usernameValueObject || !emailValueObject || !isPasswordValid) {
      return { success: false, error: errors }
    }

    const hashedPassword = await cryptoService.hash(password)
    const userUuid = randomUUID()
    const nowDate = new Date()

    const user = new User(
      userUuid,
      nameValueObject,
      null,
      usernameValueObject,
      emailValueObject,
      null,
      UserRole.from(UserRoles.USER),
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
      null
    )

    return { success: true, value: user }
  }
}
