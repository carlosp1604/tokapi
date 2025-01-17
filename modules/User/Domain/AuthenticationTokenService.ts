export interface AuthenticationTokenService {
  /**
   * Generate an authentication token given a payload
   * @param payload JSON payload
   * @return Authentication Token
   */
  generate(payload: JSON): Promise<string>
}
