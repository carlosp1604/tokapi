import { DateTime } from 'luxon'

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
  public readonly publicLikes: number
  public readonly publicSaved: number
  public readonly publicShared: number
  public readonly publicProfile: number
  private password: string
  public readonly createdAt: DateTime
  public readonly updatedAt: DateTime
  public readonly deletedAt: DateTime | null

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
    publicLikes: number,
    publicSaved: number,
    publicShared: number,
    publicProfile: number,
    hashedPassword: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    deletedAt: DateTime | null,
  ) {
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

