import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import jwt from 'jsonwebtoken'
import { JWTAuthenticationToken } from '~/modules/User/Infrastructure/JWTAuthenticationToken.ts'
import { randomUUID } from 'node:crypto'
import { mockReset } from 'jest-mock-extended'
import { AuthenticationTokenPayload } from '~/modules/User/Domain/AuthenticationTokenService.ts'
import { AuthenticationToken } from '~/modules/User/Domain/AuthenticationToken.ts'

jest.mock('node:crypto')

describe('JWTAuthenticationToken', () => {
  const buildService = () => {
    return new JWTAuthenticationToken(
      'test-secret',
      1000,
      'HS256',
      'test-issuer'
    )
  }

  describe('generate', () => {
    const mockedRandomUUID = jest.mocked(randomUUID)

    beforeEach(() => {
      mockReset(mockedRandomUUID)
      mockedRandomUUID.mockReturnValue('expected-random-uuid-for-token')
    })

    const payload: AuthenticationTokenPayload = { name: 'Test Name', id: 'test-id' }

    it('should call services correctly', async () => {
      const jwtSpy = jest.spyOn(jwt, 'sign')

      const service = buildService()

      await service.generate(payload)

      expect(mockedRandomUUID).toHaveBeenCalled()
      expect(jwtSpy).toHaveBeenCalledWith(payload, 'test-secret', {
        algorithm: 'HS256',
        expiresIn: 1000,
        jwtid: 'expected-random-uuid-for-token',
        issuer: 'test-issuer',
      })
    })

    it('should return correct data', async () => {
      jest.spyOn(jwt, 'sign')
        .mockImplementation(() => 'expected-jwt-token')

      const service = buildService()

      const jwtToken = await service.generate(payload)

      expect(jwtToken).toStrictEqual('expected-jwt-token')
    })

    it('should throw error if there is an unexpected error', async () => {
      jest.spyOn(jwt, 'sign')
        .mockImplementation(() => { throw new Error('Unexpected error') })

      const service = buildService()

      expect(() => service.generate(payload)).toThrow('Unexpected error')
    })
  })

  describe('verify', () => {
    it('should call services correctly', async () => {
      const jwtSpy = jest.spyOn(jwt, 'verify')
        .mockImplementation(() => { return { name: 'Test Name' } })

      const service = buildService()

      await service.verify('test_token')

      expect(jwtSpy).toHaveBeenCalledWith('test_token', 'test-secret', {
        algorithms: ['HS256'],
        issuer: 'test-issuer',
      })
    })

    it('should return correct data', async () => {
      jest.spyOn(jwt, 'verify')
        .mockImplementation(() => {
          return {
            name: 'Test Name',
            id: 'test_user_id',
            username: 'test_username',
            role: 'test_role',
            iat: 134563,
            exp: 134573,
            iss: 'test_issuer',
            jit: 'test_token_id',
          }
        })

      const service = buildService()

      const authenticationToken = await service.verify('test_token')

      expect(authenticationToken).toStrictEqual(new AuthenticationToken(
        'test_user_id',
        'Test Name',
        'test_username',
        'test_role',
        134563,
        134573,
        'test_issuer',
        'test_token_id'
      ))
    })

    it('should throw error if there is an unexpected error', async () => {
      jest.spyOn(jwt, 'verify')
        .mockImplementation(() => { throw new Error('Unexpected error') })

      const service = buildService()

      await expect(service.verify('test_token'))
        .rejects
        .toThrow('Unexpected error')
    })
  })
})
