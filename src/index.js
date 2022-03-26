import Setup from './controllers/Setup'
import AppView from './views/AppView'

Setup.run()
  .then(app => {
    Setup.config()
    return app.main()
  }).then(console.log)
  .catch(err => {
    if(process.exitCode) return
    AppView.error(err)
  })