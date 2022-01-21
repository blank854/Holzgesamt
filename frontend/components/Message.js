import React, { useState, useEffect } from 'react'
import { useUser } from '../contexts/UserContext'

const Message = ({ message }) => {
  const [ownMessage, setOwnMessage] = useState(false)
  const [date, setDate] = useState('')

  const { getUser } = useUser()

  useEffect(() => {
    if (message.user === getUser().userId) {
      setOwnMessage(true)
    }
  }, [])

  useEffect(() => {
    const date = new Date(message.sent)
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    const year = date.getFullYear()
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

    const dateOutput = `${day}.${month}.${year} um ${hours}:${minutes}`
    setDate(dateOutput)
  }, [message])
  return (
    <div className='Message my-3 d-flex flex-column'>
      <div className={`d-flex ${ownMessage ? 'ownMessage' : 'foreignMessage'}`}>
        <div className='message-body p-2 rounded'>
          <span className='message-body-content'>{message.message}</span>
          <span className='d-block message-body-date'>{date}</span>
        </div>
      </div>
    </div>
  )
}

export default Message
