import { AuthenticationToken } from '~/modules/User/Domain/AuthenticationToken.ts'

export type AuthenticationTokenPayload = object

export interface AuthenticationTokenService {
  /**
   * Generate an authentication token given a payload
   * @param payload Payload to sign
   * @return string with signed authentication token
   */
  generate(payload: AuthenticationTokenPayload): Promise<string>

  /**
   * Verify an authentication token given its value
   * @param token Token to verify
   * @return Authentication Token
   */
  verify(token: string): Promise<AuthenticationToken>
}
