import Request from '../Request'

export default class GetRoles extends Request {
  all() {
    return Role.all()
  }

  byName(name) {
    return Role.byName(name)
  }

  byId(id) {
    return Role.byId(id)
  }

  salary(id, isDepartmentId = false) {
    return Role.totalSalaryById(id, isDepartmentId)
  }
}