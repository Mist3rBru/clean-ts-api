import { UserModel } from '@/domain/models'

export interface FindUserByToken {
  find (token: string, role?: string): Promise<UserModel>
}