import { MenuOption } from '../../../Classes/View/MenuOption'
import ViewRole from './ViewRole'
import { createDepartment } from '../Functions'

export function newDepartment(self) {
  return [ 'New Department', async () => {
    const department = await createDepartment()
    if(!department) return self
    return new ViewRole(self, department)
  } ]
}

export class ViewAllRoles extends MenuOption {
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
    return () => new ViewRole(this, department)
  }
}

export { ViewRole }