const express = require('express')
const mongooes = require('mongoose')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const ip = require('ip')
const fileUpload = require('express-fileupload')

dotenv.config()

const port = process.env.PORT || 8868
app.use(fileUpload())
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50' }))

app.use(function (req, res, next) {
  //Enabling CORS
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization'
  )
  next()
})

// mongodb+srv://adit:adit@cluster0.azqba7k.mongodb.net/?retryWrites=true&w=majority

let remoteCluster =
  'mongodb+srv://imyosh:yosh5511451@cluster0.yfnnvmx.mongodb.net/?retryWrites=true&w=majority'

let localCluster = 'mongodb://localhost:27017/dronezone'
// Connect to MongoDB
mongooes
  .connect(remoteCluster, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB live')
  })
  .catch((err) => {
    console.log(err)
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`)
    })
  })

//test connection
app.get('/', (req, res) => {
  //all routes info here
  res.send({ message: 'All Good !' })
})

app.use('/api/users', require('./routes/User'))
app.use('/api/networks', require('./routes/Network'))
