const validator = require('validator')
const { User } = require('../../models/User')
const Request = require('../../models/Request')

async function register(req, res, next) {
  try {
    // email firstName lastName artistName password are required
    const userData = req.body
    console.log(userData)
    // check if all fields are filled

    if (!userData.email || !userData.facilityName || !userData.password) {
      return res.status(400).send({
        message: 'Please fill all fields',
        fields: ['email', 'facilityName', 'password'],
      })
    }

    if (!userData.isAdmin && !userData.networkId) {
      return res.status(400).send({
        message: 'Please fill all fields',
        fields: ['networkId'],
      })
    }

    // check if email is valid
    if (!validator.isEmail(userData.email)) {
      return res.status(400).send({ message: 'Invalid email' })
    }
    // check if password is valid
    if (!validator.isLength(userData.password, { min: 6 })) {
      return res
        .status(400)
        .send({ message: 'Password must be at least 6 characters' })
    }
    //check if email is already in use
    const user = await User.findOne({ email: userData.email })
    if (user) {
      return res.status(400).send({ message: 'Email already in use' })
    }

    next()
  } catch (error) {
    res.json(error)
  }
}

async function login(req, res, next) {
  try {
    // email and password are required
    const userData = req.body
    // check if all fields are filled
    if (!userData.email || !userData.password) {
      return res.status(400).send({
        message: 'Please fill all fields',
        fields: ['email', 'password'],
      })
    }

    next()
  } catch (error) {
    res.json(error)
  }
}

// requestExport
async function requestExport(req, res, next) {
  try {
    // sender_id and receiver_id, project_id are required
    let userId = req.userId
    req.body.receiver_id = userId
    const userData = req.body
    // check if all fields are filled

    console.log('sender_id', userData.sender_id)
    console.log('receiver_id', userData.receiver_id)

    if (
      !userData.sender_id ||
      !userData.export_id ||
      !userData.senderData ||
      !userData.receiverData
    ) {
      return res.status(400).send({
        message: 'Please fill all fields',
        fields: ['sender_id', 'export_id', 'senderData', 'receiverData'],
      })
    }
    // check if sender_id is valid
    const sender = await User.findById(userData.sender_id)
    if (!sender) {
      return res.status(400).send({ message: 'Sender not found' })
    }
    // check if receiver_id is valid
    const receiver = await User.findById(userData.receiver_id)
    if (!receiver) {
      return res.status(400).send({ message: 'Receiver not found' })
    }
    // check if project_id is valid
    // const project = await Project.findById(userData.project_id)
    // if (!project) {
    //   return res.status(400).send({ message: 'Project not found' })
    // }
    next()
  } catch (error) {
    res.status(400).send(error)
  }
}

// acceptRequest
async function acceptRequest(req, res, next) {
  try {
    let userId = req.userId
    let user = await User.findById(userId)
    let request = await Request.findById(req.params.id)
    if (request) {
      if (request.receiver_email == user.email) {
        req.body.receiver_id = userId
        next()
      } else {
        return res.status(400).send({ message: 'You are not authorized' })
      }
    }
  } catch (error) {
    res.json(error)
  }
}

// rejectRequest
async function rejectRequest(req, res, next) {
  try {
    let userId = req.userId
    let user = await User.findById(userId)
    let request = await Request.findById(req.params.id)
    if (request) {
      if (request.receiver_email == user.email) {
        req.body.receiver_id = userId
        next()
      } else {
        return res.status(400).send({ message: 'You are not authorized' })
      }
    }
  } catch (error) {
    res.json(error)
  }
}

module.exports = {
  register,
  login,
  requestExport,
  acceptRequest,
  rejectRequest,
}
