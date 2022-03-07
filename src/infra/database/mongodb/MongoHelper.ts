import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) { 
      await this.connect()
    }
    return await this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...data } = collection
    return Object.assign({}, data, { id: _id })
  }
}
