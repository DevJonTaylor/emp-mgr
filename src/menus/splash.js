import { readFile } from 'fs/promises'
import gradient from 'gradient-string'

export default async function() {
  const splash = await readFile(`${__rootdir}/lib/figlet/splash`, 'utf8')
  return gradient.retro(splash)
}