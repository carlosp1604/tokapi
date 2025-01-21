import { AuthenticationTokenApplicationDto } from '~/modules/User/Application/Dtos/AuthenticationTokenApplicationDto.ts'
import { AuthenticationToken } from '~/modules/User/Domain/AuthenticationToken.ts'

export class AuthenticationTokenApplicationDtoTranslator {
  public static fromDomain (domain: AuthenticationToken): AuthenticationTokenApplicationDto {
    return {
      id: domain.id,
      name: domain.name,
      username: domain.username,
      role: domain.role,
    }
  }
}
