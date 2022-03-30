import { HashGenerator, AddUserRepository, FindUserByEmailRepository } from '@/data/protocols'
import { AddUser } from '@/domain/usecases'

export class DbAddUser implements AddUser {
  constructor (
    private readonly hashGenerator: HashGenerator,
    private readonly addUserRepository: AddUserRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async add (data: AddUser.Params): Promise<AddUser.Result> {
    const alreadyExists = await this.findUserByEmailRepository.findByEmail(data.email)
    if (alreadyExists) return null
    const hashedPassword = await this.hashGenerator.generate(data.password)
    const user = await this.addUserRepository.add(
      Object.assign({}, data, { password: hashedPassword })
    )
    return user
  }
}
