import { File } from '../Model/File'

export class Splash {
  static splash

  static async get() {
    if(!this.splash) this.splash = await File.read(`${__rootdir}/lib/figlet/splash`)

    return this.splash
  }
}
