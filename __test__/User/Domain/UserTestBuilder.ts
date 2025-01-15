import { Name } from '~/modules/Shared/Domain/ValueObject/Name.ts'
import { Username } from '~/modules/Shared/Domain/ValueObject/Username.ts'
import { Email } from '~/modules/Shared/Domain/ValueObject/Email.ts'
import { UserRole } from '~/modules/Shared/Domain/ValueObject/UserRole.ts'
import { Description } from '~/modules/Shared/Domain/ValueObject/Description.ts'
import { User } from '~/modules/User/Domain/User.ts'

export class UserTestBuilder {
  private id = 'test-id'
  private name = Name.from('Test Name')
  private description: Description | null = null
  private username = Username.from('test_username')
  private email = Email.from('example@email.com')
  private imageUrl: string | null = null
  private role = UserRole.from('user')
  private viewsCount = 0
  private following = 0
  private followers = 0
  private publicLikes = true
  private publicSaved = true
  private publicShared = true
  private publicProfile = true
  private password = 'hashedpassword'
  private createdAt = new Date()
  private updatedAt = new Date()
  private deletedAt: Date | null = null

  public withId (id: string): UserTestBuilder {
    this.id = id

    return this
  }

  public withName (name: Name): UserTestBuilder {
    this.name = name

    return this
  }

  public withDescription (description: Description | null): UserTestBuilder {
    this.description = description

    return this
  }

  public withUsername (username: Username): UserTestBuilder {
    this.username = username

    return this
  }

  public withEmail (email: Email): UserTestBuilder {
    this.email = email

    return this
  }

  public withImageUrl (imageUrl: string | null): UserTestBuilder {
    this.imageUrl = imageUrl

    return this
  }

  public withRole (role: UserRole): UserTestBuilder {
    this.role = role

    return this
  }

  public withViewsCount (viewsCount: number): UserTestBuilder {
    this.viewsCount = viewsCount

    return this
  }

  public withFollowing (following: number): UserTestBuilder {
    this.following = following

    return this
  }

  public withFollowers (followers: number): UserTestBuilder {
    this.followers = followers

    return this
  }

  public withPublicLikes (publicLikes: boolean): UserTestBuilder {
    this.publicLikes = publicLikes

    return this
  }

  public withPublicSaved (publicSaved: boolean): UserTestBuilder {
    this.publicSaved = publicSaved

    return this
  }

  public withPublicShared (publicShared: boolean): UserTestBuilder {
    this.publicShared = publicShared

    return this
  }

  public withPublicProfile (publicProfile: boolean): UserTestBuilder {
    this.publicProfile = publicProfile

    return this
  }

  public withPassword (password: string): UserTestBuilder {
    this.password = password

    return this
  }

  public withCreatedAt (date: Date): UserTestBuilder {
    this.createdAt = date

    return this
  }

  public withUpdatedAt (date: Date): UserTestBuilder {
    this.updatedAt = date

    return this
  }

  public withDeletedAt (date: Date | null): UserTestBuilder {
    this.deletedAt = date

    return this
  }

  public build (): User {
    return new User(
      this.id,
      this.name,
      this.description,
      this.username,
      this.email,
      this.imageUrl,
      this.role,
      this.viewsCount,
      this.following,
      this.followers,
      this.publicLikes,
      this.publicSaved,
      this.publicShared,
      this.publicProfile,
      this.password,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    )
  }
}
