import DB from '../Database/Database'
import { getQuery } from '../Database/QueryBuilder'
import ModelCollection from './ModelCollection'

export default class Model {
  static table = ''
  static keys = []
  columns = {}

  static isCollection(obj) {
    return obj instanceof ModelCollection
  }

  static getCollection() {
    return new ModelCollection()
  }

  static mapResults(results) {
    if(results.length === 0) return null
    if(results.length === 1) return new this(results[0])
    const collection = this.getCollection()
    results.forEach(result => {
      const row = new this(result)
      collection.set(row.id, row)
    })

    return collection
  }

  static getQuery(addTable) {
    return addTable ? getQuery()(this.table) : getQuery()
  }

  static getDb() {
    return DB.getDb()
  }

  static runQuery(query) {
    const { sql, bindings } = query.toSQL()
    if(typeof ECHO_SQL !== 'undefined') {
      console.log(sql)
      console.log(bindings)
    }
    return DB.run(sql, bindings)
  }

  static async update(newObj, where) {
    try {
      await this.runQuery(this.getQuery(true).where(where).update(newObj))
      return true
    } catch(err) {
      return Promise.reject(err)
    }
  }

  static async delete(where) {
    try {
      await this.runQuery(this.getQuery(true).where(where).delete())
      return true
    } catch(err) {
      return Promise.reject(err)
    }
  }

  static create(values) {
    return this.runQuery(getQuery().insert(values).from(this.table))
  }

  static async get(query) {
    const results = await this.runQuery(query)
    return this.mapResults(results)
  }

  constructor(obj) {
    const keys = this.constructor.keys
    for(const key of keys) {
      Object.defineProperty(this, key, {
        get: () => {
          return this.columns[key]
        },
        set: str => {
          this.columns[key] = str
        }
      })
      if(obj[key]) this[key] = obj[key]
    }
  }

  toObject() {
    return {...this.columns}
  }

  toString() {
    return JSON.stringify(this.toObject())
  }
}