import jwt, { JwtPayload } from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { AuthenticationToken } from '~/modules/User/Domain/AuthenticationToken.ts'
import {
  AuthenticationTokenPayload,
  AuthenticationTokenService
} from '~/modules/User/Domain/AuthenticationTokenService.ts'

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
   * @return string with signed authentication token
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

  /**
   * Verify an authentication token given its value
   * @param token Token to verify
   * @return Authentication Token
   */
  public async verify (token: string): Promise<AuthenticationToken> {
    const authenticationToken = await jwt.verify(
      token,
      this.secret, {
        algorithms: [this.algorithm as jwt.Algorithm],
        issuer: this.issuer,
      }
    ) as JwtPayload

    return new AuthenticationToken(
      authenticationToken.id,
      authenticationToken.name,
      authenticationToken.username,
      authenticationToken.role,
      authenticationToken.iat,
      authenticationToken.exp,
      authenticationToken.iss,
      authenticationToken.jit
    )
  }
}
