import { Application } from '../Application'
import QF from '../../../lib/Questions/QFactory'
import { camelCase } from 'lodash'

export class Menu {
  name = 'Exit'
  message = 'Thank you and have a fantastic day!'
  current
  mainMenu
  options = new Map()

  constructor(mainMenu) {
    this.mainMenu = mainMenu
    this.setCurrent(mainMenu)
  }

  get breadcrumb() {
    return this.current.breadcrumb()
  }

  get back() {
    return this.current.back
  }

  setCurrent(menuOption) {
    this.options.clear()
    this.current = menuOption
  }

  addOption(name, method) {
    this.options.set(name, method)
  }

  addChoice(list, { display, name, method, object }) {
    list.newChoice(display, choice => choice.value(name))
    this.addOption(name, method.bind(object))
  }

  addExit(list) {
    this.addChoice(list, {
      display: 'Exit',
      name: 'exit',
      method: () => {
        Application.getApplication().exit(this.message)
        return this.current
      },
      object: this
    })
  }

  addMainMenu(list) {
    if(this.mainMenu === this.current || this.mainMenu === this.back) return

    this.addChoice(list, {
      display: this.mainMenu.display,
      name: this.mainMenu.name,
      method: () => this.mainMenu,
      object: this
    })
  }

  addBack(list) {
    if(!this.current.back) return
    this.addChoice(list, {
      display: `Back to ${this.back.display}`,
      name: 'back',
      method: () => this.back,
      object: this
    })
  }

  async render() {
    try {
      const { selected } = await QF.list('selected', this.current.message, list => {
        this.current.options.forEach(option => {
          this.addChoice(list, option)
        })
        this.addBack(list)
        this.addMainMenu(list)
        this.addExit(list)
      })
        .answers

      return selected
    } catch(error) {
      return Promise.reject(error)
    }
  }

  async execute() {
    try {
      await this.current.prepare()
      const results = this.render()
      await this.current.clean()

      const method = this.options.get(results)
      const newCurrent = await method()
      this.setCurrent(newCurrent)
    } catch(error) {
      return Promise.reject(error)
    }
  }
}