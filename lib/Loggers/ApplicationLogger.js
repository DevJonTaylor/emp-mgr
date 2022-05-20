import { LoggerFactory } from './LoggerFactory'

export default class ApplicationLogger extends LoggerFactory {
  static logger

  static getLogger() {
    if(!this.logger) this.logger = this.newFile({ filename: 'Application' })

    return this.logger
  }
}