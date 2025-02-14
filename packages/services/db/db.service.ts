import DBClient from '@appflare/db'
import {
  Collection,
  Filter,
  InsertOneResult,
  OptionalUnlessRequiredId,
  UpdateResult,
} from 'mongodb'

export default class DBService<
  T extends {
    insert: Record<string, any>
    select: Record<string, any>
    update: Record<string, any>
  },
> {
  databaseName: string
  collectionName: string
  getCollection(): Collection {
    return DBClient.getClient()
      .db(this.databaseName)
      .collection(this.collectionName)
  }
  constructor(databaseName: string, collectionName: string) {
    this.databaseName = databaseName
    this.collectionName = collectionName
  }

  async listMany(query: Filter<T['select']>) {
    const collection = this.getCollection()
    const docsQuery = collection.find(query as Filter<T['select']>).toArray()
    const docCountQuery = collection.countDocuments(query)
    const [docs, docCount] = await Promise.all([docsQuery, docCountQuery])
    return {
      data: docs,
      totalDocuments: docCount,
    }
  }
  async findOne(query: Filter<T['select']>) {
    const collection = this.getCollection()
    return collection.findOne(query as Filter<T['select']>) as Promise<
      T['select'] | null
    >
  }
  async findMany(query: Filter<T['select']>) {
    const collection = this.getCollection()
    return collection.find(query as Filter<T['select']>).toArray()
  }

  async insertOne(
    doc: OptionalUnlessRequiredId<T['insert']>,
  ): Promise<InsertOneResult<T['select']>> {
    const collection = this.getCollection()
    return collection.insertOne(doc)
  }

  async updateOne(
    query: Filter<T['select']>,
    update: T['update'],
  ): Promise<UpdateResult<T>> {
    const collection = this.getCollection()
    return collection.updateOne(query, { $set: update })
  }
  async deleteOne(query: Filter<T['select']>): Promise<void> {
    const collection = this.getCollection()
    await collection.deleteOne(query)
  }
  async deleteMany(query: Filter<T['select']>): Promise<void> {
    const collection = this.getCollection()
    await collection.deleteMany(query)
  }
}
