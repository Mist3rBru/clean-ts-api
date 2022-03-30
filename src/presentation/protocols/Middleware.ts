import { HttpResponse } from '@/presentation/protocols'

export interface Middleware {
  handle (request: any): Promise<HttpResponse>
}
