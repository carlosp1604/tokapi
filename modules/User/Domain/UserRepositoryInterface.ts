import { User } from './User.ts'

export interface UserRepositoryInterface {
  /**
   * Find a User given its username
   * @param username User's username
   * @return User if found or null
   */
  findByUsername(username: User['username']): Promise<User | null>
}
