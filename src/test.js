import MainMenu from "./Classes/Items/MainMenu";
import { getTable } from 'console.table'

new MainMenu()
  .execute()
  .display()
  .then(emp => emp.execute().display())
  .then(async emp => {
    const employees = await emp.execute()
    const arr = []
    employees.map(e => arr.push(e.toObject()))
    console.table(arr)
  })
  .catch(console.error)
