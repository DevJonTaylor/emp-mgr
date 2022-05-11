import Splash from './Splash'
import { nanoid } from 'nanoid'
import QF from '../../../lib/Questions/QFactory'
import { camelCase } from 'lodash'



/**
 * @typedef {{[name:string]: string}} menuObject
 * @typedef {{[id: string]: (Menu) => void}} answerObject
 *
 * @class
 * @property {string} name The name that is displayed on the menu on the back option and breadcrumbs.
 * @property {string} msg The message that is displayed when the menu opens.
 * @property {Menu} previous This is the last menu selected.
 * @property {menuObject} menu This hold the menu display name and ID
 * @property {answerObject} answers This holds the function that is run when the menu option is selected.
 */
class Menu {
  name
  msg
  previous
  menu = {}
  answers = {}

  constructor({ name, message, previous }) {
    this.previous = previous
    this.name = name
    this.msg = message
  }

  /**
   * Adds an item to the menu.
   * @param { string } name
   * @param { (this) => void } action
   * @returns { this } For chaining.
   */
  addMenu(name, action) {
    const id = camelCase(nanoid().toLowerCase())
    this.menu[name] = id
    this.answers[id] = action

    return this
  }

  /**
   * Returns the current Breadcrumb
   * @returns {string}
   */
  breadcrumb() {
    if(!this.previous) return this.name
    return `${this.previous.breadcrumb()} > ${this.name}`
  }

  /**
   * Runs Inquirer questions
   * @returns {Promise<answer>}
   */
  getAnswer() {
    if(this.previous) this.addMenu(`Back to ${this.previous.name}`, () => {
      return this.previous.render()
    })
    this.addMenu('Exit', () => {
      console.log('Hav a fantastic day!')
      process.exit(1)
    })
    return QF.list('answer', this.msg, list => {
      for(const [name, value] of Object.entries(this.menu)) {
        list.newChoice(name, choice => choice.value(value))
      }
    }).answers
  }

  /**
   * Clears the screen, displays the splash, displays the breadcrumb, and returns void when done.
   * @returns {Promise<void>}
   */
  setup(breadcrumb) {
    return Splash.get()
      .then(splash => {
        console.clear()
        console.log(splash)
        console.log(!breadcrumb ? this.breadcrumb() : breadcrumb)
        return Promise.resolve()
      })
  }

  /**
   * Starts everything off.
   * @returns {void}
   */
  render(tempBreadcrumb) {
    this.setup(`${this.breadcrumb()} > ${tempBreadcrumb}`)
      .then(() => {
        return this.getAnswer()
      })/
      .then(({ answer }) => this.run(answer))
  }

  /**
   * Runs the answer selected.
   * @param answer
   * @returns {Promise<void>}
   */
  run(answer) {
    return this.setup()
      .then(() => this.answers[answer](this))
  }
}

export default Menu