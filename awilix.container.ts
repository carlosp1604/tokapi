import { CreateUser } from '~/modules/User/Application/CreateUser/CreateUser.ts'
import { GetUserByUsername } from '~/modules/User/Application/GetUserByUsername/GetUserByUsername.ts'
import { BCryptCryptoService } from '~/modules/Shared/Infrastructure/BCryptCryptoService.ts'
import { MysqlUserRepository } from '~/modules/User/Infrastructure/MysqlUserRepository.ts'
import { asClass, createContainer, InjectionMode } from 'awilix'

/**
 * We create a container to register our classes dependencies
 * This will be a global container, so it can be used in any module
 * CLASSIC MODE: https://github.com/jeffijoe/awilix#injection-modes
 */
const container = createContainer({ injectionMode: InjectionMode.CLASSIC })

/**
 * Register dependencies in the container
 */
container.register('userRepository', asClass(MysqlUserRepository))
container.register('cryptoService', asClass(BCryptCryptoService))
container.register('createUser', asClass(CreateUser))
container.register('getUserByUsername', asClass(GetUserByUsername))

export { container }
