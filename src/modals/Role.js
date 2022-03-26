import Modal from './Modal'

/**
 * TODO:  Create a view to Sum Salary for positions
 * TODO:  Create a view to head count positions
 */

export default class Role extends Modal {
  static table = 'role'
  static keys = ['id', 'title', 'salary', 'department_id']
}