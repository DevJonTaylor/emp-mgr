import gradient from 'gradient-string'

export default class AppView {
  static clear() {
    console.clear()
    return this
  }

  static log(str) {
    console.log(str)
    return this
  }

  static gradientMultiline(str, gradientName = 'atlas') {
    this.log(gradient[gradientName].multiline(str))
  }

  static error(err) {
    if(err instanceof Error) {
      console.error(err)
      throw err
    } else {
      console.log(`Error:  ${err}`)
    }
  }
}