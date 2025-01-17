import {
  AuthenticationTokenPayload,
  AuthenticationTokenService
} from '~/modules/User/Domain/AuthenticationTokenService.ts'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

export class JWTAuthenticationToken implements AuthenticationTokenService {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    private secret: string,
    private expireSeconds: number,
    private algorithm: string,
    private issuer: string
  ) {}

  /**
   * Generate an authentication token given a payload
   * @param payload Payload to sign
   * @return Authentication Token
   */
  public generate (payload: AuthenticationTokenPayload): Promise<string> {
    return Promise.resolve(jwt.sign(
      payload,
      this.secret, {
        algorithm: this.algorithm as jwt.Algorithm,
        expiresIn: this.expireSeconds,
        jwtid: randomUUID(),
        issuer: this.issuer,
      }))
  }
}
