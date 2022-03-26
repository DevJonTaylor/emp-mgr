import Setup from './controllers/Setup'
import AppView from './views/AppView'
import { Department, Role, Employee } from './modals'
Setup.run()
  .then(app => {
    Setup.config()
    return Setup.checkArguments()
    //return app.main()
  })
  .catch(err => {
    if(process.exitCode) return
    AppView.error(err)
  })