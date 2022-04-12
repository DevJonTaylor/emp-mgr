import { Department } from '../../../models'
import Request from '../Request'

export default class GetDepartments extends Request {
  all() {
    return Department.all()
  }

  headCount(id) {
    return !id ? Department.headCountCompany() : Department.headCountByDepartmentId(id)
  }

  headCountManagers(id) {
    return Department.headCountManagers(id)
  }

  headCountSubordinates(id) {
    return Department.headCountSubordinates(id)
  }

  byId(id) {
    return Department.byId(id)
  }

  byName(name) {
    return Department.byName(name)
  }
}