export interface EncrypterValidator {
  validate: (value: string, hash: string) => Promise<boolean>
}
