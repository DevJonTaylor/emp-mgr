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

  static _getQuery(table) {
    if(!this._query) this._query = knex({client: 'mysql'})

    return !table ? this._query : this._query(table)
  }

  static query(query, preparedStatementArray = []) {
    return new Promise((resolve, reject) => {
      this._getDb()
        .then(db => {
          db.query(query, preparedStatementArray, (err, results) => {
            if(err) return reject(err)
            return resolve(results)
          })
        })
    })
  }

  static update(table, obj, where) {
    const q = this._getQuery(table).update(obj).where(where).toSQL()
    return this.query(q.sql, q.bindings)
  }

  static insert(table, obj) {
    const q = this._getQuery(table).insert(obj)
    return this.query(q.toSQL().sql, q.toSQL().bindings)
  }

  static getAll(table, columns = '*') {
    return this.get(table, columns)
  }

  static get(table, columns = '*', where = []) {
    const q = this._getQuery(table).select(columns)
    if(!Array.isArray(where)) {
      q.where(where)
    } else if(where.length) {
      if(where.length > 1) for(const w of where) q.orWhere(w)
      else q.where(where[0])
    }
    let sql = q.toSQL()
    return this.query(sql.sql, sql.bindings)
  }

  static delete(table, where) {
    const q = this._getQuery(table).delete().where(where).toSQL()
    return this.query(q.sql, q.bindings)
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