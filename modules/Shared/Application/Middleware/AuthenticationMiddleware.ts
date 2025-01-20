import { container } from '~/awilix.container.ts'
import { UNAUTHORIZED_ACCESS } from '~/modules/Shared/Infrastructure/Api/ApiExceptionCodes.ts'
import { NextFunction, Request, Response } from 'express'
import {
  ValidateAuthenticationToken
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationToken.ts'
import {
  ValidateAuthenticationTokenApplicationError
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationTokenApplicationError.ts'

export const authenticate = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader) {
    return sendUnauthorizedError(response, 'Authorization header is missing')
  }

  const useCase = container.resolve<ValidateAuthenticationToken>('validateAuthenticationToken')

  const validateTokenResult = await useCase.validate(authorizationHeader)

  if (!validateTokenResult.success) {
    return handleValidateTokenError(validateTokenResult.error, response)
  }

  request.token = validateTokenResult.value
  next()
}

const handleValidateTokenError = (error: ValidateAuthenticationTokenApplicationError, response: Response) => {
  if (error.id === ValidateAuthenticationTokenApplicationError.invalidTokenTypeId) {
    return sendUnauthorizedError(response, 'Invalid Authorization Header')
  }

  return sendUnauthorizedError(response, 'Provided JWT Token is not valid. Authentication is required')
}

const sendUnauthorizedError = (response: Response, message: string): void => {
  return response.status(401).send({
    code: UNAUTHORIZED_ACCESS,
    message,
  })
}
