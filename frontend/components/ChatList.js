import React, { useEffect } from 'react'
import { useChat } from '../contexts/ChatContext'
import { Badge, ListGroup, Offcanvas } from 'react-bootstrap'
import { useUser } from '../contexts/UserContext'

const ChatList = () => {
  const { chatList, getChatList, setConversation } = useChat()
  const { getUser } = useUser()
  useEffect(async () => {
    await getChatList()
  }, [])

  const handleSetConversation = (chatId) => {
    setConversation(chatId)
  }

  // const newMessage = (chat) => {
  //   if(chat.sender.username === getUser().userId){
  //     if(chat.)
  //   }
  // }
  return (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <b>Meine Unterhaltungen</b>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <div className='ChatList'>
        {/* <h5 className='text-center my-4'>
        <b>Meine Unterhaltungen</b>
      </h5> */}
        <hr className='mt-0' />
        <ListGroup variant='flush'>
          {chatList.map((chat, index) => (
            <ListGroup.Item
              key={index}
              className='pointer d-flex justify-content-between py-2 align-items-center item'
              onClick={() => handleSetConversation(chat._id)}
            >
              <div className='d-flex flex-column'>
                <p className={`m-0 font-weight-bold`}>
                  <b>{chat.offer.title}</b>
                  {/* {chat.offer.title} */}
                </p>
                <small>
                  {chat.reciever._id === getUser().userId
                    ? chat.sender.username
                    : chat.reciever.username}{' '}
                </small>
              </div>
              <Badge variant='primary' pill>
                1
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  )
}

export default ChatList
