import { UserModel } from '@/domain/models'

export namespace FindUserByEmailRepository {
  export type Result = UserModel
}

export interface FindUserByEmailRepository {
  findByEmail (email: string): Promise<FindUserByEmailRepository.Result>
}
