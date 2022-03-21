import { AddUserRepository, FindUserByEmailRepository, FindUserByIdRepository } from '@/data/protocols'
import { UserModel } from '@/domain/models'
import { AddUserParams } from '@/domain/usecases'
import { mockUserModel } from '@/tests/domain/mocks'

export const mockAddUserRepository = (): AddUserRepository => {
  class AddUserRepositorySpy implements AddUserRepository {
    async add (model: AddUserParams): Promise<UserModel> {
      return mockUserModel()
    }
  }
  return new AddUserRepositorySpy()
}

export const mockFindUserByIdRepository = (): FindUserByIdRepository => {
  class FindUserByIdRepositorySpy implements FindUserByIdRepository {
    async findById (id: any): Promise<UserModel> {
      return mockUserModel('any-role')
    }
  }
  return new FindUserByIdRepositorySpy()
}

export const mockFindUserByEmailRepository = (): FindUserByEmailRepository => {
  class FindUserByEmailRepositorySpy implements FindUserByEmailRepository {
    async findByEmail (email: string): Promise<UserModel> {
      return mockUserModel('any-role')
    }
  }
  return new FindUserByEmailRepositorySpy()
}
