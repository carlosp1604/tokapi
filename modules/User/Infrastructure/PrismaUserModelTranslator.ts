import { User } from '~/modules/User/Domain/User.ts'
import { User as PrismaUserModel } from '@prisma/client'
import { UserRole } from '~/modules/Shared/Domain/ValueObject/UserRole.ts'
import { Name } from '~/modules/Shared/Domain/ValueObject/Name.ts'
import { Description } from '~/modules/Shared/Domain/ValueObject/Description.ts'
import { Username } from '~/modules/Shared/Domain/ValueObject/Username.ts'
import { Email } from '~/modules/Shared/Domain/ValueObject/Email.ts'

export class PrismaUserModelTranslator {
  public static toDomain (prismaUserModel: PrismaUserModel) {
    let deletedAt: Date | null = null

    if (prismaUserModel.deletedAt !== null) {
      deletedAt = prismaUserModel.deletedAt
    }

    return new User(
      prismaUserModel.id,
      Name.from(prismaUserModel.name),
      prismaUserModel.description ? Description.from(prismaUserModel.description) : null,
      Username.from(prismaUserModel.username),
      Email.from(prismaUserModel.email),
      prismaUserModel.imageUrl,
      UserRole.from(prismaUserModel.role),
      Number(prismaUserModel.viewsCount),
      Number(prismaUserModel.following),
      Number(prismaUserModel.followers),
      prismaUserModel.publicLikes,
      prismaUserModel.publicSaved,
      prismaUserModel.publicShared,
      prismaUserModel.publicProfile,
      prismaUserModel.password,
      prismaUserModel.createdAt,
      prismaUserModel.updatedAt,
      deletedAt
    )
  }

  public static toDatabase (domain: User): PrismaUserModel {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      username: domain.username,
      email: domain.email,
      imageUrl: domain.imageUrl,
      role: domain.role,
      viewsCount: BigInt(domain.viewsCount),
      following: BigInt(domain.following),
      followers: BigInt(domain.followers),
      publicLikes: domain.publicLikes,
      publicSaved: domain.publicSaved,
      publicProfile: domain.publicProfile,
      publicShared: domain.publicShared,
      password: domain.password,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt,
    }
  }
}
