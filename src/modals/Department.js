import Modal from './Modal'

/**
 * TODO:  Create a view for position counts per department
 * TODO:  Create a view to head count departments
 * TODO:  Create a view to head count company
 * TODO:  Create a view to head count managers in department
 * TODO:  Create a view to head count subordinates in department
 * TODO:  Create a view to head count managers in company
 * TODO:  Create a view to head count subordinates in company
 * TODO:  Create a view to list department employees
 * TODO:  Create a view to list department managers
 * TODO:  Create a view to list department subordinates
 * TODO:  Create a view to list company employees
 * TODO:  Create a view to list company managers
 * TODO:  create a view to list company subordinates
 */

export default class Department extends Modal {
  static table = 'department'
  static keys = ['id', 'name']
}