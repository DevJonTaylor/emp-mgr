import { readFile, writeFile, rm } from 'fs/promises'

export class File {
  static async exists(path) {
    try {
      const data = await this.read(path)
      return data !== null
    } catch(err) {
      return Promise.reject(err)
    }
  }

  static async read(path) {
    try {
      return await readFile(path, 'utf8')
    } catch(err) {
      switch(err.code) {
        case 'ENOENT':
          return null
        default:
          return Promise.reject(err)
      }
    }
  }

  static write(path, data) {
    return writeFile(path, data, 'utf8')
  }

  static delete(path) {
    return rm(path)
  }
}