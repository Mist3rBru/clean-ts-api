import { HttpResponse } from '@/presentation/protocols'
import { ServerError } from '@/presentation/errors'

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    error: error.message
  }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error)
})
