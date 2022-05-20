import QF from '../../../../lib/Questions/QFactory'
import { Department } from '../../../Models'
import confirm from '../../../Requests/confirm'

export default async function() {
  try {
    const { name } = await QF.input('name', 'Department Name').answers
    if(!name) return false

    const isCreating = confirm(`You want to create a new Department named ${name}`)
    if(!isCreating) return false
    return Department.create(name)
  } catch(error) {
    return Promise.reject(error)
  }
}