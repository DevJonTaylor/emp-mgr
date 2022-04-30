import { readFile } from 'fs/promises'
import gradient from 'gradient-string'

class Splash {
  static splash

  static async get() {
    if(!this.splash) {
      const data = await readFile(`${__rootdir}/lib/figlet/splash`)
      this.splash = gradient.atlas(data)
    }

    return this.splash
  }
}

export default Splash
