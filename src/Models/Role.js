import Model from '../Classes/Model/Model'
import ModelCollection from '../Classes/Model/ModelCollection'

class RoleCollection extends ModelCollection {}

export class Role extends Model {
  static table = 'role'
  static keys = ['id', 'title', 'salary', 'department_id']

  static getCollection() {
    return new RoleCollection()
  }

  static all() {
    return this.get(this.getQuery(true).select('*'))
  }

  static byName(name) {
    return this
      .get(this.getQuery(true)
        .select('*')
        .where('title', 'like', `%${name}%`)
      )
  }

  static byId(id) {
    return this.get(this.getQuery(true).select('*').where({id}))
  }

  static async totalSalary() {
    const results = await this.runQuery(this.getQuery()
      .sum({salary: 'r.salary'})
      .from({e:'employee'})
      .join({r: 'role'}, 'e.role_id', 'r.id')
    )

    return results[0].salary
  }

  static async create(values) {
    const results = await super.create(values)
    return this.byId(results.insertId)
  }

  static byDepartment(id) {
    return this.get(this.getQuery(true).select('*').where({ department_id: id }))
  }
}

export class RoleJoins extends Role {
  static keys = ['id', 'title', 'salary', 'department', 'total_salary']

  static create(values) {
    return super.create(values)
  }

  static q() {
    return this.getQuery()
      .select({
        id: 'r.id',
        title: 'r.title',
        salary: 'r.salary',
        department: 'd.name'
      })
      .sum({total_salary: 'r.salary'})
      .from({ r: 'role' })
      .join({ d: 'department' }, 'd.id', 'r.department_id')
      .join({ e: 'employee' }, 'e.role_id', 'r.id')
      .groupBy('r.id')
  }

  static all() {
    return this.get(this.q())
  }

  static byName(name) {
    return this.get(this.q().where('title', 'like', `%${name}%`))
  }

  static byId(id) {
    return this.get(this.q().where({ 'r.id': id }))
  }

  static byDepartment(id) {
    return this.get(this.q().where({ department_id: id }))
  }

  static totalSalary() {
    return super.totalSalary()
  }
}

Role.Joins = RoleJoins