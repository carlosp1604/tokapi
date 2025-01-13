export interface CryptoServiceInterface {
  /**
   * Hash a string value
   * @param value String value
   * @return Hashed string
   */
  hash(value: string): Promise<string>

  /**
   * Compare a hashed value and a clear string to decide whether they match
   * @param value String clear value
   * @param hash String hashed value
   * @return true if match or false
   */
  matchHash(value: string, hash: string): Promise<boolean>
}
