import Item from './Item'

export default class Exit extends Item {
  execute() {
    console.log('Have a fantastic day!')
    process.exit(1)
  }
}