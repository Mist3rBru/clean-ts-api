import { AddUserRepository, FindUserByEmailRepository, FindUserByIdRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/database/mongodb'
import { ObjectId } from 'mongodb'

export class UserRepository implements AddUserRepository, FindUserByEmailRepository, FindUserByIdRepository {
  async add (data: AddUserRepository.Params): Promise<AddUserRepository.Result> {
    const userCollection = await MongoHelper.getCollection('users')
    await userCollection.insertOne(data)
    const user = await userCollection.findOne({ email: data.email })
    return MongoHelper.map(user)
  }

  async findByEmail (email: string): Promise<FindUserByEmailRepository.Result> {
    const userCollection = await MongoHelper.getCollection('users')
    const user = await userCollection.findOne({ email: email })
    return user ? MongoHelper.map(user) : null
  }

  async findById (id: any): Promise<FindUserByIdRepository.Result> {
    const userCollection = await MongoHelper.getCollection('users')
    const user = await userCollection.findOne({ _id: new ObjectId(id) })
    return user ? MongoHelper.map(user) : null
  }
}
