import { Request, Response } from 'express'
import { container } from '~/awilix.container.ts'
import {
  BAD_REQUEST_INVALID_BODY,
  INVALID_IDENTIFIER_PARAM,
  SERVER_ERROR, UNAUTHORIZED_ACCESS
} from '~/modules/User/Infrastructure/Api/ApiExceptionCodes.ts'
import { LoginUser } from '~/modules/User/Application/LoginUser/LoginUser.ts'
import { LoginUserApplicationError } from '~/modules/User/Application/LoginUser/LoginUserApplicationError.ts'
import { validationResult } from 'express-validator'
import {
  CreateAuthenticationToken
} from '~/modules/User/Application/CreateAuthenticationToken/CreateAuthenticationToken.ts'

export class LoginUserController {
  public async create (request: Request, response: Response) {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      return response.status(400).send({
        code: BAD_REQUEST_INVALID_BODY,
        message: 'Body is not valid',
        errors: result.array(),
      })
    }

    const loginUseCase = container.resolve<LoginUser>('loginUser')
    const loginUserResult = await loginUseCase.login(request.body)

    if (!loginUserResult.success) {
      return this.handleLoginErrors(loginUserResult.error, response)
    }

    const createAuthTokenUseCase = container.resolve<CreateAuthenticationToken>('createAuthenticationToken')

    const createAuthenticationTokenResult = await createAuthTokenUseCase.create(loginUserResult.value)

    if (!createAuthenticationTokenResult.success) {
      return response.status(500).json({
        code: SERVER_ERROR,
        message: 'Something went wrong while processing your request. Try again later',
      })
    }

    return response.status(200).json(createAuthenticationTokenResult.value)
  }

  private handleLoginErrors (error: LoginUserApplicationError, response: Response) {
    switch (error.id) {
      case LoginUserApplicationError.invalidIdentifierId:
        return response.status(422).json({
          code: INVALID_IDENTIFIER_PARAM,
          message: error.message,
        })

      case LoginUserApplicationError.userPasswordDoesNotMatchId:
      case LoginUserApplicationError.userNotFoundId:
        return response.status(401).json({
          code: UNAUTHORIZED_ACCESS,
          message: 'Combination user/password does not match',
        })

      default:
        return response.status(500).json({
          code: SERVER_ERROR,
          message: 'Something went wrong while processing your request. Try again later',
        })
    }
  }
}
