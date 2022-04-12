import Menu from "../Menu";

/**
 * @class
 * This class is influenced by the Invoker class from the Command design.  The idea is that it will reference either
 * a Menu or a Request class.
 */
export default class Item {
  /**
   * This method is supposed to be overwritten.
   * It will be expected and utilized to create either the Menu class or Request class.
   */
  execute(name, message) {
    return new Menu(name, message)
  }
}

