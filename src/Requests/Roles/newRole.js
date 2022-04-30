import QF from '../../../lib/Questions/QFactory'
import selectDepartment from '../Departments/selectDepartment'
import confirm from '../confirm'
import { Role } from '../../models'
export default async function(department) {
  if(!departmentId) department = selectDepartment()
  const { title, salary } = await QF.input('title', 'What is the Role Title:', input => input.validateEmpty)
    .input('salary', 'What is the Role Salary:', input => input.validate(value => {
      if(isNaN(value)) return 'Must be a number'
    })).answers

  const {
    confirming
  } = confirm(`You want to create a new Role ( Title: ${title} | Salary: ${salary} | Department: ${department.name}`)

  return !confirming ? false : Role.Joins.create({
    title,
    salary,
    department_id: department.id
  })
}