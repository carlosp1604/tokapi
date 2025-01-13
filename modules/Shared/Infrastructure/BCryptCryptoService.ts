import { CryptoServiceInterface } from '~/modules/Shared/Domain/CryptoServiceInterface.ts'
import bcrypt from 'bcrypt'

export class BCryptCryptoService implements CryptoServiceInterface {
  /**
   * Hash a string value
   * @param value String value
   * @return Hashed string
   */
  public hash (value: string): Promise<string> {
    return bcrypt.hash(value, 10)
  }

  /**
   * Compare a hashed value and a clear string to decide whether they match
   * @param value String clear value
   * @param hash String hashed value
   * @return true if match or false
   */
  public matchHash (value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash)
  }
}
