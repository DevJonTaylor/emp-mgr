import Model from '../Classes/Model'
import ModelCollection from '../Classes/ModelCollection'

class Departments extends ModelCollection {}

export default class Department extends Model {
  static table = 'department'
  static keys = ['id', 'name']

  static getCollection() {
    return new Departments()
  }

  static async create(name) {
    const results = await super.create({name})
    return this.byId(results.insertId)
  }

  static getSelect() {
    return this.getQuery().select('*').from(this.table)
  }

  static all() {
    return this.get(this.getSelect())
  }

  static byName(name) {
    return this.get(this.getSelect().where('name', 'like', `%${name}%`))
  }

  static byId(id) {
    return this.get(this.getSelect().where({ id }))
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

    return this.getQuery()
      .distinct('e1.id')
      .from(tables.employee1)
      .join(...joins.manager)
  }

  static getCountQuery(countColumnName = 'head_count') {
    const { tables, joins } = this.getQueryVariables()

    return this.getQuery()
      .count({[countColumnName]: 'e.id'})
      .from(tables.department)
      .join(...joins.roleDepartmentId)
      .join(...joins.empRoleId)
  }

  static async headCountCompany() {
    const results = await this.runQuery(this.getCountQuery())
    return results[0].head_count
  }

  static async headCountByDepartmentId(id) {
    const results = await this.runQuery(this.getCountQuery().where('d.id', id))

    return results[0].head_count
  }

  static async headCountSubordinates(departmentId) {
    const countQuery = this.getCountQuery('subordinates')
      .whereNotIn('e.id', this.getManagerSubQuery())

    if(departmentId) countQuery.andWhere('d.id', departmentId)

    const results = await this.runQuery(countQuery)
    return results[0].subordinates
  }

  static async headCountManagers(departmentId) {
    const countQuery = this.getCountQuery('managers')
      .whereIn('e.id', this.getManagerSubQuery())
    if(departmentId) countQuery.andWhere('d.id', departmentId)

    const results = await this.runQuery(countQuery)

    return results[0].managers
  }
}