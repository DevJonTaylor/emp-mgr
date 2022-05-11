import { MenuOption } from '../Classes/View/MenuOption'
import { Roles } from './Roles/Roles'
import { Departments } from './Departments/Departments'
import { Employees } from './Employees/Employees'

export class MainMenu extends MenuOption {
  display = 'Main Menu'
  message = 'Select a Category:  '

  constructor() {
    super()

    this.addOption('Employees', () => new Employees(this))
    this.addOption('Roles', () => new Roles(this))
    this.addOption('Departments', () => new Departments(this))
  }
}