import QFactory from '../../lib/Questions/QFactory'

export default async function() {
  return QFactory.list('employeeMenu', 'What would you like to do with Employees:', list => {
    list.newChoices(['New Employee', 'Edit Employee', 'Delete Employee', 'Main Menu', 'Exit'])
  }).answers
}