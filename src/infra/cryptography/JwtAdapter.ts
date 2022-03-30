import { Encrypter, Decrypter } from '@/data/protocols'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (data: string): Promise<string> {
    return jwt.sign({ id: data }, this.secret, { expiresIn: '15m' })
  }

  async decrypt (data: string): Promise<any> {
    const decoded: any = jwt.verify(data, this.secret)
    return decoded?.id || null
  }
}
