import { MenuOption } from '../../../Classes/View/MenuOption'
import ViewDepartment from './ViewDepartment'
import { createDepartment } from '../Functions'

export function newDepartment(self) {
  return [ 'New Department', () => {
    const department = createDepartment()
    if(!department) return self
    return new ViewDepartment(self, department)
  } ]
}

export class ViewAllDepartments extends MenuOption {
  display = 'View All'
  message = 'Select a Department'

  constructor(back, departments) {
    super()

    this.setBack(back)
    this.collection = departments
    this.displayCollection()

    this.addOption(...newDepartment(this))
  }

  handleDisplay(department) {
    return department.name
  }

  handleRequest(department) {
    return () => new ViewDepartment(this, department)
  }
}

export { ViewDepartment }