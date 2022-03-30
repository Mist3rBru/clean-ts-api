import { HashGenerator, HashComparator } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashGenerator, HashComparator {
  constructor (
    private readonly salt: number
  ) {}

  async generate (data: string): Promise<string> {
    return await bcrypt.hash(data, this.salt)
  }

  async compare (data: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash)
  }
}
