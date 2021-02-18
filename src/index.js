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

const app = express()

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true },
  err => !err ? console.log('database connected --------<') : console.log(err))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/tasks', async (req, res) => {
  try {
    const todoArray = []
    const doneArray = []

    for (const task of req.body.todo) {
      const response = await axios.get(encodeURI('http://localhost:3010/hash/' + task))
      todoArray.push([task.split('_')[0], response.data.data.slice(0, 5)].join('_'))
    }

    for (const task of req.body.done) {
      const response = await axios.get(encodeURI('http://localhost:3010/hash/' + task))
      doneArray.push([task.split('_')[0], response.data.data.slice(0, 5)].join('_'))
    }

    await Task.deleteMany({})
    await Task.create({ todo: todoArray, done: doneArray })

    res.json({ todoArray, doneArray })
  } catch (error) {
    console.log(error);
    res.json({ message: 'Something went wrong' })
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().select('todo done')
    res.json({ message: 'It works!', data: tasks[0] })
  } catch (error) {
    console.log(error);
    res.json({ message: 'Something went wrong' })
  }
})

app.listen(PORT, () => {
  console.log(`Todo app listening at ${PORT}`)
})
