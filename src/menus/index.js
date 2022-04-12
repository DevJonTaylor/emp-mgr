import splash from './splash'
import mainMenu from "./mainMenu";
import emp from "./employees";
import roles from "./roles";
import departments from "./departments";

async function init(...breadcrumb) {
  console.clear()
  console.log(await splash())
  console.log(breadcrumb.join(' > '))
}

export async function main() {
  await init('Main Menu')
  return mainMenu()
}

export async function employees() {
  await init('Main Menu', 'Employees')
  return emp()
}

export async function roleMenu() {
  await init('Main Menu', 'Roles')
  return roles()
}

export async function departmentMenu() {
  await init('Main Menu', 'Departments')
  return departments()
}
