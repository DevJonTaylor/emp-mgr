import { MenuOption } from '../../Classes/View/MenuOption'

export class ViewRolesByDepartment extends MenuOption {
  display = 'View Roles By Department'
  message = 'Select a Role:  '
  back

  constructor(back) {
    super()

    this.setBack(back)
    this.addOption('View All Roles', () => this.back)
    this.addOption('View Roles By Department', () => this.back)
    this.addOption('Create New Role', () => this.back)
  }
}