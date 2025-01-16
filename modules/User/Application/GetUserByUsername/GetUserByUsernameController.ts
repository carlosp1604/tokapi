import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { container } from '~/awilix.container.ts'
import { GetUserByUsername } from '~/modules/User/Application/GetUserByUsername/GetUserByUsername.ts'
import {
  GetUserByUsernameApplicationError
} from '~/modules/User/Application/GetUserByUsername/GetUserByUsernameApplicationError.ts'
import {
  BAD_REQUEST_USERNAME_REQUIRED,
  INVALID_USERNAME_PARAM, SERVER_ERROR, USER_NOT_FOUND
} from '~/modules/User/Infrastructure/Api/ApiExceptionCodes.ts'

export class GetUserByUsernameController {
  public async get (request: Request, response: Response) {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      return response.status(400).send({
        code: BAD_REQUEST_USERNAME_REQUIRED,
        message: 'Param username is required and must be a string',
        errors: result.array(),
      })
    }

    const useCase = container.resolve<GetUserByUsername>('getUserByUsername')
    const getUserResult = await useCase.get(request.params.username)

    if (!getUserResult.success) {
      return this.handleErrors(getUserResult.error, response)
    }

    return response.status(200).json(getUserResult.value)
  }

  private handleErrors (error: GetUserByUsernameApplicationError, response: Response) {
    if (error.id === GetUserByUsernameApplicationError.invalidUsernameId) {
      return response.status(422).send({
        code: INVALID_USERNAME_PARAM,
        message: error.message,
      })
    }

    if (error.id === GetUserByUsernameApplicationError.userNotFoundId) {
      return response.status(404).send({
        code: USER_NOT_FOUND,
        message: error.message,
      })
    }

    return response.status(500).send({
      code: SERVER_ERROR,
      message: 'Something went wrong while processing request',
    })
  }
}
