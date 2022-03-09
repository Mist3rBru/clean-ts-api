export interface EncrypterGenerator {
  generate: (value: string) => Promise<hash>
}

export type hash = string
