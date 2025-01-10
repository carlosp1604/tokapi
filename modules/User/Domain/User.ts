import { EmailValidator } from '~/modules/Shared/Domain/Validator/EmailValidator.ts'
import { UsernameValidator } from '~/modules/Shared/Domain/Validator/UsernameValidator.ts'
import { UserDomainException } from '~/modules/User/Domain/UserDomainException.ts'

export class User {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public readonly username: string
  public readonly email: string
  public readonly imageUrl: string | null
  public readonly role: string
  public readonly viewsCount: number
  public readonly following: number
  public readonly followers: number
  public readonly publicLikes: boolean
  public readonly publicSaved: boolean
  public readonly publicShared: boolean
  public readonly publicProfile: boolean
  private password: string
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
    this.role = role
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
}
