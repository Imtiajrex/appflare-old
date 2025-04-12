import Config from 'lib/config'
import { MongoClient } from 'mongodb'
export default class DBClient {
  static client: MongoClient
  static async connect() {
    const { config } = Config.getInstance()
    const client = new MongoClient(config!.MONGO_URI)
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
