import { camelCase } from 'lodash'

export class MenuOption {
  display = ''
  name = ''
  message = ''
  back
  mainMenu
  options = []

  /**
   *
   * @param [back]
   * @returns { MenuOption }
   */
  constructor(back) {
    return !back ? this.selfRoot() : this.setBack(back)
  }

  get name() {
    return camelCase(this.display)
  }

  setBack(back) {
    this.back = back
    this.mainMenu = back.mainMenu
  }

  selfRoot() {
    this.mainMenu = this

    return this
  }

  breadcrumb() {
    if(this.mainMenu === this) return this.display
    return `${this.back.breadcrumb()} > ${this.display}`
  }

  addOption(display, method) {
    const option = {
      display,
      method,
      name: camelCase(display),
      object: this
    }

    this[option.name] = method.bind(this)
    this.options.push(option)

    return this
  }
}