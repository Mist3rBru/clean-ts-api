import { HttpResponse } from '@/presentation/protocols'

export interface Controller {
  handle (request: any): Promise<HttpResponse>
}
