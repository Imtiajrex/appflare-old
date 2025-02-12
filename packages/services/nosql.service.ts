import NoSQLClient from '@appflare/nosql-db'
type ListDocumentsArgs = {
  collectionName: string
  limit?: number
  offset?: number
}
export default class NoSQLService {
  databaseName: string
  constructor(databaseName: string) {
    this.databaseName = databaseName
  }
  async listDocuments(args: ListDocumentsArgs) {
    const client = await new NoSQLClient().connect()
    const database = client.db(this.databaseName)
    const collection = database.collection(args.collectionName)
    let documents = collection.find()
    if (args.limit) {
      documents = documents.limit(args.limit)
    }
    if (args.offset) {
      documents = documents.skip(args.offset)
    }
    const [data, count] = await Promise.all([
      documents.toArray(),
      collection.countDocuments(),
    ])
    await client.close()
    return {
      data,
      count,
    }
  }
  async createDocument(collectionName: string, document: any) {
    const client = await new NoSQLClient().connect()
    const database = client.db(this.databaseName)
    const collection = database.collection(collectionName)
    const doc = await collection.insertOne(document)
    await client.close()
    return doc
  }
}
