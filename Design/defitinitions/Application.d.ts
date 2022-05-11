import { Menu } from './Menu'

/**
 * @classdesc The purpose of this class is to be the link to all the different moving parts and the user.
 */
declare class Application {
  isEnvironment: boolean
  isSql: boolean
  mainMenu: Menu
  screen: Screen

  requests: {
    [name: string]: Request
  }

  constructor(mainMenu: Menu)

  /**
   * Registers a Request Object.  These objects are how we communicate with the database.
   * @param {string} name
   * @param {Request} request
   * @returns {this} For chaining purposes.
   */
  public registerRequest(name: string, request: Request): this

  /**
   * This method checks if this is the first time running the app.
   * If it has not or the .env file no longer exists, it will prompt the user for the MySQL information.
   * After getting the MySQL credentials it will perform an authentication check.
   * If not successful it will request they reach out to the Administrator.
   * If successful it will save the credentials to the .env file.
   * @private
   */
  private stepOne(): boolean

  /**\
   * If isSql is true then it will skip this step.
   * If not then it will check the credentials inside .env file.
   * If they fail it will delete the .env file and ask for the credentials prompting a change.
   * If they fail it will request they reach out to administration.
   * If successful it will re-create the .env file and move on to stepThree.
   * @private
   */
  private stepTwo(): boolean

  /**
   * This step will go through and ensure all classes needed are initialized.
   * Classes needed
   * - Screen
   * - Menus
   * - Requests
   * @private
   */
  private stepThree(): void
}