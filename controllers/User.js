const { User } = require('../models/User')
const bcrypt = require('bcrypt')
const Network = require('../models/Network')
const Request = require('../models/Request')

//rgister user in the database and return the user
async function register(req, res) {
  // console.log(req.body)
  const userData = req.body

  try {
    let network
    let user

    if (userData.isAdmin) {
      user = await User.register(userData)
      console.log('user', user)

      console.log('creating network')

      network = await Network.create({
        nodes: [user._id],
        exports: [],
        admin_id: user._id,
      })

      const userWithNetwork = await User.findByIdAndUpdate(
        user._id,
        {
          $set: { networkId: network._id },
        },
        {
          new: true,
          runValidators: true,
        }
      )

      res.send(userWithNetwork)
    } else {
      console.log('add to network n')

      isNetwokExist = await Network.exists({ _id: userData.networkId })

      console.log('check network', isNetwokExist)

      if (isNetwokExist) {
        user = await User.register(userData)
        console.log('user', user)

        network = await Network.findByIdAndUpdate(
          userData.networkId,
          {
            $push: {
              nodes: user._id,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        )

        const userWithNetwork = await User.findByIdAndUpdate(
          user._id,
          {
            $set: { networkId: network._id },
          },
          {
            new: true,
            runValidators: true,
          }
        )

        res.send({ user: userWithNetwork, network })
      } else res.status(404).send({ message: 'Network does not exist' })
    }
  } catch (error) {
    console.log('catch error', error)
    res.status(400).send(error)
    ;``
  }
}
// login user and return the user use async/await
async function login(req, res) {
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization'
  )
  res.header('Access-Control-Allow-Origin', '*')

  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    console.log(user)
    if (user) {
      const token = await user.generateAuthToken()
      console.log(token)
      res.send({ user, token })
    } else {
      res.status(400).send({ message: 'Invalid email or password' })
    }
  } catch (error) {
    // res.json(error)
    console.log(error)
  }
}

async function getUserExports(req, res) {
  const userId = req.userId
  let networkId = req.params.networkId

  console.log('networkId', networkId)

  try {
    const network = await Network.findById(networkId)
    console.log('network', network)
    if (network) {
      console.log('networkexports', network.exports)

      let exports = network.exports.filter(
        (item) => item.ownerId.toString() === userId.toString()
      )

      console.log('exports', exports)
      res.send(exports)
    } else res.status(404).send({ message: 'Network not found' })
  } catch (error) {
    console.log(error)
    res.status(404).send(error)
  }
}

//deleteUser
async function deleteUser(req, res) {
  const user_id = req.userId
  const toDelete_id = req.params.userId
  const networkId = req.params.networkId

  try {
    const user = await User.findById(user_id)
    if (!user.isAdmin) res.status(400)

    const deletedUser = await User.findByIdAndDelete(toDelete_id)

    const network = await Network.findByIdAndUpdate(
      networkId,
      {
        $pull: { nodes: toDelete_id },
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (deletedUser) {
      res.json({ message: 'User deleted', deletedUser, network })
    } else {
      res.status(404).send({ message: 'User not found' })
    }
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

// requestExport
async function requestExport(req, res) {
  const id = req.userId
  const networkId = req.params.networkId

  console.log('requestExport')
  try {
    let userData = req.body

    //save request
    const request = await Request.create({ ...userData, receiver_id: id })
    let data = {}
    if (request) {
      data.request = request
      data.message = 'Request sent'
    }

    const network = await Network.updateOne(
      { _id: networkId, 'exports._id': userData.export_id },
      { $inc: { 'exports.$.quantity': -1 } }
    )

    res.send(data)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

//getAllSentRequests
async function getAllSentRequests(req, res) {
  const id = req.userId
  const network_id = req.params.network_id

  console.log('network_id', network_id)
  try {
    let sdata = []

    const requests = await Request.find({ receiver_id: id })
    const network = await Network.findById(network_id)

    requests.map((request) => {
      let exportItemData = network.exports.find(
        (item) => item._id === request.export_id
      )
      if (exportItemData) sdata.push({ ...request._doc, data: exportItemData })
    })

    if (sdata) {
      res.send(sdata)
    } else {
      res.status(404).send({ message: 'Requests not found' })
    }
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

//getAllReceivedRequests
async function getAllReceivedRequests(req, res) {
  const id = req.userId
  const network_id = req.params.network_id

  try {
    let sdata = []
    const requests = await Request.find({ sender_id: id })
    const network = await Network.findById(network_id)

    requests.map((request) => {
      let exportItemData = network.exports.find(
        (item) => item._id === request.export_id
      )
      if (exportItemData) sdata.push({ ...request._doc, data: exportItemData })
    })

    if (sdata) {
      res.send(sdata)
    } else {
      res.status(404).send({ message: 'Requests not found' })
    }
  } catch (error) {
    res.json(error)
  }
}

async function updateRequstStatus(req, res) {
  const id = req.userId
  const status = req.body.status
  const requestId = req.body.requestId
  const exportId = req.body.exportId
  const networkId = req.body.networkId
  console.log('requestId', requestId)

  try {
    const request = await Request.findByIdAndUpdate(
      requestId,
      {
        $set: { status },
      },
      {
        new: true,
      }
    )

    if (status === 'Canceled') {
      const network = await Network.updateOne(
        { _id: networkId, 'exports._id': exportId },
        { $inc: { 'exports.$.quantity': 1 } }
      )
    }

    if (request) {
      res.send(request)
    } else {
      res.status(404).send({ message: 'Requests not found' })
    }
  } catch (error) {
    res.json(error)
  }
}

module.exports = {
  register,
  login,
  getUserExports,
  deleteUser,
  requestExport,
  getAllSentRequests,
  getAllReceivedRequests,
  updateRequstStatus,
}
