import { TokenGenerator, TokenValidator } from '@/data/protocols'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements TokenGenerator, TokenValidator {
  constructor (
    private readonly secret: string
  ) {}

  async generate (value: string): Promise<string> { 
    return jwt.sign({ id: value }, this.secret, { expiresIn: '15m' })
  }

  async validate (token: string): Promise<string> {
    return jwt.verify(token, this.secret) as any
  }
}
