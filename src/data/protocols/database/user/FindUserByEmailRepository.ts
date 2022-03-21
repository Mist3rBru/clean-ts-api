import { UserModel } from '@/domain/models'

export interface FindUserByEmailRepository {
  findByEmail (email: string): Promise<UserModel>
}
