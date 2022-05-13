import { MenuOption } from '../../../Classes/View/MenuOption'
import { editDepartment, deleteDepartment, displayDepartment, allDepartments } from '../Functions'

export default class ViewDepartment extends MenuOption {
  display = 'View'

  department

  get message() {
    displayDepartment(this.department.toObject())
    return 'Select an attribute to edit'
  }

  // async back() {
  //   this._back.collection = viewAll()
  //   this._back.displayCollection()
  //   return this._back
  // }

  constructor(back, department) {
    super()
    this.back = back
    this.mainMenu = back.mainMenu
    this.setDepartment(department)

    this.addOption(`Name: ${department.name}`, async () => {
      try {
        this.department = await editDepartment(this.department)
        this.back.collection = await viewAll(this)
        return new ViewDepartment(this.back, this.department)
      } catch(error) {
        console.error(error)
      }
    })

    this.addOption(`Delete ${this.department.name}`, async () => {
      const isDeleted = await deleteDepartment(this.department)

      if(!isDeleted) return this
      this.back.collection = await allDepartments()
      this.back.displayCollection()
      return this.back
    })
  }

  setDepartment(department) {
    this.department = department
    this.display = department.name
  }
}