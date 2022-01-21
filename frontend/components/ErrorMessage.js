import React, { useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useMessage } from '../contexts/MessageContext'

const ErrorMessage = () => {
  const { message, variant } = useMessage()
  useEffect(() => {
    console.log(message)
  }, [message, variant])
  return (
    <Alert variant={variant} className='mt-3'>
      {message}
    </Alert>
  )
}

export default ErrorMessage
