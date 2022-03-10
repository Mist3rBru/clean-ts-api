export interface TokenGenerator {
  generate: (value: string) => Promise<token>
}

export interface TokenValidator {
  validate: (token: string) => Promise<boolean>
}

export type token = string | null
