import Modal from './Modal'

export default class Employee extends Modal {
  static table = 'employee'
  static keys = ['id', 'first_name', 'last_name', 'role_id', 'manager_id']
}