import Modal from './Modal'

export default class Role extends Modal {
  static table = 'role'
  static keys = ['id', 'title', 'salary', 'department_id']
}