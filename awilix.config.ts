import { AwilixContainer, asClass, asFunction } from 'awilix'
import { MysqlUserRepository } from '~/modules/User/Infrastructure/MysqlUserRepository.ts'
import { BCryptCryptoService } from '~/modules/Shared/Infrastructure/BCryptCryptoService.ts'
import { JWTAuthenticationToken } from '~/modules/User/Infrastructure/JWTAuthenticationToken.ts'
import { CreateUser } from '~/modules/User/Application/CreateUser/CreateUser.ts'
import { GetUserByUsername } from '~/modules/User/Application/GetUserByUsername/GetUserByUsername.ts'
import { LoginUser } from '~/modules/User/Application/LoginUser/LoginUser.ts'
import {
  CreateAuthenticationToken
} from '~/modules/User/Application/CreateAuthenticationToken/CreateAuthenticationToken.ts'
import {
  ValidateAuthenticationToken
} from '~/modules/User/Application/ValidateAuthenticationToken/ValidateAuthenticationToken.ts'

export const configureContainer = (container: AwilixContainer) => {
  container.register('expireSeconds', asFunction(() => {
    const expireSeconds = Deno.env.get('AUTHENTICATION_TOKEN_EXPIRE_SECONDS')

    if (!expireSeconds) {
      throw Error('Missing environment variable: AUTHENTICATION_TOKEN_EXPIRE_SECONDS')
    }

    return Number(expireSeconds)
  }))

  container.register('secret', asFunction(() => {
    const tokenSecret = Deno.env.get('AUTHENTICATION_TOKEN_SECRET')

    if (!tokenSecret) {
      throw Error('Missing environment variable: AUTHENTICATION_TOKEN_SECRET')
    }

    return tokenSecret
  }))

  container.register('algorithm', asFunction(() => {
    const algorithm = Deno.env.get('AUTHENTICATION_TOKEN_ALGORITHM')

    if (!algorithm) {
      throw Error('Missing environment variable: AUTHENTICATION_TOKEN_ALGORITHM')
    }

    return algorithm
  }))

  container.register('issuer', asFunction(() => {
    const issuer = Deno.env.get('AUTHENTICATION_TOKEN_ISSUER')

    if (!issuer) {
      throw Error('Missing environment variable: AUTHENTICATION_TOKEN_ISSUER')
    }

    return issuer
  }))

  container.register('userRepository', asClass(MysqlUserRepository))
  container.register('cryptoService', asClass(BCryptCryptoService))
  container.register('authenticationTokenService', asClass(JWTAuthenticationToken))
  container.register('createUser', asClass(CreateUser))
  container.register('getUserByUsername', asClass(GetUserByUsername))
  container.register('loginUser', asClass(LoginUser))
  container.register('createAuthenticationToken', asClass(CreateAuthenticationToken))
  container.register('validateAuthenticationToken', asClass(ValidateAuthenticationToken))
}
