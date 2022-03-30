import { UserModel } from '@/domain/models'
import { AddUser } from '@/domain/usecases'
import faker from '@faker-js/faker'

export const mockUserModel = (role: string = null): UserModel => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.datatype.uuid(),
  role: role
})

export const mockAddUserParams = (role: string = null): AddUser.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: role
})
