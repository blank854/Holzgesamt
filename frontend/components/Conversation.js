import React, { useState, useEffect } from 'react'
import { Button, FloatingLabel, Form } from 'react-bootstrap'
import { useChat } from '../contexts/ChatContext'
import Message from './Message'

const Conversation = ({ productDetail }) => {
  const {
    setConversation,
    getMessages,
    newChat,
    setNewChat,
    createChat,
    sendMessage,
    messages,
  } = useChat()
  const [conversationInfo, setConversationInfo] = useState({})
  const [message, setMessage] = useState('')

  const handleSendMessage = async () => {
    if (newChat) {
      await createChat(productDetail, message)
    } else {
      await sendMessage(message)
    }

    setMessage('')
    getMessages()
  }
  const handleGoBack = () => {
    setConversation(false)
    setNewChat(false)
  }

  const handleCheckEnter = (e) => {
    if (e.which === 13 && !e.shiftKey) return handleSendMessage()
  }

  useEffect(() => {
    if (newChat) {
      setConversationInfo({ title: productDetail.title, user: 'TestUser' })
    } else {
      if (!messages.offer) return
      setConversationInfo({ title: messages.offer.title, user: 'TestUser' })
    }
  }, [productDetail, messages])

  return (
    <div style={{ height: '100vh' }} className='d-grid Conversation p-3'>
      <div className='top h-100'>
        {/* <h3 className='text-center mt-4'>{conversation.partner}</h3> */}
        {/* <h5 className='text-center mb-4'>{conversation.product}</h5> */}
        <div className='d-flex align-items-center'>
          <i
            className='fas fa-chevron-left me-5 pointer'
            onClick={handleGoBack}
          ></i>
          <p className='m-0'>
            <b>{conversationInfo.title}</b>
          </p>
        </div>
        <hr />
      </div>
      <div className='messageContainer d-flex flex-column w-100'>
        <div className='messages'>
          {messages.messages &&
            messages.messages.map((message, index) => (
              <Message message={message} key={index} />
            ))}
        </div>
      </div>
      <div className='d-flex flex-column w-100 mt-3'>
        <FloatingLabel controlId='floatingTextarea2' label='Deine Nachricht'>
          <Form.Control
            as='textarea'
            placeholder='Nachricht eingeben'
            style={{ height: '100px' }}
            name='message'
            onKeyUp={handleCheckEnter}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FloatingLabel>
        <Button
          variant='primary'
          id='sendMessage'
          onClick={handleSendMessage}
          className='mt-2 w-100'
        >
          Senden
        </Button>
      </div>
    </div>
  )
}

export default Conversation
