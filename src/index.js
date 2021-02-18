require('dotenv/config')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')
const Task = require('./task')

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const MICROSERVICE_URL = process.env.MICROSERVICE_URL

const app = express()

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true },
  err => !err ? console.log('database connected --------<') : console.log(err))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
  return res.send('Hello World!')
})

app.post('/tasks', async (req, res) => {
  try {
    const todoArray = []
    const doneArray = []

    for (const task of req.body.todo) {
      const response = await axios.get(encodeURI(MICROSERVICE_URL + task))
      todoArray.push([task.split('_')[0], response.data.data.slice(0, 5)].join('_'))
    }

    for (const task of req.body.done) {
      const response = await axios.get(encodeURI(MICROSERVICE_URL + task))
      doneArray.push([task.split('_')[0], response.data.data.slice(0, 5)].join('_'))
    }

    await Task.deleteMany({})
    await Task.create({ todo: todoArray, done: doneArray })

    return res.json({ todoArray, doneArray })
  } catch (error) {
    console.log(error);
    return res.status(500).end()
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().select('todo done')
    return res.json({ message: 'It works!', data: tasks[0] || { todo: [], done: [] } })
  } catch (error) {
    console.log(error);
    return res.status(500).end()
  }
})

app.listen(PORT, () => {
  console.log(`Todo app listening at ${PORT}`)
})
