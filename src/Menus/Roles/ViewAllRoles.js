import { MenuOption } from '../../Classes/View/MenuOption'

export class ViewAllRoles extends MenuOption {
  display = 'View All Roles'
  message = 'Select a Role:  '

  constructor(back) {
    super()

    this.setBack(back)
    // TODO:  Get All Roles
  }
}