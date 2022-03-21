import {
  AddUserRepository,
  FindUserByEmailRepository,
  FindUserByIdRepository
} from '@/data/protocols'
import { AddUserParams } from '@/domain/usecases'
import { UserModel } from '@/domain/models'
import { MongoHelper } from '@/infra/database/mongodb'
import { ObjectId } from 'mongodb'

export class UserRepository implements AddUserRepository, FindUserByEmailRepository, FindUserByIdRepository {
  async add (model: AddUserParams): Promise<UserModel> {
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

  async findById (id: any): Promise<UserModel> {
    const userCollection = await MongoHelper.getCollection('users')
    const user = await userCollection.findOne({ _id: new ObjectId(id) })
    return user ? MongoHelper.map(user) : null
  }
}
