const knex = require('knex')({client: 'mysql'})

const department = knex('department')
department
  .delete().where({id: 1})
console.log(department.toSQL().sql)
console.log(department.toSQL().bindings)