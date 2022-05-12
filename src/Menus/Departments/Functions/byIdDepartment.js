import { Department } from '../../../Models'

export default async function(id) {
  try {
    return Department.byId(id)
  } catch(error) {
    return Promise.reject(error)
  }
}