import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import {
  ValidateAuthenticationToken
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationToken.ts'
import { mock } from 'jest-mock-extended'
import { NextFunction, Request } from 'express'
import { authenticate } from '~/modules/User/Application/Middleware/AuthenticationMiddleware.ts'
import { container } from '~/awilix.container.ts'
import { asFunction } from 'awilix'
import { UNAUTHORIZED_ACCESS } from '~/modules/Shared/Infrastructure/Api/ApiExceptionCodes.ts'
import { getMockReq, getMockRes } from '@jest-mock/express'
import {
  ValidateAuthenticationTokenApplicationError
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationTokenApplicationError.ts'

// FIXME: We cannot mock a string value so this test is not pure at all
describe('AuthenticationMiddleware', () => {
  const mockedValidateUseCase = mock<ValidateAuthenticationToken>()
  const mockedNextFunction = jest.fn() as NextFunction

  container.register('validateAuthenticationToken', asFunction(() => mockedValidateUseCase))

  beforeEach(() => {
    mockedValidateUseCase.validate.mockResolvedValue({
      success: true,
      value: {
        id: 'test_user_id',
        username: 'test_username',
        name: 'Test Name',
        role: 'test_role',
      },
    })
  })

  describe('happy path', () => {
    const { res } = getMockRes()
    const mockedRequest = {
      headers: {
        authorization: 'Bearer test_token',
      },
    } as Request

    it('should call use-case correctly', async () => {
      await authenticate(mockedRequest, res, mockedNextFunction)

      expect(mockedValidateUseCase.validate).toHaveBeenCalledWith('test_token')
    })

    it('should return correct data', async () => {
      await authenticate(mockedRequest, res, mockedNextFunction)

      // eslint-disable-next-line dot-notation
      expect(mockedRequest['token']).toStrictEqual({
        id: 'test_user_id',
        username: 'test_username',
        name: 'Test Name',
        role: 'test_role',
      })
    })
  })

  describe('when there are errors', () => {
    const { res } = getMockRes({
      status: jest.fn(),
      json: jest.fn(),
    })

    it('should call response with 401 status if authorization header is not present', async () => {
      const mockedRequest = getMockReq({
        headers: {},
      })

      await authenticate(mockedRequest, res, mockedNextFunction)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        code: UNAUTHORIZED_ACCESS,
        message: 'Authorization header is missing',
      })
    })

    it('should call response with 401 status if authorization header is not valid', async () => {
      const mockedRequest = getMockReq({
        headers: {
          authorization: 'test_token',
        },
      })

      await authenticate(mockedRequest, res, mockedNextFunction)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        code: UNAUTHORIZED_ACCESS,
        message: 'Invalid Authorization Header',
      })
    })

    it('should call response with 401 status if token is not valid', async () => {
      const mockedRequest = getMockReq({
        headers: {
          authorization: 'Bearer invalid_test_token',
        },
      })

      mockedValidateUseCase.validate.mockResolvedValue({
        success: false,
        error: ValidateAuthenticationTokenApplicationError.invalidToken(),
      })

      await authenticate(mockedRequest, res, mockedNextFunction)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        code: UNAUTHORIZED_ACCESS,
        message: 'Provided JWT Token is not valid. Authentication is required',
      })
    })
  })
})
