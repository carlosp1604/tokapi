import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { User } from '~/modules/User/Domain/User.ts'
import { prisma } from '~/persistence/prisma.ts'
import { PrismaUserModelTranslator } from '~/modules/User/Infrastructure/PrismaUserModelTranslator.ts'
import { VerificationToken, VerificationTokenType } from '~/modules/User/Domain/VerificationToken.ts'
import {
  PrismaVerificationTokenModelTranslator
} from '~/modules/User/Infrastructure/PrismaVerificationTokenModelTranslator.ts'

export class MysqlUserRepository implements UserRepositoryInterface {
  /**
   * Find a User given its username
   * @param username User's username
   * @return User if found or null
   */
  public async findByUsername (username: User['username']): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        username,
        deletedAt: null,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserModelTranslator.toDomain(user)
  }

  /**
   * Decide whether a User exists given its username
   * @param username User's username
   * @return true if found or false
   */
  public async existsByUsername (username: User['username']): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        username,
        deletedAt: null,
      },
    })

    return user !== null
  }

  /**
   * Decide whether a User exists given its email
   * @param email User's email
   * @return true if found or false
   */
  public async existsByEmail (email: User['email']): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })

    return user !== null
  }

  /**
   * Find a create account verification token from an email
   * @param email User's email
   * @return Verification Token if found or null
   */
  public async findCreateAccountToken (email: User['email']): Promise<VerificationToken | null> {
    const token = await prisma.verificationToken.findFirst({
      where: {
        email,
        type: VerificationTokenType.CREATE_ACCOUNT,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!token) {
      return null
    }

    return PrismaVerificationTokenModelTranslator.toDomain(token)
  }

  /**
   * Save user on the database and mark token as used
   * @param user User to save
   * @param token VerificationToken to update
   */
  public async createUser (user: User, token: VerificationToken): Promise<void> {
    const tokenPrismaModel = PrismaVerificationTokenModelTranslator.toDatabase(token)
    const userPrismaModel = PrismaUserModelTranslator.toDatabase(user)

    await prisma.$transaction([
      prisma.user.create({
        data: {
          ...userPrismaModel,
        },
      }),
      prisma.verificationToken.update({
        where: {
          id: tokenPrismaModel.id,
        },
        data: {
          updatedAt: tokenPrismaModel.updatedAt,
          usedAt: tokenPrismaModel.usedAt,
        },
      }),
    ])
  }
}
