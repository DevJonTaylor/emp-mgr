import { File } from './Model/File'
import QF from '../../lib/Questions/QFactory'
import { Screen } from './View/Screen'
import { MainMenu } from '../Menus/MainMenu'
import { Menu } from './View/Menu'
import Database from './Database/Database'

const SLEEPING = 0;
const WAKING = 1;
const WORKING = 2;
const WAITING = 3;
const ERROR = 4;
const QUITING = 5;

const exitMessage = 'Thank you and have a great day!'
const envFilePath = `${ __rootdir }/.env`


class Application {
  static state = SLEEPING;
  static current
  static mainMenu
  static menu

  static get config() {
    const { DB_HOST, DB_NAME, DB_USER, DB_PW } = process.env
    return {
      host: DB_HOST,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PW
    }
  }

  static start() {
    console.clear()
    console.log('Initializing Application')
    return this.wake();
  }

  static async wake() {
    try {
      this.state = WAKING;
      const env = await File.exists(envFilePath)
      if (!env)
        return this.newEnv()
      await Database.testConnection(this.config)
    } catch(err) {
      switch(err.code) {
        case 'ENOTFOUND': // invalid host
        case 'ER_BAD_DB_ERROR': // invalid schema
        case 'ER_ACCESS_DENIED_ERROR': // Invalid user or pass
        case 'ECONNREFUSED': // MySQL server not found.
          console.clear()
          console.log('Could not start application.')
          console.log(err.message)
          await File.delete(envFilePath)
          return process.exit(1)
        default:
          return this.error(err)
      }
    }

    this.screen = new Screen()
    this.menu = new Menu(new MainMenu())

    await this.work()
  }

  static async newEnv() {
    console.clear()
    console.log('Control+C to exit.')
    console.log('Please Provide MySQL Host and Credentials:')
    const { host, database, user, password } = await QF.input('host', 'Host: ', q => q.validateEmpty.default('localhost'))
      .input('database', 'Schema Name: ', q => q.validateEmpty.default('office_db'))
      .input('user', 'Username: ', q => q.validateEmpty)
      .password('password', 'Password: ')
      .answers

    const lines = [
      `DB_HOST=${host}`,
      `DB_NAME=${database}`,
      `DB_USER=${user}`,
      `DB_PW=${password}`
    ]

    await File.write(envFilePath, lines.join('\n'))
    require('dotenv').config()
    return this.start()
  }

  static async prepare() {
    await this.screen.clear().splash()
    this.screen.log(this.menu.breadcrumb)

  }

  static async work() {
    this.state = WORKING;

    await this.prepare()

    try {
      const selected = await this.menu.execute()
      if(selected === 'exit') return this.quit()
      return this.work()
    } catch(err) {
      this.error(err)
    }
  }

  static error(err) {
    this.state = ERROR;
    console.error(err);
    process.exit(1);
  }

  static async quit() {
    this.state = QUITING
    this.screen.clear()
    await this.screen.splash()
    this.screen.log(exitMessage)
    process.exit(1)
  }
}

export { Application }