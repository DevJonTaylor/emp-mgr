/**
 * @typedef {{
 *   [Name: string]: QuestionObject
 * }} QuestionCollection
 * @typedef {{
 *   name: string,
 *   message: string,
 *   breadcrumb: Array<string>,
 *   list: ListCollection
 * }} QuestionObject
 * @typedef { Array<ListObject> } ListCollection
 * @typedef {{
 *   name: string,
 *   value: string,
 *   type: 'list' | 'function'
 * }} ListObject
 */

import { readFile } from 'fs/promises'
import QF from '../../lib/Questions/QFactory'
import { Employee } from '../models'
import manageQuestions from './questions.json'
import gradient from 'gradient-string'

/**
 * @property {QuestionCollection} questions
 * @property {string} exitMessage
 * @property {Array<string>} breadcrumbs
 * @property {QuestionObject} current
 * @property {QuestionObject} last
 * @property {Array<QuestionObject>} history
 * @property {string} splash
 */
export class UX {
  questions
  exitMessage = 'Have a great day!'
  breadcrumbs = []
  current
  last
  history
  splash

  constructor(questions) {
    this.questions = questions
  }

  /**
   * Gets the QuestionObject based on the hash provided.
   * @param {string} name
   * @returns {QuestionObject}
   */
  get(name) {
    if(this.current) this.last = this.current
    this.current = this.questions[name]
    this.history.push(this.current)
    this.breadcrumbs = this.current.breadcrumbs

    return this.questions[name]
  }

  async promptList(name) {
    const q = this.get(name)
    QF.list(q.name, q.message, list => {
      for(const { name, value } of q.list) {
        list.newChoice(value, choice => choice.value(name))
      }
    })

    await this.displaySplash()
      .displayBreadcrumbs()
  }

  displayBreadcrumbs() {
    this.log(this.breadcrumbs.join(' > '))

    return this
  }

  /**
   * shortcut to console.log
   * @param {string} log
   * @returns {this}
   */
  log(log) {
    console.log(log)

    return this
  }

  /**
   * Ends the app
   */
  exit() {
    this.log(this.exitMessage)
    process.exit(1)
  }

  async displaySplash() {
    if(!this.splash)
      this.splash = gradient.retro(await readFile(`${__rootdir}/lib/figlet/splash`, 'utf8'))

    this.log(this.splash)
    return this
  }

  async editEmployee(id) {

  }

  async searchEmployees(name = '', pages = 0) {
    if(!name && !pages){
      const { employeeName } = await QF.input('employeeName', 'Name to search by?').answers
      name = employeeName
    }
    const employees = await Employee.byName(name, pages === 0 ? 1 : pages)
    this.exit()
    const answer = {
      selectedEmployee
    } = await QF.list('selectedEmployee', 'Select an Employee to Edit', list => {
      employees.results.forEach(emp => {
        const display = `${emp.id} | ${emp.name} | ${emp.title}`
        list.newChoice(display, choice => choice.value(JSON.stringify(emp.id)))
      })
      list.newChoice('Back').newChoice('Exit')
    }).answers

    switch(answer) {
      case 'back':
        break
      case 'exit':
        break
      default:
        return this.editEmployee(id)
    }
  }
}

export { manageQuestions }