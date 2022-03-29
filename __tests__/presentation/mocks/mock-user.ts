import { AddUser, FindUserByToken, Authentication, AddUserParams, AuthenticationParams } from '@/domain/usecases'
import { UserModel } from '@/domain/models'
import { mockUserModel } from '@/tests/domain/mocks'
import faker from '@faker-js/faker'

export class AddUserSpy implements AddUser {
  model: AddUserParams
  user = mockUserModel()
  async add (model: AddUserParams): Promise<UserModel> {
    this.model = model
    return this.user
  }
}

export class FindUserByTokenSpy implements FindUserByToken {
  token: string
  role?: string
  user = mockUserModel()
  async findByToken (token: string, role?: string): Promise<UserModel> {
    this.token = token
    this.role = role
    return this.user
  }
}

export class AuthenticationSpy implements Authentication {
  credentials: AuthenticationParams
  token = faker.datatype.uuid()
  async auth (credentials: AuthenticationParams): Promise<string> {
    this.credentials = credentials
    return this.token
  }
}
