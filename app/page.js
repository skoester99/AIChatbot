'use client'
import { Box, Button, Stack, TextField, Typography} from '@mui/material'
import { useState, useRef, useEffect } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm an AI support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;  // Don't send empty messages
    setIsLoading(true)

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    setMessage('')
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message, // Send the user's message as query
          sysMsg: 'You are a friendly Chatbot.' // System message or context
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let responseContent = '';

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        responseContent += decoder.decode(value, { stream: true })
      }

      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: responseContent },
      ])
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
  
    // Note

    setIsLoading(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (    
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor={'light'}
    >
      <Typography variant='h4' gutterBottom color='white'>
        AI Chat Support
      </Typography>

      <Stack
        direction={'column'}
        width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%' }} // Responsive width
        height={{ xs: '90%', sm: '90%', md: '80%', lg: '70%', xl: '70%' }} // Responsive height
        border="1px solid black"
        p={2}
        spacing={3}
        bgcolor={'white'}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'green'
                }
                color="white"
                padding={2}
                borderRadius={16}
                p={4}
                px={6}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />

        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            bgcolor={'red'}
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}  // Updated event handler
            disabled={isLoading}
          />
          <Button variant="contained" onClick={sendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
