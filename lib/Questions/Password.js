const Question = require('./Question')

module.exports = class Password extends Question {
  _type = 'password'
}