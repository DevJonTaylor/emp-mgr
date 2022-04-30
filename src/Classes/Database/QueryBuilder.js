import knex from 'knex'

export function getQuery() {
  return knex({client: 'mysql'})
}

export function getRaw(query) {
  return getQuery().raw(query)
}

export function concatRaw(...columnNames) {
  const columns = columnNames
    .map(columnName => columnName.split('.').map(name => /\s/g.test(name) ? name : `\`${name}\``).join('.')).join(', ')
  return getQuery().raw(`CONCAT(${columns})`)
}