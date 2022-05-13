import { Department } from '../../../Models'
import confirm from '../../../Requests/confirm'

export default async function({ id, name }) {
  try {
    const isDeleting = await confirm(`Are you sure you want to delete ${name} Department?`)
    if(!isDeleting) return false
    await Department.delete({ id })
    return true
  } catch(error) {
    return Promise.reject(error)
  }
}