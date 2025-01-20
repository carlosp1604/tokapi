import { container } from '~/awilix.container.ts'
import { UNAUTHORIZED_ACCESS } from '~/modules/Shared/Infrastructure/Api/ApiExceptionCodes.ts'
import { NextFunction, Request, Response } from 'express'
import {
  ValidateAuthenticationToken
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationToken.ts'

export const authenticate = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader) {
    return sendUnauthorizedError(response, 'Authorization header is missing')
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    return sendUnauthorizedError(response, 'Invalid Authorization Header')
  }

  const authenticationToken = authorizationHeader.substring(7, authorizationHeader.length)

  const useCase = container.resolve<ValidateAuthenticationToken>('validateAuthenticationToken')

  const validateTokenResult = await useCase.validate(authenticationToken)

  if (!validateTokenResult.success) {
    return sendUnauthorizedError(validateTokenResult.error, 'Provided JWT Token is not valid. Authentication is required')
  }

  request.token = validateTokenResult.value
  next()
}

const sendUnauthorizedError = (response: Response, message: string): void => {
  return response.status(401).send({
    code: UNAUTHORIZED_ACCESS,
    message,
  })
}
