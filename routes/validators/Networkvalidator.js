const Network = require('../../models/Network')
const { User } = require('../../models/User')

//verify network access
async function verifyNetworkAccess(req, res, next) {
  const id = req.params.id
  try {
    const network = await Network.findById(id)
    if (network) {
      //   console.log(network.user_id.toString())
      console.log(network)

      next()
      //check if user is the owner of the network or collaborator
      //   if (network.user_id.toString() === req.userId.toString()) {
      //     next()
      //   } else if (network.collaborators.includes(req.userId)) {
      //     next()
      //   } else if (req.IsAdmin === true) {
      //     next()
      //   } else {
      //     res.status(403).send({ message: 'You are not authorized' })
      //   }
    } else {
      res.status(404).send({ message: 'Network not found' })
    }
  } catch (error) {
    res.json(error)
  }
}

module.exports = {
  verifyNetworkAccess,
}
