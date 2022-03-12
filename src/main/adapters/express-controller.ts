import { Controller } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptController = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest = { body: req.body }
    const httpResponse = await controller.handle(httpRequest)
    const status = httpResponse.statusCode
    if (status >= 200 && status < 300) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
