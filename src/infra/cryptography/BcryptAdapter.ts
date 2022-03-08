import { Encrypter, hash } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  constructor (
    private readonly salt: number
  ) {}

  async encrypt (value: string): Promise<hash> {
    return await bcrypt.hash(value, this.salt)
  }
}
