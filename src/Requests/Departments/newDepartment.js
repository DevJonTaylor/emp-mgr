import { Department } from '../../Models'
import QF from '../../../lib/Questions/QFactory'
import confirm from '../confirm'

export default async function() {
  const { name } = await QF.input('name', 'Department Name:', input => input.validateEmpty).answers
  const confirming = await confirm(`Are you sure you want create a new Department: ${name}`)

  if(!confirming) return false

  return Department.create({ name })
}