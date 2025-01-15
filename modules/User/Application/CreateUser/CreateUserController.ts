import { Request, Response } from 'express'
import { container } from '~/awilix.container.ts'
import {
  BAD_REQUEST_INVALID_BODY,
  EMAIL_CONFLICT,
  INVALID_EMAIL_PARAM, INVALID_NAME_PARAM,
  INVALID_PASSWORD_PARAM,
  INVALID_USERNAME_PARAM,
  SERVER_ERROR, TOKEN_NOT_FOUND,
  USERNAME_CONFLICT
} from '~/modules/User/Infrastructure/Api/ApiExceptionCodes.ts'
import { CreateUser } from '~/modules/User/Application/CreateUser/CreateUser.ts'
import {
  CreateUserApplicationError, CreateUserError,
  ErrorType
} from '~/modules/User/Application/CreateUser/CreateUserApplicationError.ts'
import { validationResult } from 'express-validator'

export class CreateUserController {
  public async create (request: Request, response: Response) {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      return response.status(400).send({
        code: BAD_REQUEST_INVALID_BODY,
        message: 'Body is not valid',
        errors: result.array(),
      })
    }

    const useCase = container.resolve<CreateUser>('createUser')
    const getUserResult = await useCase.create(request.body)

    if (!getUserResult.success) {
      return this.handleErrors(getUserResult.error, response)
    }

    return response.status(201).send()
  }

  private handleErrors (error: CreateUserApplicationError, response: Response) {
    if (error.type === ErrorType.VALIDATION) {
      const errors = []

      for (const createUserError of error.errors) {
        if (createUserError.id === CreateUserError.invalidEmailId) {
          errors.push({ code: INVALID_EMAIL_PARAM, message: createUserError.message })
        }

        if (createUserError.id === CreateUserError.invalidUsernameId) {
          errors.push({ code: INVALID_USERNAME_PARAM, message: createUserError.message })
        }

        if (createUserError.id === CreateUserError.invalidNameId) {
          errors.push({ code: INVALID_NAME_PARAM, message: createUserError.message })
        }

        if (createUserError.id === CreateUserError.invalidPasswordId) {
          errors.push({ code: INVALID_PASSWORD_PARAM, message: createUserError.message })
        }
      }

      return response.status(422).json({
        message: 'Cannot process request',
        errors,
      })
    }

    if (error.type === ErrorType.DUPLICATED) {
      const errors = []

      for (const createUserError of error.errors) {
        if (createUserError.id === CreateUserError.emailAlreadyRegisteredId) {
          errors.push({ code: EMAIL_CONFLICT, message: createUserError.message })
        }

        if (createUserError.id === CreateUserError.usernameAlreadyRegisteredId) {
          errors.push({ code: USERNAME_CONFLICT, message: createUserError.message })
        }
      }

      return response.status(409).json({
        message: 'Some parameters are already in use',
        errors,
      })
    }

    if (error.type === ErrorType.NOT_FOUND) {
      return response.status(404).send({
        code: TOKEN_NOT_FOUND,
        message: error.errors[0].message,
      })
    }

    return response.status(500).json({
      code: SERVER_ERROR,
      message: 'Something went wrong while processing request. Try again later',
    })
  }
}
