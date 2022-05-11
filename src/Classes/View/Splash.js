import { readFile } from 'fs/promises'

class Splash {
  static splash

  static async get() {
    if(!this.splash) {
      this.splash = await readFile(`${__rootdir}/lib/figlet/splash`)
    }

    return this.splash
  }
}

export default Splash
