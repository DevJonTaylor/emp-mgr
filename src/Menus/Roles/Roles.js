import { MenuOption } from '../../Classes/View/MenuOption'

export class Roles extends MenuOption {
  display = 'Roles'
  message = 'What would you like to do with Roles:  '
  back

  constructor(back) {
    super()

    this.setBack(back)
    this.addOption('View All', () => this.back)
    this.addOption('View By Department', () => this.back)
    this.addOption('Search By Name', () => this.back)
    this.addOption('Create New Role', () => this.back)
  }
}