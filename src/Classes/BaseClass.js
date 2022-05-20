import { debug, error, http, info, level, silly, verbose, warn } from 'winston'

export class BaseClass {
  /**
   * @type Logger
   * @private
   */
  _logger

  constructor(logger) {
    this._logger = logger
  }

  error(note) {
    this._logger.log('error', note)
    return this
  }

  warn(note) {
    this._logger.log('warn', note)
    return this
  }

  info(note) {
    this._logger.log('info', note)
    return this
  }

  http(note) {
    this._logger.log('http', note)
    return this
  }

  verbose(note) {
    this._logger.log('verbose', note)
    return this
  }

  debug(note) {
    this._logger.log('debug', note)
    return this
  }

  silly(note) {
    this._logger.log('silly', note)
    return this
  }

}