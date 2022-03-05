import { Encrypter } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  constructor (
    private readonly salt: number
  ) {}

  async encrypt (data: string): Promise<string> {
    return await bcrypt.hash(data, this.salt)
  }
}
