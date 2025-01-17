import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import jwt from 'jsonwebtoken'
import { JWTAuthenticationToken } from '~/modules/User/Infrastructure/JWTAuthenticationToken.ts'
import { randomUUID } from 'node:crypto'
import { mockReset } from 'jest-mock-extended'

jest.mock('node:crypto')

describe('JWTAuthenticationToken', () => {
  const mockedRandomUUID = jest.mocked(randomUUID)

  const buildUseCase = () => {
    return new JWTAuthenticationToken(
      'test-secret',
      1000,
      'HS256',
      'test-issuer'
    )
  }

  beforeEach(() => {
    mockReset(mockedRandomUUID)
    mockedRandomUUID.mockReturnValue('expected-random-uuid-for-token')
  })

  const payload: JSON = JSON.parse(JSON.stringify({ name: 'Test Name', id: 'test-id' }))

  describe('generate', () => {
    it('should call services correctly', async () => {
      const jwtSpy = jest.spyOn(jwt, 'sign')

      const useCase = buildUseCase()

      await useCase.generate(payload)

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

      const useCase = buildUseCase()

      const jwtToken = await useCase.generate(payload)

      expect(jwtToken).toStrictEqual('expected-jwt-token')
    })

    it('should throw error if there is an unexpected error', async () => {
      jest.spyOn(jwt, 'sign')
        .mockImplementation(() => { throw new Error('Unexpected error') })

      const useCase = buildUseCase()

      expect(() => useCase.generate(payload)).toThrow('Unexpected error')
    })
  })
})
