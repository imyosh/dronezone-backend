const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  register,
  login,
  getUserExports,
  deleteUser,
  requestExport,
  getAllSentRequests,
  getAllReceivedRequests,
  updateRequstStatus,
} = require('../controllers/User')

const validator = require('./validators/Uservalidator')

router.post('/register', validator.register, register)

router.post('/login', validator.login, login)

router.get('/getExports/:networkId', auth.verifyToken, getUserExports)

router.delete('/delete/:networkId/:userId', auth.verifyToken, deleteUser)

router.post(
  '/requestExport/:networkId',
  auth.verifyToken,
  validator.requestExport,
  requestExport
)

router.get(
  '/getAllSentRequests/:network_id',
  auth.verifyToken,
  getAllSentRequests
)

router.get(
  '/getAllReceivedRequests/:network_id',
  auth.verifyToken,
  getAllReceivedRequests
)

router.post('/updateRequstStatus', auth.verifyToken, updateRequstStatus)

module.exports = router
