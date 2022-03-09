export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authentication {
  auth: (credentials: AuthenticationModel) => Promise<token>
}

export type token = string | null
