import React from 'react'
import { Offcanvas } from 'react-bootstrap'
import { useChat } from '../contexts/ChatContext'
import ChatList from './ChatList'
import Conversation from './Conversation'

const Chat = () => {
  const {
    conversation,
    setConversation,
    showChat,
    setShowChat,
    productDetail,
  } = useChat()

  const handleShowChat = () => {
    setShowChat(true)
    setConversation(false)
  }

  return (
    <>
      <Offcanvas
        show={showChat}
        placement='end'
        onHide={() => setShowChat(false)}
      >
        {/* <CloseButton onClick={handleClose} /> */}
        {conversation ? (
          <Conversation productDetail={productDetail} />
        ) : (
          <ChatList />
        )}
      </Offcanvas>
      <div
        className='ChatIcon position-fixed bg-primary rounded-circle text-white d-flex justify-content-center text-align-center p-3 pointer'
        onClick={handleShowChat}
      >
        <i className='far fa-comments'></i>
      </div>
    </>
  )
}

export default Chat
