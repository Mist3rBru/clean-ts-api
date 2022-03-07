import { Controller } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adapt = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest = { body: req.body }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
