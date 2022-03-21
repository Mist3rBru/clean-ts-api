import { UserModel } from '@/domain/models'

export interface FindUserByIdRepository {
  findById (id: any): Promise<UserModel>
}
