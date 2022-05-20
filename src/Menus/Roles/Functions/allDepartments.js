import { Department } from '../../../Models'

export default async function() {
  try {
    return Department.all()
  } catch(error) {
    return Promise.reject(error)
  }
}