export class AuthenticationToken {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly username: string,
    public readonly role: string,
    public readonly iat: number,
    public readonly exp: number,
    public readonly iss: string,
    public readonly jit: string
  ) {}
}
