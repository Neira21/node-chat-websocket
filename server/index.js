import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import { Server as SocketServer } from 'socket.io'
import { createServer } from 'node:http'
import { PORT } from './config.js'

const port = PORT ?? 3000

// Se crea el servidor http y se pasa la app de express según la documentación de socket.io, no se puede pasar directamente el puerto porque socket.io no lo soporta directamente en el constructor del servidor de socket http  https://socket.io/docs/v4/server-initialization/
const app = express()
const server = createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: '*'
  }
})

//app.use(express.static('client'))
app.use(cors())
app.use(logger('dev'))

io.on('connection', (socket) =>{
  socket.on('chat message', (msg)=>{
    socket.broadcast.emit('chat message', {
      body: msg,
      from: socket.id
    })
  })
  
  socket.on('disconnect', ()=>{
    console.log('an user has disconnected')
  })
})

// app.get('/', (req, res) => {
//   res.sendFile(process.cwd() + '/client/index.html')
// })

app.get('/', (req, res) => {
  res.send('Aplicación de Chat')
})

server.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
})

