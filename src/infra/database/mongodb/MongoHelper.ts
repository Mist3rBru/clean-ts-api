import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      console.error(this.uri)
      await this.connect(this.uri)
    }
    return await this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...data } = collection
    return Object.assign({}, data, { id: _id })
  }
}
