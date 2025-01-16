import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'
import {
  VerificationTokenType,
  VerificationTokenTypes
} from '~/modules/Shared/Domain/ValueObject/VerificationTokenType.ts'
import { VerificationTokenTestBuilder } from '~/__test__/User/Domain/VerificationTokenTestBuilder.ts'
import { VerificationTokenDomainError } from '~/modules/User/Domain/VerificationTokenDomainError.ts'

describe('VerificationToken', () => {
  const nowDate = new Date()

  const verificationToken = new VerificationTokenTestBuilder()
    .withCreatedAt(new Date(nowDate.getTime() - 5 * 60000))
    .withUpdatedAt(new Date(nowDate.getTime() - 5 * 60000))
    .withUsedAt(null)
    .withToken('expected_token')
    .withType(VerificationTokenType.from(VerificationTokenTypes.CREATE_ACCOUNT))
    .withExpiresAt(new Date(nowDate.getTime() + 30 * 60000))
    .build()

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(nowDate)
  })

  describe('useTokenFor', () => {
    describe('happy path', () => {
      it('should return empty result if token is valid for operation', async () => {
        const result = verificationToken.useTokenFor('expected_token', VerificationTokenTypes.CREATE_ACCOUNT)

        expect(result).toStrictEqual({
          success: true,
          value: undefined,
        })
        expect(verificationToken.updatedAt).toStrictEqual(nowDate)
        expect(verificationToken.usedAt).toStrictEqual(nowDate)
      })
    })

    describe('when there are errors', () => {
      let verificationTokeBuilder: VerificationTokenTestBuilder

      beforeEach(() => {
        verificationTokeBuilder = new VerificationTokenTestBuilder()
      })

      it('should return error if token type is not valid for operation', async () => {
        const verificationToken = verificationTokeBuilder
          .withType(VerificationTokenType.from(VerificationTokenTypes.CHANGE_PASSWORD))
          .build()

        const result = verificationToken.useTokenFor('expected_token', VerificationTokenTypes.CREATE_ACCOUNT)

        expect(result).toStrictEqual({
          success: false,
          error: VerificationTokenDomainError.tokenNotValidForOperation(VerificationTokenTypes.CREATE_ACCOUNT),
        })
      })

      it('should return error if token was already used', async () => {
        const verificationToken = verificationTokeBuilder
          .withType(VerificationTokenType.from(VerificationTokenTypes.CREATE_ACCOUNT))
          .withUsedAt(nowDate)
          .build()

        const result = verificationToken.useTokenFor('expected_token', VerificationTokenTypes.CREATE_ACCOUNT)

        expect(result).toStrictEqual({
          success: false,
          error: VerificationTokenDomainError.tokenAlreadyUsed(),
        })
      })

      it('should return error if token has already expired', async () => {
        const verificationToken = verificationTokeBuilder
          .withType(VerificationTokenType.from(VerificationTokenTypes.CREATE_ACCOUNT))
          .withUsedAt(null)
          .withExpiresAt(new Date(nowDate.getTime() - 60000))
          .build()

        const result = verificationToken.useTokenFor('expected_token', VerificationTokenTypes.CREATE_ACCOUNT)

        expect(result).toStrictEqual({
          success: false,
          error: VerificationTokenDomainError.tokenHasExpired(),
        })
      })

      it('should return error if provided token value does not match', async () => {
        const verificationToken = verificationTokeBuilder
          .withType(VerificationTokenType.from(VerificationTokenTypes.CREATE_ACCOUNT))
          .withUsedAt(null)
          .withExpiresAt(new Date(nowDate.getTime() + 60000))
          .withToken('expected_token')
          .build()

        const result = verificationToken.useTokenFor('unexpected_token', VerificationTokenTypes.CREATE_ACCOUNT)

        expect(result).toStrictEqual({
          success: false,
          error: VerificationTokenDomainError.tokenDoesNotMatch('unexpected_token'),
        })
      })
    })
  })
})
