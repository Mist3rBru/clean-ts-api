export interface Authentication {
  auth: (email: string, password: string) => Promise<token>
}

export type token = string | null
