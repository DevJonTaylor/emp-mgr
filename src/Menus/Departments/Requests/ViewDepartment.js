import { MenuOption } from '../../../Classes/View/MenuOption'
import { editDepartment, deleteDepartment, displayDepartment } from '../Functions'

export default class ViewDepartment extends MenuOption {
  display = 'View'
  department

  get message() {
    displayDepartment(this.department.toObject())
    return 'Select an attribute to edit'
  }

  constructor(back, department) {
    super()
    this.setBack(back)
    this.department = department

    this.display = department.name

    this.addOption(`Name: ${department.name}`, async () => {
      this.department = await editDepartment()
      return this
    })

    this.addOption(`Delete ${this.department.name}`, async () => {
      const isDeleted = await deleteDepartment(this.department)

      if(!isDeleted) return this
      return this.back
    })
  }
}