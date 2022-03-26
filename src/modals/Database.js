import mysql from 'mysql2'

export default class Database {
  _db
  _error = ''

  static check(config) {
    return new Promise((resolve, reject) => {
      const conn = mysql.createConnection(config)
      conn.connect(err => {
        if(err) {
          switch(err.code) {
            case 'ENOTFOUND': // invalid host
              return reject('Invalid host provided');
            case 'ER_BAD_DB_ERROR': // invalid schema
              return reject('Unknown database provided')
            case 'ER_ACCESS_DENIED_ERROR': // Invalid user or pass
              return reject('Invalid credentials')
            default:
              return reject(err) // Unknown error
          }
        }

        conn.end()
        return resolve()
      })
    })
  }
}