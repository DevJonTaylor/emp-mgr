import Modal from './Modal'
import DB from './Database'

export default class Department extends Modal {
  static table = 'department'
  static keys = ['id', 'name']

  static byName(name) {
    return DB.getQuery(this.name).where('name', 'like', `%${name}%`)
  }

  static getQueryVariables() {
    const tables = {
      roles: { r: 'role' },
      department: { d: 'department' },
      employee: { e: 'employee' },
      employee1: { e1: 'employee' },
      employee2: { e2: 'employee' }
    }

    const joins = {
      roleDepartmentId: [tables.roles, 'r.department_id', 'd.id'],
      empRoleId: [tables.employee, 'e.role_id', 'r.id'],
      manager: [tables.employee2, 'e1.id', 'e2.manager_id']
    }

    return { tables, joins }
  }

  static getManagerSubQuery() {
    const { tables, joins } = this.getQueryVariables()

    return DB.getQuery()
      .distinct('e1.id')
      .from(tables.employee1)
      .join(...joins.manager)
  }

  static getCountQuery(countColumnName = 'head_count') {
    const { tables, joins } = this.getQueryVariables()

    return DB.getQuery()
      .count({[countColumnName]: 'e.id'})
      .from(tables.department)
      .join(...joins.roleDepartmentId)
      .join(...joins.empRoleId)
  }

  static headCountCompany() {
    return DB.query(this.getCountQuery().toSQL())
  }

  static headCountByDepartmentId(id) {
    return DB.query(this
      .getCountQuery()
      .where('d.id', id)
      .toSQL())
  }

  static headCountSubordinates(id) {
    const countQuery = this.getCountQuery('subordinates')
      .whereNotIn('e.id', this.getManagerSubQuery())
    if(!id) return DB.query(countQuery.toSQL())
      .then(countArray => countArray[0].subordinates)

    return DB.query(countQuery.andWhere('d.id', id).toSQL())
      .then(countArray => countArray[0].subordinates)
  }

  static headCountManagers(id) {
    const countQuery = this.getCountQuery('managers')
      .whereIn('e.id', this.getManagerSubQuery())
    if(!id) return DB.query(countQuery.toSQL())
      .then(countArray => countArray[0].managers)

    return DB.query(countQuery.andWhere('d.id', id).toSQL())
      .then(countArray => countArray[0].managers)
  }
}