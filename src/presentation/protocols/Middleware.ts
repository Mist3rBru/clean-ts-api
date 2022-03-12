import { HttpRequest, HttpResponse } from '@/presentation/protocols'

export interface Middleware {
  handle: (request: HttpRequest) => Promise<HttpResponse>
}
