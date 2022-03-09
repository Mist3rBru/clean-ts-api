import { EncrypterGenerator, AddUserRepository } from '@/data/protocols'
import { AddUser, AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

export class DbAddUser implements AddUser {
  constructor (
    private readonly encrypter: EncrypterGenerator,
    private readonly addUserRepository: AddUserRepository
  ) {}

  async add (model: AddUserModel): Promise<UserModel> {
    const hashedPassword = await this.encrypter.generate(model.password)
    const user = await this.addUserRepository.add(Object.assign({}, model, { password: hashedPassword }))
    return user
  }
}
