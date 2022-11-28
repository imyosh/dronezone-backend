const mongooes = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schema = mongooes.Schema

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    facilityName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    networkId: {
      type: String,
      required: false,
    },

    stageLocation: {
      type: Object,
      required: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    Image: {
      type: String,
      default: 'https://i.imgur.com/1Q9ZQ9r.png',
    },
    ImageKey: {
      type: String,
      default: 'https://i.imgur.com/1Q9ZQ9r.png',
    },
  },
  {
    timestamps: true,
  }
)

//rgister user in the database and return the user
UserSchema.statics.register = async function (userData) {
  const User = mongooes.model('User')
  // hash the password
  const hash = await bcrypt.hashSync(userData.password, 10)
  userData.password = hash
  return User.create(userData)
}

// login user and return the user
UserSchema.statics.login = function (email, password) {
  console.log(email, password)
  const User = mongooes.model('User')
  return User.findOne({ email }).then((user) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      return user
    } else {
      return null
    }
  })
}

//generateAuthToken generate a token for the user
UserSchema.methods.generateAuthToken = function () {
  const user = this
  //use the user id and IsAdmin to generate a token
  const token = jwt.sign(
    { _id: user._id, IsAdmin: user.isAdmin },
    process.env.JWT_KEY
  )
  return token
}

//forgot password
UserSchema.statics.forgotPassword = function (email) {
  const User = mongooes.model('User')
  return User.findOne({ email }).then((user) => {
    if (user) {
      //generate new password
      const newPassword = req.body.newPassword
      //hash the password
      const hash = bcrypt.hashSync(newPassword, 10)
      //update the password
      user.password = hash
      return user.save()
    } else {
      return false
    }
  })
}

const User = mongooes.model('User', UserSchema)
module.exports = { User }
