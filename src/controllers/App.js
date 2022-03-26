import AppView from '../views/AppView'
import QF from '../../lib/Questions/QFactory'
import { readFile } from 'fs/promises'

export default class App {
  _splash = ''
  _mainOptions = [
    'Employee',
    'Department',
    'Role',
    'Exit'
  ]

  constructor() {}

  async splash() {
    if(!this._splash)
      this._splash = await readFile(`${__rootdir}/lib/figlet/splash`, 'utf8')
    AppView.clear()
    AppView.gradientMultiline(this._splash)
  }

  routeMain(option) {
    switch(option) {
      
    }
  }

  async main() {
    await this.splash()
    /** @type { { option: string } }*/
    const answers = await QF
      .list('option', 'What would you like to do?', list => {
        list.newChoices(this._mainOptions)
      })
      .answers

    return answers.option
  }
}