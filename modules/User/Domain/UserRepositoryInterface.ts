import { User } from './User.ts'
import { VerificationToken } from '~/modules/User/Domain/VerificationToken.ts'

export interface UserRepositoryInterface {
  /**
   * Find a User given its username
   * @param username User's username
   * @return User if found or null
   */
  findByUsername(username: User['username']): Promise<User | null>

  /**
   * Decide whether a User exists given its username
   * @param username User's username
   * @return true if found or false
   */
  existsByUsername(username: User['username']): Promise<boolean>

  /**
   * Decide whether a User exists given its email
   * @param email User's email
   * @return true if found or false
   */
  existsByEmail(email: User['email']): Promise<boolean>

  /**
   * Find a create account verification token from an email
   * @param email User's email
   * @return Verification Token if found or null
   */
  findCreateAccountToken(email: User['email']): Promise<VerificationToken | null>

  /**
   * Save user on the database and mark token as used
   * @param user User to save
   * @param token VerificationToken to update
   */
  createUser(user: User, token: VerificationToken): Promise<void>
}
