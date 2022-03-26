import Setup from './controllers/Setup'
import AppView from './views/AppView'

Setup.run()
  .then(() => {
    Setup.config()
  })
  .catch(err => {
    if(process.exitCode) return
    AppView.error(err)
  })