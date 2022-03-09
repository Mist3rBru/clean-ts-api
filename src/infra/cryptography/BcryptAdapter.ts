import { EncrypterGenerator, hash } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements EncrypterGenerator {
  constructor (
    private readonly salt: number
  ) {}

  async generate (value: string): Promise<hash> {
    return await bcrypt.hash(value, this.salt)
  }
}
