import { asClass, createContainer, InjectionMode } from 'awilix'
import { MysqlUserRepository } from '~/modules/User/Infrastructure/MysqlUserRepository.ts'
import { GetUserByUsername } from '~/modules/User/Application/GetUserByUsername/GetUserByUsername.ts'

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
container.register('getUserByUsername', asClass(GetUserByUsername))

export { container }
