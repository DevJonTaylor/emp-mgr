import Modal from './Modal'
import DB from './Database'
/**
 * TODO:  Create a view to Sum Salary for positions
 */

export default class Role extends Modal {
  static table = 'role'
  static keys = ['id', 'title', 'salary', 'department_id']

  static getQuery() {
    return DB.getQuery()
      .sum({total: 'r.salary'})
      .from({e: 'employee'})
      .join({r: 'role'}, 'e.role_id', 'r.id')
  }

  static totalSalaryById(id) {
    return !id
      ? DB.query(this.getQuery().toSQL()).then(total => total[0].total)
      : DB.query(this.getQuery().where('r.id', id).toSQL()).then(total => total[0].total)
  }
}