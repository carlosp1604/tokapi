export interface AuthenticationTokenService {
  /**
   * Generate an authentication token given an input value
   * @param value String value
   * @return Authentication Token
   */
  generate(value: string): Promise<string>
}
