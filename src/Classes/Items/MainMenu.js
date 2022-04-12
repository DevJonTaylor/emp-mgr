import Item from "./Item";
import Menu from "../Menu";
import Employees from "./Employees/Employees";
import Exit from "./Exit";

export default class MainMenu extends Item {
  execute() {
    const menu = super.execute('Main Menu', 'What subject would you like to choose?')
    menu.register('Employees', new Employees())
    menu.register('Exit', new Exit())
    return menu
  }
}