import { ObjectId, type Db } from 'mongodb'
import { getAuthTables } from 'better-auth/db'
import type { Adapter, BetterAuthOptions, Where } from 'better-auth/types'
import { withApplyDefault } from './utils'
import DBObject from 'lib/db'

const parseResult = (result: any) => {
  return sanitizeClause(result)
}
const sanitizeClause = (clause: any): any => {
  if (!clause) return undefined
  if (typeof clause !== 'string') return clause
  const parsedClause = JSON.parse(clause)
  if (Array.isArray(parsedClause)) {
    const sanitizedClause = parsedClause.map((clause: any) => {
      const sanitized: any = {}
      for (const key in clause) {
        if (
          (key.includes('_id') ||
            key.includes('Id') ||
            key.includes('id') ||
            key.includes('ID') ||
            key.includes('userId')) &&
          clause[key] &&
          clause[key].length === 24
        ) {
          sanitized[key] = ObjectId.createFromHexString(clause[key])
        } else sanitized[key] = clause[key]
      }
      return sanitized
    })
    return sanitizedClause
  }
  const sanitizedClause: any = {}
  for (const key in parsedClause) {
    if (
      (key.includes('_id') ||
        key.includes('Id') ||
        key.includes('id') ||
        key.includes('ID') ||
        key.includes('userId')) &&
      parsedClause[key] &&
      parsedClause[key].length === 24
    )
      sanitizedClause[key] = ObjectId.createFromHexString(parsedClause[key])
    else sanitizedClause[key] = parsedClause[key]
  }
  return sanitizedClause
}
const createTransform = (options: BetterAuthOptions) => {
  const schema = getAuthTables(options)
  /**
   * if custom id gen is provided we don't want to override with object id
   */
  const customIdGen =
    options.advanced?.database?.generateId || options.advanced?.generateId

  function serializeID(field: string, value: any, model: string) {
    if (customIdGen) {
      return value
    }
    if (
      field === 'id' ||
      field === '_id' ||
      schema[model].fields[field].references?.field === 'id'
    ) {
      if (typeof value !== 'string') {
        if (value instanceof ObjectId) {
          return value
        }
        if (Array.isArray(value)) {
          return value.map((v) => {
            if (typeof v === 'string') {
              try {
                return new ObjectId(v)
              } catch (e) {
                return v
              }
            }
            if (v instanceof ObjectId) {
              return v
            }
            throw new Error('Invalid id value')
          })
        }
        throw new Error('Invalid id value')
      }
      try {
        return new ObjectId(value)
      } catch (e) {
        return value
      }
    }
    return value
  }

  function deserializeID(field: string, value: any, model: string) {
    if (customIdGen) {
      return value
    }
    if (
      field === 'id' ||
      schema[model].fields[field].references?.field === 'id'
    ) {
      if (value instanceof ObjectId) {
        return value.toHexString()
      }
      if (Array.isArray(value)) {
        return value.map((v) => {
          if (v instanceof ObjectId) {
            return v.toHexString()
          }
          return v
        })
      }
      return value
    }
    return value
  }

  function getField(field: string, model: string) {
    if (field === 'id') {
      if (customIdGen) {
        return 'id'
      }
      return '_id'
    }
    const f = schema[model].fields[field]
    return f.fieldName || field
  }

  return {
    transformInput(
      data: Record<string, any>,
      model: string,
      action: 'create' | 'update',
    ) {
      const transformedData: Record<string, any> =
        action === 'update'
          ? {}
          : customIdGen
            ? {
                id: customIdGen({ model }),
              }
            : {
                _id: new ObjectId(),
              }
      const fields = schema[model].fields
      for (const field in fields) {
        const value = data[field]
        if (
          value === undefined &&
          (!fields[field].defaultValue || action === 'update')
        ) {
          continue
        }
        transformedData[fields[field].fieldName || field] = withApplyDefault(
          serializeID(field, value, model),
          fields[field],
          action,
        )
      }
      return transformedData
    },
    transformOutput(
      data: Record<string, any>,
      model: string,
      select: string[] = [],
    ) {
      const transformedData: Record<string, any> =
        data.id || data._id
          ? select.length === 0 || select.includes('id')
            ? {
                id: data.id ? data.id.toString() : data._id.toString(),
              }
            : {}
          : {}

      const tableSchema = schema[model].fields
      for (const key in tableSchema) {
        if (select.length && !select.includes(key)) {
          continue
        }
        const field = tableSchema[key]
        if (field) {
          transformedData[key] = deserializeID(
            key,
            data[field.fieldName || key],
            model,
          )
        }
      }
      return transformedData as any
    },
    convertWhereClause(where: Where[], model: string) {
      if (!where.length) return {}
      const conditions = where.map((w) => {
        const { field: _field, value, operator = 'eq', connector = 'AND' } = w
        let condition: any
        const field = getField(_field, model)
        switch (operator.toLowerCase()) {
          case 'eq':
            condition = {
              [field]: serializeID(_field, value, model),
            }
            break
          case 'in':
            condition = {
              [field]: {
                $in: Array.isArray(value)
                  ? serializeID(_field, value, model)
                  : [serializeID(_field, value, model)],
              },
            }
            break
          case 'gt':
            condition = { [field]: { $gt: value } }
            break
          case 'gte':
            condition = { [field]: { $gte: value } }
            break
          case 'lt':
            condition = { [field]: { $lt: value } }
            break
          case 'lte':
            condition = { [field]: { $lte: value } }
            break
          case 'ne':
            condition = { [field]: { $ne: value } }
            break

          case 'contains':
            condition = { [field]: { $regex: `.*${value}.*` } }
            break
          case 'starts_with':
            condition = { [field]: { $regex: `${value}.*` } }
            break
          case 'ends_with':
            condition = { [field]: { $regex: `.*${value}` } }
            break
          default:
            throw new Error(`Unsupported operator: ${operator}`)
        }
        return { condition, connector }
      })
      if (conditions.length === 1) {
        return conditions[0].condition
      }
      const andConditions = conditions
        .filter((c) => c.connector === 'AND')
        .map((c) => c.condition)
      const orConditions = conditions
        .filter((c) => c.connector === 'OR')
        .map((c) => c.condition)

      let clause = {}
      if (andConditions.length) {
        clause = { ...clause, $and: andConditions }
      }
      if (orConditions.length) {
        clause = { ...clause, $or: orConditions }
      }
      return clause
    },
    getModelName: (model: string) => {
      return schema[model].modelName
    },
    getField,
  }
}

export const mongodbAdapter =
  (dbName: string, db: DBObject) => (options: BetterAuthOptions) => {
    const transform = createTransform(options)
    const hasCustomId = options.advanced?.generateId
    return {
      id: 'mongodb-adapter',
      async create(data) {
        const { model, data: values, select } = data
        const transformedData = transform.transformInput(
          values,
          model,
          'create',
        )
        if (transformedData.id && !hasCustomId) {
          // biome-ignore lint/performance/noDelete: setting id to undefined will cause the id to be null in the database which is not what we want
          delete transformedData.id
        }
        const collectionName = transform.getModelName(model)
        const res = await db.call(
          dbName,
          collectionName,
          'insertOne',
          {},
          JSON.stringify(transformedData),
        )
        const result = parseResult(res)
        const id = result.insertedId
        const insertedData = { id: id.toString(), ...transformedData }
        const t = transform.transformOutput(insertedData, model, select)
        return t
      },
      async findOne(data) {
        const { model, where, select } = data
        const clause = transform.convertWhereClause(where, model)
        const collectionName = transform.getModelName(model)
        const res = await db.call(
          dbName,
          collectionName,
          'findOne',
          JSON.stringify(clause),
        )
        if (!res) return null
        const result = parseResult(res)
        if (!result) return null
        const transformedData = transform.transformOutput(result, model, select)
        return transformedData
      },
      async findMany(data) {
        const { model, where, limit, offset, sortBy } = data
        const clause = where ? transform.convertWhereClause(where, model) : {}
        const collectionName = transform.getModelName(model)
        if (limit) {
          clause.limit = limit
        }
        if (offset) {
          clause.offset = offset
        }
        if (sortBy) {
          clause.sortBy = sortBy
        }

        // if (limit) cursor.limit(limit)
        // if (offset) cursor.skip(offset)
        // if (sortBy)
        //   cursor.sort(
        //     transform.getField(sortBy.field, model),
        //     sortBy.direction === 'desc' ? -1 : 1,
        //   )
        const res: any[] = await db.call(
          dbName,
          collectionName,
          'find',
          JSON.stringify(clause),
        )
        const result: any[] = parseResult(res)
        const updatedResult = result.map((r) =>
          transform.transformOutput(r, model),
        )
        console.log('many', updatedResult)
        return updatedResult
      },
      async count(data) {
        const { model, where = [] } = data
        const collectionName = transform.getModelName(model)
        const res = await db.call(
          dbName,
          collectionName,
          'countDocuments',
          JSON.stringify(transform.convertWhereClause(where!, model)),
        )
        const result: any = parseResult(res)
        return result
      },
      async update(data) {
        const { model, where, update: values } = data
        const clause = transform.convertWhereClause(where, model)

        const transformedData = transform.transformInput(
          values,
          model,
          'update',
        )

        const collectionName = transform.getModelName(model)
        const res = await db.call(
          dbName,
          collectionName,
          'findOneAndUpdate',
          JSON.stringify(clause),
          { $set: JSON.stringify(transformedData) },
          {
            returnDocument: 'after',
          },
        )
        if (!res) return null
        const result: any = parseResult(res)
        return transform.transformOutput(result, model)
      },
      async updateMany(data) {
        const { model, where, update: values } = data
        const clause = transform.convertWhereClause(where, model)
        const transformedData = transform.transformInput(
          values,
          model,
          'update',
        )
        const collectionName = transform.getModelName(model)
        const res = await db.call(
          dbName,
          collectionName,
          'updateMany',
          JSON.stringify(clause),
          { $set: JSON.stringify(transformedData) },
        )
        const result: any = parseResult(res)
        return result.modifiedCount
      },
      async delete(data) {
        const { model, where } = data
        const clause = transform.convertWhereClause(where, model)
        const collectionName = transform.getModelName(model)
        const res = await db.call(
          dbName,
          collectionName,
          'findOneAndDelete',
          JSON.stringify(clause),
        )
        if (!res) return null
        const result: any = parseResult(res)
        return transform.transformOutput(result, model)
      },
      async deleteMany(data) {
        const { model, where } = data
        const clause = transform.convertWhereClause(where, model)
        const collectionName = transform.getModelName(model)
        const res = await db.call(
          dbName,
          collectionName,
          'deleteMany',
          JSON.stringify(clause),
        )
        const result: any = parseResult(res)
        return result.deletedCount
      },
    } satisfies Adapter
  }
