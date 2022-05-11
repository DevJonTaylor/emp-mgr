import { Role } from '../../Models'
import QF from '../../../lib/Questions/QFactory'
import newRole from './newRole'
export default async function(department) {
  try {
    let roles
    if(!department) {
      roles = await Role.all()
    } else {
      roles = await Role.Joins.byDepartment(department.id)
      if(!roles) return newRole(department)
    }

    const { answer } = await QF.list('answer', 'Select a Role', list => {
      if(!Role.isCollection(roles))
        list.newChoice(roles.title, choice => choice.value(roles.id))

      else
        roles.forEach(role => list.newChoice(`${role.title} | $${role.salary}`, choice => choice.value(role.id)))

      list.newChoices(['Create Role', 'Cancel'])
    }).answers

    switch(answer) {
      case 'newRole':
        return newRole()
      case 'cancel':
        return false
      default:
        return Role.isCollection(roles) ? roles.get(parseInt(answer)) : roles
    }
  } catch(err) {
    console.error(err)
    process.exit(1)
  }
}