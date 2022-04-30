import {Department, Employee, Role} from "./models";
import {department, employee, role} from "../seeds.json";
import { readFile } from 'fs/promises'
import mysql from "mysql2";
readFile(`${__rootdir}/lib/sql/Schema.sql`, 'utf8')
  .then(sql => new Promise((resolve, reject) => {
  try {
    mysql.createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      multipleStatements: true
    }).query(sql, (err => {
      console.log('Database Setup!')
      return !err ? resolve() : reject(err)
    }))
  } catch(err) {
    return reject(err)
  }
}))
  .then(() => Department.create(department))
  .then(() => Role.create(role))
  .then(() => Employee.create(employee))
  .then(() => console.log('Seeds inserted'))
  .then(() => process.exit(1))
  .catch(console.error)