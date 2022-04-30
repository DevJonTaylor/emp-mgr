import BaseDisplay from './Classes/BaseDisplay'
import EmployeesMenu from './Menus/Employees'
const MainMenu = new BaseDisplay({ name: 'Main Menu', message: 'Select a Category:' })
MainMenu
  .addMenu('Employees', EmployeesMenu)
  .addMenu('Roles', () => {})
  .addMenu('Departments', () => {})
  .render()