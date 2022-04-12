import QFactory from '../../lib/Questions/QFactory'

export default async function() {
  return QFactory.list('roleMenu', 'What would you like to do with Employees:', list => {
    list.newChoices(['New Roles', 'Edit Roles', 'Delete Roles', 'Main Menu', 'Exit'])
  }).answers
}