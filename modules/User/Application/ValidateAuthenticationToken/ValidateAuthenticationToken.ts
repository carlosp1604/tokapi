import { Result } from '~/modules/Shared/Domain/Result.ts'
import { AuthenticationTokenService } from '~/modules/User/Domain/AuthenticationTokenService.ts'
import { AuthenticationTokenApplicationDto } from '~/modules/User/Application/Dtos/AuthenticationTokenApplicationDto.ts'
import {
  AuthenticationTokenApplicationDtoTranslator
} from '~/modules/User/Application/Translators/AuthenticationTokenApplicationDtoTranslator.ts'
import {
  ValidateAuthenticationTokenApplicationError
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationTokenApplicationError.ts'

export class ValidateAuthenticationToken {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly authenticationTokenService: AuthenticationTokenService) {}

  public async validate (
    authenticationToken: string
  ): Promise<Result<AuthenticationTokenApplicationDto, ValidateAuthenticationTokenApplicationError>> {
    try {
      const token = await this.authenticationTokenService.verify(authenticationToken)

      return {
        success: true,
        value: AuthenticationTokenApplicationDtoTranslator.fromDomain(token),
      }
    } catch (exception: unknown) {
      console.error(exception)

      return { success: false, error: ValidateAuthenticationTokenApplicationError.invalidToken() }
    }
  }
}
