import BD from '../Classes/BaseDisplay'
import newEmployee from '../Requests/Employees/newEmployee'
import * as table from 'console.table'
/*
* View All
* Search By Name
* View by Role
* View By Department
 */
export default function(mainMenu) {
  const employeeObject = {
    name: 'Employees',
    message: 'Create, Edit, Update, or Delete an Employee',
    previous: mainMenu
  }
  const bd = new BD(employeeObject)
  bd
    .addMenu('New Employee', async current => {
      current.setup(`${current.breadcrumb()} > New Employee`)
        .then(() => newEmployee())
        .then(emp => {
          if(!emp) return current.render()
          current.setup(`${current.breadcrumb()} > Viewing ${emp.id}`)
          table(emp.toObject())

          // TODO:  View the new Employee
        })
    })
    .addMenu('View All', () => {

    })
    .addMenu('Search By Name', () => {})
    .addMenu('View Managers', () => {})
    .addMenu('View Subordinates', () => {})
    .addMenu('View By Role', () => {})
    .addMenu('View By Department', () => {})
    .render()
}