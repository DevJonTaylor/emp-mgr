import Modal from './Modal'
import DB from './Database'

export class Employee extends Modal {
  static table = 'employee'
  static keys = ['id', 'first_name', 'last_name', 'role_id', 'manager_id']
}

export class Subordinate extends Modal {
  static table = 'employee'
  static keys = ['id', 'name', 'title', 'salary', 'department', 'manager']

  static getQueryVariables() {
    const query = DB.getQuery()

    const tables = {
      employee1: { e1: 'employee' },
      employee2: { e2: 'employee' },
      role: { r: 'role' },
      department: { d: 'department' }
    }

    const columns = {
      distinct: { id: 'e1.id' },
      select: {
        name: query.raw('CONCAT(`e1`.`first_name`, \' \', `e1`.`last_name`)'),
        title: 'r.title',
        salary: 'r.salary',
        department: 'd.name',
        manager: query.raw('CONCAT(`e2`.`first_name`, \' \', `e2`.`last_name`)')
      }
    }

    const joins = {
      department: [tables.department, 'r.department_id', 'd.id'],
      role: [tables.role, 'e1.role_id', 'r.id'],
      subEmployee: [tables.employee2, 'e1.manager_id', 'e2.id'],
      mgrEmployee: [tables.employee2, 'e1.id', 'e2.manager_id']
    }

    return { query, tables, columns, joins }
  }

  static getQuery() {
    const { query, tables, columns, joins } = this.getQueryVariables()

    return query
      .distinct(columns.distinct)
      .select(columns.select)
      .from(tables.employee1)
      .leftJoin(...joins.role)
      .rightJoin(...joins.department)
      .innerJoin(...joins.subEmployee)
      .whereNotIn('e1.id', query
        .distinct(columns.distinct)
        .from(tables.employee1)
        .innerJoin(...joins.mgrEmployee))
  }

  static byManagerId(id) {
    return this.runQuery(this.getQuery().andWhere('e2.id', id))
  }

  static all() {
    return this.runQuery(this.getQuery())
  }
}

export class Manager extends Modal {
  static table = 'employee'
  static keys = ['id', 'name', 'title', 'salary', 'department']

  static async getTeamByManagerId(id) {
    const result = await this.runQuery(this.getQuery().where('e1.id', id))
    if(!result.length) return null
    const mgr = result[0]
    await mgr.getSubordinates()

    return mgr

  }

  static byRoleId(id) {
    return this.runQuery(this.getQuery().where('r.id', id))
  }

  static byDepartmentId(id) {
    return this.runQuery(this.getQuery().where('d.id', id))
  }

  static getQuery() {
    const query = DB.getQuery()
    return query
      .distinct({id: 'e1.id'})
      .select({
        name: query.raw('CONCAT(`e1`.`first_name`, \' \', `e1`.`last_name`)'),
        title: 'r.title',
        salary: 'r.salary',
        department: 'd.name'
    })
      .from({e1: this.table})
      .leftJoin({r: 'role'}, 'e1.role_id', 'r.id')
      .rightJoin({d: 'department'}, 'r.department_id', 'd.id')
      .innerJoin({e2: 'employee'}, 'e1.id', 'e2.manager_id')
  }

  static all() {
    return DB.query(this.getQuery().orderBy('d.id', 'asc').toSQL())
      .then(this.mapResults)
  }

  get subordinates() {
    if(!this.columns.subordinates) return []
    return this.columns.subordinates
  }

  set subordinates(newValue) {
    this.columns.subordinates = newValue
  }

  async getSubordinates() {
    this.subordinates = await Subordinate.byManagerId(this.id)

    return this
  }

  toObject() {
    const mgr = {...this.columns}
    if(mgr.subordinates.length) mgr.subordinates = mgr.subordinates.map(sub => sub.toObject())
    return mgr
  }
}