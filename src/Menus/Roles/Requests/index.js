import { ViewAllRoles, ViewRole, newDepartment } from './ViewAllRoles'
import { allDepartments } from '../Functions'

function viewAll(self) {
  return [ 'View All', async () => {
    const departments = await allDepartments()
    return new ViewAllRoles(self, departments)
  } ]
}

export { ViewAllRoles, ViewRole, newDepartment, viewAll }