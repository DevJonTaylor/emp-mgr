import QFactory from '../../lib/Questions/QFactory'

export default async function() {
  return QFactory.list('departmentMenu', 'What would you like to do with Employees:', list => {
    list.newChoices(['New Department', 'Edit Department', 'Delete Department', 'Main Menu', 'Exit'])
  }).answers
}