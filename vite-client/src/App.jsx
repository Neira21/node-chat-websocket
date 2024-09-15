import './App.css'
import io from 'socket.io-client'
import { useState, useEffect, useRef } from 'react'

const socket = io('http://localhost:4000')

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      body: "Hello",
      from: "Server"
    },
    {
      body: "How are you?",
      from: "Server"
    },
    {
      body: "I'm fine",
      from: "Me"
    },
  ])

  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = (e) => {
    e.preventDefault()
    socket.emit('chat message', message);
    if(message === '') return
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessages([...messages, newMessage])
    setMessage('')
    
  }

  useEffect(()=>{
    const receiveMessage = (msg) => {
      setMessages([...messages, msg])
    }
    socket.on('chat message', receiveMessage)
  },[messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className= "App">
      <h1 className='text-red-400'>Chat Vite React + Node</h1>
      <form action="" onSubmit={sendMessage} className='flex flex-col justify-center items-center m-2 p-2'>
        <div className='w-10/12 flex justify-center gap-5 mb-10'>
          <input 
            className='w-5/6 px-2 border-2 border-blue-400'
            type="text" 
            placeholder="Enter your message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
          />
          <button className='w-40 bg-blue-400 pointer select-none'>Enter Chat</button>
        </div>
        {/* scroll y */}
        <div className='w-full h-[50vh] overflow-y-scroll '>
          {messages.map((msg, i) => (
          <div key={i} className={`text-md pb-2 font-thin m-1 ${msg.from === 'Me' ? 'text-blue-400 border-b-2 border-b-blue-400 text-right' : 'text-red-400 border-b-2 border-b-red-400 text-left'}`} >
            <p>{msg.from}: {msg.body}</p>
          </div>
          ))}
          <div ref={messagesEndRef} /> {/* Referencia al final de los mensajes */}
        </div>
      </form>
    </div>
  )
}

export default App
