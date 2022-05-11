import selectDepartment from '../Departments/selectDepartment'
import selectRole from '../Roles/selectRole'
import selectManager from './selectManager'
import QF from '../../../lib/Questions/QFactory'
import confirm from '../confirm'
import { Employee } from '../../Models'

export default async function() {
  try {
    const department = await selectDepartment()
    const role = await selectRole(department)
    const manager = await selectManager(department)
    const { firstName, lastName } = await QF
      .input('first_name', 'What is their first name: ', input => input.validateEmpty)
      .input('last_name', 'What is their last name: ', input => input.validateEmpty)
      .answers

    const presentNewEmp = [
      '',
      `Name: ${firstName} ${lastName}`,
      `Title: ${role.title}`,
      `Salary: ${role.salary}`,
      `Department: ${department.name}`,
      !manager ? '' : `Manager: ${manager.name}`
    ]

    const confirmed = await confirm(`You would like to create this new employee?  ${presentNewEmp.join('\n')}`)

    if(!confirmed) return false
    return Employee.create({
      first_name: firstName,
      last_name: lastName,
      role_id: role.id,
      manager_id: !manager ? null : manager.id
    })
  } catch(err) {
    console.error(err)
    process.exit(1)
  }
}