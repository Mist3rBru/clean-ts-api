import { HashGenerator, HashComparator, hash } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashGenerator, HashComparator {
  constructor (
    private readonly salt: number
  ) {}

  async generate (value: string): Promise<hash> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
