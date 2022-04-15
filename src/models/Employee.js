import Modal from './Modal'
import DB from './Database'

export class Employee extends Modal {
  static table = 'employee'
  static keys = ['id', 'first_name', 'last_name', 'role_id', 'manager_id']

  static getQuery() {
    const query = DB.getQuery()
    const tables = {
      employee: { e: 'employee' },
      role: { r: 'role' },
      department: { d: 'department' }
    }
    const columns = {
      distinct: { id: 'e.id' },
      select: {
        name: query.raw('CONCAT(`e`.`first_name`, \' \', `e`.`last_name`)'),
        title: 'r.title',
        salary: 'r.salary',
        department: 'd.name'
      }
    }
    const joins = {
      department: [tables.department, 'r.department_id', 'd.id'],
      role: [tables.role, 'e.role_id', 'r.id']
    }

    return { query, tables, columns, joins }
  }

  static getMultipleQuery() {
    const { query, tables, columns, joins } = this.getQuery()

    return query(tables.employee)
      .distinct(columns.distinct)
      .select(columns.select)
      .join(...joins.role)
      .join(...joins.department)
  }

  static all() {
    return this.runQuery(this.getMultipleQuery(), true)
  }

  static async runQuery(query, switchKeys) {
    let results
    if(!switchKeys) {
      results = await super.runQuery(query)
    } else {
      const tempKeys = [...this.keys]
      this.keys = typeof(switchKeys) === 'boolean'
        ? ['id', 'name', 'title', 'salary', 'department']
        : switchKeys
      results = await super.runQuery(query)
      this.keys = [...tempKeys]
    }
    return results
  }

  static async getCount(query) {
    const results = await this.runQuery(query.count({count: 0}), ['count'])

    return results[0].columns.count
  }

  static async byName(name, page = 1, limit= 10) {
    const { columns } = this.getQuery()
    const query = this.getMultipleQuery()
      .where(columns.select.name, 'like', `%${name}%`)
    const total = await this.getCount(query.clone())

    if(!page) return this.runQuery(query, true)

    const pages = total / limit <= 1 ? 1 : total / limit
    let offset = page * limit

    query.offset(offset <= limit ? 0 : offset).limit(limit)
    const results = await this.runQuery(query, true)
    return {
      total,
      page,
      pages,
      results
    }
  }
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

  static byDepartmentId(id) {
    return this.runQuery(this.getQuery().where('d.id', id))
  }

  static byManagerId(id) {
    return this.runQuery(this.getQuery().andWhere('e2.id', id))
  }

  static byRoleId(id) {
    return this.runQuery(this.getQuery().where('r.id', id))
  }

  static all() {
    return this.runQuery(this.getQuery())
  }

  async getManager() {
    return Manager.bySubordinateId(this.id)
      .then(managers => managers[0])
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

  static bySubordinateId(id) {
    return this.runQuery(this.getQuery().where('e2.id', id))
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