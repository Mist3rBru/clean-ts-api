import { UserRepository } from './UserRepository'
import { MongoHelper } from './MongoHelper'

const makeSut = (): UserRepository => {
  const sut = new UserRepository()
  return sut
}

describe('UserRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
})
