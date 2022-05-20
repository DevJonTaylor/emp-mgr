import { MenuOption } from '../../Classes/View/MenuOption'

export class Roles extends MenuOption {
  display = 'Roles'
  message = 'What would you like to do within Roles:  '
  back

  constructor(back) {
    super()

    this.setBack(back)
    this.addOption('View All Roles', () => this.back)
    this.addOption('View Roles By Department', () => this.back)
    this.addOption('Create New Role', () => this.back)
  }
}