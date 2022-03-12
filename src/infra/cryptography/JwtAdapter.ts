import { token, Encrypter, Decrypter } from '@/data/protocols'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (value: string): Promise<token> {
    return jwt.sign({ id: value }, this.secret, { expiresIn: '15m' })
  }

  async decrypt (token: string): Promise<string> {
    const decoded: any = jwt.verify(token, this.secret)
    return decoded?.id || null
  }
}
