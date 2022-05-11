import { MenuOption } from '../../Classes/View/MenuOption'

export class Departments extends MenuOption {
  display = 'Departments'
  message = 'What would you like to do within Departments:  '
  back

  constructor(back) {
    super()

    this.setBack(back)
    this.addOption('View All', () => this.back)
    this.addOption('Search By Name', () => this.back)
    this.addOption('Create New Department', () => this.back)
  }
}