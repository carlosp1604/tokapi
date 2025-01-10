import { UserRepositoryInterface } from '~/modules/User/Domain/UserRepositoryInterface.ts'
import { User } from '~/modules/User/Domain/User.ts'
import { prisma } from '~/persistence/prisma.ts'
import { PrismaUserModelTranslator } from '~/modules/User/Infrastructure/PrismaUserModelTranslator.ts'

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
}
