import { AddUser, FindUserByToken, Authentication } from '@/domain/usecases'
import { mockUserModel } from '@/tests/domain/mocks'
import faker from '@faker-js/faker'

export class AddUserSpy implements AddUser {
  data: AddUser.Params
  user = mockUserModel()
  async add (data: AddUser.Params): Promise<AddUser.Result> {
    this.data = data
    return this.user
  }
}

export class FindUserByTokenSpy implements FindUserByToken {
  data: FindUserByToken.Params
  user = mockUserModel()
  async findByToken (data: FindUserByToken.Params): Promise<FindUserByToken.Result> {
    this.data = data
    return this.user
  }
}

export class AuthenticationSpy implements Authentication {
  data: Authentication.Params
  authModel = {
    accessToken: faker.datatype.uuid(),
    userName: faker.name.findName()
  }

  async auth (data: Authentication.Params): Promise<Authentication.Result> {
    this.data = data
    return this.authModel
  }
}
