import Config from '@appflare/config'
import { MongoClient, ServerApiVersion } from 'mongodb'
export default class NoSQLClient {
  async connect() {
    const { config } = Config.getInstance()
    const client = new MongoClient(config.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    await client.connect()
    return client
  }
}
