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
}
