import { EncrypterGenerator, EncrypterValidator, hash } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements EncrypterGenerator, EncrypterValidator {
  constructor (
    private readonly salt: number
  ) {}

  async generate (value: string): Promise<hash> {
    return await bcrypt.hash(value, this.salt)
  }

  async validate (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
