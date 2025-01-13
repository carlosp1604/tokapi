export class ApplicationError {
  public readonly id: string
  public readonly message: string

  constructor (message: string, id: string) {
    this.message = message
    this.id = id
  }
}
