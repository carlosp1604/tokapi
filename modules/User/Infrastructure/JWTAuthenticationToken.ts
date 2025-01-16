import { AuthenticationTokenService } from '~/modules/User/Domain/AuthenticationTokenService.ts'
import jwt from 'jsonwebtoken'

export class JWTAuthenticationToken implements AuthenticationTokenService {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    private secret: string,
    private expireMs: number,
    private algorithm: string
  ) {}

  /**
   * Generate an authentication token given an input value
   * @param value String value
   * @return Authentication Token
   */
  public async generate (value: string): Promise<string> {
    return await Promise.resolve(jwt.sign(value, this.secret, { algorithm: this.algorithm, expiresIn: this.expireMs }))
  }
}
