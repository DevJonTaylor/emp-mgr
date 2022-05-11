export default class ModelCollection {
  collection = new Map()

  set(pk, row) {
    this.collection.set(pk, row)

    return this
  }

  has(pk) {
    return this.collection.has(pk)
  }

  get(pk) {
    return !this.has(pk) ? null : this.collection.get(pk)
  }

  forEach(callback) {
    this.collection.forEach(callback)
  }

  get length() {
    return this.collection.size
  }

  toObject() {
    return Object.values(Object.fromEntries(this.collection)).map(row => row.toObject())
  }

  toString() {
    return JSON.stringify(this.toObject())
  }
}