import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import { useMessage } from './MessageContext'
import { useUser } from './UserContext'

const ChatContext = React.createContext()

export function useChat() {
  return useContext(ChatContext)
}

export const ChatProvider = ({ children }) => {
  const { getUser, loggedIn } = useUser()
  const [loading, setLoading] = useState(false)
  const [conversation, setConversation] = useState()
  const [chatList, setChatList] = useState([])
  const [newChat, setNewChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [showChat, setShowChat] = useState(false)
  const [productDetail, setProductDetail] = useState(false)

  const { setMessage, setVariant } = useMessage()

  useEffect(() => {
    getMessages()
  }, [conversation])

  const getChatList = async () => {
    setMessage('')
    if (loggedIn !== true) {
      setMessage('Du musst angemeldet sein, um deine Nachrichten anzuschauen.')
      setVariant('info')
    }
    let config = {
      method: 'get',
      url: `http://localhost:4000/user`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
    }
    return axios(config)
      .then((response) => {
        setChatList(response.data.result.chats)
        return response.data.result.chats
      })
      .catch((e) => {
        console.error('Fehler')
        setMessages(e.response.data.message)
        setVariant('danger')
        setShowChat(false)
      })
  }

  const getMessages = async () => {
    setMessage('')
    if (loggedIn === false) {
      setMessage('Du musst angemeldet sein, um deine Nachrichten anzuschauen.')
      setVariant('info')
    }
    if (!conversation || conversation === 'newConversation') {
      return setMessages([])
    }

    let config = {
      method: 'get',
      url: `http://localhost:4000/chat/${conversation}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
    }
    axios(config)
      .then((response) => {
        setMessages(response.data.result)
      })
      .catch((e) => {
        setMessage(e.response.data.message)
        setVariant('danger')
        setShowChat(false)
      })
  }

  const createChat = async (productDetail, message) => {
    setMessage('')
    setNewChat(false)
    const chatData = {
      offer: productDetail._id,
      message: message,
    }
    let config = {
      method: 'post',
      url: 'http://localhost:4000/chat',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
      data: JSON.stringify(chatData),
    }
    await axios(config)
      .then((response) => {
        setConversation(response.data.chatResult._id)
      })
      .catch((e) => {
        setMessage(e.response.data.message)
        setVariant('danger')
        setShowChat(false)
      })
  }

  const checkForExistingChat = async (productDetail) => {
    const tmpChats = await getChatList()

    const index = tmpChats.findIndex((elem) => {
      return elem.offer._id === productDetail._id
    })

    if (index < 0) {
      setNewChat(true)
      setConversation('newConversation')
    } else {
      setConversation(tmpChats[index]._id)
    }
  }

  const sendMessage = async (message) => {
    setMessage('')
    const chatData = {
      chatId: conversation,
      message: message,
    }

    const config = {
      method: 'post',
      url: 'http://localhost:4000/chat/message',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getUser().token}`,
      },
      data: JSON.stringify(chatData),
    }

    return axios(config)
      .then((response) => {
        return response
      })
      .catch((e) => {
        setMessage(e.response.data.message)
        setVariant('danger')
      })
  }

  const value = {
    getChatList,
    getMessages,
    createChat,
    sendMessage,
    conversation,
    chatList,
    loading,
    newChat,
    setNewChat,
    messages,
    setConversation,
    checkForExistingChat,
    setShowChat,
    showChat,
    productDetail,
    setProductDetail,
  }

  return (
    <ChatContext.Provider value={value}>
      {!loading && children}
    </ChatContext.Provider>
  )
}
