import { HashGenerator, AddUserRepository, FindUserByEmailRepository } from '@/data/protocols'
import { AddUser, AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

export class DbAddUser implements AddUser {
  constructor (
    private readonly hashGenerator: HashGenerator,
    private readonly addUserRepository: AddUserRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async add (model: AddUserModel): Promise<UserModel> {
    const alreadyExists = await this.findUserByEmailRepository.findByEmail(model.email)
    if (alreadyExists) return null
    const hashedPassword = await this.hashGenerator.generate(model.password)
    const user = await this.addUserRepository.add(Object.assign({}, model, { password: hashedPassword }))
    return user
  }
}
