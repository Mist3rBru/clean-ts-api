import { Controller } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptController = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.headers || {}),
      ...(req.params || {}),
      ...(req.body || {}),
      userId: req?.userId
    }
    const httpResponse = await controller.handle(request)
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
