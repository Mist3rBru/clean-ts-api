import { token, TokenGenerator } from '@/data/protocols'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements TokenGenerator {
  constructor (
    private readonly secret: string
  ) {}

  async generate (value: string): Promise<token> { 
    return jwt.sign({ id: value }, this.secret, { expiresIn: '15m' })
  }
}
