import { UserModel } from '@/domain/models'

export namespace FindUserByIdRepository {
  export type Result = UserModel
}

export interface FindUserByIdRepository {
  findById (id: any): Promise<FindUserByIdRepository.Result>
}
