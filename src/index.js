import Setup from './controllers/Setup'
import AppView from './views/AppView'
import { Department, Role, Employee, Manager, Subordinate } from './modals'
Setup.run()
  .then(app => {
    Setup.config()
    return Setup.checkArguments()
      .then(() => Manager.getTeamByManagerId(31))
  })
  .then(mgr => AppView.log(mgr))
  .then(() => process.exit(1))
  .catch(err => {
    if(process.exitCode) return
    AppView.error(err)
  })