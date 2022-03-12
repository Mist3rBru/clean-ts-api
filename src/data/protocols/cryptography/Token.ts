export interface TokenGenerator {
  generate (value: string): Promise<string>
}

export interface TokenValidator {
  validate (token: string): Promise<string>
}
