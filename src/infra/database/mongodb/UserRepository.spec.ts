import { UserRepository } from './UserRepository'
import { MongoHelper } from './MongoHelper'
import { AddUserModel } from '@/domain/usecases'

const makeSut = (): UserRepository => {
  const sut = new UserRepository()
  return sut
}

const makeUser = (): AddUserModel => {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password'
  }
}

describe('UserRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return user when registered on MongoDB', async () => {;
    const sut = makeSut()
    const model = makeUser()
    const user = await sut.add(model)
    expect(user).toEqual({
      id: 'any-id',
      name: model.name,
      email: model.email
    })
  })
})
