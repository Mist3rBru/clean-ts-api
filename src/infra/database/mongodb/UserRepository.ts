import { AddUserRepository } from '@/data/protocols'
import { AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'
import { MongoHelper } from '@/infra/database/mongodb'

export class UserRepository implements AddUserRepository {
  async add (model: AddUserModel): Promise<UserModel> {
    const userCollection = await MongoHelper.getCollection('users')
    await userCollection.insertOne(model)
    const user = await userCollection.findOne({ email: model.email })
    return MongoHelper.map(user)
  }
}
