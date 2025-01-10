import { UserApplicationDto } from '~/modules/User/Application/Dtos/UserApplicationDto.ts'
import { User } from '~/modules/User/Domain/User.ts'

export class UserApplicationDtoTranslator {
  public static fromDomain (domain: User): UserApplicationDto {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      username: domain.username,
      email: domain.email,
      imageUrl: domain.imageUrl,
      role: domain.role,
      viewsCount: domain.viewsCount,
      following: domain.following,
      followers: domain.followers,
      publicLikes: domain.publicLikes,
      publicSaved: domain.publicSaved,
      publicShared: domain.publicShared,
      publicProfile: domain.publicProfile,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    }
  }
}
