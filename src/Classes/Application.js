import { File } from './Model/File'
import { Screen } from './View/Screen'
import { MainMenu } from '../Menus/MainMenu'
import { Menu } from './View/Menu'
import Database from './Database/Database'
import { BaseClass } from './BaseClass'
import ApplicationLogger from '../../lib/Loggers/ApplicationLogger'

export class Application extends BaseClass {
  isEnvironment = false
  isSql = false

  isAlive = true

  menu
  screen

  static #app

  static getApplication() {
    return !this.#app ? this.#app = new Application() : this.#app
  }

  async #routine() {
    const one = await this.stepOne()
    if(!one) return false
    const two = await this.stepTwo()
    if(!two) return false
    await this.stepThree()
  }

  constructor(applicationLogger) {
    super(ApplicationLogger.getLogger())
  }

  gameLoop() {
    process.on('gameLoop', () => {

      setTimeout(() => {
        if(!this.isAlive) {
          this.screen.log(this.message)
          process.exit(1)
        }
      }, 1000)

    })

    this.debug('gameLoop started')
  }

  static async start() {


    const app = this.getApplication()
    await app.initScreen().#routine()
  }

  initScreen() {
    if(!this.screen) {
      this.screen = new Screen()
      this.screen.clear()
      this.screen.log('Initializing Application')
    }
    return this
  }

  getScreen() {
    return !this.screen ? this.initScreen().screen : this.screen
  }

  get isEnvHost() {
    return typeof process.env.DB_HOST !== 'undefined'
  }

  async #isEnv() {
    if(!this.isEnvHost) {
      const isFile = await File.exists(`${__rootdir}/.env`)
      console.log(isFile)
      if(!isFile) return false
    }

    this.isEnvironment = true
    return true
  }

  async #promptCredentials() {
    this.screen.log('Please Provide MySQL Host and Credentials:')

    return this.screen.getFactory()
      .input('host', 'Host: ', q => q.validateEmpty.default('localhost'))
      .input('database', 'Schema Name: ', q => q.validateEmpty.default('office_db'))
      .input('user', 'Username: ', q => q.validateEmpty)
      .password('password', 'Password: ')
      .answers
  }

  async #checkCredentials(config) {
    if(!config) config = {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PW
    }
    try {
      return await Database.testConnection(config)
    } catch(error) {
      if(!this.isEnvironment) {
        this.screen.log(`ERROR:  ${ error.name }`)
        this.exit('Please contact your System Administrator for assistance connecting.')
      } else {
        this.screen.log('Saved Credentials are invalid')
        this.screen.log('Removing Environment File')
        await File.delete(`${__rootdir}/.env`)
        delete process.env.DB_HOST
        return false
      }
    }
  }

  async #saveEnv({ host, database, user, password }) {
    const lines = [
      `DB_HOST=${host}`,
      `DB_NAME=${database}`,
      `DB_USER=${user}`,
      `DB_PW=${password}`
    ]

    try {
      await File.write(`${__rootdir}/.env`, lines.join('\n'))
    } catch(error) {
      console.error(error)
      this.exit('UNKNOWN ERROR')
    }
  }

  async stepOne() {
    this.screen.log('Testing Environment File')
    const isEnv = await this.#isEnv()
    if(!isEnv) {
      this.screen.log('Missing Environment File')
      const config = await this.#promptCredentials()
      await this.#checkCredentials(config)
      await this.#saveEnv(config)

      this.screen.log('Environment File Created')
      this.isEnvironment = true
      this.isSql = true
    }

    return true
  }

  async stepTwo() {
    if(!this.isSql) {
      const successful = this.#checkCredentials()
      if(!successful) return this.#routine()
      this.isSql = true

      return true
    }

    return true
  }

  stepThree() {
    const mainMenu = new MainMenu()
    this.menu = new Menu(mainMenu)

    this.screen.setMenu(this.menu)

    return this.run()
  }

  async run() {

  }

  exit(message) {
    this.message = message
    this.isAlive = false
  }
}