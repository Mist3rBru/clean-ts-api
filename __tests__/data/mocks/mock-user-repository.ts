import { AddUserRepository, FindUserByEmailRepository, FindUserByIdRepository } from '@/data/protocols'
import { UserModel } from '@/domain/models'
import { AddUserParams } from '@/domain/usecases'
import { mockUserModel } from '@/tests/domain/mocks'

export class AddUserRepositorySpy implements AddUserRepository {
  model: AddUserParams
  user = mockUserModel()
  async add (model: AddUserParams): Promise<UserModel> {
    this.model = model
    return this.user
  }
}

export class FindUserByIdRepositorySpy implements FindUserByIdRepository {
  id: string
  user = mockUserModel('any-role')
  async findById (id: any): Promise<UserModel> {
    this.id = id
    return this.user
  }
}

export class FindUserByEmailRepositorySpy implements FindUserByEmailRepository {
  email: string
  user = mockUserModel('any-role')
  async findByEmail (email: string): Promise<UserModel> {
    this.email = email
    return this.user
  }
}
