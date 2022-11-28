const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const NetworkController = require('../controllers/Network')
const validator = require('./validators/Networkvalidator')

router.get(
  '/getExports/:networkId',
  auth.verifyToken,
  // validator.verifyNetworkAccess,
  NetworkController.getNetworkExports
)

router.get(
  '/getNetworkUsers/:networkId',
  auth.verifyToken,
  // validator.verifyNetworkAccess,
  NetworkController.getNetworkUsers
)

router.post(
  '/addExport/:network_id',
  auth.verifyToken,
  // validator.verifyNetworkAccess,
  NetworkController.addExportToNetwork
)

router.post(
  '/deleteExport/:network_id',
  auth.verifyToken,
  // validator.verifyNetworkAccess,
  NetworkController.deleteExportFromNetwork
)

router.post(
  '/updateExport/:network_id',
  auth.verifyToken,
  // validator.verifyNetworkAccess,
  NetworkController.updateExport
)

module.exports = router
