import React, { useContext, useState } from 'react'

const MessageContext = React.createContext()

export function useMessage() {
  return useContext(MessageContext)
}

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState('')
  const [variant, setVariant] = useState('')

  const value = {
    setVariant,
    setMessage,
    variant,
    message,
  }

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
