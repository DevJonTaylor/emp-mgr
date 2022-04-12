import Item from "../Item";
import Menu from "../../Menu";
import AllEmployees from "./AllEmployees";
import Exit from "../Exit";

export default class Employees extends Item {
  execute() {
    const menu = super.execute('Employees', 'What would you like to do with the employees?')
    menu.register('All Employees', new AllEmployees())
    menu.register('Back', new Menu())
    menu.register('Exit', new Exit())
    return menu
  }
}