import { AddUserRepository, FindUserByEmailRepository, FindUserByIdRepository } from '@/data/protocols'
import { mockUserModel } from '@/tests/domain/mocks'

export class AddUserRepositorySpy implements AddUserRepository {
  data: AddUserRepository.Params
  user = mockUserModel()
  async add (data: AddUserRepository.Params): Promise<AddUserRepository.Result> {
    this.data = data
    return this.user
  }
}

export class FindUserByIdRepositorySpy implements FindUserByIdRepository {
  id: string
  user = mockUserModel('any-role')
  async findById (id: any): Promise<FindUserByIdRepository.Result> {
    this.id = id
    return this.user
  }
}

export class FindUserByEmailRepositorySpy implements FindUserByEmailRepository {
  email: string
  user = mockUserModel('any-role')
  async findByEmail (email: string): Promise<FindUserByEmailRepository.Result> {
    this.email = email
    return this.user
  }
}
