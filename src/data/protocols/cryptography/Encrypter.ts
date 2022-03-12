export interface Encrypter {
  encrypt (value: string): Promise<token>
}

export interface Decrypter {
  decrypt (token: string): Promise<string>
}

export type token = string | null
