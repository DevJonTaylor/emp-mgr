import Modal from './Modal'

export default class Department extends Modal {
  static table = 'department'
  static keys = ['id', 'name']
}