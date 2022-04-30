import Model from '../Classes/Model'
import ModelCollection from '../Classes/ModelCollection'
import { concatRaw, getRaw } from '../Classes/Database/QueryBuilder'

class EmployeeCollection extends ModelCollection {}

export class Employee extends Model {
  static table = 'employee'
  static keys = ['id', 'first_name', 'last_name', 'role_id', 'manager_id']

  static helper = {
    r: {
      table: { r: 'role' },
      id: 'r.id',
      title: 'r.title',
      salary: 'r.salary',
      departmentId: 'r.department_id'
    },
    e: {
      table: { e: 'employee' },
      name: concatRaw('e.first_name', `' '`, 'e.last_name'),
      id: 'e.id',
      managerId: 'e.manager_id',
      roleId: 'e.role_id'
    },
    e2: {
      table: { e2: 'employee' },
      id: 'e2.id',
      name: concatRaw('e2.first_name', `' '`, 'e2.last_name')
    },
    d: {
      table: { d: 'department' },
      id: 'd.id',
      name: 'd.name',
    }
  }

  static qManagers() {
    return this.getQuery()
      .distinct('manager_id')
      .from('employee')
      .whereNotNull('manager_id')
  }

  static getCollection() {
    return new EmployeeCollection()
  }

  static async create(values) {
    const results = await super.create(values)
    return this.byId(results.insertId)
  }

  static all() {
    return this.get(this.getQuery(true).select('*'))
  }

  static byId(id) {
    return this.get(this.getQuery(true).select('*').where({id}))
  }

  static concatName() {
    return concatRaw('first_name', `' '`, 'last_name')
  }

  static byName(name) {
    return this.get(this
      .getQuery()
      .from(this.table)
      .select('*')
      .where(this.concatName(), 'like', `%${name}%`)
    )
  }
}

export class Subordinate extends Employee {
  static keys = ['id', 'name', 'title', 'salary', 'department', 'manager']

  static q() {
    const {
      e,
      r,
      d,
      e2
    } = this.helper

    return this.getQuery()
      .select({
        id: e.id,
        name: e.name,
        title: r.title,
        salary: r.salary,
        department: d.name,
        manager: e2.name
      })
      .from(e.table)
      .leftJoin(e2.table, e2.id, e.managerId)
      .rightJoin(r.table, r.id, e.roleId)
      .rightJoin(d.table, d.id, r.departmentId)
      .whereNotIn(e.id, this.qManagers())
  }

  static all() {
    return this.get(this.q())
  }

  static byId(id) {
    return this.get(this.q().where({ 'e.id': id }))
  }

  static byName(name) {
    return this.get(this.q().where( this.helper.e.name, 'like', `%${name}%` ))
  }

  static byDepartment(id) {
    return this.get(this.q().where({ 'd.id': id }))
  }

  static byRole(id) {
    return this.get(this.q().where({ 'r.id': id }))
  }

  static byManager(id) {
    return this.get(this.q().where({ 'e.manager_id': id }))
  }
}

export class Manager extends Subordinate {
  static table = 'employee'
  static keys = ['id', 'name', 'title', 'salary', 'department', 'employees']

  static q() {
    const {
      e,
      r,
      d,
      e2
    } = this.helper

    return this.getQuery()
      .select({
        id: e.id,
        name: e.name,
        title: r.title,
        salary: r.salary,
        department: d.name,
        employees: getRaw('(select count(`id`) from `employee` where `manager_id` = `e`.`id`)')
      })
      .from(e.table)
      .leftJoin(e2.table, e2.id, e.managerId)
      .rightJoin(r.table, r.id, e.roleId)
      .rightJoin(d.table, d.id, r.departmentId)
      .whereIn(e.id, this.qManagers())
  }
  
  static async getTeam(id) {
    const manager = await this.byId(id)
    if(!manager) return null

    const subs = await Subordinate.byManager(id)
    subs.set(manager.id, manager)

    return subs
  }

  static async bySubordinate(id) {
    return this.get(this.q().where(
      'e.id', '=', this.getQuery().select('manager_id').from('employee').where({ id })
    ))
  }

  static byDepartment(id) {
    return this.get(this.q().where({ 'd.id': id }))
  }

  async teamSize() {
    const subs = await Subordinate.byManager(this.id)
    return subs.length
  }
}

Employee.Subordinate = Subordinate
Employee.Manager = Manager