import { Splash } from './Splash'
import { Colors }  from './Colors'
import QF from '../../../lib/Questions/QFactory'
import { getTable } from 'console.table'

export class Screen {
  menu

  getFactory() {
    return QF
  }

  clear() {
    console.clear()
    return this
  }

  log(...variable) {
    console.log(...variable)
    return this
  }

  table(...variable) {
    getTable(...variable)
    return this
  }

  setMenu(menu) {
    this.menu = menu
  }

  update(selected) {
    return this.menu.update(selected)
  }

  async splash() {
    const splash = await Splash.get()
    return this.log(Colors.retro.$(splash))
  }

  breadcrumb() {
    return this.log(this.menu.breadcrumb)
  }

  async run() {
    await this.clear().splash()
    this.breadcrumb()
    const selected = await this.menu.render()
    await this.menu.update(selected)
  }
}