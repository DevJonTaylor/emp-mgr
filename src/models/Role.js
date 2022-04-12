import Modal from './Modal'
import DB from './Database'

export default class Role extends Modal {
  static table = 'role'
  static keys = ['id', 'title', 'salary', 'department_id']

  static getQuery() {
    return DB.getQuery()
      .sum({total: 'r.salary'})
      .from({e: 'employee'})
      .join({r: 'role'}, 'e.role_id', 'r.id')
  }

  static byName(name) {
    return DB.query(DB.getQuery()
      .select({
        id: 'r.id',
        title: 'r.title',
        salary: 'r.salary',
        department: 'd.name'
      })
      .from({ r: 'role' })
      .join({ d: 'department' }, 'r.department_id', 'd.id')
      .where('r.title', 'like', `%${name}%`)
    )
  }

  static totalSalaryById(id, isDepartmentId = false) {
    return !id
      ? DB.query(this.getQuery().toSQL()).then(total => total[0].total)
      : !isDepartmentId
        ? DB.query(this.getQuery().where('r.id', id).toSQL()).then(total => total[0].total)
        : DB.query(this.getQuery().where('r.department_id', id).toSQL()).then(total => total[0].total)
  }
}