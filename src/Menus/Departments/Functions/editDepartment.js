import QF from '../../../../lib/Questions/QFactory'
import { Department } from '../../../Models'

export default async function(department) {
  try {
    const { id } = department.toObject()
    const { name } = await QF
      .input('name', 'New Department Name?', input => input.default(department.name))
      .answers

    if ( !name || name === department.name ) return department

    await Department.update({ name }, { id })
    return Department.byId(id)

  } catch(error) {
    return Promise.reject(error)
  }
}