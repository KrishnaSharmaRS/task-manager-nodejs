const express = require('express')

require('./src/database/mongoose')
const userRouter = require('./src/routers/user')
const taskRouter = require('./src/routers/task')

const server = express()
const port = process.env.PORT

server.use(express.json())
server.use(userRouter)
server.use(taskRouter)

server.listen(port, () => {
    console.log("Server is Running on PORT: " + port)
})