import { MenuOption } from '../../Classes/View/MenuOption'

export class Employees extends MenuOption {
  display = 'Employees'
  message = 'What would you like to do within Employees:  '
  back

  constructor(back) {
    super()

    this.setBack(back)
    this.addOption('View All', () => this.back)
    this.addOption('View Managers', () => this.back)
    this.addOption('View Subordinates', () => this.back)
    this.addOption('View By Role', () => this.back)
    this.addOption('View By Department', () => this.back)
    this.addOption('Search By Name', () => this.back)
    this.addOption('Create New Employee', () => this.back)
  }
}