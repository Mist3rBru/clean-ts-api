import { AddUser, FindUserByToken, Authentication, AddUserParams, AuthenticationParams } from '@/domain/usecases'
import { UserModel } from '@/domain/models'
import { mockUserModel } from '@/tests/domain/mocks'

export const mockAddUser = (): AddUser => {
  class AddUserSpy implements AddUser {
    async add (model: AddUserParams): Promise<UserModel> {
      return mockUserModel()
    }
  }
  return new AddUserSpy()
}

export const mockFindUserByToken = (): FindUserByToken => {
  class FindUserByTokenSpy implements FindUserByToken {
    async findByToken (token: string, role?: string): Promise<UserModel> {
      return mockUserModel()
    }
  }
  return new FindUserByTokenSpy()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationSpy implements Authentication {
    async auth (credentials: AuthenticationParams): Promise<string> {
      return 'any-token'
    }
  }
  return new AuthenticationSpy()
}
