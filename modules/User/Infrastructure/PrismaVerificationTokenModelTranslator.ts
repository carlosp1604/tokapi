import { VerificationToken as PrismaVerificationTokenModel } from '@prisma/client'
import { VerificationToken } from '~/modules/User/Domain/VerificationToken.ts'

export class PrismaUserModelTranslator {
  public static toDomain (prismaVerificationTokenModel: PrismaVerificationTokenModel) {
    let usedAt: Date | null = null

    if (prismaVerificationTokenModel.deletedAt !== null) {
      usedAt = prismaVerificationTokenModel.usedAt
    }

    return new VerificationToken(
      prismaVerificationTokenModel.id,
      prismaVerificationTokenModel.token,
      prismaVerificationTokenModel.email,
      prismaVerificationTokenModel.type,
      prismaVerificationTokenModel.expiresAt,
      prismaVerificationTokenModel.createdAt,
      prismaVerificationTokenModel.updatedAt,
      usedAt
    )
  }

  public static toDatabase (domain: VerificationToken): PrismaVerificationTokenModel {
    return {
      id: domain.id,
      token: domain.token,
      email: domain.email,
      type: domain.type,
      expiresAt: domain.type,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      usedAt: domain.usedAt,
    }
  }
}
