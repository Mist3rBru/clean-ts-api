import { UserModel } from '@/domain/models'

export interface FindUserByToken {
  findByToken (token: string, role?: string): Promise<UserModel>
}
