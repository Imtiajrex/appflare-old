import Config from '@appflare/config'
import { MongoClient, ServerApiVersion } from 'mongodb'
export default class DBClient {
  static client: MongoClient
  static async connect() {
    const { config } = Config.getInstance()
    const client = new MongoClient(config.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    await client.connect()

    DBClient.client = client
  }
  async close() {
    await DBClient.client.close()
  }
  static getClient() {
    if (!DBClient.client) {
      throw new Error('Client not connected')
    }
    return DBClient.client
  }
}
