import { MenuOption } from '../../Classes/View/MenuOption'
import { viewAll, newDepartment } from './Requests'

export class Departments extends MenuOption {
  display = 'Departments'
  message = 'What would you like to do within Departments:  '
  back

  constructor(back) {
    super()

    this.setBack(back)
    this.addOption(...viewAll(this))
    this.addOption(...newDepartment(this))
  }
}

