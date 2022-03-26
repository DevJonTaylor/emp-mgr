import DB from './Database'

export default class Modal {
  static table = ''
  static keys = []
  columns = {}

  static fromObject(obj) {
    return new this(obj);
  }

  static update(newObj, where) {
    return DB.update(this.table, newObj, where)
  }

  static delete(where) {
    return DB.delete(this.table, where)
  }

  static create(values) {
    return DB.insert(this.table, values)
  }

  static byId(id) {
    return DB.get(this.table, '*', { id: id })
      .then(rows => rows.map(row => new this(row)))
  }

  static all() {
    return DB.getAll(this.table)
      .then(rows => rows.map(row => new this(row)))
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