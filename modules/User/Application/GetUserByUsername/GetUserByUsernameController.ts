import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { container } from '~/awilix.container.ts'
import { GetUserByUsername } from '~/modules/User/Application/GetUserByUsername/GetUserByUsername.ts'
import {
  GetUserByUsernameApplicationException
} from '~/modules/User/Application/GetUserByUsername/GetUserByUsernameApplicationException.ts'

export class GetUserByUsernameController {
  public static async get (request: Request, response: Response) {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      response.status(400).send({ errors: result.array() })

      return
    }

    const useCase = container.resolve<GetUserByUsername>('getUserByUsername')

    const getUserResult = await useCase.get(request.params.username)

    if (!getUserResult.success) {
      // TODO: Define and Improve responses type
      if (getUserResult.error.id === GetUserByUsernameApplicationException.invalidUsernameId) {
        response.status(422).send('Invalid provided username')
      } else {
        response.status(404).send('User not found')
      }

      return
    }

    // TODO: Define and Improve responses type
    response.status(200).json({
      message: 'User found',
      status: 'success',
      data: getUserResult.value,
    })
  }
}
