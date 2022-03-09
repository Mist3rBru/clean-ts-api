import { UserModel } from '@/domain/models'

export interface FindUserByEmailRepository {
  find: (email: string) => Promise<UserModel>
}
