import QF from '../../lib/Questions/QFactory'
import { camelCase } from "lodash";

export default class Menu {
  #name = ''
  #message = ''
  #items = []

  constructor(name, message) {
    this.name(name)
    this.message(message)
  }

  /**
   * getter and setter for the name property
   * @param {string} [name]
   * @returns {string|this}
   */
  name(name) {
    if(!name) return this.#name
    this.#name = name

    return this
  }

  /**
   * getter and setter for the message property
   * @param {string} [message]
   * @returns {string|Menu}
   */
  message(message) {
    if(!message) return this.#message
    this.#message = message

    return this
  }

  /**
   * This adds a new item to the menu
   * @param {string} name
   * @param {Item} item
   */
  register(name, item) {
    this.#items.push({ nick: camelCase(name), name, item})
  }

  /**
   * Returns an array of names to be displayed for the user to select
   * @returns {Array<string>}
   */
  #getDisplayNames() {
    const displayNames = []
    for(const item of this.#items) {
      displayNames.push(item.name)
    }

    return displayNames
  }


  async display() {
    try {
      const answer = await QF.list(this.#name, this.#message, list =>
        list.newChoices(this.#getDisplayNames())
      ).answers

      return this.#items.find(item => item.nick === answer[camelCase(this.#name)]).item
    } catch(err) {
      console.error(err)
    }
  }
}