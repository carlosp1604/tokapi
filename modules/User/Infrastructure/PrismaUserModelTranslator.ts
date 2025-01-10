import { User } from '~/modules/User/Domain/User.ts'
import { User as PrismaUserModel } from '@prisma/client'

export class PrismaUserModelTranslator {
  public static toDomain (prismaUserModel: PrismaUserModel) {
    let deletedAt: Date | null = null

    if (prismaUserModel.deletedAt !== null) {
      deletedAt = prismaUserModel.deletedAt
    }

    return new User(
      prismaUserModel.id,
      prismaUserModel.name,
      prismaUserModel.description,
      prismaUserModel.username,
      prismaUserModel.email,
      prismaUserModel.imageUrl,
      prismaUserModel.role,
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
      email: domain.username,
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
