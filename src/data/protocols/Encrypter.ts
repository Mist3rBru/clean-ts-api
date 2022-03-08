export interface Encrypter {
  encrypt: (value: string) => Promise<hash>
}

export type hash = string
