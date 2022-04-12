import Request from '../Request'
import { Employee, Subordinate, Manager } from "../../../models";
export default class GetEmployees extends Request {
  all() {
    return Employee.all()
  }

  allSubordinates() {
    return Subordinate.all()
  }

  allManagers() {
    return Manager.all()
  }

  byName(name) {
   return Employee.byName(name)
  }

  async byDepartment(id) {
    const subs = await Subordinate.byDepartmentId(id)
    const mgrs = await Manager.byDepartmentId(id)

    return [...subs, ...mgrs]
  }

  async byRole(id) {
    const subs = await Subordinate.byRoleId(id)
    const mgrs = await Manager.byRoleId(id)

    return [...subs, ...mgrs]
  }

  byId(id) {
    return Employee.byId(id)
  }
}