require('dotenv/config')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
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
    await Task.deleteMany({})
    await Task.create({ todo: req.body.todo, done: req.body.done })
    res.json({ message: 'It works!' })
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
