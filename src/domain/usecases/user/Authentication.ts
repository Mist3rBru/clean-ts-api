import { token } from '@/data/protocols'

export type AuthenticationParams = {
  email: string
  password: string
}

export interface Authentication {
  auth(credentials: AuthenticationParams): Promise<token>
}
