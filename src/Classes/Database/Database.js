import mysql from 'mysql2'

export default class Database {
  static #db
  static getDb() {
    return new Promise((resolve, reject) => {
      if(!this.#db) {
        this.#db = mysql.createConnection({
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PW
        })

        this.#db.connect(err => {
          if(err) {
            switch(err.code) {

              case 'ENOTFOUND': // invalid host
                return reject(new Error('Invalid Host.'))

              case 'ER_BAD_DB_ERROR': // invalid schema
                return reject(new Error('MySQL Database Not Found.'))

              case 'ER_ACCESS_DENIED_ERROR': // Invalid user or pass
                return reject(new Error('Invalid MySQL Credentials.'))

              case 'ECONNREFUSED': // MySQL server not found.
                return reject(new Error('No MySQL Server Found.'))

              default: // Unknown error
                return reject(err)
            }
          }
          return resolve(this.#db)
        })
      } else {
        return resolve(this.#db)
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

