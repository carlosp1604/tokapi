import { Result } from '~/modules/Shared/Domain/Result.ts'
import {
  AuthenticationTokenPayload,
  AuthenticationTokenService
} from '~/modules/User/Domain/AuthenticationTokenService.ts'
import { UserApplicationDto } from '~/modules/User/Application/Dtos/UserApplicationDto.ts'
import {
  CreateAuthenticationTokenApplicationResponseDto
} from '~/modules/User/Application/Dtos/CreateAuthenticationTokenApplicationResponseDto.ts'
import {
  CreateAuthenticationTokenApplicationError
} from '~/modules/User/Application/CreateAuthenticationToken/CreateAuthenticationTokenApplicationError.ts'

export class CreateAuthenticationToken {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    private readonly authenticationTokenService: AuthenticationTokenService,
    private readonly expireSeconds: number
  ) {}

  public async create (
    userApplicationDto: UserApplicationDto
  ): Promise<Result<CreateAuthenticationTokenApplicationResponseDto, CreateAuthenticationTokenApplicationError>> {
    const payload: AuthenticationTokenPayload = {
      id: userApplicationDto.id,
      name: userApplicationDto.name,
      username: userApplicationDto.username,
      role: userApplicationDto.role,
    }

    try {
      const token = await this.authenticationTokenService.generate(payload)

      return {
        success: true,
        // If this response need more fields we should look for a translator
        value: {
          token,
          type: 'JWT',
          expiresIn: this.expireSeconds,
        },
      }
    } catch (exception: unknown) {
      console.error(exception)

      return {
        success: false,
        error: CreateAuthenticationTokenApplicationError.cannotGenerateToken(userApplicationDto.id),
      }
    }
  }
}
