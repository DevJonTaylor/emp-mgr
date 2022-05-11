import type QFactory from '../../lib/Questions/QFactory'
import type { Scene } from './Scene'
export declare class Screen {
  constructor()

  /**
   * Clears the console
   * @return {this} For chaining purposes.
   */
  clear(): this

  /**
   * Logs input to the console.
   * @returns {this} For chaining purposes.
   */
  log(): this

  /**
   * Displays the figlet design on the console.
   */
  splash(): this

  /**
   * Presents the current access point in the menu.
   * @param {string} crumbs
   * @returns {this} For chaining purposes.
   */
  breadcrumbs(crumbs: string): this

  /**
   *
   */
  getQFactory(): QFactory

  newScene(): Scene
}

