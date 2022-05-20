import { MenuOption } from '../../Classes/View/MenuOption'

export class Roles extends MenuOption {
  display = 'View All Roles'
  message = 'Select a Role:  '

  constructor(back) {
    super()

    this.setBack(back)
    this.addOption('View All', () => this.back)
    this.addOption('View By Department', () => this.back)
    this.addOption('Search By Name', () => this.back)
    this.addOption('Create New Role', () => this.back)
  }
}