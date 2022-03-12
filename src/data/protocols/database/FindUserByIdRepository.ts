import { UserModel } from '@/domain/models'

export interface FindUserByIdRepository {
  findById(id: string): Promise<UserModel>
}
