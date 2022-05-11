import mysql from 'mysql2'

export default class Database {
  static #db

  static handleError(error) {
    switch(error.code) {

      case 'ENOTFOUND': // invalid host
        return new Error('Invalid Host.')

      case 'ER_BAD_DB_ERROR': // invalid schema
        return new Error('MySQL Database Not Found.')

      case 'ER_ACCESS_DENIED_ERROR': // Invalid user or pass
        return new Error('Invalid MySQL Credentials.')

      case 'ECONNREFUSED': // MySQL server not found.
        return new Error('No MySQL Server Found.')

      default: // Unknown error
        return err
    }
  }

  static #createConnection({ host, database, user, password }) {
    return new Promise((resolve, reject) => {
      try {
        const db = new mysql.createConnection({ host, database, user, password })

        db.connect(error => {
          if(error) return Promise.reject(this.handleError(error))

          return resolve(db)
        })
      } catch(error) {
        return reject(error)
      }
    })
  }

  static async #initDb() {
    try {
      this.#db = await this.#createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PW
      })
    } catch(error) {
      return Promise.reject(error)
    }
  }

  static async getDb() {
    if(!this.#db) await this.#initDb()

    return this.#db
  }

  static testConnection({ host, database, user, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.#createConnection({ host, database, user, password })
        db.end(error => {
          if(error) return reject(this.handleError(error))
          return resolve(true)
        })
      } catch(error) {
        return reject(this.handleError(error))
      }
    })
  }

  static run(sql, binds) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDb()
        db.query(sql, binds, (error, results) => {
          if(error) return reject(error)
          return resolve(results)
        })
      } catch ( err ) {
        return reject(err)
      }
    })
  }
}

