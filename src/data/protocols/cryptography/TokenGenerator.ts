import { token } from '@/domain/models'

export interface TokenGenerator {
  generate: (value: string) => Promise<token>
}
