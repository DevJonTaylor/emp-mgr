import { Logger } from './Logger'

export default class ApplicationLogger extends Logger {
  static logger

  static getLogger() {
    if(!this.logger) this.logger = this.newFile({ filename: 'Application' })

    return this.logger
  }
}