export type AuthenticationTokenPayload = object

export interface AuthenticationTokenService {
  /**
   * Generate an authentication token given a payload
   * @param payload Payload to sign
   * @return Authentication Token
   */
  generate(payload: AuthenticationTokenPayload): Promise<string>
}
