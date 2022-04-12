import QF from '../../lib/Questions/QFactory'

export default async function mainMenu() {
  return await QF.list('mainMenu', 'Please select a subject:', list => list.newChoices([
    'Employees',
    'Roles',
    'Departments',
    'Exit'
  ])).answers
}