import { ViewAllDepartments, ViewDepartment, newDepartment } from './ViewAllDepartments'
import { allDepartments } from '../Functions'

function viewAll(self) {
  return [ 'View All', async () => {
    const departments = await allDepartments()
    new ViewAllDepartments(self, departments)
  } ]
}

export { ViewAllDepartments, ViewDepartment, newDepartment, viewAll }