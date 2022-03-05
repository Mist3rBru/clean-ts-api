import { HttpResponse } from '@/presentation/protocols'

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

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: {
    error: 'Internal server error'
  }
})
