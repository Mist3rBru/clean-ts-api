import { token } from '@/data/protocols'

export type AuthenticationModel = {
  email: string
  password: string
}

export interface Authentication {
  auth (credentials: AuthenticationModel): Promise<token>
}
