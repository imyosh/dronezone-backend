const Network = require('../models/Network')
const { User } = require('../models/User')
const crypto = require('crypto')

//getNetworkById
async function getNetworkExports(req, res) {
  let userId = req.userId
  let networkId = req.params.networkId
  try {
    const network = await Network.findById(networkId)
    if (network) {
      let exports = network.exports.filter(
        (item) => item.ownerId !== userId.toString()
      )
      res.send(exports)
    } else res.status(404).send({ message: 'Network not found' })
  } catch (error) {
    res.json(error)
  }
}

const generateSku = () => {
  var result = ''
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (var i = 0; i < 3; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return result + Math.floor(Math.random() * 10000)
}

async function addExportToNetwork(req, res) {
  let user_id = req.userId
  let network_id = req.params.network_id

  const exportItem = {
    ...req.body,
    ownerId: user_id.toString(),
    sku: generateSku(),
    _id: crypto.randomBytes(12).toString('hex'),
  }
  try {
    const network = await Network.findByIdAndUpdate(
      network_id,
      { $push: { exports: exportItem } },
      {
        new: true,
        runValidators: true,
      }
    )
    res.send(exportItem)
  } catch (error) {
    res.json(error)
  }
}

async function deleteExportFromNetwork(req, res) {
  let user_id = req.userId
  let network_id = req.params.network_id

  const exportItem = req.body
  try {
    const network = await Network.findByIdAndUpdate(
      network_id,
      { $pull: { exports: { _id: exportItem._id } } },
      {
        new: true,
        runValidators: true,
      }
    )
    res.send(exportItem)
  } catch (error) {
    console.log(error)
    res.status(404).send(error)
  }
}

async function updateExport(req, res) {
  let user_id = req.userId
  let network_id = req.params.network_id

  const exportItem = req.body
  console.log(exportItem)

  try {
    const network = await Network.updateOne(
      { _id: network_id, 'exports._id': exportItem._id },
      { $set: { 'exports.$': exportItem } }
    )
    res.send(exportItem)
  } catch (error) {
    console.log(error)
    res.status(404).send(error)
  }
}

//getNetworkById
async function getNetworkUsers(req, res) {
  let user_id = req.userId
  let networkId = req.params.networkId

  try {
    let user = await User.findById(user_id)

    if (!user.isAdmin) res.status(400)

    // in proeject.collaborators we have the id of the collaborators of the network so we need to get the details of the collaborators from the user model
    const network = await Network.findById(networkId)

    let users = []

    for (let i = 0; i < network.nodes.length; i++) {
      console.log(network.nodes[i].toString())
      console.log(user_id.toString())
      if (network.nodes[i].toString() !== user_id.toString()) {
        let user = await User.findById(network.nodes[i])
        if (user) users.push(user)
      }
    }

    if (network) res.send(users)
    else res.status(404).send({ message: 'Network not found' })
  } catch (error) {
    res.json(error)
  }
}

module.exports = {
  addExportToNetwork,
  deleteExportFromNetwork,
  getNetworkExports,
  updateExport,
  getNetworkUsers,
}
