const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

UserSchema.pre('save', (next) => {
  let user = this
  console.log('user', this);

  //if (!user.isModified('password')) return next()

  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(user.password, salt)

  user.password = hash
  next()
})

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 to 99 characters']
  }
})



module.exports = mongoose.model('User', User)
