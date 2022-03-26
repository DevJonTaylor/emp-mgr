import mysql from 'mysql2'
import knex from 'knex'

/**
 * @property {mysql.Connection} _db
 * @property {knex.QueryBuilder} _query
 */
export default class Database {
  static _db
  static _query
  static _error = ''

  /**
   *
   * @returns {Promise<mysql.Connection>}
   * @private
   */
  static _getDb() {
    return new Promise((resolve, reject) => {
      if(!this._db) {
        this._db = mysql.createConnection({
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASS
        })

        this._db.connect(err => {
          if(err) {
            return reject(this._handleConnectionError(err))
          }
          return resolve(this._db)
        })
      } else {
        return resolve(this._db)
      }
    })
  }

  static getQuery(table) {
    if(!this._query) this._query = knex({client: 'mysql'})

    return !table ? this._query : this._query(table)
  }

  static query(query, preparedStatementArray = null) {
    return new Promise((resolve, reject) => {
      this._getDb()
        .then(db => {
          if(!preparedStatementArray) {
            db.query(
              query.sql,
              query.bindings,
              (err, results) => !err ? resolve(results) : reject(err))
          } else {
            db.query(
              query,
              preparedStatementArray,
              (err, results) => !err ? resolve(results) : reject(err))
          }
        })
    })
  }

  static update(table, obj, where) {
    return this.query(this.getQuery(table).update(obj).where(where).toSQL())
  }

  static insert(table, obj) {
    return this.query(this.getQuery(table).insert(obj).toSQL())
  }

  static getAll(table, columns = '*') {
    return this.get(table, columns)
  }

  static get(table, columns = '*', where = []) {
    const q = this.getQuery(table).select(columns)
    if(!Array.isArray(where)) {
      q.where(where)
    } else if(where.length) {
      if(where.length > 1) for(const w of where) q.orWhere(w)
      else q.where(where[0])
    }
    return this.query(q.toSQL())
  }

  static delete(table, where) {
    return this.query(this.getQuery(table).delete().where(where).toSQL())
  }

  static _handleConnectionError(err) {
    switch(err.code) {

      case 'ENOTFOUND': // invalid host
        return 'Invalid host provided'

      case 'ER_BAD_DB_ERROR': // invalid schema
        return 'Unknown database provided'

      case 'ER_ACCESS_DENIED_ERROR': // Invalid user or pass
        return 'Invalid credentials'

      default: // Unknown error
        return err
    }
  }

  static check(config) {
    return new Promise((resolve, reject) => {
      const conn = mysql.createConnection(config)
      conn.connect(err => {
        if(err) {
          return reject(this._handleConnectionError(err))
        }

        conn.end()
        return resolve()
      })
    })
  }
}