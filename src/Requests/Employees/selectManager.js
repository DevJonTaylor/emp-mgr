import { Manager } from '../../Models'
import QF from '../../../lib/Questions/QFactory'

function listText(manager) {
  return `Name: ${manager.name} | Title: ${manager.title} | Employees: ${manager.employees}`
}

async function prepareManagersList(managers) {
  const { manager } = await QF.list('manager', 'Select a Manager:  ', list => {
    managers.forEach(mgr => {
      list.newChoice(listText(mgr), choice => choice.value(mgr.id))
    })

    list.newChoice('Cancel')
  }).answers

  return manager === 'cancel' ? false : managers.get(parseInt(manager))
}

async function prepareManagerList(manager) {

  const { answer } = await QF.list('answer', 'Select a Manager:', list => {
    list.newChoice(listText(manager), choice => choice.value(manager.id))
    list.newChoice('Cancel')
  }).answers

  return answer === 'cancel' ? false : manager
}

function noManagers() {
  console.log('Currently there are not any available managers.')
  return false
}

async function noDepartment() {
  const managers = await Manager.all()
  return !managers ? noManagers() : finalizeList(managers)
}

async function isDepartment(department) {
  const managers = await Manager.byDepartment(department.id)
  return !managers ? noDepartment() : finalizeList(managers)
}

function finalizeList(managers) {
  return !Manager.isCollection(managers)
    ? prepareManagerList(managers)
    : prepareManagersList(managers)
}

export default function(department) {
  return !department ? noDepartment() : isDepartment(department)
}