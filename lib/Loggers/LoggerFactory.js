import winston from 'winston'

const DEFAULT_LEVEL = 'info'

export class LoggerFactory {

  static newFile({ level, format, meta, filename }, options = {}) {
    const factory = new LoggerFactory()
    if(!filename) filename = 'default'
    if(meta) factory.meta(meta)
    factory.level(!level ? DEFAULT_LEVEL : level)
    factory.format(!format ? winston.format.json() : format)
    factory.transport(factory.fileTransport('./logs', filename))

    return factory.create()
  }

  _config = {
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {},
    transports: []
  }

  get config() {
    return {...this._config}
  }

  level(level) {
    if(!level) return this.config.level
    this._config.level = level

    return this
  }

  format(format) {
    if(!format) return this.config.format
    this._config.format = format

    return this
  }

  transport(transport) {
    if(!transport) return this.config.transports
    this._config.transports.push(transport)

    return this
  }

  fileTransport(path, filename, options = {}) {
    return new winston.transports.File({ filename: `${path}/${filename}.log`, ...options })
  }

  meta(metaObject) {
    if(!metaObject) return this.config.defaultMeta
    this._config.defaultMeta = {...this._config.defaultMeta, ...metaObject}
  }

  options(options) {
    if(!options) return this.config
    this._config = {...this._config, ...options}

    return this
  }

  create() {
    return winston.createLogger(this.config)
  }
}