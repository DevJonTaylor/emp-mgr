import QF from '../../../lib/Questions/QFactory'
import { Department } from '../../Models'
import newDepartment from './newDepartment'
import Model from '../../Classes/Model/Model'

class Select {
  message = 'Select a Department:  '
  collection

  constructor(model) {
    if ( this.isCollection(model) ) this.collection = model
    else {
      this.collection = new Map()
      this.collection.set(model.id, model)
    }
  }


  isCollection(model) {
    return Model.isCollection(model)
  }

  handleList(list) {
    this.collection.forEach()
  }

  getAnswer() {
    QF.list('answer', message, this.handleList.bind(this))
  }
}

export default async function() {
  try {
    const allDepartments = await Department.all()
    const { answer } = await QF.list('answer', 'Select a Department:', list => {
      allDepartments.forEach(department =>
        list.newChoice(department.name, choice =>
          choice.value(department.id)
        ))
      list.newChoice('New Department')
      list.newChoice('Cancel')
    }).answers
    switch(answer) {
      case 'newDepartment':
        return newDepartment()
      case 'cancel':
        return false
      default:
        return allDepartments.get(parseInt(answer))
    }
  } catch(err) {
    return Promise.reject(err)
  }
}