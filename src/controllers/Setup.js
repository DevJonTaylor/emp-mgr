import { readFile, writeFile } from 'fs/promises'
import QF from '../../lib/Questions/QFactory'
import Database from '../modals/Database'
import AppView from '../views/AppView'
import dotenv from 'dotenv'
import App from './App'
import { Department, Role, Employee } from '../modals'
import { department, role, employee } from '../../seeds.json'

export default class Setup {
  static _configPath = `${__rootdir}/.env`

  static _checkConfigFile() {
    return readFile(this._configPath, 'utf8')
  }

  static _handleNoConfig() {
    AppView.log('Configuration Required:')
    return QF.input('host', 'MySQL host name?')
      .input('database', 'Database name?')
      .input('user', 'MySQL Username?')
      .password('password', 'MySQL Password?')
      .answers
  }

  static _writeConfigFile(config) {
    return writeFile(this._configPath, config.join('\n'), 'utf8')
  }

  static async run() {
    try {
      await this._checkConfigFile()
    } catch(err) {
      if(err.code === 'ENOENT') {  // .env file does not exist
        AppView.clear()
        const answers = await this._handleNoConfig()
        try {
          await Database.check(answers)
        } catch(err) {
          AppView.error(err)
          AppView.error('Exiting Application')
          process.exitCode = 1
          return Promise.reject(0)
        }

        await this._writeConfigFile([
          `DB_HOST=${answers.host}`,
          `DB_NAME=${answers.database}`,
          `DB_USER=${answers.user}`,
          `DB_PASS=${answers.password}`
        ])
      }
    }

    return new App()
  }

  static async seed() {
    await Department.create(department)
    await Role.create(role)
    await Employee.create(employee)
    AppView.log('Seeds inserted')
    process.exit(1)
  }

  static async checkArguments() {
    const args = [...process.argv].splice(2, 2)
    for(const arg of args) {
      switch(arg) {
        case 'seed':
          await this.seed()
          break
      }
    }
  }

  static config() {
    dotenv.config()
  }
}