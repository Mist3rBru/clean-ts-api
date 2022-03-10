import { AddUserRepository, FindUserByEmailRepository } from '@/data/protocols'
import { AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'
import { MongoHelper } from '@/infra/database/mongodb'

export class UserRepository implements AddUserRepository, FindUserByEmailRepository {
  async add (model: AddUserModel): Promise<UserModel> {
    const userCollection = await MongoHelper.getCollection('users')
    await userCollection.insertOne(model)
    const user = await userCollection.findOne({ email: model.email })
    return MongoHelper.map(user)
  }

  async findByEmail (email: string): Promise<UserModel> {
    const userCollection = await MongoHelper.getCollection('users')
    const user = await userCollection.findOne({ email: email })
    return user ? MongoHelper.map(user) : null
  }
}
