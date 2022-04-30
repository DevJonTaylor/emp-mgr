import { Employee } from './models'
global.ECHO_SQL = true
Employee.Manager.byDepartment( 2)
  .then(col => col.toObject())
  .then(console.log)
  .then(() => process.exit(1))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
