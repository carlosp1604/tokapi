import { Result } from '~/modules/Shared/Domain/Result.ts'
import { AuthenticationTokenService } from '~/modules/User/Domain/AuthenticationTokenService.ts'
import { UserApplicationDto } from '~/modules/User/Application/Dtos/UserApplicationDto.ts'
import {
  CreateAuthenticationTokenApplicationResponseDto
} from '~/modules/User/Application/Dtos/CreateAuthenticationTokenApplicationResponseDto.ts'

export class CreateAuthenticationToken {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    private readonly authenticationTokenService: AuthenticationTokenService,
    private readonly expireSeconds: number
  ) {}

  public async create (
    userApplicationDto: UserApplicationDto
  ): Promise<Result<CreateAuthenticationTokenApplicationResponseDto, Error>> {
    const payload = {
      name: userApplicationDto.name,
      username: userApplicationDto.username,
      role: userApplicationDto.role,
    }

    try {
      const token = await this.authenticationTokenService.generate(JSON.parse(JSON.stringify(payload)))

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
        error: new Error('Aaaaaaaaaaa'),
      }
    }
  }
}
