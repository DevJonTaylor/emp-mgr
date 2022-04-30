import QF from '../../lib/Questions/QFactory'

export default async function(msg) {
  const { confirm } = await QF.list('confirm', msg, list => list.newChoices(['Yes', 'No'])).answers

  return confirm === 'yes'
}